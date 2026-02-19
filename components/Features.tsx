import { Wand2, Calendar, Share2, BarChart3, Zap, LayoutTemplate } from "lucide-react";

const features = [
    {
        icon: Wand2,
        title: "AI Video Generation",
        description: "Turn text prompts into engaging short videos with AI-generated visuals, voiceovers, and captions.",
    },
    {
        icon: Calendar,
        title: "Smart Scheduling",
        description: "Plan your content calendar effortlessly. Auto-schedule posts for the best engagement times.",
    },
    {
        icon: Share2,
        title: "Multi-Platform Support",
        description: "One click to publish or schedule to YouTube Shorts, Instagram Reels, and TikTok simultaneously.",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Track performance across all platforms in one place. Understand what works and grow faster.",
    },
    {
        icon: Zap,
        title: "Trend Detection",
        description: "Our AI monitors trending sounds and topics to help you create viral content before it's too late.",
    },
    {
        icon: LayoutTemplate,
        title: "Custom Templates",
        description: "Choose from hundreds of professionally designed templates optimized for each platform's algorithm.",
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Everything You Need to <span className="text-primary">Go Viral</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Stop spending hours editing and managing accounts. Let VidMaxx handle the heavy lifting while you focus on creativity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-105 cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
