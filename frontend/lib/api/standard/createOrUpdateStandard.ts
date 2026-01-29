import api from '@/lib/api';

export interface CreateOrUpdateStandardPayload {
  id?: number;
  standard: string;
  subject_ids: number[];
}

export async function createOrUpdateStandard(
  payload: CreateOrUpdateStandardPayload,
) {
  const res = await api.post('/standards', payload);
  return res.data;
}
