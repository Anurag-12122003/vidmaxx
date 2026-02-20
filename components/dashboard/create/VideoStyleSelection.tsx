"use client";

import { cn } from "@/lib/utils";
import { VideoStyles } from "@/utils/constants/styles";
import { CheckCircle2, Image as ImageIcon } from "lucide-react";

interface VideoStyleSelectionProps {
    value: string | null;
    onChange: (styleId: string) => void;
}

export function VideoStyleSelection({ value, onChange }: VideoStyleSelectionProps) {
    return (
        <div className="w-full h-full flex items-center justify-center mt-2">
            <div className="w-full max-w-5xl mx-auto flex flex-col h-full min-h-0">
                <div className="text-center mb-6 flex-shrink-0">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        Visual Style
                    </h2>
                    <p className="text-muted-foreground">Choose the aesthetic for your series visuals.</p>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="w-full flex-1 min-h-0 overflow-hidden relative">
                    {/* Fading edges for scroll hint */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                    <div className="flex overflow-x-auto gap-5 pb-6 pt-4 px-4 h-full snap-x snap-mandatory custom-horizontal-scrollbar style-container">
                        {VideoStyles.map((style) => {
                            const isSelected = value === style.id;

                            return (
                                <div
                                    key={style.id}
                                    onClick={() => onChange(style.id)}
                                    role="button"
                                    tabIndex={0}
                                    className="snap-center shrink-0 flex flex-col group cursor-pointer outline-none relative"
                                >
                                    {/* Image Card constrained to 9:16 aspect ratio roughly matching shorts/reels */}
                                    <div className={cn(
                                        "relative w-[220px] sm:w-[260px] aspect-[9/16] rounded-2xl overflow-hidden transition-all duration-300 border-2",
                                        isSelected
                                            ? "border-primary shadow-[0_8px_30px_rgba(var(--primary),0.25)] scale-[1.02] ring-4 ring-primary/20"
                                            : "border-border/50 hover:border-primary/50 shadow-sm"
                                    )}>
                                        {/* Fallback pattern underneath the image in case it hasn't loaded */}
                                        <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
                                            <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                                        </div>

                                        {/* Core Image mapping cleanly to the paths in styles.ts */}
                                        {/* Utilizing standard img to bypass Next Image domain/caching restrictions during dev */}
                                        <img
                                            src={style.image}
                                            alt={style.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />

                                        {/* Gradient overlay for text legibility at bottom */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300",
                                            isSelected ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                                        )} />

                                        {/* Selected State Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 border-4 border-primary rounded-2xl transition-all duration-300 pointer-events-none",
                                            isSelected ? "opacity-100" : "opacity-0"
                                        )} />

                                        <div className={cn(
                                            "absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg transform transition-all duration-300",
                                            isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                        )}>
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Title Text positioned at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-bold text-xl tracking-wide drop-shadow-md">
                                                {style.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CSS injection for horizontal custom scrollbar */}
                <style dangerouslySetInnerHTML={{
                    __html: `
        .custom-horizontal-scrollbar::-webkit-scrollbar {
            height: 8px;
        }
        .custom-horizontal-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {
            background-color: hsl(var(--border));
            border-radius: 20px;
        }
        .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: hsl(var(--primary)/0.5);
        }
        /* Hide scrollbar completely on small devices for pure swipe experience if desired, but 8px is clean */
      `}} />
            </div>
        </div>
    );
}
