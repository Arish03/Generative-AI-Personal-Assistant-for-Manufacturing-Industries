"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { BarChart3, LayoutDashboard, Package, ShoppingCart, DollarSign, FolderKanban, Database } from "lucide-react";

const erpNavItems = [
    { title: "Dashboard", href: "/erp/dashboard", icon: LayoutDashboard },
    { title: "Projects", href: "/erp/projects", icon: FolderKanban },
    { title: "Data Feed", href: "/erp/data-feed", icon: Database },
    { title: "Inventory", href: "/erp/inventory", icon: Package },
    { title: "Orders", href: "/erp/orders", icon: ShoppingCart },
    { title: "Finance", href: "/erp/finance", icon: DollarSign },
];

export default function ERPLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[hsl(var(--background))] overflow-hidden">
            <Sidebar title="ERP System" icon={BarChart3} items={erpNavItems} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopHeader />
                <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
