'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getMedications, createMedication } from '@/services/medicationService';
import { Medication } from '@/types';
import { Pill, Plus, Clock, Calendar, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily (Morning)',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const data = await getMedications();
      setMedications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createMedication({
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        instructions: formData.instructions,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        isActive: true
      });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'Daily (Morning)',
        instructions: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      fetchMedications();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMedications = medications.filter(m => {
    const isMedActive = m.isActive ?? m.active ?? true;
    if (filter === 'ACTIVE') return isMedActive;
    if (filter === 'COMPLETED') return !isMedActive;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sapphire tracking-tight">Prescription Regimen</h1>
          <p className="text-mist text-xs md:text-sm font-medium">Track dosages, treatment progress, and refill schedules</p>
        </div>

        <Button 
          size="lg"
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Medication
        </Button>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-2">
        {(['ACTIVE', 'COMPLETED', 'ALL'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-fluid ${
              filter === type 
                ? 'bg-sapphire text-white shadow-sm' 
                : 'bg-frosted text-mist hover:text-slate-charcoal'
            }`}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()} Regimen
          </button>
        ))}
      </div>

      {/* Medication Cards Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-36 rounded-2xl animate-shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredMedications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-ambient space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-frosted flex items-center justify-center mx-auto text-mist">
                  <Pill className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-semibold text-sapphire">No medications listed</h3>
                <p className="text-xs text-mist max-w-sm mx-auto">
                  You don't have any prescriptions logged for this filter view. Add a new prescription above.
                </p>
              </motion.div>
            ) : (
              filteredMedications.map(med => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card 
                    hoverable 
                    className={`p-6 border shadow-ambient space-y-5 relative overflow-hidden transition-fluid ${
                      med.isActive 
                        ? 'bg-white border-slate-200/60' 
                        : 'bg-frosted/40 border-slate-200/40 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${
                          med.isActive ? 'bg-cyan/15 text-cyan border-cyan/30' : 'bg-mist/15 text-mist border-mist/30'
                        }`}>
                          <Pill className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-semibold text-sapphire">{med.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2.5 py-0.5 rounded-md bg-frosted border border-slate-200/60 font-mono text-xs font-bold text-sapphire">
                              {med.dosage}
                            </span>
                            <span className="text-xs font-medium text-mist flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan" /> {med.frequency}
                            </span>
                          </div>
                        </div>
                      </div>

                      <StatusBadge status={med.isActive ? 'ACTIVE' : 'COMPLETED'} />
                    </div>

                    <p className="text-xs text-slate-charcoal font-medium leading-relaxed bg-alabaster/60 p-3 rounded-xl border border-slate-200/40">
                      {med.instructions || 'Take strictly according to physician prescription.'}
                    </p>

                    {/* Treatment Duration Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-mist">Treatment Duration</span>
                        <span className="text-sapphire font-mono">75% Complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-frosted overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sapphire to-cyan rounded-full w-[75%]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-mist font-medium">
                      <span>Started: {new Date(med.startDate).toLocaleDateString()}</span>
                      {med.endDate && <span>Ends: {new Date(med.endDate).toLocaleDateString()}</span>}
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ADD MEDICATION MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
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
                  <h3 className="text-xl font-display font-semibold text-sapphire">Log New Prescription</h3>
                  <p className="text-xs text-mist">Add prescription details and daily frequency</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full text-mist hover:bg-frosted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMedication} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-mist uppercase tracking-wider">Medication Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Amoxicillin"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-mist uppercase tracking-wider">Dosage (e.g. 500mg)</label>
                    <input 
                      type="text"
                      required
                      placeholder="500mg"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-mist uppercase tracking-wider">Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                    >
                      <option value="Daily (Morning)">Daily (Morning)</option>
                      <option value="Twice Daily (Morning / Night)">Twice Daily</option>
                      <option value="Every 8 Hours">Every 8 Hours</option>
                      <option value="As Needed (PRN)">As Needed (PRN)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-mist uppercase tracking-wider">Start Date</label>
                    <input 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-mist uppercase tracking-wider">End Date (Optional)</label>
                    <input 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-mist uppercase tracking-wider">Instructions</label>
                  <textarea 
                    rows={2}
                    placeholder="Take with food after meals..."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full p-3 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
                  <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit" isLoading={submitting} className="bg-gradient-to-r from-sapphire to-cyan text-white font-bold">
                    Save Prescription
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
