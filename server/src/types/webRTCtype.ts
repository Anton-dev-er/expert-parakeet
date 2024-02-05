interface ServerToClientEvents {
  SHARE_ROOMS: (args: { rooms: string[] }) => void;
  REMOVE_PEER: (args: { peerId: string }) => void;
  ADD_PEER: (args: { peerId: string, createOffer: boolean }) => void;
  SESSION_DESCRIPTION: (args: { peerId: string, sessionDescription: RTCSessionDescriptionInit }) => void;
  ICE_CANDIDATE: (args: { peerId: string, iceCandidate: string }) => void;
}


interface ClientToServerEvents {
  JOIN: (arg: { room: string }) => void;
  LEAVE: () => void;
  RELAY_SDP: (arg: { peerId: string, sessionDescription: string }) => void;
  RELAY_ICE: (arg: { peerId: string, iceCandidate: string }) => void;
}

interface InterServerEvents {
}

interface SocketData {

}

interface IO extends ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, SocketData {
}

export {ServerToClientEvents, ClientToServerEvents, SocketData, InterServerEvents, IO}