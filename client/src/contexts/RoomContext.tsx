'use client';
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { LOCAL_CLIENT, PeerMediaElement } from '@/src/types/webRTCType';
import { getUserMedia } from '@/src/utils/mediaUtils';

interface RoomContextType {
  localMedia: MediaStream | null;
  remoteClientsMedia: PeerMediaElement[];
  populateContext: (clientsMedia: PeerMediaElement[]) => void;
  enableVideo: () => Promise<void>;
}

export const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const RoomContextProvider: FC<{
  children: ReactNode;
  clientsMedia: PeerMediaElement[];
  replaceLocalMedia: () => Promise<void>;
}> = ({ children, clientsMedia, replaceLocalMedia }) => {
  const [localMedia, setLocalMedia] = useState<MediaStream | null>(null);
  const [remoteClientsMedia, setRemoteClientsMedia] = useState<PeerMediaElement[]>([]);

  useEffect(() => {
    populateContext(clientsMedia);
  }, [clientsMedia]);

  const populateContext = (clientsMedia: PeerMediaElement[]) => {
    clientsMedia.forEach((client) => {
      if (client.client === LOCAL_CLIENT) {
        setLocalMedia(client.stream);
      } else {
        setRemoteClientsMedia((prevState) => [...prevState, client]);
      }
    });
  };

  const enableVideo = async () => {
    // we can not directly enable video track, we need to recreate whole stream
    await replaceLocalMedia();
  };

  return (
    <RoomContext.Provider
      value={{
        localMedia,
        remoteClientsMedia,
        populateContext,
        enableVideo,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
