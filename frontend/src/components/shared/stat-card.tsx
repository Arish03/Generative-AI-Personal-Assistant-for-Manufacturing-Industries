import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendValue,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6",
                className
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{title}</p>
                <Icon className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    {description && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                            {description}
                        </p>
                    )}
                </div>
                {trend && trendValue && (
                    <span
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded",
                            trend === "up" && "bg-green-500/10 text-green-400",
                            trend === "down" && "bg-red-500/10 text-red-400",
                            trend === "neutral" && "bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]"
                        )}
                    >
                        {trendValue}
                    </span>
                )}
            </div>
        </div>
    );
}
