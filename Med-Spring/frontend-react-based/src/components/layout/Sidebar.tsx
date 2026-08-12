'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Pill, 
  Folder, 
  Calendar, 
  Share2, 
  LogOut,
  Activity,
  ShieldCheck,
  Stethoscope,
  Users
} from 'lucide-react';
import { logout, getCurrentUser } from '@/services/authService';
import { getPatientProfile } from '@/services/patientService';
import { getDoctorProfile, DoctorProfile } from '@/services/doctorService';
import { Patient } from '@/types';

interface MenuSection {
  title: string;
  items: {
    icon: any;
    label: string;
    path: string;
  }[];
}

const patientMenuSections: MenuSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }
    ]
  },
  {
    title: 'MY CARE',
    items: [
      { icon: User, label: 'Health Profile', path: '/dashboard/profile' },
      { icon: FileText, label: 'Medical Records', path: '/dashboard/records' },
      { icon: Pill, label: 'Medications', path: '/dashboard/medications' },
      { icon: Calendar, label: 'Follow-ups', path: '/dashboard/follow-ups' }
    ]
  },
  {
    title: 'PRIVACY',
    items: [
      { icon: Share2, label: 'Sharing & Access', path: '/dashboard/sharing' },
      { icon: Folder, label: 'Documents Vault', path: '/dashboard/documents' }
    ]
  }
];

const doctorMenuSections: MenuSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Doctor Dashboard', path: '/dashboard' }
    ]
  },
  {
    title: 'CLINICAL PRACTICE',
    items: [
      { icon: Users, label: 'Patient Roster & Consents', path: '/dashboard/sharing' },
      { icon: FileText, label: 'Medical Encounters', path: '/dashboard/records' }
    ]
  },
  {
    title: 'DOCTOR VAULT',
    items: [
      { icon: Folder, label: 'Clinical Documents', path: '/dashboard/documents' },
      { icon: Calendar, label: 'Care Timeline', path: '/dashboard/follow-ups' }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.role === 'PATIENT') {
      getPatientProfile().then(setPatient).catch(() => setPatient(null));
    } else if (currentUser?.role === 'DOCTOR') {
      getDoctorProfile().then(setDoctor).catch(() => setDoctor(null));
    }
  }, []);

  const isDoctor = user?.role === 'DOCTOR';
  const menuSections = isDoctor ? doctorMenuSections : patientMenuSections;

  const displayName = isDoctor 
    ? (doctor?.name ? `Dr. ${doctor.name.replace(/^Dr\.\s*/i, '')}` : 'Dr. Aris Thorne')
    : (patient?.name || user?.name || 'Alexander Thorne');

  const initials = isDoctor
    ? 'AT'
    : displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200/60 flex flex-col h-screen fixed top-0 left-0 z-40 shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sapphire to-cyan flex items-center justify-center text-white shadow-ambient">
            {isDoctor ? <Stethoscope className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-sapphire tracking-tight leading-tight">
              MediCore
            </h1>
            <p className="text-[10px] font-semibold tracking-widest text-cyan uppercase">
              {isDoctor ? 'Doctor Clinical Suite' : 'Concierge Clinic'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-3 text-[10px] font-bold text-mist uppercase tracking-widest font-mono">
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                      isActive
                        ? 'text-cyan bg-cyan/10 font-bold shadow-sm'
                        : 'text-slate-charcoal hover:bg-frosted hover:text-sapphire'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan' : 'text-mist'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Sign Out */}
      <div className="p-4 border-t border-slate-200/60 bg-frosted/40 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-sapphire text-white font-bold flex items-center justify-center text-xs font-display">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-sapphire truncate">{displayName}</p>
            <span className="text-[9px] font-bold text-cyan uppercase tracking-wider block">
              {isDoctor ? (doctor?.specialty || 'Cardiology Specialist') : 'Patient Account'}
            </span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-coral bg-coral/10 hover:bg-coral hover:text-white transition-fluid"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
