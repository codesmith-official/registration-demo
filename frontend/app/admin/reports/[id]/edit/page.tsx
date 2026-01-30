'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createOrUpdateReport } from '@/lib/api/reports/createOrUpdateReport'; //
import { fetchReport } from '@/lib/api/reports/report'; //
import { Standard } from '@/lib/api/reports/reports';
import { fetchAllStandards } from '@/lib/api/standard/standards';
import ReportForm from '@/src/components/ReportForm';
import { usePageHeader } from '@/src/context/PageHeaderContext';

export default function EditReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { setHeader } = usePageHeader();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [standards, setStandards] = useState<Standard[]>([]);

  useEffect(() => {
    setHeader({ title: 'Edit Report', description: 'Update student marks' });

    Promise.all([fetchReport(id), fetchAllStandards()]).then(
      ([report, stdList]) => {
        setStandards(stdList);
        setInitialValues({
          standard_id: report.standard.id,
          student_id: report.student.id,
          // Convert array to Record for Formik
          marks: report.marks.reduce((acc: any, m) => {
            acc[m.subject_id] = m.marks;
            return acc;
          }, {}),
        });
      },
    );
  }, [id, setHeader]);

  if (!initialValues) return <p>Loading...</p>;

  return (
    <div className='max-w-3xl'>
      <ReportForm
        isEdit
        standards={standards}
        initialValues={initialValues}
        submitLabel='Update Report'
        onSubmit={async (values) => {
          try {
            const res = await createOrUpdateReport({ ...values, id: +id });
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
