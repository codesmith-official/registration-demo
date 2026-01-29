import api from '@/lib/api';

export interface UserSubjects {
  id: number;
  subject: string;
}

export interface StandardDetail {
  id: number;
  standard: string;
  subjects: UserSubjects[];
}

export async function fetchStandard(id: string): Promise<StandardDetail> {
  const res = await api.get(`/standards/${id}`);
  return res.data.data;
}
