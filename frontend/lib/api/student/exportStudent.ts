import api from '@/lib/api';

export async function exportStudent() {
  const res = await api.get(`/students/export`, {
    responseType: 'blob',
  });
  return res.data;
}
