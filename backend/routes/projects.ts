import { Router } from "express";
import { Project } from "@gap/db";

const router = Router();

// GET /api/projects - Find all projects
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// POST /api/projects - Create a new project
router.post("/", async (req, res) => {
    try {
        const { name, clientName, status, priority, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Project name is required" });
        }

        const newProject = new Project({
            name,
            clientId: clientName ? { companyName: clientName } : undefined,
            status: status || "planning",
            priority: priority || "medium",
            description,
            completionPercent: 0
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project" });
    }
});

export default router;
