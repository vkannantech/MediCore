import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LIST_LIMIT } from "@/lib/constants";
import { int, optionalText, runFormAction, text } from "@/lib/form";
import { EmptyState, FlashMessage, ListLimitNote, PageHeader, PatientIdInput, SectionCard, StatCard } from "@/components/ui";

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string; ok?: string; error?: string }>;
}) {
  await requireSession("ADMIN");
  const params = await searchParams;
  const filterPatientId = /^\d+$/.test(params.patientId ?? "") ? Number(params.patientId) : 0;

  async function addRecord(formData: FormData) {
    "use server";
    await runFormAction(
      "/records",
      async () => {
        await requireSession("ADMIN");
        const record = await prisma.medicalRecord.create({
          data: {
            patientId: int(formData, "patientId", "Patient ID", { min: 1 }),
            diagnosis: text(formData, "diagnosis", "Diagnosis", { required: true, max: 10_000 }),
            prescription: optionalText(formData, "prescription", "Prescription", 10_000),
          },
        });
        return `Record #${record.recordId} saved.`;
      },
      ["/dashboard"],
    );
  }

  async function updateRecord(formData: FormData) {
    "use server";
    await runFormAction("/records", async () => {
      await requireSession("ADMIN");
      const recordId = int(formData, "recordId", "Record ID");
      await prisma.medicalRecord.update({
        where: { recordId },
        data: {
          diagnosis: text(formData, "diagnosis", "Diagnosis", { required: true, max: 10_000 }),
          prescription: optionalText(formData, "prescription", "Prescription", 10_000),
        },
      });
      return `Record #${recordId} updated.`;
    });
  }

  async function deleteRecord(formData: FormData) {
    "use server";
    await runFormAction(
      "/records",
      async () => {
        await requireSession("ADMIN");
        const recordId = int(formData, "recordId", "Record ID");
        await prisma.medicalRecord.delete({ where: { recordId } });
        return `Record #${recordId} deleted.`;
      },
      ["/dashboard"],
    );
  }

  const [records, totalRecords, filteredPatient, patientOptions] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: filterPatientId ? { patientId: filterPatientId } : undefined,
      include: { patient: { select: { name: true } } },
      orderBy: { recordId: "desc" },
      take: LIST_LIMIT,
    }),
    prisma.medicalRecord.count(),
    filterPatientId ? prisma.patient.findUnique({ where: { patientId: filterPatientId }, select: { name: true } }) : null,
    prisma.patient.findMany({ select: { patientId: true, name: true }, orderBy: { patientId: "desc" }, take: 500 }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinical notes"
        title="Medical Records"
        description="Create diagnoses, prescriptions, and patient-specific record history."
      />
      <FlashMessage ok={params.ok} error={params.error} />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Records" value={totalRecords} tone="ink" icon="records" />
        <StatCard label="Current View" value={records.length} tone="blue" icon="records" />
        <StatCard label="Patient Filter" value={filteredPatient?.name ?? "All"} tone="green" icon="patients" />
      </div>

      <SectionCard title="Add Record">
        <form action={addRecord} className="grid gap-2">
          <PatientIdInput patients={patientOptions} />
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
                <textarea name="diagnosis" required defaultValue={r.diagnosis} className="field mb-2 text-sm" aria-label="Diagnosis" />
                <textarea name="prescription" defaultValue={r.prescription ?? ""} className="field mb-2 text-sm" aria-label="Prescription" />
                <button className="btn btn-warning btn-compact">Update</button>
              </form>
              <form action={deleteRecord} className="mt-2">
                <input type="hidden" name="recordId" value={r.recordId} />
                <button className="btn btn-danger btn-compact">Delete</button>
              </form>
            </div>
          ))}
        </div>
        <ListLimitNote shown={records.length} limit={LIST_LIMIT} />
      </SectionCard>
    </div>
  );
}
