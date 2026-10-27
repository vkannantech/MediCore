import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LIST_LIMIT, PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/dates";
import { dateOnly, int, money, oneOf, optionalText, runFormAction } from "@/lib/form";
import { EmptyState, FlashMessage, InsightCard, ListLimitNote, PageHeader, PatientIdInput, SectionCard, StatusPill, StatCard } from "@/components/ui";

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireSession("ADMIN");
  const { ok, error } = await searchParams;

  async function addBill(formData: FormData) {
    "use server";
    await runFormAction(
      "/billing",
      async () => {
        await requireSession("ADMIN");
        const bill = await prisma.billing.create({
          data: {
            patientId: int(formData, "patientId", "Patient ID", { min: 1 }),
            amount: money(formData, "amount", "Amount"),
            date: dateOnly(formData, "date", "Date"),
            paymentStatus: oneOf(formData, "paymentStatus", "Payment status", PAYMENT_STATUSES),
            paymentMethod: oneOf(formData, "paymentMethod", "Payment method", PAYMENT_METHODS),
            notes: optionalText(formData, "notes", "Notes", 2_000),
          },
        });
        return `Bill #${bill.billId} saved.`;
      },
      ["/dashboard"],
    );
  }

  async function updateBill(formData: FormData) {
    "use server";
    await runFormAction(
      "/billing",
      async () => {
        await requireSession("ADMIN");
        const billId = int(formData, "billId", "Bill ID");
        await prisma.billing.update({
          where: { billId },
          data: {
            paymentStatus: oneOf(formData, "paymentStatus", "Payment status", PAYMENT_STATUSES),
            paymentMethod: oneOf(formData, "paymentMethod", "Payment method", PAYMENT_METHODS),
            notes: optionalText(formData, "notes", "Notes", 2_000),
          },
        });
        return `Bill #${billId} updated.`;
      },
      ["/dashboard"],
    );
  }

  const [bills, summary, paidBills, openBills, patientOptions] = await Promise.all([
    prisma.billing.findMany({
      include: { patient: { select: { name: true } } },
      orderBy: { billId: "desc" },
      take: LIST_LIMIT,
    }),
    prisma.billing.aggregate({ _sum: { amount: true }, _count: { _all: true } }),
    prisma.billing.count({ where: { paymentStatus: "Paid" } }),
    prisma.billing.count({ where: { paymentStatus: { in: ["Unpaid", "Partial"] } } }),
    prisma.patient.findMany({ select: { patientId: true, name: true }, orderBy: { patientId: "desc" }, take: 500 }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Finance"
        title="Billing"
        description="Generate bills, update payment state, and keep revenue records easy to scan."
      />
      <FlashMessage ok={ok} error={error} />
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Bills" value={summary._count._all} tone="ink" icon="bills" />
        <StatCard label="Total Revenue" value={formatMoney(summary._sum.amount)} tone="gold" icon="revenue" />
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
          <PatientIdInput patients={patientOptions} />
          <input name="amount" required type="number" min="0" step="0.01" placeholder="Amount" className="field" />
          <input name="date" required type="date" className="field" aria-label="Date" />
          <select name="paymentStatus" className="field" aria-label="Payment status">
            {PAYMENT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select name="paymentMethod" className="field" aria-label="Payment method">
            {PAYMENT_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input name="notes" maxLength={2000} placeholder="Notes" className="field" />
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
                  <span className="text-[#0f8f72]">#{b.billId}</span> {b.patient.name} / {formatMoney(b.amount)} / {formatDate(b.date)}
                </p>
                <StatusPill
                  label={b.paymentStatus}
                  tone={b.paymentStatus === "Paid" ? "green" : b.paymentStatus === "Partial" ? "gold" : "coral"}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <select name="paymentStatus" defaultValue={b.paymentStatus} className="field text-sm" aria-label="Payment status">
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <select name="paymentMethod" defaultValue={b.paymentMethod} className="field text-sm" aria-label="Payment method">
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <input name="notes" maxLength={2000} defaultValue={b.notes ?? ""} className="field text-sm" aria-label="Notes" />
              </div>
              <button className="btn btn-warning btn-compact mt-3">Update</button>
            </form>
          ))}
        </div>
        <ListLimitNote shown={bills.length} limit={LIST_LIMIT} />
      </SectionCard>
    </div>
  );
}
