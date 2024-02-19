import Http from '../http/index';
import { RoomResponse } from '@/src/types/response/RoomResponse';

export default class RoomService {
  static api = new Http('/api/rooms', true);

  static async getUserRooms(userId: string): Promise<RoomResponse[]> {
    return this.api.get(`/${userId}`);
  }

  static async createRoom(
    userId: string,
    roomName: string,
    roomRoute: string,
    isPrivate: boolean,
    isOwner: boolean
  ): Promise<RoomResponse> {
    return this.api.post(`/${userId}`, { roomName, roomRoute, isPrivate, isOwner });
  }
}
