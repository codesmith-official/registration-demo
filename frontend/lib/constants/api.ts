const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is not defined in environment variables',
  );
}

export const API_ENDPOINTS = {
  LOGIN: `${BASE_API}users/login`,
  SIGNUP: `${BASE_API}users/register`,
  ME: `${BASE_API}users/me`,
};
