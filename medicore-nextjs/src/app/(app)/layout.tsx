import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { LogoutButton } from "@/components/auth-buttons";
import { BrandMark } from "@/components/ui";

const adminNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
  { href: "/records", label: "Medical Records" },
  { href: "/billing", label: "Billing" },
  { href: "/reports", label: "Reports" },
];

const userNav = [
  { href: "/user-dashboard", label: "Dashboard" },
  { href: "/profile", label: "My Profile" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const nav = session.role === "ADMIN" ? adminNav : userNav;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dff8ee,_transparent_34%),linear-gradient(180deg,_#f4fbf7_0%,_#edf7f1_48%,_#f8fbf9_100%)]">
      <header className="sticky top-0 z-20 border-b border-[#d8e8df] bg-white/88 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <BrandMark />
            <div className="rounded-lg border border-[#d8e8df] bg-[#f7fffb] px-3 py-2 text-right md:hidden">
              <p className="text-xs font-bold text-[#61736c]">{session.role}</p>
              <p className="text-sm font-black text-[#19332c]">{session.username}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 md:justify-end">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-[#d8e8df] bg-white px-3 py-2 text-sm font-bold text-[#31534a] transition hover:-translate-y-0.5 hover:border-[#9fd4c2] hover:bg-[#f7fffb]"
              >
                {item.label}
              </Link>
            ))}
            <div className="hidden rounded-lg border border-[#d8e8df] bg-[#f7fffb] px-3 py-2 md:block">
              <p className="text-[11px] font-bold uppercase tracking-normal text-[#61736c]">{session.role}</p>
              <p className="text-sm font-black text-[#19332c]">{session.username}</p>
            </div>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
