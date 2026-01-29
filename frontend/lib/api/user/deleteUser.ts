import api from '@/lib/api';

export async function deleteUser(id: number) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}
