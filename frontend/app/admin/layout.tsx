import { requireAuth } from '@/lib/auth-guards';
import { PageHeaderProvider } from '@/src/context/PageHeaderContext';
import Sidebar from './sidebar';
import Topbar from './topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  requireAuth();

  return (
    <PageHeaderProvider>
      <div className='relative flex min-h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Topbar />
          <main className='flex-1 p-6'>{children}</main>
        </div>
      </div>
    </PageHeaderProvider>
  );
}
