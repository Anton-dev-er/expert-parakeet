import React from 'react';
import Sidebar from '@/src/components/common/Sidebar/Sidebar';
import SecondarySidebar from '@/src/components/common/SecondarySidebar/SecondarySidebar';
import styles from '@/src/app/(side-bar-layout)/layout.module.scss';

export default function FullLayout({
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
