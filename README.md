# CodeStorm - College Event Management System
CodeStorm is a frontend-only college event management application designed to help colleges manage events, students, registrations, attendance, reports, and certificates.

The application supports three types of users:

- Institution/Admin
- Student
- Super Admin

All data is handled locally in the browser using `localStorage`. No backend server, Spring Boot application, PostgreSQL database, or API server is required.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- React Icons
- React Hot Toast
- React Hook Form
- Recharts

### Data Storage

- Browser `localStorage`
- Local mock-data service layer
- Frontend-only authentication simulation

### Development Tools

- Node.js
- npm
- ESLint
- Vite development server

---

## Main Features

### Institution/Admin Features

- Admin login
- Admin dashboard
- View event statistics
- Create events
- Edit events
- Delete events
- Close and reopen event registration
- View event participants
- Add students
- Edit student information
- Delete students
- Filter students by branch and year
- Upload student data interface
- Generate branch-wise reports
- Generate year-wise reports
- View event registration summaries
- Mark student attendance
- Generate individual certificates
- Generate certificates for all participants
- Update admin profile

### Student Features

- Student login
- Student dashboard
- View upcoming events
- Search and browse event information
- View event details
- Register for events
- View registered events
- View certificates
- Download demo certificates
- Update student profile
- Use dark mode
- View registration and certificate statistics

### Super Admin Features

- Super Admin login
- View all registered institutions
- View system-wide statistics
- View total institutions
- View total students
- View total events
- Enable or disable institutions

---

## How to Run the Application

### Requirements

Install the following software:

- Node.js 18 or later
- npm

Java, Maven, PostgreSQL, and Spring Boot are not required.

### Installation

Open a terminal and run:

```bash
cd frontend
npm install