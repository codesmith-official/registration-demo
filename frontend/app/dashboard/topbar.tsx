import LogoutButton from './logout-button';

export default function TopBar() {
  return (
    <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6'>
      <div>
        <h2 className='text-lg font-semibold text-gray-900'>Dashboard</h2>
        <p className='text-xs text-gray-500'>Overview</p>
      </div>

      <div className='flex items-center gap-4'>
        <LogoutButton />
      </div>
    </header>
  );
}
