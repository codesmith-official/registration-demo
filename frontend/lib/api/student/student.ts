import api from '@/lib/api';
import { Student } from './students';

export async function fetchStudent(id: string): Promise<Student> {
  const res = await api.get(`/students/${id}`);
  return res.data.data;
}
