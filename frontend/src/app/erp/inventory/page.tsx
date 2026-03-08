"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Loader2, AlertCircle } from "lucide-react";

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    in_stock: { label: "In Stock", variant: "default" },
    low_stock: { label: "Low Stock", variant: "secondary" },
    out_of_stock: { label: "Out of Stock", variant: "destructive" },
};

export default function InventoryPage() {
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/erp/inventory");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setItems(data.items);
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

    const filtered = items.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
                        Track materials and components
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                        <Input
                            placeholder="Search inventory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-[hsl(var(--border))]">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{items.length}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Total Items</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[hsl(var(--border))]">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center">
                            <Package className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {items.filter((i) => i.status === "low_stock").length}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Low Stock</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[hsl(var(--border))]">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center">
                            <Package className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {items.filter((i) => i.status === "out_of_stock").length}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Out of Stock</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-[hsl(var(--border))]">
                <CardHeader>
                    <CardTitle className="text-base">Inventory Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[hsl(var(--border))]">
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">ID</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Item Name</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Category</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Stock</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Min Stock</th>
                                    <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--secondary))]/30 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs">{item.id}</td>
                                        <td className="py-3 px-4 font-medium">{item.name}</td>
                                        <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{item.category}</td>
                                        <td className="py-3 px-4">{item.stock} {item.unit}</td>
                                        <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{item.minStock} {item.unit}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant={statusBadge[item.status].variant}>
                                                {statusBadge[item.status].label}
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
