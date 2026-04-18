import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard } from "@/components/ui";

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

  const records = await prisma.medicalRecord.findMany({
    where: filterPatientId ? { patientId: filterPatientId } : undefined,
    include: { patient: true },
    orderBy: { recordId: "desc" },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinical notes"
        title="Medical Records"
        description="Create diagnoses, prescriptions, and patient-specific record history."
      />

      <SectionCard title="Add Record">
        <form action={addRecord} className="grid gap-2">
          <input name="patientId" required placeholder="Patient ID" className="field" />
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
                  <span className="text-[#0f8f72]">#{r.recordId}</span> {r.patient.name}
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
