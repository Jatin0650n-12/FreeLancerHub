import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Maximize2,
  Minimize2,
  PhoneCall,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

const VideoCallModal = ({
  targetUser,
  projectId,
  isOpen,
  onClose,
  isIncomingCall = false,
  incomingOffer = null,
  callerInfo = null,
}) => {
  const { user } = useAuth();
  const [callStatus, setCallStatus] = useState(isIncomingCall ? 'incoming' : 'calling');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenTrackRef = useRef(null);
  const timerRef = useRef(null);
  const iceCandidatesQueue = useRef([]);

  const targetId = targetUser?._id ? String(targetUser._id) : (targetUser ? String(targetUser) : null);
  const callerId = callerInfo?._id ? String(callerInfo._id) : (callerInfo ? String(callerInfo) : null);
  const peerId = isIncomingCall ? callerId : targetId;

  // Gentle incoming ring chime
  useEffect(() => {
    if (callStatus === 'incoming') {
      let ringInterval;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          const playChime = () => {
            if (audioCtx.state === 'suspended') {
              audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.6);
          };
          playChime();
          ringInterval = setInterval(playChime, 2500);
        }
      } catch (e) {
        // Silently catch audio gesture constraints
      }
      return () => {
        if (ringInterval) clearInterval(ringInterval);
      };
    }
  }, [callStatus]);

  // Call duration counter
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    iceCandidatesQueue.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    setCallStatus('idle');
    setIsScreenSharing(false);
  };

  const endCall = () => {
    if (peerId) {
      socket.emit('webrtc_end_call', { targetId: peerId });
    }
    cleanupCall();
    onClose();
  };

  const rejectCall = () => {
    if (callerId) {
      socket.emit('webrtc_reject_call', { callerId });
    }
    cleanupCall();
    onClose();
  };

  const flushQueuedIceCandidates = async (peer) => {
    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('[WebRTC] Error adding queued ICE candidate:', err);
      }
    }
  };

  // Socket event listeners
  useEffect(() => {
    const handleCallAnswered = async ({ answer }) => {
      console.log('[WebRTC] Remote answered call');
      if (peerRef.current && peerRef.current.signalingState !== 'closed') {
        try {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          await flushQueuedIceCandidates(peerRef.current);
          setCallStatus('connected');
        } catch (err) {
          console.error('[WebRTC] Error setting remote description:', err);
        }
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      if (!candidate) return;
      const peer = peerRef.current;
      if (peer && peer.remoteDescription && peer.remoteDescription.type) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('[WebRTC] Error adding ICE candidate:', err);
        }
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    };

    const handleCallEnded = () => {
      toast.info('The call has ended.');
      cleanupCall();
      onClose();
    };

    const handleCallRejected = () => {
      toast.info('Call declined.');
      cleanupCall();
      onClose();
    };

    const handleUserOffline = () => {
      toast.warning(`${partner?.name || 'User'} is currently offline.`);
      setCallStatus('offline');
    };

    socket.on('webrtc_call_answered', handleCallAnswered);
    socket.on('webrtc_ice_candidate', handleIceCandidate);
    socket.on('webrtc_call_ended', handleCallEnded);
    socket.on('webrtc_call_rejected', handleCallRejected);
    socket.on('webrtc_user_offline', handleUserOffline);

    return () => {
      socket.off('webrtc_call_answered', handleCallAnswered);
      socket.off('webrtc_ice_candidate', handleIceCandidate);
      socket.off('webrtc_call_ended', handleCallEnded);
      socket.off('webrtc_call_rejected', handleCallRejected);
      socket.off('webrtc_user_offline', handleUserOffline);
    };
  }, [onClose, partner?.name]);

  // Initiate Outgoing Call
  useEffect(() => {
    if (!isOpen || isIncomingCall || !targetId) return;

    const startCall = async () => {
      try {
        setCallStatus('calling');
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        } catch (camErr) {
          console.warn('[WebRTC] Camera access failed, attempting audio only:', camErr);
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: false,
              audio: true,
            });
            setIsVideoOff(true);
            toast.info('Camera unavailable. Starting audio call.');
          } catch (micErr) {
            console.error('[WebRTC] Media access denied:', micErr);
            toast.error('Could not access camera/microphone. Please allow browser permissions.');
            endCall();
            return;
          }
        }

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peer = new RTCPeerConnection(ICE_SERVERS);
        peerRef.current = peer;

        stream.getTracks().forEach((track) => peer.addTrack(track, stream));

        peer.ontrack = (event) => {
          console.log('[WebRTC] Received remote stream track');
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peer.onicecandidate = (event) => {
          if (event.candidate && targetId) {
            socket.emit('webrtc_ice_candidate', {
              targetId,
              candidate: event.candidate,
            });
          }
        };

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        console.log(`[WebRTC] Emitting webrtc_call_user to recipient: ${targetId}`);
        socket.emit('webrtc_call_user', {
          recipientId: targetId,
          projectId,
          offer,
          caller: {
            _id: String(user._id),
            name: user.name,
            profilePictureUrl: user.profilePictureUrl,
            role: user.role,
          },
        });
      } catch (err) {
        console.error('[WebRTC] Call setup error:', err);
        toast.error('Could not initiate call.');
        endCall();
      }
    };

    startCall();

    return () => {
      cleanupCall();
    };
  }, [isOpen, isIncomingCall, targetId]);

  // Answer Incoming Call
  const answerCall = async () => {
    try {
      setCallStatus('connecting');
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (camErr) {
        console.warn('[WebRTC] Answering: camera unavailable, falling back to audio:', camErr);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          setIsVideoOff(true);
          toast.info('Camera unavailable. Answering audio-only.');
        } catch (micErr) {
          console.error('[WebRTC] Microphone access denied:', micErr);
          toast.error('Could not access microphone.');
          endCall();
          return;
        }
      }

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = new RTCPeerConnection(ICE_SERVERS);
      peerRef.current = peer;

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        console.log('[WebRTC] Received remote track on answer');
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate && callerId) {
          socket.emit('webrtc_ice_candidate', {
            targetId: callerId,
            candidate: event.candidate,
          });
        }
      };

      await peer.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      await flushQueuedIceCandidates(peer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      console.log(`[WebRTC] Emitting webrtc_answer_call to caller: ${callerId}`);
      socket.emit('webrtc_answer_call', {
        callerId,
        answer,
      });

      setCallStatus('connected');
    } catch (err) {
      console.error('[WebRTC] Error answering call:', err);
      toast.error('Failed to connect call media.');
      endCall();
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const camTrack = camStream.getVideoTracks()[0];
        const sender = peerRef.current
          ?.getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        if (sender) {
          await sender.replaceTrack(camTrack);
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = camStream;
        }
        localStreamRef.current = camStream;
        setIsScreenSharing(false);
      } catch (err) {
        console.error('Error reverting to camera:', err);
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        const sender = peerRef.current
          ?.getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error starting screen share:', err);
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const partner = isIncomingCall ? callerInfo : targetUser;

  // --- INCOMING CALL PROMPT MODAL ---
  if (callStatus === 'incoming') {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-scale-up border border-slate-100">
          <div className="relative w-24 h-24 mx-auto">
            {partner?.profilePictureUrl ? (
              <img
                src={partner.profilePictureUrl}
                alt={partner.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-blue-500/30">
                {partner?.name?.charAt(0) || 'U'}
              </div>
            )}
            <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center text-white">
              <PhoneCall size={12} className="animate-bounce" />
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{partner?.name || 'User'}</h3>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-1">
              Incoming Video Call...
            </p>
            <p className="text-xs text-slate-400 mt-1 capitalize">
              {partner?.role || 'Collaborator'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={rejectCall}
              className="px-5 py-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <PhoneOff size={16} />
              <span>Decline</span>
            </button>
            <button
              onClick={answerCall}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              <Video size={16} />
              <span>Accept Call</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RECIPIENT OFFLINE SCREEN ---
  if (callStatus === 'offline') {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-5 border border-slate-100">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{partner?.name || 'User'} is Offline</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              They are not currently active on FreelancerHub. You can send them a direct message or try again later.
            </p>
          </div>
          <button
            onClick={() => {
              cleanupCall();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Call
          </button>
        </div>
      </div>
    );
  }

  // --- MINIMIZED FLOATING WINDOW ---
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-3xl p-3 shadow-2xl border border-slate-800 flex items-center gap-3 w-72">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden relative shrink-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-xs truncate">{partner?.name || 'Collaborator'}</p>
          <span className="text-[10px] text-emerald-400 font-medium">
            {callStatus === 'connected' ? formatTime(callDuration) : 'Calling...'}
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 cursor-pointer"
          title="Maximize"
        >
          <Maximize2 size={16} />
        </button>
        <button
          onClick={endCall}
          className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          title="End Call"
        >
          <PhoneOff size={14} />
        </button>
      </div>
    );
  }

  // --- FULL ACTIVE CALL INTERFACE ---
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col h-[85vh]">
        {/* Call Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
              <Video size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{partner?.name || 'Collaborator'}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={11} /> 256-bit P2P Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {callStatus === 'connected' ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Connected • {formatTime(callDuration)}
                  </span>
                ) : (
                  <span className="text-amber-400 animate-pulse">Ringing collaborator...</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Minimize to Picture-in-Picture"
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="flex-1 relative bg-black p-4 flex items-center justify-center overflow-hidden">
          {/* Remote Video (Main screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain rounded-2xl"
          />

          {callStatus !== 'connected' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-900/80 z-10 text-center p-6">
              <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-3xl font-extrabold animate-pulse">
                {partner?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-lg font-bold text-white">Calling {partner?.name || 'User'}...</p>
                <p className="text-xs text-slate-400 mt-1">Waiting for them to connect camera & mic</p>
              </div>
            </div>
          )}

          {/* Local Video (Floating corner) */}
          <div className="absolute bottom-6 right-6 w-36 sm:w-48 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl z-20">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1 bg-slate-800">
                <VideoOff size={20} />
                <span className="text-[10px]">Camera off</span>
              </div>
            )}
            <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] text-white font-semibold">
              You {isScreenSharing ? '(Sharing Screen)' : ''}
            </span>
          </div>
        </div>

        {/* Call Controls Bar */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
          {/* Mute Mic */}
          <button
            onClick={toggleMic}
            className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
              isMicMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
              isVideoOff
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          {/* Share Screen */}
          <button
            onClick={toggleScreenShare}
            className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
              isScreenSharing
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <Monitor size={20} />
          </button>

          {/* Hang Up (Red) */}
          <button
            onClick={endCall}
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105 cursor-pointer ml-4"
          >
            <PhoneOff size={20} />
            <span className="text-sm">End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
