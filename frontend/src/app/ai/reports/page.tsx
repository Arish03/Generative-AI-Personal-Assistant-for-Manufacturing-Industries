"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export default function AIReportsPage() {
    return (
        <div className="p-8 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">AI Generated Reports</h2>
                    <p className="text-[hsl(var(--muted-foreground))]">Automatically synthesized reports based on factory data.</p>
                </div>
                <Button variant="default" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-[hsl(var(--border))] flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                                AI Insights 0{i}
                            </CardTitle>
                            <CardDescription>Synthesized production insights identifying inefficiencies.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end">
                            <Button variant="outline" className="w-full mt-4">
                                View Full Report
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
