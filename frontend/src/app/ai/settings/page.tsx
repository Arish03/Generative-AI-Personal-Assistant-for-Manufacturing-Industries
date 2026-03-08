"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Bot } from "lucide-react";

export default function AISettingsPage() {
    return (
        <div className="p-8 space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">AI Settings</h2>
                <p className="text-[hsl(var(--muted-foreground))]">Manage AI assistant parameters and data access.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-[hsl(var(--border))]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="w-5 h-5" /> Provider Configuration
                        </CardTitle>
                        <CardDescription>Azure OpenAI endpoint and deployment details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Managed via environment variables.</p>
                    </CardContent>
                </Card>

                <Card className="border-[hsl(var(--border))]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Data Access
                        </CardTitle>
                        <CardDescription>Control which factory data sources the AI can read.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">All MES and ERP streams connected.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
