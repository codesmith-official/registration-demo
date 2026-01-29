import api from '@/lib/api';

export interface Subject {
  id: number;
  subject: string;
}

export async function fetchAllSubjects(): Promise<Subject[]> {
  const res = await api.get('subjects', {
    params: { limit: 'all' },
  });

  return res.data.data.data;
}
