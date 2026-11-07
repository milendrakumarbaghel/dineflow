# DineFlow — Restaurant Management & QR Ordering Platform

> **Scan. Order. Dine. No Waiting Confusion.**  
> A complete, production-grade restaurant operating system built with **React 19, TypeScript, Tailwind CSS**, and **Java 21/25 Spring Boot 3.5** backed by **PostgreSQL** and real-time **WebSocket STOMP**.

---

## 🍽️ Project Overview

**DineFlow** (rebranded from TableFlow) unifies the restaurant dining lifecycle into a cohesive platform:
- **For Seated Guests:** Instant QR scanning with table session binding, digital menu browsing, dish customization, order placement, real-time status tracking, and split billing without waiting for staff.
- **For Walk-in Guests:** Digital waitlist registration, live queue position tracking, and advance pre-ordering while waiting for a table.
- **For Kitchen Staff:** Low-latency Kitchen Display System (KDS) with live preparation state management and order timers.
- **For Waiters & Runners:** Live notifications of ready orders and table call requests.
- **For Floor Hosts:** Live 3D isometric floor plan, table occupancy matching, and walk-in seating.
- **For Restaurant Owners & Managers:** Comprehensive business intelligence, catalog management, table QR code provisioning, staff access control, and operating policy configuration.

Initial demo restaurant: **Ember & Olive** (Artisan Kitchen).

---

## 📱 21-Screen Master Inventory

DineFlow faithfully implements all **21 wireframe screens** from `tableflow_restaurant_wireframes.html` with production-grade components connected to backend APIs:

| # | Group | Screen Name | Route / Path | Primary Purpose |
|---|---|---|---|---|
| **01** | Guest Experience | **Guest QR Menu** | `/r/{slug}/t/{qrToken}` | Browse category menu, search dishes, sticky table cart, 3D hero plate |
| **02** | Guest Experience | **Dish Details** | `/item/{dishSlug}` | Dish customizer, spice levels, modifiers, quantity picker |
| **03** | Guest Experience | **Cart & Review** | `/cart` | Item quantity adjustment, instructions, order notes, total breakdown |
| **04** | Guest Experience | **Order Checkout** | `/checkout` | Guest details, payment preference (UPI/Card/Cash), order submission |
| **05** | Guest Experience | **Order Tracking** | `/orders/{orderNumber}` | Live 5-stage progress timeline (Placed → Accepted → Preparing → Ready → Served) |
| **06** | Guest Experience | **Bill & Payment** | `/table/{table}/bill` | Itemized bill breakdown, multi-way bill splitting, UPI/Card payment confirmation |
| **07** | Waitlist & Seating | **Join Queue** | `/waitlist/join` | Digital waitlist check-in, party size counter, seating preference |
| **08** | Waitlist & Seating | **Queue Ticket** | `/waitlist/{ticketToken}` | Live queue position, estimated wait time, table assignment alert |
| **09** | Waitlist & Seating | **Advance Order** | `/waitlist/{ticketToken}/order` | Pre-order while in queue (hold until seated vs. counter pickup) |
| **10** | Waitlist & Seating | **Host Console** | `/staff/host` | Queue management, party size matching, manual seating, no-show handling |
| **11** | Waitlist & Seating | **Live Floor Plan** | `/staff/floor` | Interactive 3D isometric floor plan, table status toggling, quick actions |
| **12** | Operations | **Table Session** | `/staff/tables/{table}/session` | Visit-level view connecting guests, multi-round orders, and bill status |
| **13** | Operations | **Kitchen Display (KDS)** | `/kitchen/display` | Kitchen order queue with preparation timers, one-click state progression |
| **14** | Operations | **Waiter / Runner** | `/staff/runner` | Order dispatch board, table delivery confirmation, guest service calls |
| **15** | Management | **Owner Overview** | `/manage/overview` | Live operational pulse, 3D floor summary, today's revenue, order counts |
| **16** | Management | **Menu Studio** | `/manage/menu` | Dish catalog, price changes, 86ing/availability toggle, Add Dish modal |
| **17** | Management | **Tables & QR Codes** | `/manage/tables` | Table capacity configuration, genuine ZXing QR generation, print modal |
| **18** | Management | **All Orders** | `/manage/orders` | Unified orders grid, status filters, search, age tracking |
| **19** | Management | **Staff & Roles** | `/manage/team` | Team directory, least-privilege role cards (Owner, Manager, Kitchen, Waiter, Host, Cashier) |
| **20** | Management | **Analytics** | `/manage/insights` | Recharts hourly sales distribution, popular dishes bar stats, KPI metrics |
| **21** | Management | **Settings** | `/manage/settings` | Restaurant profile, QR policies, grace periods, tax rates & service charges |

