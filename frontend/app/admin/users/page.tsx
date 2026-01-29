'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import { deleteUser } from '@/lib/api/user/deleteUser';
import { fetchUsers, User, Pagination } from '@/lib/api/user/users';
import { hasPermission } from '@/lib/permissions';
import { DeleteConfirmationModal } from '@/src/components/DeleteConfirmationModal';
import { usePageHeader } from '@/src/context/PageHeaderContext';
import { useAppSelector } from '@/src/store/hooks';

export default function UsersPage() {
  const { setHeader } = usePageHeader();
  const router = useRouter();

  useEffect(() => {
    setHeader({
      title: 'Users',
      description: 'Manage system users',
    });
  }, [setHeader]);

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const me = useAppSelector((state) => state.me.data);

  useEffect(() => {
    loadUsers(1);
  }, []);

  const loadUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetchUsers(page, limit);
      setUsers(res.data);
      setPagination(res.pagination);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const canCreate = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.create')
    : false;

  const canView = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.view')
    : false;

  const canEdit = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.update')
    : false;

  const canDelete = me
    ? hasPermission(me.user_type_id, me.permissions, 'user.delete')
    : false;

  const showActionColumn = canView || canEdit || canDelete;

  const columns = useMemo(() => {
    const handleView = (user: User) => {
      router.push(`/admin/users/${user.id}`);
    };

    const handleEdit = (user: User) => {
      router.push(`/admin/users/${user.id}/edit`);
    };

    const handleDelete = async (user: User) => {
      const confirmed = await DeleteConfirmationModal({
        title: 'Delete user?',
        message: `Are you sure you want to delete "<b>${user.name}</b>"?<br/>This action cannot be undone.`,
        confirmText: 'Delete',
      });

      if (!confirmed) return;

      try {
        const res = await deleteUser(user.id);
        toast.success(res.message);
        loadUsers(currentPage);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Delete failed');
      }
    };

    const cols: any[] = [
      {
        name: 'Sr. No.',
        width: '90px',
        cell: (_row: User, index: number) =>
          (currentPage - 1) * limit + index + 1,
      },
      {
        name: 'Name',
        selector: (row: User) => row.name,
        sortable: true,
      },
      {
        name: 'Email',
        selector: (row: User) => row.email,
        sortable: true,
      },
      {
        name: 'User Type',
        selector: (row: User) => row.userType.name,
        sortable: true,
      },
    ];

    if (showActionColumn) {
      cols.push({
        name: 'Action',
        width: '220px',
        cell: (row: User) => (
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
        {canCreate && (
          <Link href={'/admin/users/create'}>
            <button className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700'>
              + Create User
            </button>
          </Link>
        )}
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <DataTable
          columns={columns}
          data={users}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={pagination?.total || 0}
          onChangePage={(page) => loadUsers(page)}
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
}
