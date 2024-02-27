'use client';
import React from 'react';

import styles from './Room.module.scss';
import Participants from '@/src/components/common/Participants/Participants';
import useRoomContext from '@/src/hooks/useRoomContext';
import Participant from '@/src/components/common/Participants/Participant/Participant';

const Room = () => {
  const { localClientMedia, remoteClientsMedia } = useRoomContext();

  return (
    <div className={styles.room}>
      <Participants clientsMedia={remoteClientsMedia} />
      <div className={styles.localParticipant}>
        <Participant clientMedia={localClientMedia} key={localClientMedia.stream?.id} />
      </div>
    </div>
  );
};

export default Room;
