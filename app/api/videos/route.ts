import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const supabase = createAdminClient();

        // Ensure user is authenticated via Clerk
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch all videodata for the user's series, ordered by newest first
        const { data: videos, error } = await supabase
            .from("videodata")
            .select(`
                *,
                series!inner(
                    series_name,
                    user_id
                )
            `)
            .eq("series.user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching global videos:", error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }

        // Flatten the series_name into the top-level video object for the UI
        const formattedVideos = videos.map(video => ({
            ...video,
            series_name: video.series?.series_name || "Unknown Series",
            series: undefined // Remove nested object
        }));

        return NextResponse.json(formattedVideos);
    } catch (error) {
        console.error("[GLOBAL_VIDEOS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
