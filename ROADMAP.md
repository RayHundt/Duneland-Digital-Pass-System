# Duneland Digital Pass System -- Roadmap
If you are picking up this project for the first time, read this entire document before writing any code.  It's purpose is to explain what exists, why it was built the way it was, and what should come next.  Update it when you are finished so the next contributor knows where to start and why.

---
# Table of Contents
- [Project Background](#project-background)
- [What Has Been Built](#what-has-been-built)
- [Architecture Overview](#architecture-overview)
- [Current State and Known Gaps](#current-state-and-known-gaps)
- [Suggested Next Steps](#suggeted-next-steps)
- [Design Decisions Worth Knowing](#design-decisions-worth-knowing)
- [Advice for Future Contributors](#advice-for-future-contributors)
- [Contributor Log](#contributor-log)

---
# Project Background
The Duneland Digital Pass System was started in Fall 2025 in collaboration and with support from Mr. Tom Biel.  The purpose is to replace physical paper hall passes at our school with a centralized digital system.  Teachers and administrators should be able to issue, track, and verify passes digitally.  While students also have the ability to create and request passes.

The project is intentionally designed to be contributed to by many people and be a progressive build.  No student is expected to finish it.  Each person should leave it better than they found it -- add features, improve what is already here, and keep this document current.  Each new contributor will use this document as their starting point for the project.

---
# What Has Been Built
The following has been fully implemented by the founding contributor:

Server & Configuration

- Express 5 application (server.js) with CORS support, JSON body parsing, and environment-based configuration
- MongoDB connection helper (config/db.js) using Mongoose — connects on startup and exits gracefully on failure
- Environment variable template (.env.example) with MONGODB_URI, PORT, and JWT_SECRET
- .gitignore covering node_modules and .env

Database Models (all in /models)

- Student.js — student records
- Teacher.js — teacher records with subject and room number
- Pass.js — hall pass records
- Location.js — campus locations by department and room number

API Routes (all in /routes, mounted in server.js)

- GET /api/students — with query-parameter filtering by name, grade, studentId
- GET /api/teachers — with filtering by name, subject, roomNumber
- GET /api/locations — with filtering by department, roomNumber
- GET /api/passes — retrieves all passes

Format URL in search bar as localhost:3000/api/model?filter=

Frontend (all in /public)

index.html + app.js — admin/teacher interface
student_view.html + student_view.js — student-facing interface
styles.css — shared stylesheet

Infrastructure Installed but Not Yet Wired

jsonwebtoken and bcrypt/bcryptjs — installed for authentication, not yet implemented
socket.io — installed for real-time features, not yet implemented

---
# Architecture Overview
| File Name | Purpose |
| --- | --- |
| server.js | Entry point; sets up middleware |
| config/db.js | Mongoose connection helper |
| models/ | Mongoose schemas (one file for each of teachers, students, passes, and locations) |
| routes/ | Express route handlers (one file for each of teachers, students, passes, and locations) |
| public/ | Static HTML/CSS/JS frontend |
| .env | your local environment variables (**DO NOT COMMIT**) |
| .env.example | template showing what variables are needed |

This project uses CommonJS modules (require/module.export).  Keep this consistent; do not mix in ES Module import/export syntax.

The server uses Express 5, which handles async errors differently from Express 4.  Errors thrown inside async route handlers automatically propagate to the error handler without needing try/catch in every route.

---
# Current State and Known Gaps
These aspects haven't been built yet:
- No Authentication.  The libraries (jsonwebtoken, bcrypt) are installed, but there is no login system, no user model, no protected routes, and no JWT middleware.  Once the logic for the passes is finished, this is the most important step.
- Pass creation is not implemented.  There is a pass model, but no POST/api/passes route to create a pass, nor any logic for approval.
- No role system.  There is no distinction between admin, teacher, and student users.
- Socket.io is not configured.  The library is installed but not initialized in server.js and it is unused.
- No input validation.  Incoming request bodies are not validated.  A library like "express-validator" should be added before any write endpoints go live.
- No tests.  There is no test suite.  Adding one could help test the use cases of the code and be a meaningful contribution.
- Frontend is minimal.  The HTML/JS in /public is a starting scaffold, but is not a finished UI.
- fix-db-server.patch -- this file documents a large early bug fix (a missing http.createServer call and a mismatched env key).  It is historical context.

---
# Suggested Next Steps
These are ordered by priority, but use your own judgement based on your timeframe and what the project needs most.

## High Priority
1. ### User Model and Authentication
Create a server to handles a User object with fields necessary identifiers (name, email, hashed password,  role -> admin | teacher | student, and timestamps).  Then, add a new route that creates a new user with:
 - POST/api/route/register  -> be sure to hash the password with bcrypt, save the sures, and return a JWT
 - POST/api/route/login -> verifies credentials and return a JWT  
Then create a function (probably middleware/auth.js) that reads the Authorization header, verifies the JWT with jsonwebtoken, and attaches the decoded user to req.user.  Protected routes use this middleware.
 
2. ### Pass Creation and Lifecycle
Add POST /api/passes to create a new pass.  The pass should reference all of the fields required (student, destination location, and the issuing/requested teacher).
-I believe there is already a POST method created in routes/passes.js that was commented out because it was not working how it was intended and got in the way of later improvements.  I would use that as inspiration for your POST method.
  
3. ### Role-Based Access Control
Once the auth middleware exists, it can be extended to check the role of the user.  Admins should be able to view all passes and associated properties (see the current table for admin with localhost: 3000/admin_view.html), create passes, and approve/deny passes, teachers should be able to create and approve/deny passes, and students can only create passes and view their own passes.

## Medium Priority
1. ### Input Validation
Add express-validator or other equivalent to validate all requests before they touch the database.  Check for required fields, correct data types, and reasonable string lengths.

2. ### Socket.io Integration
Initialize Socket.io in server.js using the http.Server instance.  A good first use could be: what a pass status changes, emit an event so the admin dashboard updates in real time without polling.

3. ### Expanded API
Consider PUT and DELET routes for students, teachers, and locations (admin-level only).  These can create new students, teachers, or locations or delete them in the database without manually changing the database. Consider a GET /api/passes?studentId= filter so that teachers can see active passes for a specific student.

## Lower Priority/Stretch Goals
- QR codes -> generate a QR code for each issued pass for convenience with teachers scanning a student's code and seeing the pass and approving or denying.
- Email notifications -> notify teachers or students when a pass is issued or approved for them
- Improved frontend -> the /public folder is a scaffold.  A proper UI for teachers, students, and admins would improve usability.
- Automated tests -> a Jest or Mocha test suite for routes and models would make future changes safer
- Deployment documentation -> document how to deploy Railway, Render, or a school-managed server
- Integrate with Skyward -> Integration into Skyward could make notifications easier for users to see and passes to be created.

---
# Design Decisions Worth Knowing
- Why CommonJS and not ES Modules? CommonJS was chosen for simplicity and compatibility.  Keep it consistent.
- Why Express 5? It was the current major version at project start and has cleaner async error handling.  Be aware that some older tutorials show Express 4 pattern.
- Why two bcrypt pacjages? For flexibility, bcrypt is the native C++ binding that is faster, but it requires build tools and bcyrptjs is pure JavaScript so it is slower, but it installs everywhere.  You can use either, however bcryptjs is safer for environments without build tools.
- Why is there a .patch fil? It documents the first significant bug fix made to the project.  It is not needed to run the application.
- Keep routes thin.  Business logic like complex queries and data transformations should live in a service layer or in the model, not directly in the route handle functions.

---
# Advice for Future Contributors
- Read the code before writing the code.  Start with server.js, then config/db.js, then look through models/ and routes/.  It will take less time than trying to make changes without knowing what the other files use and have.
- Write descriptive commit messages.  Future students will read the git history and "add POST /api/passes with teacher approval logic" is infinitely more useful than "update".
- Write descriptive comments after making a change/creating a function.  It is much easier to do in the moment than trying to go back weeks later and remember your thought processes.
- Use npm run dev while working.  Nodemon will restart the server on every save.
- Don't break what works.  The server startup, database connection, and existing GET routes work to this point.  Be careful with server.js and config/db.js especially, but know what is being changed and why in any existing file.
- If you're unsure about a major architectural change, document your reasoning in a comment or in this file.  Future contributors will encounter the change and need to know why it was changed how it was.
- Update this document when you are done.  Add yourself to the Contributor Log, note what you built, and revise the "What has Been Built" and "Current Status" sections.  This is part of your job as this project is made to be scalable for future students.
- Put this project on your resume.  Going into college already working on a large project such as this is a huge advantage.  Engineering and computer science firms will love to see the collaboration, work you do, and growth of this project.
- Have fun learning and collaborate with Mr. Biel.  This project is designed for students, with the knowledge that mistakes will happen and the process isn't always a straight line.  Mr. Biel is a great resource and will help you along the way.

---
# Contributor Log
| Contributor | Term | What Was Built |
| --- | --- | --- |
| Ray Hundt | Fall 2025 - Spring 2026 | Project founder — Express server, MongoDB connection, Student/Teacher/Pass/Location models, REST API with filtering, static frontend scaffold, environment configuration, project documentation |
| (*your name here* | --- | --- | 

*Last updated by Ray Hundt -- Spring 2026*
