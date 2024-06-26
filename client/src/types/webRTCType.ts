const LOCAL_CLIENT = 'LOCAL_CLIENT';

type PeerMediaElement = {
  client: string;
  stream: MediaStream | null;
};

type PeerConnection = {
  [key: string]: RTCPeerConnection | null;
};

export { LOCAL_CLIENT };
export type { PeerConnection, PeerMediaElement };
