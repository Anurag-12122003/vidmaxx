import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.seriesId) {
            return NextResponse.json({ error: "Missing required seriesId parameter" }, { status: 400 });
        }

        // Trigger the Inngest background job, passing the seriesId
        await inngest.send({
            name: "video/generate",
            data: {
                seriesId: body.seriesId,
            },
        });

        return NextResponse.json({ success: true, message: "Video generation job queued" }, { status: 200 });
    } catch (error) {
        console.error("API Route Error (POST /api/generate):", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
