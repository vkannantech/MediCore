# MediCore Next.js - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Create Database (1 min)

```bash
mysql -u root -padmin << EOF
CREATE DATABASE IF NOT EXISTS medicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
```

Or use MySQL Workbench to create database named `medicore`.

### Step 2: Install & Setup (2 min)

```bash
cd D:\Projects\MediCore\medicore-nextjs

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema
npx prisma db push

# Seed sample data
npm run db:seed
```

### Step 3: Start Server (1 min)

```bash
npm run dev
```

### Step 4: Login (1 min)

Open http://localhost:3000 and login with:

**Admin:**
- Username: `admin`
- Password: `1234`

**Staff (limited access):**
- Username: `staff`
- Password: `staff123`

---

## ✅ What's Included

### Admin Dashboard
- 📊 Live statistics (patients, doctors, appointments, revenue)
- 👥 Manage patients (add, edit, delete, create logins)
- 👨‍⚕️ Manage doctors (by specialization)
- 📅 Book appointments (with smart symptom suggestions)
- 📋 Track medical records
- 💰 Manage billing & payments
- 🔬 Store lab & scan reports

### Patient Section
- 📱 Personal dashboard
- 👤 Full profile with all medical history
- 📊 View appointments, records, bills, reports

### Security
- ✅ Password hashing (bcrypt)
- ✅ JWT sessions (7-day expiry)
- ✅ Role-based access control
- ✅ Form validation

---

## 📁 Project Structure

```
medicore-nextjs/
├── src/
│   ├── app/
│   │   ├── (app)/           # Protected routes
│   │   │   ├── dashboard/   # Admin dashboard
│   │   │   ├── patients/    # Patient CRUD
│   │   │   ├── doctors/     # Doctor CRUD
│   │   │   ├── appointments/
│   │   │   ├── records/
│   │   │   ├── billing/
│   │   │   ├── reports/
│   │   │   └── profile/     # Patient profile
│   │   ├── login/           # Public login
│   │   └── signup/          # Public signup
│   ├── lib/auth.ts          # Authentication
│   └── components/          # UI components
├── prisma/
│   ├── schema.prisma        # Data model
│   └── seed.js              # Sample data
└── .env                     # Database config
```

---

## 🔧 Common Tasks

### Start Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

### View Database
```bash
npm run db:studio
# Opens visual database manager
```

### Reset to Sample Data
```bash
npm run db:seed
```

### Build for Production
```bash
npm run build
npm run start
```

### Check Types
```bash
npm run type-check
```

---

## 🎯 Test the System

1. **Login** with admin/1234
2. **Add Patient** → Click "Patients" → Add new patient
3. **Create Patient Login** → Click patient card → "Create Login"
4. **Logout** & login with patient credentials
5. **View Profile** → See all medical records, appointments, bills

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Verify MySQL is running
mysql -u root -padmin -h localhost -e "SELECT 1"

# If not, start MySQL (Windows)
mysql.server start
# Or restart MySQL Service in Services app
```

### "Unknown database" Error
```bash
mysql -u root -padmin -h localhost << EOF
CREATE DATABASE IF NOT EXISTS medicore CHARACTER SET utf8mb4;
EOF
```

### Prisma Client Error
```bash
npx prisma generate
npx prisma db push
```

### Port 3000 Already Used
```bash
npm run dev -- -p 3001
# Then open http://localhost:3001
```

---

## 📝 Environment File (.env)

```env
DATABASE_URL="mysql://root:admin@localhost:3306/medicore"
JWT_SECRET="change-this-to-random-secret-in-production"
```

**For Production:** Generate strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎨 Sample Features

### Auto-Generated Patient Login
Admin can create patient login instantly:
- Username: `patient_john_doe_123`
- Password: `xK9$mL2@` (random, secure)

### Smart Appointment Booking
Enter disease/symptom to get suggested doctors:
- "fever" → General Medicine
- "heart pain" → Cardiology
- "bone pain" → Orthopedics

### Billing System
- Generate invoices
- Track payment status
- View revenue reports

---

## 📞 Database Credentials

```
Host:     localhost
Port:     3306
User:     root
Password: admin
Database: medicore
```

Change these in `.env` if you use different credentials.

---

## 🚀 Next Steps

1. ✅ Run the application
2. ✅ Test all features
3. ✅ Read full README_COMPLETE.md for advanced setup
4. ✅ Deploy to Vercel or Node.js host

---

**Status:** Build Complete ✅ | Ready to Deploy 🚀
