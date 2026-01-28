import Sidebar from './sidebar';
import TopBar from './topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <TopBar />
        <main className='flex-1 p-6 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
