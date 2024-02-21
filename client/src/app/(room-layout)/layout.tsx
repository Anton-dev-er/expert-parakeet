'use client';
import React from 'react';
import Sidebar from '@/src/components/common/Sidebar/Sidebar';
import styles from './layout.module.scss';
import RoomSidebar from '@/src/components/common/RoomSidebar/RoomSidebar';
import { RoomContextProvider } from '@/src/contexts/RoomContext';
import { useParams } from 'next/navigation';
import useSocketContext from '@/src/hooks/useSocketContext';
import useWebRTC from '@/src/hooks/useWebRTC';

// Is it good to have RoomContextProvider in layout ?
export default function RoomLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ userRoomId: string }>();
  const { socket } = useSocketContext();
  const { clientsMedia, replaceLocalStream } = useWebRTC(params?.userRoomId || '', socket);

  return (
    <main className={styles.layout}>
      <RoomContextProvider clientsMedia={clientsMedia} replaceLocalStream={replaceLocalStream}>
        <Sidebar />
        {children}
        <RoomSidebar />
      </RoomContextProvider>
    </main>
  );
}
