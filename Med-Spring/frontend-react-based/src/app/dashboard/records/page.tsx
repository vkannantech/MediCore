'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getRecords, createRecord } from '@/services/recordService';
import { MedicalRecord } from '@/types';
import { 
  FileText, 
  Plus, 
  Search, 
  Activity, 
  Pill, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  X,
  Stethoscope
} from 'lucide-react';

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    recordType: 'CONSULTATION',
    doctorName: '',
    recordDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRecord({
        title: formData.title || formData.diagnosis || 'Clinical Encounter',
        type: formData.recordType,
        recordType: formData.recordType,
        doctorName: formData.doctorName,
        date: formData.recordDate,
        recordDate: formData.recordDate,
        diagnosis: formData.diagnosis,
        description: formData.notes || formData.diagnosis || 'Clinical Encounter Note',
        prescription: formData.prescription,
        notes: formData.notes
      });
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        recordType: 'CONSULTATION',
        doctorName: '',
        recordDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        prescription: '',
        notes: ''
      });
      fetchRecords();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(r => {
    const typeMatch = filter === 'ALL' || r.type === filter || r.recordType === filter;
    const searchMatch = !searchTerm || 
                        r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && searchMatch;
  });

  const getTypeStyle = (type?: string) => {
    switch (type) {
      case 'LAB_REPORT':
        return { icon: Activity, bg: 'bg-cyan/15 text-cyan border-cyan/30' };
      case 'PRESCRIPTION':
        return { icon: Pill, bg: 'bg-abyssal-teal/15 text-abyssal-teal border-abyssal-teal/30' };
      case 'IMAGING':
        return { icon: Sparkles, bg: 'bg-gold/15 text-gold border-gold/30' };
      default:
        return { icon: Stethoscope, bg: 'bg-sapphire/15 text-sapphire border-sapphire/30' };
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sapphire tracking-tight">Clinical Encounters</h1>
          <p className="text-mist text-xs md:text-sm font-medium">Encrypted diagnostic logs, prescriptions, and lab panels</p>
        </div>

        <Button 
          size="lg"
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Encounter Record
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="p-4 bg-white border border-slate-200/60 shadow-ambient flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Sonar Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-mist absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search diagnosis, physician, lab..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-frosted border border-slate-200/60 text-xs font-medium text-slate-charcoal focus:outline-none focus:border-cyan focus:bg-white transition-fluid"
          />
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'CONSULTATION', label: 'Consultations' },
            { id: 'LAB_REPORT', label: 'Diagnostic Labs' },
            { id: 'PRESCRIPTION', label: 'Prescriptions' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-fluid ${
                filter === item.id 
                  ? 'bg-sapphire text-white shadow-sm' 
                  : 'bg-frosted text-mist hover:text-slate-charcoal'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Record Rows */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-shimmer" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredRecords.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-ambient space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-frosted flex items-center justify-center mx-auto text-mist">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-semibold text-sapphire">No clinical records found</h3>
                <p className="text-xs text-mist max-w-sm mx-auto">
                  Your medical history is clear for this filter. Add your first consultation note or lab report above.
                </p>
              </motion.div>
            ) : (
              filteredRecords.map((record) => {
                const style = getTypeStyle(record.recordType || record.type);
                const IconComponent = style.icon;
                const isExpanded = expandedId === record.id;

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card hoverable className="p-6 bg-white border border-slate-200/60 shadow-ambient space-y-4">
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : record.id)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${style.bg}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-display font-semibold text-sapphire">
                              {record.title || record.diagnosis || 'Clinical Encounter'}
                            </h3>
                            <p className="text-xs text-mist font-medium">
                              {record.doctorName ? `Physician: Dr. ${record.doctorName}` : 'Recorded Log'} • {record.recordDate || (record.date ? new Date(record.date).toLocaleDateString() : 'Recent')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <StatusBadge status="COMPLETED" />
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-mist" /> : <ChevronDown className="w-5 h-5 text-mist" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pt-4 border-t border-slate-200/60 text-xs space-y-3 bg-frosted/40 p-4 rounded-xl"
                          >
                            <p className="text-slate-charcoal"><strong className="text-sapphire font-semibold">Diagnosis:</strong> {record.diagnosis || record.description || 'No detailed diagnosis recorded.'}</p>
                            {record.prescription && <p className="text-slate-charcoal"><strong className="text-sapphire font-semibold">Prescribed Regimen:</strong> {record.prescription}</p>}
                            {record.notes && <p className="text-slate-charcoal"><strong className="text-sapphire font-semibold">Physician Notes:</strong> {record.notes}</p>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ADD RECORD FROSTED MODAL */}
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
                  <h3 className="text-xl font-display font-semibold text-sapphire">Log Clinical Encounter</h3>
                  <p className="text-xs text-mist">Add consultation notes or lab reports</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full text-mist hover:bg-frosted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-mist uppercase tracking-wider">Title / Encounter Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Q3 Metabolic Panel"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-mist uppercase tracking-wider">Record Type</label>
                    <select
                      value={formData.recordType}
                      onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                    >
                      <option value="CONSULTATION">Consultation</option>
                      <option value="LAB_REPORT">Lab Report</option>
                      <option value="PRESCRIPTION">Prescription</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-mist uppercase tracking-wider">Encounter Date</label>
                    <input 
                      type="date"
                      value={formData.recordDate}
                      onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-mist uppercase tracking-wider">Physician / Doctor Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Aris Thorne"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-mist uppercase tracking-wider">Diagnosis / Findings</label>
                  <textarea 
                    rows={2}
                    placeholder="Clinical findings or lab results..."
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full p-3 rounded-xl bg-frosted border border-slate-200/60 text-slate-charcoal focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
                  <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit" isLoading={submitting} className="bg-gradient-to-r from-sapphire to-cyan text-white font-bold">
                    Save Record
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
