import api from '@/lib/api';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  user_type_id: number;
  permissions: number[];
}

export async function updateUser(id: number, payload: CreateUserPayload) {
  const res = await api.patch(`/users/${id}`, payload);
  return res.data;
}
