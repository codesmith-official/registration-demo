'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchAllStandards, Standard } from '@/lib/api/standard/standards';
import { createOrUpdateStudent } from '@/lib/api/student/createOrUpdateStudent';
import { fetchStudent } from '@/lib/api/student/student';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import StudentForm from '@/src/components/StudentForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  const canEdit = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.update')
    : false;

  const [standards, setUserTypes] = useState<Standard[]>([]);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!canEdit) return;

    Promise.all([fetchStudent(id), fetchAllStandards()]).then(
      ([student, standards]) => {
        setUserTypes(standards);
        setInitialValues({
          first_name: student.first_name,
          last_name: student.last_name,
          gender: student.gender,
          standard_id: student.standard_id,
          email: student.email,
          password: '',
          contact_number: student.contact_number,
          bio: student.bio,
        });
      },
    );
  }, [id, canEdit]);

  useEffect(() => {
    setHeader({
      title: 'Edit Student',
      description: `Update user details of ${initialValues?.first_name} ${initialValues?.last_name}`,
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
      <StudentForm
        isEdit
        initialValues={initialValues}
        standards={standards}
        submitLabel='Update Student'
        onSubmit={async (values) => {
          try {
            const { password: _, ...rest } = values;
            const payload = { ...rest, id: +id };
            const res = await createOrUpdateStudent(payload);
            toast.success(res.message);
            router.push('/admin/students');
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error');
          }
        }}
      />
    </div>
  );
}
