import Link from 'next/link';
import SignupForm from '@/app/sign-up/sign-up-form';
import { checkAuthExists } from '@/lib/auth-guards';

export default async function SignupPage() {
  await checkAuthExists();
  return (
    <div className='w-full max-w-sm bg-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-semibold text-center mb-6'>Signup</h1>
      <SignupForm />
      <p className='text-sm text-center mt-4'>
        <Link className='text-blue-600 hover:underline' href={'/login'}>
          Already a member? Click here to Login.
        </Link>
      </p>
    </div>
  );
}
