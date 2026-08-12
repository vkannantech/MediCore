'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getMedications } from '@/services/medicationService';
import { Medication } from '@/types';
import { Calendar, Clock, ChevronRight, CheckCircle2, AlertCircle, Plus, Sparkles, X, User } from 'lucide-react';

interface CustomAppointment {
  id: number;
  name: string;
  doctorName?: string;
  followUpDate: string;
  notes?: string;
  isCompleted?: boolean;
}

export default function FollowUpsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [customAppointments, setCustomAppointments] = useState<CustomAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    doctorName: 'Dr. Aris Thorne',
    date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const meds = await getMedications();
      setMedications(meds.filter(m => m.followUpDate));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newAppt: CustomAppointment = {
        id: Date.now(),
        name: formData.title,
        doctorName: formData.doctorName,
        followUpDate: formData.date,
        notes: formData.notes || 'Scheduled via Concierge Portal',
        isCompleted: false
      };
      setCustomAppointments(prev => [newAppt, ...prev]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({
        title: '',
        doctorName: 'Dr. Aris Thorne',
        date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        notes: ''
      });
    }, 500);
  };

  // Combine medication follow-ups + custom appointments
  const allEvents = [
    ...medications.map(m => ({
      id: `med-${m.id}`,
      name: `${m.name} Prescription Review`,
      doctorName: 'Dr. Aris Thorne',
      followUpDate: m.followUpDate!,
      notes: m.instructions
    })),
    ...customAppointments.map(c => ({
      id: `custom-${c.id}`,
      name: c.name,
      doctorName: c.doctorName || 'Dr. Aris Thorne',
      followUpDate: c.followUpDate,
      notes: c.notes
    }))
  ];

  const upcomingFollowUps = allEvents
    .filter(m => new Date(m.followUpDate) >= new Date())
    .sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime());

  const pastFollowUps = allEvents
    .filter(m => new Date(m.followUpDate) < new Date())
    .sort((a, b) => new Date(b.followUpDate).getTime() - new Date(a.followUpDate).getTime());

  const getDaysRemaining = (targetDate: string) => {
    const diffTime = new Date(targetDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `In ${diffDays} Days` : 'Today';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sapphire tracking-tight">Care & Consultation Timeline</h1>
          <p className="text-mist text-xs md:text-sm font-medium">Scheduled follow-up appointments and treatment reviews</p>
        </div>

        <Button 
          size="lg"
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          Schedule Follow-Up
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Vertical Timeline */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Upcoming Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sapphire border-b border-slate-200/60 pb-3">
              <Calendar className="w-5 h-5 text-cyan" />
              <h2 className="text-xl font-display font-semibold">Upcoming Encounters</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-28 rounded-2xl animate-shimmer" />)}
              </div>
            ) : upcomingFollowUps.length === 0 ? (
              <Card className="p-8 bg-white border border-slate-200/60 text-center space-y-3">
                <Calendar className="w-10 h-10 text-mist mx-auto opacity-50" />
                <p className="text-sm font-semibold text-sapphire">No upcoming consultations scheduled</p>
                <p className="text-xs text-mist max-w-sm mx-auto">Your timeline is clear. You can request a follow-up review from your physician anytime.</p>
              </Card>
            ) : (
              <div className="space-y-4 relative pl-6 border-l-2 border-cyan/30">
                {upcomingFollowUps.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <Card hoverable className="p-6 bg-white border border-slate-200/60 shadow-ambient relative">
                      <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-cyan border-4 border-white shadow-sm" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-display font-semibold text-sapphire">{item.name}</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] font-bold font-mono uppercase">
                              {getDaysRemaining(item.followUpDate)}
                            </span>
                          </div>
                          <p className="text-xs text-mist">
                            Scheduled Date: <strong className="text-slate-charcoal font-mono">{new Date(item.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong> • Physician: <span className="text-cyan font-medium">{item.doctorName}</span>
                          </p>
                        </div>

                        <Button variant="secondary" className="text-xs self-end sm:self-center">
                          View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Completed / Past Section */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-mist border-b border-slate-200/60 pb-3">
              <CheckCircle2 className="w-5 h-5 text-eucalyptus" />
              <h2 className="text-xl font-display font-semibold">Completed Encounters</h2>
            </div>

            {pastFollowUps.length === 0 ? (
              <Card className="p-6 bg-frosted/50 border border-slate-200/40 text-xs text-mist text-center">
                No past follow-up history logged yet.
              </Card>
            ) : (
              <div className="space-y-4 relative pl-6 border-l-2 border-eucalyptus/30">
                {pastFollowUps.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="p-5 bg-frosted/60 border border-slate-200/40 relative opacity-85">
                      <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-eucalyptus border-4 border-white" />
                      
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <h3 className="font-display font-semibold text-sapphire text-base">{item.name}</h3>
                          <p className="text-mist">Completed on {new Date(item.followUpDate).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-eucalyptus/15 text-eucalyptus font-bold">COMPLETED</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Rail: Next Follow-Up Hero Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 bg-gradient-to-b from-white via-gold/5 to-white border border-gold/40 shadow-ambient space-y-6">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Next Immediate Appointment</span>
            </div>

            {upcomingFollowUps.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <span className="text-5xl font-display font-bold text-sapphire">
                    {getDaysRemaining(upcomingFollowUps[0].followUpDate)}
                  </span>
                  <p className="text-xs font-mono text-mist mt-1">
                    {new Date(upcomingFollowUps[0].followUpDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gold/30 space-y-1">
                  <p className="text-sm font-bold text-sapphire">{upcomingFollowUps[0].name}</p>
                  <p className="text-xs text-gold font-semibold">Specialist: {upcomingFollowUps[0].doctorName}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <p className="text-sm font-semibold text-sapphire">No Appointments Pending</p>
                <p className="text-xs text-mist">Schedule a consultation with your primary physician.</p>
              </div>
            )}

            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              className="w-full text-xs shadow-ambient py-3"
            >
              Request Special Consultation
            </Button>
          </Card>
        </div>

      </div>

      {/* Schedule Follow-Up Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sapphire/30 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-display font-semibold text-sapphire">Schedule Follow-Up Encounter</h3>
                  <p className="text-xs text-mist font-medium">Book a specialist checkup or regimen review</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full text-mist hover:bg-frosted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <Input 
                  label="Consultation Title / Purpose"
                  placeholder="e.g. Post-Treatment Cardiology Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />

                <Input 
                  label="Attending Physician"
                  placeholder="e.g. Dr. Aris Thorne"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  required
                />

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-mist uppercase tracking-wider">Appointment Date</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full h-13 px-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium text-slate-charcoal focus:outline-none focus:border-cyan"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-mist uppercase tracking-wider">Notes / Symptoms to Discuss</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe any symptoms or topics for the doctor..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium text-slate-charcoal focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Confirm Schedule
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
