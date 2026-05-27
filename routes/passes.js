const express = require("express");
const Pass = require("../models/Pass");

const router = express.Router(); 

/**
 * Escape user-provided input to safely include in a RegExp pattern.
 * Usage: const safe = escapeRegex(userInput); query.field = { $regex: safe, $options: 'i' }
 * Note: this helps avoid unintended regex metacharacter behavior but does not
 * prevent broad scans or performance issues on large collections.
 */
// Escapes special regex characters in a string
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 
 * Passes API
 *
 * Endpoints:
 * - GET /api/passes
 *   Query params:
 *     - passId (optional): exact or partial pass id (case-insensitive)
 *     - status (optional): pass status filter (case-insensitive)
 *   Response: 200 OK -> Array of pass objects
 *   Example: GET /api/passes?status=requested
 *   Example response: [{ passId: "Pass-1610000000000", studentId: "S001", studentName: "Jane Doe", teacherId: "T001", teacherName: "John Doe", fromLocation: "A521", toLocation: "C205", status: "requested", createdAt: "..." }]
 *
 * - GET /api/passes/:passId
 *   Path param: passId (required)
 *   Response: 200 OK -> pass object, 404 Not Found if missing
 *   Example: GET /api/passes/Pass-1610000000000
 *
 * - POST /api/passes
 *   Body (JSON): { passId, studentId, studentName, teacherId, teacherName, fromLocation, toLocation, reason? }
 *   Response codes:
 *     - 201 Created -> returns created pass object
 *     - 400 Bad Request -> missing required fields
 *     - 500 Internal Server Error
 *   Example request body:
 *   {
 *     "passId": "Pass-1610000000000",
 *     "studentId": "S001",
 *     "studentName": "Jane Doe",
 *     "teacherId": "T001",
 *     "teacherName": "John Doe",
 *     "fromLocation": "A521",
 *     "toLocation": "C205",
 *     "reason": "Bathroom"
 *   }
 *
 * - PATCH /api/passes/:passId/status
 *   Body (JSON): { status }
 *   Allowed statuses: "requested", "approved and in progress", "completed", "denied"
 *   Valid transitions:
 *      - "requested" -> "approved and in progress" -> "completed" or "requested" -> "denied"
 *   Valid transitions are enforced (see above). Response codes:
 *     - 200 OK -> updated pass
 *     - 400 Bad Request -> invalid status or invalid transition
 *     - 404 Not Found -> pass not found
 *     - 500 Internal Server Error
*/

// Fetches the passes based on the pass ID and/or status (case-insensitive) by querying the database. If no query parameters are provided, it returns all passes.
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

// Fetches a specific pass based on the pass ID (case-insensitive) by querying the database. If the pass is not found, it returns a 404 error.
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

// Creates a new pass in the database with the provided details. It requires the pass ID, student ID, student name, teacher ID, teacher name, from location, and to location. If any of these required fields are missing, it returns a 400 error. Upon successful creation, it returns the newly created pass with a 201 status code.
router.post("/", async (req, res) => {
    try {
        const { passId, studentId, studentName, teacherId, teacherName, fromLocation, toLocation, reason } = req.body;

        if (!passId || !studentId || !studentName || !teacherId || !teacherName || !fromLocation || !toLocation) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // TODO: Consider enforcing uniqueness of passId at the DB level and
        // handling duplicate-key errors here to return a 409 Conflict.
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

// Updates the status of a specific pass based on the pass ID. It checks for valid status transitions and updates the approvedAt and endedAt timestamps accordingly. If the pass is not found or if the status transition is invalid, it returns appropriate error messages.
router.patch("/:passId/status", async (req, res) => {
    try {
        const { passId } = req.params;
        const { status: nextStatus } = req.body;
        
        // TODO: Consider centralizing status values into an enum/const module so
        // both frontend and backend import the canonical list, avoiding typos.
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
