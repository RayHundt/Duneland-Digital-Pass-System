const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    teacherId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    subjects: [{ type: String }],
    schedule: [{
        day: { type: String },
        period: { type: String },
        className: { type: String }
    }],
    roomNumber: { type: String, required: true }
});

module.exports = mongoose.model("Teacher", teacherSchema);