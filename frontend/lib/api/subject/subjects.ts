import api from '@/lib/api';

export interface Subject {
  id: number;
  subject: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubjectsApiResponse {
  data: Subject[];
  pagination: Pagination;
}

export async function fetchAllSubjects(): Promise<Subject[]> {
  const res = await api.get('/subjects', {
    params: { limit: 'all' },
  });

  return res.data.data.data;
}

export async function fetchSubjects(
  page = 1,
  limit = 10,
): Promise<SubjectsApiResponse> {
  const res = await api.get('/subjects', {
    params: { page, limit },
  });

  return res.data.data;
}
