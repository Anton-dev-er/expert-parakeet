'use client';
import React from 'react';

import styles from './Room.module.scss';
import Participants from '@/src/components/common/Participants/Participants';
import useRoomContext from '@/src/hooks/useRoomContext';
import { LOCAL_CLIENT } from '@/src/types/webRTCType';

const Room = () => {
  const { localMedia, remoteClientsMedia } = useRoomContext();

  const handleClientMedia = () => {
    return [{ stream: localMedia, client: LOCAL_CLIENT }, ...remoteClientsMedia];
  };

  return (
    <div className={styles.room}>
      <Participants clientsMedia={handleClientMedia()} />
    </div>
  );
};

export default Room;
