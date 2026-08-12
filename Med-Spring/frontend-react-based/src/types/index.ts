export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export interface Patient {
  id: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  user?: { email: string };
  emergencyContact: string;
  allergies: string;
  importantMedicalNotes: string;
}

export interface MedicalRecord {
  id: number;
  patientId?: number;
  doctorId?: number;
  doctorName?: string;
  date: string;
  type: 'CONSULTATION' | 'LAB_REPORT' | 'PRESCRIPTION' | string;
  diagnosis: string;
  description?: string;
  title?: string;
  recordType?: string;
  recordDate?: string;
  prescription?: string;
  notes?: string;
}

export interface Medication {
  id: number;
  patientId?: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  followUpDate?: string;
  isActive?: boolean;
  active?: boolean;
}

export interface Document {
  id: number;
  patientId?: number;
  name: string;
  type: string;
  uploadDate: string;
  description: string;
  fileReference: string;
}

export interface Consent {
  id: number;
  patientId?: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  doctorSpecialty?: string;
  recordsCategory: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  expiryDate: string;
}

export interface HealthSnapshot {
  activeMedicationsCount: number;
  totalRecordsCount: number;
  latestLabReportDate: string | null;
  knownAllergies: string;
  upcomingFollowUpDate: string | null;
}
