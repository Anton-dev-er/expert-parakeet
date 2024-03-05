'use client';
import React, { useEffect } from 'react';

import styles from './Room.module.scss';
import Participants from '@/src/components/common/Participants/Participants';
import useRoomContext from '@/src/hooks/useRoomContext';
import SelectMedia from '@/src/components/common/SelectMedia/SelectMedia';
import RoomHistoryService from '@/src/services/RoomHistoryService';
import { useParams } from 'next/navigation';
import useAuthContext from '@/src/hooks/useAuthContext';

const Room = () => {
  const { localClientMedia, remoteClientsMedia } = useRoomContext();
  const { user } = useAuthContext();
  const params = useParams<{ userRoomId: string }>();

  useEffect(() => {
    if (user && params) {
      void RoomHistoryService.save(user.id, params.userRoomId);
    }
  }, [user, params]);

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
