# Multi-Tenant SaaS Platform – Research Document

## 1. Multi-Tenancy Analysis

Multi-tenancy is a software architecture where a single application instance serves multiple organizations (tenants), while ensuring that each tenant’s data is completely isolated and secure. In a SaaS application, choosing the correct multi-tenancy approach is critical for scalability, security, performance, and cost. There are three commonly used multi-tenancy approaches.

### 1.1 Shared Database + Shared Schema (Tenant ID Based)

In this approach, all tenants share the same database and the same set of tables. Each table contains a `tenant_id` column that identifies which tenant the data belongs to. Every database query filters data using this tenant_id.

**Pros:**

- Cost-effective because only one database is required.
- Easier to manage infrastructure since there is a single database.
- Simple to onboard new tenants because no new database or schema is needed.
- Works well with containerized environments like Docker.

**Cons:**

- Strong discipline is required in backend code to always filter by tenant_id.
- A mistake in query logic can cause data leakage between tenants.
- Database size grows as the number of tenants increases.

### 1.2 Shared Database + Separate Schema per Tenant

In this approach, all tenants share the same database server, but each tenant has its own database schema. Each schema contains its own tables.

**Pros:**

- Better data isolation compared to shared schema.
- Easier to perform tenant-specific database operations.
- Reduced risk of accidental data leaks through queries.

**Cons:**

- Increased complexity in schema management.
- Harder to run global queries across tenants.
- Schema migrations become more complex as tenant count grows.

### 1.3 Separate Database per Tenant

In this approach, each tenant has its own completely separate database.

**Pros:**

- Strongest level of data isolation.
- Easy to enforce security boundaries.
- Tenants can be scaled independently.

**Cons:**

- Very high infrastructure cost.
- Difficult to manage backups, migrations, and updates.
- Not suitable for small to medium SaaS products.

### 1.4 Chosen Approach

For this project, **Shared Database + Shared Schema with tenant_id** is chosen.

**Reason for choice:**  
This approach provides a good balance between scalability, cost, and simplicity. Since this is a production-ready SaaS application designed to support multiple tenants efficiently, using a shared database with a tenant_id column allows easy onboarding of tenants, simpler Docker-based deployment, and centralized database management. With strict backend validation and middleware enforcing tenant isolation, data security can be effectively maintained.

---

## 2. Technology Stack Justification

### 2.1 Backend

The backend is built using **Node.js with Express.js**. Node.js is a non-blocking, event-driven runtime that performs well for API-based applications. Express.js provides a lightweight and flexible framework for building RESTful APIs.

**Why chosen:**

- Fast development and large ecosystem.
- Excellent support for REST APIs.
- Works well with JWT authentication.
- Easy integration with PostgreSQL.

**Alternatives considered:**

- Django (Python)
- Spring Boot (Java)

**Why not used:**

- Django adds unnecessary overhead for this project.
- Spring Boot requires more setup and boilerplate.

### 2.2 Frontend

The frontend is built using **React.js**. React is a component-based library that allows building dynamic and responsive user interfaces.

**Why chosen:**

- Component reusability.
- Strong community support.
- Easy state management for authentication.
- Works well with REST APIs.

**Alternatives considered:**

- Angular
- Vue.js

**Why not used:**

- Angular is complex for beginners.
- Vue has a smaller ecosystem compared to React.

### 2.3 Database

**PostgreSQL** is used as the relational database.

**Why chosen:**

- Strong support for relational data.
- ACID compliance.
- Supports indexing and constraints.
- Ideal for multi-tenant schemas.

**Alternatives considered:**

- MySQL
- MongoDB

**Why not used:**

- MySQL has fewer advanced features.
- MongoDB is not ideal for relational tenant data.

### 2.4 Authentication

**JWT (JSON Web Tokens)** are used for authentication.

**Why chosen:**

- Stateless authentication.
- No session storage required.
- Scales well in Docker environments.
- Easy to integrate with frontend.

**Alternatives considered:**

- Session-based authentication
- OAuth only

**Why not used:**

- Sessions require extra storage.
- OAuth adds unnecessary complexity for this project.

### 2.5 Docker

**Docker and Docker Compose** are used for containerization.

**Why chosen:**

- Consistent development and evaluation environment.
- One-command deployment.
- Easy service orchestration.
- Simplifies database setup.

**Alternatives considered:**

- Manual environment setup
- Virtual machines

**Why not used:**

- Manual setup causes environment issues.
- Virtual machines are heavy and slow.

---

## 3. Security Considerations

### 3.1 Tenant Data Isolation

Every table includes a `tenant_id` column. Backend middleware ensures that all queries automatically filter data using the tenant_id from the JWT token. This prevents tenants from accessing each other’s data.

### 3.2 JWT Authentication

JWT tokens are issued after successful login and contain only `userId`, `tenantId`, and `role`. Tokens have a 24-hour expiry and are verified for every protected API request.

### 3.3 Password Hashing

All passwords are hashed using **bcrypt** before being stored in the database. Plain text passwords are never stored or returned in API responses.

### 3.4 Role-Based Access Control (RBAC)

The system enforces RBAC using middleware. Super admins, tenant admins, and regular users have different permissions. API access is restricted based on role.

### 3.5 API Validation and Protection

All APIs validate request inputs to prevent invalid data. Proper HTTP status codes are returned. Sensitive operations are logged in the `audit_logs` table for security monitoring.
