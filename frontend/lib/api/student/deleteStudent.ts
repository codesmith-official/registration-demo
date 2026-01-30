import api from '@/lib/api';

export async function deleteStudent(id: number) {
  const res = await api.delete(`/students/${id}`);
  return res.data;
}
