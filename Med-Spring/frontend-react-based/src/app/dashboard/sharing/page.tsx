'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getConsents, createConsent, revokeConsent } from '@/services/consentService';
import { Consent } from '@/types';
import { 
  Shield, 
  Share2, 
  Ban, 
  Plus, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  Clock, 
  X, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function SharingPage() {
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  // 3-Step Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [grantForm, setGrantForm] = useState({
    doctorId: 1,
    doctorName: 'Aris Thorne',
    doctorSpecialty: 'Cardiology Specialist',
    recordsCategory: 'All Medical Records & Lab Panels',
    expiryDays: 7
  });

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    try {
      const data = await getConsents();
      setConsents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: number) => {
    setRevokingId(id);
    try {
      await revokeConsent(id);
      fetchConsents();
    } catch (err) {
      console.error(err);
    } finally {
      setRevokingId(null);
    }
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + (grantForm.expiryDays || 7));
      const formattedExpiry = expDate.toISOString().substring(0, 19);

      await createConsent({
        doctorId: Number(grantForm.doctorId) || 1,
        doctorName: grantForm.doctorName || 'Dr. Aris Thorne',
        doctorSpecialty: grantForm.doctorSpecialty || 'Cardiology Specialist',
        recordsCategory: grantForm.recordsCategory || 'All Medical Records & Lab Panels',
        expiryDate: formattedExpiry,
        status: 'ACTIVE'
      });

      setIsModalOpen(false);
      setStep(1);
      await fetchConsents();
    } catch (err: any) {
      console.error('Failed to grant consent:', err?.response?.data || err);
      alert('Unable to grant access. Please ensure physician details are filled.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sapphire tracking-tight">Record Sharing & Consent Vault</h1>
          <p className="text-mist text-xs md:text-sm font-medium">Grant temporary, time-bound access to verified medical providers</p>
        </div>

        <Button 
          size="lg"
          variant="primary"
          icon={<Share2 className="w-5 h-5" />}
          onClick={() => { setIsModalOpen(true); setStep(1); }}
        >
          Grant Provider Access
        </Button>
      </div>

      {/* Security Banner */}
      <Card className="p-6 bg-gradient-to-r from-abyssal-night to-sapphire text-white shadow-ambient flex items-center justify-between gap-6 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan/20 text-cyan flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white">Strict Airlock Protocol Active</h3>
            <p className="text-xs text-mist">Providers only see categories you explicitly approve. Access expires automatically.</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-cyan border border-white/20">
          <ShieldCheck className="w-4 h-4" /> HIPAA Compliant
        </div>
      </Card>

      {/* Consent Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 rounded-2xl animate-shimmer" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {consents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-ambient space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-frosted flex items-center justify-center mx-auto text-mist">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-semibold text-sapphire">No Active Provider Consents</h3>
                <p className="text-xs text-mist max-w-sm mx-auto">
                  You haven't granted record access to any physicians yet. Grant time-bound access whenever you visit a specialist.
                </p>
              </motion.div>
            ) : (
              consents.map((consent) => {
                const isRevoking = revokingId === consent.id;
                const docInitials = (consent.doctorName || 'Dr').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                return (
                  <motion.div
                    key={consent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="p-6 bg-white border border-slate-200/60 shadow-ambient flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sapphire to-cyan p-0.5 shadow-sm">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display font-bold text-sapphire text-sm">
                            {docInitials}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-display font-semibold text-sapphire">
                              Dr. {consent.doctorName}
                            </h3>
                            <StatusBadge status={consent.status || 'ACTIVE'} />
                          </div>
                          <p className="text-xs text-mist font-medium mt-0.5">
                            {consent.doctorSpecialty || 'Medical Specialist'}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                            <span className="px-3 py-1 rounded-lg bg-frosted border border-slate-200/60 font-semibold text-slate-charcoal">
                              Scope: {consent.recordsCategory || 'All Medical Records'}
                            </span>
                            <span className="font-mono text-mist flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-cyan" /> Expires: {new Date(consent.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {consent.status === 'ACTIVE' && (
                        <Button 
                          variant="danger" 
                          isLoading={isRevoking}
                          onClick={() => handleRevoke(consent.id)}
                          className="bg-coral text-white text-xs font-bold shadow-sm"
                        >
                          <Ban className="w-4 h-4 mr-1" /> Revoke Access
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3-STEP FROSTED STEPPER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-abyssal-night/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200/60 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                <div>
                  <h3 className="text-xl font-display font-semibold text-sapphire">Grant Provider Access</h3>
                  <p className="text-xs text-mist">Step {step} of 3 — Scoped Record Consent</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-mist hover:bg-frosted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-fluid ${
                      step === i ? 'w-8 bg-cyan' : step > i ? 'w-3 bg-eucalyptus' : 'w-3 bg-frosted'
                    }`}
                  />
                ))}
              </div>

              <form onSubmit={handleGrantSubmit} className="space-y-6 text-xs">
                {/* STEP 1: Select Provider */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-mist uppercase tracking-wider">Select Physician / Specialist</label>
                      <input 
                        type="text"
                        placeholder="Physician Name (e.g. Aris Thorne)"
                        value={grantForm.doctorName}
                        onChange={(e) => setGrantForm({ ...grantForm, doctorName: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-mist uppercase tracking-wider">Specialty / Clinic</label>
                      <input 
                        type="text"
                        placeholder="e.g. Cardiology"
                        value={grantForm.doctorSpecialty}
                        onChange={(e) => setGrantForm({ ...grantForm, doctorSpecialty: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                      />
                    </div>

                    <Button type="button" onClick={() => setStep(2)} className="w-full bg-sapphire text-white py-3 font-bold">
                      Next: Choose Scope <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}

                {/* STEP 2: Choose Records & Expiry */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-mist uppercase tracking-wider">Records Scope</label>
                      <select
                        value={grantForm.recordsCategory}
                        onChange={(e) => setGrantForm({ ...grantForm, recordsCategory: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                      >
                        <option value="All Medical Records & Lab Panels">All Medical Records & Lab Panels</option>
                        <option value="Prescriptions & Active Regimen Only">Prescriptions & Active Regimen Only</option>
                        <option value="Diagnostic Lab Panels Only">Diagnostic Lab Panels Only</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-mist uppercase tracking-wider">Access Duration</label>
                      <select
                        value={grantForm.expiryDays}
                        onChange={(e) => setGrantForm({ ...grantForm, expiryDays: Number(e.target.value) })}
                        className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan font-mono"
                      >
                        <option value={1}>24 Hours</option>
                        <option value={7}>7 Days</option>
                        <option value={30}>30 Days</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button>
                      <Button type="button" onClick={() => setStep(3)} className="flex-1 bg-sapphire text-white font-bold">
                        Review Access <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Review & Confirm */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-frosted border border-slate-200/60 space-y-2">
                      <p><strong className="text-sapphire font-semibold">Physician:</strong> Dr. {grantForm.doctorName}</p>
                      <p><strong className="text-sapphire font-semibold">Scope:</strong> {grantForm.recordsCategory}</p>
                      <p><strong className="text-sapphire font-semibold">Duration:</strong> {grantForm.expiryDays} Days</p>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" onClick={() => setStep(2)} className="flex-1">Back</Button>
                      <Button type="submit" isLoading={submitting} className="flex-1 bg-gradient-to-r from-sapphire to-cyan text-white font-bold shadow-ambient">
                        Confirm & Grant Access
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
