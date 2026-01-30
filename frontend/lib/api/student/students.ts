import api from '@/lib/api';

export interface Standard {
  id: number;
  standard: string;
}

export interface Student {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  standard_id: number;
  email: string;
  contact_number: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  standard: Standard;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentsApiResponse {
  data: Student[];
  pagination: Pagination;
}

export async function fetchStudents(
  page = 1,
  limit = 10,
): Promise<StudentsApiResponse> {
  const res = await api.get('/students', {
    params: { page, limit },
  });

  return res.data.data;
}
