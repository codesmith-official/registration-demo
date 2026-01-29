'use client';

import { usePageHeader } from '@/src/context/PageHeaderContext';

export default function PageTitle() {
  const { header } = usePageHeader();

  return (
    <div>
      <h2 className='text-lg font-semibold text-gray-900'>{header.title}</h2>
      {header.description && (
        <p className='text-xs text-gray-500'>{header.description}</p>
      )}
    </div>
  );
}
