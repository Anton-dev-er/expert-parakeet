import { Server, Socket } from 'socket.io';
import { IO } from '../types/webRTC.type';
import WebRTCController from '../controllers/webRTC.controller';

const webRTCHandler = (io: Server<IO>, socket: Socket<IO>) => {
  console.log('\nsocket - connected, socket:', socket.id);
  const controller = new WebRTCController(io, socket);

  socket.on('JOIN', controller.joinRoom);
  socket.on('LEAVE', controller.leaveRoom);

  socket.on('RELAY_SDP', controller.relaySDP);
  socket.on('RELAY_ICE', controller.relayICE);

  socket.on('disconnecting', controller.leaveRoom);
};

export default webRTCHandler;
