"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { Cpu, LayoutDashboard, Cog, Activity, AlertTriangle } from "lucide-react";

const mesNavItems = [
    { title: "Dashboard", href: "/mes/dashboard", icon: LayoutDashboard },
    { title: "Machines", href: "/mes/machines", icon: Cog },
    { title: "Production", href: "/mes/production", icon: Activity },
    { title: "Alerts", href: "/mes/alerts", icon: AlertTriangle },
];

export default function MESLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[hsl(var(--background))] overflow-hidden">
            <Sidebar title="MES System" icon={Cpu} items={mesNavItems} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopHeader />
                <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
