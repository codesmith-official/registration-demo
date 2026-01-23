'use server';

import { requireAuth } from '../auth-guards';
import { API_ENDPOINTS } from '../constants/api';

export async function fetchCurrentUser() {
  const session = await requireAuth();
  if (!session?.accessToken) {
    return null;
  }

  let res;
  try {
    res = await fetch(API_ENDPOINTS.ME, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: 'no-store',
    });
  } catch {
    return null;
  }

  if (!res.ok) {
    return null;
  }

  const { data } = await res.json();
  return data;
}
