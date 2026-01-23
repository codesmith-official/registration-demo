import { redirect } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/api/user';
import LogoutButton from './logout-button';

export default async function DashboardPage() {
  const user = await fetchCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className='w-full max-w-sm bg-white p-6 rounded-lg shadow-md text-center'>
      <h1 className='text-2xl font-semibold mb-6'>Dashboard</h1>
      <div className='space-y-2 text-gray-700'>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
      <div className='mt-6'>
        <LogoutButton />
      </div>
    </div>
  );
}