---

## 🎨 Design System & Animation Philosophy

- **Color Palette:**
  - Primary Coral: `#ef6b4b`
  - Dark Slate: `#17221e`
  - Main Paper Background: `#fbfaf5`
  - Secondary Paper: `#f3f0e6`
  - Sage Accent: `#6d8b72`
  - Gold Accent: `#e8b64d`
- **Typography:** DM Sans & Manrope with high-contrast serif headings.
- **Card Radius:** Standard `18px` with soft multi-layer shadows and 3D hover elevation.
- **Micro-Interactions & 3D Elements:**
  - CSS 3D isometric floor plan with live table status indicators.
  - Interactive hero plate scene with floating badges and subtle orbital keyframes.
  - Animated queue progress meters and order status timelines.
  - Particle confetti celebration on order submission and payment completion.
  - Desktop vs. Mobile device frame preview switcher with live screen navigation.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **State Management:** TanStack Query (server state) + Zustand (client flow state)
- **Animation:** Framer Motion + Canvas Confetti
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **API Client:** Type-safe Fetch abstraction with automatic error handling

### Backend
- **Language & Runtime:** Java 21 LTS / Java 25
- **Framework:** Spring Boot 3.5.x
- **Database & Migration:** PostgreSQL 16 + Flyway (`V1__init_schema.sql`, `V2__seed_demo_data.sql`)
- **Real-Time:** Spring WebSocket STOMP broker (`/topic/orders`, `/topic/queue`, `/topic/tables`)
- **Security:** Spring Security with stateless JWT (`JwtAuthenticationFilter`)
- **QR Generation:** Genuine ZXing library rendering Base64 Data URL PNGs
- **Documentation:** Springdoc OpenAPI (Swagger 3 UI)

---

## 🚀 Quick Start Guide

### 1. Zero-Setup Local Development (H2 Embedded Mode)

DineFlow defaults to an embedded H2 engine in PostgreSQL-compatibility mode pre-seeded with Ember & Olive demo data:

```bash
# Terminal 1: Backend
cd backend
./mvnw test               # Executes all 12 JUnit tests
./mvnw spring-boot:run   # Starts API on http://localhost:8080

# Terminal 2: Frontend
cd frontend
npm install              # Installs frontend dependencies
npm run dev              # Starts UI on http://localhost:3000
```

Open **`http://localhost:3000`** in your browser.

### 2. Docker Compose Deployment (PostgreSQL + Redis + Nginx)

```bash
cp .env.example .env
docker compose up --build -d
```

- **Frontend Application:** `http://localhost:3000`
- **Backend API & Swagger:** `http://localhost:8080/swagger-ui/index.html`
- **PostgreSQL Database:** `localhost:5432`

---

## 🧪 Automated Test Suite

### Running Backend Tests
```bash
cd backend
./mvnw test
```
**Results:** `12 tests run, 0 failures, 0 errors, 0 skipped`  
Covers:
- `JwtUtilTest`: Secret signing, claims extraction, expiration checking.
- `TableServiceTest`: Session initialization, table state transitions.
- `OrderServiceTest`: Subtotal, tax computation, items validation.
- `QueueServiceTest`: Queue join, estimated wait calculation, table matching.
- `BillingServiceTest`: Consolidated bill creation, percentage taxes, split settlement.
- `DineFlowApplicationTests`: Spring Boot context bootstrap & Flyway migration integrity.

### Running Frontend Production Build
```bash
cd frontend
npm run build
```
Validates complete TypeScript type safety and bundles production assets with zero errors.

---

## 📚 Documentation Reference

- **[Architecture & Domain Design](docs/architecture.md):** Modular monolith structure, domain models, and system flows.
- **[Database Design & Schema](docs/database-design.md):** 22 PostgreSQL tables, foreign keys, constraints, and audit rules.
- **[API & WebSocket Documentation](docs/api-documentation.md):** REST endpoints, payloads, and STOMP event specifications.
- **[Setup & Deployment Guide](docs/setup-guide.md):** Local development, environment variables, and Docker deployment.

---

## 👥 Demo Logins

| Role | Username | Password |
|---|---|---|
| **Owner** | `owner@emberandolive.com` | `Password123!` |
| **Manager** | `ananya@emberandolive.com` | `Password123!` |
| **Kitchen** | `dev@emberandolive.com` | `Password123!` |
| **Waiter** | `meera@emberandolive.com` | `Password123!` |
| **Host** | `kabir@emberandolive.com` | `Password123!` |
| **Cashier** | `rohan@emberandolive.com` | `Password123!` |
