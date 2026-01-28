'use client';

import DataTable from 'react-data-table-component';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const columns = [
  {
    name: 'ID',
    selector: (row: User) => row.id,
    sortable: true,
    width: '80px',
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
    name: 'Role',
    selector: (row: User) => row.role,
  },
];

const data: User[] = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'super@yopmail.com',
    role: 'Super Admin',
  },
  { id: 2, name: 'Admin', email: 'admin@yopmail.com', role: 'Admin' },
];

export default function UsersPage() {
  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>Users</h1>
        <p className='text-sm text-gray-600'>Manage system users</p>
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
}
