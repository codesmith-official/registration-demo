interface ViewData {
  label: string;
  value: string;
}

export default function ViewField({ label, value }: ViewData) {
  return (
    <div>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className='text-sm font-medium text-gray-900'>{value}</p>
    </div>
  );
}
