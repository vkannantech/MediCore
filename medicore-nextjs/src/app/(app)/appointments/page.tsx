import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard, StatusPill, StatCard } from "@/components/ui";

const DISEASE_MAP: Record<string, string> = {
  fever: "General",
  cold: "General",
  heart: "Cardiologist",
  cardiac: "Cardiologist",
  bone: "Orthopedic",
  fracture: "Orthopedic",
  eye: "Ophthalmologist",
  vision: "Ophthalmologist",
  skin: "Dermatologist",
  rash: "Dermatologist",
  child: "Pediatrician",
  baby: "Pediatrician",
};

function suggestSpecialization(symptom: string) {
  const s = symptom.toLowerCase();
  for (const [k, v] of Object.entries(DISEASE_MAP)) {
    if (s.includes(k)) return v;
  }
  return "General";
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ symptom?: string }>;
}) {
  await requireSession("ADMIN");
  const symptom = (await searchParams).symptom ?? "";
  const specialization = symptom ? suggestSpecialization(symptom) : null;

  async function addAppointment(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.appointment.create({
      data: {
        patientId: Number(formData.get("patientId")),
        doctorId: Number(formData.get("doctorId")),
        date: new Date(String(formData.get("date"))),
        status: String(formData.get("status") || "Normal"),
      },
    });
    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  }

  async function updateStatus(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.appointment.update({
      where: { appointmentId: Number(formData.get("appointmentId")) },
      data: { status: String(formData.get("status")) },
    });
    revalidatePath("/appointments");
  }

  async function deleteAppointment(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.appointment.delete({ where: { appointmentId: Number(formData.get("appointmentId")) } });
    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  }

  const [doctors, appointments, emergencyCount, completedCount] = await Promise.all([
    prisma.doctor.findMany({
      where: specialization ? { specialization: { contains: specialization } } : undefined,
      orderBy: { doctorId: "asc" },
    }),
    prisma.appointment.findMany({
      include: { patient: true, doctor: true },
      orderBy: { appointmentId: "desc" },
    }),
    prisma.appointment.count({ where: { status: "Emergency" } }),
    prisma.appointment.count({ where: { status: "Completed" } }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Schedule desk"
        title="Appointment Management"
        description="Book visits, use symptom-based specialization hints, and update appointment progress."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Visible Doctors" value={doctors.length} tone="blue" icon="doctors" />
        <StatCard label="Emergency Queue" value={emergencyCount} tone="coral" icon="calendar" />
        <StatCard label="Completed Visits" value={completedCount} tone="green" icon="records" />
      </div>

      <SectionCard title="Book Appointment" subtitle="Use symptom to auto-suggest specialization">
        <form method="get" className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            name="symptom"
            placeholder="Disease or symptom"
            defaultValue={symptom}
            className="field"
          />
          <button className="btn btn-secondary">Smart Suggest</button>
        </form>
        {specialization ? (
          <p className="mb-3 inline-flex rounded-lg bg-[#d8f4ef] px-3 py-1 text-sm font-black text-[#126a61]">
            Suggested: {specialization}
          </p>
        ) : null}
        <form action={addAppointment} className="grid gap-2 md:grid-cols-5">
          <input name="patientId" required inputMode="numeric" placeholder="Patient ID" className="field" />
          <select name="doctorId" required className="field">
            {doctors.map((d) => (
              <option key={d.doctorId} value={d.doctorId}>
                {d.doctorId} - {d.name} ({d.specialization})
              </option>
            ))}
          </select>
          <input name="date" type="date" required className="field" />
          <select name="status" className="field">
            <option>Normal</option>
            <option>Emergency</option>
            <option>Confirmed</option>
          </select>
          <button className="btn btn-primary">Book</button>
        </form>
      </SectionCard>

      <SectionCard title="All Appointments">
        {appointments.length === 0 ? <EmptyState message="No appointments booked yet." /> : null}
        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a.appointmentId} className="record-card text-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-black text-[#19332c]">
                    <span className="text-[#0f8f72]">#{a.appointmentId}</span> {a.patient.name}
                  </p>
                  <p className="mt-1 text-[#61736c]">
                    {a.doctor.name} / {a.doctor.specialization ?? "General"} / {a.date.toISOString().slice(0, 10)}
                  </p>
                </div>
                <StatusPill
                  label={a.status ?? "Normal"}
                  tone={a.status === "Emergency" ? "coral" : a.status === "Completed" ? "green" : "blue"}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={updateStatus} className="flex flex-wrap gap-2">
                  <input type="hidden" name="appointmentId" value={a.appointmentId} />
                  <select
                    name="status"
                    defaultValue={a.status ?? "Normal"}
                    className="field min-w-40 py-2 text-sm"
                  >
                    <option>Normal</option>
                    <option>Emergency</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <button className="btn btn-warning btn-compact">Update</button>
                </form>
                <form action={deleteAppointment}>
                  <input type="hidden" name="appointmentId" value={a.appointmentId} />
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
