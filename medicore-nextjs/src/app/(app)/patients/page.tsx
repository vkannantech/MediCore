import { revalidatePath } from "next/cache";
import { requireSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, SectionCard } from "@/components/ui";

function randomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function usernameBase(name: string, patientId: number) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "patient";
  return `${clean}${patientId}`;
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

  async function createPatientLogin(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    const patientId = Number(formData.get("patientId"));
    const patient = await prisma.patient.findUnique({ where: { patientId } });
    if (!patient) return;

    const existing = await prisma.user.findFirst({ where: { patientId } });
    if (existing) return;

    const base = usernameBase(patient.name, patientId);
    let username = base;
    let i = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${base}${i++}`;
    }

    const pass = randomPassword();
    await prisma.user.create({
      data: {
        username,
        password: await hashPassword(pass),
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

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Front desk"
        title="Patient Management"
        description="Register patients, keep contact details current, and create secure patient logins."
      />

      <SectionCard title="Add Patient">
        <form action={addPatient} className="grid gap-3 md:grid-cols-5">
          <input name="name" required placeholder="Name" className="field" />
          <input name="age" required type="number" placeholder="Age" className="field" />
          <select name="gender" className="field">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="phone" required placeholder="Phone" className="field" />
          <button className="btn btn-primary">Add</button>
        </form>
      </SectionCard>

      <SectionCard title="Patients">
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
              <div className="mb-3 inline-flex rounded-lg bg-[#edf8f2] px-3 py-1 text-xs font-bold text-[#31534a]">
                User Link: {p.users[0]?.username ? `Yes (${p.users[0].username})` : "No"}
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
                <form action={createPatientLogin}>
                  <input type="hidden" name="patientId" value={p.patientId} />
                  <button className="btn btn-secondary btn-compact w-full">Create Login</button>
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
