import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 animate-fade-in-up">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">AI-Powered Video Creation</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Automate Your Short Video <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Creation & Scheduling
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Create viral shorts for YouTube, Instagram, and TikTok in seconds with AI.
                    Schedule them automatically and watch your audience grow.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/25">
                                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/25" asChild>
                                <span>Start Creating for Free <ArrowRight className="ml-2 h-4 w-4 inline-block" /></span>
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    <Link href="#demo">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full backdrop-blur-sm bg-background/50">
                            <Play className="mr-2 h-4 w-4" /> Watch Demo
                        </Button>
                    </Link>
                </div>

                {/* Dashboard Preview / Visual Placeholder */}
                <div className="relative mx-auto max-w-5xl rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-video">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground/50 text-xl font-medium">[App Dashboard Preview]</p>
                    </div>
                    {/* Decorative UI elements for the preview */}
                    <div className="absolute top-0 left-0 right-0 h-10 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                </div>
            </div>
        </section>
    );
}
