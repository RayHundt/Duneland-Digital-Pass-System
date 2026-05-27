const express = require("express");
const Student = require("../models/Student");

const router = express.Router(); 

/**
 * Escape user input for use in RegExp queries.
 * This prevents regex metacharacters from changing the intended match.
 */
// Escapes special regex characters in a string
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 
 * Students API
 *
 * GET /api/students
 * Query params (optional):
 *  - grade (number)
 *  - name / firstName / lastName (string)
 *  - studentId (string)
 * Response: 200 OK -> Array of student objects
 * Example: GET /api/students?studentId=S001
 * Example response: [{ studentId: "S001", firstName: "Jeremy", lastName: "Luthor", grade: 9, email: "jLuthor2030@school.edu" }]
 *
 * Seed route (commented out): GET /api/students/seed
 *  - WARNING: the seed route clears existing students before inserting sample data
 * Response codes:
 *  - 200 OK -> array
 *  - 500 Internal Server Error
*/

//Filter students by grade and/or name (case-insensitive) by querying the database. If no query parameters are provided, it returns all students.  The name can be provided as firstName, lastName, or name (which can be a full name or partial name).  If just the firstName or lastName is given, it will return any student with that first or last name.  If a full name is given, it will return any student with that first and last name.  If a partial name is given, it will return any student with that partial name in either the first or last name.
router.get("/", async (req, res) => {
    try {
        const query = {};
        if (req.query.grade) {
            query.grade = Number(req.query.grade);
        }

        const firstNameInput = req.query.firstName || req.query.firstname;
        const lastNameInput = req.query.lastName || req.query.lastname;
        const nameInput = req.query.name;

        if (firstNameInput) {
            const safeName = escapeRegex(firstNameInput.trim());
            query.firstName = { $regex: safeName, $options: "i" };
        }

        if (lastNameInput) {
            const safeName = escapeRegex(lastNameInput.trim());
            query.lastName = { $regex: safeName, $options: "i" };
        }

        if (nameInput) {
            const trimmedName = nameInput.trim();
            if(!trimmedName) {
                const students = await Student.find(query);
                return res.json(students);
            }
            const nameParts = trimmedName.split(/\s+/).filter(Boolean);
            if (nameParts.length >= 2) {
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

        if (req.query.studentId) {
            const safeId = escapeRegex(req.query.studentId.trim());
            query.studentId = { $regex: `^${safeId}$`, $options: "i" };
        }

        const students = await Student.find(query);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seeds the database with sample students for testing purposes. It first clears any existing students and then inserts a predefined set of students into the database.
/*router.get ("/seed", async (req, res) => {
    try {
        await Student.deleteMany({}); // Clear existing students

        const students =  await Student.insertMany([
            { studentId: "S001", firstName: "Jeremy", lastName: "Luthor", grade: 9, email: "jLuthor2030@school.edu"},
            { studentId: "S002", firstName: "Samantha", lastName: "Smith", grade: 10, email: "sSmith2029@school.edu"},
            { studentId: "S003", firstName: "Michael", lastName: "Johnson", grade: 11, email: "mJohnson2028@school.edu"},
            { studentId: "S004", firstName: "Emily", lastName: "Davis", grade: 12, email: "eDavis2027@school.edu"},
            { studentId: "S005", firstName: "David", lastName: "Wilson", grade: 11, email: "dWilson2028@school.edu"},
            { studentId: "S006", firstName: "Sarah", lastName: "Miller", grade: 9, email: "sMiller2030@school.edu"},
            { studentId: "S007", firstName: "James", lastName: "Brown", grade: 12, email: "jBrown2027@school.edu"},
            { studentId: "S008", firstName: "Jessica", lastName: "Taylor", grade: 10, email: "jTaylor2029@school.edu"}
        ]);

        res.json({ message: "Database seeded with sample students", students });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/

module.exports = router;