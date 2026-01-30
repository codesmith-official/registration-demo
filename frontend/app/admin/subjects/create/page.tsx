'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createOrUpdateSubject } from '@/lib/api/subject/createOrUpdateSubject';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import SubjectForm from '@/src/components/SubjectForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function CreateStandardPage() {
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      title: 'Create Subjects',
      description: 'Add a new subject to the system',
    });
  }, [setHeader]);

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'subject.create')
    : false;

  if (!canCreate) {
    return (
      <AccessDenied
        title="You can't create subjects"
        description="You don't have permission to create subjects."
      />
    );
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <SubjectForm
        initialValues={{
          subject: '',
        }}
        submitLabel='Create Subject'
        onSubmit={async (values) => {
          try {
            const res = await createOrUpdateSubject(values);
            toast.success(res.message);
            router.push('/admin/subjects');
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error');
          }
        }}
      />
    </div>
  );
}
