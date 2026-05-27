const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    // Gives the student a unique ID that can be used to identify the student in the system. This is required and must be unique.
    studentId: { type: String, required: true, unique: true },
    // The first name of the student. This is required.
    firstName: { type: String, required: true },
    // The last name of the student. This is required.
    lastName: { type: String, required: true },
    // The grade level of the student. This is required.
    grade: { type: Number, required: true },
    // The email address of the student. This is required and must be unique.
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Student", studentSchema);