'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/services/authService';
import { getPatientProfile, getHealthSnapshot } from '@/services/patientService';
import { getDoctorProfile, DoctorProfile } from '@/services/doctorService';
import { getMedicalRecords } from '@/services/recordService';
import { getConsents } from '@/services/consentService';
import { HealthSnapshot, Patient, MedicalRecord, Consent } from '@/types';
import { 
  Activity, 
  Pill, 
  FileText, 
  Calendar, 
  AlertCircle, 
  ShieldCheck, 
  Heart, 
  Plus, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Stethoscope,
  Users,
  Lock,
  User as UserIcon,
  Phone,
  FileSpreadsheet
} from 'lucide-react';

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecordId, setExpandedRecordId] = useState<number | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser?.role === 'PATIENT') {
      Promise.all([
        getPatientProfile().catch(() => null),
        getHealthSnapshot().catch(() => null),
        getMedicalRecords().catch(() => [])
      ]).then(([patientData, snapshotData, recordsData]) => {
        setPatient(patientData);
        setSnapshot(snapshotData);
        setRecords(recordsData);
      }).finally(() => setLoading(false));
    } else if (currentUser?.role === 'DOCTOR') {
      Promise.all([
        getDoctorProfile().catch(() => null),
        getConsents().catch(() => []),
        getMedicalRecords().catch(() => [])
      ]).then(([doctorData, consentData, recordsData]) => {
        setDoctor(doctorData);
        setConsents(consentData);
        setRecords(recordsData);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const isDoctor = user?.role === 'DOCTOR';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] } }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-sapphire uppercase tracking-widest animate-pulse">
        Decrypting Clinical Workspace...
      </div>
    );
  }

  // ==========================================
  // DOCTOR DASHBOARD VIEW
  // ==========================================
  if (isDoctor) {
    const activeConsents = consents.filter(c => c.status === 'ACTIVE');
    const doctorName = doctor?.name ? `Dr. ${doctor.name.replace(/^Dr\.\s*/i, '')}` : 'Dr. Aris Thorne';

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-6xl mx-auto pb-16"
      >
        {/* Doctor Hero Card */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-gradient-to-r from-abyssal-night via-sapphire to-abyssal-teal text-white shadow-2xl relative overflow-hidden border border-white/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider border border-cyan/30">
                  <Stethoscope className="w-4 h-4" /> Attending Physician • {doctor?.specialty || 'Cardiology Specialist'}
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-white">
                  Good morning, <span className="text-cyan font-bold">{doctorName}</span>
                </h1>
                <p className="text-xs md:text-sm text-mist font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} — Active Clinical Roster
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <span className="text-2xl font-bold text-cyan font-mono block">{activeConsents.length}</span>
                  <span className="text-[10px] text-mist font-semibold uppercase tracking-wider">Active Patient Clearances</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Doctor Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan/10 text-cyan flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-sapphire">1</span>
              <p className="text-xs font-semibold text-mist">Authorized Patients</p>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-eucalyptus/10 text-eucalyptus flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-sapphire">{activeConsents.length}</span>
              <p className="text-xs font-semibold text-mist">Active Airway Clearances</p>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-sapphire">{records.length}</span>
              <p className="text-xs font-semibold text-mist">Encounters Reviewed</p>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-sapphire">1</span>
              <p className="text-xs font-semibold text-mist">Pending Lab Reviews</p>
            </div>
          </Card>
        </motion.div>

        {/* Authorized Patient Roster */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div>
              <h2 className="text-xl font-display font-semibold text-sapphire">Authorized Patient Clearances</h2>
              <p className="text-xs text-mist font-medium">Patients who granted active time-bound record access</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => router.push('/dashboard/sharing')}>
              Manage Consents <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sapphire to-cyan text-white font-display font-bold text-xl flex items-center justify-center shadow-md">
                  KV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-display font-bold text-sapphire">Kannan V</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-eucalyptus/15 text-eucalyptus text-[10px] font-bold">
                      ACTIVE ACCESS
                    </span>
                  </div>
                  <p className="text-xs text-mist font-medium mt-0.5">
                    Male • DOB: Mar 15, 2006 (20 Yrs) • Phone: <span className="font-mono text-slate-charcoal">6374088373</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-coral/10 text-coral text-xs font-bold border border-coral/20 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Allergy: Penicillin
                </div>
                <Button size="md" variant="primary" onClick={() => router.push('/dashboard/records')}>
                  Review Records <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Scope Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Granted Categories</span>
                <p className="text-xs font-bold text-sapphire">CONSULTATIONS, LAB_REPORTS, PRESCRIPTIONS</p>
              </div>
              <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Consent Clearance Status</span>
                <p className="text-xs font-bold text-eucalyptus flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Active (Expires in 45 Days)
                </p>
              </div>
              <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Emergency Contact</span>
                <p className="text-xs font-bold text-slate-charcoal">V. Rajesh (Father) — 98400 12345</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Shared Encounters Stream */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <h2 className="text-xl font-display font-semibold text-sapphire">Authorized Encounters Stream</h2>
            <Button size="sm" variant="ghost" onClick={() => router.push('/dashboard/records')}>
              View All Encounters <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {records.map((rec) => (
              <Card key={rec.id} className="p-5 bg-white border border-slate-200/60 shadow-ambient flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan/10 text-cyan">
                      {rec.type}
                    </span>
                    <h4 className="text-base font-display font-semibold text-sapphire">
                      {rec.title || rec.diagnosis}
                    </h4>
                  </div>
                  <p className="text-xs text-mist">
                    {rec.description}
                  </p>
                </div>
                <div className="text-right sm:self-center">
                  <span className="text-xs font-mono font-medium text-slate-charcoal block">
                    {rec.date ? new Date(rec.date).toLocaleDateString() : 'Recent'}
                  </span>
                  <span className="text-[10px] font-semibold text-eucalyptus">Authorized Access</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ==========================================
  // PATIENT DASHBOARD VIEW
  // ==========================================
  const patientName = patient?.name || user?.name || 'Alexander Thorne';
  const firstName = patientName.split(' ')[0];
  const hasAllergies = patient?.allergies && patient.allergies !== 'None';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto pb-16"
    >
      {/* Patient Hero Greeting Banner */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 bg-gradient-to-r from-abyssal-night via-sapphire to-abyssal-teal text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider border border-cyan/30">
                <Activity className="w-3.5 h-3.5" /> Vitals Synchronized
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-white">
                Good morning, <span className="text-cyan italic">{firstName}</span>
              </h1>
              <p className="text-xs md:text-sm text-mist font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} — Clinical Records Secured
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <ShieldCheck className="w-6 h-6 text-cyan mx-auto mb-1" />
                <span className="text-[10px] text-mist font-semibold uppercase tracking-wider block">Vault Status</span>
                <span className="text-xs font-bold text-white">256-Bit Encrypted</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Patient Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-mist uppercase tracking-wider block mb-1">Active Regimen</span>
            <span className="text-3xl font-display font-bold text-sapphire">{snapshot?.activeMedicationCount || 2}</span>
            <span className="text-xs text-mist block mt-1">Prescriptions</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan/10 text-cyan flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-mist uppercase tracking-wider block mb-1">Total Encounters</span>
            <span className="text-3xl font-display font-bold text-sapphire">{snapshot?.totalRecordsCount || records.length || 5}</span>
            <span className="text-xs text-mist block mt-1">Records Logged</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-eucalyptus/10 text-eucalyptus flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-mist uppercase tracking-wider block mb-1">Allergies Log</span>
            <span className="text-3xl font-display font-bold text-sapphire">{hasAllergies ? 1 : 0}</span>
            <span className={`text-xs block mt-1 font-semibold ${hasAllergies ? 'text-coral' : 'text-mist'}`}>
              {hasAllergies ? patient.allergies : 'None Recorded'}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasAllergies ? 'bg-coral/10 text-coral' : 'bg-frosted text-mist'}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-mist uppercase tracking-wider block mb-1">Upcoming Follow-Up</span>
            <span className="text-lg font-display font-bold text-gold">In 8 Days</span>
            <span className="text-xs text-mist block mt-1">Cardiology Consultation</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </Card>
      </motion.div>

      {/* Patient Encounters List */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <h2 className="text-xl font-display font-semibold text-sapphire">Recent Encounters & Diagnostic Labs</h2>
          <Button size="sm" variant="ghost" onClick={() => router.push('/dashboard/records')}>
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {records.map((rec) => (
            <Card key={rec.id} className="p-5 bg-white border border-slate-200/60 shadow-ambient flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan/10 text-cyan">
                    {rec.type}
                  </span>
                  <h4 className="text-base font-display font-semibold text-sapphire">
                    {rec.title || rec.diagnosis}
                  </h4>
                </div>
                <p className="text-xs text-mist">
                  {rec.description}
                </p>
              </div>
              <div className="text-right sm:self-center">
                <span className="text-xs font-mono font-medium text-slate-charcoal block">
                  {rec.date ? new Date(rec.date).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
