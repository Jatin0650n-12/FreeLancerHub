import { io } from 'socket.io-client';

let SOCKET_URL = import.meta.env.VITE_API_BASE_URL;
if (!SOCKET_URL || (import.meta.env.PROD && SOCKET_URL.includes("localhost"))) {
  SOCKET_URL = "https://freelancerhub-backend-edjd.onrender.com";
}

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

let currentUserId = null;

export const setSocketUser = (userId) => {
  const uid = userId ? String(userId) : null;
  currentUserId = uid;

  if (uid) {
    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit('authenticate', uid);
    }
  } else {
    if (socket.connected) {
      socket.disconnect();
    }
  }
};

// Automatically re-authenticate on every connect and reconnect
socket.on('connect', () => {
  if (currentUserId) {
    console.log('[Socket] Connected, authenticating user:', currentUserId);
    socket.emit('authenticate', currentUserId);
  }
});

socket.on('reconnect', () => {
  if (currentUserId) {
    console.log('[Socket] Reconnected, re-authenticating user:', currentUserId);
    socket.emit('authenticate', currentUserId);
  }
});
