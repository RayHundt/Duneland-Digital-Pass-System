const mongoose = require("mongoose");

const PassSchema = new mongoose.Schema({
    // A unique identifier for the pass. This is required and must be unique.
    passId: {type: String, required: true, unique: true},
    // The ID of the student who requested the pass. This is required.
    studentId: {type: String, required: true},
    // The name of the student who requested the pass. This is required.
    studentName: {type: String, required: true},
    // The ID of the teacher who the pass is from, the "fromLocation" teacher. This is required.
    teacherId: {type: String, required: true},
    // The name of the teacher who the pass is from, the "fromLocation" teacher. This is required.
    teacherName: {type: String, required: true},
    // The location (roomNumber) where the pass is requested from. This is required.
    fromLocation: {type: String, required: true},
    // The location (roomNumber) where the pass is requested to. This is required.
    toLocation: {type: String, required: true},
    // The reason for the pass request. This is optional.
    reason: {type: String, required: false},
    // The status of the pass request. This is required and can be one of the following: "requested", "approved and in progress", "completed", or "denied". The default value is "requested".
    status: {type: String, enum: ["requested", "approved and in progress", "completed", "denied"], default: "requested"},
    // The timestamps for the pass request. These are optional and will be set automatically when the pass is created or updated.
    requestedAt: {type: Date, default: Date.now},
    // The timestamp for when the pass was approved. This is optional and will be set automatically when the pass is approved
    approvedAt: {type: Date, default: null},
    // The timestamp for when the pass was completed. This is optional and will be set automatically when the pass is completed
    endedAt: {type: Date, default: null}
});

module.exports = mongoose.model("Pass", PassSchema);