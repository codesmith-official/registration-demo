'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { updateUser } from '@/lib/api/user/updateUser';
import { fetchUser } from '@/lib/api/user/user';
import { fetchAllUserTypes, UserType } from '@/lib/api/userType/userTypes';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import UserForm from '@/src/components/UserForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  const canEdit = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.update')
    : false;

  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!canEdit) return;

    Promise.all([fetchUser(id), fetchAllUserTypes()]).then(([user, types]) => {
      setUserTypes(types);
      setInitialValues({
        name: user.name,
        email: user.email,
        password: '',
        user_type_id: user.userType.id,
        permissions: user.permissions.map((p) => p.id),
      });
    });
  }, [id, canEdit]);

  useEffect(() => {
    setHeader({
      title: 'Edit User',
      description: `Update user details of ${initialValues?.name}`,
    });
  }, [setHeader, initialValues]);

  if (!canEdit) {
    return (
      <AccessDenied
        title="You can't edit users"
        description="You don't have permission to edit users."
      />
    );
  }

  if (!initialValues) {
    return <p className='text-sm text-gray-600'>Loading...</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <UserForm
        isEdit
        initialValues={initialValues}
        userTypes={userTypes}
        submitLabel='Update User'
        onSubmit={async (values) => {
          try {
            const { password: _, ...payload } = values;
            const res = await updateUser(+id, payload);
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
