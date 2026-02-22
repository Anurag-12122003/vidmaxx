"use client";

import { useEffect, useState } from "react";
import { Loader2, PlayCircle, Clock, Calendar, Clapperboard, Play } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface VideoData {
    id: string;
    series_id: string;
    script_title: string | null;
    script_text: string | null;
    audio_url: string | null;
    captions: any;
    images: { imageUrl: string; index: number }[] | null;
    status: string;
    created_at: string;
    series_name: string;
}

export default function GlobalVideoList() {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVideos = async () => {
        try {
            const res = await fetch(`/api/videos`);
            if (res.ok) {
                const data = await res.json();
                setVideos(data);
            }
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
        // Poll every 5 seconds if there's any video actively generating
        const interval = setInterval(() => {
            setVideos((currentVideos) => {
                const isGenerating = currentVideos.some(v => v.status === 'generating' || v.status === 'pending');
                if (isGenerating) {
                    fetchVideos();
                }
                return currentVideos;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getRandomThumbnail = (images: { imageUrl: string; index: number }[] | null) => {
        if (!images || images.length === 0) return "/empty-post.png";
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex].imageUrl;
    };
    console.log('images at globalvideolist', getRandomThumbnail)

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border shadow-sm mt-8">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <Video className="w-10 h-10 text-purple-600 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Generated Videos</h3>
                <p className="text-gray-500 max-w-sm">
                    You haven't generated any videos yet. Go to your Series and click Generate!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
            {videos.map((video) => {
                const isProcessing = video.status === 'generating' || video.status === 'pending';
                const thumbnailUrl = isProcessing ? null : getRandomThumbnail(video.images);

                return (
                    <div
                        key={video.id}
                        className="group bg-white rounded-[24px] border shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col cursor-pointer"
                    >
                        {/* Thumbnail Area with specific aspect ratio based on screenshot (approx 16:9 for the preview box) */}
                        <div className="aspect-video relative bg-zinc-900 flex-shrink-0 overflow-hidden">
                            {isProcessing ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl shadow-sm flex items-center justify-center mb-4 relative overflow-hidden backdrop-blur-md border border-white/20">
                                        <div className="absolute inset-0 bg-purple-500/20 animate-pulse" />
                                        <Loader2 className="w-8 h-8 text-white animate-spin relative z-10" />
                                    </div>
                                    <p className="font-medium text-white/90 animate-pulse">Generating Video...</p>
                                </div>
                            ) : (
                                thumbnailUrl ? (
                                    <>
                                        <Image
                                            src={thumbnailUrl}
                                            alt={video.script_title || "Video thumbnail"}
                                            fill
                                            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                        />
                                        {/* Center Play Icon Overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                                            <div className="w-12 h-12 rounded-full border-2 border-white/80 bg-black/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Play className="w-5 h-5 text-white fill-white ml-1" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <PlayCircle className="w-12 h-12 text-gray-300" />
                                    </div>
                                )
                            )}

                            {/* Badges Overlay */}
                            <div className="absolute top-4 left-4 z-20">
                                {isProcessing ? (
                                    <span className="px-3 py-1 bg-yellow-500 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                                        Generating
                                    </span>
                                ) : video.status === 'completed' && (
                                    <span className="px-3 py-1 bg-[#00B87C] text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                                        Ready
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details Area */}
                        <div className="p-6 flex flex-col flex-1 bg-white">
                            <h3 className="font-bold text-[18px] text-[#4A3AFF] line-clamp-1 mb-2 group-[hover]:underline underline-offset-4 decoration-2 decoration-[#4A3AFF]/30">
                                {video.script_title || "Draft Video Title"}
                            </h3>

                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-6">
                                <Clapperboard className="w-4 h-4 text-[#4A3AFF]" />
                                <span className="truncate">{video.series_name}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mt-auto pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(video.created_at), "MMM dd, yyyy").toUpperCase()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {format(new Date(video.created_at), "hh:mm a")}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Ensure lucide icon imports don't crash
import { Video } from "lucide-react";
