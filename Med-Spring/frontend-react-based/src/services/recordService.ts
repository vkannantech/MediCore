import api from './api';
import { MedicalRecord } from '../types';

export const getRecords = async () => {
  const response = await api.get<MedicalRecord[]>('/records');
  return response.data;
};

export const getMedicalRecords = getRecords;

export const createRecord = async (data: Omit<MedicalRecord, 'id'>) => {
  const response = await api.post<MedicalRecord>('/records', data);
  return response.data;
};

export const updateRecord = async (id: number, data: Partial<MedicalRecord>) => {
  const response = await api.put<MedicalRecord>(`/records/${id}`, data);
  return response.data;
};

export const deleteRecord = async (id: number) => {
  const response = await api.delete(`/records/${id}`);
  return response.data;
};
