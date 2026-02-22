import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Validate basic required fields
        if (
            !body.niche ||
            !body.language ||
            !body.voice ||
            !body.bgMusic ||
            !body.imageStyle ||
            !body.captionStyle ||
            !body.seriesDetails
        ) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Map the incoming payload to the Supabase SQL schema natively
        const { error } = await supabase.from("series").insert([
            {
                user_id: userId,
                series_name: body.seriesDetails.seriesName,
                video_duration: body.seriesDetails.duration,
                platforms: body.seriesDetails.platforms,
                schedule_time: body.seriesDetails.scheduleTime,
                niche: body.niche,
                language: body.language,
                voice: body.voice,
                bg_music: body.bgMusic,
                image_style: body.imageStyle,
                caption_style: body.captionStyle,
                status: 'active'
            }
        ]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            return NextResponse.json({ error: "Failed to save series data" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("API Route Error (POST):", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("series")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return NextResponse.json({ error: "Failed to fetch series data" }, { status: 500 });
        }

        return NextResponse.json({ series: data }, { status: 200 });
    } catch (error) {
        console.error("API Route Error (GET):", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
