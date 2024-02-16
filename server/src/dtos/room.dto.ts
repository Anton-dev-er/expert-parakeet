import RoomEntity from "../entities/room.entity";
import UserRoomEntity from "../entities/user-room.entity";
import UserEntity from "../entities/user.entity";

export default class RoomDto {
  id: string;
  name: string;
  route: string;
  user: {
    id: string;
    name: string;
    isOwner: boolean;
  };
  isPrivate: boolean;

  constructor(userRoom: UserRoomEntity) {
    this.id = userRoom.id;
    this.name = userRoom.room.name;
    this.route = userRoom.room.route;
    this.isPrivate = userRoom.room.is_private;
    this.user = {
      id: userRoom.user.id,
      name: userRoom.user.name,
      isOwner: userRoom.is_owner,
    };
  }
}
