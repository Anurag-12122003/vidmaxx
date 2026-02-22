import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createAdminClient();

        // Ensure the user owns the series before deleting
        const { error, data } = await supabase
            .from("series")
            .delete()
            .eq("id", id)
            .eq("user_id", userId)
            .select();
        if (error) {
            console.error("Supabase Delete Error:", error);
            return NextResponse.json({ error: "Failed to delete series" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("API Route Error (DELETE):", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const supabase = createAdminClient();

        // Construct dynamic update payload based on what the client sends
        const updatePayload: any = {};

        // Single status toggle (pause/resume from dashboard)
        if (body.status) {
            updatePayload.status = body.status;
        }

        // Full edit mode (from the Edit Wizard page)
        if (body.seriesDetails) {
            updatePayload.series_name = body.seriesDetails.seriesName;
            updatePayload.video_duration = body.seriesDetails.duration;
            updatePayload.platforms = body.seriesDetails.platforms;
            updatePayload.schedule_time = body.seriesDetails.scheduleTime;
            updatePayload.niche = body.niche;
            updatePayload.language = body.language;
            updatePayload.voice = body.voice;
            updatePayload.bg_music = body.bgMusic;
            updatePayload.image_style = body.imageStyle;
            updatePayload.caption_style = body.captionStyle;
        }

        // Update the series status, ensuring the user owns it
        const { error, data } = await supabase
            .from("series")
            .update(updatePayload)
            .eq("id", id)
            .eq("user_id", userId)
            .select();
        if (error) {
            console.error("Supabase Update Error:", error);
            return NextResponse.json({ error: "Failed to update series" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("API Route Error (PATCH):", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
