import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader, QuickLink, SectionCard, StatCard } from "@/components/ui";

export default async function DashboardPage() {
  await requireSession("ADMIN");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [patients, doctors, appointmentsToday, records, revenue] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count({ where: { date: today } }),
    prisma.medicalRecord.count(),
    prisma.billing.aggregate({ _sum: { amount: true } }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin overview"
        title="Command center"
        description="Live hospital counts, today's appointment load, and the operational areas that need quick attention."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Patients" value={patients} tone="green" icon="patients" />
        <StatCard label="Doctors" value={doctors} tone="mint" icon="doctors" />
        <StatCard label="Today Appointments" value={appointmentsToday} tone="coral" icon="calendar" />
        <StatCard label="Medical Records" value={records} tone="ink" icon="records" />
        <StatCard label="Revenue" value={`Rs. ${(revenue._sum.amount ?? 0).toFixed(2)}`} tone="gold" icon="revenue" />
      </div>
      <SectionCard title="Quick actions" subtitle="Jump into the most common desk workflows.">
        <div className="grid gap-3 md:grid-cols-3">
          <QuickLink href="/patients" label="Register patient" text="Add patient details and create linked logins." />
          <QuickLink href="/appointments" label="Book appointment" text="Match symptoms to a doctor specialization." />
          <QuickLink href="/billing" label="Generate bill" text="Record payment status, method, and notes." />
        </div>
      </SectionCard>
    </div>
  );
}
