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

export interface SubjectByStandard {
  id: number;
  standard_id: number;
  subject_id: number;
  subject: Subject;
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

export async function fetchSubjectsByStandard(
  standardId: number,
): Promise<Subject[]> {
  const res = await api.get(`/subjects/standard/${standardId}`);
  return res.data.data.map((item: SubjectByStandard) => item.subject);
}
