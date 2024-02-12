import RoomEntity from "../entities/room.entity";
import UserRoomEntity from "../entities/user-room.entity";

export default class RoomDto {
  id: string;
  name: string;
  isOwner: boolean;
  isPrivate: boolean;

  constructor(room: RoomEntity, userRoom: UserRoomEntity) {
    this.id = room.id;
    this.name = room.name;
    this.isPrivate = room.is_private;
    this.isOwner = userRoom.is_owner;
  }
}
