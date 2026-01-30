import api from '@/lib/api';

export interface Stundent {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Standard {
  id: number;
  standard: string;
}

export interface Report {
  id: number;
  student_id: number;
  standard_id: number;
  percentage: number;
  createdAt: string;
  updatedAt: string;
  student: Stundent;
  standard: Standard;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportsApiResponse {
  data: Report[];
  pagination: Pagination;
}

export async function fetchReports(
  page = 1,
  limit = 10,
): Promise<ReportsApiResponse> {
  const res = await api.get('/marksheets', {
    params: { page, limit },
  });

  return res.data.data;
}
