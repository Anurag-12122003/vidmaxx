import { ArrowRight } from "lucide-react";

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 relative overflow-hidden">
            {/* Decorative blurred blob */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        From Idea to Published in <span className="text-primary">3 Steps</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        No editing skills required. Just your ideas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector lines for desktop - visualized as absolute positioned simplified elements */}
                    <div className="hidden md:block absolute top-12 left-1/3 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -translate-x-1/2" />
                    <div className="hidden md:block absolute top-12 left-2/3 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -translate-x-1/2" />

                    {/* Step 1 */}
                    <div className="relative flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center z-10 mb-6 shadow-xl">
                            <span className="text-3xl font-bold text-primary">1</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Input Your Idea</h3>
                        <p className="text-muted-foreground">
                            Describe your video concept or paste a script. Our AI understands context and style instantly.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center z-10 mb-6 shadow-xl">
                            <span className="text-3xl font-bold text-primary">2</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Generation</h3>
                        <p className="text-muted-foreground">
                            VidMaxx generates visuals, adds voiceovers, and syncs captions. Customize anything in seconds.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center z-10 mb-6 shadow-xl">
                            <span className="text-3xl font-bold text-primary">3</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Schedule & Publish</h3>
                        <p className="text-muted-foreground">
                            Set your schedule and let our auto-poster handle YouTube, TikTok, and Instagram for you.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
