import api from '@/lib/api';

export interface UserType {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  user_type_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userType: UserType;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersApiResponse {
  data: User[];
  pagination: Pagination;
}

export async function fetchUsers(
  page = 1,
  limit = 10,
): Promise<UsersApiResponse> {
  const res = await api.get('/users', {
    params: { page, limit },
  });

  return res.data.data;
}
