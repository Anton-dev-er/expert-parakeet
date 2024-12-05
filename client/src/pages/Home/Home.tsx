'use client';
import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { ACTIONS } from '@/src/contexts/SocketContext';
import useSocketContext from '@/src/hooks/useSocketContext';
import Hero from '@/src/pages/Home/Hero/Hero';
import { RoomResponse } from '@/src/types/response/RoomResponse';
import PublicRooms from '@/src/pages/Home/PublicRooms/PublicRooms';

const Home = () => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] }) => {
        console.log('on SHARE_ROOMS');
        setRooms(rooms);
      });
    }

    return () => {
      socket?.off(ACTIONS.SHARE_ROOMS);
    };
  }, [socket]);

  return (
    <div className={styles.home}>
      <Hero />
      <PublicRooms rooms={rooms}/>
    </div>
  );
};

export default Home;
