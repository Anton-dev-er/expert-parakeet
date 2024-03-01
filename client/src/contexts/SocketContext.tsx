'use client';
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { BASE_URL } from '@/src/utils';

const options = {
  'force new connection': true,
  reconnectionAttempts: 100,
  timeout: 10000,
  transports: ['websocket'],
};
const ACTIONS = {
  JOIN: 'JOIN',
  LEAVE: 'LEAVE',
  SHARE_ROOMS: 'SHARE_ROOMS',
  ADD_PEER: 'ADD_PEER',
  REMOVE_PEER: 'REMOVE_PEER',
  SEND_OFFER: 'SEND_OFFER',
  SEND_ANSWER: 'SEND_ANSWER',
  RELAY_ICE: 'RELAY_ICE',
  RELAY_YOUTUBE: 'RELAY_YOUTUBE',
  OFFER: 'OFFER',
  ANSWER: 'ANSWER',
  ICE_CANDIDATE: 'ICE_CANDIDATE',
};

interface SocketContextType {
  socket: Socket | undefined;
}

export const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const SocketContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (!socket) {
      const connection = io(BASE_URL, options);
      console.log('new connection');
      setSocket(connection);
    }
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ACTIONS };
