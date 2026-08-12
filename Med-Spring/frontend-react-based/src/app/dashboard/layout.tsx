'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/services/authService';
import { getPatientProfile } from '@/services/patientService';
import { getDoctorProfile, DoctorProfile } from '@/services/doctorService';
import { getRecords } from '@/services/recordService';
import { getMedications } from '@/services/medicationService';
import { getDocuments } from '@/services/documentService';
import { Patient, MedicalRecord, Medication, Document } from '@/types';
import { Search, Bell, Shield, Sparkles, FileText, Pill, Folder, ArrowRight, X, Stethoscope } from 'lucide-react';

const patientPageTitles: Record<string, { title: string; caption: string }> = {
  '/dashboard': { title: 'Concierge Dashboard', caption: 'Clinical Overview & Live Indicators' },
  '/dashboard/profile': { title: 'Personal Health Record', caption: 'Demographics, Allergies & Emergency Alerts' },
  '/dashboard/records': { title: 'Medical Encounters', caption: 'Prescriptions, Diagnostic & Lab Reports' },
  '/dashboard/medications': { title: 'Regimen Tracker', caption: 'Active Dosages & Treatment Schedules' },
  '/dashboard/follow-ups': { title: 'Care Timeline', caption: 'Specialist Appointments & Reminders' },
  '/dashboard/sharing': { title: 'Access & Consent Vault', caption: 'Time-Bound Provider Record Sharing' },
  '/dashboard/documents': { title: 'Document Repository', caption: 'Secure Digital Record Storage' },
};

