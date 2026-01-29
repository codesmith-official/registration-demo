import api from '@/lib/api';

export interface Permission {
  id: number;
  key: string;
}

export interface UserType {
  id: number;
  name: string;
  permissions: Permission[];
}

export async function fetchAllUserTypes(): Promise<UserType[]> {
  const res = await api.get('user-types', {
    params: { limit: 'all' },
  });

  return res.data.data.data;
}
