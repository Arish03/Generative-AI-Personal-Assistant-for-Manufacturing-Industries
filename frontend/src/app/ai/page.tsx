"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Loader2, Sparkles, AlertCircle, X } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch response");
            }

            const data = await res.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content || "Sorry, I could not process your request.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            setError("Connection error. Please check your backend and network configuration.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[hsl(var(--background))] overflow-hidden absolute inset-0">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-500/10 border-b border-red-500/20 text-red-500 px-6 py-2 text-sm flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setError(null)} className="h-6 w-6 text-red-500 hover:bg-red-500/20">
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {/* Chat Area */}
            <ScrollArea className="flex-1 px-4 lg:px-8 bg-[hsl(var(--background))]">
                <div className="py-8 space-y-6 max-w-4xl mx-auto w-full">
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--secondary))] flex items-center justify-center mb-6">
                                <Sparkles className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">
                                Manufacturing AI Assistant
                            </h2>
                            <p className="text-[hsl(var(--muted-foreground))] max-w-md text-sm">
                                Ask me about production efficiency, machine performance,
                                maintenance schedules, or generate reports.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8 max-w-lg">
                                {[
                                    "Show today's production efficiency",
                                    "Which machine had the highest downtime?",
                                    "Generate a weekly maintenance report",
                                    "Analyze production costs this month",
                                ].map((query) => (
                                    <button
                                        key={query}
                                        onClick={() => setInput(query)}
                                        className="text-left text-xs p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))]/20 transition-colors"
                                    >
                                        {query}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"
                                        : "bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                    <p className={`text-[10px] mt-2 ${msg.role === "user"
                                        ? "text-[hsl(var(--background))]/50"
                                        : "text-[hsl(var(--muted-foreground))]"
                                        }`}>
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--foreground))] flex items-center justify-center flex-shrink-0 mt-1">
                                        <User className="w-4 h-4 text-[hsl(var(--background))]" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center mt-1">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl px-4 py-3 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-1" />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shrink-0">
                <div className="max-w-4xl mx-auto flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about production, machines, or reports..."
                        className="flex-1"
                        disabled={loading}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        size="icon"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
