"use client";

import { useState, useRef, useEffect } from "react";
import { BgMusic } from "@/utils/constants/music";
import { cn } from "@/lib/utils";
import { Play, Square, Music, CheckCircle2 } from "lucide-react";

interface BgMusicSelectionProps {
    value: string[]; // Array of selected music IDs
    onChange: (musicIds: string[]) => void;
}

export function BgMusicSelection({ value, onChange }: BgMusicSelectionProps) {
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Clean up audio on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleSelection = (musicId: string) => {
        if (value.includes(musicId)) {
            // Remove it
            onChange(value.filter(id => id !== musicId));
        } else {
            // Add it
            onChange([...value, musicId]);
        }
    };

    const handlePlayPreview = (e: React.MouseEvent, musicUrl: string, musicId: string) => {
        e.stopPropagation(); // Don't trigger card selection

        // If currently playing the same preview, stop it
        if (playingPreview === musicId && audioRef.current) {
            audioRef.current.pause();
            setPlayingPreview(null);
            return;
        }

        // If playing something else, stop it first
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Play the new preview
        const newAudio = new Audio(musicUrl);
        audioRef.current = newAudio;
        setPlayingPreview(musicId);

        newAudio.play().catch(e => {
            console.error("Audio playback error:", e);
            setTimeout(() => setPlayingPreview(null), 2000);
        });

        newAudio.onended = () => {
            setPlayingPreview(null);
        };
    };

    return (
        <div className="w-full h-full flex items-center justify-center mt-2">
            <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        Background Music
                    </h2>
                    <p className="text-muted-foreground">Select one or more background tracks for your series.</p>
                </div>

                {/* Music List Container */}
                <div className="bg-background border border-border rounded-xl p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar shadow-sm">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-3 pb-4">
                        {BgMusic.map((music) => {
                            const isSelected = value.includes(music.id);
                            const isPlaying = playingPreview === music.id;

                            return (
                                <div
                                    key={music.id}
                                    onClick={() => toggleSelection(music.id)}
                                    role="button"
                                    tabIndex={0}
                                    className={cn(
                                        "flex items-center justify-between px-5 py-4 rounded-[14px] border transition-all duration-200 outline-none w-full group cursor-pointer bg-card",
                                        isSelected
                                            ? "border-primary shadow-[0_4px_20px_rgba(var(--primary),0.1)] ring-1 ring-primary bg-primary/5"
                                            : "border-border hover:border-primary/50 hover:shadow-sm"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                                        )}>
                                            <Music className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h3 className={cn("font-bold text-[15px] tracking-tight", isSelected ? "text-primary" : "text-foreground")}>
                                                {music.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Play Preview Button */}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => handlePlayPreview(e, music.url, music.id)}
                                            className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border",
                                                isPlaying
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                                            )}
                                        >
                                            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                                        </div>

                                        {/* Selection Indicator */}
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                            isSelected ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-30"
                                        )}>
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
        </div>
    );
}
