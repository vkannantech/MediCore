import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader, QuickLink, SectionCard, StatCard } from "@/components/ui";

export default async function UserDashboardPage() {
  const session = await requireSession("USER");
  if (!session.patientId) {
    return <p className="font-semibold text-[#b5413b]">Your account is not linked to a patient profile.</p>;
  }

  const patientId = session.patientId;
  const [appointments, records, bills, reports] = await Promise.all([
    prisma.appointment.count({ where: { patientId } }),
    prisma.medicalRecord.count({ where: { patientId } }),
    prisma.billing.count({ where: { patientId } }),
    prisma.patientReport.count({ where: { patientId } }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Patient portal"
        title="My health overview"
        description="A simple view of your appointments, records, bills, and diagnostic reports."
        action={
          <Link href="/profile" className="btn btn-primary">
            Open Profile
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Appointments" value={appointments} tone="green" />
        <StatCard label="Records" value={records} tone="ink" />
        <StatCard label="Bills" value={bills} tone="gold" />
        <StatCard label="Reports" value={reports} tone="coral" />
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
