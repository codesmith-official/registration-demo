'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchStandard, StandardDetail } from '@/lib/api/standard/standard';
import { hasPermission } from '@/lib/permissions';
import AccessDenied from '@/src/components/AccessDenied';
import ViewField from '@/src/components/ViewField';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function ViewStandardPage() {
  const { setHeader } = usePageHeader();

  const { id } = useParams<{ id: string }>();
  const me = useAppSelector((state) => state.me.data);

  const canView = me
    ? hasPermission(me.user_type_id, me.permissions, 'standard.view')
    : false;

  const [standard, setStandard] = useState<StandardDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canView) return;

    fetchStandard(id)
      .then(setStandard)
      .finally(() => setLoading(false));
  }, [id, canView]);

  useEffect(() => {
    setHeader({
      title: 'View Standard',
      description: `Standard details of ${standard?.standard}`,
    });
  }, [setHeader, standard]);

  if (!canView) {
    return (
      <AccessDenied
        title="You can't view standards"
        description="You don't have permission to view standard details."
      />
    );
  }

  if (loading) {
    return <p className='text-sm text-gray-600'>Loading...</p>;
  }

  if (!standard) {
    return <p className='text-sm text-gray-600'>Standard not found</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
        <div className='flex flex-row-reverse'>
          <Link href={'/admin/standards'}>
            <button className='font-small text-blue-600 hover:text-blue-700'>
              Go Back
            </button>
          </Link>
        </div>
        <ViewField label='Name' value={standard.standard} />
        {
          <div>
            <p className='text-sm font-medium text-gray-700 mb-2'>Subjects</p>
            <div className='flex flex-wrap gap-2'>
              {standard.subjects.map((p) => (
                <span
                  key={p.id}
                  className='px-2 py-1 text-xs bg-gray-300 border rounded'
                >
                  {p.subject}
                </span>
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
