"use client";

import { useEffect, useState } from "react";
import { Loader2, PlayCircle, Clock, Calendar, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

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
}

export default function VideoList({ seriesId, seriesName }: { seriesId: string, seriesName: string }) {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVideos = async () => {
        try {
            const res = await fetch(`/api/videos/${seriesId}`);
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
    }, [seriesId]);

    const getRandomThumbnail = (images: { imageUrl: string; index: number }[] | null) => {
        if (!images || images.length === 0) return "/empty-post.png"; // Fallback image if needed
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex].imageUrl;
    };


    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <PlayCircle className="w-8 h-8 text-purple-600 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No videos yet</h3>
                <p className="text-gray-500 max-w-sm">
                    Click the Generate button on the series card to create your first video for {" "}
                    <span className="font-semibold text-gray-700">{seriesName}</span>.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
                const isProcessing = video.status === 'generating' || video.status === 'pending';
                const thumbnailUrl = isProcessing ? null : getRandomThumbnail(video.images);

                return (
                    <div
                        key={video.id}
                        className="group bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
                    >
                        {/* Thumbnail Area */}
                        <div className="aspect-[9/16] relative bg-gray-100 flex-shrink-0">
                            {isProcessing ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-purple-100/50 animate-pulse" />
                                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin relative z-10" />
                                    </div>
                                    <p className="font-medium text-gray-800 animate-pulse">Generating Video...</p>
                                    <p className="text-xs text-gray-500 mt-2">This usually takes 1-2 minutes</p>
                                </div>
                            ) : (
                                thumbnailUrl ? (
                                    <Image
                                        src={thumbnailUrl}
                                        alt={video.script_title || "Video thumbnail"}
                                        fill
                                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <PlayCircle className="w-12 h-12 text-gray-300" />
                                    </div>
                                )
                            )}

                            {/* Status Badge Overlays */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {isProcessing ? (
                                    <span className="px-3 py-1 bg-yellow-100/90 text-yellow-800 text-xs font-medium rounded-full backdrop-blur-sm border border-yellow-200/50 flex items-center gap-1.5 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                        Processing
                                    </span>
                                ) : video.status === 'completed' && (
                                    <span className="px-3 py-1 bg-green-100/90 text-green-800 text-xs font-medium rounded-full backdrop-blur-sm border border-green-200/50 flex items-center gap-1.5 shadow-sm">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Ready
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details Area */}
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-bold text-gray-900 line-clamp-2 mb-3">
                                {video.script_title || "Draft Video Title"}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 mt-auto">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                                <button
                                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Wait..." : "Watch Video"}
                                </button>
                                <button
                                    className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isProcessing}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
