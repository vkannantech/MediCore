import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InsightCard, PageHeader, QuickLink, SectionCard, StatusPill, StatCard, TimelineItem } from "@/components/ui";

export default async function UserDashboardPage() {
  const session = await requireSession("USER");
  if (!session.patientId) {
    return <p className="font-semibold text-[#b5413b]">Your account is not linked to a patient profile.</p>;
  }

  const patientId = session.patientId;
  const [patient, appointments, records, bills, reports, openBalance, nextAppointment] = await Promise.all([
    prisma.patient.findUnique({ where: { patientId }, select: { name: true, age: true, phone: true } }),
    prisma.appointment.count({ where: { patientId } }),
    prisma.medicalRecord.count({ where: { patientId } }),
    prisma.billing.count({ where: { patientId } }),
    prisma.patientReport.count({ where: { patientId } }),
    prisma.billing.aggregate({
      where: { patientId, paymentStatus: { in: ["Unpaid", "Partial"] } },
      _sum: { amount: true },
    }),
    prisma.appointment.findFirst({
      where: { patientId, date: { gte: new Date() } },
      include: { doctor: true },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Patient portal"
        title={patient?.name ? `${patient.name}'s health overview` : "My health overview"}
        description="A simple view of your appointments, records, bills, and diagnostic reports."
        action={
          <Link href="/profile" className="btn btn-primary">
            Open Profile
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Appointments" value={appointments} tone="green" icon="calendar" />
        <StatCard label="Records" value={records} tone="ink" icon="records" />
        <StatCard label="Bills" value={bills} tone="gold" icon="bills" />
        <StatCard label="Reports" value={reports} tone="coral" icon="reports" />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <InsightCard
          label="Open balance"
          value={`Rs. ${(openBalance._sum.amount ?? 0).toFixed(2)}`}
          detail="Unpaid or partially paid billing amount currently visible in your patient account."
          tone={(openBalance._sum.amount ?? 0) > 0 ? "gold" : "green"}
        />
        <div className="rounded-lg border border-[#d8e8df] bg-white p-4">
          <p className="text-sm font-bold text-[#61736c]">Next appointment</p>
          {nextAppointment ? (
            <TimelineItem
              title={nextAppointment.doctor.name}
              meta={nextAppointment.date.toISOString().slice(0, 10)}
              tone={nextAppointment.status === "Emergency" ? "coral" : "blue"}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span>{nextAppointment.doctor.specialization ?? "General"}</span>
                <StatusPill label={nextAppointment.status ?? "Normal"} tone="blue" />
              </div>
            </TimelineItem>
          ) : (
            <p className="mt-2 text-sm leading-6 text-[#61736c]">No upcoming appointment is scheduled.</p>
          )}
        </div>
      </div>
      <SectionCard title="Next steps" subtitle="Your profile keeps everything grouped by patient record.">
        <div className="grid gap-3 md:grid-cols-2">
          <QuickLink href="/profile" label="Review visit history" text="See appointments and medical notes together." />
          <QuickLink href="/profile" label="Check reports and bills" text="Review payment status and diagnostic results." />
        </div>
      </SectionCard>
    </div>
  );
}
