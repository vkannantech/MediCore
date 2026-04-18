# Quick Command Reference

## 📋 Copy-Paste Commands

Use these commands exactly as written below.

---

## 1️⃣ Setup Commands (First Time Only)

### Create Database
```bash
mysql -u root -padmin << EOF
CREATE DATABASE IF NOT EXISTS medicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
```

### Install & Initialize
```bash
cd D:\Projects\MediCore\medicore-nextjs
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

---

## 2️⃣ Start Development

### Start Server
```bash
cd D:\Projects\MediCore\medicore-nextjs
npm run dev
```

**Then open:** http://localhost:3000

**Login:** admin / 1234

---

## 3️⃣ Common Tasks

### View Database in Browser
```bash
npm run db:studio
```
Opens: http://localhost:5555

### Rebuild Project
```bash
npm run build
```

### Check TypeScript
```bash
npm run type-check
```

### Run Linter
```bash
npm run lint
```

### Reset Database (Delete All Data)
```bash
npx prisma migrate reset
```

### Reseed Sample Data
```bash
npm run db:seed
```

---

## 4️⃣ Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

---

## 5️⃣ Troubleshooting Commands

### Verify MySQL Connection
```bash
mysql -u root -padmin -h localhost -e "SELECT 1"
```

### Regenerate Prisma Client
```bash
npx prisma generate
```

### Push Schema to Database
```bash
npx prisma db push
```

### List Databases
```bash
mysql -u root -padmin -e "SHOW DATABASES"
```

### Verify Database Created
```bash
mysql -u root -padmin -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='medicore'"
```

---

## 6️⃣ Development Server Management

### Kill Running Process (if stuck)
```bash
taskkill /IM node.exe /F
```

### Use Different Port (if 3000 taken)
```bash
npm run dev -- -p 3001
```

---

## 📝 Environment Variables

### .env File Content
Create file: `D:\Projects\MediCore\medicore-nextjs\.env`

```env
DATABASE_URL="mysql://root:admin@localhost:3306/medicore"
JWT_SECRET="change-this-to-strong-random-value-in-production"
```

---

## 🔑 Login Credentials

After `npm run db:seed`:

```
Admin Login:
  Username: admin
  Password: 1234

Staff Login:
  Username: staff
  Password: staff123
```

---

## 📂 Important File Paths

```
Project Root:
  D:\Projects\MediCore\medicore-nextjs

Key Files:
  .env                          (edit for config)
  src/app/page.tsx              (homepage)
  prisma/schema.prisma          (database schema)
  prisma/seed.js                (sample data)

Documentation:
  QUICKSTART.md                 (5-min setup)
  README_COMPLETE.md            (full guide)
  SETUP_GUIDE.md                (detailed steps)
```

---

## ✅ Quick Verification

### Check Everything Works
```bash
# 1. Test MySQL
mysql -u root -padmin -h localhost -e "USE medicore; SELECT COUNT(*) FROM User;" 

# 2. Generate Prisma
cd D:\Projects\MediCore\medicore-nextjs
npx prisma generate

# 3. Build
npm run build

# 4. Start
npm run dev
```

If all pass → You're ready! ✅

---

## 🆘 Help Commands

### Show All npm Scripts
```bash
npm run
```

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### List npm Packages
```bash
npm list --depth=0
```

### Check Disk Space
```bash
dir
```

---

## 💾 Backup Commands

### Backup Database
```bash
mysqldump -u root -padmin medicore > medicore_backup.sql
```

### Restore Database
```bash
mysql -u root -padmin medicore < medicore_backup.sql
```

---

## 🔧 Advanced Commands

### View Prisma Migrations
```bash
npx prisma migrate status
```

### Create Manual Migration
```bash
npx prisma migrate dev --name description_here
```

### Validate Prisma Schema
```bash
npx prisma validate
```

### Format Prisma Schema
```bash
npx prisma format
```

---

## 📊 Database Commands

### Create Table (Manual)
```sql
mysql -u root -padmin medicore << EOF
DESCRIBE User;
EOF
```

### Check All Tables
```bash
mysql -u root -padmin -e "USE medicore; SHOW TABLES;"
```

### Check Table Structure
```bash
mysql -u root -padmin -e "USE medicore; DESCRIBE Patient;"
```

### Count Records
```bash
mysql -u root -padmin -e "USE medicore; SELECT COUNT(*) FROM User;"
```

---

## 🚀 Deployment Commands

### Build for Vercel
```bash
npm run build
```

### Build for Docker
```bash
docker build -t medicore .
docker run -p 3000:3000 medicore
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

---

## 📝 Script Summary

| Command | What It Does |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run db:push` | Sync database schema |
| `npm run db:seed` | Add sample data |
| `npm run db:studio` | Open database UI |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate reset` | Delete & reseed database |

---

## 🎯 Most Used Commands

### Development Flow
```bash
npm run dev                    # Start server
# Edit code
# Page auto-reloads
# Fix any errors
# Repeat
```

### Testing New Features
```bash
npm run build                  # Build before test
npm run start                  # Run production version
# Test features
# Check performance
```

### Resetting Everything
```bash
npm run db:seed                # Reset to sample data
npm run dev                    # Restart server
```

---

## 💡 Pro Tips

- Use `npm run dev` during development (auto-reload)
- Use `npm run build` before production (optimize)
- Use `npm run db:studio` to visualize database
- Check logs in terminal for errors
- Clear browser cache (Ctrl+Shift+Delete) if pages don't update

---

**Keep this file handy for quick reference!** 📌
