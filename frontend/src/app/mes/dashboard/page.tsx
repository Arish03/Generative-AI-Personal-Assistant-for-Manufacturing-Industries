"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Cpu, Activity, AlertTriangle, Clock, Gauge, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const typeColors: Record<string, string> = {
    info: "bg-[hsl(var(--secondary))]",
    warning: "bg-yellow-500/20",
    success: "bg-green-500/20",
};

export default function MESDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/mes/dashboard");
                if (!res.ok) throw new Error("Failed to fetch");
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch MES data", error);
                setError("Unable to connect to the backend server. Please ensure the backend is running at http://localhost:4000");
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
                <p className="text-[hsl(var(--muted-foreground))] max-w-md">
                    {error}
                </p>
                <Button className="mt-6" onClick={() => window.location.reload()}>
                    Retry Connection
                </Button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">MES Dashboard</h1>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">Shop floor monitoring overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Active Machines" value={data.stats.activeMachines} icon={Cpu} trend="up" trendValue="80%" />
                <StatCard title="Today's Output" value={data.stats.todayOutput.toLocaleString()} icon={Activity} description="units produced" />
                <StatCard title="Active Alerts" value={data.stats.activeAlerts.toString()} icon={AlertTriangle} trend="down" trendValue="-2" />
                <StatCard title="Avg Cycle Time" value={data.stats.avgCycleTime} icon={Clock} trend="up" trendValue="-0.3s" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-[hsl(var(--border))] lg:col-span-2">
                    <CardHeader><CardTitle className="text-base">Production by Shift</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.productionByShift}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 17%)" />
                                <XAxis dataKey="shift" stroke="hsl(0 0% 45%)" fontSize={12} />
                                <YAxis stroke="hsl(0 0% 45%)" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 17%)", borderRadius: "8px", color: "hsl(0 0% 98%)" }} />
                                <Bar dataKey="output" fill="hsl(0 0% 85%)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-[hsl(var(--border))]">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Gauge className="w-4 h-4" />Overall OEE</CardTitle></CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={180}>
                            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={12} data={data.machineUtilization} startAngle={180} endAngle={0}>
                                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "hsl(0 0% 14%)" }} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <p className="text-3xl font-bold -mt-16">{data.machineUtilization[0].value}%</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Equipment Effectiveness</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-[hsl(var(--border))]">
                <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.recentActivity.map((item: any, index: number) => (
                            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-start gap-3 text-sm">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${typeColors[item.type]}`} />
                                <div className="flex-1"><p>{item.event}</p></div>
                                <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono whitespace-nowrap">{item.time}</span>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
