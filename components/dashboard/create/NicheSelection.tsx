"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Ghost, Sparkles, BookHeart, History, Cpu, Smile, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

const AVAILABLE_NICHES = [
    { id: "scary-stories", title: "Scary Stories", description: "Chilling tales guaranteed to keep viewers awake.", icon: Ghost },
    { id: "motivational", title: "Motivational", description: "Inspiring speeches and quotes for daily success.", icon: Sparkles },
    { id: "bedtime-stories", title: "Bedtime Stories", description: "Soothing narratives for a peaceful night's sleep.", icon: BookHeart },
    { id: "historical-facts", title: "Historical Facts", description: "Fascinating untold events from human history.", icon: History },
    { id: "tech-tips", title: "Tech Tips", description: "Quick tech hacks, gadgets, and software tips.", icon: Cpu },
    { id: "funny-fails", title: "Funny Fails", description: "Hilarious moments and comedic compilations.", icon: Smile },
    { id: "ai-news", title: "AI & Future Tech", description: "The latest breakthroughs in Artificial Intelligence.", icon: BrainCircuit },
];

interface NicheSelectionProps {
    value: string | null;
    onChange: (nicheId: string) => void;
}

export function NicheSelection({ value, onChange }: NicheSelectionProps) {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    Select Your Niche
                </h2>
                <p className="text-muted-foreground">What kind of videos do you want to create?</p>
            </div>

            <Tabs defaultValue="available" className="w-full flex-1 flex flex-col">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-card border border-border">
                    <TabsTrigger value="available">Available Niche</TabsTrigger>
                    <TabsTrigger value="custom">Custom Niche</TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="flex-1 flex flex-col mt-0">
                    <div className="flex-1 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                            {AVAILABLE_NICHES.map((niche) => {
                                const Icon = niche.icon;
                                const isSelected = value === niche.id;

                                return (
                                    <button
                                        key={niche.id}
                                        onClick={() => onChange(niche.id)}
                                        className={cn(
                                            "flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-200 outline-none w-full group",
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.15)] ring-1 ring-primary"
                                                : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-lg flex-shrink-0 transition-colors",
                                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                                        )}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h3 className={cn("font-semibold text-lg", isSelected ? "text-primary" : "text-foreground")}>
                                                {niche.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-snug">
                                                {niche.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="custom" className="flex-1 mt-0">
                    <div className="flex h-[400px] items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/50">
                        <div className="text-center p-6">
                            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-muted-foreground">Custom Niche Builder</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-2">
                                Describe your unique channel idea in the next step, our AI will automatically tailor a script style for you. (Coming Soon)
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Add a tiny style injection for a nicer scrollbar without messing with global css immediately */}
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
