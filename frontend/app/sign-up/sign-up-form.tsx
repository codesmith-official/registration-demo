'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { signupApi } from '@/lib/api/auth';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    const name = String(formData.get('name'));
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const role = String(formData.get('role'));

    const result = await signupApi(name, email, password, role);

    setIsLoading(false);

    if (!result || result.error || !result.res?.ok) {
      toast.error(result?.error || 'Signup failed');
      return;
    }

    toast.success('Account Created successfully!');
    redirect('/login');
  }

  return (
    <form className='space-y-4' action={handleSubmit}>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Name</label>
        <input
          className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='name'
          type='name'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Email</label>
        <input
          className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='email'
          type='email'
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
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Role</label>
        <select
          className='mt-1 w-full border rounded px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500'
          name='role'
          required
        >
          <option value='admin'>Admin</option>
          <option value='user'>User</option>
          <option value='viewer'>Viewer</option>
        </select>
      </div>

      <div className='mt-2'>
        <button
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>
      </div>
    </form>
  );
}
