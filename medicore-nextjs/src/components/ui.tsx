import Link from "next/link";

type StatIconName = "patients" | "doctors" | "calendar" | "records" | "revenue" | "bills" | "reports";

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
  icon,
}: {
  label: string;
  value: string | number;
  tone?: "green" | "coral" | "gold" | "ink" | "mint";
  icon?: StatIconName;
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

export function QuickLink({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <Link href={href} className="record-card block transition hover:-translate-y-0.5 hover:border-[#9fd4c2] hover:shadow-md">
      <p className="font-black text-[#19332c]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#61736c]">{text}</p>
    </Link>
  );
}
