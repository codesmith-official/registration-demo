'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createOrUpdateStandard } from '@/lib/api/standard/createOrUpdateStandard';
import { fetchAllSubjects, Subject } from '@/lib/api/subject/subjects';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import StandardForm from '@/src/components/StandardForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function CreateStandardPage() {
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      title: 'Create Standard',
      description: 'Add a new standard to the system',
    });
  }, [setHeader]);

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'standard.create')
    : false;

  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetchAllSubjects().then(setSubjects);
  }, []);

  if (!canCreate) {
    return (
      <AccessDenied
        title="You can't create standards"
        description="You don't have permission to create standards."
      />
    );
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>
          Create Standard
        </h1>
        <p className='text-sm text-gray-600'>Add a new standard</p>
      </div>

      <StandardForm
        initialValues={{
          standard: '',
          subject_ids: [],
        }}
        subjects={subjects}
        submitLabel='Create Standard'
        onSubmit={async (values) => {
          try {
            const res = await createOrUpdateStandard(values);
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
