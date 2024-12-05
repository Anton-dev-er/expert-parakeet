import { RoomResponse } from '@/src/types/response/RoomResponse';

const mockRooms: RoomResponse[] = [
  {
    id: '',
    name: '',
    route: '',
    user: {
      id: '',
      name: '',
      isOwner: false,
    },
    isPrivate: false,
  },
];

export {mockRooms};