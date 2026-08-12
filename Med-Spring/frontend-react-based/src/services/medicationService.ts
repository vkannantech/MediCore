import api from './api';
import { Medication } from '../types';

export const getMedications = async () => {
  const response = await api.get<Medication[]>('/medications');
  return response.data;
};

export const createMedication = async (data: Omit<Medication, 'id'>) => {
  const response = await api.post<Medication>('/medications', data);
  return response.data;
};

export const updateMedication = async (id: number, data: Partial<Medication>) => {
  const response = await api.put<Medication>(`/medications/${id}`, data);
  return response.data;
};

export const deleteMedication = async (id: number) => {
  const response = await api.delete(`/medications/${id}`);
  return response.data;
};
