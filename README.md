# OpsDesk Admin (Demo / Case Study)

OpsDesk Admin is a reference implementation of a fintech/SaaS-style admin dashboard + API with **role-based access control (RBAC)**, **audit logs**, and **secure-by-default** patterns.

This is a **demo project** (not a client claim). It’s built to show how I structure real production work: layered architecture, clear boundaries, and practical security.

## What’s included

- Next.js (App Router) admin UI skeleton (login + protected routes pattern)
- Node.js API (Express) with layered structure (routes → services → db)
- JWT auth + RBAC middleware
- Postgres schema + simple SQL migrations
- Audit log event trail (who did what, when)
- Docker-friendly local dev

## Threat model (high level)

**Primary assets**
- User accounts + roles (authorization integrity)
- Admin actions (auditability and non-repudiation)
- Session/JWT secrets (token integrity)

**Main attack surfaces**
- Login endpoints (brute force, credential stuffing)
- Admin endpoints (IDOR / missing role checks)
- Dashboard UI (XSS, CSRF depending on token storage)
- Database layer (SQL injection, excessive privileges)

**Abuse cases → mitigations (examples)**
- Brute force / credential stuffing → rate limiting, safe responses, optional lockouts
- Privilege escalation via missing checks → centralized RBAC guards + resource checks
- Token theft → short-lived tokens, httpOnly cookies (optional), secure headers, avoid localStorage
- Sensitive data leakage → minimal error detail, structured logs without secrets
- Enumeration (user IDs, emails) → consistent errors, pagination, access checks

## Quick start (local)

### 1) Start Postgres
`docker compose up -d db`

### 2) Configure env
Copy env examples:
- `apps/api/.env.example` → `apps/api/.env`
- `apps/web/.env.example` → `apps/web/.env`

### 3) Run API
`cd apps/api`
`npm install`
`npm run db:migrate`
`npm run db:seed`
`npm run dev`

### 4) Run web
`cd ../web`
`npm install`
`npm run dev`

## Security considerations (implementation notes)

- **Passwords:** hashed (bcrypt) and never logged.
- **Auth:** JWT-based; keep tokens short-lived; consider refresh tokens via httpOnly cookies for production.
- **RBAC:** enforced on the API, not just the UI.
- **Audit log:** records security-relevant events (login, role changes, admin actions).
- **Headers:** `helmet` is enabled; add CSP in production.
- **Rate limits:** applied on auth and webhook-like surfaces (if added).
