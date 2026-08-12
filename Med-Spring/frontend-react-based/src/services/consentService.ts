import api from './api';
import { Consent } from '../types';

export const getConsents = async () => {
  const response = await api.get<Consent[]>('/consents');
  return response.data;
};

export const createConsent = async (data: Partial<Consent>) => {
  const response = await api.post<Consent>('/consents', data);
  return response.data;
};

export const revokeConsent = async (id: number) => {
  const response = await api.put<Consent>(`/consents/${id}/revoke`);
  return response.data;
};
