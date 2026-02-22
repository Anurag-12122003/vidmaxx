import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ seriesId: string }> }
) {
    try {
        const resolvedParams = await params;
        const { seriesId } = resolvedParams;
        const supabase = createAdminClient();

        // Ensure user is authenticated via Clerk
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch the videodata for the series, ordered by newest first
        const { data: videos, error } = await supabase
            .from("videodata")
            .select("*")
            .eq("series_id", seriesId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching videos:", error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }

        return NextResponse.json(videos);
    } catch (error) {
        console.error("[VIDEOS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
