const mongoose = require("mongoose");


/**
 * Connects to the MongoDB database
 * @param {string} uri - The MongoDB connection URI, the value of the MONGODB_URI environment variable in production or the local MongoDB URI in development.
 * @returns {Promise<void>}
 */
const connectDB = async (uri) => {
    if (!uri) {
        console.error("MongoDB connection error: MONGODB_URI is not set");
        process.exit(1);
    }

    try {
        // TODO: add connection options and retry/backoff logic for production
        // (e.g., use `mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })` and a retry loop).
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit with failure
    }
}

module.exports = connectDB;