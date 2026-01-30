'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchReport, ReportDetail } from '@/lib/api/reports/report';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import ViewField from '@/src/components/ViewField';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function ViewReportPage() {
  const { setHeader } = usePageHeader();

  const { id } = useParams<{ id: string }>();
  const me = useAppSelector((state) => state.me.data);

  const canView = me
    ? hasPermission(me.user_type_id, me.permissions, 'marksheet.view')
    : false;

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canView) return;

    fetchReport(id)
      .then(setReport)
      .finally(() => setLoading(false));
  }, [id, canView]);

  useEffect(() => {
    setHeader({
      title: 'View Report',
      description: `Report details of ${report?.student.first_name} ${report?.student.last_name}`,
    });
  }, [setHeader, report]);

  if (!canView) {
    return (
      <AccessDenied
        title="You can't view reports"
        description="You don't have permission to view report details."
      />
    );
  }

  if (loading) {
    return <p className='text-sm text-gray-600'>Loading...</p>;
  }

  if (!report) {
    return <p className='text-sm text-gray-600'>Report not found</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
        <div className='flex flex-row-reverse'>
          <Link href={'/admin/reports'}>
            <button className='font-small text-blue-600 hover:text-blue-700'>
              Go Back
            </button>
          </Link>
        </div>
        <ViewField
          label='Name'
          value={`${report?.student.first_name} ${report?.student.last_name}`}
        />
        <ViewField label='Standard' value={report?.standard.standard} />
        <ViewField label='Percentage' value={`${report?.percentage} %`} />
        <div>
          <p className='text-sm font-medium text-gray-700 mb-2'>Marks</p>
          {report.marks.map((m) => (
            <p className='mb-1' key={m.subject_id}>
              <span className='text-xs font-black text-gray-500'>
                {m.subject}
              </span>
              :
              <span className='text-sm font-medium text-gray-900 ml-3'>
                {m.marks}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
