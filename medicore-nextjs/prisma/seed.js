/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv/config");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapterUrl = process.env.DATABASE_URL.replace(/^mysql:\/\//, "mariadb://");
const adapter = new PrismaMariaDb(adapterUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("1234", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: { role: "ADMIN" },
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "staff" },
    update: {},
    create: {
      username: "staff",
      password: staffPassword,
      role: "USER",
    },
  });

  const doctorSeeds = [
    { name: "Dr. Ravi Kumar", specialization: "General", availability: "Morning" },
    { name: "Dr. Priya Nair", specialization: "Cardiologist", availability: "Evening" },
    { name: "Dr. Arun Mehta", specialization: "Orthopedic", availability: "Morning" },
    { name: "Dr. Sunita Rao", specialization: "Pediatrician", availability: "Afternoon" },
    { name: "Dr. Karan Shah", specialization: "Dermatologist", availability: "Evening" },
    { name: "Dr. Meena Pillai", specialization: "Ophthalmologist", availability: "Morning" },
  ];

  for (const doc of doctorSeeds) {
    const existing = await prisma.doctor.findFirst({
      where: { name: doc.name, specialization: doc.specialization ?? undefined },
    });
    if (!existing) await prisma.doctor.create({ data: doc });
  }

  const patients = [
    { name: "Kannan V", age: 20, gender: "Male", phone: "9876543210" },
    { name: "Priya S", age: 35, gender: "Female", phone: "9123456789" },
    { name: "Raju M", age: 55, gender: "Male", phone: "9988776655" },
  ];

  for (const p of patients) {
    const existing = await prisma.patient.findFirst({ where: { name: p.name, phone: p.phone } });
    if (!existing) await prisma.patient.create({ data: p });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
