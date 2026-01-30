import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth?expired=1');
  return session;
}

export async function checkAuthExists() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/admin/dashboard');
  return;
}
