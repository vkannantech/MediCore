import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InsightCard, PageHeader, QuickLink, SectionCard, StatusPill, StatCard, TimelineItem } from "@/components/ui";

export default async function DashboardPage() {
  await requireSession("ADMIN");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [patients, doctors, appointmentsToday, emergencyAppointments, unpaidBills, pendingReports, records, revenue, latestAppointments] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count({ where: { date: today } }),
    prisma.appointment.count({ where: { status: "Emergency" } }),
    prisma.billing.count({ where: { paymentStatus: { in: ["Unpaid", "Partial"] } } }),
    prisma.patientReport.count({ where: { status: { in: ["Pending", "Critical"] } } }),
    prisma.medicalRecord.count(),
    prisma.billing.aggregate({ _sum: { amount: true } }),
    prisma.appointment.findMany({
      take: 5,
      include: { patient: true, doctor: true },
      orderBy: [{ date: "desc" }, { appointmentId: "desc" }],
    }),
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
      <div className="grid gap-3 lg:grid-cols-3">
        <InsightCard
          label="Urgent queue"
          value={emergencyAppointments}
          detail="Appointments currently marked as emergency and needing front-desk attention."
          tone={emergencyAppointments > 0 ? "coral" : "green"}
        />
        <InsightCard
          label="Open collections"
          value={unpaidBills}
          detail="Unpaid or partially paid bills that should be reviewed before discharge."
          tone={unpaidBills > 0 ? "gold" : "green"}
        />
        <InsightCard
          label="Diagnostics follow-up"
          value={pendingReports}
          detail="Pending or critical patient reports awaiting completion or clinical review."
          tone={pendingReports > 0 ? "violet" : "green"}
        />
      </div>
      <SectionCard title="Quick actions" subtitle="Jump into the most common desk workflows.">
        <div className="grid gap-3 md:grid-cols-3">
          <QuickLink href="/patients" label="Register patient" text="Add patient details and create linked logins." />
          <QuickLink href="/appointments" label="Book appointment" text="Match symptoms to a doctor specialization." />
          <QuickLink href="/billing" label="Generate bill" text="Record payment status, method, and notes." />
        </div>
      </SectionCard>
      <SectionCard title="Recent appointment activity" subtitle="Latest scheduled visits across the hospital.">
        {latestAppointments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#bfd9ce] bg-[#f7fffb] p-6 text-center text-sm font-medium text-[#61736c]">
            No appointment activity yet.
          </p>
        ) : (
          <div className="space-y-3">
            {latestAppointments.map((appointment) => (
              <TimelineItem
                key={appointment.appointmentId}
                title={`${appointment.patient.name} with ${appointment.doctor.name}`}
                meta={appointment.date.toISOString().slice(0, 10)}
                tone={appointment.status === "Emergency" ? "coral" : "green"}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span>{appointment.doctor.specialization ?? "General"}</span>
                  <StatusPill
                    label={appointment.status ?? "Normal"}
                    tone={appointment.status === "Emergency" ? "coral" : appointment.status === "Completed" ? "green" : "blue"}
                  />
                </div>
              </TimelineItem>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
