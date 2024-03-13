import React, { useContext } from 'react';
import Sidebar from '@/src/components/common/Sidebar/Sidebar';
import SecondarySidebar from '@/src/components/common/SecondarySidebar/SecondarySidebar';
import styles from './layout.module.scss';
import Loader from '@/src/components/UI/Loader/Loader';
import { LoaderContextProvider } from '@/src/contexts/LoaderContext';
import useLoaderContext from '@/src/hooks/useLoaderContext';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { isLoading } = useLoaderContext();
  return (
    <main className={styles.layout}>
      <Sidebar />
      <SecondarySidebar />
    </main>
  );
}
