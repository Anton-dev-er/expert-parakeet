'use client';
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { LOCAL_CLIENT, PeerMediaElement } from '@/src/types/webRTCType';

interface RoomContextType {
  localMedia: MediaStream | null;
  remoteClientsMedia: PeerMediaElement[];
  populateContext: (clientsMedia: PeerMediaElement[]) => void;
  switchAudioOrVideo: (audio: boolean, video: boolean) => Promise<void>;
}

export const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const RoomContextProvider: FC<{
  children: ReactNode;
  clientsMedia: PeerMediaElement[];
  replaceLocalStream: (audio: boolean, video: boolean) => Promise<void>;
}> = ({ children, clientsMedia, replaceLocalStream }) => {
  const [localMedia, setLocalMedia] = useState<MediaStream | null>(null);
  const [remoteClientsMedia, setRemoteClientsMedia] = useState<PeerMediaElement[]>([]);

  useEffect(() => {
    populateContext(clientsMedia);
  }, [clientsMedia]);

  const populateContext = (clientsMedia: PeerMediaElement[]) => {
    const remoteClients: PeerMediaElement[] = [];
    clientsMedia.forEach((client) => {
      if (client.client === LOCAL_CLIENT) {
        setLocalMedia(client.stream);
      } else {
        remoteClients.push(client);
      }
    });
    setRemoteClientsMedia(remoteClients);
  };

  const switchAudioOrVideo = async (audio: boolean, video: boolean) => {
    // we can not directly enable video track, we need to recreate whole stream
    await replaceLocalStream(audio, video);
  };

  return (
    <RoomContext.Provider
      value={{
        localMedia,
        remoteClientsMedia,
        populateContext,
        switchAudioOrVideo,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
