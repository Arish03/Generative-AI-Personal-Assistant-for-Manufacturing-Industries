import { Router } from "express";
import Machine from "@gap/db/models/Machine";
import Production from "@gap/db/models/Production";

const router = Router();

// GET /api/mes/dashboard
router.get("/dashboard", async (req, res) => {
    try {
        const activeMachines = "12/15";
        const todayOutput = 3210;
        const activeAlerts = 3;
        const avgCycleTime = "4.2s";

        const productionByShift = [
            { shift: "Morning", output: 1240 },
            { shift: "Afternoon", output: 1080 },
            { shift: "Night", output: 890 },
        ];

        const machineUtilization = [
            { name: "OEE", value: 78, fill: "hsl(0 0% 85%)" },
        ];

        const recentActivity = [
            { time: "14:32", event: "Machine CNC-03 started production batch #2847", type: "info" },
            { time: "14:15", event: "Shift handover completed - Afternoon shift", type: "info" },
            { time: "13:58", event: "Machine WLD-01 temperature warning", type: "warning" },
            { time: "13:45", event: "Production batch #2846 completed - 250 units", type: "success" },
            { time: "13:30", event: "Maintenance scheduled for PRE-02 at 18:00", type: "info" },
        ];

        res.json({
            stats: {
                activeMachines,
                todayOutput,
                activeAlerts,
                avgCycleTime
            },
            productionByShift,
            machineUtilization,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch MES dashboard data" });
    }
});

// GET /api/mes/machines
router.get("/machines", async (req, res) => {
    try {
        const machines = [
            { id: "CNC-01", name: "CNC Lathe Alpha", type: "CNC Lathe", location: "Hall A", status: "running", uptime: "98.2%" },
            { id: "CNC-02", name: "CNC Mill Beta", type: "CNC Mill", location: "Hall A", status: "running", uptime: "95.7%" },
            { id: "CNC-03", name: "CNC Lathe Gamma", type: "CNC Lathe", location: "Hall A", status: "idle", uptime: "87.3%" },
            { id: "WLD-01", name: "Welder Station 1", type: "Welding", location: "Hall B", status: "running", uptime: "92.1%" },
            { id: "WLD-02", name: "Welder Station 2", type: "Welding", location: "Hall B", status: "maintenance", uptime: "75.0%" },
            { id: "PRE-01", name: "Press Machine A", type: "Press", location: "Hall C", status: "running", uptime: "96.5%" },
            { id: "PRE-02", name: "Press Machine B", type: "Press", location: "Hall C", status: "offline", uptime: "0%" },
            { id: "DRL-01", name: "Drill Station 1", type: "Drill", location: "Hall A", status: "running", uptime: "94.8%" },
            { id: "GRD-01", name: "Grinder Pro X1", type: "Grinder", location: "Hall B", status: "running", uptime: "91.3%" },
            { id: "INJ-01", name: "Injection Molder 1", type: "Injection", location: "Hall D", status: "running", uptime: "97.1%" },
            { id: "INJ-02", name: "Injection Molder 2", type: "Injection", location: "Hall D", status: "idle", uptime: "88.9%" },
            { id: "3DP-01", name: "3D Printer Lab", type: "3D Printer", location: "Hall E", status: "running", uptime: "99.1%" },
            { id: "ASM-01", name: "Assembly Line 1", type: "Assembly", location: "Hall F", status: "running", uptime: "93.4%" },
            { id: "ASM-02", name: "Assembly Line 2", type: "Assembly", location: "Hall F", status: "maintenance", uptime: "80.2%" },
            { id: "PKG-01", name: "Packaging Unit 1", type: "Packaging", location: "Hall G", status: "running", uptime: "96.0%" },
        ];
        res.json({ machines });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch machines data" });
    }
});

// GET /api/mes/production
router.get("/production", async (req, res) => {
    try {
        const hourlyOutput = [
            { hour: "06:00", output: 120 },
            { hour: "07:00", output: 145 },
            { hour: "08:00", output: 180 },
            { hour: "09:00", output: 200 },
            { hour: "10:00", output: 190 },
            { hour: "11:00", output: 175 },
            { hour: "12:00", output: 140 },
            { hour: "13:00", output: 160 },
            { hour: "14:00", output: 195 },
            { hour: "15:00", output: 185 },
        ];
        const productionLines = [
            { line: "Line A", product: "Steel Brackets", target: 500, actual: 478, efficiency: "95.6%", status: "On Track" },
            { line: "Line B", product: "Motor Casings", target: 300, actual: 312, efficiency: "104%", status: "Ahead" },
            { line: "Line C", product: "Copper Connectors", target: 800, actual: 720, efficiency: "90%", status: "Behind" },
            { line: "Line D", product: "Aluminum Frames", target: 200, actual: 198, efficiency: "99%", status: "On Track" },
            { line: "Line E", product: "Plastic Housings", target: 1000, actual: 850, efficiency: "85%", status: "Behind" },
        ];
        res.json({ hourlyOutput, productionLines });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch production data" });
    }
});

// GET /api/mes/alerts
router.get("/alerts", async (req, res) => {
    try {
        const alerts = [
            { id: "ALR-001", severity: "critical", machine: "PRE-02", message: "Hydraulic pressure below safe threshold — machine offline", time: "10 min ago", acknowledged: false },
            { id: "ALR-002", severity: "warning", machine: "WLD-01", message: "Temperature reading 15% above normal operating range", time: "28 min ago", acknowledged: false },
            { id: "ALR-003", severity: "warning", machine: "ASM-02", message: "Scheduled maintenance overdue by 2 days", time: "1 hour ago", acknowledged: false },
            { id: "ALR-004", severity: "info", machine: "CNC-03", message: "Spindle bearing wear detected — schedule replacement within 2 weeks", time: "2 hours ago", acknowledged: true },
            { id: "ALR-005", severity: "resolved", machine: "INJ-02", message: "Injection pressure normalized after calibration", time: "3 hours ago", acknowledged: true },
            { id: "ALR-006", severity: "info", machine: "DRL-01", message: "Drill bit usage at 85% lifecycle — replacement recommended soon", time: "4 hours ago", acknowledged: true },
            { id: "ALR-007", severity: "resolved", machine: "GRD-01", message: "Vibration anomaly resolved after belt tensioning", time: "5 hours ago", acknowledged: true },
            { id: "ALR-008", severity: "warning", machine: "PKG-01", message: "Packaging seal temperature fluctuating — monitor closely", time: "6 hours ago", acknowledged: true },
        ];
        res.json({ alerts });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch alerts data" });
    }
});

export default router;
