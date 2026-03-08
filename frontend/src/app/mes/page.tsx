"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    Cpu,
    Activity,
    Cog,
    AlertTriangle,
    ArrowRight
} from "lucide-react";

export default function MESLandingPage() {
    const router = useRouter();

    const modules = [
        {
            title: "Machine Status",
            description: "Monitor real-time equipment telemetry and OEE metrics.",
            icon: Cog,
            href: "/mes/machines",
            color: "bg-orange-500/10 text-orange-500"
        },
        {
            title: "Production Tracking",
            description: "Track output batches, cycle times, and shift performance.",
            icon: Activity,
            href: "/mes/production",
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            title: "Smart Alerts",
            description: "Manage equipment warnings and system-level notifications.",
            icon: AlertTriangle,
            href: "/mes/alerts",
            color: "bg-red-500/10 text-red-500"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-10">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--secondary))] text-xs font-medium"
                >
                    <Cpu className="w-3.5 h-3.5" />
                    Manufacturing Execution System
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-bold tracking-tight"
                >
                    Shop Floor Intelligence
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto"
                >
                    Bridge the gap between business planning and actual production.
                    Gain deep visibility into equipment performance and production efficiency.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modules.map((module, idx) => (
                    <motion.div
                        key={module.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                        <Card className="h-full border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))]/20 transition-all group">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center mb-4`}>
                                    <module.icon className="w-6 h-6" />
                                </div>
                                <CardTitle>{module.title}</CardTitle>
                                <CardDescription>{module.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between group-hover:bg-[hsl(var(--secondary))]"
                                    onClick={() => router.push(module.href)}
                                >
                                    Access Module
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-10"
            >
                <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="p-8 space-y-4">
                            <h2 className="text-2xl font-bold">Operations Hub</h2>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                A comprehensive view of all production metrics and machine health.
                                Identify bottlenecks and streamline your manufacturing process.
                            </p>
                            <Button onClick={() => router.push("/mes/dashboard")}>
                                Open Command Center
                            </Button>
                        </div>
                        <div className="bg-[hsl(var(--secondary))]/50 flex items-center justify-center p-8">
                            <Activity className="w-32 h-32 text-[hsl(var(--muted-foreground))]/20" />
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
