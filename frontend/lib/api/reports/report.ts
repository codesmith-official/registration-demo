import api from '@/lib/api';
import { Standard, Stundent } from './reports';

export interface Marks {
  subject_id: number;
  subject: string;
  marks: number;
}

export interface ReportDetail {
  id: number;
  student: Stundent;
  standard: Standard;
  percentage: number;
  marks: Marks[];
}

export async function fetchReport(id: string): Promise<ReportDetail> {
  const res = await api.get(`/marksheets/${id}`);
  return res.data.data;
}
