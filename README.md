# Digital Pass System

A web-based digital hall pass system designed for use in a high school environment.  
The goal of this project is to modernize student hall passes by replacing paper passes with a centralized digital system for teachers and administrators.

This project is designed for long-term, student-maintained development. Each contributor builds on the work of those before them.

---
# Project Status

This project is currently in active development and serves as the foundation for a larger digital hall pass management system.

---
# Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Current Features](#current-features)
- [Planned Features](#planned-features)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Educational Purpose](#educational-purpose)
- [License](#license)

---
# Overview

The Duneland Digital Pass system provides a backend API for managing digital hall passes in school.  The system has models for teachers, students, passes, and different classrooms/locations and uses filters to answer specific queries for each.  It is built to be scalable by future students with infrastructure in place for implementation.

---

# Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 | 
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens + bcrypt |
| Real-time | Socket.io | 
| Configuration | dotenv |
| Dev Tooling | Nodemon |

---

# Project Structure 
```
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
```
---
# Prerequisites

- Node.js v16 or higher
- A running MongoDB instance (could be local or MongoDB Atlas)

---
# Installation

```bash
git clone https://github.com/RayHundt/Duneland-Digital-Pass-System.git
cd Duneland-Digital-Pass-System
npm install
```
---
# Configuration

```bash
cp .env.example .env
```
| Variable | Description |
|---|---|
| MONGODB_URI | MongoDB connection string |
| PORT | Port the server listens on (default is 3000) | 
| JWT_SECRET | Secret key for signing JWT tokens -- use a strong and random value |

---
# Running the Application
Production:

```bash
npm start
```
Development:

```bash
npm run dev
```
Successful startup:

MongoDB connected
Server running on port 3000

---
# API Reference

## Students -- /api/students

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students?name=` | Filter students by name |
| GET | `/api/students?grade=` | Filter students by grade |
| GET | `/api/students?studentId=` | Filter students by ID |

## Teachers -- /api/teachers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/teachers` | Get all teachers |
| GET | `/api/teachers?name=` | Filter teachers by name |
| GET | `/api/teachers?subject=` | Filter teachers by subject |
| GET | `/api/teachers?roomNumber` | Filter teachers by room number |

## Locations -- /api/locations

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations?department=` | Filter locations by department |
| GET | `/api/locations?roomNumber=` | Filter locations by room number |

## Passes -- /api/passes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/passes` | Get all passes |

----
# Current Features

- Student, Teacher, Pass, and Locations database models
- RESTful  API backend with query filtering across all models
- Environment variable configuration
- Express 5 server with CORS and JSON middleware
- MongoDB connection helper with startup error handling
- Static frontend interface served from /public
- JWT and bcrypt authentication dependencies installed and ready for implementation
- Socket.io infrastructure installed and ready to be implemented

---

# Planned Features

- Digital pass creation and lifetime management with "requested", "approved and in progress", "completed", and "denied" statuses 
- Teacher approval and notification system
- Authentication/login and role-based access system
- Expanded and improved frontend UI
- Real-time pass tracking with Socket.io
- Improved Admin dashboard to manage passes

Roadmap.md has a full breakdown of planned work and guidance for future contributors

---
# Contributing
Please read Roadmap.md before contributing.  It contains important context on the project's current state, architecture decisions, and suggested next steps.

1. Create a feature branch: git checkout -b feature/your-feature
2. Commit your changes with clear, descriptive messages
3. Push your branch and open a pull request
4. Document any new endpoints, models, or environment variables
5. Update Roadmap.md to reflect what you built

---
# Contributors

| Contributor | Term | Contributions |
|---|---|---|
| Ray Hundt | Fall 2025 - Spring 2026 | Project founder -- server architecture, database models, REST Api, frontend scaffolding, environment configuration, initial project documentation

---

# Educational Purpose

This project was developed as a software engineering and web development learning experience while also creating a potentially useful tool for school administration.

---
# License
ISC
---

