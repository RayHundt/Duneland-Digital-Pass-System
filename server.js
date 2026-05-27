require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB using the env var from your .env/.env.example
connectDB(process.env.MONGODB_URI);
/**
 * Note: `process.env.MONGODB_URI` should include the full connection string
 * including the database name (e.g. mongodb://user:pass@host:port/duneland_digi_pass).
 * If unset, `connectDB` will exit the process.
 */

/*app.get("/api/students", (req, res) => {
  res.send("SERVER LEVEL students route works");
});*/

/**
 * GET "/" serves the admin view HTML file. This is the main entry point for the admin interface of the application.
*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin_view.html"));
});

// TODO: Add authentication/authorization for admin routes and APIs.
// Currently all API routes are unprotected which is fine for local testing
// but should be secured before deploying to production.

const studentsRoutePath = path.join(__dirname, "routes", "students.js");
console.log("Loading students route from:", studentsRoutePath);
app.use("/api/students", require(studentsRoutePath));

const teachersRoutePath = path.join(__dirname, "routes", "teachers.js");
console.log("Loading teachers route from:", teachersRoutePath);
app.use("/api/teachers", require(teachersRoutePath));

const passesRoutePath = path.join(__dirname, "routes", "passes.js");
console.log("Loading passes route from:", passesRoutePath);
app.use("/api/passes", require(passesRoutePath));

const locationsRoutePath = path.join(__dirname, "routes", "locations.js");
console.log("Loading locations route from:", locationsRoutePath);
app.use("/api/locations", require(locationsRoutePath));

const PORT = process.env.PORT || 3000;
/**
 * Start the HTTP server. Bound to 0.0.0.0 so it's accessible from other hosts
 * on the same machine/network (useful for testing on different devices).
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
