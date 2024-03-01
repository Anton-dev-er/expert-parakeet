import { Server, Socket } from 'socket.io';
import { IO } from '../../types/media.type';
import SocketService from '../services/socket.service';

class MediaController {
  private readonly io: Server<IO>;
  private readonly socket: Socket<IO>;
  private readonly helper: SocketService;

  constructor(io: Server<IO>, socket: Socket<IO>) {
    this.io = io;
    this.socket = socket;
    this.helper = new SocketService(io, socket);
  }

  relayYoutube = ({ roomId, link }) => {
    const clients = this.helper.getClientsByRoomId(roomId);
    console.log('relayYoutube, clienst:', clients);
    clients.forEach((clientId) => {
      this.socket.to(clientId).emit('RELAY_YOUTUBE', {
        link,
        roomId,
      });
    });
  };
}

export default MediaController;
