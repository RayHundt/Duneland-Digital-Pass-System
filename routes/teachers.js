const express = require("express");
const Teacher = require("../models/Teacher");

const router = express.Router();

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

//Filter teachers by subject and/or name (case-insensitive)
router.get("/", async (req, res) => {
    try {
        const query = {};
        if (req.query.subject) {
            const safeSubject = escapeRegex(req.query.subject.trim());
            query.subject = { $regex: `^${safeSubject}$`, $options: "i" };
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

//seed route to add sample teachers to the database
/*router.get("/seed", async (req, res) => {
    await Teacher.deleteMany({}); // Clear existing teachers

    const teachers = await Teacher.insertMany([
        { teacherId: "T001", firstName: "John", lastName: "Doe", email: "jDoe@school.k12.us", subject: "Math", classes: ["Algebra", "Geometry"], roomNumber: "A521" },
        { teacherId: "T002", firstName: "Jane", lastName: "Hutchinson", email: "jHutschinson@school.k12.us", subject: "English", classes: ["Literature", "Writing"], roomNumber: "A102" },
        { teacherId: "T003", firstName: "Emily", lastName: "Ramber", email: "eRamber@school.k12.us", subject: "Science", classes: ["Biology", "Chemistry"], roomNumber: "C205" },
        { teacherId: "T004", firstName: "Michael", lastName: "Laughner", email: "mLaughner@school.k12.us", subject: "History", classes: ["World History", "US History"], roomNumber: "C547" },
        { teacherId: "T005", firstName: "Sarah", lastName: "Milkner", email: "sMilkner@school.k12.us", subject: "Art", classes: ["Drawing", "Painting"], roomNumber: "D309" },
        { teacherId: "T006", firstName: "David", lastName: "Stithner", email: "dStithner@school.k12.us", subject: "Science", classes: ["Physics", "Biology"], roomNumber: "C235" },
        { teacherId: "T007", firstName: "Martha", lastName: "Kinsley", email: "mKinsley@school.k12.us", subject: "English", classes: ["English 9", "World Literature"], roomNumber: "E115" }
    ]);

    res.json({ message: "Database seeded with sample teachers", teachers });
});*/

module.exports = router;