"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCaptionProps {
    text: string;
    styleType: string;
    className?: string; // Optional parent overrides
}

export function AnimatedCaption({ text, styleType, className }: AnimatedCaptionProps) {
    const words = text.split(" ");

    // For pure preview purposes out-of-Remotion context, we simulate word timing.
    // Inside Remotion, you would map this to the `useCurrentFrame()` and audio timestamps.
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    useEffect(() => {
        // Reset loop every few seconds to show the animation again
        let interval: NodeJS.Timeout;
        let timeout: NodeJS.Timeout;

        const runAnimation = () => {
            setCurrentWordIndex(-1); // reset
            let index = 0;

            // Advance a word every 300ms to simulate speaking roughly
            interval = setInterval(() => {
                if (index < words.length) {
                    setCurrentWordIndex(index);
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 300);

            // Re-run the entire sequence after a delay
            timeout = setTimeout(runAnimation, words.length * 300 + 1500);
        };

        runAnimation();

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [words.length]);

    // Render logic per style
    return (
        <div className={cn("text-center w-full max-w-[90%] mx-auto font-black uppercase text-[1.4rem] leading-none tracking-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]", className)}>
            {styleType === "pop" && (
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                    {words.map((word, idx) => (
                        <span
                            key={idx}
                            className={cn(
                                "transition-transform duration-100 ease-out",
                                idx === currentWordIndex ? "scale-[1.2] text-yellow-400" : "scale-100",
                                idx > currentWordIndex && currentWordIndex !== -1 ? "opacity-0" : "opacity-100" // Hide upcoming words
                            )}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            )}

            {styleType === "fade" && (
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                    {words.map((word, idx) => (
                        <span
                            key={idx}
                            className={cn(
                                "transition-all duration-300 ease-in-out transform",
                                idx <= currentWordIndex ? "opacity-100 translate-y-0 text-white" : "opacity-0 translate-y-4"
                            )}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            )}

            {styleType === "typewriter" && (
                <div className="flex justify-center flex-wrap">
                    <span className="bg-black/50 px-3 py-1 rounded inline-block">
                        {words.slice(0, currentWordIndex + 1).join(" ")}
                        <span className={cn(
                            "inline-block w-[0.4em] h-[1em] bg-green-400 ml-1 translate-y-[0.1em] animate-pulse",
                            currentWordIndex >= words.length - 1 ? "hidden" : ""
                        )} />
                    </span>
                </div>
            )}

            {styleType === "highlight" && (
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 bg-black/40 px-3 py-2 rounded-lg backdrop-blur-sm">
                    {words.map((word, idx) => (
                        <span
                            key={idx}
                            className={cn(
                                "transition-colors duration-150",
                                idx === currentWordIndex
                                    ? "text-[#00ffcc] [text-shadow:0_0_10px_#00ffcc]"
                                    : idx < currentWordIndex
                                        ? "text-white"
                                        : "text-white/30"
                            )}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            )}

            {styleType === "bounce" && (
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                    {words.map((word, idx) => (
                        <span
                            key={idx}
                            className={cn(
                                "transition-all duration-300",
                                idx === currentWordIndex
                                    ? "-translate-y-2 text-[#ff00ff] scale-110"
                                    : idx < currentWordIndex
                                        ? "translate-y-0 text-white scale-100"
                                        : "opacity-0"
                            )}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            )}

            {styleType === "slide" && (
                <div className="flex flex-col items-center justify-center">
                    <div className="overflow-hidden bg-red-600 px-3 py-1 shadow-[4px_4px_0_#000]">
                        <div className={cn(
                            "transition-transform duration-200 ease-out whitespace-nowrap",
                            currentWordIndex >= 0 ? "translate-x-0" : "-translate-x-full"
                        )}>
                            {/* Slide shows the current active word big in the center */}
                            {currentWordIndex >= 0 ? words[currentWordIndex] : ""}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
