"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    Package,
    ShoppingCart,
    DollarSign,
    ArrowRight
} from "lucide-react";

export default function ERPLandingPage() {
    const router = useRouter();

    const modules = [
        {
            title: "Inventory Management",
            description: "Track stock levels, warehouse movements, and procurement.",
            icon: Package,
            href: "/erp/inventory",
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            title: "Order Processing",
            description: "Manage sales orders, shipments, and customer tracking.",
            icon: ShoppingCart,
            href: "/erp/orders",
            color: "bg-purple-500/10 text-purple-500"
        },
        {
            title: "Financial Analytics",
            description: "Monitor revenue, costs, and overall profit margins.",
            icon: DollarSign,
            href: "/erp/finance",
            color: "bg-green-500/10 text-green-500"
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
                    <BarChart3 className="w-3.5 h-3.5" />
                    ERP Enterprise Suite
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-bold tracking-tight"
                >
                    Business Operations Control
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto"
                >
                    Manage your entire manufacturing enterprise from a single interface.
                    Monitor inventory, process orders, and track financial performance in real-time.
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
                            <h2 className="text-2xl font-bold">Consolidated Dashboard</h2>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                Get a high-level view of your business health with our consolidated dashboard.
                                Combine metrics from all ERP modules for faster decision making.
                            </p>
                            <Button onClick={() => router.push("/erp/dashboard")}>
                                View Dashboard
                            </Button>
                        </div>
                        <div className="bg-[hsl(var(--secondary))]/50 flex items-center justify-center p-8">
                            <BarChart3 className="w-32 h-32 text-[hsl(var(--muted-foreground))]/20" />
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
