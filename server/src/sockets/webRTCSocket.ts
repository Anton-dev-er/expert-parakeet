import {Server, Socket} from "socket.io";
import {ClientToServerEvents, IO, ServerToClientEvents} from "../types/webRTCtype.ts";
import WebRTCController from "../controllers/webRTCController.ts";


const webRTCHandler = (io: Server<IO>, socket: Socket<IO>) => {
  console.log("socket - connected")
  const controller = new WebRTCController(io, socket)

  socket.on("JOIN", controller.joinRoom)
  socket.on("LEAVE", controller.leaveRoom)

  socket.on("RELAY_SDP", controller.relaySDP)
  socket.on("RELAY_ICE", controller.relayICE)

  socket.on('disconnecting', controller.leaveRoom)
}

export default webRTCHandler;