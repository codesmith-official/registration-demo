import LogoutButton from './logout-button';
import PageTitle from './page-title';

export default function Topbar() {
  return (
    <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6'>
      <PageTitle />
      <div className='flex items-center gap-4'>
        <LogoutButton />
      </div>
    </header>
  );
}
