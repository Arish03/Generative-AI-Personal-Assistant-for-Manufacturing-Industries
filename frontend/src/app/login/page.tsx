"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // using username as userId for next-auth credentials
            const result = await signIn("credentials", {
                userId: username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid Username or password");
            } else {
                router.push("/portal");
            }
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
                        <label className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">Username</label>
                        <input
                            id="login-username"
                            className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">Password</label>
                        <input
                            id="login-password"
                            className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button
                        id="login-submit"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity h-10 px-4 py-2 w-full mt-4"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-[0.7rem] text-[hsl(var(--muted-foreground))] text-center">
                    Offline mode • All data stays local
                </p>

                <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] text-center text-sm text-[hsl(var(--muted-foreground))]">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-[hsl(var(--foreground))] underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                        Register
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
