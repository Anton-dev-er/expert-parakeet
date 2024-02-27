import RoomDto from '../dtos/room.dto';

interface ServerToClientEvents {
  SHARE_ROOMS: (args: { rooms: RoomDto[] }) => void;
  REMOVE_PEER: (args: { peerId: string }) => void;
  ADD_PEER: (args: { peerId: string; createOffer: boolean }) => void;
  OFFER: (args: { peerId: string; offer: RTCSessionDescriptionInit }) => void;
  ANSWER: (args: { peerId: string; answer: RTCSessionDescriptionInit }) => void;
  ICE_CANDIDATE: (args: { peerId: string; iceCandidate: string }) => void;
}

interface ClientToServerEvents {
  JOIN: (arg: { room: string }) => void;
  LEAVE: () => void;
  SEND_OFFER: (arg: { peerId: string; offer: RTCSessionDescriptionInit }) => void;
  SEND_ANSWER: (arg: { peerId: string; answer: RTCSessionDescriptionInit }) => void;
  RELAY_ICE: (arg: { peerId: string; iceCandidate: string }) => void;
}

interface InterServerEvents {}

interface SocketData {}

interface IO
  extends ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData,
    SocketData {}

export { ServerToClientEvents, ClientToServerEvents, SocketData, InterServerEvents, IO };
