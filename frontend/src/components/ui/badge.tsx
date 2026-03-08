import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "secondary" | "outline" | "destructive";
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variants: Record<string, string> = {
        default:
            "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
        secondary:
            "border-transparent bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]",
        outline: "text-[hsl(var(--foreground))]",
        destructive:
            "border-transparent bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full border border-[hsl(var(--border))] px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    );
});
Badge.displayName = "Badge";

export { Badge };
