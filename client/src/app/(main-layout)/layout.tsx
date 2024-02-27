import React from 'react';
import Sidebar from '@/src/components/common/Sidebar/Sidebar';
import SecondarySidebar from '@/src/components/common/SecondarySidebar/SecondarySidebar';
import styles from './layout.module.scss';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={styles.layout}>
      <Sidebar />
      {children}
      <SecondarySidebar />
    </main>
  );
}
