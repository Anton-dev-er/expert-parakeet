import {Server, Socket} from "socket.io";
import {IO} from "../types/webRTC.type";
import {validate, version} from "uuid";

// todo move WebRTCHelper to services
class WebRTCHelper {
  private readonly io: Server<IO>;
  private readonly socket: Socket<IO>;

  constructor(io: Server<IO>, socket: Socket<IO>) {
    this.io = io
    this.socket = socket
  }

  getValidClientRooms = (): string[] => {
    // todo
    const {rooms} = this.io.sockets.adapter
    return Array.from(rooms.keys()).filter(roomId => validate(roomId) && version(roomId) === 4)
  }

  getClientsByRoomId = (roomId: string) => {
    return Array.from(this.io.sockets.adapter.rooms.get(roomId) || [])
  }
}

class WebRTCController {
  private readonly io: Server<IO>;
  private readonly socket: Socket<IO>;
  private readonly helper: WebRTCHelper;

  constructor(io: Server<IO>, socket: Socket<IO>) {
    this.io = io
    this.socket = socket
    this.helper = new WebRTCHelper(io, socket)
  }

  shareRoomsInfo = () => {
    const rooms: string[] = this.helper.getValidClientRooms();
    this.io.emit("SHARE_ROOMS", {rooms});
  }

  joinRoom = ({room: roomId}: { room: string }) => {
    const {rooms} = this.socket;

    if (Array.from(rooms).includes(roomId)) {
      return console.warn("Already joined to this room")
    }

    const clients = this.helper.getClientsByRoomId(roomId)

    clients.forEach(clientId => {
      this.socket.to(clientId).emit("ADD_PEER", {peerId: this.socket.id, createOffer: false})

      this.socket.emit("ADD_PEER", {peerId: clientId, createOffer: true})
    })
    this.socket.join(roomId)
    this.shareRoomsInfo()
  }

  leaveRoom = () => {
    const {rooms} = this.socket;

    Array.from(rooms).forEach((roomId: string) => {
      const clients = this.helper.getClientsByRoomId(roomId)

      clients.forEach((clientID) => {
        this.io.to(clientID).emit("REMOVE_PEER", {peerId: this.socket.id})
        this.socket.emit("REMOVE_PEER", {peerId: clientID})
      })

      this.socket.leave(roomId)
    })

    this.shareRoomsInfo()
  }


  relaySDP = ({peerId, sessionDescription}: { peerId: string, sessionDescription: RTCSessionDescriptionInit }) => {
    console.log("sessionDescription:", sessionDescription)
    this.io.to(peerId).emit("SESSION_DESCRIPTION", {peerId: this.socket.id, sessionDescription})
  }

  relayICE = ({peerId, iceCandidate}: { peerId: string, iceCandidate: string }) => {
    this.io.to(peerId).emit("ICE_CANDIDATE", {peerId: this.socket.id, iceCandidate})
  }
}

export default WebRTCController