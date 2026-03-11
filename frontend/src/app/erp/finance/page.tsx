"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Loader2, AlertCircle } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = [
    "hsl(0 0% 90%)",
    "hsl(0 0% 70%)",
    "hsl(0 0% 50%)",
    "hsl(0 0% 35%)",
    "hsl(0 0% 20%)",
];

export default function FinancePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/erp/finance");
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

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
                    Financial overview and cost analysis
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Income" value={data.stats.totalIncome} icon={DollarSign} trend="up" trendValue="+15.2%" />
                <StatCard title="Total Expenses" value={data.stats.totalExpenses} icon={Wallet} trend="down" trendValue="-3.1%" />
                <StatCard title="Net Profit" value={data.stats.netProfit} icon={TrendingUp} trend="up" trendValue="+22.4%" />
                <StatCard title="Operating Cost" value={data.stats.operatingCost} icon={TrendingDown} trend="neutral" trendValue="Avg" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-[hsl(var(--border))] lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Income vs Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 17%)" />
                                <XAxis dataKey="month" stroke="hsl(0 0% 45%)" fontSize={12} />
                                <YAxis stroke="hsl(0 0% 45%)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(0 0% 7%)",
                                        border: "1px solid hsl(0 0% 17%)",
                                        borderRadius: "8px",
                                        color: "hsl(0 0% 98%)",
                                    }}
                                />
                                <Area type="monotone" dataKey="income" stroke="hsl(0 0% 85%)" fill="hsl(0 0% 85% / 0.1)" strokeWidth={2} />
                                <Area type="monotone" dataKey="expense" stroke="hsl(0 0% 45%)" fill="hsl(0 0% 45% / 0.1)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-[hsl(var(--border))]">
                    <CardHeader>
                        <CardTitle className="text-base">Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={data.costBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="value"
                                    stroke="hsl(0 0% 7%)"
                                    strokeWidth={2}
                                >
                                    {data.costBreakdown.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(0 0% 7%)",
                                        border: "1px solid hsl(0 0% 17%)",
                                        borderRadius: "8px",
                                        color: "hsl(0 0% 98%)",
                                    }}
                                    formatter={(value) => [`${value}%`, ""]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-4">
                            {data.costBreakdown.map((item: any, index: number) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index] }}
                                        />
                                        <span className="text-[hsl(var(--muted-foreground))]">{item.name}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
