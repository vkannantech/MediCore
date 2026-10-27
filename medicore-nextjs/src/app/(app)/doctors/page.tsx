import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AVAILABILITY } from "@/lib/constants";
import { int, oneOf, runFormAction, text } from "@/lib/form";
import { EmptyState, FlashMessage, PageHeader, SectionCard, StatusPill, StatCard } from "@/components/ui";

function doctorFields(formData: FormData) {
  return {
    name: text(formData, "name", "Doctor name", { required: true, max: 100 }),
    specialization: text(formData, "specialization", "Specialization", { required: true, max: 100 }),
    availability: oneOf(formData, "availability", "Availability", AVAILABILITY),
  };
}

export default async function DoctorsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireSession("ADMIN");
  const { ok, error } = await searchParams;

  async function addDoctor(formData: FormData) {
    "use server";
    await runFormAction(
      "/doctors",
      async () => {
        await requireSession("ADMIN");
        const doctor = await prisma.doctor.create({ data: doctorFields(formData) });
        return `${doctor.name} added.`;
      },
      ["/dashboard", "/appointments"],
    );
  }

  async function updateDoctor(formData: FormData) {
    "use server";
    await runFormAction(
      "/doctors",
      async () => {
        await requireSession("ADMIN");
        const doctorId = int(formData, "doctorId", "Doctor ID");
        await prisma.doctor.update({ where: { doctorId }, data: doctorFields(formData) });
        return `Doctor #${doctorId} updated.`;
      },
      ["/appointments"],
    );
  }

  async function deleteDoctor(formData: FormData) {
    "use server";
    await runFormAction(
      "/doctors",
      async () => {
        await requireSession("ADMIN");
        const doctorId = int(formData, "doctorId", "Doctor ID");
        await prisma.doctor.delete({ where: { doctorId } });
        return `Doctor #${doctorId} deleted.`;
      },
      ["/dashboard", "/appointments"],
    );
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
      <FlashMessage ok={ok} error={error} />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Doctors" value={doctors.length} tone="blue" icon="doctors" />
        <StatCard label="Morning Coverage" value={morningDoctors} tone="green" icon="calendar" />
        <StatCard label="Evening Coverage" value={eveningDoctors} tone="violet" icon="calendar" />
      </div>
      <SectionCard title="Add Doctor">
        <form action={addDoctor} className="grid gap-3 md:grid-cols-4">
          <input name="name" required maxLength={100} placeholder="Doctor name" className="field" />
          <input name="specialization" required maxLength={100} placeholder="Specialization" className="field" />
          <select name="availability" className="field">
            {AVAILABILITY.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <button className="btn btn-primary">Add</button>
        </form>
      </SectionCard>

      <SectionCard title="Doctors" subtitle="Doctors with booked appointments cannot be deleted until those appointments are removed.">
        {doctors.length === 0 ? <EmptyState message="No doctors registered yet." /> : null}
        <div className="space-y-3">
          {doctors.map((d) => (
            <div key={d.doctorId} className="record-card">
              <form action={updateDoctor} className="grid gap-2 md:grid-cols-[70px_1fr_1fr_1fr_auto]">
                <input type="hidden" name="doctorId" value={d.doctorId} />
                <span className="self-center text-sm font-black text-[#0f8f72]">#{d.doctorId}</span>
                <input name="name" required maxLength={100} defaultValue={d.name} className="field text-sm" aria-label="Name" />
                <input
                  name="specialization"
                  required
                  maxLength={100}
                  defaultValue={d.specialization ?? ""}
                  className="field text-sm"
                  aria-label="Specialization"
                />
                <select name="availability" defaultValue={d.availability ?? "Morning"} className="field text-sm" aria-label="Availability">
                  {AVAILABILITY.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <button className="btn btn-warning btn-compact">Update</button>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusPill label={d.specialization ?? "General"} tone="blue" />
                <StatusPill label={d.availability ?? "Not scheduled"} tone="green" />
                <form action={deleteDoctor} className="ml-auto">
                  <input type="hidden" name="doctorId" value={d.doctorId} />
                  <button className="btn btn-danger btn-compact">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
