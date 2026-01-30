'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { LoginSchema } from '@/src/validations/login.schema';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('logout') === '1') {
      toast.success('Logged out successfully');
      router.replace('/auth');
    }

    if (searchParams.get('expired') === '1') {
      toast.error('Session Expired..!!! Please login again.');
      router.replace('/auth');
    }
  }, [router, searchParams]);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const res = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        setSubmitting(false);

        if (res?.error) {
          toast.error('Invalid email or password');
          return;
        }

        toast.success('Login successful!');
        router.push('/admin/dashboard');
      }}
    >
      {({ isSubmitting }) => (
        <Form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <Field
              name='email'
              type='email'
              className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <ErrorMessage
              name='email'
              component='div'
              className='text-sm text-red-600 mt-1'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <Field
              name='password'
              type='password'
              className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <ErrorMessage
              name='password'
              component='div'
              className='text-sm text-red-600 mt-1'
            />
          </div>

          <div className='mt-2'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded disabled:opacity-60'
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
