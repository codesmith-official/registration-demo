import api from '@/lib/api';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  user_type_id: number;
  permissions: number[];
}

export async function createUser(payload: CreateUserPayload) {
  const res = await api.post('/users', payload);
  return res.data;
}