const doctorPageTitles: Record<string, { title: string; caption: string }> = {
  '/dashboard': { title: 'Doctor Clinical Practice', caption: 'Authorized Patient Roster & Encounters Stream' },
  '/dashboard/profile': { title: 'Physician Credentials', caption: 'Clinical License & Practice Demographics' },
  '/dashboard/records': { title: 'Authorized Encounters', caption: 'Patient Clinical History & Progress Notes' },
  '/dashboard/medications': { title: 'Treatment Regimens', caption: 'Patient Active Prescriptions & Schedules' },
  '/dashboard/follow-ups': { title: 'Clinical Timeline', caption: 'Scheduled Patient Consultations' },
  '/dashboard/sharing': { title: 'Patient Consent Roster', caption: 'Active Time-Bound Sharing Clearances' },
  '/dashboard/documents': { title: 'Clinical Diagnostics Vault', caption: 'Shared Scans & Diagnostic Reports' },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [user, setUser] = useState<any>(null);

  // Global Sonar Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    records: MedicalRecord[];
    medications: Medication[];
    documents: Document[];
  }>({ records: [], medications: [], documents: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      if (currentUser.role === 'PATIENT') {
        getPatientProfile()
          .then(data => setPatient(data))
          .catch(() => setPatient(null))
          .finally(() => setLoading(false));
      } else if (currentUser.role === 'DOCTOR') {
        getDoctorProfile()
          .then(data => setDoctor(data))
          .catch(() => setDoctor(null))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [router]);

  // Global Search Handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ records: [], medications: [], documents: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const q = searchQuery.toLowerCase();

    Promise.all([
      getRecords().catch(() => []),
      getMedications().catch(() => []),
      getDocuments().catch(() => [])
    ]).then(([recList, medList, docList]) => {
      setSearchResults({
        records: recList.filter(r => 
          r.title?.toLowerCase().includes(q) || 
          r.diagnosis?.toLowerCase().includes(q) || 
          r.doctorName?.toLowerCase().includes(q)
        ),
        medications: medList.filter(m => 
          m.name.toLowerCase().includes(q) || 
          m.instructions?.toLowerCase().includes(q)
        ),
        documents: docList.filter(d => 
          d.name.toLowerCase().includes(q) || 
          d.description?.toLowerCase().includes(q)
        )
      });
    });
  }, [searchQuery]);

  // Click outside to close search overlay
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDoctor = user?.role === 'DOCTOR';
  const pageTitles = isDoctor ? doctorPageTitles : patientPageTitles;
  const currentPage = pageTitles[pathname] || { title: 'MediCore Suite', caption: 'Clinical Portal' };

  const displayName = isDoctor
    ? (doctor?.name ? `Dr. ${doctor.name.replace(/^Dr\.\s*/i, '')}` : 'Dr. Aris Thorne')
    : (patient?.name || user?.name || 'Alexander Thorne');

  const initials = isDoctor
    ? 'AT'
    : displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const hasResults = searchResults.records.length > 0 || searchResults.medications.length > 0 || searchResults.documents.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-alabaster">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-cyan/20 border-t-cyan animate-spin" />
          <p className="text-xs font-semibold text-sapphire uppercase tracking-widest">Decrypting Health Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alabaster flex text-slate-charcoal">
      <Sidebar />

      <div className="flex-1 ml-[280px] flex flex-col min-w-0">
        {/* Sticky Frosted Topbar */}
        <header className="h-[76px] sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 shadow-sm">
          {/* Left Title & Breadcrumb */}
          <div>
            <h1 className="text-xl font-display font-semibold text-sapphire tracking-tight">
              {currentPage.title}
            </h1>
            <p className="text-xs font-medium text-mist">
              {currentPage.caption}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            {/* Live Global Sonar Search Field */}
            <div ref={searchContainerRef} className="relative hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-mist absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search encounters, meds, labs..." 
                  value={searchQuery}
                  onFocus={() => searchQuery && setIsSearching(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 pl-10 pr-8 py-2 text-xs rounded-full bg-frosted border border-slate-200/60 focus:outline-none focus:border-cyan focus:bg-white focus:shadow-[0_0_15px_rgba(0,180,216,0.25)] transition-fluid"
                />
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); setIsSearching(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-slate-charcoal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Floating Live Sonar Search Dropdown Overlay */}
              <AnimatePresence>
                {isSearching && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-[420px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/80 shadow-2xl p-4 z-50 space-y-4 max-h-[480px] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[11px] font-bold text-sapphire uppercase tracking-wider">
                        Live Clinical Search Results
                      </span>
                      <span className="text-[10px] text-mist font-semibold">
                        Query: "{searchQuery}"
                      </span>
                    </div>

                    {!hasResults ? (
                      <div className="py-8 text-center text-xs text-mist">
                        No clinical records, medications, or documents matching "{searchQuery}".
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {searchResults.records.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-cyan uppercase tracking-wider flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" /> Medical Records ({searchResults.records.length})
                            </p>
                            {searchResults.records.slice(0, 3).map((rec) => (
                              <div 
                                key={rec.id}
                                onClick={() => { setIsSearching(false); router.push('/dashboard/records'); }}
                                className="p-2.5 rounded-xl bg-alabaster/80 hover:bg-cyan/10 cursor-pointer transition-fluid flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-xs font-bold text-slate-charcoal">{rec.title || rec.diagnosis}</p>
                                  <p className="text-[10px] text-mist">{rec.date ? new Date(rec.date).toLocaleDateString() : 'Recent'}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                              </div>
                            ))}
                          </div>
                        )}

                        {searchResults.medications.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-abyssal-teal uppercase tracking-wider flex items-center gap-1">
                              <Pill className="w-3.5 h-3.5" /> Medications ({searchResults.medications.length})
                            </p>
                            {searchResults.medications.slice(0, 3).map((med) => (
                              <div 
                                key={med.id}
                                onClick={() => { setIsSearching(false); router.push('/dashboard/medications'); }}
                                className="p-2.5 rounded-xl bg-alabaster/80 hover:bg-cyan/10 cursor-pointer transition-fluid flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-xs font-bold text-slate-charcoal">{med.name} ({med.dosage})</p>
                                  <p className="text-[10px] text-mist">{med.frequency}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                              </div>
                            ))}
                          </div>
                        )}

                        {searchResults.documents.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                              <Folder className="w-3.5 h-3.5" /> Vault Documents ({searchResults.documents.length})
                            </p>
                            {searchResults.documents.slice(0, 3).map((doc) => (
                              <div 
                                key={doc.id}
                                onClick={() => { setIsSearching(false); router.push('/dashboard/documents'); }}
                                className="p-2.5 rounded-xl bg-alabaster/80 hover:bg-cyan/10 cursor-pointer transition-fluid flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-xs font-bold text-slate-charcoal">{doc.name}</p>
                                  <p className="text-[10px] text-mist">{doc.type}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-full bg-frosted hover:bg-slate-100 text-sapphire transition-fluid">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral" />
            </button>

            {/* User Profile Chip */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200/60">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sapphire to-cyan p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display font-bold text-sapphire text-xs">
                  {initials}
                </div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-sapphire leading-tight">{displayName}</p>
                <span className="text-[10px] text-cyan font-semibold uppercase tracking-wider">
                  {isDoctor ? 'Attending Physician' : 'Verified Patient'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
