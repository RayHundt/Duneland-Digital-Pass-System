const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    // Gives the teacher a unique ID that can be used to identify the teacher in the system. This is required and must be unique.
    teacherId: { type: String, required: true, unique: true },
    // The first name of the teacher. This is required.
    firstName: { type: String, required: true },
    // The last name of the teacher. This is required.
    lastName: { type: String, required: true },
    // The email address of the teacher. This is required and must be unique.
    email: { type: String, required: true, unique: true },
    // The general department the teacher belongs to, e.g. "Math", "Science", "English", etc. This is required. 
    department: { type: String, required: true },
    // The specific subjects the teacher teaches, e.g. "Algebra", "Biology", "English Literature", etc. This is an array of strings and is optional.
    subjects: [{ type: String }],
    // The schedule of the teacher, which is an array of objects. Each object contains the day, period, and class name. This is optional.
    schedule: [{
        // "Gold" of "Maroon" because the school has a block schedule with two alternating days and it is not dependent on the day of the week.
        day: { type: String },
        // The period of the class, e.g. "1", "2", "3", etc.
        period: { type: String },
        // The name of the specific class, e.g. "Algebra", "Biology", "English Literature", etc.
        className: { type: String }
    }],
    // The room number where the teacher is assigned. This is required.
    roomNumber: { type: String, required: true }
});

module.exports = mongoose.model("Teacher", teacherSchema);