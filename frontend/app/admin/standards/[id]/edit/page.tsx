'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createOrUpdateStandard } from '@/lib/api/standard/createOrUpdateStandard';
import { fetchStandard } from '@/lib/api/standard/standard';
import { fetchAllSubjects, Subject } from '@/lib/api/subject/subjects';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import StandardForm from '@/src/components/StandardForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function EditStandardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  const canEdit = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.update')
    : false;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!canEdit) return;

    Promise.all([fetchStandard(id), fetchAllSubjects()]).then(
      ([standard, subjects]) => {
        setSubjects(subjects);
        setInitialValues({
          standard: standard.standard,
          subject_ids: standard.subjects.map((p) => p.id),
        });
      },
    );
  }, [id, canEdit]);

  useEffect(() => {
    setHeader({
      title: 'Edit Standard',
      description: `Update ${initialValues?.standard} standard details`,
    });
  }, [setHeader, initialValues]);

  if (!canEdit) {
    return (
      <AccessDenied
        title="You can't edit standards"
        description="You don't have permission to edit standards."
      />
    );
  }

  if (!initialValues) {
    return <p className='text-sm text-gray-600'>Loading...</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <StandardForm
        isEdit
        initialValues={initialValues}
        subjects={subjects}
        submitLabel='Update Standard'
        onSubmit={async (values) => {
          try {
            const payload = { ...values, id: +id };
            const res = await createOrUpdateStandard(payload);
            toast.success(res.message);
            router.push('/admin/standards');
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error');
          }
        }}
      />
    </div>
  );
}
