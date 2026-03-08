"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { Bot, MessageSquare, Settings, Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const aiNavItems = [
    { title: "Chat", href: "/ai", icon: MessageSquare },
];

const aiBottomItems = [
    { title: "Settings", href: "/ai/settings", icon: Settings },
];

export default function AILayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[hsl(var(--background))] overflow-hidden">
            <Sidebar 
                title="AI Assistant" 
                icon={Bot} 
                items={aiNavItems}
                bottomItems={aiBottomItems}
                action={
                    <Button className="w-full gap-2 justify-start shadow-sm" variant="default" onClick={() => window.location.href = '/ai'}>
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Button>
                }
            >
                <div className="px-1 py-1">
                    <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mb-3 uppercase tracking-wider pl-2">Recent Chats</h3>
                    <div className="space-y-1">
                        <div className="text-sm px-3 py-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]/50 hover:text-[hsl(var(--foreground))] cursor-pointer truncate transition-colors flex items-center">
                            <MessageCircle className="w-3.5 h-3.5 mr-2.5 opacity-70 flex-shrink-0" />
                            Production efficiency...
                        </div>
                        <div className="text-sm px-3 py-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]/50 hover:text-[hsl(var(--foreground))] cursor-pointer truncate transition-colors flex items-center">
                            <MessageCircle className="w-3.5 h-3.5 mr-2.5 opacity-70 flex-shrink-0" />
                            Machine downtime details
                        </div>
                        <div className="text-sm px-3 py-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]/50 hover:text-[hsl(var(--foreground))] cursor-pointer truncate transition-colors flex items-center">
                            <MessageCircle className="w-3.5 h-3.5 mr-2.5 opacity-70 flex-shrink-0" />
                            Generate weekly schedule
                        </div>
                    </div>
                </div>
            </Sidebar>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopHeader />
                <main className="flex-1 overflow-auto bg-[hsl(var(--background))] relative flex flex-col">{children}</main>
            </div>
        </div>
    );
}
