'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchStudent } from '@/lib/api/student/student';
import { Student } from '@/lib/api/student/students';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import ViewField from '@/src/components/ViewField';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function ViewStudentPage() {
  const { setHeader } = usePageHeader();

  const { id } = useParams<{ id: string }>();
  const me = useAppSelector((state) => state.me.data);

  const canView = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.view')
    : false;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canView) return;

    fetchStudent(id)
      .then(setStudent)
      .finally(() => setLoading(false));
  }, [id, canView]);

  useEffect(() => {
    setHeader({
      title: 'View Student',
      description: `Student details of ${student?.first_name} ${student?.last_name}`,
    });
  }, [setHeader, student]);

  if (!canView) {
    return (
      <AccessDenied
        title="You can't view students"
        description="You don't have permission to view student details."
      />
    );
  }

  if (loading) {
    return <p className='text-sm text-gray-600'>Loading...</p>;
  }

  if (!student) {
    return <p className='text-sm text-gray-600'>Student not found</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
        <div className='flex flex-row-reverse'>
          <Link href={'/admin/students'}>
            <button className='font-small text-blue-600 hover:text-blue-700'>
              Go Back
            </button>
          </Link>
        </div>
        <ViewField
          label='Name'
          value={`${student.first_name} ${student.last_name}`}
        />
        <ViewField label='Gender' value={student.gender} />
        <ViewField label='Standard' value={student.standard.standard} />
        <ViewField label='Email' value={student.email} />
        <ViewField label='Contact Number' value={student.contact_number} />
        <ViewField label='Bio' value={student.bio} />
      </div>
    </div>
  );
}
