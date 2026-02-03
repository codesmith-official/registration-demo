'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import { deleteStudent } from '@/lib/api/student/deleteStudent';
import { exportStudent } from '@/lib/api/student/exportStudent';
import { fetchStudents, Student, Pagination } from '@/lib/api/student/students';
import { hasPermission } from '@/lib/permissions';
import { DeleteConfirmationModal } from '@/src/components/DeleteConfirmationModal';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function StudentsPage() {
  const { setHeader } = usePageHeader();
  const router = useRouter();

  useEffect(() => {
    setHeader({
      title: 'Students',
      description: 'Manage system students',
    });
  }, [setHeader]);

  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const me = useAppSelector((state) => state.me.data);

  useEffect(() => {
    loadStudents(1);
  }, []);

  const loadStudents = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetchStudents(page, limit);
      setStudents(res.data);
      setPagination(res.pagination);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.create')
    : false;

  const canView = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.view')
    : false;

  const canEdit = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.update')
    : false;

  const canDelete = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.delete')
    : false;

  /* const canImport = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.import')
    : false; */

  const canExport = me
    ? hasPermission(me.user_type_id, me.permissions, 'student.export')
    : false;

  const showActionColumn = canView || canEdit || canDelete;

  const handleExport = async () => {
    try {
      toast.loading('Generating export...', { id: 'export-toast' });
      const blob = await exportStudent();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Export started successfully', { id: 'export-toast' });
    } catch (err: any) {
      console.error(err);
      toast.error('Export failed', { id: 'export-toast' });
    }
  };

  const columns = useMemo(() => {
    const handleView = (student: Student) => {
      router.push(`/admin/students/${student.id}`);
    };

    const handleEdit = (student: Student) => {
      router.push(`/admin/students/${student.id}/edit`);
    };

    const handleDelete = async (student: Student) => {
      const confirmed = await DeleteConfirmationModal({
        title: 'Delete student?',
        message: `Are you sure you want to delete "<b>${student.first_name} ${student.last_name}</b>"?<br/>This action cannot be undone.`,
        confirmText: 'Delete',
      });

      if (!confirmed) return;

      try {
        const res = await deleteStudent(student.id);
        toast.success(res.message);
        loadStudents(currentPage);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Delete failed');
      }
    };

    const cols: any[] = [
      {
        name: 'Sr. No.',
        width: '90px',
        cell: (_row: Student, index: number) =>
          (currentPage - 1) * limit + index + 1,
      },
      {
        name: 'Name',
        selector: (row: Student) => `${row.first_name} ${row.last_name}`,
        sortable: true,
      },
      {
        name: 'Email',
        selector: (row: Student) => row.email,
        sortable: true,
      },
      {
        name: 'Gender',
        selector: (row: Student) => row.gender,
        sortable: true,
      },
      {
        name: 'Contact Number',
        selector: (row: Student) => row.contact_number,
        sortable: true,
      },
      {
        name: 'Standard',
        selector: (row: Student) => row.standard.standard,
        sortable: true,
      },
    ];

    if (showActionColumn) {
      cols.push({
        name: 'Action',
        width: '220px',
        cell: (row: Student) => (
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

            {canDelete && (
              <button
                className='px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700'
                onClick={() => handleDelete(row)}
              >
                Delete
              </button>
            )}
          </div>
        ),
      });
    }

    return cols;
  }, [showActionColumn, router, currentPage, canView, canEdit, canDelete]);

  return (
    <div className='space-y-4'>
      <div className='flex flex-row-reverse'>
        {canExport && (
          <Link className='ml-5' href=''>
            <button
              className='px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700'
              onClick={handleExport}
            >
              Export Students
            </button>
          </Link>
        )}
        {canCreate && (
          <Link href={'/admin/students/create'}>
            <button className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700'>
              + Create Student
            </button>
          </Link>
        )}
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <DataTable
          columns={columns}
          data={students}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={pagination?.total || 0}
          onChangePage={(page) => loadStudents(page)}
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
}
