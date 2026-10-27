# MediCore (Next.js + MySQL)

Hospital management web app: patients, doctors, appointments (with symptom → specialist hints),
medical records, billing, lab reports, and a patient self-service portal.

**Stack:** Next.js 16 (App Router, server actions) · React 19 · Prisma 7 (MariaDB driver adapter) ·
MySQL 8.4 · Tailwind CSS 4 · `jose` JWT sessions in httpOnly cookies · bcrypt.

## Quick start

Requirements: **Node.js ≥ 20.9** and **Docker** (for MySQL).

```bash
cd /path/to/MediCore
./start.sh            # first run: creates .env, starts MySQL, installs, migrates, seeds, runs dev server
```

Open <http://localhost:3000>.

| Role    | Username   | Password        |
|---------|------------|-----------------|
| Admin   | `admin`    | `1234`          |
| Patient | `kannanv1` | `Medi@kannanv1` |
| Patient | `priyas2`  | `Medi@priyas2`  |
| Patient | `rajum3`   | `Medi@rajum3`   |

These are **demo accounts** created by the seed. Change them before using real data
(`SEED_ADMIN_PASSWORD=... ./start.sh seed` only affects a *new* database; see below).

## `start.sh` commands

| Command | What it does |
|---|---|
| `./start.sh` | Setup + dev server with hot reload |
| `./start.sh prod` | Setup + optimized build served by the standalone Node server |
| `./start.sh docker` | Setup + app and MySQL both as containers |
| `./start.sh setup` | Setup only |
| `./start.sh status` | Container state and `/api/health` |
| `./start.sh stop` | Stop containers (data is kept) |
| `./start.sh logs` | Follow MySQL logs |
| `./start.sh seed` | Re-run the idempotent demo seed |
| `./start.sh check` | Lint + typecheck + production build |
| `./start.sh reset-db` | **Delete all data** and rebuild the database |

`PORT=3001 ./start.sh` runs on another port. The script works from any directory.

## Configuration (`medicore-nextjs/.env`)

Created automatically from `.env.example` with random secrets. Never commit it.

| Variable | Purpose |
|---|---|
| `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | MySQL container credentials |
| `MYSQL_PORT` | Host port for MySQL (default **3307**, so it never clashes with a system MySQL on 3306) |
| `DATABASE_URL` | Connection string used by the app; must match the values above |
| `JWT_SECRET` | Session signing key, ≥ 32 random characters |
| `APP_PORT` | App port (default 3000) |
| `DB_MODE` | `docker` (default) or `external` to use your own MySQL via `DATABASE_URL` |
| `APP_TIMEZONE` | Optional IANA zone for "today" (default: server time zone) |
| `COOKIE_SECURE` | `true` when served over HTTPS (default: on in production) |
| `SEED_ADMIN_PASSWORD` | Admin password used when the seed creates the admin user |

## Development

```bash
cd medicore-nextjs
npm run dev               # dev server (DB must be running: ./start.sh setup)
npm run check             # lint + typecheck + build
npm run test:smoke        # 28 end-to-end checks against a running server (BASE_URL to override)
npm run db:migrate -- --name <change>   # after editing prisma/schema.prisma
npm run db:studio         # browse data at http://localhost:5555
```

Schema changes go through **Prisma migrations** (`prisma/migrations`); `start.sh` applies pending
ones automatically with `prisma migrate deploy`. Table and column names match the Java Swing
desktop app (`../medicore_setup.sql`), so both can share one database.

## How it is built

```
src/
  app/(app)/…/page.tsx   Admin + patient pages; each form posts to a server action
  app/api/health         DB-backed health probe for start.sh, Docker and load balancers
  lib/auth.ts            bcrypt, JWT cookie sessions, per-request user re-validation
  lib/form.ts            Form parsing/validation + runFormAction (friendly ?ok= / ?error= results)
  lib/dates.ts           Time-zone-safe "today" for DATE columns, money formatting
  lib/prisma.ts          Prisma client with the MariaDB adapter (works with MySQL)
prisma/                  schema, migrations, idempotent seed
scripts/smoke-test.mjs   Dependency-free E2E test that submits the real HTML forms
docker-compose.yml       MySQL 8.4 (+ optional production app container)
Dockerfile               Multi-stage, standalone output, non-root user, healthcheck
```

### Security notes
- Passwords are bcrypt-hashed. Logins created by an admin get a **random one-time password**
  that is shown once; there is no predictable default.
- Sessions are httpOnly, SameSite=Lax cookies; every request re-checks the user in the database,
  so deleted users and role changes take effect immediately.
- Every server action re-checks the admin role and validates input (types, lengths, allowed values).
- Next.js rejects server actions whose `Origin` does not match the host (CSRF protection).
- Security headers: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- Legacy plain-text passwords (from the desktop app) are upgraded to bcrypt on first login.

### Scaling
The app is stateless (sessions live in signed cookies), so you can run several instances behind a
load balancer that probes `/api/health`. Point `DATABASE_URL` at a managed MySQL with connection
pooling, set `DB_MODE=external`, and deploy the Docker image or to any Node host. Lists are
capped at 100 rows with search and filters, and dashboard counts are backed by indexes.
