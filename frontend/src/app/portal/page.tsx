"use client";

import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
    Bot,
    BarChart3,
    Cpu,
    ArrowRight,
    Factory,
    LogOut,
    Settings,
    FileText,
} from "lucide-react";

const modules = [
    {
        title: "AI Assistant",
        description:
            "Interact with factory data through natural language. Get production analysis, maintenance predictions, and automated reports.",
        icon: Bot,
        href: "/ai",
        features: ["AI Chat Interface", "Data Analysis", "Report Generation", "Predictive Insights"],
    },
    {
        title: "ERP System",
        description:
            "Business and operational insights. Track production orders, inventory, costs, and revenue in real time.",
        icon: BarChart3,
        href: "/erp/dashboard",
        features: ["Production Orders", "Inventory Tracking", "Cost Analysis", "Revenue Reports"],
    },
    {
        title: "MES System",
        description:
            "Shop-floor monitoring and production management. Monitor machines, track output, and manage equipment alerts.",
        icon: Cpu,
        href: "/mes/dashboard",
        features: ["Machine Monitoring", "Production Lines", "Downtime Tracking", "Equipment Alerts"],
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

export default function PortalPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Header */}
            <header className="border-b border-[hsl(var(--border))]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center shrink-0">
                            <Factory className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">G.A.P</h1>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:block">
                                Manufacturing Intelligence Platform
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/reports")}
                            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2 sm:px-3"
                            title="Reports"
                        >
                            <FileText className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Reports</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/settings")}
                            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2 sm:px-3"
                            title="Settings"
                        >
                            <Settings className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Settings</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2 sm:px-3"
                            title="Sign out"
                        >
                            <LogOut className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Sign out</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl font-bold tracking-tight mb-3">
                        Welcome to G.A.P Portal
                    </h2>
                    <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                        Access your manufacturing intelligence modules. Choose a system to get started.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <motion.div key={module.title} variants={cardVariants}>
                                <Card
                                    className="group cursor-pointer border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))]/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 h-full flex flex-col"
                                    onClick={() => router.push(module.href)}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="w-14 h-14 rounded-xl bg-[hsl(var(--secondary))] flex items-center justify-center mb-4 group-hover:bg-[hsl(var(--foreground))] group-hover:text-[hsl(var(--background))] transition-colors duration-300">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <CardTitle className="text-xl">{module.title}</CardTitle>
                                        <CardDescription className="text-sm leading-relaxed">
                                            {module.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-2 mb-6">
                                            {module.features.map((feature) => (
                                                <div
                                                    key={feature}
                                                    className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"
                                                >
                                                    <div className="w-1 h-1 rounded-full bg-[hsl(var(--muted-foreground))]" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <Separator className="mb-4" />

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors">
                                                Open Module
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </main>
        </div>
    );
}
