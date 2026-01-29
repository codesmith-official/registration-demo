export default function AccessDenied({
  title = 'Access Denied',
  description = 'You do not have permission to view this page.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className='flex items-center justify-center h-[60vh]'>
      <div className='text-center max-w-md'>
        <h1 className='text-2xl font-semibold text-gray-900'>{title}</h1>
        <p className='mt-2 text-sm text-gray-600'>{description}</p>
      </div>
    </div>
  );
}
