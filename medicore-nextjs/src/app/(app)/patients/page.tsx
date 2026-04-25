import { revalidatePath } from "next/cache";
import { requireSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard, StatusPill, StatCard } from "@/components/ui";

function usernameBase(name: string, patientId: number) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "patient";
  return `${clean}${patientId}`;
}

function defaultPatientPassword(username: string) {
  return `Medi@${username}`;
}

export default async function PatientsPage() {
  await requireSession("ADMIN");

  async function addPatient(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.patient.create({
      data: {
        name: String(formData.get("name") ?? ""),
        age: Number(formData.get("age")),
        gender: String(formData.get("gender") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      },
    });
    revalidatePath("/patients");
    revalidatePath("/dashboard");
  }

  async function updatePatient(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    const patientId = Number(formData.get("patientId"));
    await prisma.patient.update({
      where: { patientId },
      data: {
        name: String(formData.get("name") ?? ""),
        age: Number(formData.get("age")),
        gender: String(formData.get("gender") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      },
    });
    revalidatePath("/patients");
  }

  async function deletePatient(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    const patientId = Number(formData.get("patientId"));
    await prisma.patient.delete({ where: { patientId } });
    revalidatePath("/patients");
    revalidatePath("/dashboard");
  }

  async function ensurePatientLogin(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    const patientId = Number(formData.get("patientId"));
    const patient = await prisma.patient.findUnique({ where: { patientId } });
    if (!patient) return;

    const existing = await prisma.user.findFirst({ where: { patientId } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { password: await hashPassword(defaultPatientPassword(existing.username)) },
      });
      revalidatePath("/patients");
      return;
    }

    const base = usernameBase(patient.name, patientId);
    let username = base;
    let i = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${base}${i++}`;
    }

    await prisma.user.create({
      data: {
        username,
        password: await hashPassword(defaultPatientPassword(username)),
        role: "USER",
        patientId,
      },
    });
    revalidatePath("/patients");
  }

  const patients = await prisma.patient.findMany({
    orderBy: { patientId: "desc" },
    include: { users: true },
  });
  const linkedPatients = patients.filter((patient) => patient.users.length > 0).length;
  const unlinkedPatients = patients.length - linkedPatients;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Front desk"
        title="Patient Management"
        description="Register patients, keep contact details current, and create secure patient logins."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Patients" value={patients.length} tone="green" icon="patients" />
        <StatCard label="Portal Enabled" value={linkedPatients} tone="blue" icon="patients" />
        <StatCard label="Needs Login" value={unlinkedPatients} tone={unlinkedPatients > 0 ? "gold" : "green"} icon="patients" />
      </div>

      <SectionCard title="Add Patient">
        <form action={addPatient} className="grid gap-3 md:grid-cols-5">
          <input name="name" required placeholder="Name" className="field" />
          <input name="age" required type="number" min="0" max="130" placeholder="Age" className="field" />
          <select name="gender" className="field">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="phone" required placeholder="Phone" className="field" />
          <button className="btn btn-primary">Add</button>
        </form>
      </SectionCard>

      <SectionCard
        title="Patients"
        subtitle="New patient portal credentials use username format name+patientId. Example: username rajum19, password Medi@rajum19."
      >
        {patients.length === 0 ? <EmptyState message="No patients registered yet." /> : null}
        <div className="space-y-3">
          {patients.map((p) => (
            <div key={p.patientId} className="record-card">
              <div className="mb-3 grid gap-2 text-sm md:grid-cols-5">
                <p className="font-black text-[#0f8f72]">#{p.patientId}</p>
                <p className="font-bold text-[#19332c]">{p.name}</p>
                <p className="text-[#61736c]">{p.age ?? "-"} years</p>
                <p className="text-[#61736c]">{p.gender ?? "-"}</p>
                <p className="text-[#61736c]">{p.phone ?? "-"}</p>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                <StatusPill
                  label={p.users[0]?.username ? `Portal: ${p.users[0].username}` : "Portal not created"}
                  tone={p.users[0]?.username ? "green" : "gold"}
                />
                {p.users[0]?.username ? (
                  <StatusPill label={`Default password: ${defaultPatientPassword(p.users[0].username)}`} tone="blue" />
                ) : null}
              </div>
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto_auto]">
                <form action={updatePatient} className="grid gap-2 md:col-span-2 md:grid-cols-4">
                  <input type="hidden" name="patientId" value={p.patientId} />
                  <input name="name" defaultValue={p.name} className="field text-sm" />
                  <input name="age" defaultValue={p.age ?? ""} className="field text-sm" />
                  <input name="gender" defaultValue={p.gender ?? ""} className="field text-sm" />
                  <input name="phone" defaultValue={p.phone ?? ""} className="field text-sm" />
                  <button className="btn btn-warning btn-compact md:col-span-4">
                    Update
                  </button>
                </form>
                <form action={ensurePatientLogin}>
                  <input type="hidden" name="patientId" value={p.patientId} />
                  <button className="btn btn-secondary btn-compact w-full">
                    {p.users[0]?.username ? "Reset Password" : "Create Login"}
                  </button>
                </form>
                <form action={deletePatient}>
                  <input type="hidden" name="patientId" value={p.patientId} />
                  <button className="btn btn-danger btn-compact w-full">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
