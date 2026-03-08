"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("operator");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, userId, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            router.push("/login");
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-lg p-8 flex flex-col"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-[hsl(var(--foreground))]">G.A.P</h1>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm">
                        Generative AI as Personal — Manufacturing Intelligence
                    </p>
                </div>

                {error && (
                    <div className="w-full p-3 mb-6 rounded-md bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="space-y-2 flex flex-col">
                        <label className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">Full Name</label>
                        <input
                            id="reg-name"
                            className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">Username</label>
                        <input
                            id="reg-userId"
                            className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">Password</label>
                        <input
                            id="reg-password"
                            className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <label className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">Role</label>
                        <select
                            id="reg-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                        >
                            <option value="operator">Operator</option>
                            <option value="engineer">Engineer</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        id="reg-submit"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity h-10 px-4 py-2 w-full mt-4"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-[0.7rem] text-[hsl(var(--muted-foreground))] text-center">
                    Offline mode • All data stays local
                </p>

                <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] text-center text-sm text-[hsl(var(--muted-foreground))]">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-[hsl(var(--foreground))] underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
