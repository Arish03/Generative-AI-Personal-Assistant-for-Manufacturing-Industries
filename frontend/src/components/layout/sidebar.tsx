"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Menu, X, type LucideIcon } from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

interface SidebarProps {
    title: string;
    icon: LucideIcon;
    items: NavItem[];
    bottomItems?: NavItem[];
    action?: React.ReactNode;
    children?: React.ReactNode;
}

export function Sidebar({ title, icon: TitleIcon, items, bottomItems, action, children }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Hamburger Button */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed top-2 left-4 z-50 hover:bg-[hsl(var(--secondary))] bg-[hsl(var(--background))]/50 backdrop-blur-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed md:static inset-y-0 left-0 z-40 w-64 min-h-screen border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col transform transition-transform duration-200 ease-in-out h-full overflow-hidden shadow-xl md:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 pt-16 md:pt-6 shrink-0">
                    <Link href="/portal">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Portal
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center">
                            <TitleIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold">{title}</h2>
                    </div>
                </div>

                {action && (
                    <div className="px-4 pb-4 shrink-0">
                        {action}
                    </div>
                )}

                <Separator className="shrink-0" />

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                        isActive
                                            ? "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-medium"
                                            : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]/50"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.title}
                                </div>
                            </Link>
                        );
                    })}

                    {children && (
                        <div className="mt-6 pt-4 border-t border-[hsl(var(--border))]/50">
                            {children}
                        </div>
                    )}
                </nav>

                {bottomItems && bottomItems.length > 0 && (
                    <div className="p-4 border-t border-[hsl(var(--border))] shrink-0 space-y-1 bg-[hsl(var(--card))]">
                        {bottomItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                            isActive
                                                ? "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-medium"
                                                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]/50"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.title}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </aside>
        </>
    );
}
