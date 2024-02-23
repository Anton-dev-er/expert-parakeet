import { Server, Socket } from 'socket.io';
import { IO } from '../types/webRTC.type';
import userRoomService from '../services/user-room.service';
import UserRoomEntity from '../entities/user-room.entity';
import RoomDto from '../dtos/room.dto';

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

class WebRTCController {
  private readonly io: Server<IO>;
  private readonly socket: Socket<IO>;
  private readonly helper: WebRTCHelper;
  private roomConnections: { [key: string]: RoomDto } = {};

  constructor(io: Server<IO>, socket: Socket<IO>) {
    this.io = io;
    this.socket = socket;
    this.helper = new WebRTCHelper(io, socket);
    this.shareRoomsInfo();
  }

  async shareRoomsInfo() {
    // const rooms: string[] = await this.helper.getValidClientRooms();
    this.io.emit('SHARE_ROOMS', { rooms: Object.values(this.roomConnections || {}) });
  }

  joinRoom = async ({ room: userRoomId }: { room: string }) => {
    console.log('join room');
    if (!this.socket) {
      console.log('joinRoom, this socket empty, roomId:', userRoomId);
      return;
    }

    const userRoom: UserRoomEntity = await userRoomService.getUserRoomByUserRoomId(userRoomId);
    if (!userRoom) {
      console.log('room doesnt not exists', userRoomId);
      return;
    }

    const clients = this.helper.getClientsByRoomId(userRoomId);
    if (!userRoom.is_owner && clients.length === 0) {
      console.log('user is not owner', userRoomId);
      return;
    }

    this.roomConnections[userRoomId] = new RoomDto(userRoom);

    const { rooms } = this.socket;
    if (Array.from(rooms).includes(userRoomId)) {
      console.warn('Already joined to this room');
      return;
    }

    clients.forEach((clientId) => {
      this.socket.to(clientId).emit('ADD_PEER', { peerId: this.socket.id, createOffer: false });

      this.socket.emit('ADD_PEER', { peerId: clientId, createOffer: true });
    });
    this.socket.join(userRoomId);

    console.log('joined room');

    this.shareRoomsInfo();
  };

  leaveRoom = () => {
    console.log('leave room');
    if (!this.socket) {
      console.log('leaveRoom, this socket empty');
      return;
    }

    const { rooms } = this.socket;

    Array.from(rooms || []).forEach((roomId: string) => {
      const clients = this.helper.getClientsByRoomId(roomId);

      clients.forEach((clientID) => {
        this.io.to(clientID).emit('REMOVE_PEER', { peerId: this.socket.id });
        this.socket.emit('REMOVE_PEER', { peerId: clientID });
      });

      this.socket.leave(roomId);
      if (roomId in this.roomConnections) {
        delete this.roomConnections[roomId];
      }
    });

    console.log('left room');

    this.shareRoomsInfo();
  };

  sendOffer = ({ peerId, offer }: { peerId: string; offer: RTCSessionDescriptionInit }) => {
    this.io.to(peerId).emit('OFFER', {
      peerId: this.socket.id,
      offer,
    });
  };

  sendAnswer = ({ peerId, answer }: { peerId: string; answer: RTCSessionDescriptionInit }) => {
    console.log('sendAnswer');
    this.io.to(peerId).emit('ANSWER', {
      peerId: this.socket.id,
      answer,
    });
  };

  relayICE = ({ peerId, iceCandidate }: { peerId: string; iceCandidate: string }) => {
    this.io.to(peerId).emit('ICE_CANDIDATE', { peerId: this.socket.id, iceCandidate });
  };
}

export default WebRTCController;
