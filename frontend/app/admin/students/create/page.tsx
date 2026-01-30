'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchAllStandards, Standard } from '@/lib/api/standard/standards';
import { createOrUpdateStudent } from '@/lib/api/student/createOrUpdateStudent';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import StudentForm from '@/src/components/StudentForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function CreateStudentPage() {
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      title: 'Create Student',
      description: 'Add a new student to the system',
    });
  }, [setHeader]);

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.create')
    : false;

  const [standards, setStandards] = useState<Standard[]>([]);

  useEffect(() => {
    fetchAllStandards().then(setStandards);
  }, []);

  if (!canCreate) {
    return (
      <AccessDenied
        title="You can't create students"
        description="You don't have permission to create students."
      />
    );
  }

  return (
    <div className='max-w-3xl space-y-6'>
      {
        <StudentForm
          initialValues={{
            first_name: '',
            last_name: '',
            gender: '',
            standard_id: 0,
            email: '',
            password: '',
            contact_number: '',
            bio: '',
          }}
          standards={standards}
          submitLabel='Create User'
          onSubmit={async (values) => {
            console.log('clicked');
            try {
              const res = await createOrUpdateStudent(values);
              toast.success(res.message);
              router.push('/admin/students');
            } catch (err: any) {
              toast.error(err?.response?.data?.message || 'Error');
            }
          }}
        />
      }
    </div>
  );
}
