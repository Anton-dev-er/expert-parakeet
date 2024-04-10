'use client';
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { LOCAL_CLIENT, PeerMediaElement } from '@/src/types/webRTCType';

interface RoomContextType {
  localClientMedia: PeerMediaElement;
  remoteClientsMedia: PeerMediaElement[];
  screenSharingStream: MediaStream | null;
  switchAudioOrVideo: (audio: boolean, video: boolean) => Promise<void>;
  replaceScreenSharing: (screenShareEnabled: boolean) => Promise<void>;
}

export const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const RoomContextProvider: FC<{
  children: ReactNode;
  clientsMedia: PeerMediaElement[];
  screenSharingStream: MediaStream | null;
  replaceLocalStream: (audio: boolean, video: boolean) => Promise<void>;
  replaceScreenSharing: (screenShareEnabled: boolean) => Promise<void>;
}> = ({
  children,
  clientsMedia,
  screenSharingStream,
  replaceLocalStream,
  replaceScreenSharing,
}) => {
  const [localClientMedia, setLocalClientMedia] = useState<PeerMediaElement>(
    {} as PeerMediaElement
  );
  const [remoteClientsMedia, setRemoteClientsMedia] = useState<PeerMediaElement[]>([]);

  useEffect(() => {
    populateContext(clientsMedia);
  }, [clientsMedia]);

  const populateContext = (clientsMedia: PeerMediaElement[]) => {
    const remoteClients: PeerMediaElement[] = [];
    clientsMedia.forEach((client) => {
      if (client.client === LOCAL_CLIENT) {
        setLocalClientMedia(client);
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
        localClientMedia,
        remoteClientsMedia,
        switchAudioOrVideo,
        replaceScreenSharing,
        screenSharingStream,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
