import LoginForm from '@/app/login/login-form';
import { checkAuthExists } from '@/lib/auth-guards';

export default async function LoginPage() {
  await checkAuthExists();

  return (
    <div className='w-full max-w-sm bg-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-semibold text-center mb-6'>Login</h1>
      <LoginForm />
    </div>
  );
}
