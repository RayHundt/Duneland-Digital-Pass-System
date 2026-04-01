require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the env var from your .env/.env.example
connectDB(process.env.MONGODB_URI);

/*app.get("/api/students", (req, res) => {
  res.send("SERVER LEVEL students route works");
});*/
app.get("/", (req, res) => {
  res.send("Digital Pass Backend Running");
});

const studentsRoutePath = path.join(__dirname, "routes", "students.js");
console.log("Loading students route from:", studentsRoutePath);
app.use("/api/students", require(studentsRoutePath));

const teachersRoutePath = path.join(__dirname, "routes", "teachers.js");
console.log("Loading teachers route from:", teachersRoutePath);
app.use("/api/teachers", require(teachersRoutePath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
