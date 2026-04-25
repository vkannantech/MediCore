import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard, StatusPill, StatCard } from "@/components/ui";

export default async function DoctorsPage() {
  await requireSession("ADMIN");

  async function addDoctor(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.doctor.create({
      data: {
        name: String(formData.get("name") ?? ""),
        specialization: String(formData.get("specialization") ?? ""),
        availability: String(formData.get("availability") ?? ""),
      },
    });
    revalidatePath("/doctors");
    revalidatePath("/dashboard");
  }

  async function updateDoctor(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.doctor.update({
      where: { doctorId: Number(formData.get("doctorId")) },
      data: {
        name: String(formData.get("name") ?? ""),
        specialization: String(formData.get("specialization") ?? ""),
        availability: String(formData.get("availability") ?? ""),
      },
    });
    revalidatePath("/doctors");
  }

  async function deleteDoctor(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.doctor.delete({ where: { doctorId: Number(formData.get("doctorId")) } });
    revalidatePath("/doctors");
    revalidatePath("/dashboard");
  }

  const doctors = await prisma.doctor.findMany({ orderBy: { doctorId: "desc" } });
  const morningDoctors = doctors.filter((doctor) => doctor.availability === "Morning").length;
  const eveningDoctors = doctors.filter((doctor) => doctor.availability === "Evening").length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinical team"
        title="Doctor Management"
        description="Maintain doctor availability and specializations for accurate appointment booking."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Doctors" value={doctors.length} tone="blue" icon="doctors" />
        <StatCard label="Morning Coverage" value={morningDoctors} tone="green" icon="calendar" />
        <StatCard label="Evening Coverage" value={eveningDoctors} tone="violet" icon="calendar" />
      </div>
      <SectionCard title="Add Doctor">
        <form action={addDoctor} className="grid gap-3 md:grid-cols-4">
          <input name="name" required placeholder="Doctor name" className="field" />
          <input name="specialization" required placeholder="Specialization" className="field" />
          <select name="availability" className="field">
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Night</option>
          </select>
          <button className="btn btn-primary">Add</button>
        </form>
      </SectionCard>

      <SectionCard title="Doctors">
        {doctors.length === 0 ? <EmptyState message="No doctors registered yet." /> : null}
        <div className="space-y-3">
          {doctors.map((d) => (
            <div key={d.doctorId} className="record-card">
              <form action={updateDoctor} className="grid gap-2 md:grid-cols-[70px_1fr_1fr_1fr_auto_auto]">
                <input type="hidden" name="doctorId" value={d.doctorId} />
                <span className="self-center text-sm font-black text-[#0f8f72]">#{d.doctorId}</span>
                <input name="name" defaultValue={d.name} className="field text-sm" />
                <input
                  name="specialization"
                  defaultValue={d.specialization ?? ""}
                  className="field text-sm"
                />
                <input
                  name="availability"
                  defaultValue={d.availability ?? ""}
                  className="field text-sm"
                />
                <button className="btn btn-warning btn-compact">Update</button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill label={d.specialization ?? "General"} tone="blue" />
                <StatusPill label={d.availability ?? "Not scheduled"} tone="green" />
              </div>
              <form action={deleteDoctor} className="mt-2">
                <input type="hidden" name="doctorId" value={d.doctorId} />
                <button className="btn btn-danger btn-compact">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
