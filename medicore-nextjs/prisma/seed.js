/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv/config");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

function buildAdapterUrl(url) {
  const normalized = url.replace(/^mysql:\/\//, "mariadb://");
  const parsed = new URL(normalized);

  if (!parsed.searchParams.has("allowPublicKeyRetrieval")) {
    parsed.searchParams.set("allowPublicKeyRetrieval", "true");
  }

  return parsed.toString();
}

const adapterUrl = buildAdapterUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(adapterUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("1234", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  const patients = [
    { name: "Kannan V", age: 20, gender: "Male", phone: "9876543210" },
    { name: "Priya S", age: 35, gender: "Female", phone: "9123456789" },
    { name: "Raju M", age: 55, gender: "Male", phone: "9988776655" },
  ];

  for (const p of patients) {
    const existing = await prisma.patient.findFirst({ where: { name: p.name, phone: p.phone } });
    if (!existing) await prisma.patient.create({ data: p });
  }

  const existingStaff = await prisma.user.findUnique({ where: { username: "staff" } });
  const staffPatient =
    (existingStaff?.patientId
      ? await prisma.patient.findUnique({ where: { patientId: existingStaff.patientId } })
      : null) ??
    (await prisma.patient.findFirst({
      where: { users: { none: {} } },
      orderBy: { patientId: "asc" },
    })) ??
    (await prisma.patient.create({
      data: { name: "Demo Patient", age: 30, gender: "Other", phone: "9000000000" },
    }));

  await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "staff" },
    update: { password: staffPassword, role: "USER", patientId: staffPatient.patientId },
    create: {
      username: "staff",
      password: staffPassword,
      role: "USER",
      patientId: staffPatient.patientId,
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

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
