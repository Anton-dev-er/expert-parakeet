import React from 'react';
import Sidebar from '@/src/components/common/Sidebar/Sidebar';
import styles from './layout.module.scss';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.layout}>
      <Sidebar />
      {children}
    </main>
  );
}
