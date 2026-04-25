import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard, StatCard } from "@/components/ui";

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  await requireSession("ADMIN");
  const filterPatientId = Number((await searchParams).patientId || 0);

  async function addRecord(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.medicalRecord.create({
      data: {
        patientId: Number(formData.get("patientId")),
        diagnosis: String(formData.get("diagnosis")),
        prescription: String(formData.get("prescription")),
      },
    });
    revalidatePath("/records");
    revalidatePath("/dashboard");
  }

  async function updateRecord(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.medicalRecord.update({
      where: { recordId: Number(formData.get("recordId")) },
      data: {
        diagnosis: String(formData.get("diagnosis")),
        prescription: String(formData.get("prescription")),
      },
    });
    revalidatePath("/records");
  }

  async function deleteRecord(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.medicalRecord.delete({ where: { recordId: Number(formData.get("recordId")) } });
    revalidatePath("/records");
    revalidatePath("/dashboard");
  }

  const [records, totalRecords, filteredPatient] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: filterPatientId ? { patientId: filterPatientId } : undefined,
      include: { patient: true },
      orderBy: { recordId: "desc" },
    }),
    prisma.medicalRecord.count(),
    filterPatientId
      ? prisma.patient.findUnique({ where: { patientId: filterPatientId }, select: { name: true } })
      : null,
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinical notes"
        title="Medical Records"
        description="Create diagnoses, prescriptions, and patient-specific record history."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Records" value={totalRecords} tone="ink" icon="records" />
        <StatCard label="Current View" value={records.length} tone="blue" icon="records" />
        <StatCard label="Patient Filter" value={filteredPatient?.name ?? "All"} tone="green" icon="patients" />
      </div>

      <SectionCard title="Add Record">
        <form action={addRecord} className="grid gap-2">
          <input name="patientId" required inputMode="numeric" placeholder="Patient ID" className="field" />
          <textarea name="diagnosis" required placeholder="Diagnosis" className="field" />
          <textarea name="prescription" placeholder="Prescription" className="field" />
          <button className="btn btn-primary">Save</button>
        </form>
      </SectionCard>

      <SectionCard title="View Records">
        <form method="get" className="mb-3 flex flex-wrap gap-2">
          <input
            name="patientId"
            placeholder="Filter by Patient ID"
            defaultValue={filterPatientId || ""}
            inputMode="numeric"
            className="field max-w-sm"
          />
          <button className="btn btn-secondary">Filter</button>
        </form>
        {records.length === 0 ? <EmptyState message="No records found for this view." /> : null}
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.recordId} className="record-card">
              <form action={updateRecord}>
                <input type="hidden" name="recordId" value={r.recordId} />
                <p className="mb-3 text-sm font-bold text-[#19332c]">
                  <span className="text-[#0f8f72]">#{r.recordId}</span> {r.patient.name} / Patient #{r.patientId}
                </p>
                <textarea
                  name="diagnosis"
                  defaultValue={r.diagnosis}
                  className="field mb-2 text-sm"
                />
                <textarea
                  name="prescription"
                  defaultValue={r.prescription ?? ""}
                  className="field mb-2 text-sm"
                />
                <div className="flex gap-2">
                  <button className="btn btn-warning btn-compact">Update</button>
                </div>
              </form>
              <form action={deleteRecord} className="mt-2">
                <input type="hidden" name="recordId" value={r.recordId} />
                <button className="btn btn-danger btn-compact">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
