export default async function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>Dashboard</h1>
        <p className='mt-1 text-sm text-gray-600'>
          Welcome to the admin panel.
        </p>
      </div>

      <div className='grid grid-cols-3 gap-6'>
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <p className='text-sm text-gray-500'>Users</p>
          <p className='mt-2 text-2xl font-semibold'>—</p>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <p className='text-sm text-gray-500'>Standards</p>
          <p className='mt-2 text-2xl font-semibold'>—</p>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <p className='text-sm text-gray-500'>Reports</p>
          <p className='mt-2 text-2xl font-semibold'>—</p>
        </div>
      </div>
    </div>
  );
}
