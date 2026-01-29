'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hasPermission } from '@/lib/permissions';
import { useAppDispatch } from '@/src/store/hooks';
import { useAppSelector } from '@/src/store/hooks';
import { fetchMe } from '@/src/store/slices/me.slice';

const SIDEBAR_MENU = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    permission: null,
  },
  {
    label: 'Users',
    href: '/admin/users',
    permission: 'user.list',
  },
  {
    label: 'Standards',
    href: '/admin/standards',
    permission: 'standard.list',
  },
  {
    label: 'Subjects',
    href: '/admin/subjects',
    permission: 'subject.list',
  },
  {
    label: 'Students',
    href: '/admin/students',
    permission: 'student.list',
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    permission: 'marksheet.list',
  },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const pathname = usePathname();

  const me = useAppSelector((state) => state.me.data);
  const loading = useAppSelector((state) => state.me.loading);

  if (loading || !me) return null;

  return (
    <aside className='w-64 bg-white border-r border-gray-200 flex flex-col'>
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <span className='text-lg font-semibold text-gray-900'>Admin Panel</span>
      </div>

      <nav className='flex-1 px-4 py-4'>
        <p className='text-xs font-semibold text-gray-400 uppercase mb-3'>
          Menu
        </p>

        <div className='space-y-1'>
          {SIDEBAR_MENU.filter((item) =>
            hasPermission(me.user_type_id, me.permissions, item.permission),
          ).map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition
              ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
