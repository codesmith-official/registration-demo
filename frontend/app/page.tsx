import { redirect } from 'next/navigation';
import { checkAuthExists } from '@/lib/auth-guards';

export default async function HomePage() {
  await checkAuthExists();
  redirect('/auth');
}
