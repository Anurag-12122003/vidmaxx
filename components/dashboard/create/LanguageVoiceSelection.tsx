"use client";

import { useState, useRef, useEffect } from "react";
import { Language, DeepgramVoices, FonadalabVoices } from "@/utils/constants/voices";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Play, Square, Pause, User, Sparkles } from "lucide-react";

interface LanguageVoiceSelectionProps {
    languageValue: string | null;
    voiceValue: string | null;
    onChange: (data: { language: string; voice: string }) => void;
}

export function LanguageVoiceSelection({ languageValue, voiceValue, onChange }: LanguageVoiceSelectionProps) {
    // Default to 'en-US' or the current languageValue if it exists
    const [selectedLangCode, setSelectedLangCode] = useState<string>(
        languageValue || Language[0].modelLangCode
    );

    // We need to manage the currently playing audio
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Get current language details
    const currentLanguage = Language.find(l => l.modelLangCode === selectedLangCode) || Language[0];

    // Filter available voices based on the selected language's engine (deepgram or fonadalab)
    // Note: Currently the constant doesn't strictly associate voice to language, 
    // it usually fetches by modelName. Deepgram has English, others have Fonadalab mostly.
    // Assuming Deepgram voices are mostly English for now based on the constant snippet. 
    // Let's just switch arrays based on the modelName for simplicity, or show all applicable.
    const availableVoices = currentLanguage.modelName === "deepgram"
        ? DeepgramVoices
        : FonadalabVoices;

    useEffect(() => {
        // If language changes, don't automatically clear voice from formData 
        // to prevent jarring resets, but if they pick a new one it will fire.

        // Clean up audio on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleLanguageSelect = (val: string) => {
        setSelectedLangCode(val);
        // Clear voice choice locally if desired, but we can just require them to click a new voice.
        // It's usually good to automatically select the first voice of the new language, 
        // or just clear it. Let's let them explicitly select a new voice.
        onChange({ language: val, voice: "" });
    };

    const handleVoiceSelect = (voiceName: string) => {
        onChange({ language: selectedLangCode, voice: voiceName });
    };

    const handlePlayPreview = (e: React.MouseEvent, voicePreviewId: string) => {
        e.stopPropagation(); // Don't trigger card selection

        const previewUrl = `/voice/${voicePreviewId}`;

        // If currently playing the same preview, stop it
        if (playingPreview === voicePreviewId && audioRef.current) {
            audioRef.current.pause();
            setPlayingPreview(null);
            return;
        }

        // If playing something else, stop it first
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Play the new preview
        const newAudio = new Audio(previewUrl);
        audioRef.current = newAudio;
        setPlayingPreview(voicePreviewId);

        newAudio.play().catch(e => {
            console.error("Audio playback error (file might not exist yet):", e);
            // Simulate playing for 2 seconds visually if file doesn't exist just so user sees the UI working
            setTimeout(() => setPlayingPreview(null), 2000);
        });

        newAudio.onended = () => {
            setPlayingPreview(null);
        };
    };

    return (
        <div className="w-full flex flex-col h-full mt-2">

            {/* Top row: Language Selector & Information Box */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
                {/* Language Selector */}
                <div className="flex-1 max-w-sm">
                    <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Select Language
                    </label>
                    <Select value={selectedLangCode} onValueChange={handleLanguageSelect}>
                        <SelectTrigger className="w-48 text-md py-5 bg-background border-border shadow-sm rounded-xl">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {Language.map((lang, idx) => (
                                <SelectItem key={`${lang.modelLangCode}-${idx}`} value={lang.modelLangCode} className="py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl leading-none">{lang.countryFlag}</span>
                                        <span className="font-medium">{lang.language}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Info Card */}
                <div className="flex-1 border rounded-xl bg-card/50 p-4 border-primary/20 bg-primary/5 flex items-start gap-4 h-fit">
                    <span className="text-xl leading-none mt-1">{currentLanguage.countryFlag}</span>
                    <div>
                        <h4 className="font-semibold text-primary">{currentLanguage.language} selected</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-snug">
                            Using <span className="font-medium text-foreground">{currentLanguage.modelName}</span> model for high-quality {currentLanguage.language} generation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Voice List Container */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex items-center justify-between mb-4 mt-2">
                    <h3 className="font-semibold text-foreground">
                        Available Voices
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border rounded-full px-3 py-1">
                        {availableVoices.length} Voices Available
                    </span>
                </div>

                <div className="bg-background border border-border rounded-xl p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                        {availableVoices.map((voice) => {
                            const isSelected = voiceValue === voice.modelName;
                            const isPlaying = playingPreview === voice.preview;

                            return (
                                <div
                                    key={voice.modelName}
                                    onClick={() => handleVoiceSelect(voice.modelName)}
                                    role="button"
                                    tabIndex={0}
                                    className={cn(
                                        "flex items-center justify-between px-5 py-4 rounded-[14px] border transition-all duration-200 outline-none w-full group cursor-pointer bg-card",
                                        isSelected
                                            ? "border-primary shadow-[0_4px_20px_rgba(var(--primary),0.1)] ring-1 ring-primary"
                                            : "border-border hover:border-border hover:shadow-sm"
                                    )}
                                >
                                    <div className="flex flex-col gap-1.5">
                                        <h3 className={cn("font-bold text-[15px] capitalize tracking-tight", isSelected ? "text-foreground" : "text-foreground")}>
                                            {voice.modelName.replace('aura-2-', '').replace('-en', '')}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-semibold text-muted-foreground/80 bg-muted/50 px-1.5 py-0.5 rounded-sm tracking-wider">
                                                {voice.gender.toLowerCase()}
                                            </span>
                                            <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest">
                                                {voice.model}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Play Preview Button */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => handlePlayPreview(e, voice.preview)}
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                                            isPlaying
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "bg-muted/30 text-muted-foreground hover:bg-muted/80"
                                        )}
                                    >
                                        {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-muted-foreground text-transparent ml-0.5 group-hover:fill-primary/70" />}
                                    </div>
                                </div>
                            );
                        })}

                        {availableVoices.length === 0 && (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center p-10 bg-transparent rounded-xl text-muted-foreground justify-center flex flex-col items-center">
                                <Sparkles className="w-10 h-10 mb-4 opacity-30" />
                                <p>No voices available for this provider yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollbar styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: hsl(var(--border));
        border-radius: 20px;
    }
  `}} />
        </div>
    );
}
