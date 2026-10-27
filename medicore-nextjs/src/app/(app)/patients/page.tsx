import { revalidatePath } from "next/cache";
import { requireSession, hashPassword, generatePassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GENDERS, LIST_LIMIT } from "@/lib/constants";
import { int, oneOf, optionalInt, runFormAction, text } from "@/lib/form";
import { CredentialForm, type CredentialState } from "@/components/credential-form";
import { EmptyState, FlashMessage, ListLimitNote, PageHeader, SectionCard, StatusPill, StatCard } from "@/components/ui";

function usernameBase(name: string, patientId: number) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40) || "patient";
  return `${clean}${patientId}`;
}

function patientFields(formData: FormData) {
  return {
    name: text(formData, "name", "Name", { required: true, max: 100 }),
    age: optionalInt(formData, "age", "Age", { min: 0, max: 130 }),
    gender: oneOf(formData, "gender", "Gender", GENDERS),
    phone: text(formData, "phone", "Phone", { required: true, max: 15 }),
  };
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; error?: string }>;
}) {
  await requireSession("ADMIN");
  const { q = "", ok, error } = await searchParams;
  const query = q.trim();

  async function addPatient(formData: FormData) {
    "use server";
    await runFormAction(
      "/patients",
      async () => {
        await requireSession("ADMIN");
        const patient = await prisma.patient.create({ data: patientFields(formData) });
        return `Patient #${patient.patientId} added.`;
      },
      ["/dashboard"],
    );
  }

  async function updatePatient(formData: FormData) {
    "use server";
    await runFormAction("/patients", async () => {
      await requireSession("ADMIN");
      const patientId = int(formData, "patientId", "Patient ID");
      await prisma.patient.update({ where: { patientId }, data: patientFields(formData) });
      return `Patient #${patientId} updated.`;
    });
  }

  async function deletePatient(formData: FormData) {
    "use server";
    await runFormAction(
      "/patients",
      async () => {
        await requireSession("ADMIN");
        const patientId = int(formData, "patientId", "Patient ID");
        await prisma.$transaction([
          prisma.user.deleteMany({ where: { patientId } }),
          prisma.patient.delete({ where: { patientId } }),
        ]);
        return `Patient #${patientId} and their portal login were deleted.`;
      },
      ["/dashboard"],
    );
  }

  async function issuePatientLogin(_state: CredentialState, formData: FormData): Promise<CredentialState> {
    "use server";
    await requireSession("ADMIN");
    const patientId = Number(formData.get("patientId"));
    const patient = Number.isInteger(patientId) ? await prisma.patient.findUnique({ where: { patientId } }) : null;
    if (!patient) return { error: "Patient not found." };

    const password = generatePassword();
    const hashed = await hashPassword(password);
    const existing = await prisma.user.findFirst({ where: { patientId } });
    if (existing) {
      await prisma.user.update({ where: { id: existing.id }, data: { password: hashed } });
      return { username: existing.username, password };
    }

    const base = usernameBase(patient.name, patientId);
    let username = base;
    for (let i = 1; await prisma.user.findUnique({ where: { username } }); i++) username = `${base}${i}`;

    await prisma.user.create({ data: { username, password: hashed, role: "USER", patientId } });
    revalidatePath("/patients");
    return { username, password };
  }

  const searchId = /^\d+$/.test(query) ? Number(query) : undefined;
  const where = query
    ? { OR: [{ name: { contains: query } }, { phone: { contains: query } }, ...(searchId ? [{ patientId: searchId }] : [])] }
    : undefined;

  const [patients, totalPatients, linkedPatients] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: { patientId: "desc" },
      take: LIST_LIMIT,
      include: { users: { select: { username: true } } },
    }),
    prisma.patient.count(),
    prisma.user.count({ where: { patientId: { not: null } } }),
  ]);
  const unlinkedPatients = totalPatients - linkedPatients;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Front desk"
        title="Patient Management"
        description="Register patients, keep contact details current, and create secure patient logins."
      />
      <FlashMessage ok={ok} error={error} />
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Patients" value={totalPatients} tone="green" icon="patients" />
        <StatCard label="Portal Enabled" value={linkedPatients} tone="blue" icon="patients" />
        <StatCard label="Needs Login" value={unlinkedPatients} tone={unlinkedPatients > 0 ? "gold" : "green"} icon="patients" />
      </div>

      <SectionCard title="Add Patient">
        <form action={addPatient} className="grid gap-3 md:grid-cols-5">
          <input name="name" required maxLength={100} placeholder="Name" className="field" />
          <input name="age" type="number" min="0" max="130" placeholder="Age" className="field" />
          <select name="gender" className="field">
            {GENDERS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <input name="phone" required maxLength={15} placeholder="Phone" className="field" />
          <button className="btn btn-primary">Add</button>
        </form>
      </SectionCard>

      <SectionCard
        title="Patients"
        subtitle="Create Login / Reset Password generates a random one-time password. Share it with the patient straight away."
      >
        <form method="get" className="mb-4 flex flex-wrap gap-2">
          <input name="q" defaultValue={query} placeholder="Search by name, phone or ID" className="field max-w-sm" />
          <button className="btn btn-secondary">Search</button>
        </form>
        {patients.length === 0 ? <EmptyState message={query ? "No patients match this search." : "No patients registered yet."} /> : null}
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
                  label={p.users[0] ? `Portal: ${p.users[0].username}` : "Portal not created"}
                  tone={p.users[0] ? "green" : "gold"}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto_auto]">
                <form action={updatePatient} className="grid gap-2 md:col-span-2 md:grid-cols-4">
                  <input type="hidden" name="patientId" value={p.patientId} />
                  <input name="name" required maxLength={100} defaultValue={p.name} className="field text-sm" aria-label="Name" />
                  <input name="age" type="number" min="0" max="130" defaultValue={p.age ?? ""} className="field text-sm" aria-label="Age" />
                  <select name="gender" defaultValue={p.gender ?? "Other"} className="field text-sm" aria-label="Gender">
                    {GENDERS.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                  <input name="phone" required maxLength={15} defaultValue={p.phone ?? ""} className="field text-sm" aria-label="Phone" />
                  <button className="btn btn-warning btn-compact md:col-span-4">Update</button>
                </form>
                <CredentialForm action={issuePatientLogin} patientId={p.patientId} hasLogin={p.users.length > 0} />
                <form action={deletePatient}>
                  <input type="hidden" name="patientId" value={p.patientId} />
                  <button className="btn btn-danger btn-compact w-full">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
        <ListLimitNote shown={patients.length} limit={LIST_LIMIT} />
      </SectionCard>
    </div>
  );
}
