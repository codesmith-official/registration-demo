import api from '@/lib/api';

export interface CreateOrUpdateSubjectPayload {
  id?: number;
  subject: string;
}

export async function createOrUpdateSubject(
  payload: CreateOrUpdateSubjectPayload,
) {
  const res = await api.post('/subjects', payload);
  return res.data;
}
