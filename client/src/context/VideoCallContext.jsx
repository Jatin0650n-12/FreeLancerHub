import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { socket, setSocketUser } from '../services/socket';
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
  const [initialIceCandidates, setInitialIceCandidates] = useState([]);

  const isCallOpenRef = useRef(false);
  const earlyCandidatesRef = useRef([]);

  useEffect(() => {
    isCallOpenRef.current = isCallOpen;
  }, [isCallOpen]);

  useEffect(() => {
    if (!user?._id) return;

    // Ensure socket is connected and authenticated in user's room
    setSocketUser(user._id);

    const handleIncomingCall = (data) => {
      console.log('[WebRTC] Received incoming call:', data);
      if (isCallOpenRef.current) {
        console.warn('[WebRTC] User already in a call, rejecting new incoming call');
        if (data.caller?._id) {
          socket.emit('webrtc_reject_call', { callerId: String(data.caller._id) });
        }
        return;
      }

      const earlyCand = [...earlyCandidatesRef.current];
      earlyCandidatesRef.current = [];
      setInitialIceCandidates(earlyCand);

      setCallerInfo(data.caller);
      setIncomingOffer(data.offer);
      setProjectId(data.projectId || null);
      setIsIncomingCall(true);
      setIsCallOpen(true);
    };

    const handleEarlyCandidate = ({ candidate }) => {
      if (candidate) {
        earlyCandidatesRef.current.push(candidate);
      }
    };

    socket.on('webrtc_incoming_call', handleIncomingCall);
    socket.on('webrtc_ice_candidate', handleEarlyCandidate);

    return () => {
      socket.off('webrtc_incoming_call', handleIncomingCall);
      socket.off('webrtc_ice_candidate', handleEarlyCandidate);
    };
  }, [user?._id]);

  const startVideoCall = (recipient, pId = null) => {
    if (!recipient) return;
    const normalized =
      typeof recipient === 'object' && recipient !== null
        ? recipient
        : { _id: recipient, name: 'Collaborator' };

    console.log('[WebRTC] Starting call to:', normalized);
    earlyCandidatesRef.current = [];
    setInitialIceCandidates([]);
    setTargetUser(normalized);
    setProjectId(pId);
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setCallerInfo(null);
    setIsCallOpen(true);
  };

  const closeVideoCall = () => {
    earlyCandidatesRef.current = [];
    setInitialIceCandidates([]);
    setIsCallOpen(false);
    setTargetUser(null);
    setProjectId(null);
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setCallerInfo(null);
  };

  const callSessionKey = isIncomingCall
    ? `inc-${callerInfo?._id || 'peer'}-${incomingOffer?.sdp?.length || 0}`
    : `out-${targetUser?._id || 'peer'}`;

  return (
    <VideoCallContext.Provider value={{ startVideoCall, closeVideoCall }}>
      {children}
      {isCallOpen && (
        <VideoCallModal
          key={callSessionKey}
          isOpen={isCallOpen}
          onClose={closeVideoCall}
          targetUser={targetUser}
          projectId={projectId}
          isIncomingCall={isIncomingCall}
          incomingOffer={incomingOffer}
          callerInfo={callerInfo}
          initialIceCandidates={initialIceCandidates}
        />
      )}
    </VideoCallContext.Provider>
  );
};
