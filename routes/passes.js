const express = require("express");
const Pass = require("../models/Pass");

const router = express.Router(); 

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/", async (req, res) => {
    try {
        const query = {};
        const passIdInput = req.query.passId || req.query.passid;

        if (passIdInput) {
            const safePassId = escapeRegex(passIdInput.trim());
            query.passId = { $regex: `^${safePassId}$`, $options: "i" };
        }

        if (req.query.status) {
            const safeStatus = escapeRegex(req.query.status.trim());
            query.status = { $regex: `^${safeStatus}$`, $options: "i" };
        }

        const passes = await Pass.find(query);
        res.json(passes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:passId", async (req, res) => {
    try{
        const { passId } = req.params;
        const safePassId = escapeRegex(passId.trim());
        const pass = await Pass.findOne({
            passId: { $regex: `^${safePassId}$`, $options: "i" }
        });

        if(!pass){
            return res.status(404).json({ error: "Pass not found" });
        }
        
        
        return res.json(pass);
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
        const { status: nextStatus } = req.body;
        
        const allowedStatuses = ["requested", "approved and in progress", "completed", "denied"];

        if (!nextStatus || !allowedStatuses.includes(nextStatus)) {
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

        if (!allowedTransitions[pass.status].includes(nextStatus)) {
            return res.status(400).json({ error: "Invalid status transition", from: pass.status, to: nextStatus });
        }

        pass.status = nextStatus;

        if (nextStatus === "approved and in progress" && !pass.approvedAt) {
            pass.approvedAt = new Date();
        }

        if (nextStatus === "completed" || nextStatus === "denied") {
            pass.endedAt = new Date();
        }

        await pass.save();
        return res.json(pass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
