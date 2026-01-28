'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('logout') === '1') {
      toast.success('Logged out successfully');
      router.replace('/');
    }
  }, [router, searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setIsLoading(false);

    if (res?.error) {
      toast.error('Invalid email or password');
      return;
    }
    toast.success('Login successful!');
    router.push('/dashboard');
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Email</label>
        <input
          className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='email'
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Password
        </label>
        <input
          className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='password'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className='mt-2'>
        <button
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
}
