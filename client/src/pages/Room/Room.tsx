'use client';
import React from 'react';

import styles from './Room.module.scss';
import Participants from '@/src/components/common/Participants/Participants';
import useRoomContext from '@/src/hooks/useRoomContext';
import SelectMedia from '@/src/components/common/SelectMedia/SelectMedia';

const Room = () => {
  const { localClientMedia, remoteClientsMedia } = useRoomContext();

  return (
    <div className={styles.room}>
      <SelectMedia />
      <div className={styles.participants}>
        <Participants clientsMedia={remoteClientsMedia} localMedia={localClientMedia} />
      </div>
    </div>
  );
};

export default Room;
