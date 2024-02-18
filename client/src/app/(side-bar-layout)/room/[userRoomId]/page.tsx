'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import useWebRTC, { LOCAL_VIDEO } from '@/src/hooks/useWebRTC';
import useSocketContext from '@/src/hooks/useSocketContext';
import useAuthContext from '@/src/hooks/useAuthContext';

const Room = () => {
  const params = useParams<{ userRoomId: string }>();
  const { socket } = useSocketContext();
  const { user } = useAuthContext();
  const { clients, provideMediaRef } = useWebRTC(params?.userRoomId || '', socket);

  console.log('clients:', clients);

  return (
    <div>
      {clients.map((clientId: string) => (
        <div key={clientId}>
          <video
            ref={(instance) => {
              if (instance) {
                provideMediaRef(clientId, instance);
              }
            }}
            autoPlay
            playsInline
            muted={clientId === LOCAL_VIDEO}
          ></video>
        </div>
      ))}
    </div>
  );
};

export default Room;
