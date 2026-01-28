'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <div className='mt-3'>
      <button
        className='w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded'
        onClick={() => signOut({ callbackUrl: '/?logout=1' })}
      >
        Logout
      </button>
    </div>
  );
}
