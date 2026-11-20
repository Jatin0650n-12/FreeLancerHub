import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../services/socket';
import { useAuth } from './AuthContext';
import VideoCallModal from '../components/VideoCallModal';

const VideoCallContext = createContext();

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};

export const VideoCallProvider = ({ children }) => {
  const { user } = useAuth();
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [callerInfo, setCallerInfo] = useState(null);

  useEffect(() => {
    if (!user) return;

    const handleIncomingCall = (data) => {
      console.log('[WebRTC] Received incoming call:', data);
      setCallerInfo(data.caller);
      setIncomingOffer(data.offer);
      setProjectId(data.projectId);
      setIsIncomingCall(true);
      setIsCallOpen(true);
    };

    socket.on('webrtc_incoming_call', handleIncomingCall);

    return () => {
      socket.off('webrtc_incoming_call', handleIncomingCall);
    };
  }, [user]);

  const startVideoCall = (recipient, pId = null) => {
    setTargetUser(recipient);
    setProjectId(pId);
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setCallerInfo(null);
    setIsCallOpen(true);
  };

  const closeVideoCall = () => {
    setIsCallOpen(false);
    setTargetUser(null);
    setProjectId(null);
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setCallerInfo(null);
  };

  return (
    <VideoCallContext.Provider value={{ startVideoCall, closeVideoCall }}>
      {children}
      {isCallOpen && (
        <VideoCallModal
          isOpen={isCallOpen}
          onClose={closeVideoCall}
          targetUser={targetUser}
          projectId={projectId}
          isIncomingCall={isIncomingCall}
          incomingOffer={incomingOffer}
          callerInfo={callerInfo}
        />
      )}
    </VideoCallContext.Provider>
  );
};
