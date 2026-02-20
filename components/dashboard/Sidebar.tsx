import Link from "next/link";
import { Clapperboard, Layers, Video, Book, CreditCard, Settings, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
    return (
        <aside className="w-64 flex-shrink-0 border-r border-border/40 bg-background/80 backdrop-blur-md flex flex-col h-full">
            <div className="h-16 flex items-center px-6 border-b border-border/40">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <Clapperboard className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        VidMaxx
                    </span>
                </Link>
            </div>

            <div className="p-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-md py-6" size="lg">
                    + Create a new series
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1">
                <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Main Menu
                </div>
                <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                    <Layers className="h-5 w-5" />
                    <span className="text-[1.05rem]">Series</span>
                </Link>
                <Link href="/dashboard/videos" className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                    <Video className="h-5 w-5" />
                    <span className="text-[1.05rem]">Videos</span>
                </Link>
                <Link href="/dashboard/guides" className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                    <Book className="h-5 w-5" />
                    <span className="text-[1.05rem]">Guides</span>
                </Link>
                <Link href="/dashboard/billing" className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[1.05rem]">Billing</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                    <Settings className="h-5 w-5" />
                    <span className="text-[1.05rem]">Settings</span>
                </Link>
            </div>

            <div className="p-3 mt-auto border-t border-border/40 flex flex-col gap-1">
                <Link href="/dashboard/upgrade" className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-[1.05rem]">Upgrade</span>
                </Link>
                <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
                    <User className="h-5 w-5" />
                    <span className="text-[1.05rem]">Profile Setting</span>
                </Link>
            </div>
        </aside>
    );
}
