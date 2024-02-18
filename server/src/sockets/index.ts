import { Server, Socket } from 'socket.io';
import { IO } from '../types/webRTC.type';
import webRTCHandler from './webRTC.socket';

export default function onConnection(io: Server<IO>, socket: Socket<IO>) {
  webRTCHandler(io, socket);
  //
  // io.of("/").adapter.on("create-room", (room) => {
  //   console.log(`room ${room} was created`);
  // });
  //
  // io.of("/").adapter.on("join-room", (room, id) => {
  //   console.log(`socket ${id} has joined room ${room}`);
  // });
  //
  // io.of("/").adapter.on("delete-room", (room) => {
  //   console.log(`room ${room} was deleted`);
  // });
  //
  // io.of("/").adapter.on("leave-room", (room, id) => {
  //   console.log(`socket ${id} has left room ${room}`);
  // });
}
