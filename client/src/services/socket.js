import { io } from 'socket.io-client';

let SOCKET_URL = import.meta.env.VITE_API_BASE_URL;
if (!SOCKET_URL || (import.meta.env.PROD && SOCKET_URL.includes("localhost"))) {
  SOCKET_URL = "https://freelancerhub-backend-edjd.onrender.com";
}
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});