import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "@gap/db";
import chatRouter from "./routes/chat";
import erpRouter from "./routes/erp";
import mesRouter from "./routes/mes";
import adminRouter from "./routes/admin";
import projectsRouter from "./routes/projects";

import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/erp", erpRouter);
app.use("/api/mes", mesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/projects", projectsRouter);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

async function startServer() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.warn("⚠️ MONGODB_URI is not defined in .env.local. Running in MOCK MODE (Database features will be disabled).");
        } else {
            await connectDB(mongoUri);
            console.log("✅ Connected to MongoDB via @gap/db");
        }

        app.listen(port, () => {
            console.log(`🚀 Backend server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        // We still allow the server to start even if DB fails, for the sake of the demo/UI
        app.listen(port, () => {
            console.log(`🚀 Backend server running on http://localhost:${port} (with DB errors)`);
        });
    }
}

startServer();
