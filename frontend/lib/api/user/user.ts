import api from '@/lib/api';

export interface UserPermission {
  id: number;
  key: string;
}

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  userType: {
    id: number;
    name: string;
  };
  permissions: UserPermission[];
}

export async function fetchUser(id: string): Promise<UserDetail> {
  const res = await api.get(`/users/${id}`);
  return res.data.data;
}
