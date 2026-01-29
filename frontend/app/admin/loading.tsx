export default function AdminLoading() {
  return (
    <div className='flex items-center justify-center h-[60vh]'>
      <div className='flex items-center gap-3'>
        <div className='h-20 w-20 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900' />
      </div>
    </div>
  );
}
