import api from '@/lib/api';

export async function deleteStandard(id: number) {
  const res = await api.delete(`/standards/${id}`);
  return res.data;
}
