import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { getMessagesForConversation, sendDirectMessage } from '../services/api';
import { toast } from 'react-toastify';
import {
  Send,
  ArrowLeft,
  MoreVertical,
  ShieldCheck,
  User,
  CheckCheck,
  Sparkles,
  Smile,
} from 'lucide-react';

const QUICK_ACTIONS = [
  '👋 Hi there!',
  '🚀 Project update ready',
  '📄 Please review the latest deliverable',
  '👍 Looks good to me!',
  '✅ Approved and ready to proceed',
];

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const conversationId = conversation?._id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!conversationId) return;

    socket.emit('joinConversation', conversationId);

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getMessagesForConversation(conversationId);
        setMessages(history || []);
      } catch (error) {
        toast.error('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();

    const handleNewMessage = (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
        setIsTyping(false);
      }
    };

    const handleTyping = (data) => {
      if (data.conversationId === conversationId && data.userId !== user._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      if (data.conversationId === conversationId && data.userId !== user._id) {
        setIsTyping(false);
      }
    };

    socket.on('newDirectMessage', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off('newDirectMessage', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
    };
  }, [conversationId, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Emit typing event
    socket.emit('typing', { conversationId, userId: user._id });

    // Debounce stopTyping
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId, userId: user._id });
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;
    const textToSend = newMessage.trim();
    setNewMessage('');
    socket.emit('stopTyping', { conversationId, userId: user._id });
    try {
      await sendDirectMessage(conversationId, textToSend);
    } catch (error) {
      toast.error('Failed to send message.');
    }
  };

  const handleQuickAction = (text) => {
    setNewMessage(text);
  };

  const otherParticipant = conversation?.participants?.find((p) => p._id !== user._id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="p-1.5 rounded-xl hover:bg-slate-100 md:hidden text-slate-600 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>

          <Link
            to={`/profile/${otherParticipant?._id}`}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              {otherParticipant?.profilePictureUrl ? (
                <img
                  src={otherParticipant.profilePictureUrl}
                  alt={otherParticipant.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {otherParticipant?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <h2 className="font-bold text-sm text-slate-900 leading-tight">
                {otherParticipant?.name || 'Conversation'}
              </h2>
              <p className="text-[11px] text-slate-400 capitalize">
                {otherParticipant?.role || 'Member'} • Active
              </p>
            </div>
          </Link>
        </div>

        <Link
          to={`/profile/${otherParticipant?._id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors"
        >
          View Profile
        </Link>
      </div>

      {/* Message History */}
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-xs text-slate-400">
            <div className="space-y-3 max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Start the conversation</p>
                <p className="text-slate-500 mt-1">
                  Connect with {otherParticipant?.name} directly regarding project specifications, milestones, or deadlines.
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs shadow-blue-500/10'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <div
                    className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                      isMe ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isMe && <CheckCheck size={12} className="text-blue-200" />}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200/80 px-3.5 py-2 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5 text-xs text-slate-500">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {otherParticipant?.name?.split(' ')[0] || 'User'} is typing...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-1.5 bg-slate-100/60 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_ACTIONS.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickAction(action)}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 rounded-full text-[11px] font-semibold text-slate-600 hover:text-blue-700 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white rounded-xl shadow-xs shadow-blue-500/25 transition-all cursor-pointer flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
