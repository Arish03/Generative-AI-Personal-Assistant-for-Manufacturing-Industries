"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle as AlertCircleIcon, Info, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const severityConfig: Record<string, { icon: typeof AlertTriangle; color: string; badge: "destructive" | "secondary" | "outline" | "default"; bg: string }> = {
    critical: { icon: AlertCircleIcon, color: "text-red-400", badge: "destructive", bg: "bg-red-500/10 border-red-500/20" },
    warning: { icon: AlertTriangle, color: "text-yellow-400", badge: "secondary", bg: "bg-yellow-500/10 border-yellow-500/20" },
    info: { icon: Info, color: "text-blue-400", badge: "outline", bg: "bg-blue-500/10 border-blue-500/20" },
    resolved: { icon: CheckCircle, color: "text-green-400", badge: "default", bg: "bg-green-500/10 border-green-500/20" },
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/mes/alerts");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setAlerts(data.alerts);
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

    const activeCritical = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;
    const activeWarning = alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Equipment Alerts</h1>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
                    Monitor and manage equipment notifications
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Card className="border-red-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertCircleIcon className="w-5 h-5 text-red-400" />
                        <div>
                            <p className="text-lg font-bold">{activeCritical}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Critical</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-yellow-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <div>
                            <p className="text-lg font-bold">{activeWarning}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Warning</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[hsl(var(--border))]">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Info className="w-5 h-5 text-blue-400" />
                        <div>
                            <p className="text-lg font-bold">{alerts.filter((a) => a.severity === "info").length}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Information</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-green-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                            <p className="text-lg font-bold">{alerts.filter((a) => a.severity === "resolved").length}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Resolved</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-[hsl(var(--border))]">
                <CardHeader>
                    <CardTitle className="text-base">All Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {alerts.map((alert, index) => {
                        const config = severityConfig[alert.severity];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className={`flex items-start gap-4 p-4 rounded-lg border ${config.bg} ${alert.acknowledged ? "opacity-60" : ""
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mt-0.5 ${config.color} flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{alert.id}</span>
                                        <Badge variant={config.badge}>{alert.severity}</Badge>
                                        <span className="text-xs text-[hsl(var(--muted-foreground))]">• {alert.machine}</span>
                                    </div>
                                    <p className="text-sm">{alert.message}</p>
                                </div>
                                <span className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                                    {alert.time}
                                </span>
                            </motion.div>
                        );
                    })}
                </CardContent>
            </Card>
        </motion.div>
    );
}
