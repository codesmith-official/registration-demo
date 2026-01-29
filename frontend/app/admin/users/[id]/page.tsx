'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchUser, UserDetail } from '@/lib/api/user/user';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function ViewUserPage() {
  const { setHeader } = usePageHeader();

  const { id } = useParams<{ id: string }>();
  const me = useAppSelector((state) => state.me.data);

  const canView = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.view')
    : false;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canView) return;

    fetchUser(id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [id, canView]);

  useEffect(() => {
    setHeader({
      title: 'View User',
      description: `User details of ${user?.name}`,
    });
  }, [setHeader, user]);

  if (!canView) {
    return (
      <AccessDenied
        title='You can’t view users'
        description='You don’t have permission to view user details.'
      />
    );
  }

  if (loading) {
    return <p className='text-sm text-gray-600'>Loading...</p>;
  }

  if (!user) {
    return <p className='text-sm text-gray-600'>User not found</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
        <div className='flex flex-row-reverse'>
          <Link href={'/admin/users'}>
            <button className='font-small text-blue-600 hover:text-blue-700'>
              Go Back
            </button>
          </Link>
        </div>
        <Field label='Name' value={user.name} />
        <Field label='Email' value={user.email} />
        <Field label='User Type' value={user.userType.name} />

        <div>
          <p className='text-sm font-medium text-gray-700 mb-2'>Permissions</p>
          <div className='flex flex-wrap gap-2'>
            {user.permissions.map((p) => (
              <span
                key={p.id}
                className='px-2 py-1 text-xs bg-gray-300 border rounded'
              >
                {p.key}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className='text-sm font-medium text-gray-900'>{value}</p>
    </div>
  );
}
