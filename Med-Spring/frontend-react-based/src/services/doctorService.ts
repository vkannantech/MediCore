import api from './api';

export interface DoctorProfile {
  id: number;
  userId: number;
  name: string;
  specialty: string;
  phone: string;
}

export const getDoctorProfile = async (): Promise<DoctorProfile> => {
  const response = await api.get<DoctorProfile>('/doctors/me');
  return response.data;
};
