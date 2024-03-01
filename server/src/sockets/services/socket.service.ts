import { Server, Socket } from 'socket.io';
import { IO } from '../../types/webRTC.type';

class SocketService {
  private readonly io: Server<IO>;
  private readonly socket: Socket<IO>;

  constructor(io: Server<IO>, socket: Socket<IO>) {
    this.io = io;
    this.socket = socket;
  }

  getValidClientRooms = async (): Promise<string[]> => {
    const fetchedSockets = (await this.io.fetchSockets()) || [];

    const roomNames: string[] = [];
    fetchedSockets.forEach((socket) => {
      const rooms = socket.rooms;
      rooms.forEach((room) => {
        if (room !== socket.id) {
          roomNames.push(room);
        }
      });
    });
    return roomNames;
  };

  getClientsByRoomId = (roomId: string) => {
    return Array.from(this.io.sockets.adapter.rooms.get(roomId) || []);
  };
}

export default SocketService;
