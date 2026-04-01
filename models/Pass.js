const mongoose = require("mongoose");

const PassSchema = new mongoose.Schema({
    passId: {type: String, required: true, unique: true},
    studentId: {type: String, required: true},
    teacherId: {type: String, required: true},
    requestedAt: {type: Date, default: Date.now},
    reason: {type: String, required: false},
    fromLocation: {type: String, required: true},
    toLocation: {type: String, required: true},
    status: {type: String, enum: ["requested", "approved and in progress", "completed", "denied"], default: "requested"},
    approvedAt: {type: Date, default: null},
    endedAt: {type: Date, default: null}
});

module.exports = mongoose.model("Pass", PassSchema);