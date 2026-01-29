import api from '@/lib/api';

export interface Standard {
  id: number;
  standard: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StandardsApiResponse {
  data: Standard[];
  pagination: Pagination;
}

export async function fetchStandards(
  page = 1,
  limit = 10,
): Promise<StandardsApiResponse> {
  const res = await api.get('/standards', {
    params: { page, limit },
  });

  return res.data.data;
}
