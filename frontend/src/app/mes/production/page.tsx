"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { Activity, TrendingUp, Target, Clock, Loader2, AlertCircle } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ProductionPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/mes/production");
                if (!res.ok) throw new Error("Failed to fetch");
                const result = await res.json();
                setData(result);
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

    if (!data) return null;

    const totalTarget = data.productionLines.reduce((sum: number, l: any) => sum + l.target, 0);
    const totalActual = data.productionLines.reduce((sum: number, l: any) => sum + l.actual, 0);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Production</h1>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
                    Production line output and performance
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Output" value={totalActual.toLocaleString()} icon={Activity} description="units today" />
                <StatCard title="Target" value={totalTarget.toLocaleString()} icon={Target} description="units planned" />
                <StatCard
                    title="Efficiency"
                    value={`${((totalActual / totalTarget) * 100).toFixed(1)}%`}
                    icon={TrendingUp}
                    trend={totalActual >= totalTarget ? "up" : "down"}
                    trendValue={totalActual >= totalTarget ? "On Target" : "Below"}
                />
                <StatCard title="Avg Cycle" value="4.2s" icon={Clock} description="per unit" />
            </div>

            <Card className="border-[hsl(var(--border))]">
                <CardHeader>
                    <CardTitle className="text-base">Hourly Output</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={data.hourlyOutput}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 17%)" />
                            <XAxis dataKey="hour" stroke="hsl(0 0% 45%)" fontSize={12} />
                            <YAxis stroke="hsl(0 0% 45%)" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(0 0% 7%)",
                                    border: "1px solid hsl(0 0% 17%)",
                                    borderRadius: "8px",
                                    color: "hsl(0 0% 98%)",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="output"
                                stroke="hsl(0 0% 85%)"
                                strokeWidth={2}
                                dot={{ fill: "hsl(0 0% 85%)", r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-[hsl(var(--border))]">
                <CardHeader>
                    <CardTitle className="text-base">Production Lines</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[hsl(var(--border))]">
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Line</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Product</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Target</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Actual</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Efficiency</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.productionLines.map((line: any) => (
                                    <tr key={line.line} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--secondary))]/30 transition-colors">
                                        <td className="py-3 px-4 font-medium">{line.line}</td>
                                        <td className="py-3 px-4">{line.product}</td>
                                        <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{line.target}</td>
                                        <td className="py-3 px-4 font-medium">{line.actual}</td>
                                        <td className="py-3 px-4">{line.efficiency}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${line.status === "Ahead"
                                                ? "bg-green-500/10 text-green-400"
                                                : line.status === "Behind"
                                                    ? "bg-red-500/10 text-red-400"
                                                    : "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"
                                                }`}>
                                                {line.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
