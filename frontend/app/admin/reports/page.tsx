'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import { fetchReports, Report, Pagination } from '@/lib/api/reports/reports';
import { hasPermission } from '@/lib/permissions';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function ReportsPage() {
  const { setHeader } = usePageHeader();
  const router = useRouter();

  useEffect(() => {
    setHeader({
      title: 'Report',
      description: 'Manage system Report of Students',
    });
  }, [setHeader]);

  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const me = useAppSelector((state) => state.me.data);

  useEffect(() => {
    loadReports(1);
  }, []);

  const loadReports = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetchReports(page, limit);
      setReports(res.data);
      setPagination(res.pagination);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'marksheet.create')
    : false;

  const canView = me
    ? hasPermission(me.user_type_id, me.permissions, 'marksheet.view')
    : false;

  const canEdit = me
    ? hasPermission(me.user_type_id, me.permissions, 'marksheet.update')
    : false;

  const showActionColumn = canView || canEdit;

  const columns = useMemo(() => {
    const handleView = (report: Report) => {
      router.push(`/admin/reports/${report.student_id}`);
    };

    const handleEdit = (report: Report) => {
      router.push(`/admin/reports/${report.student_id}/edit`);
    };

    const cols: any[] = [
      {
        name: 'Sr. No.',
        width: '90px',
        cell: (_row: Report, index: number) =>
          (currentPage - 1) * limit + index + 1,
      },
      {
        name: 'Name',
        selector: (row: Report) =>
          `${row.student.first_name} ${row.student.last_name}`,
        sortable: true,
      },
      {
        name: 'Standard',
        selector: (row: Report) => row.standard.standard,
        sortable: true,
      },
      {
        name: 'Percentage',
        selector: (row: Report) => `${row.percentage} %`,
        sortable: true,
      },
    ];

    if (showActionColumn) {
      cols.push({
        name: 'Action',
        width: '220px',
        cell: (row: Report) => (
          <div className='flex gap-2'>
            {canView && (
              <button
                className='px-3 py-1 text-sm text-white bg-gray-600 rounded hover:bg-gray-700'
                onClick={() => handleView(row)}
              >
                View
              </button>
            )}

            {canEdit && (
              <button
                className='px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700'
                onClick={() => handleEdit(row)}
              >
                Edit
              </button>
            )}
          </div>
        ),
      });
    }

    return cols;
  }, [showActionColumn, router, currentPage, canView, canEdit]);

  return (
    <div className='space-y-4'>
      <div className='flex flex-row-reverse'>
        {canCreate && (
          <Link href={'/admin/reports/create'}>
            <button className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700'>
              + Create Report
            </button>
          </Link>
        )}
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <DataTable
          columns={columns}
          data={reports}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={pagination?.total || 0}
          onChangePage={(page) => loadReports(page)}
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
}
