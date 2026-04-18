# MediCore Next.js - Setup Guide

## Prerequisites

1. **Node.js** 18+ installed
2. **MySQL** running locally with:
   - Host: `localhost:3306`
   - Root user: `root`
   - Root password: `admin`

## Step 1: Start MySQL

Using MySQL Workbench or MySQL Server:
```bash
# Verify MySQL is running on port 3306
mysql -u root -p -h localhost -e "SELECT 1"
# When prompted, enter password: admin
```

## Step 2: Create Database

```bash
# Log into MySQL
mysql -u root -padmin

# In MySQL shell:
CREATE DATABASE IF NOT EXISTS medicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## Step 3: Install & Setup Project

```bash
cd D:\Projects\MediCore\medicore-nextjs

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed sample data
npm run db:seed

# Lint and build
npm run lint
npm run build
```

## Step 4: Run Development Server

```bash
npm run dev
```

Then open: **http://localhost:3000**

## Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin`  | `1234`   | ADMIN (full access) |
| `staff`  | `staff123` | USER (limited) |

## Database Schema

Tables created:
- `User` — Admin & patient users with role-based access
- `Patient` — Patient demographics
- `Doctor` — Doctor profiles with specialization & availability
- `Appointment` — Patient-doctor bookings
- `MedicalRecord` — Diagnosis & prescriptions
- `Billing` — Invoice tracking with payment status
- `PatientReport` — Lab/scan reports and attachments

Seed data includes:
- 6 sample doctors (various specializations)
- 3 sample patients
- Sample reports and billing records

## Project Structure

```
medicore-nextjs/
├── prisma/
│   ├── schema.prisma       # Data model
│   └── seed.js             # Seed data
├── src/
│   ├── app/
│   │   ├── (app)/          # Protected routes (requires auth)
│   │   │   ├── dashboard/  # Admin dashboard
│   │   │   ├── patients/   # Patient CRUD
│   │   │   ├── doctors/    # Doctor CRUD
│   │   │   ├── appointments/
│   │   │   ├── records/    # Medical records
│   │   │   ├── billing/
│   │   │   ├── reports/    # Lab reports
│   │   │   ├── user-dashboard/ # Patient dashboard
│   │   │   └── profile/    # Patient full profile
│   │   ├── login/          # Login form
│   │   ├── signup/         # Signup form
│   │   └── layout.tsx      # Auth wrapper
│   ├── components/
│   │   ├── auth-buttons.tsx
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── ui.tsx          # Reusable UI cards
│   ├── lib/
│   │   ├── auth.ts         # Auth logic & session management
│   │   └── prisma.ts       # Prisma singleton
│   └── server/
│       └── actions.ts      # Server actions
├── prisma.config.ts        # Prisma config
├── package.json
└── .env                    # Database URL & JWT secret
```

## Features Implemented

### Admin Module
- Dashboard with live statistics
- Patient management (add/edit/delete + create login)
- Doctor management (add/edit/delete)
- Appointment booking with smart symptom → specialization suggestion
- Medical records (create/edit/delete)
- Billing system with payment tracking
- Test report management

### Patient Module (User)
- User dashboard with quick stats
- Full patient profile with all linked records
- View appointments, medical records, bills, and lab reports

### Authentication
- JWT-based session management
- Role-based access control (ADMIN / USER)
- Secure password hashing with bcrypt
- 7-day session expiry

## Environment Variables

`.env`:
```env
DATABASE_URL="mysql://root:admin@localhost:3306/medicore"
JWT_SECRET="replace-with-a-strong-random-secret-key-for-production"
```

## Troubleshooting

### "Can't reach database server at localhost:3306"
- Ensure MySQL is running
- Check connection string in `.env`
- Verify root password is correct

### "Unknown database 'medicore'"
- Create the database manually (see Step 2 above)

### Prisma client not found
- Run: `npx prisma generate`

### Port 3000 already in use
- Kill existing process: `lsof -ti :3000 | xargs kill -9` (Mac/Linux)
- Or use different port: `npm run dev -- -p 3001`

## Building for Production

```bash
npm run build
npm run start
```

Ensure JWT_SECRET is set to a strong random value in production environment.
