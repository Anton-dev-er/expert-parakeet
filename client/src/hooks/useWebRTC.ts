import { useCallback, useEffect, useRef } from 'react'
import useStateWithCallback from './useStateWithCallback'
import socket from '../lib/socket'
import ACTIONS from '../lib/socket/actions'
// @ts-ignore there no @types for freeice
import freeice from 'freeice'

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

type PeerMediaElements = {
  [key: string]: HTMLMediaElement | null
}

type PeerConnections = {
  [key: string]: RTCPeerConnection | null
}

export default function useWebRTC(roomId: string) {
  const [clients, updateClients] = useStateWithCallback([])

  const addNewClient = useCallback(
    (newClient: string, callback: any) => {
      if (!clients.includes(newClient)) {
        updateClients((list: string[]) => [...list, newClient], callback)
      }
    },
    [clients, updateClients]
  )

  const peerConnections = useRef<PeerConnections>({})
  const localMediaStream = useRef<MediaStream | null>(null)
  const peerMediaElements = useRef<PeerMediaElements>({})

  const handleNewPeer = async ({ createOffer, peerId }: { peerId: string; createOffer: boolean }) => {
    if (peerId in peerConnections.current) {
      return console.warn(`Already connected to peer ${peerId}`)
    }

    const peerConnection = new RTCPeerConnection({ iceServers: freeice() })
    const localStream = localMediaStream.current

    peerConnection.onicecandidate = (event) => {
      const iceCandidate = event.candidate
      if (iceCandidate) {
        socket.emit(ACTIONS.RELAY_ICE, { peerId, iceCandidate })
      }
    }

    peerConnection.ontrack = ({ streams: [remoteStream] }) => {
      addNewClient(peerId, () => {
        const peerMediaElement = peerMediaElements.current[peerId]
        if (peerMediaElement) {
          peerMediaElement.srcObject = remoteStream
        }
      })
    }

    peerConnections.current[peerId] = peerConnection

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })
    } else {
      console.warn('Local stream is none')
    }

    if (createOffer) {
      const offer = await peerConnection.createOffer()

      await peerConnection.setLocalDescription(offer)

      socket.emit(ACTIONS.RELAY_SDP, {
        peerId,
        sessionDescription: offer,
      })
    }
  }

  const setRemoteMedia = async ({
    peerId,
    sessionDescription: remoteDescription,
  }: {
    peerId: string
    sessionDescription: RTCSessionDescriptionInit
  }) => {
    const peerConnection = peerConnections.current[peerId]
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription))

      if (remoteDescription.type === 'offer') {
        const answer = await peerConnection.createAnswer()

        await peerConnection.setLocalDescription(answer)

        socket.emit(ACTIONS.RELAY_SDP, { peerId, sessionDescription: answer })
      }
    } else {
      console.warn('Peer connection is null')
    }
  }

  const handleRemovePeer = async ({ peerId }: { peerId: string }) => {
    const peerConnection = peerConnections.current[peerId]
    peerConnection?.close()

    delete peerConnections.current[peerId]
    delete peerMediaElements.current[peerId]

    updateClients((list: string[]) => list.filter((c) => c !== peerId))
  }

  useEffect(() => {
    socket.on(ACTIONS.ADD_PEER, handleNewPeer)
    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer)
    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)
    socket.on(ACTIONS.ICE_CANDIDATE, ({ peerId, iceCandidate }) => {
      console.log('iceCandidate:', iceCandidate)
      const peerConnection = peerConnections.current[peerId]
      void peerConnection?.addIceCandidate(new RTCIceCandidate(iceCandidate))
    })
  }, [])

  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })

      addNewClient(LOCAL_VIDEO, () => {
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO]
        if (localVideoElement) {
          localVideoElement.volume = 0
          localVideoElement.srcObject = localMediaStream.current
        }
      })
    }

    startCapture()
      .then(() => socket.emit(ACTIONS.JOIN, { room: roomId }))
      .catch(() => console.error('Error getting userMedia'))

    return () => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          track.stop()
        })
        socket.emit(ACTIONS.LEAVE)
      } else {
        console.warn('LocalMediaStream.current empty')
      }
    }
  }, [roomId])

  const provideMediaRef = useCallback((id: string, node: HTMLMediaElement) => {
    peerMediaElements.current[id] = node
  }, [])

  return { clients, provideMediaRef }
}
