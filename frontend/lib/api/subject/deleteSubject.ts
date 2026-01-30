import api from '@/lib/api';

export async function deleteSubject(id: number) {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
}
