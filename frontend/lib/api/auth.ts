import { API_ENDPOINTS } from '../constants/api';

export async function signupApi(
  name: string,
  email: string,
  password: string,
  role: string,
) {
  let res;
  try {
    res = await fetch(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
      credentials: 'include',
      cache: 'no-store',
    });
  } catch {
    return { error: 'Backend server not reachable' };
  }

  const data = await res.json();
  return { res, data };
}
