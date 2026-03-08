"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    Database,
    RefreshCcw,
    DatabaseZap,
    Trash2,
    CheckCircle2,
    Loader2,
    ArrowLeft
} from "lucide-react";

interface DBStats {
    users: number;
    machines: number;
    productionLogs: number;
    erpRecords: number;
    dbStatus: string;
}

export default function DBAdminPage() {
    const [stats, setStats] = useState<DBStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const router = useRouter();

    const fetchStats = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/admin/db-stats");
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAction = async (endpoint: string, actionName: string) => {
        setActionLoading(actionName);
        try {
            await fetch(`http://localhost:4000/api/admin/${endpoint}`);
            await fetchStats();
        } catch (error) {
            console.error(`Action ${actionName} failed`, error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Database Administration</h1>
                            <p className="text-[hsl(var(--muted-foreground))]">Monitor and manage the G.A.P system database.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        System Online
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <Card key={i} className="animate-pulse border-[hsl(var(--border))] h-24" />
                        ))
                    ) : (
                        <>
                            <Card className="border-[hsl(var(--border))]">
                                <CardHeader className="p-4 pb-0">
                                    <CardDescription>Users</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-1">
                                    <span className="text-2xl font-bold">{stats?.users ?? 0}</span>
                                </CardContent>
                            </Card>
                            <Card className="border-[hsl(var(--border))]">
                                <CardHeader className="p-4 pb-0">
                                    <CardDescription>Machines</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-1">
                                    <span className="text-2xl font-bold">{stats?.machines ?? 0}</span>
                                </CardContent>
                            </Card>
                            <Card className="border-[hsl(var(--border))]">
                                <CardHeader className="p-4 pb-0">
                                    <CardDescription>Production Logs</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-1">
                                    <span className="text-2xl font-bold">{stats?.productionLogs ?? 0}</span>
                                </CardContent>
                            </Card>
                            <Card className="border-[hsl(var(--border))]">
                                <CardHeader className="p-4 pb-0">
                                    <CardDescription>ERP Records</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-1">
                                    <span className="text-2xl font-bold">{stats?.erpRecords ?? 0}</span>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-[hsl(var(--border))]">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <DatabaseZap className="w-5 h-5" /> Data Management
                            </CardTitle>
                            <CardDescription>Populate or reset database collections.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-[hsl(var(--secondary))]/30 border border-[hsl(var(--border))]">
                                <div>
                                    <p className="text-sm font-medium">Seed Sample Data</p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Populate with manufacturing & business records.</p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleAction("seed", "seed")}
                                    disabled={actionLoading === "seed"}
                                >
                                    {actionLoading === "seed" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Seed Data"}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500">
                                <div>
                                    <p className="text-sm font-medium">Reset Data</p>
                                    <p className="text-xs opacity-70">Clear all records except system users.</p>
                                </div>
                                <Button size="sm" variant="destructive" disabled>
                                    Clear All
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[hsl(var(--border))]">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <RefreshCcw className="w-5 h-5" /> Connection Health
                            </CardTitle>
                            <CardDescription>Real-time database connection status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[hsl(var(--muted-foreground))]">Status</span>
                                    <span className="font-medium">{stats?.dbStatus ?? "Unknown"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[hsl(var(--muted-foreground))]">API Endpoint</span>
                                    <span className="font-mono text-xs">http://localhost:4000</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" onClick={fetchStats} disabled={loading}>
                                <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh Status
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
