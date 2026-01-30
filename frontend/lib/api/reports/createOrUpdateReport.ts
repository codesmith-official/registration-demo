import api from '@/lib/api';

export interface Marks {
  subject_id: number;
  marks: number;
}

export interface CreateOrUpdateReportPayload {
  student_id: number;
  standard_id: number;
  marks: Marks[];
}

export async function createOrUpdateReport(
  payload: CreateOrUpdateReportPayload,
) {
  const res = await api.post('/marksheets', payload);
  return res.data;
}
