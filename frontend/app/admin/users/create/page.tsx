'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createUser } from '@/lib/api/user/createUser';
import { fetchAllUserTypes, UserType } from '@/lib/api/userType/userTypes';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import UserForm from '@/src/components/UserForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function CreateUserPage() {
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      title: 'Create User',
      description: 'Add a new user to the system',
    });
  }, [setHeader]);

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.create')
    : false;

  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    fetchAllUserTypes().then(setUserTypes);
  }, []);

  if (!canCreate) {
    return (
      <AccessDenied
        title='You can’t create users'
        description='You don’t have permission to create users.'
      />
    );
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>Create User</h1>
        <p className='text-sm text-gray-600'>Add a new user</p>
      </div>

      <UserForm
        initialValues={{
          name: '',
          email: '',
          password: '',
          user_type_id: 0,
          permissions: [],
        }}
        userTypes={userTypes}
        submitLabel='Create User'
        onSubmit={async (values) => {
          try {
            const res = await createUser(values);
            toast.success(res.message);
            router.push('/admin/users');
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error');
          }
        }}
      />
    </div>
  );
}
