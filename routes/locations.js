const express = require("express");
const Location = require("../models/Location");

const router = express.Router();

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/", async (req, res) => {
    try {
        const query = {};
        
        if (req.query.department) {
            const safeDepartment = escapeRegex(req.query.department.trim());
            query.department = { $regex: `^${safeDepartment}$`, $options: "i" };
        }
        
        if (req.query.roomNumber) {
            const safeRoom = escapeRegex(req.query.roomNumber.trim());
            query.roomNumber = { $regex: `^${safeRoom}$`, $options: "i" };
        }

        const locations = await Location.find(query);
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get ("/seed", async (req, res) => {
    try {
        await Location.deleteMany({}); // Clear existing locations

        const locations =  await Location.insertMany([
            { department: "Math", roomNumber: "A521" },
            { department: "Science", roomNumber: "C205" },
            {department: "Science", roomNumber: "C235"},
            { department: "English", roomNumber: "E115" },
            { department: "English", roomNumber: "A102"},
            {department: "Art", roomNumber: "D309"},
            {department: "History", roomNumber: "C547"}
        ]);

        res.json({ message: "Database seeded with sample locations", locations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;