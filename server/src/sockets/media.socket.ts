import { Server, Socket } from 'socket.io';
import { IO } from '../types/media.type';
import MediaController from './contollers/media.controller';

const mediaHandler = (io: Server<IO>, socket: Socket<IO>) => {
  console.log('\nsocket - connected, socket:', socket.id);
  const controller = new MediaController(io, socket);
  socket.on('RELAY_YOUTUBE', controller.relayYoutube);
};

export default mediaHandler;
