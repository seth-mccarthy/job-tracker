# Job Application Tracker

A full-stack web app to track job applications throughout the hiring process.

## Tech Stack

- **Backend:** Java, Spring Boot, Spring Security, PostgreSQL
- **Frontend:** React, Tailwind CSS, Recharts
- **Auth:** JWT

## Features

- Track applications with status, notes, job URL, and resume version
- Filter and search applications by company or role
- Analytics dashboard with charts showing application pipeline
- Secure login and registration

## Running Locally

**Prerequisites:** Java 21, Node.js, PostgreSQL

**Backend**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Make sure PostgreSQL is running and a database called `jobtracker` exists. Update the credentials in `backend/src/main/resources/application.properties` to match your setup.

The backend runs on `http://localhost:8080` and the frontend on `http://localhost:5173`.