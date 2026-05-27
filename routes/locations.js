const express = require("express");
const Location = require("../models/Location");

const router = express.Router();

/**
 * Escape user input when constructing RegExp queries for Mongo.
 * Helpful for safely supporting case-insensitive filtering from query params.
 */
// Escapes special regex characters in a string
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 
 * Locations API
 *
 * GET /api/locations
 * Query params (optional):
 *  - department (string)
 *  - roomNumber (string)
 * Response: 200 OK -> Array of location objects
 * Example: GET /api/locations?department=Science
 * Example response: [{ department: "Science", roomNumber: "C205" }]
 *
 * Seed route (commented out): GET /api/locations/seed
 *   - WARNING: the seed route clears existing locations before inserting sample data
 * Response codes:
 *  - 200 OK -> array
 *  - 500 Internal Server Error
*/

// Fetches the locations based on the department and/or room number (case-insensitive) by querying the database. If no query parameters are provided, it returns all locations.
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

// Seeds the database with sample locations for testing purposes. It first clears any existing locations and then inserts a predefined set of locations into the database.
/*router.get ("/seed", async (req, res) => {
    try {
        await Location.deleteMany({}); // Clear existing locations

        const locations =  await Location.insertMany([
            { department: "Math", roomNumber: "A521" },
            { department: "Science", roomNumber: "C205" },
            {department: "Science", roomNumber: "C235"},
            { department: "English", roomNumber: "E115" },
            { department: "English", roomNumber: "A102"},
            {department: "Art", roomNumber: "D309"},
            {department: "History", roomNumber: "C547"},
            {department: "Office", roomNumber: "Main Office"},
            {department: "Office", roomNumber: "Nurse's Office"}
        ]);

        res.json({ message: "Database seeded with sample locations", locations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/

module.exports = router;