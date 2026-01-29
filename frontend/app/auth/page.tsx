import LoginForm from '@/app/auth/login-form';
import { checkAuthExists } from '@/lib/auth-guards';

export default async function LoginPage() {
  await checkAuthExists();

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-gray-900'>Admin Login</h1>
          <p className='mt-1 text-sm text-gray-500'>Sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
