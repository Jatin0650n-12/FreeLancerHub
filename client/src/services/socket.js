import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://freelancerhub-backend-edjd.onrender.com"
    : "http://localhost:5001");
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});