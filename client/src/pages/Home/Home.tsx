'use client';
import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { ACTIONS } from '@/src/contexts/SocketContext';
import useSocketContext from '@/src/hooks/useSocketContext';
import Hero from '@/src/pages/Home/Hero/Hero';
import { RoomResponse } from '@/src/types/response/RoomResponse';
import RoomList from '@/src/components/UI/RoomList/RoomList';

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

      {/*todo separate in component*/}
      <div className={styles.home}>
        <h2>Global public rooms</h2>
        {rooms.length ? <RoomList rooms={rooms} /> : <h3>Rooms not found</h3>}
      </div>
    </div>
  );
};

export default Home;
