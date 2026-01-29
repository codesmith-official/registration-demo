'use client';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchMe } from '@/src/store/slices/me.slice';

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);
  const me = useAppSelector((state) => state.me.data);
  const name = me?.name ?? '';
  return (
    <>
      <p className='text-sm text-gray-700 whitespace-nowrap'>Hi, {name}</p>
      <button
        className='w-full bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2 rounded'
        onClick={() => signOut({ callbackUrl: '/auth?logout=1' })}
      >
        Logout
      </button>
    </>
  );
}
