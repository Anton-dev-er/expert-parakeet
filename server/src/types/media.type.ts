interface ServerToClientEvents {
  RELAY_YOUTUBE: (arg: { roomId: string; link: string }) => void;
}

interface ClientToServerEvents {
  RELAY_YOUTUBE: (arg: { roomId: string; link: string }) => void;
}

interface InterServerEvents {}

interface SocketData {}

interface IO
  extends ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData,
    SocketData {}

export { IO };
