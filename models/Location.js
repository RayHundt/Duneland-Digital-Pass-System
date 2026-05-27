const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    // The general department the location belongs to, e.g. "Math", "Science", "English", etc. This is required.
    department: { type: String, required: true },
    // The room number where the location is assigned, e.g. "A101", "C521", etc. This is required and must be unique.
    roomNumber: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Location", locationSchema);