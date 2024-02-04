import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "./useStateWithCallback";
import socket from "../lib/socket";
import ACTIONS from "../lib/socket/actions";
import freeice from "freeice";

export const LOCAL_VIDEO = "LOCAL_VIDEO";

// todo add types and refactor

export default function useWebRTC(roomId: string) {
  const [clients, updateClients] = useStateWithCallback([]);

  const addNewClient = useCallback(
    (newClient, callback) => {
      if (!clients.includes(newClient)) {
        updateClients((list) => [...list, newClient], callback);
      }
    },
    [clients, updateClients],
  );

  const peerConnections = useRef({});
  const localMediaStream = useRef(null);
  const peerMediaElements = useRef({ [LOCAL_VIDEO]: null });

  useEffect(() => {
    const handleNewPeer = async ({ createOffer, peerId }) => {
      if (peerId in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerId}`);
      }

      peerConnections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      peerConnections.current[peerId].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerId,
            iceCandidate: event.candidate,
          });
        }
      };

      let tracksNumber = 0;
      peerConnections.current[peerId].ontrack = ({
        streams: [remoteStream],
      }) => {
        tracksNumber++;

        // video and audio
        if (tracksNumber === 2) {
          addNewClient(peerId, () => {
            peerMediaElements.current[peerId].srcObject = remoteStream;
          });
        }
      };

      localMediaStream.current.getTracks().forEach((track) => {
        peerConnections.current[peerId].addTrack(
          track,
          localMediaStream.current,
        );
      });

      if (createOffer) {
        const offer = await peerConnections.current[peerId].createOffer();

        await peerConnections.current[peerId].setLocalDescription(offer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);
  }, []);

  useEffect(() => {
    const setRemoteMedia = async ({
      peerId,
      sessionDescription: remoteDescription,
    }) => {
      await peerConnections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteDescription),
      );

      if (remoteDescription.type === "offer") {
        const answer = await peerConnections.current[peerId].createAnswer();

        await peerConnections.current[peerId].setLocalDescription(answer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
  }, []);

  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({ peerId, iceCandidate }) => {
      console.log("iceCandidate:", iceCandidate);
      peerConnections.current[peerId]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate),
      );
    });
  }, []);

  useEffect(() => {
    const handleRemovePeer = async ({ peerId }) => {
      if (peerConnections.current[peerId]) {
        peerConnections.current[peerId].close();
      }

      delete peerConnections.current[peerId];
      delete peerMediaElements.current[peerId];

      updateClients((list) => list.filter((c) => c !== peerId));
    };

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
  }, []);

  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      addNewClient(LOCAL_VIDEO, () => {
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];
        if (localVideoElement) {
          localVideoElement.volume = 0;
          localVideoElement.srcObject = localMediaStream.current;
        }
      });
    };

    startCapture()
      .then(() => socket.emit(ACTIONS.JOIN, { room: roomId }))
      .catch(() => console.error("Error getting userMedia"));

    return () => {
      localMediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      socket.emit(ACTIONS.LEAVE);
    };
  }, [roomId]);

  const provideMediaRef = useCallback((id, node) => {
    console.log("id, node:", id, node);
    peerMediaElements.current[id] = node;
  }, []);

  return { clients, provideMediaRef };
}
