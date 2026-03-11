"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
    completed: "default",
    in_progress: "secondary",
    pending: "outline",
};

export default function ERPDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/erp/dashboard");
                if (!res.ok) throw new Error("Failed to fetch dashboard data");
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching ERP dashboard data:", error);
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
                <h1 className="text-2xl font-bold tracking-tight">ERP Dashboard</h1>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">Business operations overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={`$${data.stats.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="up" trendValue="+12.5%" />
                <StatCard title="Active Orders" value={data.stats.activeOrders.toString()} icon={ShoppingCart} trend="up" trendValue="+8.2%" />
                <StatCard title="Inventory Items" value={data.stats.inventoryItems.toLocaleString()} icon={Package} trend="neutral" trendValue="0%" />
                <StatCard title="Profit Margin" value={`${data.stats.profitMargin}%`} icon={TrendingUp} trend="up" trendValue="+2.1%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-[hsl(var(--border))]">
                    <CardHeader><CardTitle className="text-base">Revenue vs Cost</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 17%)" />
                                <XAxis dataKey="month" stroke="hsl(0 0% 45%)" fontSize={12} />
                                <YAxis stroke="hsl(0 0% 45%)" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 17%)", borderRadius: "8px", color: "hsl(0 0% 98%)" }} />
                                <Bar dataKey="revenue" fill="hsl(0 0% 85%)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="cost" fill="hsl(0 0% 35%)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-[hsl(var(--border))]">
                    <CardHeader><CardTitle className="text-base">Weekly Orders</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={[{ week: "W1", orders: 42 }, { week: "W2", orders: 38 }, { week: "W3", orders: 55 }, { week: "W4", orders: 47 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 17%)" />
                                <XAxis dataKey="week" stroke="hsl(0 0% 45%)" fontSize={12} />
                                <YAxis stroke="hsl(0 0% 45%)" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 17%)", borderRadius: "8px", color: "hsl(0 0% 98%)" }} />
                                <Line type="monotone" dataKey="orders" stroke="hsl(0 0% 85%)" strokeWidth={2} dot={{ fill: "hsl(0 0% 85%)", r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-[hsl(var(--border))]">
                <CardHeader><CardTitle className="text-base">Recent Orders</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[hsl(var(--border))]">
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Order ID</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Product</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Quantity</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Cost</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders.map((order: any) => (
                                    <tr key={order.id} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--secondary))]/30 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs">{order.id}</td>
                                        <td className="py-3 px-4">{order.product}</td>
                                        <td className="py-3 px-4">{order.qty}</td>
                                        <td className="py-3 px-4">{order.cost}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant={statusColors[order.status]}>
                                                {order.status.replace("_", " ")}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.status === "completed" ? (
                                                <ArrowUpRight className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                            )}
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
