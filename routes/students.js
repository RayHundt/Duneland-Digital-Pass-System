const express = require("express");
const Student = require("../models/Student");

const router = express.Router(); 

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

//Filter students by grade and/or name (case-insensitive)
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

        const students = await Student.find(query);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//seed route to add sample students to the database
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