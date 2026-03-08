"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { ShoppingCart, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    completed: { variant: "default", label: "Completed" },
    in_progress: { variant: "secondary", label: "In Progress" },
    pending: { variant: "outline", label: "Pending" },
    cancelled: { variant: "destructive", label: "Cancelled" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/erp/orders");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setOrders(data.orders);
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
                <h1 className="text-2xl font-bold tracking-tight">Production Orders</h1>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
                    Manage and track production orders
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} />
                <StatCard title="In Progress" value={orders.filter((o) => o.status === "in_progress").length} icon={Clock} />
                <StatCard title="Completed" value={orders.filter((o) => o.status === "completed").length} icon={CheckCircle} />
                <StatCard title="Cancelled" value={orders.filter((o) => o.status === "cancelled").length} icon={XCircle} />
            </div>

            <Card className="border-[hsl(var(--border))]">
                <CardHeader>
                    <CardTitle className="text-base">All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[hsl(var(--border))]">
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Order ID</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Product</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Quantity</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Date</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Priority</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--secondary))]/30 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs">{order.id}</td>
                                        <td className="py-3 px-4 font-medium">{order.product}</td>
                                        <td className="py-3 px-4">{order.qty}</td>
                                        <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{order.date}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-medium ${order.priority === "high" ? "text-red-400" : order.priority === "low" ? "text-[hsl(var(--muted-foreground))]" : ""}`}>
                                                {order.priority.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant={statusConfig[order.status].variant}>
                                                {statusConfig[order.status].label}
                                            </Badge>
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
