import { inngest } from "./client";
import { createAdminClient } from "@/utils/supabase/admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import ImageKit from "imagekit";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");

        console.log("Hello, World! This is an Inngest background job running.");

        return { event, body: "Hello, World!" };
    }
);

export const generateVideo = inngest.createFunction(
    { id: "generate-video" },
    { event: "video/generate" },
    async ({ event, step }) => {
        const { seriesId } = event.data;

        // 0. Initialize a generating state in the database
        const videoId = await step.run("initialize-database-record", async () => {
            console.log(`[Step 0] Initializing 'generating' video record for Series ID: ${seriesId}`);
            const supabase = createAdminClient();

            const { data, error } = await supabase
                .from("videodata")
                .insert([{
                    series_id: seriesId,
                    status: 'generating'
                }])
                .select('id')
                .single();

            if (error || !data) {
                console.error("[Step 0] Failed to initialize videodata record:", error);
                throw new Error("Failed to initialize tracking record for video generation");
            }
            return data.id;
        });

        // 1. Fetch Series data from supabase
        const series = await step.run("fetch-series-data", async () => {
            const supabase = createAdminClient();
            const { data, error } = await supabase
                .from("series")
                .select("*")
                .eq("id", seriesId)
                .single();

            if (error || !data) {
                throw new Error(`Failed to fetch series data for ID: ${seriesId}`);
            }

            console.log(`[Step 1] Successfully fetched series data for: ${data.series_name}`);
            return data;
        });

        // 2. Generate Video Script using AI
        const scriptResult = await step.run("generate-video-script", async () => {
            console.log(`[Step 2] Generating Video Script using AI for series: ${series.series_name}`);

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const isLongVideo = series.video_duration && series.video_duration.includes("60");
            const sceneCount = isLongVideo ? "5-6" : "4-5";

            const isFonada = series.model_name === "fonadalab";
            const lengthConstraint = isFonada ? "- STRICT LIMIT: The final combined `script` text MUST be less than 420 characters total to fit within our TTS engine limits." : "";

            const prompt = `You are an expert short-form video script writer. 
Generate a cohesive video script based on the following details:
- Niche/Topic: ${series.niche}
- Title/Idea: ${series.series_name}
- Expected Duration: ${series.video_duration || "30-40 seconds"}
- Target Scene Count: ${sceneCount} scenes
- Visual Style for Image Generation: ${series.image_style || "realistic"}
- Target Language: ${series.language || "English"}
${lengthConstraint}

Requirements:
1. Provide a catchy \`title\` in ${series.language || "English"}.
2. Provide a single unified \`script\` paragraph that flows completely naturally, as it will be read aloud by a Text-to-Speech (TTS) engine. Do not include raw text instructions, speaker labels, or director notes in the script. This MUST be written in ${series.language || "English"}. Language codes or transliterations (e.g. Hindi written in English letters) are NOT allowed. Use the native script.
3. Provide an array of \`scenes\`. Each scene must contain an \`imagePrompt\` (highly detailed description of what the visual should look like to match the styling, WRITTEN IN ENGLISH so the image generator understands it) and the specific \`voiceoverText\` that corresponds to that visual snippet, WRITTEN IN ${series.language || "English"}.

You MUST return ONLY a valid JSON object matching this schema exactly, with no markdown code blocks or extra text:
{
  "title": "string",
  "script": "string",
  "scenes": [
    {
      "imagePrompt": "string",
      "voiceoverText": "string"
    }
  ]
}`;

            const result = await model.generateContent(prompt);
            let responseText = result.response.text();

            // Clean up markdown wrapping if the AI accidentally adds it
            responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

            try {
                const parsedScript = JSON.parse(responseText);
                return parsedScript;
            } catch (e) {
                console.error("Failed to parse Gemini response as JSON:", responseText);
                throw new Error("Failed to parse video script JSON from AI response.");
            }
        });

        // 3. Generate Voice using TTS model
        const voiceResult = await step.run("generate-voice-tts", async () => {
            console.log(`[Step 3] Generating Voice using TTS model: ${series.model_name}, Voice: ${series.voice}`);

            const scriptText = scriptResult.script;
            if (!scriptText) throw new Error("No script text provided from Step 2");

            let audioBuffer: ArrayBuffer;

            if (series.model_name === "deepgram") {
                const deepgramKey = process.env.DEEPGRAM_API_KEY;
                if (!deepgramKey) throw new Error("DEEPGRAM_API_KEY is missing from environment variables");

                const response = await fetch(`https://api.deepgram.com/v1/speak?model=${series.voice}&encoding=mp3`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Token ${deepgramKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: scriptText })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Deepgram API Error: ${response.status} - ${errText}`);
                }
                audioBuffer = await response.arrayBuffer();
                console.log("[Step 3] Successfully generated audio with Deepgram");
            }
            else if (series.model_name === "fonadalab") {
                const fonadaKey = process.env.FONADA_API_KEY;
                if (!fonadaKey) throw new Error("FONADA_API_KEY is missing from environment variables");

                // Backward compatibility map for early database records
                const fonadaVoiceMap: Record<string, string> = {
                    "vanee": "Vaanee",
                    "chitraa": "Chaitra",
                    "meghra": "Meghra",
                    "nirvani": "Swarini"
                };
                const finalVoice = fonadaVoiceMap[series.voice] || series.voice;

                // Assuming standard REST API payload structure based on Fonada documentation
                const response = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${fonadaKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        input: scriptText,
                        voice: finalVoice,
                        language: series.language || "English",
                        format: "mp3"
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Fonada API Error: ${response.status} - ${errText}`);
                }
                audioBuffer = await response.arrayBuffer();
                console.log("[Step 3] Successfully generated audio with Fonadalabs");
            } else {
                throw new Error(`Unsupported model_name: ${series.model_name}`);
            }

            // Upload the audio buffer to Supabase storage bucket 'voiceovers'
            const supabase = createAdminClient();
            const fileName = `${seriesId}_${Date.now()}.mp3`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("voiceovers")
                .upload(fileName, audioBuffer, {
                    contentType: "audio/mpeg",
                    upsert: false
                });

            if (uploadError) {
                console.error("Failed to upload audio to Supabase storage:", uploadError);
                throw new Error("Failed to upload generated audio to Supabase");
            }

            const { data: { publicUrl } } = supabase.storage
                .from("voiceovers")
                .getPublicUrl(fileName);

            console.log(`[Step 3] Successfully uploaded audio to Supabase: ${publicUrl}`);

            // Return only the public URL to avoid overloading Inngest payload limits
            return {
                format: "mp3",
                audioUrl: publicUrl
            };
        });

        // 4. Generate Caption using Deepgram
        const captionResult = await step.run("generate-captions", async () => {
            console.log(`[Step 4] Generating Captions using Deepgram API`);

            const deepgramKey = process.env.DEEPGRAM_API_KEY;
            if (!deepgramKey) throw new Error("DEEPGRAM_API_KEY is missing from environment variables");

            // We use the audio URL returned from Step 3 natively
            const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${deepgramKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: voiceResult.audioUrl })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Deepgram Caption API Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();

            // Extract the word-level timestamps directly from Deepgram's response
            const words = data?.results?.channels?.[0]?.alternatives?.[0]?.words || [];

            if (words.length === 0) {
                console.warn("[Step 4] No captions were generated from the audio.");
            }

            // Map it to a cleaner format
            const captions = words.map((w: any) => ({
                text: w.punctuated_word || w.word,
                start: w.start,
                end: w.end
            }));

            console.log(`[Step 4] Successfully generated ${captions.length} caption words`);

            return { captions };
        });

        // 5. Generate Images from image prompt via A4F (OpenAI unified API)
        const imagesResult = await step.run("generate-images", async () => {
            console.log(`[Step 5] Generating Images based on image style: ${series.image_style} using A4F API`);

            const a4fKey = process.env.A4F_API_KEY;
            if (!a4fKey) throw new Error("A4F_API_KEY is missing from environment variables");

            // Initialize the SDK client for A4F integration
            const openai = new OpenAI({
                apiKey: a4fKey,
                baseURL: "https://api.a4f.co/v1"
            });

            // Initialize ImageKit securely 
            const imagekit = new ImageKit({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
                urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
            });

            const supabase = createAdminClient();
            const imageUrls: { imageUrl: string; index: number }[] = [];

            // Loop through each scene and generate an image for its prompt
            for (const [index, scene] of scriptResult.scenes.entries()) {
                console.log(`[Step 5] Generating Image for scene ${index + 1}/${scriptResult.scenes.length}...`);

                const enhancedPrompt = `${scene.imagePrompt}, visual style: ${series.image_style || "realistic and cinematic"}`;

                try {
                    // Using the Imagen 3.5 model via A4F
                    const response = await openai.images.generate({
                        model: "provider-4/imagen-3.5",
                        prompt: enhancedPrompt,
                        n: 1,
                        response_format: "url",
                        size: "1024x1024"
                    });

                    if (response.data && response.data.length > 0 && response.data[0].url) {
                        const generatedUrl = response.data[0].url;
                        console.log(`[Step 5] Scene ${index + 1} Image generated by A4F FLUX: ${generatedUrl}. Downloading to buffer to upload to ImageKit...`);

                        // Download the ephemeral A4F Image into a raw buffer
                        const imageRes = await fetch(generatedUrl);
                        if (!imageRes.ok) throw new Error("Failed to download the generated image from A4F");
                        const arrayBuffer = await imageRes.arrayBuffer();
                        const base64Image = Buffer.from(arrayBuffer).toString('base64');

                        try {
                            const uploadResponse = await imagekit.upload({
                                file: base64Image,
                                fileName: `series-${series.id}-scene-${index}.png`,
                                folder: '/vidmaxx/generated/'
                            });

                            console.log(`[Step 5] Successfully uploaded to ImageKit: ${uploadResponse.url}`);
                            imageUrls.push({ imageUrl: uploadResponse.url, index: index });
                        } catch (uploadError) {
                            console.error(`[Step 5] Failed to upload to ImageKit:`, uploadError);
                            throw new Error("Failed to permanently store image in ImageKit");
                        }

                    } else {
                        throw new Error("No output returned from A4F API");
                    }
                } catch (error) {
                    console.error(`[Step 5] Failed generating/uploading image for Scene ${index + 1}:`, error);
                    throw new Error(`Failed to process image via A4F: ${(error as Error).message}`);
                }
            }

            return { imageUrls };
        });

        // 6. Save everything to database
        await step.run("save-generated-video", async () => {
            console.log(`[Step 6] Updating tracking record ${videoId} to 'completed' with final JSON payloads...`);

            const supabase = createAdminClient();

            const updatePayload = {
                script_title: scriptResult.title,
                script_text: scriptResult.script,
                audio_url: voiceResult.audioUrl,
                captions: captionResult.captions,
                images: imagesResult.imageUrls, // Storing the array of URLs as jsonb natively
                status: 'completed'
            };

            const { data, error } = await supabase
                .from("videodata")
                .update(updatePayload)
                .eq('id', videoId);

            if (error) {
                console.error(`[Step 6] Failed updating videodata record ${videoId}:`, error);
                throw new Error("Final Database Completion Save Failed");
            }

            if (error) {
                console.error("[Step 6] Failed saving to videodata table:", error);
                throw new Error("Final Database Save Failed");
            }

            return { success: true };
        });

        console.log("Video Generation Background Job Completed Successfully!");

        return { success: true, seriesId };
    }
);
