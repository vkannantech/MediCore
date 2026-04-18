import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { BrandMark } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,_#c9f5e7,_transparent_30%),linear-gradient(135deg,_#f4fbf7_0%,_#ffffff_52%,_#eef8f3_100%)] px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-8">
          <BrandMark />
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-black uppercase tracking-normal text-[#0f8f72]">Hospital workspace</p>
            <h1 className="text-4xl font-black tracking-normal text-[#19332c] md:text-6xl">
              Care teams, patients, records, and billing in one calm place.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#61736c]">
              Run daily hospital operations with a fast, focused dashboard built for reception, doctors, and patient access.
            </p>
          </div>
          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Appointments", "Records", "Billing"].map((item) => (
              <div key={item} className="rounded-lg border border-[#d8e8df] bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-black text-[#19332c]">{item}</p>
                <p className="mt-1 text-xs font-semibold text-[#61736c]">Ready when you are</p>
              </div>
            ))}
          </div>
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
            alt="Medical team reviewing patient care"
            width={1200}
            height={672}
            className="h-56 w-full max-w-2xl rounded-lg object-cover shadow-2xl shadow-emerald-900/10"
            priority
          />
        </section>
        <section className="surface w-full rounded-lg p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-normal text-[#0f8f72]">Welcome back</p>
          <h2 className="mt-2 text-3xl font-black text-[#19332c]">Login</h2>
          <p className="mb-6 mt-2 text-sm leading-6 text-[#61736c]">Access the MediCore control room.</p>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
