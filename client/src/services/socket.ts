import io from 'socket.io-client'

const ACTIONS = {
  JOIN: "JOIN",
  LEAVE: "LEAVE",
  SHARE_ROOMS: "SHARE_ROOMS",
  ADD_PEER: "ADD_PEER",
  REMOVE_PEER: "REMOVE_PEER",
  RELAY_SDP: "RELAY_SDP",
  RELAY_ICE: "RELAY_ICE",
  SESSION_DESCRIPTION: "SESSION_DESCRIPTION",
  ICE_CANDIDATE: "ICE_CANDIDATE",
};


const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"]
}

// @ts-ignore
const socket = io("http://localhost:5000", options)

export { ACTIONS };
export default socket


