"use client";

import { cn } from "@/lib/utils";
import { CaptionStyles } from "@/utils/constants/captions";
import { AnimatedCaption } from "@/components/captions/AnimatedCaption";
import { CheckCircle2 } from "lucide-react";

interface CaptionStyleSelectionProps {
    value: string | null;
    onChange: (styleId: string) => void;
}

export function CaptionStyleSelection({ value, onChange }: CaptionStyleSelectionProps) {
    // We use a sample sentence for the preview cards
    const sampleText = "This is a preview of your engaging captions";

    return (
        <div className="w-full h-full flex flex-col mt-2">
            <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        Caption Style
                    </h2>
                    <p className="text-muted-foreground">Select how your subtitles will animate within the video.</p>
                </div>

                {/* Grid Container */}
                <div className="bg-background border border-border rounded-xl p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-4">
                        {CaptionStyles.map((style) => {
                            const isSelected = value === style.id;

                            return (
                                <div
                                    key={style.id}
                                    onClick={() => onChange(style.id)}
                                    role="button"
                                    tabIndex={0}
                                    className={cn(
                                        "flex flex-col rounded-2xl border-2 transition-all duration-300 outline-none w-full group cursor-pointer overflow-hidden",
                                        isSelected
                                            ? "border-primary shadow-[0_4px_20px_rgba(var(--primary),0.2)] scale-[1.02] ring-2 ring-primary/20 bg-primary/5"
                                            : "border-border hover:border-primary/50 hover:shadow-md bg-card"
                                    )}
                                >
                                    {/* Video simulation container / Dark background for contrast */}
                                    <div className="w-full h-40 bg-zinc-950 relative flex flex-col items-center justify-center p-4 overflow-hidden">

                                        {/* Background noise/grid to make it feel like a video block */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

                                        {/* The actual reusable animated caption component playing the sample text */}
                                        <div className="z-10 w-full flex items-center justify-center transform scale-90 sm:scale-100">
                                            <AnimatedCaption
                                                text={sampleText}
                                                styleType={style.id}
                                            />
                                        </div>

                                        {/* Selection checkmark over the video box */}
                                        <div className={cn(
                                            "absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg transform transition-all duration-300 z-20",
                                            isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                        )}>
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
                                        <h3 className={cn("font-bold text-center text-lg tracking-tight", isSelected ? "text-primary" : "text-foreground group-hover:text-primary transition-colors")}>
                                            {style.name}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CSS injection for scrollbar compatibility matching previous steps */}
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
