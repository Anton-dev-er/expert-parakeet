import React, { FC } from 'react';
import { RoomResponse } from '@/src/types/response/RoomResponse';
import RoomItem from '@/src/components/UI/RoomList/RoomItem/RoomItem';
import styles from './RoomList.module.scss';

interface Props {
  rooms: RoomResponse[];
}

const RoomList: FC<Props> = ({ rooms }) => {
  return (
    <div className={styles.roomList}>
      {rooms.map((room) => {
        return <RoomItem key={room.id} room={room} />;
      })}
    </div>
  );
};

export default RoomList;
