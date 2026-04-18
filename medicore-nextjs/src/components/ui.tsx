import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-lg bg-[#0f8f72] text-lg font-black text-white shadow-lg shadow-emerald-700/20">
        M
      </div>
      {!compact ? (
        <div>
          <p className="text-lg font-black tracking-normal text-[#19332c]">MediCore</p>
          <p className="text-xs font-semibold uppercase tracking-normal text-[#61736c]">Care operations</p>
        </div>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#d8e8df] bg-white p-5 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-normal text-[#0f8f72]">{eyebrow}</p> : null}
        <h1 className="text-3xl font-black tracking-normal text-[#19332c]">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-[#61736c]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface rounded-lg p-5">
      <div className="mb-4">
        <h2 className="text-lg font-black text-[#19332c]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-[#61736c]">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: string | number;
  tone?: "green" | "coral" | "gold" | "ink" | "mint";
}) {
  const tones = {
    green: "bg-[#e2f7ed] text-[#0f765f]",
    coral: "bg-[#ffe8e4] text-[#b5413b]",
    gold: "bg-[#fff3cf] text-[#8f6508]",
    ink: "bg-[#e7eef0] text-[#28423b]",
    mint: "bg-[#d8f4ef] text-[#126a61]",
  };

  return (
    <div className="rounded-lg border border-[#d8e8df] bg-white p-4 shadow-sm">
      <div className={`mb-4 size-10 rounded-lg ${tones[tone]}`} />
      <p className="text-sm font-semibold text-[#61736c]">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-normal text-[#19332c]">{value}</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#bfd9ce] bg-[#f7fffb] p-6 text-center text-sm font-medium text-[#61736c]">
      {message}
    </div>
  );
}

export function QuickLink({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <Link href={href} className="record-card block transition hover:-translate-y-0.5 hover:border-[#9fd4c2] hover:shadow-md">
      <p className="font-black text-[#19332c]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#61736c]">{text}</p>
    </Link>
  );
}
