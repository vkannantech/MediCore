# MediCore Next.js - Intelligent Hospital Management System

A modern web-based hospital management system built with Next.js 16, TypeScript, Prisma 7, and MySQL. Complete port of the original Java Swing MediCore desktop application with enhanced security and multi-user support.

## 🎯 Features

### Admin Module
- **Dashboard** - Live statistics (patient count, doctors, today's appointments, medical records, revenue)
- **Patient Management** - Add/edit/delete patients, auto-generate login credentials
- **Doctor Management** - Manage doctors by specialization and availability
- **Appointment Booking** - Smart disease-to-specialization suggestion engine
- **Medical Records** - Track diagnoses and prescriptions by patient
- **Billing System** - Invoice generation, payment tracking, revenue aggregation
- **Test Reports** - Lab and scan report management with attachment tracking

### Patient Module
- **Personal Dashboard** - Quick stats (appointments, records, bills, reports)
- **Full Profile** - Consolidated view of all medical history and billing records
- **Medical History** - View all appointments, records, bills, and lab reports

### Security
- ✅ Role-based access control (ADMIN / USER)
- ✅ Bcrypt password hashing
- ✅ JWT session tokens (7-day expiry)
- ✅ HTTP-only cookies (sameSite=lax)
- ✅ Server-side form validation
- ✅ Protected routes with authentication middleware
- ✅ SQL injection prevention via Prisma ORM

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2 (App Router, Server Components, Server Actions)
- **Language:** TypeScript 5
- **ORM:** Prisma 7
- **Database:** MySQL 8
- **UI:** Tailwind CSS 4
- **Auth:** JWT + bcrypt
- **Validation:** Zod

## 📋 Prerequisites

1. **Node.js** 18+ or 20+
2. **MySQL** 8.0+ running on `localhost:3306`
3. **npm** or **pnpm** (package manager)

## ⚡ Quick Start

### 1. Clone & Install

```bash
cd D:\Projects\MediCore\medicore-nextjs
npm install
```

### 2. Configure Database

**Option A: Using MySQL Command Line**

```bash
mysql -u root -padmin -h localhost << EOF
CREATE DATABASE IF NOT EXISTS medicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Create new connection to `localhost:3306` with user `root`, password `admin`
3. Execute: `CREATE DATABASE IF NOT EXISTS medicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

### 3. Environment Setup

Create/verify `.env` file:

```env
DATABASE_URL="mysql://root:admin@localhost:3306/medicore"
JWT_SECRET="your-super-secret-key-change-in-production"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed sample data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Then open: **http://localhost:3000**

## 🔓 Default Credentials

After seeding, use these credentials to login:

| Role | Username | Password |
|------|----------|----------|
| ADMIN | `admin` | `1234` |
| STAFF | `staff` | `staff123` |

**Patient users can be created via Admin → Patients → "Create Login"**

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Sync Prisma schema with database
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio (visual DB manager)

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

## 🗂️ Project Structure

```
medicore-nextjs/
├── prisma/
│   ├── schema.prisma          # Data model definition
│   ├── seed.js                # Sample data generator
│   ├── migrations/            # Auto-generated SQL migrations
│   └── dev.db                 # SQLite dev database (if using)
│
├── src/
│   ├── app/
│   │   ├── (app)/             # Protected routes (require auth)
│   │   │   ├── layout.tsx      # Auth wrapper, navigation
│   │   │   ├── dashboard/      # Admin statistics dashboard
│   │   │   ├── user-dashboard/ # Patient personal dashboard
│   │   │   ├── patients/       # Patient CRUD management
│   │   │   ├── doctors/        # Doctor CRUD management
│   │   │   ├── appointments/   # Appointment booking + suggestion
│   │   │   ├── records/        # Medical record management
│   │   │   ├── billing/        # Invoice & payment tracking
│   │   │   ├── reports/        # Lab/scan report management
│   │   │   └── profile/        # Patient full profile view
│   │   │
│   │   ├── login/              # Public login page
│   │   ├── signup/             # Public signup page
│   │   ├── page.tsx            # Root redirect (based on role)
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles (dark theme)
│   │
│   ├── components/
│   │   ├── auth-buttons.tsx    # Logout button
│   │   ├── login-form.tsx      # Login form component
│   │   ├── signup-form.tsx     # Signup form component
│   │   └── ui.tsx              # Reusable UI cards (SectionCard, StatCard)
│   │
│   ├── lib/
│   │   ├── auth.ts             # JWT, sessions, password hashing
│   │   └── prisma.ts           # Prisma client singleton
│   │
│   └── server/
│       └── actions.ts          # Server actions (login, logout, signup)
│
├── prisma.config.ts            # Prisma 7 configuration
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── .env                        # Environment variables
```

## 🔐 Database Schema

### Models

- **User** - Authentication (email, username, password, role)
- **Patient** - Patient demographics (name, age, gender, phone)
- **Doctor** - Doctor profiles (name, specialization, availability)
- **Appointment** - Patient-doctor bookings (date, status, notes)
- **MedicalRecord** - Diagnoses & prescriptions (diagnosis, prescription, notes)
- **Billing** - Invoices & payments (amount, date, payment_status, payment_method)
- **PatientReport** - Lab/scan reports (report_type, result_summary, attachment_path)

### Relationships

- User → Patient (one-to-one, optional)
- Patient → Appointments (one-to-many)
- Patient → MedicalRecords (one-to-many)
- Patient → Billings (one-to-many)
- Patient → PatientReports (one-to-many)
- Doctor → Appointments (one-to-many)

## 🔧 Configuration

### JWT Secret (Important for Production)

The `.env` file contains a placeholder JWT_SECRET. For production:

```bash
# Generate a strong random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env
JWT_SECRET="<paste-generated-secret-here>"
```

### Database Connection

The app automatically reads DATABASE_URL from `.env`. Format:

```
mysql://username:password@host:port/database
```

Examples:
- Local: `mysql://root:admin@localhost:3306/medicore`
- Remote: `mysql://user:pass@db.example.com:3306/medicore`
- Cloud (Neon): `postgresql://user:pass@...` (requires different setup)

## 🧪 Seeding Data

The `prisma/seed.js` script creates:

- **Users:** admin, staff (with hashed passwords)
- **Doctors:** 6 sample doctors across specializations
- **Patients:** 3 sample patients with appointments, records, bills, reports
- **Sample Records:** Medical records, appointments, billing data

Run anytime to reset to sample data:

```bash
npm run db:seed
```

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Set environment variables in Vercel UI:
   - DATABASE_URL (production MySQL)
   - JWT_SECRET (strong random value)
4. Deploy

### Self-Hosted (Node.js)

```bash
# Build
npm run build

# Start production server
npm run start

# Or use PM2 for process management
pm2 start npm --name "medicore" -- start
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
COPY prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build & run:

```bash
docker build -t medicore .
docker run -p 3000:3000 -e DATABASE_URL=... medicore
```

## 🐛 Troubleshooting

### "Can't reach database server at localhost:3306"

**Solution:**
1. Verify MySQL is running: `mysql -u root -padmin -h localhost -e "SELECT 1"`
2. Check if port 3306 is listening: `netstat -an | findstr :3306` (Windows)
3. Verify connection string in `.env`

### "Unknown database 'medicore'"

**Solution:** Create database first:

```bash
mysql -u root -padmin -h localhost -e "CREATE DATABASE medicore CHARACTER SET utf8mb4;"
```

### "Prisma client not found"

**Solution:** Regenerate client:

```bash
npx prisma generate
npx prisma db push
```

### Port 3000 already in use

**Solution:** Kill process or use different port:

```bash
# Kill existing Node process
taskkill /IM node.exe /F

# Or use different port
npm run dev -- -p 3001
```

### Login shows "Invalid credentials"

**Solution:**
1. Verify users exist: `npx prisma studio` → Users table
2. Check seeding ran: `npm run db:seed`
3. Ensure passwords are correct (from seed: `admin`/`1234`)

### Build fails with Prisma errors

**Solution:**
1. Regenerate: `npx prisma generate`
2. Push schema: `npx prisma db push`
3. Rebuild: `npm run build`

## 📊 Statistics Dashboard

The admin dashboard displays real-time metrics:

- **Total Patients** - Count of all registered patients
- **Total Doctors** - Count of available doctors
- **Today's Appointments** - Appointments scheduled for today
- **Medical Records** - Total diagnoses and prescriptions recorded
- **Revenue** - Total billing amount across all invoices

## 🎨 UI Components

### Reusable Components (src/components/ui.tsx)

- **SectionCard** - Container for content sections with title
- **StatCard** - Displays a statistic with icon and label

### Form Components

- **LoginForm** - Email/username + password with validation
- **SignupForm** - Signup with password confirmation
- **LogoutButton** - Logout action button

## 🔑 Key Implementation Details

### Server Actions Pattern

All forms use Next.js Server Actions (`"use server"`):

```typescript
// src/server/actions.ts
export async function addPatient(formData: FormData) {
  const session = await requireSession("ADMIN");
  // Validate & create patient
  const patient = await prisma.patient.create({...});
  revalidatePath("/patients");
  return { success: true, patient };
}
```

### Protected Routes

Routes in `(app)` folder require authentication:

```typescript
// src/app/(app)/layout.tsx
export default async function Layout({children}) {
  const session = await requireSession(); // Enforces login
  // Only logged-in users see these routes
}
```

### Disease → Specialization Mapping

Appointments page uses smart suggestion:

```typescript
const DISEASE_MAP: Record<string, string> = {
  fever: "General",
  heart: "Cardiology",
  bone: "Orthopedic",
  eye: "Ophthalmology",
  // ...
};

// User enters symptom, gets suggested doctors
const suggested = suggestDoctors(symptom);
```

### Auto-Generated Patient Logins

Admin can create patient login directly:

```typescript
// Generate unique username and random password
const username = `patient_${name.toLowerCase().replace(/\s+/g, "_")}_${patientId}`;
const password = generateSecurePassword(); // 8 chars, mixed case + numbers
// Send to patient via SMS or email (future enhancement)
```

## 📝 Seed Data Details

**Doctors (6 total):**
- Dr. Rajesh Singh - General Medicine
- Dr. Priya Sharma - Cardiology
- Dr. Amit Patel - Orthopedics
- Dr. Neha Gupta - Pediatrics
- Dr. Arjun Reddy - Dermatology
- Dr. Sneha Pillai - Ophthalmology

**Patients (3 total):**
- John Doe - 45 years old
- Jane Smith - 38 years old
- Robert Johnson - 52 years old

All seeded data includes sample appointments, medical records, bills, and reports.

## 🎓 Development Tips

### Enable Debug Logging

In `src/lib/prisma.ts`, set log level:

```typescript
new PrismaClient({
  log: ["error", "warn", "info", "query"], // Enable query logging
})
```

### Open Prisma Studio

Visual database explorer:

```bash
npm run db:studio
# Opens http://localhost:5555
```

### Clear & Reseed Database

```bash
# Delete all tables and reseed
npx prisma migrate reset

# Or manually:
mysql -u root -padmin -e "DROP DATABASE medicore; CREATE DATABASE medicore;"
npm run db:push
npm run db:seed
```

### Type Safety in Server Actions

Prisma provides full type definitions—leverage autocomplete:

```typescript
const patient = await prisma.patient.create({
  data: {
    name: "John",           // Required
    age: 45,               // Required
    gender: "MALE",        // Enum: MALE | FEMALE
    phone: "123456789",    // Required
  },
});
// TypeScript catches errors at compile time
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm run dev`
3. Ensure type safety: `npm run type-check`
4. Run linter: `npm run lint`
5. Commit: `git commit -m "feat: add my feature"`
6. Push and create PR

## 📄 License

MIT - See LICENSE file

## 🆘 Support

For issues or questions:

1. Check **Troubleshooting** section above
2. Review `.env` configuration
3. Verify MySQL is running and accessible
4. Check application logs in terminal
5. Open issue with error logs and steps to reproduce

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Version:** 1.0.0  
**Last Updated:** March 2025  
**Status:** Production Ready ✅
