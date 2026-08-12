'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Share2, 
  Pill, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Sparkles, 
  UserCheck, 
  Key, 
  Database,
  Heart,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 25, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] as const } 
    }
  };

  return (
    <div className="min-h-screen bg-alabaster text-slate-charcoal overflow-x-hidden relative selection:bg-cyan/20">
      
      {/* SECTION 1 — STICKY FROSTED NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300">
        <div 
          className={`max-w-7xl mx-auto rounded-full transition-all duration-500 border ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_10px_30px_-10px_rgba(15,76,92,0.12)] py-3 px-6' 
              : 'bg-white/50 backdrop-blur-md border-white/40 shadow-sm py-4 px-8'
          } flex items-center justify-between`}
        >
          {/* Logo Mark */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sapphire to-abyssal-teal text-white flex items-center justify-center shadow-ambient group-hover:scale-105 transition-fluid">
              <Activity className="w-5 h-5 text-cyan" />
            </div>
            <span className="font-display font-bold text-2xl text-sapphire tracking-tight">MediCore</span>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-mist">
            {['Features', 'How It Works', 'Security'].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative hover:text-sapphire transition-fluid py-1 group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => router.push('/login')}
              className="text-sm font-semibold text-sapphire hover:text-cyan transition-fluid px-4 py-2"
            >
              Sign In
            </button>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-sapphire to-cyan text-white shadow-ambient hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 text-sapphire"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Glass Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl pt-28 px-6 flex flex-col justify-between pb-10 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-display font-medium text-sapphire">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#security" onClick={() => setMobileMenuOpen(false)}>Security</a>
            </div>
            <div className="flex flex-col gap-4">
              <Button variant="secondary" onClick={() => { setMobileMenuOpen(false); router.push('/login'); }}>
                Sign In
              </Button>
              <Button onClick={() => { setMobileMenuOpen(false); router.push('/register'); }}>
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* SECTION 2 — HERO (SPLIT LAYOUT) */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden">
        {/* Layered Ocean Depth Glows */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-abyssal-teal/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Left Column */}
            <motion.div variants={fadeUpVariants} className="lg:col-span-7 space-y-8">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-abyssal-teal">
                  Intelligent Healthcare Ecosystem
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display tracking-tight leading-[1.1] text-slate-charcoal">
                Your Health, <br />
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sapphire via-abyssal-teal to-cyan">
                  Beautifully Organized.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg md:text-xl text-mist max-w-xl font-normal leading-relaxed">
                MediCore centralizes your medical history, active prescriptions, and provider access in a serene, 256-bit encrypted health vault.
              </p>

              {/* Button Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Button 
                  size="lg"
                  onClick={() => router.push('/register')}
                  className="bg-gradient-to-r from-sapphire to-cyan text-white shadow-ambient hover:shadow-xl hover:-translate-y-1 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-fluid" />
                </Button>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/login')}
                  className="glass-panel hover:bg-frosted"
                >
                  Sign In
                </Button>
              </div>

              {/* Trust Strip */}
              <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center gap-6 text-xs font-medium text-mist">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan" />
                  <span>JWT Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-eucalyptus" />
                  <span>Consent-First Sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gold" />
                  <span>Local & Private</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column — Floating Glass Health Snapshot */}
            <motion.div variants={fadeUpVariants} className="lg:col-span-5 relative flex justify-center">
              {/* Main Snapshot Card */}
              <div className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-ambient relative z-10 border border-white/80">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/40">
                  <div>
                    <h3 className="font-display font-semibold text-xl text-sapphire">Health Snapshot</h3>
                    <p className="text-xs text-mist">Patient: Alexander Thorne</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-eucalyptus/15 text-eucalyptus text-xs font-semibold uppercase tracking-wider">
                    Synced
                  </span>
                </div>

                {/* Radial Progress Metric */}
                <div className="flex items-center gap-6 p-4 rounded-2xl bg-alabaster/80 border border-slate-200/50 mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#E2E8F0" strokeWidth="4" fill="none" />
                      <circle cx="32" cy="32" r="26" stroke="#00B4D8" strokeWidth="4" fill="none" strokeDasharray="163" strokeDashoffset="35" strokeLinecap="round" />
                    </svg>
                    <Heart className="w-6 h-6 text-coral absolute" />
                  </div>
                  <div>
                    <span className="text-2xl font-display font-bold text-sapphire">98% Optimal</span>
                    <p className="text-xs text-mist">Vital stability rating</p>
                  </div>
                </div>

                {/* Stat Rows */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-mist font-medium">Active Medications</span>
                    <span className="font-display font-bold text-lg text-sapphire">3 Prescriptions</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-mist font-medium">Upcoming Consult</span>
                    <span className="font-display font-semibold text-sm text-gold">Aug 25 — Dr. Aris</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-mist font-medium">Recorded Allergies</span>
                    <span className="font-display font-semibold text-sm text-coral">Penicillin</span>
                  </div>
                </div>
              </div>

              {/* Companion Floating Card 1 — Medication Reminder */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 z-20 glass-panel p-4 rounded-2xl shadow-ambient border border-white/90 flex items-center gap-3 hidden sm:flex"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan/15 text-cyan flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-sapphire">Medication Due</p>
                  <p className="text-[11px] text-mist">Amoxicillin 500mg • 08:00 AM</p>
                </div>
              </motion.div>

              {/* Companion Floating Card 2 — Consent Granted */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-4 z-20 glass-panel p-4 rounded-2xl shadow-ambient border border-white/90 flex items-center gap-3 hidden sm:flex"
              >
                <div className="w-10 h-10 rounded-xl bg-eucalyptus/15 text-eucalyptus flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-sapphire">Access Granted</p>
                  <p className="text-[11px] text-eucalyptus font-medium">Dr. Aris Thorne (Cardiology)</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Layered Wave Section Divider */}
        <div className="w-full absolute bottom-0 left-0 overflow-hidden leading-none pointer-events-none">
          <svg className="relative block w-full h-12 text-frosted" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.92,152.47,130.83,230.17,117.8Z" fill="currentColor" />
          </svg>
        </div>
      </section>


      {/* SECTION 3 — FEATURE GRID (FOUR ELEVATED CARDS) */}
      <section id="features" className="py-24 bg-frosted relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan">Architectural Excellence</span>
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-sapphire">
              Designed for Clinical Precision.
            </h2>
            <p className="text-mist text-base">
              A refined suite of patient-controlled medical tools engineered for complete clarity.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {[
              {
                icon: Activity,
                color: 'text-cyan bg-cyan/10 border-cyan/20',
                hoverBorder: 'hover:border-cyan',
                title: 'Smart Profile',
                desc: 'Consolidated view of your vital indicators, chronic conditions, and personal health metrics.'
              },
              {
                icon: FileText,
                color: 'text-abyssal-teal bg-abyssal-teal/10 border-abyssal-teal/20',
                hoverBorder: 'hover:border-abyssal-teal',
                title: 'Medical Records',
                desc: 'Organize prescriptions, lab panels, and imaging reports in structured 3D physical folders.'
              },
              {
                icon: ShieldCheck,
                color: 'text-gold bg-gold/10 border-gold/20',
                hoverBorder: 'hover:border-gold',
                title: 'Medication Tracker',
                desc: 'Intelligent dosage schedules, follow-up alarms, and automatic prescription refill cues.'
              },
              {
                icon: Share2,
                color: 'text-coral bg-coral/10 border-coral/20',
                hoverBorder: 'hover:border-coral',
                title: 'Consent Sharing',
                desc: 'Grant time-bound record access to physicians with instant one-click access revocation.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={fadeUpVariants}
                className={`bg-white rounded-2xl p-8 border border-slate-200/60 shadow-ambient transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-2 group cursor-pointer ${feature.hoverBorder}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.color} group-hover:scale-110 transition-fluid`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-semibold text-sapphire mb-3">{feature.title}</h3>
                <p className="text-mist text-sm leading-relaxed mb-6">{feature.desc}</p>
                
                <div className="flex items-center text-xs font-semibold text-sapphire group-hover:text-cyan transition-fluid">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-fluid" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* SECTION 4 — CONSENT SPOTLIGHT (DARK ABYSSAL BAND) */}
      <section id="security" className="py-28 bg-abyssal-night text-white relative overflow-hidden">
        {/* Ambient Bioluminescent Background Particles */}
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-cyan/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-abyssal-teal/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan">Airlock Access Control</span>
              <h2 className="text-4xl sm:text-5xl font-display leading-tight text-white">
                You Decide Who Sees <br />
                <span className="italic font-normal text-cyan">Your Health History.</span>
              </h2>
              <p className="text-mist text-base max-w-lg">
                Never hand over unencrypted paper files again. Grant temporary, scoped access to verified specialists and revoke permission at any moment.
              </p>

              {/* 3-Step Timeline */}
              <div className="space-y-6 pt-4 border-l-2 border-cyan/20 pl-6 relative">
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan border-4 border-abyssal-night" />
                  <h4 className="font-display text-lg font-semibold text-white">1. Select Provider</h4>
                  <p className="text-xs text-mist">Choose from verified clinic directors or enter a physician license ID.</p>
                </div>

                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan border-4 border-abyssal-night" />
                  <h4 className="font-display text-lg font-semibold text-white">2. Scope Records & Duration</h4>
                  <p className="text-xs text-mist">Share only specific lab reports or cardiology encounters for 24 hours.</p>
                </div>

                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-eucalyptus border-4 border-abyssal-night" />
                  <h4 className="font-display text-lg font-semibold text-white">3. Auto-Expire & Revoke</h4>
                  <p className="text-xs text-mist">Access locks automatically upon expiration or instant manual revocation.</p>
                </div>
              </div>
            </div>

            {/* Right Mock Consent Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan/20 text-cyan flex items-center justify-center font-display font-bold">
                      AT
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white">Dr. Aris Thorne</h4>
                      <p className="text-xs text-mist">Cardiology Specialist • License #88492</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-eucalyptus/20 text-eucalyptus border border-eucalyptus/30 text-xs font-semibold animate-pulse">
                    ACTIVE ACCESS
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-mist uppercase font-semibold">Granted Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-white/10 text-xs text-white border border-white/10">
                      ECG Reports (2026)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white/10 text-xs text-white border border-white/10">
                      Lipid Panel Suite
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white/10 text-xs text-white border border-white/10">
                      Active Medications
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10 text-xs">
                  <span className="text-mist">Expires in: <strong className="text-white font-mono">14h 22m</strong></span>
                  <button className="px-4 py-2 rounded-xl bg-coral/20 hover:bg-coral text-coral hover:text-white transition-fluid font-semibold border border-coral/30">
                    Revoke Now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 5 — FINAL CTA + FOOTER */}
      <section id="how-it-works" className="py-24 relative bg-alabaster">
        <div className="max-w-5xl mx-auto px-6">
          {/* Floating Gradient CTA Panel */}
          <div className="rounded-3xl bg-gradient-to-r from-sapphire via-abyssal-teal to-cyan p-12 md:p-16 text-center text-white shadow-ambient relative overflow-hidden border border-white/20">
            <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight mb-4 relative z-10">
              Take Control of Your Medical Journey.
            </h2>
            <p className="text-mist text-base md:text-lg max-w-xl mx-auto mb-8 relative z-10">
              Join thousands of patients experiencing concierge clinical privacy and effortless health record management.
            </p>

            <Button 
              size="lg"
              onClick={() => router.push('/register')}
              className="bg-white text-sapphire hover:bg-frosted shadow-xl font-bold px-10 py-4 relative z-10"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer on Abyssal Night */}
      <footer className="bg-abyssal-night text-mist py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan text-abyssal-night flex items-center justify-center font-bold">
                  M
                </div>
                <span className="font-display font-bold text-2xl text-white">MediCore</span>
              </div>
              <p className="text-xs leading-relaxed text-mist">
                Intelligent Patient-Centered Healthcare Ecosystem. Designed for privacy, security, and concierge clinical elegance.
              </p>
            </div>

            <div>
              <h5 className="font-display text-white font-semibold text-sm mb-4">Platform</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-cyan transition-fluid">Health Snapshot</a></li>
                <li><a href="#features" className="hover:text-cyan transition-fluid">Medical Vault</a></li>
                <li><a href="#security" className="hover:text-cyan transition-fluid">Consent Sharing</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display text-white font-semibold text-sm mb-4">Security</h5>
              <ul className="space-y-2 text-xs">
                <li><span className="text-mist">256-Bit JWT Auth</span></li>
                <li><span className="text-mist">Role-Based Controls</span></li>
                <li><span className="text-mist">HIPAA Data Isolation</span></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display text-white font-semibold text-sm mb-4">System Status</h5>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eucalyptus/20 text-eucalyptus text-xs font-semibold border border-eucalyptus/30">
                <span className="w-2 h-2 rounded-full bg-eucalyptus animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} MediCore Inc. All rights reserved.</p>
            <p className="text-mist">Deep Ocean Concierge Edition</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
