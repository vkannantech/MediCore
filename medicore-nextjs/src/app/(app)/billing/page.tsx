import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, InsightCard, PageHeader, SectionCard, StatusPill, StatCard } from "@/components/ui";

export default async function BillingPage() {
  await requireSession("ADMIN");

  async function addBill(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.billing.create({
      data: {
        patientId: Number(formData.get("patientId")),
        amount: Number(formData.get("amount")),
        date: new Date(String(formData.get("date"))),
        paymentStatus: String(formData.get("paymentStatus") ?? "Unpaid"),
        paymentMethod: String(formData.get("paymentMethod") ?? "Cash"),
        notes: String(formData.get("notes") ?? ""),
      },
    });
    revalidatePath("/billing");
    revalidatePath("/dashboard");
  }

  async function updateBill(formData: FormData) {
    "use server";
    await requireSession("ADMIN");
    await prisma.billing.update({
      where: { billId: Number(formData.get("billId")) },
      data: {
        paymentStatus: String(formData.get("paymentStatus")),
        paymentMethod: String(formData.get("paymentMethod")),
        notes: String(formData.get("notes")),
      },
    });
    revalidatePath("/billing");
  }

  const [bills, summary, paidBills, openBills] = await Promise.all([
    prisma.billing.findMany({ include: { patient: true }, orderBy: { billId: "desc" } }),
    prisma.billing.aggregate({ _sum: { amount: true }, _count: { _all: true } }),
    prisma.billing.count({ where: { paymentStatus: "Paid" } }),
    prisma.billing.count({ where: { paymentStatus: { in: ["Unpaid", "Partial"] } } }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Finance"
        title="Billing"
        description="Generate bills, update payment state, and keep revenue records easy to scan."
      />
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Bills" value={summary._count._all} tone="ink" />
        <StatCard label="Total Revenue" value={`Rs. ${(summary._sum.amount ?? 0).toFixed(2)}`} tone="gold" />
        <StatCard label="Paid Bills" value={paidBills} tone="green" icon="bills" />
        <StatCard label="Open Bills" value={openBills} tone="coral" icon="bills" />
      </div>
      <InsightCard
        label="Collection health"
        value={openBills === 0 ? "Clear" : `${openBills} open`}
        detail="Open bills include unpaid and partial payments. Keep this number low for cleaner discharge workflows."
        tone={openBills === 0 ? "green" : "gold"}
      />

      <SectionCard title="Generate Bill">
        <form action={addBill} className="grid gap-2 md:grid-cols-3">
          <input name="patientId" required placeholder="Patient ID" className="field" />
          <input name="amount" required type="number" step="0.01" placeholder="Amount" className="field" />
          <input name="date" required type="date" className="field" />
          <select name="paymentStatus" className="field">
            <option>Unpaid</option>
            <option>Paid</option>
            <option>Partial</option>
          </select>
          <select name="paymentMethod" className="field">
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Net Banking</option>
          </select>
          <input name="notes" placeholder="Notes" className="field" />
          <button className="btn btn-primary md:col-span-3">Save Bill</button>
        </form>
      </SectionCard>

      <SectionCard title="All Bills">
        {bills.length === 0 ? <EmptyState message="No bills generated yet." /> : null}
        <div className="space-y-3">
          {bills.map((b) => (
            <form key={b.billId} action={updateBill} className="record-card text-sm">
              <input type="hidden" name="billId" value={b.billId} />
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <p className="font-bold text-[#19332c]">
                  <span className="text-[#0f8f72]">#{b.billId}</span> {b.patient.name} / Rs. {b.amount.toFixed(2)} /{" "}
                  {b.date.toISOString().slice(0, 10)}
                </p>
                <StatusPill
                  label={b.paymentStatus}
                  tone={b.paymentStatus === "Paid" ? "green" : b.paymentStatus === "Partial" ? "gold" : "coral"}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <select
                  name="paymentStatus"
                  defaultValue={b.paymentStatus}
                  className="field text-sm"
                >
                  <option>Unpaid</option>
                  <option>Paid</option>
                  <option>Partial</option>
                </select>
                <select
                  name="paymentMethod"
                  defaultValue={b.paymentMethod}
                  className="field text-sm"
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Net Banking</option>
                </select>
                <input
                  name="notes"
                  defaultValue={b.notes ?? ""}
                  className="field text-sm"
                />
              </div>
              <button className="btn btn-warning btn-compact mt-3">Update</button>
            </form>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
