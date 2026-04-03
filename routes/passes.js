const express = require("express");
const Pass = require("../models/Pass");

const router = express.Router(); 

router.get("/", async (req, res) => {
    try {
        const passes = await Pass.find();
        res.json(passes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { passId, studentId, studentName, teacherId, teacherName, fromLocation, toLocation, reason } = req.body;

        if (!passId || !studentId || !studentName || !teacherId || !teacherName || !fromLocation || !toLocation) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const pass = await Pass.create({
            passId,
            studentId,
            studentName,
            teacherId,
            teacherName,
            fromLocation,
            toLocation,
            reason,
            status: "requested"
        });

        return res.status(201).json(pass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:passId/status", async (req, res) => {
    try {
        const { passId } = req.params;
        const { status: NextStatus } = req.body;
        
        const allowedStatuses = ["requested", "approved and in progress", "completed", "denied"];

        if (!nextStatus || !allowedStatuses.includes(NextStatus)) {
            return res.status(400).json({ error: "Invalid or missing status" });    
        }

        const pass = await Pass.findOne({ passId});
        if (!pass) {
            return res.status(404).json({ error: "Pass not found" });
        }

        const allowedTransitions = {
            "requested": ["approved and in progress", "denied"],
            "approved and in progress": ["completed", "denied"],
            "completed": [],
            "denied": []
        };

        if (!allowedTransitions[pass.status].includes(NextStatus)) {
            return res.status(400).json({ error: "Invalid status transition", from: pass.status, to: NextStatus });
        }

        pass.status = NextStatus;

        if (NextStatus === "approved and in progress" && !pass.approvedAt) {
            pass.approvedAt = new Date();
        }

        if (NextStatus === "completed" || nextStatus === "denied") {
            pass.endedAt = new Date();
        }

        await pass.save();
        return res.json(pass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
