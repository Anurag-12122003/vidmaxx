"use client";

import { VideoStyles } from "@/utils/constants/styles";
import {
    MoreVertical,
    Edit,
    Trash2,
    Play,
    Pause,
    Video,
    Clock,
    Wand2,
    Calendar,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Series {
    id: string;
    created_at: string;
    series_name: string;
    image_style: string;
    video_duration: string;
    platforms?: string[];
    status?: "active" | "paused" | "pending"; // Add status to Series interface
    [key: string]: any;
}

interface SeriesCardProps {
    series: Series;
    onDeleteSuccess?: (id: string) => void;
}

export function SeriesCard({ series: initialSeries, onDeleteSuccess }: SeriesCardProps) {
    const router = useRouter();
    const [series, setSeries] = useState(initialSeries);
    const [isLoading, setIsLoading] = useState(false);

    // Find the matching video style thumbnail
    const styleObj = VideoStyles.find(s => s.id === series.image_style);
    // Fallback image just in case
    const thumbnail = styleObj ? styleObj.image : "/image/cinematic.png";

    // Format the date uniquely
    const dateObj = new Date(series.created_at);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(dateObj);

    const handleDeleteSeries = async () => {
        if (!confirm("Are you sure you want to delete this series? This action cannot be undone.")) {
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`/api/series/${series.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                if (onDeleteSuccess) {
                    onDeleteSuccess(series.id);
                } else {
                    router.refresh();
                }
            } else {
                alert("Failed to delete series.");
            }
        } catch (error) {
            console.error("Error deleting series:", error);
            alert("An error occurred while deleting the series.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSeriesStatus = async () => {
        const newStatus = series.status === "paused" ? "active" : "paused";
        setIsLoading(true);
        try {
            const res = await fetch(`/api/series/${series.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setSeries(prev => ({ ...prev, status: newStatus }));
            } else {
                alert(`Failed to ${newStatus === "active" ? "activate" : "pause"} series.`);
            }
        } catch (error) {
            console.error("Error toggling series status:", error);
            alert("An error occurred while toggling series status.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditDetails = () => {
        router.push(`/dashboard/series/${series.id}/edit`);
    };

    const handleViewVideos = () => {
        alert("Video Gallery Coming Soon!");
        // router.push(`/dashboard/series/${series.id}/videos`);
    };

    const handleGenerateVideo = () => {
        alert("Video Generation Trigger Coming Soon!");
        // router.push(`/dashboard/series/${series.id}/generate`);
    };

    return (
        <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
            {/* Top Thumbnail Section (16:9 aspect ratio simulated container) */}
            <div className="relative w-full h-[200px] bg-zinc-900 border-b border-border/50 overflow-hidden">
                {/* Due to Next.js Image caching bugs sometimes, we default back to img. But Image is standard. We'll use img here for safety like Sidebar. */}
                <img
                    src={thumbnail}
                    alt={series.series_name}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                />

                {/* Gradient overlay for text/icon readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
                    {series.status && (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider uppercase shadow-sm
                            ${series.status === "active" ? "bg-[#00B87C]" : "bg-orange-500"}`}>
                            {series.status === "active" ? "Active" : "Paused"}
                        </span>
                    )}
                </div>

                <div className="absolute bottom-3 left-3 flex gap-2 pointer-events-none flex-wrap max-w-[85%]">
                    {series.platforms && series.platforms.length > 0 ? (
                        series.platforms.map((platform) => (
                            <span key={platform} className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider">
                                {platform}
                            </span>
                        ))
                    ) : (
                        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider">
                            No Platform
                        </span>
                    )}
                </div>
                {/* Top Right Edit Button overlay */}
                <button
                    onClick={handleEditDetails}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:scale-110 text-zinc-700 transition-all duration-200 z-10"
                    title="Edit Series"
                    disabled={isLoading}
                >
                    <Edit className="w-4 h-4" />
                </button>
            </div>

            {/* Bottom Details Section */}
            <div className="p-5 flex flex-col flex-1 relative">

                {/* Header Row: Title and Popover */}
                <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex-1 overflow-hidden">
                        <h3 className="font-bold text-[17px] text-foreground truncate" title={series.series_name}>
                            {series.series_name}
                        </h3>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                        </p>
                    </div>

                    {/* Shadcn Popover for extra actions */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 -mt-1 -mr-1" disabled={isLoading}>
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48 p-1 rounded-xl shadow-lg border-border">
                            <div className="flex flex-col text-sm">
                                <button
                                    onClick={handleEditDetails}
                                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-muted text-left transition-colors"
                                    disabled={isLoading}
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Details</span>
                                </button>
                                <button
                                    onClick={handleToggleSeriesStatus}
                                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-muted text-left transition-colors"
                                    disabled={isLoading}
                                >
                                    {series.status === "paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                    <span>{series.status === "paused" ? "Activate Series" : "Pause Series"}</span>
                                </button>
                                <div className="h-px bg-border my-1 mx-2" />
                                <button
                                    onClick={handleDeleteSeries}
                                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 text-left transition-colors"
                                    disabled={isLoading}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Series</span>
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="mt-auto flex gap-3 pt-4">
                    {/* Secondary Link to Past Videos */}
                    <Button
                        variant="outline"
                        onClick={() => alert("Video Gallery Coming Soon!")}
                        className="flex-1 gap-2 font-semibold h-[42px] rounded-xl border-border hover:bg-muted/50 transition-colors shadow-sm"
                    >
                        <Video className="w-4 h-4" />
                        View Videos
                    </Button>

                    {/* Primary Generation Button */}
                    <Button
                        onClick={() => alert("Video Generation Trigger Coming Soon!")}
                        className="flex-1 gap-1.5 font-semibold h-[42px] bg-primary hover:bg-primary/90 text-primary-foreground transition-opacity rounded-xl cursor-pointer shadow-sm"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        Generate
                    </Button>
                </div>
            </div>
        </div>
    );
}
