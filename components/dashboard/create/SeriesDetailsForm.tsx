"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Check, Clock, Instagram, Mail, Youtube } from "lucide-react";

// Platform definitions with colors/icons
const PLATFORMS = [
    { id: "tiktok", name: "TikTok", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>, color: "hover:bg-zinc-100 hover:text-black", activeColor: "bg-zinc-900 text-white border-zinc-900" },
    { id: "youtube", name: "YouTube", icon: <Youtube className="w-5 h-5" />, color: "hover:bg-red-50 hover:text-red-600", activeColor: "bg-red-600 text-white border-red-600" },
    { id: "instagram", name: "Instagram", icon: <Instagram className="w-5 h-5" />, color: "hover:bg-pink-50 hover:text-pink-600", activeColor: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white border-transparent" },
    { id: "email", name: "Email", icon: <Mail className="w-5 h-5" />, color: "hover:bg-blue-50 hover:text-blue-500", activeColor: "bg-blue-500 text-white border-blue-500" },
];

export interface SeriesDetailsData {
    seriesName: string;
    duration: string;
    platforms: string[];
    scheduleTime: string;
}

interface SeriesDetailsFormProps {
    value: SeriesDetailsData;
    onChange: (data: SeriesDetailsData) => void;
}

export function SeriesDetailsForm({ value, onChange }: SeriesDetailsFormProps) {
    const handlePlatformToggle = (platformId: string) => {
        const newPlatforms = value.platforms.includes(platformId)
            ? value.platforms.filter(id => id !== platformId)
            : [...value.platforms, platformId];

        onChange({ ...value, platforms: newPlatforms });
    };

    return (
        <div className="w-full h-full flex flex-col mt-2">
            <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        Review & Schedule
                    </h2>
                    <p className="text-muted-foreground">Finalize your series details and set your publishing schedule.</p>
                </div>

                <div className="bg-background border border-border rounded-xl p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar shadow-sm">
                    <div className="max-w-2xl mx-auto space-y-8">

                        {/* 1. Series Name */}
                        <div className="space-y-3">
                            <Label htmlFor="seriesName" className="text-base font-semibold">Series Name</Label>
                            <Input
                                id="seriesName"
                                placeholder="e.g. Scary Stories Volume 1"
                                className="h-12 text-md"
                                value={value.seriesName}
                                onChange={(e) => onChange({ ...value, seriesName: e.target.value })}
                            />
                        </div>

                        {/* 2. Video Duration */}
                        <div className="space-y-3">
                            <Label htmlFor="duration" className="text-base font-semibold">Video Duration</Label>
                            <Select
                                value={value.duration || undefined}
                                onValueChange={(val) => onChange({ ...value, duration: val })}
                            >
                                <SelectTrigger className="h-12 text-md bg-card">
                                    <SelectValue placeholder="Select target duration length..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30-50">30-50 sec video</SelectItem>
                                    <SelectItem value="60-70">60-70 sec video</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 3. Target Platforms */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Target Platforms</Label>
                            <p className="text-sm text-muted-foreground mb-3">Select where this series will be published.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {PLATFORMS.map((platform) => {
                                    const isSelected = value.platforms.includes(platform.id);

                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => handlePlatformToggle(platform.id)}
                                            className={cn(
                                                "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 outline-none w-full",
                                                isSelected
                                                    ? platform.activeColor
                                                    : cn("border-border bg-card text-muted-foreground", platform.color)
                                            )}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                            {platform.icon}
                                            <span className="font-medium text-sm">{platform.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. Publish Time & Note */}
                        <div className="space-y-3 bg-muted/30 p-5 rounded-xl border border-border/50">
                            <Label htmlFor="scheduleTime" className="text-base font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Publish Time
                            </Label>
                            <Input
                                id="scheduleTime"
                                type="time"
                                className="h-12 text-md bg-background focus:ring-primary"
                                value={value.scheduleTime}
                                onChange={(e) => onChange({ ...value, scheduleTime: e.target.value })}
                            />
                            {/* Explicit notification note exactly as requested */}
                            <p className="text-[13px] font-medium text-amber-600/90 dark:text-amber-500 pt-1 flex items-start gap-1.5">
                                <span className="inline-block mt-0.5">⚠️</span>
                                video will generate 3-6 hours before video publish
                            </p>
                        </div>

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
