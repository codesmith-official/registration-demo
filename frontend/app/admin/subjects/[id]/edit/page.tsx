'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createOrUpdateSubject } from '@/lib/api/subject/createOrUpdateSubject';
import { fetchSubject } from '@/lib/api/subject/subject';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import SubjectForm from '@/src/components/SubjectForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function EditSubjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  const canEdit = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.update')
    : false;

  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!canEdit) return;

    const loadData = async () => {
      const subject = await fetchSubject(id);
      setInitialValues({
        subject: subject.subject,
      });
    };
    loadData();
  }, [id, canEdit]);

  useEffect(() => {
    setHeader({
      title: 'Edit Subject',
      description: `Update ${initialValues?.subject} subject details`,
    });
  }, [setHeader, initialValues]);

  if (!canEdit) {
    return (
      <AccessDenied
        title="You can't edit subjects"
        description="You don't have permission to edit subjects."
      />
    );
  }

  if (!initialValues) {
    return <p className='text-sm text-gray-600'>Loading...</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      {
        <SubjectForm
          isEdit
          initialValues={initialValues}
          submitLabel='Update Subject'
          onSubmit={async (values) => {
            try {
              const payload = { ...values, id: +id };
              const res = await createOrUpdateSubject(payload);
              toast.success(res.message);
              router.push('/admin/subjects');
            } catch (err: any) {
              toast.error(err?.response?.data?.message || 'Error');
            }
          }}
        />
      }
    </div>
  );
}
