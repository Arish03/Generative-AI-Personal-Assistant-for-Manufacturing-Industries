"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Factory } from "lucide-react";

export function TopHeader() {
    return (
        <header className="h-14 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-end px-6 shrink-0 z-10">
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="hidden sm:flex items-center gap-1.5 border-l border-[hsl(var(--border))] pl-4">
                    <Factory className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mt-0.5">G.A.P</span>
                </div>
            </div>
        </header>
    );
}
