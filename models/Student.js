const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    grade: { type: Number, required: true },
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Student", studentSchema);