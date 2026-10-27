/* eslint-disable @typescript-eslint/no-require-imports */
// Idempotent demo seed. Safe to run repeatedly:
//  - creates the admin, doctors and demo patients only if they are missing
//  - never changes passwords of existing users (set SEED_RESET_PASSWORDS=1 to force)
//  - adds demo appointments/records/bills/reports only when those tables are empty
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

const adapter = new PrismaMariaDb(buildAdapterUrl(process.env.DATABASE_URL));
const prisma = new PrismaClient({ adapter });

const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "1234";
const RESET_PASSWORDS = process.env.SEED_RESET_PASSWORDS === "1";

function usernameBase(name, patientId) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "patient";
  return `${clean}${patientId}`;
}

// Demo-only convention so seeded patients can log in. Logins created from the
// Patients page get random one-time passwords instead.
function demoPatientPassword(username) {
  return `Medi@${username}`;
}

/** UTC midnight `offset` days from today (matches @db.Date storage). */
function day(offset) {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + offset));
}

async function ensureUser({ username, password, role, patientId = null }) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    if (RESET_PASSWORDS) {
      await prisma.user.update({ where: { id: existing.id }, data: { password: await bcrypt.hash(password, 10) } });
    }
    return { user: existing, created: false };
  }
  const user = await prisma.user.create({
    data: { username, password: await bcrypt.hash(password, 10), role, patientId },
  });
  return { user, created: true };
}

async function main() {
  const credentials = [];

  const admin = await ensureUser({ username: "admin", password: ADMIN_PASSWORD, role: "ADMIN" });
  credentials.push(["ADMIN", "admin", admin.created || RESET_PASSWORDS ? ADMIN_PASSWORD : "(unchanged)"]);

  const doctorSeeds = [
    { name: "Dr. Ravi Kumar", specialization: "General", availability: "Morning" },
    { name: "Dr. Priya Nair", specialization: "Cardiologist", availability: "Evening" },
    { name: "Dr. Arun Mehta", specialization: "Orthopedic", availability: "Morning" },
    { name: "Dr. Sunita Rao", specialization: "Pediatrician", availability: "Afternoon" },
    { name: "Dr. Karan Shah", specialization: "Dermatologist", availability: "Evening" },
    { name: "Dr. Meena Pillai", specialization: "Ophthalmologist", availability: "Morning" },
  ];
  const doctors = [];
  for (const doc of doctorSeeds) {
    doctors.push(
      (await prisma.doctor.findFirst({ where: { name: doc.name, specialization: doc.specialization } })) ??
        (await prisma.doctor.create({ data: doc })),
    );
  }

  const patientSeeds = [
    { name: "Kannan V", age: 20, gender: "Male", phone: "9876543210" },
    { name: "Priya S", age: 35, gender: "Female", phone: "9123456789" },
    { name: "Raju M", age: 55, gender: "Male", phone: "9988776655" },
  ];
  const patients = [];
  for (const p of patientSeeds) {
    const patient =
      (await prisma.patient.findFirst({ where: { name: p.name, phone: p.phone } })) ?? (await prisma.patient.create({ data: p }));
    patients.push(patient);

    const linked = await prisma.user.findFirst({ where: { patientId: patient.patientId } });
    const username = linked?.username ?? usernameBase(patient.name, patient.patientId);
    const result = await ensureUser({
      username,
      password: demoPatientPassword(username),
      role: "USER",
      patientId: patient.patientId,
    });
    credentials.push(["PATIENT", username, result.created || RESET_PASSWORDS ? demoPatientPassword(username) : "(unchanged)"]);
  }

  if ((await prisma.appointment.count()) === 0) {
    const [kannan, priya, raju] = patients;
    const [general, cardio, ortho, , derm] = doctors;

    await prisma.appointment.createMany({
      data: [
        { patientId: kannan.patientId, doctorId: general.doctorId, date: day(0), status: "Confirmed" },
        { patientId: raju.patientId, doctorId: cardio.doctorId, date: day(0), status: "Emergency" },
        { patientId: priya.patientId, doctorId: derm.doctorId, date: day(3), status: "Normal" },
        { patientId: kannan.patientId, doctorId: ortho.doctorId, date: day(7), status: "Normal" },
        { patientId: raju.patientId, doctorId: cardio.doctorId, date: day(-14), status: "Completed" },
        { patientId: priya.patientId, doctorId: general.doctorId, date: day(-30), status: "Completed" },
      ],
    });
    await prisma.medicalRecord.createMany({
      data: [
        { patientId: kannan.patientId, diagnosis: "Viral fever, mild dehydration", prescription: "Paracetamol 500mg TDS x 3 days; ORS" },
        { patientId: raju.patientId, diagnosis: "Hypertension stage 1", prescription: "Amlodipine 5mg OD; low-salt diet; review in 2 weeks" },
        { patientId: priya.patientId, diagnosis: "Iron-deficiency anaemia", prescription: "Ferrous sulphate 200mg OD x 90 days" },
      ],
    });
    await prisma.billing.createMany({
      data: [
        { patientId: raju.patientId, amount: "1500.00", date: day(-14), paymentStatus: "Paid", paymentMethod: "UPI", notes: "Cardiology consult + ECG" },
        { patientId: priya.patientId, amount: "650.00", date: day(-30), paymentStatus: "Paid", paymentMethod: "Cash", notes: "General consult" },
        { patientId: kannan.patientId, amount: "450.00", date: day(0), paymentStatus: "Unpaid", paymentMethod: "Cash", notes: "Consultation" },
        { patientId: raju.patientId, amount: "3200.00", date: day(0), paymentStatus: "Partial", paymentMethod: "Card", notes: "Emergency admission deposit" },
      ],
    });
    await prisma.patientReport.createMany({
      data: [
        { patientId: raju.patientId, reportType: "Blood Test", reportName: "Lipid Profile", reportDate: day(-14), status: "Reviewed", resultSummary: "LDL 142 mg/dL (borderline high)" },
        { patientId: priya.patientId, reportType: "Blood Test", reportName: "Complete Blood Count", reportDate: day(-30), status: "Reviewed", resultSummary: "Hb 9.8 g/dL (low)" },
        { patientId: raju.patientId, reportType: "ECG", reportName: "12-lead ECG", reportDate: day(0), status: "Critical", resultSummary: "ST changes; cardiology review requested" },
        { patientId: kannan.patientId, reportType: "Blood Test", reportName: "Dengue NS1", reportDate: day(0), status: "Pending" },
      ],
    });
    console.log("Seeded demo appointments, records, bills and reports.");
  } else {
    console.log("Clinical tables already have data; skipped demo clinical data.");
  }

  console.log("\nLogin accounts:");
  console.table(credentials.map(([role, username, password]) => ({ role, username, password })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
