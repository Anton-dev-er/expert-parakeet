import React, { FC } from 'react';
import RoomList from '@/src/components/UI/RoomList/RoomList';
import { RoomResponse } from '@/src/types/response/RoomResponse';

interface Props {
  rooms: RoomResponse[];
}

const PublicRooms: FC<Props> = ({ rooms }) => {
  return (
    <div>
      <h2>Global public rooms</h2>
      {rooms.length ? <RoomList rooms={rooms} /> : <h3>Rooms not found</h3>}
    </div>
  );
};

export default PublicRooms;
