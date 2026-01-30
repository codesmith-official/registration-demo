import api from '@/lib/api';

export interface CreateOrUpdateStudentPayload {
  id?: number;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female';
  standard_id: number;
  email: string;
  password?: string;
  contact_number: string;
  bio: string;
}

export async function createOrUpdateStudent(
  payload: CreateOrUpdateStudentPayload,
) {
  const res = await api.post('/students', payload);
  return res.data;
}
