"use client";

import { useEffect, useState } from "react";
import { Series, SeriesCard } from "./SeriesCard";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SeriesList() {
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const res = await fetch("/api/series");
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setSeriesList(data.series || []);
            } catch (error) {
                console.error("Error fetching series:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeries();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-64">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>Loading your series...</p>
            </div>
        );
    }

    if (seriesList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border/50 rounded-2xl shadow-sm mt-8 max-w-2xl mx-auto py-20">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Video className="w-10 h-10 text-primary opacity-80" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Series Found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    You haven't generated any dynamic video series yet. Click below to start building your first one!
                </p>
                <Link href="/dashboard/create">
                    <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create a new series
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {seriesList.map((series) => (
                <SeriesCard
                    key={series.id}
                    series={series}
                    onDeleteSuccess={(deletedId) => {
                        setSeriesList((prev) => prev.filter((s) => s.id !== deletedId));
                    }}
                />
            ))}
        </div>
    );
}

// Ensure Video icon is imported for the empty state
import { Video } from "lucide-react";
