import { Server } from 'socket.io';
import Message from './models/Message.js';
import ProjectMessage from './models/ProjectMessage.js';

let io;

export function initSocket(httpServer) {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://freelancerprojecthub.vercel.app"
  ];
  if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
  }

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] ✅ Client connected: ${socket.id}. Total active clients: ${io.sockets.sockets.size}`);

    socket.on('authenticate', (userId) => {
      if (!userId) return;
      const uid = String(userId);
      socket.userId = uid;
      socket.join(uid);
      const roomSize = io.sockets.adapter.rooms.get(uid)?.size || 1;
      console.log(`[Socket] 🔑 User ${uid} authenticated and joined room ${uid}. Sockets in room: ${roomSize}`);
      socket.emit('authenticated', { userId: uid });
    });
    
    socket.on('joinProjectRoom', (projectId) => {
      if (!projectId) return;
      const pid = String(projectId);
      socket.join(pid);
      console.log(`[Socket] Socket ${socket.id} joined project room ${pid}`);
    });

    socket.on('leaveProjectRoom', (projectId) => {
      if (!projectId) return;
      const pid = String(projectId);
      socket.leave(pid);
      console.log(`[Socket] Socket ${socket.id} left project room ${pid}`);
    });

    socket.on('joinConversation', (conversationId) => {
      if (!conversationId) return;
      const cid = String(conversationId);
      socket.join(cid);
      console.log(`[Socket] Socket ${socket.id} joined conversation room ${cid}`);
    });

    socket.on('sendMessage', async ({ projectId, message }) => {
      try {
        const newProjectMessage = new ProjectMessage({
          project: projectId,
          sender: message.sender._id,
          content: message.text,
        });
        await newProjectMessage.save();

        const populatedMessage = {
          ...newProjectMessage.toObject(),
          sender: { _id: message.sender._id, name: message.sender.name }
        };

        io.to(String(projectId)).emit('receiveMessage', populatedMessage);
        console.log(`[Socket] Project message broadcasted to room ${projectId}`);
      } catch (error) {
        console.error('[Socket] Error saving project message:', error);
      }
    });

    // --- WebRTC Video & Screen Sharing Signaling ---
    socket.on('webrtc_call_user', ({ recipientId, projectId, offer, caller }) => {
      if (!recipientId) {
        console.warn('[WebRTC] webrtc_call_user invoked without recipientId');
        return;
      }
      const target = String(recipientId);
      const targetRoom = io.sockets.adapter.rooms.get(target);
      const isOnline = targetRoom && targetRoom.size > 0;
      console.log(`[WebRTC] Call: ${caller?.name} (${caller?._id}) -> ${target}. Target online: ${isOnline} (room size: ${targetRoom?.size || 0})`);
      
      if (!isOnline) {
        socket.emit('webrtc_user_offline', { targetId: target });
      }

      io.to(target).emit('webrtc_incoming_call', {
        caller,
        projectId,
        offer,
      });
    });

    socket.on('webrtc_answer_call', ({ callerId, answer }) => {
      if (!callerId) return;
      const target = String(callerId);
      console.log(`[WebRTC] Call answered for caller ${target}`);
      io.to(target).emit('webrtc_call_answered', { answer });
    });

    socket.on('webrtc_ice_candidate', ({ targetId, candidate }) => {
      if (!targetId || !candidate) return;
      const target = String(targetId);
      io.to(target).emit('webrtc_ice_candidate', { candidate });
    });

    socket.on('webrtc_end_call', ({ targetId }) => {
      if (!targetId) return;
      const target = String(targetId);
      console.log(`[WebRTC] Call ended for target ${target}`);
      io.to(target).emit('webrtc_call_ended');
    });

    socket.on('webrtc_reject_call', ({ callerId }) => {
      if (!callerId) return;
      const target = String(callerId);
      console.log(`[WebRTC] Call rejected for caller ${target}`);
      io.to(target).emit('webrtc_call_rejected');
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] ❌ User disconnected: ${socket.id} (user: ${socket.userId || 'unauthenticated'}). Total clients: ${io.sockets.sockets.size}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
