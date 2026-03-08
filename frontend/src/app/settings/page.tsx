"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, User, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
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
                            <h1 className="text-lg font-bold tracking-tight">Settings</h1>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:block">
                                Manage your platform preferences
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => router.push("/admin/db")}
                            className="px-3"
                        >
                            <Database className="w-4 h-4 mr-2" />
                            DB Admin
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="grid gap-6">
                    <Card className="border-[hsl(var(--border))]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" /> Account Settings
                            </CardTitle>
                            <CardDescription>Manage your profile and personal preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Settings coming soon.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-[hsl(var(--border))]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Security
                            </CardTitle>
                            <CardDescription>Update your password and secure your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Settings coming soon.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-[hsl(var(--border))]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" /> Notifications
                            </CardTitle>
                            <CardDescription>Configure how you want to be alerted.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Settings coming soon.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
