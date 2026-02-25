# 🚀 Real-Time Bidding System – Backend

Production-ready backend API for a Real-Time Auction & Bidding System.

Built with **Node.js**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, and **Socket.IO**.

---

## 🌐 Live API

**Base URL**

```
https://real-time-bidding-system-backend.onrender.com
```

---

## 📘 API Documentation

High-level API documentation is provided via **Postman Collection**.

Import the file below into Postman:

```
real-time-bidding-system.postman_collection.json
```

Set collection variable:

```
base_url = https://real-time-bidding-system-backend.onrender.com/api
```

Authentication uses Bearer JWT tokens.

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Roles:
  - `ADMIN`
  - `DEALER`

Protected routes require:

```
Authorization: Bearer <token>
```

---

## 🧠 Core Features

### ✅ Auction Lifecycle Management

- Create auction (ADMIN)
- Activate auction
- Close auction
- Fetch all auctions

### ✅ Transaction-Safe Bidding Engine

- Row-level locking using `SELECT FOR UPDATE`
- Prevents race conditions
- Ensures atomic price updates
- Validates bid > current price
- Rejects bids on closed auctions

### ✅ Auto-Close Auctions

- Automatically closes auctions when `endTime` has passed
- Enforced inside transaction logic

### ✅ Real-Time Updates (WebSocket)

- Socket.IO based event broadcasting
- Room-based auction subscription
- Emits:
  - `bid:update`
  - `auction:closed`

### ✅ Users Module

- Get current user profile
- Get all users (ADMIN only)
- Get user by ID (ADMIN only)
- Delete user (ADMIN only)

### ✅ Production-Ready Setup

- Dockerized deployment
- Automatic database migrations on container start
- Environment variable validation using Zod
- Deployed on Render

---

## 🏗 Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Drizzle ORM
- Socket.IO
- Docker
- Zod (Environment Validation)

---

## 🗄 Database Architecture

### Tables

- `users`
- `auctions`
- `bids`

### Key Design Decisions

- PostgreSQL `numeric(12,2)` for monetary precision
- Foreign key constraints with cascade deletes
- Indexed fields for performance
- Transaction-based bidding logic
- Row locking to prevent concurrent write conflicts

---

## ⚙️ Environment Variables

```
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
```

---

## 🧪 Running Locally

```bash
npm install
npm run build
npm run migrate
npm run start
```

---

## 🐳 Docker

Build and run:

```bash
docker build -t bidding-backend .
docker run -p 5000:5000 bidding-backend
```

Migrations run automatically on container startup.

---

## 🔄 Real-Time Flow

1. Client connects via Socket.IO
2. Client joins auction room
3. Dealer places bid
4. Transaction commits
5. Server emits `bid:update`
6. All clients in room receive updated price instantly

---

## 📦 Version

Current Version: **1.0.0**

---

## 📌 Notes

- Backend fully implemented and production deployed.
- Frontend was not completed due to time constraints.
- System focuses on transactional integrity, concurrency handling, and real-time updates.

---

## 👨‍💻 Author

Developed as part of Full Stack Assignment – Real-Time Bidding System.
