import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
    return (
        <header className="h-16 flex border-b border-border/40 bg-background/80 backdrop-blur-md px-6 items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                {/* Optional: Add search bar or page title here later */}
                Dashboard
            </div>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    );
}
