import { Router } from "express";
import { Client, Task, Team } from "@gap/db";

const router = Router();

// GET /api/erp/clients
router.get("/clients", async (req, res) => {
    try {
        const clients = await Client.find().sort({ companyName: 1 });
        res.json(clients);
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ error: "Failed to fetch clients" });
    }
});

// POST /api/erp/clients
router.post("/clients", async (req, res) => {
    try {
        const newClient = new Client(req.body);
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(500).json({ error: "Failed to create client" });
    }
});

// GET /api/erp/tasks/my
router.get("/tasks/my", async (req, res) => {
    try {
        // Technically this should filter by assigned user if auth was implemented on backend
        // Since we are mocking user sessions on frontend, returning all for demo
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// POST /api/erp/tasks
router.post("/tasks", async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// GET /api/erp/teams
router.get("/teams", async (req, res) => {
    try {
        const teams = await Team.find().populate('memberIds', 'name userId role').sort({ name: 1 });
        res.json(teams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ error: "Failed to fetch teams" });
    }
});

// POST /api/erp/teams
router.post("/teams", async (req, res) => {
    try {
        const newTeam = new Team(req.body);
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ error: "Failed to create team" });
    }
});


// GET /api/erp/dashboard (Keeping existing standard dashboard aggregates for demo)
router.get("/dashboard", async (req, res) => {
    try {
        const totalRevenue = 328000;
        const activeOrders = 182;
        const inventoryItems = 1247;
        const profitMargin = 34.2;

        const revenueData = [
            { month: "Jan", revenue: 45000, cost: 32000 },
            { month: "Feb", revenue: 52000, cost: 34000 },
            { month: "Mar", revenue: 48000, cost: 31000 },
            { month: "Apr", revenue: 61000, cost: 35000 },
            { month: "May", revenue: 55000, cost: 33000 },
            { month: "Jun", revenue: 67000, cost: 37000 },
        ];

        const recentOrders = [
            { id: "ORD-001", product: "Steel Rods", qty: 500, status: "completed", cost: "$12,500" },
            { id: "ORD-002", product: "Copper Sheets", qty: 200, status: "in_progress", cost: "$8,400" },
            { id: "ORD-003", product: "Aluminum Bars", qty: 350, status: "pending", cost: "$7,000" },
            { id: "ORD-004", product: "Iron Pipes", qty: 150, status: "completed", cost: "$4,500" },
            { id: "ORD-005", product: "Brass Fittings", qty: 800, status: "in_progress", cost: "$16,000" },
        ];

        res.json({
            stats: {
                totalRevenue,
                activeOrders,
                inventoryItems,
                profitMargin
            },
            revenueData,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch ERP dashboard data" });
    }
});

// GET /api/erp/inventory (Keep standard mock as there is no Inventory Schema defined yet)
router.get("/inventory", async (req, res) => {
    try {
        const items = [
            { id: "INV-001", name: "Steel Rods (10mm)", category: "Raw Material", stock: 2400, unit: "pcs", minStock: 500, status: "in_stock" },
        ];
        res.json({ items });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch inventory data" });
    }
});

export default router;
