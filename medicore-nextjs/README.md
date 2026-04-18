# MediCore Next.js

Next.js + MySQL version of MediCore with the same core modules:
- Authentication (Admin/User)
- Dashboard summaries
- Patient, Doctor, Appointment, Medical Record, Billing, and Test Report management
- Patient user dashboard + full profile view

## Tech Stack
- Next.js (App Router, TypeScript)
- Prisma ORM
- MySQL (local SQL Workbench database: `medicore`)
- Tailwind CSS

## 1. Configure local DB

Make sure MySQL is running and `medicore` database exists.

`.env`:
```env
DATABASE_URL="mysql://root:admin@localhost:3306/medicore"
JWT_SECRET="replace-with-a-strong-random-secret"
```

## 2. Install and prepare schema

```bash
npm install
npm run db:push
npm run db:seed
```

## 3. Run

```bash
npm run dev
```

Open: http://localhost:3000

## Default accounts
- Admin: `admin` / `1234`
- Staff user: `staff` / `staff123` (not patient-linked by default)
