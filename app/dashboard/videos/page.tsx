import GlobalVideoList from "@/components/dashboard/videos/GlobalVideoList";

export const metadata = {
    title: "Generated Videos | VidMaxx",
    description: "Manage and view all your generated videos.",
};

export default function VideosPage() {
    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Generated Videos</h1>
                    <p className="text-muted-foreground mt-1.5 text-[15px]">
                        Manage and view all your generated content.
                    </p>
                </div>
            </div>

            <GlobalVideoList />
        </div>
    );
}
