import api from '@/lib/api';

export interface SubjectDetail {
  id: number;
  subject: string;
}

export async function fetchSubject(id: string): Promise<SubjectDetail> {
  const res = await api.get(`/subjects/${id}`);
  return res.data.data;
}
