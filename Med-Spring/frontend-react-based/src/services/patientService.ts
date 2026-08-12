import api from './api';
import { Patient, HealthSnapshot } from '../types';

export const getPatientProfile = async () => {
  const response = await api.get<Patient>('/patients/me');
  return response.data;
};

export const updatePatientProfile = async (data: Partial<Patient>) => {
  const response = await api.put<Patient>('/patients/me', data);
  return response.data;
};

export const getHealthSnapshot = async () => {
  const response = await api.get<HealthSnapshot>('/health-snapshot');
  return response.data;
};
