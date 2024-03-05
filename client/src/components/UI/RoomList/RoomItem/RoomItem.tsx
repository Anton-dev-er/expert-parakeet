import React, { FC } from 'react';
import Card from '@/src/components/UI/Card/Card';
import { RoomResponse } from '@/src/types/response/RoomResponse';
import { roomHref } from '@/src/utils/roomUtils';
import { useRouter } from 'next/navigation';
import styles from './RoomItem.module.scss';

interface Props {
  room: RoomResponse;
}

const RoomItem: FC<Props> = ({ room }) => {
  const { push } = useRouter();

  return (
    <div className={styles.roomItem} onClick={() => push(roomHref(room))}>
      <Card>
        <p>User owner: {room.user.name}</p>
        <p>Room name: {room.name}</p>
      </Card>
    </div>
  );
};

export default RoomItem;
