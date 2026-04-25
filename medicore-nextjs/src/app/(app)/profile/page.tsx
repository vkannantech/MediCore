import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard, StatusPill, StatCard } from "@/components/ui";

export default async function ProfilePage() {
  const session = await requireSession("USER");
  if (!session.patientId) return <p className="font-semibold text-[#b5413b]">No patient linked to this account.</p>;

  const patient = await prisma.patient.findUnique({
    where: { patientId: session.patientId },
    include: {
      appointments: { include: { doctor: true }, orderBy: { date: "desc" } },
      medicalRecords: { orderBy: { recordId: "desc" } },
      billings: { orderBy: { date: "desc" } },
      reports: { orderBy: { reportDate: "desc" } },
    },
  });

  if (!patient) return <p className="font-semibold text-[#b5413b]">Patient profile not found.</p>;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Patient record"
        title={patient.name}
        description="Appointments, medical records, bills, and diagnostic reports connected to your profile."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Appointments" value={patient.appointments.length} tone="blue" icon="calendar" />
        <StatCard label="Records" value={patient.medicalRecords.length} tone="ink" icon="records" />
        <StatCard label="Bills" value={patient.billings.length} tone="gold" icon="bills" />
        <StatCard label="Reports" value={patient.reports.length} tone="violet" icon="reports" />
      </div>

      <SectionCard title="Patient Profile">
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ["ID", patient.patientId],
            ["Name", patient.name],
            ["Age", patient.age ?? "-"],
            ["Gender", patient.gender ?? "-"],
            ["Phone", patient.phone ?? "-"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-[#edf8f2] p-3">
              <p className="text-xs font-black uppercase tracking-normal text-[#61736c]">{label}</p>
              <p className="mt-1 font-black text-[#19332c]">{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Appointments">
        {patient.appointments.length === 0 ? <EmptyState message="No appointments available." /> : null}
        <ul className="space-y-2 text-sm">
          {patient.appointments.map((a) => (
            <li key={a.appointmentId} className="record-card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <span>
                  <span className="font-black text-[#0f8f72]">#{a.appointmentId}</span> {a.doctor.name} ({a.doctor.specialization}) on{" "}
                  {a.date.toISOString().slice(0, 10)}
                </span>
                <StatusPill
                  label={a.status ?? "Normal"}
                  tone={a.status === "Emergency" ? "coral" : a.status === "Completed" ? "green" : "blue"}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Medical Records">
        {patient.medicalRecords.length === 0 ? <EmptyState message="No medical records available." /> : null}
        <ul className="space-y-2 text-sm">
          {patient.medicalRecords.map((r) => (
            <li key={r.recordId} className="record-card">
              <p className="font-black text-[#0f8f72]">#{r.recordId}</p>
              <p className="mt-1 text-[#19332c]">Diagnosis: {r.diagnosis}</p>
              <p className="mt-1 text-[#61736c]">Prescription: {r.prescription || "-"}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Bills">
        {patient.billings.length === 0 ? <EmptyState message="No bills available." /> : null}
        <ul className="space-y-2 text-sm">
          {patient.billings.map((b) => (
            <li key={b.billId} className="record-card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <span>
                  <span className="font-black text-[#0f8f72]">#{b.billId}</span> Rs. {b.amount.toFixed(2)} / {b.paymentMethod}
                </span>
                <StatusPill
                  label={b.paymentStatus}
                  tone={b.paymentStatus === "Paid" ? "green" : b.paymentStatus === "Partial" ? "gold" : "coral"}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Test Reports">
        {patient.reports.length === 0 ? <EmptyState message="No test reports available." /> : null}
        <ul className="space-y-2 text-sm">
          {patient.reports.map((r) => (
            <li key={r.reportId} className="record-card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <span>
                  <span className="font-black text-[#0f8f72]">#{r.reportId}</span> {r.reportType} / {r.reportName}
                </span>
                <StatusPill
                  label={r.status}
                  tone={r.status === "Critical" ? "coral" : r.status === "Reviewed" ? "green" : r.status === "Received" ? "blue" : "gold"}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
