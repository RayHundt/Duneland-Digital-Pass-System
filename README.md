# Digital Pass System

A web-based digital hall pass system designed for use in a high school environment.  
The goal of this project is to modernize student hall passes by replacing paper passes with a centralized digital system for teachers and administrators.

---

# Project Overview

This project currently includes:
- A Node.js + Express backend server
- MongoDB database integration
- Student, teacher, pass, and location data models
- API routes with filtering functionality
- Project structure for future expansion

The project is intended to continue development after the original developers graduate.

---

# My Role

I led the backend and database development for this project, including:
- Express.js server setup
- MongoDB configuration
- API route creation
- Database model design
- GitHub version control setup
- Initial project architecture
- Documentation

---

# Features

## Current Features

- Student database model
- Teacher database model
- Pass database model
- Location database model
- REST API backend
- Filtering students by:
  - name
  - grade
  - studentId
- Filtering teachers by:
  - name
  - subject
  - roomNumber
- Filtering locations by:
  - department
  - roomNumber
- Environment variable configuration
- Organized project structure

## Planned Features

- Digital pass creation
- Teacher approval system
- Authentication/login system
- Frontend interface for teachers 
   - Improve the admin interface
- Real-time pass tracking

---

# Technologies Used

## Layer        ## Technology
Runtime           Node.js
Framework         Express 5
Database          MongoDB + Mongoose
Authentication    JSON Web Tokens + bcrypt
Real-time         Socket.io
Configuration     dotenv
Dev Tooling       Nodemon


---

# File Structure

Duneland-Digital-Pass-System/
├── config/
│   └── db.js           # MongoDB connection helper
├── models/             # Mongoose data models
│   └──  Location.js
│   └── Pass.js
│   └── Student.js
│   └── Teacher.js 
├── public/             # Static frontend assets (HTML/CSS/JS)
│   └── app.js
│   └── index.html
│   └── student_view.html
│   └── student_view.js
│   └── styles.css
├── routes/             # Express route handlers
│   └── locations.js
│   └── passes.js
│   └── students.js
│   └── teachers.js
├── server.js           # Application entry point
├── .env.example        # Environment variable template
├── ROADMAP.md          # Development roadmap and contributor guidance
└── package.json


---

# Installation

## 1. Install Dependencies

```bash
npm install
```

## 2. Create `.env` File

Example:

```env
MONGO_URI=your_connection_string
PORT=3000
```

## 3. Start Server

```bash
npm start
```

or

```bash
npm run dev
```

---

# API Routes

## Students

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students?name=` | Filter students by name |
| GET | `/api/students?grade=` | Filter students by grade |

## Teachers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/teachers` | Get all teachers |
| GET | `/api/teachers?name=` | Filter teachers by name |
| GET | `/api/teachers?subject=` | Filter teachers by subject |

---

# Project Status

This project is currently in active development and serves as the foundation for a larger digital hall pass management system.

Additional project planning and future goals can be found in `ROADMAP.md`.

---

# Contributors

- Ray Hundt
- [Add future contributors here]

---

# Educational Purpose

This project was developed as a software engineering and web development learning experience while also creating a potentially useful tool for school administration.

