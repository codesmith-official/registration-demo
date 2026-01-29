'use client';

import { createContext, useContext, useState } from 'react';

type PageHeader = {
  title: string;
  description?: string;
};

type PageHeaderContextType = {
  header: PageHeader;
  setHeader: (header: PageHeader) => void;
};

const PageHeaderContext = createContext<PageHeaderContextType | null>(null);

export function PageHeaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [header, setHeader] = useState<PageHeader>({
    title: 'Dashboard',
    description: 'Overview',
  });

  return (
    <PageHeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used inside PageHeaderProvider');
  }
  return context;
}
