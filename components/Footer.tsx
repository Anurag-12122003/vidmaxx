import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-xl pt-20 pb-10">
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
                    {/* Brand & Newsletter - Spans 2 columns on large screens */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                VidMaxx
                            </span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            The ultimate AI-powered platform for creating and scheduling viral short-form content.
                        </p>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Subscribe to our newsletter</h4>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-background/50 border-border/50 focus-visible:ring-primary/20"
                                />
                                <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Stay updated with the latest AI trends and features.
                            </p>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="lg:col-span-1 lg:col-start-4">
                        <h3 className="font-semibold mb-4 text-foreground/90">Product</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Pricing</Link></li>
                            <li><Link href="/roadmap" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Roadmap</Link></li>
                            <li><Link href="/changelog" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Changelog</Link></li>
                            <li><Link href="/integration" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Integrations</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="lg:col-span-1">
                        <h3 className="font-semibold mb-4 text-foreground/90">Resources</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/blog" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Blog</Link></li>
                            <li><Link href="/docs" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Documentation</Link></li>
                            <li><Link href="/help" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Help Center</Link></li>
                            <li><Link href="/community" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Community</Link></li>
                            <li><Link href="/academy" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Creator Academy</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div className="lg:col-span-1">
                        <h3 className="font-semibold mb-4 text-foreground/90">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Cookie Policy</Link></li>
                            <li><Link href="/gdpr" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">GDPR</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/40">
                    <div className="text-sm text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
                        <p suppressHydrationWarning>© {new Date().getFullYear()} VidMaxx Inc. All rights reserved.</p>
                        <p className="text-xs mt-1">Made with ❤️ for creators worldwide.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {[Twitter, Instagram, Youtube, Linkedin, Facebook].map((Icon, i) => (
                            <Link
                                key={i}
                                href="#"
                                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                            >
                                <Icon className="h-5 w-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
