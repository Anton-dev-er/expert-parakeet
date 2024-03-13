'use client';

import React, { ReactNode } from 'react';
import Sidebar from '@/src/components/common/Sidebar/Sidebar';
import SecondarySidebar from '@/src/components/common/SecondarySidebar/SecondarySidebar';
import styles from './layout.module.scss';
import Loader from '@/src/components/UI/Loader/Loader';
import { LoaderContextProvider } from '@/src/contexts/LoaderContext';
import useLoaderContext from '@/src/hooks/useLoaderContext';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <LoaderContextProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </LoaderContextProvider>
  );
}

const MainLayoutContent = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoaderContext();

  return (
    <main className={styles.layout}>
      <Sidebar />
      {children}
      <SecondarySidebar />
      {isLoading && <Loader />}
    </main>
  );
};
