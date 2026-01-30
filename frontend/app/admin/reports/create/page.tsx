'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createOrUpdateReport } from '@/lib/api/reports/createOrUpdateReport'; //
import { Standard } from '@/lib/api/reports/reports';
import { fetchAllStandards } from '@/lib/api/standard/standards';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import ReportForm from '@/src/components/ReportForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function CreateReportPage() {
  const router = useRouter();
  const me = useAppSelector((s) => s.me.data);
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      title: 'Create Report',
      description: 'Enter student marks',
    });
  }, [setHeader]);

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'marksheet.create')
    : false;

  const [standards, setStandards] = useState<Standard[]>([]);
  useEffect(() => {
    fetchAllStandards().then(setStandards);
  }, []);
  if (!canCreate) {
    return (
      <AccessDenied
        title="You can't create reports"
        description="You don't have permission to create reports."
      />
    );
  }

  return (
    <div className='max-w-3xl'>
      <ReportForm
        standards={standards}
        initialValues={{ standard_id: 0, student_id: 0, marks: {} }}
        onSubmit={async (values) => {
          try {
            const res = await createOrUpdateReport(values);
            toast.success(res.message);
            router.push('/admin/reports');
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error');
          }
        }}
      />
    </div>
  );
}
