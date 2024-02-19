'use client';
import { useEffect, useRef, useState } from 'react';
// @ts-expect-error there no @types for freeice
import freeice from 'freeice';
import { ACTIONS } from '@/src/contexts/SocketContext';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket } from 'socket.io-client';
import { LOCAL_CLIENT, PeerConnection, PeerMediaElement } from '@/src/types/webRTCType';
import { getUserMedia } from '@/src/utils/mediaUtils';

export default function useWebRTC(
  roomName: string,
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined
) {
  const [peerMediaElements, setPeerMediaElements] = useState<PeerMediaElement[]>([]);

  const peerConnections = useRef<PeerConnection>({});
  const localMediaStream = useRef<MediaStream | null>(null);

  const addNewClient = (newClient: string, stream: MediaStream) => {
    if (newClient && stream) {
      setPeerMediaElements((peerMediaElements) => {
        const isClientAlreadyExists = peerMediaElements.some(({ client }) => client === newClient);
        if (isClientAlreadyExists) {
          // replace old stream with new
          return peerMediaElements.map((client) => {
            if (client.client === newClient) {
              client.stream = stream;
            }
            return client;
          });
        } else {
          return [...peerMediaElements, { client: newClient, stream: stream }];
        }
      });
    }
  };

  const replaceLocalMedia = async () => {
    const newStream = await getUserMedia();
    addNewClient(LOCAL_CLIENT, newStream);
  };

  const handleNewPeer = async ({
    createOffer,
    peerId,
  }: {
    peerId: string;
    createOffer: boolean;
  }) => {
    if (peerId in peerConnections.current) {
      return console.warn(`Already connected to peer ${peerId}`);
    }

    const peerConnection = new RTCPeerConnection({ iceServers: freeice() });
    const localStream = localMediaStream.current;

    peerConnection.onicecandidate = (event) => {
      const iceCandidate = event.candidate;
      if (iceCandidate) {
        socket?.emit(ACTIONS.RELAY_ICE, { peerId, iceCandidate });
      }
    };

    peerConnection.ontrack = ({ streams: [remoteStream] }) => {
      // on track called twice on audio and video
      addNewClient(peerId, remoteStream);
    };

    peerConnections.current[peerId] = peerConnection;

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    } else {
      console.warn('Local stream is none');
    }

    if (createOffer) {
      const offer = await peerConnection.createOffer();

      await peerConnection.setLocalDescription(offer);

      socket?.emit(ACTIONS.RELAY_SDP, {
        peerId,
        sessionDescription: offer,
      });
    }
  };

  const setRemoteMedia = async ({
    peerId,
    sessionDescription: remoteDescription,
  }: {
    peerId: string;
    sessionDescription: RTCSessionDescriptionInit;
  }) => {
    const peerConnection = peerConnections.current[peerId];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription));

      if (remoteDescription.type === 'offer') {
        const answer = await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(answer);

        socket?.emit(ACTIONS.RELAY_SDP, { peerId, sessionDescription: answer });
      }
    } else {
      console.warn('Peer connection is null');
    }
  };

  const handleRemovePeer = async ({ peerId }: { peerId: string }) => {
    const peerConnection = peerConnections.current[peerId];
    peerConnection?.close();

    delete peerConnections.current[peerId];
    setPeerMediaElements((peerMediaElements) => {
      return peerMediaElements.filter((element) => element.client !== peerId);
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
      socket.on(
        ACTIONS.ICE_CANDIDATE,
        ({ peerId, iceCandidate }: { peerId: string; iceCandidate: any }) => {
          const peerConnection = peerConnections.current[peerId];
          void peerConnection?.addIceCandidate(new RTCIceCandidate(iceCandidate));
        }
      );
    }
  }, [socket]);

  useEffect(() => {
    if (socket && roomName) {
      const startCapture = async () => {
        localMediaStream.current = await getUserMedia();

        addNewClient(LOCAL_CLIENT, localMediaStream.current);
      };

      startCapture()
        .then(() => socket.emit(ACTIONS.JOIN, { room: roomName }))
        .catch(() => console.error('Error getting userMedia'));
    }

    return () => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          track.stop();
        });
        socket?.emit(ACTIONS.LEAVE);
      } else {
        console.warn('LocalMediaStream.current empty');
      }
    };
  }, [socket, roomName]);

  return { clientsMedia: peerMediaElements, replaceLocalMedia };
}
