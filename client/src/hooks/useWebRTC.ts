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
    const handleNewPeer = async ({ createOffer, peerID }) => {
      if (peerID in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerID}`);
      }

      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      peerConnections.current[peerID].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerID,
            iceCandidate: event.candidate,
          });
        }
      };

      let tracksNumber = 0;
      peerConnections.current[peerID].ontrack = ({
        streams: [remoteStream],
      }) => {
        tracksNumber++;

        // video and audio
        if (tracksNumber === 2) {
          addNewClient(peerID, () => {
            peerMediaElements.current[peerID].srcObject = remoteStream;
          });
        }
      };

      localMediaStream.current.getTracks().forEach((track) => {
        peerConnections.current[peerID].addTrack(
          track,
          localMediaStream.current,
        );
      });

      if (createOffer) {
        const offer = await peerConnections.current[peerID].createOffer();

        await peerConnections.current[peerID].setLocalDescription(offer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: offer,
        });
      }
    };

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);
  }, []);

  useEffect(() => {
    const setRemoteMedia = async ({
      peerID,
      sessionDescription: remoteDescription,
    }) => {
      await peerConnections.current[peerID].setRemoteDescription(
        new RTCSessionDescription(remoteDescription),
      );

      if (remoteDescription.type === "offer") {
        const answer = await peerConnections.current[peerID].createAnswer();

        await peerConnections.current[peerID].setLocalDescription(answer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        });
      }
    };

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
  }, []);

  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({ peerID, iceCandidate }) => {
      console.log("iceCandidate:", iceCandidate);
      peerConnections.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate),
      );
    });
  }, []);

  useEffect(() => {
    const handleRemovePeer = async ({ peerID }) => {
      if (peerConnections.current[peerID]) {
        peerConnections.current[peerID].close();
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients((list) => list.filter((c) => c !== peerID));
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
