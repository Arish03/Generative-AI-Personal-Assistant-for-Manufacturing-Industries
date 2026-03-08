"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default function ReportsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Header */}
            <header className="border-b border-[hsl(var(--border))]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/portal")}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Reports</h1>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:block">
                                Generate and view system reports
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="default" size="sm" className="px-3">
                            <Download className="w-4 h-4 mr-2" />
                            Export All
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder Report Cards */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="border-[hsl(var(--border))] flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                                    Monthly Summary 0{i}
                                </CardTitle>
                                <CardDescription>Auto-generated AI report analyzing production metrics.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-end">
                                <Button variant="outline" className="w-full mt-4">
                                    View Report
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
