'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getCurrentUser } from '@/services/authService';
import { getPatientProfile, updatePatientProfile } from '@/services/patientService';
import { getDoctorProfile, DoctorProfile } from '@/services/doctorService';
import { Patient } from '@/types';
import { 
  User, 
  Phone, 
  Mail, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  Check, 
  X, 
  Plus, 
  Save, 
  RotateCcw,
  Sparkles,
  Stethoscope,
  Building,
  Award
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Patient | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [initialProfile, setInitialProfile] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [allergiesList, setAllergiesList] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser?.role === 'DOCTOR') {
      getDoctorProfile()
        .then(data => setDoctorProfile(data))
        .catch(() => setDoctorProfile(null))
        .finally(() => setLoading(false));
    } else {
      fetchPatientProfile();
    }
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const data = await getPatientProfile();
      setProfile(data);
      setInitialProfile(data);
      if (data.allergies) {
        setAllergiesList(data.allergies.split(',').map(s => s.trim()).filter(Boolean));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isDoctor = user?.role === 'DOCTOR';

  const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile) || 
                  allergiesList.join(', ') !== (initialProfile?.allergies || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleAddAllergy = () => {
    if (newAllergyInput.trim() && !allergiesList.includes(newAllergyInput.trim())) {
      setAllergiesList([...allergiesList, newAllergyInput.trim()]);
      setNewAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergiesList(allergiesList.filter(a => a !== allergy));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const updatedData = {
        ...profile,
        allergies: allergiesList.join(', ')
      };
      const res = await updatePatientProfile(updatedData);
      setProfile(res);
      setInitialProfile(res);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-sapphire uppercase tracking-widest animate-pulse">
        Decrypting Credentials Vault...
      </div>
    );
  }

  // DOCTOR PROFILE VIEW
  if (isDoctor) {
    const doctorName = doctorProfile?.name || 'Dr. Aris Thorne';
    const specialty = doctorProfile?.specialty || 'Cardiology Specialist';
    const phone = doctorProfile?.phone || '044-28290000';

    return (
      <div className="space-y-8 max-w-4xl mx-auto pb-16">
        {/* Doctor Header Banner */}
        <Card className="p-8 bg-gradient-to-r from-abyssal-night via-sapphire to-abyssal-teal text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan to-white p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-white text-sapphire flex items-center justify-center font-display font-bold text-3xl">
                AT
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider border border-cyan/30">
                <Stethoscope className="w-4 h-4" /> Attending Physician • License Active
              </div>
              <h1 className="text-3xl font-display font-bold text-white">{doctorName}</h1>
              <p className="text-xs text-mist font-medium">{specialty} • Apollo Heart Centre, Chennai</p>
            </div>
          </div>
        </Card>

        {/* Doctor Credentials Details */}
        <Card className="p-8 bg-white border border-slate-200/60 shadow-ambient space-y-6">
          <div className="border-b border-slate-200/60 pb-3">
            <h2 className="text-xl font-display font-semibold text-sapphire">Clinical Credentials & Practice Info</h2>
            <p className="text-xs text-mist font-medium">Verified medical council license and hospital affiliation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Full Professional Name</span>
              <p className="text-sm font-bold text-sapphire">{doctorName}</p>
            </div>

            <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Medical Speciality</span>
              <p className="text-sm font-bold text-cyan">{specialty}</p>
            </div>

            <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Qualifications</span>
              <p className="text-sm font-bold text-slate-charcoal">MBBS, MD (Cardiology), FACC</p>
            </div>

            <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">MCI License Number</span>
              <p className="text-sm font-bold font-mono text-sapphire">TN-MCI-48213</p>
            </div>

            <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Primary Affiliation</span>
              <p className="text-sm font-bold text-slate-charcoal">Apollo Heart Centre, Greams Road, Chennai</p>
            </div>

            <div className="p-4 rounded-xl bg-frosted border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-mist uppercase tracking-wider block">Contact Phone & Desk</span>
              <p className="text-sm font-bold font-mono text-sapphire">{phone}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // PATIENT PROFILE VIEW
  const initials = profile?.name 
    ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'KV';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-8 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-eucalyptus text-white border-eucalyptus/30' : 'bg-coral text-white border-coral/30'
            }`}
          >
            <Check className="w-4 h-4" /> {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header Banner */}
      <Card className="p-8 bg-gradient-to-r from-abyssal-night via-sapphire to-abyssal-teal text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan to-white p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-white text-sapphire flex items-center justify-center font-display font-bold text-3xl">
              {initials}
            </div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider border border-cyan/30">
              <ShieldCheck className="w-4 h-4" /> Concierge Airway ID Verified
            </div>
            <h1 className="text-3xl font-display font-bold text-white">{profile?.name || 'Kannan V'}</h1>
            <p className="text-xs text-mist font-medium">{profile?.email || user?.email} • Verified Primary Patient</p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <Card className="p-8 bg-white border border-slate-200/60 shadow-ambient space-y-6">
          <div className="border-b border-slate-200/60 pb-3">
            <h2 className="text-xl font-display font-semibold text-sapphire">Personal Demographics</h2>
            <p className="text-xs text-mist font-medium">Verify your identity and primary contact information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name"
              name="name"
              value={profile?.name || ''}
              onChange={handleChange}
              required
            />
            <Input 
              label="Date of Birth"
              type="date"
              name="dob"
              value={profile?.dob || ''}
              onChange={handleChange}
            />
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-mist uppercase tracking-wider">Gender Identity</label>
              <select
                name="gender"
                value={profile?.gender || 'MALE'}
                onChange={handleChange}
                className="w-full h-13 px-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium text-slate-charcoal focus:outline-none focus:border-cyan"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other / Non-Binary</option>
              </select>
            </div>
            <Input 
              label="Phone Number"
              name="phone"
              value={profile?.phone || ''}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Emergency Contact & Allergy Logs */}
        <Card className="p-8 bg-white border border-slate-200/60 shadow-ambient space-y-6">
          <div className="border-b border-slate-200/60 pb-3">
            <h2 className="text-xl font-display font-semibold text-sapphire">Emergency & Reactivity Logs</h2>
            <p className="text-xs text-mist font-medium">Critical medical flags and emergency responder contacts</p>
          </div>

          <div className="space-y-6">
            <Input 
              label="Emergency Contact Person & Phone"
              name="emergencyContact"
              placeholder="e.g. V. Rajesh (Father) — 98400 12345"
              value={profile?.emergencyContact || ''}
              onChange={handleChange}
            />

            {/* Allergies Chip Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-mist uppercase tracking-wider">Known Reactivities & Allergies</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Add allergy flag (e.g. Penicillin)..."
                  value={newAllergyInput}
                  onChange={(e) => setNewAllergyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAllergy(); } }}
                  className="flex-1 h-12 px-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium focus:outline-none focus:border-cyan"
                />
                <Button type="button" variant="secondary" onClick={handleAddAllergy}>
                  <Plus className="w-4 h-4 mr-1" /> Add Flag
                </Button>
              </div>

              {/* Allergy Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {allergiesList.length === 0 ? (
                  <span className="text-xs text-mist font-medium italic">No known reactivity flags logged.</span>
                ) : (
                  allergiesList.map((allergy) => (
                    <span 
                      key={allergy}
                      className="px-3.5 py-1.5 rounded-full bg-coral/10 text-coral border border-coral/30 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{allergy}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveAllergy(allergy)}
                        className="hover:bg-coral/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Important Notes */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-mist uppercase tracking-wider">Important Clinical Notes</label>
              <textarea 
                name="importantMedicalNotes"
                rows={3}
                placeholder="Notes for consulting physicians..."
                value={profile?.importantMedicalNotes || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium text-slate-charcoal focus:outline-none focus:border-cyan"
              />
            </div>
          </div>
        </Card>

        {/* Sticky Save Bar */}
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-6 z-40 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl flex items-center justify-between gap-4 max-w-4xl mx-auto"
          >
            <span className="text-xs font-semibold text-sapphire flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan" /> Unsaved changes in health profile.
            </span>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" onClick={fetchPatientProfile}>
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </Button>
              <Button type="submit" variant="primary" isLoading={saving}>
                <Save className="w-4 h-4 mr-1" /> Save Health Profile
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}
