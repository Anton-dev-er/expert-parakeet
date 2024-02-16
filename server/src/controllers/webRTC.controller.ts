import { Server, Socket } from "socket.io";
import { IO } from "../types/webRTC.type";
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

  getValidClientRooms = async (): Promise<RoomDto[]> => {
    const fetchedRooms = (await this.io.fetchSockets()) || [];
    const ids = fetchedRooms.map((room) => room.id);
    console.log("\nfetchSockets rooms:", ids);
    console.log("this.io.of.adapter.rooms:", this.io.of("/").adapter.rooms);

    const roomNames: RoomDto[] = [];
    fetchedRooms.forEach((fetchedRoom) => {
      const data = fetchedRoom.data as RoomDto | null;
      const roomName = data?.name;
      if (roomName) {
        roomNames.push(data);
      }
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
    const rooms: RoomDto[] = await this.helper.getValidClientRooms();
    this.io.emit("SHARE_ROOMS", { rooms });
  }

  joinRoom = async ({ room: userRoomId }: { room: string }) => {
    if (!this.socket) {
      console.log("joinRoom, this socket empty, roomId:", userRoomId);
      return;
    }
    console.log("\nJoining room, socketId:", this.socket.id);
    const { rooms } = this.socket;

    const userRoom = await userRoomService.getUserRoomByUserRoomId(userRoomId);
    this.socket.data = new RoomDto(userRoom);

    if (Array.from(rooms).includes(userRoomId)) {
      return console.warn("Already joined to this room");
    }

    const clients = this.helper.getClientsByRoomId(userRoomId);
    console.log(`clients for ${userRoomId}:`, clients);

    clients.forEach((clientId) => {
      this.socket
        .to(clientId)
        .emit("ADD_PEER", { peerId: this.socket.id, createOffer: false });

      this.socket.emit("ADD_PEER", { peerId: clientId, createOffer: true });
    });
    this.socket.join(userRoomId);
    console.log("room joined socket, userRoomId:", userRoomId, "\n");
    this.shareRoomsInfo();
  };

  leaveRoom = () => {
    if (!this.socket) {
      console.log("leaveRoom, this socket empty");
      return;
    }

    console.log("\nRoom leaving socket, socketId:", this.socket.id);

    const { rooms } = this.socket;

    Array.from(rooms || []).forEach((roomId: string) => {
      const clients = this.helper.getClientsByRoomId(roomId);

      console.log("roomId:", roomId);
      console.log("clients:", clients);

      clients.forEach((clientID) => {
        this.io.to(clientID).emit("REMOVE_PEER", { peerId: this.socket.id });
        this.socket.emit("REMOVE_PEER", { peerId: clientID });
      });

      this.socket.leave(roomId);
      console.log("room left socket, roomId:", roomId, "\n");
    });

    this.shareRoomsInfo();
  };

  relaySDP = ({
    peerId,
    sessionDescription,
  }: {
    peerId: string;
    sessionDescription: RTCSessionDescriptionInit;
  }) => {
    this.io.to(peerId).emit("SESSION_DESCRIPTION", {
      peerId: this.socket.id,
      sessionDescription,
    });
  };

  relayICE = ({
    peerId,
    iceCandidate,
  }: {
    peerId: string;
    iceCandidate: string;
  }) => {
    this.io
      .to(peerId)
      .emit("ICE_CANDIDATE", { peerId: this.socket.id, iceCandidate });
  };
}

export default WebRTCController;
