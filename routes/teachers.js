const express = require("express");
const Teacher = require("../models/Teacher");

const router = express.Router();

//Filter teachers by subject and/or name (case-insensitive)
router.get("/", async (req, res) => {
    try {
        const query = {};
        if (req.query.subject ) {
            query.subject = req.query.subject;
        }
        if (req.query.name) {
            query.firstName = { $regex: req.query.name, $options: "i" };
        }

        const teachers = await Teacher.find(query);
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//seed route to add sample teachers to the database
router.get("/seed", async (req, res) => {
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
});

module.exports = router;