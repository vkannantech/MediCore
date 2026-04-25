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

function usernameBase(name, patientId) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "patient";
  return `${clean}${patientId}`;
}

function defaultPatientPassword(username) {
  return `Medi@${username}`;
}

async function main() {
  const adminPassword = await bcrypt.hash("1234", 10);
  const staffPassword = await bcrypt.hash(defaultPatientPassword("staff"), 10);

  const patients = [
    { name: "Kannan V", age: 20, gender: "Male", phone: "9876543210" },
    { name: "Priya S", age: 35, gender: "Female", phone: "9123456789" },
    { name: "Raju M", age: 55, gender: "Male", phone: "9988776655" },
  ];

  const demoPatients = [];
  for (const p of patients) {
    const existing = await prisma.patient.findFirst({ where: { name: p.name, phone: p.phone } });
    demoPatients.push(existing ?? (await prisma.patient.create({ data: p })));
  }

  const staffSeed = { name: "Demo Staff Patient", age: 30, gender: "Other", phone: "9000000000" };
  const existingStaff = await prisma.user.findUnique({ where: { username: "staff" } });
  const staffPatient =
    (existingStaff?.patientId
      ? await prisma.patient.findUnique({ where: { patientId: existingStaff.patientId } })
      : null) ??
    (await prisma.patient.findFirst({ where: { name: staffSeed.name, phone: staffSeed.phone } })) ??
    (await prisma.patient.create({
      data: staffSeed,
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

  for (const patient of demoPatients) {
    const existing = await prisma.user.findFirst({ where: { patientId: patient.patientId } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "USER", password: await bcrypt.hash(defaultPatientPassword(existing.username), 10) },
      });
      continue;
    }

    const username = usernameBase(patient.name, patient.patientId);
    await prisma.user.upsert({
      where: { username },
      update: {
        role: "USER",
        patientId: patient.patientId,
        password: await bcrypt.hash(defaultPatientPassword(username), 10),
      },
      create: {
        username,
        password: await bcrypt.hash(defaultPatientPassword(username), 10),
        role: "USER",
        patientId: patient.patientId,
      },
    });
  }

  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.username === "admin") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN", password: adminPassword },
      });
      continue;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "USER",
        password: user.patientId ? await bcrypt.hash(defaultPatientPassword(user.username), 10) : user.password,
      },
    });
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
