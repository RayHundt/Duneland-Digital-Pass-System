const express = require("express");
const Teacher = require("../models/Teacher");

const router = express.Router();

/**
 * Escape user-provided input to safely include in a RegExp pattern.
 * Use when building case-insensitive Mongo regex queries from query params.
 */
// Escapes special regex characters in a string
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 
 * Teachers API
 *
 * GET /api/teachers
 * Query params (optional):
 *  - department (string): exact department match (case-insensitive)
 *  - name / firstName / lastName: search by name (partial or full)
 *  - roomNumber: exact room number (case-insensitive)
 * Response: 200 OK -> Array of teacher objects
 * Example: GET /api/teachers?department=Science
 * Example response: [{ teacherId: "T003", firstName: "Emily", lastName: "Ramber", department: "Science", subjects: ["Biology","Chemistry"], roomNumber: "C205" }]
 *
 * Seed route (commented out): GET /api/teachers/seed
 *   - WARNING: the seed route clears existing teachers before inserting sample data
 * Response codes:
 *  - 200 OK -> array (or single object depending on endpoint)
 *  - 500 Internal Server Error
*/

//Filter teachers by department and/or name (case-insensitive) by querying the database. If no query parameters are provided, it returns all teachers.  The name can be provided as firstName, lastName, or name (which can be a full name or partial name).  If just the firstName or lastName is given, it will return any teacher with that first or last name.  If a full name is given, it will return any teacher with that first and last name.  If a partial name is given, it will return any teacher with that partial name in either the first or last name.
router.get("/", async (req, res) => {
    try {
        const query = {};
        if (req.query.department) {
            const safeDepartment = escapeRegex(req.query.department.trim());
            query.department = { $regex: `^${safeDepartment}$`, $options: "i" };
        }

        const FirstNameInput = req.query.firstName || req.query.firstname;
        const LastNameInput = req.query.lastName || req.query.lastname;
        const nameInput = req.query.name;

        if (FirstNameInput) {
            const safeName = escapeRegex(FirstNameInput.trim());
            query.firstName = { $regex: safeName, $options: "i" };
        }

        
        if (LastNameInput) {
            const safeName = escapeRegex(LastNameInput.trim());
            query.lastName = { $regex: safeName, $options: "i" };
        }

        if(nameInput) {
            const trimmedName = nameInput.trim();
            if(!trimmedName) {
                const teachers = await Teacher.find(query);
                return res.json(teachers);
            }
            const nameParts = trimmedName.split(/\s+/).filter(Boolean);
            if(nameParts.length >= 2) {
                const safeFirst = escapeRegex(nameParts[0]);
                const safeLast = escapeRegex(nameParts.slice(1).join(" "));
                query.firstName = { $regex: `^${safeFirst}$`, $options: "i" };
                query.lastName = { $regex: `^${safeLast}$`, $options: "i" };
            } else {
                const safeName = escapeRegex(trimmedName);
                query.$or = [
                    { firstName: { $regex: safeName, $options: "i" } },
                    { lastName: { $regex: safeName, $options: "i" } }
                ];
            }
        }

         if (req.query.roomNumber) {
            const safeNumber = escapeRegex(req.query.roomNumber.trim());
            query.roomNumber = { $regex: `^${safeNumber}$`, $options: "i" };
        }

        const teachers = await Teacher.find(query);
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seeds the database with sample teachers for testing purposes. It first clears any existing teachers and then inserts a predefined set of teachers into the database.
// TODO: Instead of deleting data during seeding, consider using migrations
// or a safe seed strategy to avoid accidental data loss in non-dev environments.
/*router.get("/seed", async (req, res) => {
    await Teacher.deleteMany({}); // Clear existing teachers

    const teachers = await Teacher.insertMany([
        { teacherId: "T001", firstName: "John", lastName: "Doe", email: "jDoe@school.k12.us",department: "Math", subjects: ["Algebra", "Geometry"], schedule:[{day: "Gold", period: "5", className: "Algebra"}], roomNumber: "A521" },
        { teacherId: "T002", firstName: "Jane", lastName: "Hutchinson", email: "jHutschinson@school.k12.us", department: "English", subjects: ["Honors English 9", "English 9", "World Literature"], schedule:[{day: "Maroon", period: "3", className: "World Literature"}], roomNumber: "A102" },
        { teacherId: "T003", firstName: "Emily", lastName: "Ramber", email: "eRamber@school.k12.us", department: "Science", subjects: ["Biology", "Chemistry"], schedule:[{day: "Maroon", period: "2", className: "Biology"}], roomNumber: "C205" },
        { teacherId: "T004", firstName: "Michael", lastName: "Laughner", email: "mLaughner@school.k12.us", department: "History", subjects: ["World History", "US History"], schedule:[{day: "Gold", period: "7", className: "US History"}], roomNumber: "C547" },
        { teacherId: "T005", firstName: "Sarah", lastName: "Milkner", email: "sMilkner@school.k12.us", department: "Art", subjects: ["Drawing", "Painting"], schedule:[{day: "Maroon", period: "1", className: "Drawing"}], roomNumber: "D309" },
        { teacherId: "T006", firstName: "David", lastName: "Stithner", email: "dStithner@school.k12.us", department: "Science", subjects: ["Physics", "Biology"], schedule:[{day: "Gold", period: "6", className: "Physics"}], roomNumber: "C235" },
        { teacherId: "T007", firstName: "Martha", lastName: "Kinsley", email: "mKinsley@school.k12.us", department: "English", subjects: ["English 9", "World Literature"], schedule:[{day: "Maroon", period: "3", className: "World Literature"}], roomNumber: "E115" }
    ]);

    res.json({ message: "Database seeded with sample teachers", teachers });
});*/

module.exports = router;