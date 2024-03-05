import { RoomResponse } from '@/src/types/response/RoomResponse';

const roomHref = (room: RoomResponse) => {
  return `/room/${room.route}/${room.id}`;
};

const isValidRoomName = (str: string) => {
  // allowed letter, numbers, spaces and '-', '_'
  const re = /^[a-zA-Z\s0-9_-]*$/;
  return re.test(str);
};

export { roomHref, isValidRoomName };
