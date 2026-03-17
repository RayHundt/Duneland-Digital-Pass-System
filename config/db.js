const mongoose = require("mongoose");

const connectDB = async (uri) => {
    if (!uri) {
        console.error("MongoDB connection error: MONGODB_URI is not set");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit with failure
    }
}

module.exports = connectDB;