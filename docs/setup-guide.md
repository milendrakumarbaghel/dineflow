# DineFlow — Setup & Development Guide

This guide walks you through running DineFlow locally, either using Docker Compose or via standalone Java and Node development servers.

---

## Prerequisites

- **Java Development Kit (JDK):** Version 21 LTS or 25
- **Node.js:** Version 20 or higher (v22 recommended)
- **Maven:** Wrapper (`./mvnw`) is bundled with the project
- **Docker & Docker Compose:** Optional for containerized deployment

---

## Option 1: Standalone Local Development (Zero Database Setup)

DineFlow includes an embedded H2 engine running in PostgreSQL-compatibility mode with automated Flyway database migrations and seed data for "Ember & Olive". This allows instant local development without installing or starting a standalone PostgreSQL server.

### 1. Start Spring Boot Backend

```bash
cd backend

# Run automated tests to verify schema migrations and business logic
./mvnw test

# Start the Spring Boot application on port 8080
./mvnw spring-boot:run
```

- API Base URL: `http://localhost:8080/api/v1`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui/index.html`
- WebSocket Endpoint: `ws://localhost:8080/ws`
- H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:dineflow;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE`)

### 2. Start React Frontend

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```

Open your browser to:
**`http://localhost:3000`**

The Vite development server automatically proxies `/api` and `/ws` requests to `http://localhost:8080`.

---

## Option 2: Docker Compose Environment (Production-grade)

To run the complete stack with real PostgreSQL 16, Redis 7, Nginx, and multi-stage container builds:

```bash
# 1. Copy sample environment file
cp .env.example .env

# 2. Build and launch all services
docker compose up --build -d

# 3. Check service health
docker compose ps

# 4. View logs
docker compose logs -f
```

### Services launched:
- **Frontend + Nginx Reverse Proxy:** `http://localhost:3000`
- **Spring Boot 3.5 Backend API:** `http://localhost:8080`
- **PostgreSQL Database:** `localhost:5432` (database: `dineflow`, user: `dineflow`)
- **Redis Cache:** `localhost:6379`

---

## Pre-seeded Credentials & Demo Accounts

The database comes pre-populated with realistic restaurant data for **Ember & Olive**:

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **OWNER** | `owner@emberandolive.com` | `Password123!` | Full restaurant control, analytics, settings |
| **MANAGER** | `ananya@emberandolive.com` | `Password123!` | Operations, tables, orders, catalog |
| **KITCHEN** | `dev@emberandolive.com` | `Password123!` | Kitchen display system (KDS) |
| **WAITER** | `meera@emberandolive.com` | `Password123!` | Runner, ready orders, table service |
| **HOST** | `kabir@emberandolive.com` | `Password123!` | Waitlist, queue matching, seating |
| **CASHIER** | `rohan@emberandolive.com` | `Password123!` | Bills, payments, split settling |

---

## Running Tests

### Backend Automated Unit & Integration Tests

```bash
cd backend
./mvnw test
```
Executes JUnit 5 test cases testing:
- JWT token generation, parsing, and expiration validation (`JwtUtilTest`)
- Table session lifecycle and table transitions (`TableServiceTest`)
- Order creation, totals, tax calculation, and order tracking (`OrderServiceTest`)
- Waitlist join, position estimation, and table assignment (`QueueServiceTest`)
- Bill generation, tax items, split calculations, and settlement (`BillingServiceTest`)
- Spring context bootstrap and Flyway migration assertions (`DineFlowApplicationTests`)

### Frontend Verification

```bash
cd frontend
npm run build
```
Validates zero TypeScript errors and compiles the production bundle.
