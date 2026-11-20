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
    console.log(`[Socket] ✅ A user connected via WebSocket. Total clients: ${io.sockets.sockets.size}`);

    socket.on('authenticate', (userId) => {
        socket.join(userId);
        console.log(`[Socket] User ${userId} authenticated and joined their private room.`);
    });
    
    socket.on('joinProjectRoom', (projectId) => {
      socket.join(projectId);
      console.log(`[Socket] Socket ${socket.id} joined project room ${projectId}`);
    });

    socket.on('leaveProjectRoom', (projectId) => {
      socket.leave(projectId);
      console.log(`[Socket] Socket ${socket.id} left project room ${projectId}`);
    });

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`[Socket] Socket ${socket.id} joined conversation room ${conversationId}`);
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

        io.to(projectId).emit('receiveMessage', populatedMessage);
        console.log(`[Socket] Project message saved and broadcasted to room ${projectId}`);
      } catch (error) {
        console.error('[Socket] Error saving project message:', error);
      }
    });

    // --- WebRTC Video & Screen Sharing Signaling ---
    socket.on('webrtc_call_user', ({ recipientId, projectId, offer, caller }) => {
      console.log(`[WebRTC] Call initiated from ${caller?.name} to recipient ${recipientId}`);
      io.to(recipientId).emit('webrtc_incoming_call', {
        caller,
        projectId,
        offer,
      });
    });

    socket.on('webrtc_answer_call', ({ callerId, answer }) => {
      console.log(`[WebRTC] Call answered for caller ${callerId}`);
      io.to(callerId).emit('webrtc_call_answered', { answer });
    });

    socket.on('webrtc_ice_candidate', ({ targetId, candidate }) => {
      io.to(targetId).emit('webrtc_ice_candidate', { candidate });
    });

    socket.on('webrtc_end_call', ({ targetId }) => {
      console.log(`[WebRTC] Call ended for target ${targetId}`);
      io.to(targetId).emit('webrtc_call_ended');
    });

    socket.on('webrtc_reject_call', ({ callerId }) => {
      console.log(`[WebRTC] Call rejected for caller ${callerId}`);
      io.to(callerId).emit('webrtc_call_rejected');
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] ❌ User disconnected. Total clients: ${io.sockets.sockets.size}`);
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

