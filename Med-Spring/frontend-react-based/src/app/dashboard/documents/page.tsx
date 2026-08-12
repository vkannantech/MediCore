'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getDocuments, createDocument, deleteDocument as deleteDocumentApi } from '@/services/documentService';
import { Document } from '@/types';
import { 
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  UploadCloud, 
  Download, 
  Eye, 
  Trash2, 
  X,
  FileCheck,
  Sparkles,
  Search,
  Plus
} from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'LAB_REPORT',
    description: '',
    fileName: ''
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await createDocument({
        name: formData.name,
        type: formData.type,
        description: formData.description || 'Uploaded document',
        fileReference: `uploads/${formData.fileName || formData.name.toLowerCase().replace(/\s+/g, '-') + '.pdf'}`
      });
      await fetchDocuments();
      setIsUploadModalOpen(false);
      setFormData({ name: '', type: 'LAB_REPORT', description: '', fileName: '' });
    } catch (err) {
      console.error('Failed to create document:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDocumentApi(id);
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const getFileIcon = (type: string) => {
    if (type?.includes('IMAGE')) return <ImageIcon className="w-6 h-6 text-cyan" />;
    return <FileText className="w-6 h-6 text-sapphire" />;
  };

  const filteredDocuments = documents.filter(doc => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return doc.name.toLowerCase().includes(q) || 
           doc.description?.toLowerCase().includes(q) ||
           doc.type.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sapphire tracking-tight">Clinical Document Repository</h1>
          <p className="text-mist text-xs md:text-sm font-medium">Encrypted digital file storage for lab scans and diagnostic PDFs</p>
        </div>

        <Button 
          size="lg"
          variant="primary"
          icon={<UploadCloud className="w-5 h-5" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload File
        </Button>
      </div>

      {/* Sonar Search & Filter Bar */}
      <Card className="p-4 bg-white border border-slate-200/60 shadow-ambient flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-mist absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search documents by name, type, or notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-frosted border border-slate-200/60 text-xs font-medium text-slate-charcoal focus:outline-none focus:border-cyan focus:bg-white transition-fluid"
          />
        </div>
        <span className="text-xs font-semibold text-mist font-mono">
          Total Files: {filteredDocuments.length}
        </span>
      </Card>

      {/* Upload Dropzone (Dashed Cyan Border, Frosted Fill, Wave-Shimmer) */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); setIsUploadModalOpen(true); }}
        onClick={() => setIsUploadModalOpen(true)}
        className={`relative cursor-pointer p-10 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4 ${
          dragActive 
            ? 'border-cyan bg-cyan/10 scale-[1.01] shadow-ambient' 
            : 'border-cyan/40 bg-frosted/60 hover:bg-frosted hover:border-cyan/80'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan/10 flex items-center justify-center text-cyan shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-display font-semibold text-sapphire">
            Drag and drop medical files here
          </h3>
          <p className="text-xs text-mist font-medium mt-1">
            Supports PDF, DICOM Imaging, PNG, JPEG up to 25MB (256-Bit Encrypted)
          </p>
        </div>
        <Button size="sm" variant="secondary">
          Browse Computer Files
        </Button>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs font-medium text-mist">Loading vault documents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDocuments.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-ambient space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-frosted flex items-center justify-center mx-auto text-mist">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-semibold text-sapphire">No documents found</h3>
                <p className="text-xs text-mist max-w-sm mx-auto">
                  No medical files match your search criteria. Try a different query or upload a file.
                </p>
              </motion.div>
            ) : (
              filteredDocuments.map(doc => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-5 bg-white border border-slate-200/60 shadow-ambient hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-frosted flex items-center justify-center group-hover:scale-105 transition-transform">
                          {getFileIcon(doc.type)}
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sapphire/10 text-sapphire">
                          {doc.type}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-display font-semibold text-sapphire group-hover:text-cyan transition-colors line-clamp-1">
                          {doc.name}
                        </h4>
                        <p className="text-xs text-mist font-medium mt-1 line-clamp-2">
                          {doc.description || 'Clinical Record File'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                      <span className="text-[10px] font-mono text-mist font-medium">
                        {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'Recent'}
                      </span>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setPreviewDoc(doc)} 
                          title="Preview Document"
                          className="p-2 rounded-xl text-mist hover:text-sapphire hover:bg-frosted transition-fluid"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Downloading ${doc.name}...`)} 
                          title="Download Document"
                          className="p-2 rounded-xl text-mist hover:text-cyan hover:bg-frosted transition-fluid"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)} 
                          title="Delete Document"
                          className="p-2 rounded-xl text-mist hover:text-coral hover:bg-coral/10 transition-fluid"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Document Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sapphire/30 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-display font-semibold text-sapphire">Upload Clinical Document</h3>
                  <p className="text-xs text-mist font-medium">Encrypt & store diagnostic reports in vault</p>
                </div>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 rounded-full text-mist hover:bg-frosted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <Input 
                  label="Document Name / Title"
                  placeholder="e.g. Q3 Lipid Panel Report.pdf"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, fileName: e.target.value })}
                  required
                />

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-mist uppercase tracking-wider">Document Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-13 px-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium text-slate-charcoal focus:outline-none focus:border-cyan"
                  >
                    <option value="LAB_REPORT">Lab Report</option>
                    <option value="IMAGING">Imaging / X-Ray / Scan</option>
                    <option value="PRESCRIPTION">Prescription PDF</option>
                    <option value="OTHER">Insurance / Medical Record</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-mist uppercase tracking-wider">Clinical Description / Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide diagnostic notes or lab details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium text-slate-charcoal focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Save Document
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sapphire/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 max-w-2xl w-full space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-frosted flex items-center justify-center">
                    {getFileIcon(previewDoc.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-sapphire">{previewDoc.name}</h3>
                    <span className="text-[10px] font-mono text-cyan font-bold uppercase">{previewDoc.type}</span>
                  </div>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-full text-mist hover:bg-frosted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 rounded-2xl bg-frosted border border-slate-200/60 text-center space-y-3">
                <FileCheck className="w-12 h-12 text-cyan mx-auto" />
                <h4 className="text-base font-bold text-sapphire">{previewDoc.name}</h4>
                <p className="text-xs text-mist">{previewDoc.description || 'Clinical Record File'}</p>
                <div className="pt-2">
                  <span className="text-xs font-mono bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-charcoal">
                    {previewDoc.fileReference || 'uploads/document.pdf'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setPreviewDoc(null)}>
                  Close
                </Button>
                <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={() => alert(`Downloading ${previewDoc.name}...`)}>
                  Download File
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
