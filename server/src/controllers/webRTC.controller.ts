import {Server, Socket} from "socket.io";
import {IO} from "../types/webRTC.type";
import userRoomService from "../services/user-room.service";
import RoomDto from "../dtos/room.dto";

// todo move WebRTCHelper to services
class WebRTCHelper {
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
      const rooms = socket.rooms
      rooms.forEach((room) => {
        if (room !== socket.id) {
          roomNames.push(room);
        }
      })
    });
    return roomNames;
  };

  getClientsByRoomId = (roomId: string) => {
    return Array.from(this.io.sockets.adapter.rooms.get(roomId) || []);
  };
}

class WebRTCController {
  private readonly io: Server<IO>;
  private readonly socket: Socket<IO>;
  private readonly helper: WebRTCHelper;

  constructor(io: Server<IO>, socket: Socket<IO>) {
    this.io = io;
    this.socket = socket;
    this.helper = new WebRTCHelper(io, socket);
    this.shareRoomsInfo();
  }

  async shareRoomsInfo() {
    const rooms: string[] = await this.helper.getValidClientRooms();
    this.io.emit("SHARE_ROOMS", {rooms});
  }

  joinRoom = async ({room: userRoomId}: { room: string }) => {
    console.log("join room:", )
    if (!this.socket) {
      console.log("joinRoom, this socket empty, roomId:", userRoomId);
      return;
    }

    const userRoom = userRoomService.getUserRoomByUserRoomId(userRoomId)
    console.log("userRoomId:", userRoomId)
    if (!userRoom) {
      console.log("room doesnt not exists:", userRoomId);
      return;
    }

    const {rooms} = this.socket;
    if (Array.from(rooms).includes(userRoomId)) {
      console.warn("Already joined to this room");
      return
    }


    const clients = this.helper.getClientsByRoomId(userRoomId);

    clients.forEach((clientId) => {
      this.socket
          .to(clientId)
          .emit("ADD_PEER", {peerId: this.socket.id, createOffer: false});

      this.socket.emit("ADD_PEER", {peerId: clientId, createOffer: true});
    });
    this.socket.join(userRoomId);
    this.shareRoomsInfo();
  };

  leaveRoom = () => {
    if (!this.socket) {
      console.log("leaveRoom, this socket empty");
      return;
    }

    const {rooms} = this.socket;

    Array.from(rooms || []).forEach((roomId: string) => {
      const clients = this.helper.getClientsByRoomId(roomId);

      clients.forEach((clientID) => {
        this.io.to(clientID).emit("REMOVE_PEER", {peerId: this.socket.id});
        this.socket.emit("REMOVE_PEER", {peerId: clientID});
      });

      this.socket.leave(roomId);
    });

    this.shareRoomsInfo();
  };

  relaySDP = ({peerId, sessionDescription}: {
    peerId: string;
    sessionDescription: RTCSessionDescriptionInit;
  }) => {
    this.io.to(peerId).emit("SESSION_DESCRIPTION", {
      peerId: this.socket.id,
      sessionDescription,
    });
  };

  relayICE = ({peerId, iceCandidate}: {
    peerId: string;
    iceCandidate: string;
  }) => {
    this.io
        .to(peerId)
        .emit("ICE_CANDIDATE", {peerId: this.socket.id, iceCandidate});
  };
}

export default WebRTCController;
