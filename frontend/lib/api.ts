import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    const isLoginRequest = config.url?.includes('users/login');
    if (response && response.status === 401 && !isLoginRequest) {
      await signOut({ redirect: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/auth?expired=1';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
