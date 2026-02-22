import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";
import VideoList from "@/components/dashboard/videos/VideoList";
import { currentUser } from "@clerk/nextjs/server";

export default async function SeriesVideosPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = createAdminClient();
    const resolvedParams = await params;

    // Verify User via Clerk
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const { data: series, error } = await supabase
        .from("series")
        .select("series_name")
        .eq("id", resolvedParams.id)
        .single();

    if (error || !series) {
        redirect("/dashboard");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard"
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {series.series_name} Videos
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Manage all generated videos for this series
                    </p>
                </div>
            </div>

            <VideoList seriesId={resolvedParams.id} seriesName={series.series_name} />
        </div>
    );
}
