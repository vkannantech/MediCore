import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APPOINTMENT_STATUSES, LIST_LIMIT } from "@/lib/constants";
import { formatDate } from "@/lib/dates";
import { dateOnly, int, oneOf, runFormAction } from "@/lib/form";
import { EmptyState, FlashMessage, ListLimitNote, PageHeader, PatientIdInput, SectionCard, StatusPill, StatCard } from "@/components/ui";

const DISEASE_MAP: Record<string, string> = {
  fever: "General",
  cold: "General",
  heart: "Cardiologist",
  cardiac: "Cardiologist",
  chest: "Cardiologist",
  bone: "Orthopedic",
  fracture: "Orthopedic",
  joint: "Orthopedic",
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

const BOOKING_STATUSES = ["Normal", "Emergency", "Confirmed"] as const;

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ symptom?: string; ok?: string; error?: string }>;
}) {
  await requireSession("ADMIN");
  const { symptom = "", ok, error } = await searchParams;
  const specialization = symptom ? suggestSpecialization(symptom) : null;

  async function addAppointment(formData: FormData) {
    "use server";
    await runFormAction(
      "/appointments",
      async () => {
        await requireSession("ADMIN");
        const appointment = await prisma.appointment.create({
          data: {
            patientId: int(formData, "patientId", "Patient ID", { min: 1 }),
            doctorId: int(formData, "doctorId", "Doctor", { min: 1 }),
            date: dateOnly(formData, "date", "Date"),
            status: oneOf(formData, "status", "Status", BOOKING_STATUSES),
          },
        });
        return `Appointment #${appointment.appointmentId} booked.`;
      },
      ["/dashboard"],
    );
  }

  async function updateStatus(formData: FormData) {
    "use server";
    await runFormAction(
      "/appointments",
      async () => {
        await requireSession("ADMIN");
        const appointmentId = int(formData, "appointmentId", "Appointment ID");
        await prisma.appointment.update({
          where: { appointmentId },
          data: { status: oneOf(formData, "status", "Status", APPOINTMENT_STATUSES) },
        });
        return `Appointment #${appointmentId} updated.`;
      },
      ["/dashboard"],
    );
  }

  async function deleteAppointment(formData: FormData) {
    "use server";
    await runFormAction(
      "/appointments",
      async () => {
        await requireSession("ADMIN");
        const appointmentId = int(formData, "appointmentId", "Appointment ID");
        await prisma.appointment.delete({ where: { appointmentId } });
        return `Appointment #${appointmentId} deleted.`;
      },
      ["/dashboard"],
    );
  }

  const [doctors, appointments, patientOptions, emergencyCount, completedCount] = await Promise.all([
    prisma.doctor.findMany({
      where: specialization ? { specialization: { contains: specialization } } : undefined,
      orderBy: { doctorId: "asc" },
    }),
    prisma.appointment.findMany({
      include: { patient: { select: { name: true } }, doctor: { select: { name: true, specialization: true } } },
      orderBy: [{ date: "desc" }, { appointmentId: "desc" }],
      take: LIST_LIMIT,
    }),
    prisma.patient.findMany({ select: { patientId: true, name: true }, orderBy: { patientId: "desc" }, take: 500 }),
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
      <FlashMessage ok={ok} error={error} />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Visible Doctors" value={doctors.length} tone="blue" icon="doctors" />
        <StatCard label="Emergency Queue" value={emergencyCount} tone="coral" icon="calendar" />
        <StatCard label="Completed Visits" value={completedCount} tone="green" icon="records" />
      </div>

      <SectionCard title="Book Appointment" subtitle="Use symptom to auto-suggest specialization">
        <form method="get" className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
          <input name="symptom" placeholder="Disease or symptom" defaultValue={symptom} className="field" />
          <button className="btn btn-secondary">Smart Suggest</button>
        </form>
        {specialization ? (
          <p className="mb-3 inline-flex rounded-lg bg-[#d8f4ef] px-3 py-1 text-sm font-black text-[#126a61]">
            Suggested: {specialization}
          </p>
        ) : null}
        {doctors.length === 0 ? (
          <EmptyState message={specialization ? `No ${specialization} doctors yet. Clear the symptom or add one on the Doctors page.` : "Add a doctor first."} />
        ) : (
          <form action={addAppointment} className="grid gap-2 md:grid-cols-5">
            <PatientIdInput patients={patientOptions} />
            <select name="doctorId" required className="field" aria-label="Doctor">
              {doctors.map((d) => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.doctorId} - {d.name} ({d.specialization})
                </option>
              ))}
            </select>
            <input name="date" type="date" required className="field" aria-label="Date" />
            <select name="status" className="field" aria-label="Status">
              {BOOKING_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="btn btn-primary">Book</button>
          </form>
        )}
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
                    {a.doctor.name} / {a.doctor.specialization ?? "General"} / {formatDate(a.date)}
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
                  <select name="status" defaultValue={a.status ?? "Normal"} className="field min-w-40 py-2 text-sm" aria-label="Status">
                    {APPOINTMENT_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
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
        <ListLimitNote shown={appointments.length} limit={LIST_LIMIT} />
      </SectionCard>
    </div>
  );
}
