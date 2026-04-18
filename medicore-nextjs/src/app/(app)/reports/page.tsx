import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard } from "@/components/ui";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  await requireSession("ADMIN");
  const patientId = Number((await searchParams).patientId || 0);

  async function addReport(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.patientReport.create({
      data: {
        patientId: Number(formData.get("patientId")),
        reportType: String(formData.get("reportType")),
        reportName: String(formData.get("reportName")),
        reportDate: new Date(String(formData.get("reportDate"))),
        status: String(formData.get("status") ?? "Pending"),
        resultSummary: String(formData.get("resultSummary") ?? ""),
        attachmentPath: String(formData.get("attachmentPath") ?? ""),
      },
    });
    revalidatePath("/reports");
    revalidatePath("/dashboard");
  }

  async function updateReport(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.patientReport.update({
      where: { reportId: Number(formData.get("reportId")) },
      data: {
        status: String(formData.get("status")),
        resultSummary: String(formData.get("resultSummary")),
        attachmentPath: String(formData.get("attachmentPath")),
      },
    });
    revalidatePath("/reports");
  }

  async function deleteReport(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.patientReport.delete({ where: { reportId: Number(formData.get("reportId")) } });
    revalidatePath("/reports");
    revalidatePath("/dashboard");
  }

  const reports = await prisma.patientReport.findMany({
    where: patientId ? { patientId } : undefined,
    include: { patient: true },
    orderBy: [{ reportDate: "desc" }, { reportId: "desc" }],
  });

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Diagnostics"
        title="Patient Test Reports"
        description="Store lab reports, track review status, and attach result summaries to patient history."
      />

      <SectionCard title="Save Report">
        <form action={addReport} className="grid gap-2 md:grid-cols-3">
          <input name="patientId" required placeholder="Patient ID" className="field" />
          <input name="reportType" required placeholder="Report Type" className="field" />
          <input name="reportName" required placeholder="Report Name" className="field" />
          <input name="reportDate" required type="date" className="field" />
          <select name="status" className="field">
            <option>Pending</option>
            <option>Received</option>
            <option>Reviewed</option>
            <option>Critical</option>
          </select>
          <input name="attachmentPath" placeholder="Attachment Path" className="field" />
          <textarea
            name="resultSummary"
            placeholder="Summary"
            className="field md:col-span-3"
          />
          <button className="btn btn-primary md:col-span-3">Save</button>
        </form>
      </SectionCard>

      <SectionCard title="View Reports">
        <form method="get" className="mb-3 flex flex-wrap gap-2">
          <input
            name="patientId"
            defaultValue={patientId || ""}
            placeholder="Filter by patient ID"
            className="field max-w-sm"
          />
          <button className="btn btn-secondary">Filter</button>
        </form>
        {reports.length === 0 ? <EmptyState message="No reports found for this view." /> : null}
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.reportId} className="record-card text-sm">
              <p className="mb-3 font-bold text-[#19332c]">
                <span className="text-[#0f8f72]">#{r.reportId}</span> {r.patient.name} - {r.reportType} / {r.reportName} (
                {r.reportDate.toISOString().slice(0, 10)})
              </p>
              <form action={updateReport} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="reportId" value={r.reportId} />
                <select name="status" defaultValue={r.status} className="field text-sm">
                  <option>Pending</option>
                  <option>Received</option>
                  <option>Reviewed</option>
                  <option>Critical</option>
                </select>
                <input
                  name="attachmentPath"
                  defaultValue={r.attachmentPath ?? ""}
                  className="field text-sm"
                />
                <button className="btn btn-warning btn-compact">Update</button>
                <textarea
                  name="resultSummary"
                  defaultValue={r.resultSummary ?? ""}
                  className="field text-sm md:col-span-3"
                />
              </form>
              <form action={deleteReport} className="mt-2">
                <input type="hidden" name="reportId" value={r.reportId} />
                <button className="btn btn-danger btn-compact">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
