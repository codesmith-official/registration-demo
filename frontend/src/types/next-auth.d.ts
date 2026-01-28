import { DefaultSession } from 'next-auth';

export interface UserType {
  id: number;
  name: string;
}

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      name: string;
      userType: UserType;
    };
  };
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userType: UserType;
    } & DefaultSession['user'];
    accessToken: string;
  }

  interface User {
    id: string;
    userType: UserType;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userType: UserType;
    accessToken: string;
  }
}
