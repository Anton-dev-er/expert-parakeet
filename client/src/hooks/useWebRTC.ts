'use client';
import { useEffect, useRef, useState } from 'react';
// @ts-expect-error there no @types for freeice
import freeice from 'freeice';
import { ACTIONS } from '@/src/contexts/SocketContext';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket } from 'socket.io-client';
import { LOCAL_CLIENT, PeerConnection, PeerMediaElement, SCREEN_SHARING } from '@/src/types/webRTCType';
import { getDisplayMedia, getUserMedia } from '@/src/utils/mediaUtils';

type HandleNewPeer = {
  peerId: string;
  createOffer: boolean;
};

type SetRemoteMedia = {
  peerId: string;
  sessionDescription: RTCSessionDescriptionInit;
};

type HandleAnswer = {
  peerId: string;
  answer: RTCSessionDescriptionInit;
};

type HandleOffer = {
  peerId: string;
  offer: RTCSessionDescriptionInit;
};

type HandleIceCandidate = {
  peerId: string;
  iceCandidate: RTCIceCandidateInit;
};

export default function useWebRTC(
  roomName: string,
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined
) {
  const [peerMediaElements, setPeerMediaElements] = useState<PeerMediaElement[]>([]);
  const [sender, setSender] = useState<RTCRtpSender | null>(null);

  // todo get rid of useRef
  const peerConnections = useRef<PeerConnection>({});
  const localMediaStream = useRef<MediaStream | null>(null);
  const [screenSharingStream, setScreenSharingStream] = useState<MediaStream | null>(null);

  // todo polite should be first participant, re check it
  let makingOffer = false;
  let ignoreOffer = false;
  const polite = true;

  const addNewClient = (newClient: string, stream: MediaStream | null) => {
    if (newClient) {
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

  const removeClient = (client: string) => {
    setPeerMediaElements((peerMediaElements) => {
      return peerMediaElements.filter((element) => element.client !== client);
    });
  }

  const replaceLocalStream = async (audio: boolean, video: boolean) => {
    const newLocalMedia = await getUserMedia(audio, video);
    localMediaStream.current = newLocalMedia;
    addNewClient(LOCAL_CLIENT, newLocalMedia);
    Object.entries(peerConnections.current).forEach(([peerId, connection]) => {
      if (connection && peerId) {
        if (newLocalMedia) {
          addStreamToConnection(newLocalMedia, connection);
        } else {
          removeStreamFromConnection(connection);
        }
      }
    });
  };

  const replaceScreenSharing = async (screenShareEnabled: boolean) => {
    let newStream: MediaStream | null = null;

    if (screenShareEnabled) {
      newStream = await getDisplayMedia();
      setScreenSharingStream(newStream);
    } else {
      if (screenSharingStream) {
        const tracks = screenSharingStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setScreenSharingStream(null);
    }

    Object.entries(peerConnections.current).forEach(([peerId, connection]) => {
      if (connection && peerId) {
        if (newStream) {
          addStreamToConnection(newStream, connection);
        } else {
          removeStreamFromConnection(connection);
        }
      }
    });
  };

  const addStreamToConnection = (localStream: MediaStream, peerConnection: RTCPeerConnection) => {
    console.log('addStreamToConnection');
    localStream.getTracks().forEach((track) => {
      // trigger onnegotiationneeded
      const sender = peerConnection.addTrack(track, localStream);
      setSender(sender);
    });
  };

  const removeStreamFromConnection = (peerConnection: RTCPeerConnection) => {
    console.log('remove sender:', sender);
    if (sender) {
      peerConnection.removeTrack(sender);
    }
  };

  const handleNewPeer = async ({ createOffer, peerId }: HandleNewPeer) => {
    console.log('handleNewPeer for peerId:', peerId, ', create offer:', createOffer);
    if (peerId in peerConnections.current) {
      return console.warn(`Already connected to peer ${peerId}`);
    }

    const peerConnection = new RTCPeerConnection({ iceServers: freeice() });
    const localStream = localMediaStream.current;

    peerConnection.onicecandidate = (event) => {
      const iceCandidate = event.candidate;
      if (iceCandidate && socket) {
        console.log('send RELAY_ICE');
        socket.emit(ACTIONS.RELAY_ICE, { peerId, iceCandidate });
      }
    };

    peerConnection.ontrack = ({ streams: [remoteStream] }) => {
      // on track called twice on audio and video
      console.log('ontrack then addNewClient');
      addNewClient(peerId, remoteStream);
      remoteStream.onremovetrack = (event) => {
        console.log('on remove track, event:', event);
        addNewClient(peerId, null);
      };
    };
    peerConnections.current[peerId] = peerConnection;

    let offerHandled = false;
    peerConnection.onnegotiationneeded = async (event) => {
      try {
        makingOffer = true;
        if (socket && (createOffer || offerHandled)) {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          console.log('send offer');
          socket.emit(ACTIONS.SEND_OFFER, {
            peerId,
            offer,
          });
        } else {
          console.log('offerHandled');
          offerHandled = true;
        }
      } catch (err) {
        console.error(err);
      } finally {
        makingOffer = false;
      }
      console.log('onnegotiationneeded, creating offer, event:', event);
    };
    if (localStream && peerConnection) {
      addStreamToConnection(localStream, peerConnection);
    }
  };

  const handleRemovePeer = async ({ peerId }: { peerId: string }) => {
    const peerConnection = peerConnections.current[peerId];
    peerConnection?.close();

    delete peerConnections.current[peerId];
    removeClient(peerId);
  };

  const handleAnswer = async ({ peerId, answer }: HandleAnswer) => {
    console.log('accepting answer');
    await setRemoteMedia({ peerId, sessionDescription: answer });
  };

  const handleOffer = async ({ peerId, offer }: HandleOffer) => {
    try {
      console.log('accepting offer', offer.type);
      const peerConnection = peerConnections.current[peerId];
      if (!offer || !peerConnection || !socket) {
        console.log('handleOffer aborted');
        return;
      }

      const offerCollision =
        offer.type === 'offer' && (makingOffer || peerConnection.signalingState !== 'stable');

      ignoreOffer = !polite && offerCollision;
      if (ignoreOffer) {
        console.warn('offer will be ignored');
        return;
      }

      await setRemoteMedia({ peerId, sessionDescription: offer });

      if (offer.type === 'offer') {
        console.log('creating answer, peerId:', peerId);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit(ACTIONS.SEND_ANSWER, { peerId, answer });
        console.log('send answer');
      } else {
        console.warn('offer not valid');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setRemoteMedia = async ({ peerId, sessionDescription }: SetRemoteMedia) => {
    const peerConnection = peerConnections.current[peerId];
    console.log('set remote media, peerConnection:', peerConnection);
    if (peerConnection) {
      // await peerConnection.setRemoteDescription(sessionDescription);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription));
    }
  };

  const handleLeave = () => {
    console.log('use effect, handleLeave', socket?.id);
    if (socket) {
      socket.emit(ACTIONS.LEAVE);
      socket.off(ACTIONS.ADD_PEER);
      socket.off(ACTIONS.REMOVE_PEER);
      socket.off(ACTIONS.OFFER);
      socket.off(ACTIONS.ANSWER);
      socket.off(ACTIONS.ICE_CANDIDATE);

      const localStream = localMediaStream.current;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      } else {
        console.warn('LocalMediaStream.current empty');
      }
    }
  };

  const handleIceCandidate = ({ peerId, iceCandidate }: HandleIceCandidate) => {
    try {
      console.log('received ICE_CANDIDATE');
      const peerConnection = peerConnections.current[peerId];
      void peerConnection?.addIceCandidate(new RTCIceCandidate(iceCandidate));
    } catch (err) {
      console.log('handleIceCandidate, ignoreOffer:', ignoreOffer);
      if (!ignoreOffer) {
        throw err;
      }
    }
  };

  const handleStart = async () => {
    console.log('use effect, handleStart', socket?.id);
    if (socket) {
      socket.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.on(ACTIONS.OFFER, handleOffer);
      socket.on(ACTIONS.ANSWER, handleAnswer);
      socket.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);

      const localStream = await getUserMedia(true, false);
      localMediaStream.current = localStream;
      addNewClient(LOCAL_CLIENT, localStream);
      console.log('emit join');
      socket.emit(ACTIONS.JOIN, { room: roomName });
    }
  };

  useEffect(() => {
    if (socket && roomName) {
      void handleStart();
    }
    return () => {
      handleLeave();
    };
  }, [socket, roomName]);

  return { clientsMedia: peerMediaElements, screenSharingStream, replaceLocalStream, replaceScreenSharing };
}
