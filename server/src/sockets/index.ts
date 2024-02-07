import {Server, Socket} from "socket.io";
import {IO} from "../types/webRTC.type";
import webRTCHandler from "./webRTC.socket";

export default function onConnection(io: Server<IO>, socket: Socket<IO>) {
  console.log("socket.handshake.query:", socket.handshake.query)
  webRTCHandler(io, socket)
}