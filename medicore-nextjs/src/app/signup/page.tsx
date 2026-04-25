import Image from "next/image";
import { SignupForm } from "@/components/signup-form";
import { BrandMark } from "@/components/ui";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_85%_15%,_#ffe1dc,_transparent_28%),linear-gradient(135deg,_#f4fbf7_0%,_#ffffff_54%,_#eef8f3_100%)] px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface w-full rounded-lg p-6 md:p-8">
          <BrandMark />
          <p className="mt-8 text-sm font-black uppercase tracking-normal text-[#0f8f72]">Patient access</p>
          <h1 className="mt-2 text-3xl font-black text-[#19332c]">Create Account</h1>
          <p className="mb-6 mt-2 text-sm leading-6 text-[#61736c]">Create a patient profile and secure portal login together.</p>
          <SignupForm />
        </section>
        <section className="max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-normal text-[#e4574f]">Private profile</p>
          <h2 className="text-4xl font-black tracking-normal text-[#19332c] md:text-6xl">
            Patients can see their own visits, bills, records, and reports.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#61736c]">
            Your account is linked to your patient profile immediately after registration.
          </p>
          <Image
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80"
            alt="Hospital care team"
            width={1200}
            height={800}
            className="mt-8 h-64 w-full rounded-lg object-cover shadow-2xl shadow-emerald-900/10"
          />
        </section>
      </div>
    </main>
  );
}
