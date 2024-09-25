const LOCAL_CLIENT = 'LOCAL_CLIENT';
const SCREEN_SHARING = 'SCREEN_SHARING';

type PeerMediaElement = {
  client: string;
  stream: MediaStream | null;
};

type PeerConnection = {
  [key: string]: RTCPeerConnection | null;
};

export { LOCAL_CLIENT, SCREEN_SHARING};
export type { PeerConnection, PeerMediaElement };
