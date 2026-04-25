import Link from "next/link";

type StatIconName = "patients" | "doctors" | "calendar" | "records" | "revenue" | "bills" | "reports";
type StatusTone = "green" | "coral" | "gold" | "ink" | "blue" | "violet";

const toneClasses: Record<StatusTone, string> = {
  green: "bg-[#e2f7ed] text-[#0f765f]",
  coral: "bg-[#ffe8e4] text-[#b5413b]",
  gold: "bg-[#fff3cf] text-[#8f6508]",
  ink: "bg-[#e7eef0] text-[#28423b]",
  blue: "bg-[#eaf2ff] text-[#3369a8]",
  violet: "bg-[#f0ebff] text-[#7257a8]",
};

function StatIcon({ name }: { name: StatIconName }) {
  const iconClass = "size-5";

  if (name === "patients") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M21 20v-2a3.2 3.2 0 0 0-2.5-3.1" />
        <path d="M16.5 3.3a4 4 0 0 1 0 7.4" />
      </svg>
    );
  }

  if (name === "doctors") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M8 3v4a4 4 0 0 0 8 0V3" />
        <path d="M6 3h4" />
        <path d="M14 3h4" />
        <path d="M12 11v3a5 5 0 0 0 10 0v-1" />
        <circle cx="22" cy="11" r="1" />
        <path d="M4 14h6" />
        <path d="M7 11v6" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M3 10h18" />
        <path d="M9 15h6" />
        <path d="M12 12v6" />
      </svg>
    );
  }

  if (name === "records") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
        <path d="M9 14h6" />
        <path d="M12 11v6" />
      </svg>
    );
  }

  if (name === "revenue") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 7h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
        <path d="M7 7V5h10v2" />
        <circle cx="12" cy="13" r="2.5" />
        <path d="M6 11h1" />
        <path d="M17 15h1" />
      </svg>
    );
  }

  if (name === "bills") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h3" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 4h14v16H5z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
      <path d="m16 16 1.5 1.5L21 14" />
    </svg>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-lg bg-[#0b8f73] text-white shadow-lg shadow-emerald-700/20">
        <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
          <path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
        </svg>
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
    <div className="overflow-hidden rounded-lg border border-[#d8e8df] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-l-4 border-[#0b8f73] p-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-normal text-[#0f8f72]">{eyebrow}</p> : null}
        <h1 className="text-3xl font-black tracking-normal text-[#182b27] md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-[#61736c]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
      </div>
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
    <section className="surface rounded-lg p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
        <h2 className="text-lg font-black text-[#19332c]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-[#61736c]">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  tone = "green",
  icon,
}: {
  label: string;
  value: string | number;
  tone?: StatusTone | "mint";
  icon?: StatIconName;
}) {
  const tones = { ...toneClasses, mint: "bg-[#d8f4ef] text-[#126a61]" };

  return (
    <div className="rounded-lg border border-[#d8e8df] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-4 grid size-12 place-items-center rounded-lg ${tones[tone]}`}>
        {icon ? <StatIcon name={icon} /> : null}
      </div>
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

export function StatusPill({ label, tone = "ink" }: { label: string; tone?: StatusTone }) {
  return <span className={`status-pill ${toneClasses[tone]}`}>{label}</span>;
}

export function InsightCard({
  label,
  value,
  detail,
  tone = "green",
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: StatusTone;
}) {
  return (
    <div className="rounded-lg border border-[#d8e8df] bg-white p-4">
      <div className={`mb-3 h-1.5 w-16 rounded-full ${toneClasses[tone].split(" ")[0]}`} />
      <p className="text-sm font-bold text-[#61736c]">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#182b27]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#61736c]">{detail}</p>
    </div>
  );
}

export function TimelineItem({
  title,
  meta,
  children,
  tone = "green",
}: {
  title: string;
  meta?: string;
  children?: React.ReactNode;
  tone?: StatusTone;
}) {
  return (
    <div className="grid gap-3 rounded-lg border border-[#d8e8df] bg-white p-4 text-sm shadow-sm md:grid-cols-[auto_1fr]">
      <div className={`mt-1 size-3 rounded-full ${toneClasses[tone].split(" ")[0]}`} />
      <div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <p className="font-black text-[#182b27]">{title}</p>
          {meta ? <p className="text-xs font-bold uppercase tracking-normal text-[#61736c]">{meta}</p> : null}
        </div>
        {children ? <div className="mt-2 leading-6 text-[#61736c]">{children}</div> : null}
      </div>
    </div>
  );
}

export function QuickLink({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <Link href={href} className="record-card group block transition hover:-translate-y-0.5 hover:border-[#9fd4c2] hover:shadow-md">
      <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[#eef7f3] text-[#0b8f73] transition group-hover:bg-[#0b8f73] group-hover:text-white">
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </div>
      <p className="font-black text-[#19332c]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#61736c]">{text}</p>
    </Link>
  );
}
