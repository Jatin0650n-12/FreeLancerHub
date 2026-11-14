import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationList from '../components/ConversationList.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import NewChatModal from '../components/NewChatModal.jsx';
import { getConversations, getMyConnections, startConversation } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { MessageSquare, MessageSquarePlus, UserPlus } from 'lucide-react';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const { conversationId: activeConversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchConversationsData = async () => {
    if (!user) return setLoading(false);
    try {
      setLoading(true);
      const [convosData, connsData] = await Promise.all([
        getConversations(),
        getMyConnections(),
      ]);
      setConversations(convosData || []);
      setConnections(connsData || []);
    } catch (error) {
      toast.error('Failed to load messaging contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversationsData();
  }, [user]);

  const handleStartNewConversation = async (recipientId) => {
    try {
      const newConvo = await startConversation(recipientId);
      await fetchConversationsData();
      navigate(`/messages/${newConvo._id}`);
      setIsNewChatOpen(false);
    } catch (error) {
      toast.error('Could not initiate conversation.');
    }
  };

  const activeConversation = conversations.find((c) => c._id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-130px)] min-h-[500px] bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Sidebar - Conversation List */}
      <div
        className={`w-full md:w-[360px] lg:w-[380px] border-r border-slate-100 flex-shrink-0 flex flex-col ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <ConversationList
          conversations={conversations}
          connections={connections}
          activeConversationId={activeConversationId}
          onStartConversation={handleStartNewConversation}
          onOpenNewChat={() => setIsNewChatOpen(true)}
          isLoading={loading}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={`w-full flex-col flex-1 ${
          activeConversationId ? 'flex' : 'hidden'
        } md:flex bg-slate-50/50`}
      >
        {activeConversation ? (
          <ChatWindow key={activeConversationId} conversation={activeConversation} />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-center text-slate-400 p-8">
            <div className="flex flex-col items-center gap-3 max-w-sm">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Direct Messaging</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">
                Select a contact from the left, or start a new conversation with any client or freelancer.
              </p>
              <button
                onClick={() => setIsNewChatOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <MessageSquarePlus size={16} />
                <span>Start New Conversation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Search & Select Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onSelectUser={handleStartNewConversation}
      />
    </div>
  );
};

export default MessagesPage;
