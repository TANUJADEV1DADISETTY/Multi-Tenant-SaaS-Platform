# Technical Specification Document

## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. Overview

This document provides the technical specification for the Multi-Tenant SaaS Platform. It explains the project structure, development setup, environment configuration, and how the application is run using Docker. The goal is to ensure that any developer or evaluator can understand, set up, and run the system easily.

---

## 2. Project Structure

The project is organized into backend, frontend, and documentation folders to maintain clear separation of concerns.

---

### 2.1 Backend Project Structure

backend/
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── config/
├── migrations/
└── tests/

**Folder Explanation:**

- controllers/ – Contains business logic for API endpoints
- routes/ – Defines all API routes and maps them to controllers
- models/ – Database models and query logic
- middleware/ – Authentication, authorization, tenant isolation, and validation middleware
- utils/ – Helper functions such as JWT handling and audit logging
- config/ – Database and environment configuration
- migrations/ – SQL migration files for creating database tables
- Dockerfile – Docker configuration for backend service

---

### 2.2 Frontend Project Structure

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── routes/
│ ├── context/
│ ├── App.js
│ └── index.js
├── public/
├── Dockerfile
├── package.json
└── .env

**Folder Explanation:**

- components/ – Reusable UI components
- pages/ – Application pages (Login, Register, Dashboard, Projects, Users)
- services/ – API service calls to backend
- routes/ – Protected and public route configuration
- context/ – Authentication and user state management
- Dockerfile – Docker configuration for frontend service

---

### 2.3 Documentation Structure

docs/
├── research.md
├── PRD.md
├── architecture.md
├── technical-spec.md
├── API.md
└── images/
├── system-architecture.png
└── database-erd.png

---

## 3. Development Setup Guide

### 3.1 Prerequisites

- Node.js (LTS version)
- Docker Desktop
- Git
- VS Code (recommended)

---

### 3.2 Environment Variables

**Backend Environment Variables:**

DB_HOST=database
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://frontend:3000

**Frontend Environment Variables:**

All environment variables are provided using Docker Compose or committed `.env` files as required for evaluation.

---

## 4. Running the Application (Docker-Based)

### 4.1 Docker Setup

The application is fully containerized using Docker and Docker Compose. Three services are defined:

- database – PostgreSQL database
- backend – Backend API server
- frontend – Frontend application

---

### 4.2 Start Application

From the project root directory, run:

docker-compose up -d

This command will:

1. Start the PostgreSQL database
2. Run database migrations automatically
3. Load seed data automatically
4. Start the backend API server
5. Start the frontend application

---

### 4.3 Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

---

## 5. Database Initialization

- Database tables are created using migration scripts
- Seed data is loaded automatically during backend startup
- No manual database commands are required

---

## 6. Authentication & Authorization Handling

- Authentication is handled using JWT tokens
- JWT tokens contain userId, tenantId, and role
- Role-based access control is enforced using middleware
- Tenant isolation is enforced by filtering all queries using tenantId

---

## 7. Error Handling & Logging

- All API responses follow a consistent format
- Proper HTTP status codes are returned
- Important actions are logged in the audit_logs table

---

## 8. Testing and Verification

After running `docker-compose up -d`, verify:

- All containers are running
- Health check endpoint returns success
- Seed data exists in the database
- Login works using credentials from submission.json
- Frontend pages load correctly

---

## 9. Summary

This technical specification ensures that the application is easy to understand, easy to set up, and fully compliant with the project requirements. The structured project layout, Docker-based deployment, and automatic database initialization make the system suitable for production-ready evaluation.
