'use client';
import { useContext } from 'react';
import { RoomContext } from '@/src/contexts/RoomContext';

const useRoomContext = () => useContext(RoomContext);

export default useRoomContext;
