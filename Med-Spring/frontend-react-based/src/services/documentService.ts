import api from './api';
import { Document } from '../types';

export const getDocuments = async () => {
  const response = await api.get<Document[]>('/documents');
  return response.data;
};

export const createDocument = async (data: Omit<Document, 'id' | 'uploadDate'>) => {
  const response = await api.post<Document>('/documents', data);
  return response.data;
};

export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};
