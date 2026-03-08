"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

const statusConfig: Record<string, { color: string; label: string; dot: string }> = {
    running: { color: "default", label: "Running", dot: "bg-green-400" },
    idle: { color: "secondary", label: "Idle", dot: "bg-yellow-400" },
    maintenance: { color: "outline", label: "Maintenance", dot: "bg-orange-400" },
    offline: { color: "destructive", label: "Offline", dot: "bg-red-400" },
};

export default function MachinesPage() {
    const [machines, setMachines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/mes/machines");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setMachines(data.machines);
            } catch {
                setError("Unable to connect to the backend server.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--muted-foreground))]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                <p className="text-[hsl(var(--muted-foreground))] max-w-md">{error}</p>
                <Button className="mt-6" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Machines</h1>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
                    Monitor all machine statuses
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {Object.entries(statusConfig).map(([key, config]) => {
                    const count = machines.filter((m) => m.status === key).length;
                    return (
                        <Card key={key} className="border-[hsl(var(--border))]">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${config.dot}`} />
                                <div>
                                    <p className="text-lg font-bold">{count}</p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{config.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {machines.map((machine, index) => (
                    <motion.div
                        key={machine.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <Card className="border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))]/20 transition-colors">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold">{machine.name}</p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono">{machine.id}</p>
                                    </div>
                                    <Badge variant={statusConfig[machine.status].color as "default" | "secondary" | "outline" | "destructive"}>
                                        {statusConfig[machine.status].label}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
                                    <div className="flex justify-between">
                                        <span>Type</span>
                                        <span className="text-[hsl(var(--foreground))]">{machine.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Location</span>
                                        <span className="text-[hsl(var(--foreground))]">{machine.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Uptime</span>
                                        <span className="text-[hsl(var(--foreground))] font-medium">{machine.uptime}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
