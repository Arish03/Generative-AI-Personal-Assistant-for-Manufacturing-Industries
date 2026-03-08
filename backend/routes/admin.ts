import { Router } from "express";
import mongoose from "mongoose";
import User from "@gap/db/models/User";
import Machine from "@gap/db/models/Machine";
import Production from "@gap/db/models/Production";
import ERPRecord from "@gap/db/models/ERPRecord";

const router = Router();

// GET /api/admin/db-stats
router.get("/db-stats", async (req, res) => {
    try {
        const stats = {
            users: await User.countDocuments(),
            machines: await Machine.countDocuments(),
            productionLogs: await Production.countDocuments(),
            erpRecords: await ERPRecord.countDocuments(),
            dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch DB stats" });
    }
});

// POST /api/admin/seed
router.get("/seed", async (req, res) => {
    try {
        // Simple seed logic for demonstration
        const machineCount = await Machine.countDocuments();
        if (machineCount === 0) {
            await Machine.create([
                { name: "CNC-01", type: "CNC Mill", status: "active", location: "Zone A" },
                { name: "CNC-02", type: "CNC Mill", status: "idle", location: "Zone A" },
                { name: "WLD-01", type: "Welding Robot", status: "active", location: "Zone B" },
            ]);
        }
        res.json({ message: "Database seeded successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to seed database" });
    }
});

export default router;
