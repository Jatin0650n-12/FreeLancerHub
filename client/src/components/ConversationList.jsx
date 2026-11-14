import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Search, MessageSquarePlus, Plus, UserPlus } from 'lucide-react';

const ConversationList = ({
  conversations = [],
  connections = [],
  activeConversationId,
  onStartConversation,
  onOpenNewChat,
  isLoading,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const displayList = useMemo(() => {
    const convoMap = new Map();
    conversations.forEach((convo) => {
      const other = convo.participants?.find((p) => p._id !== user._id);
      if (other) {
        convoMap.set(other._id, { type: 'conversation', data: convo, user: other });
      }
    });
    connections.forEach((conn) => {
      if (!convoMap.has(conn._id)) {
        convoMap.set(conn._id, { type: 'connection', data: conn, user: conn });
      }
    });
    return Array.from(convoMap.values()).filter((item) =>
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, connections, user, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Conversations</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {displayList.length}
            </span>
          </div>

          <button
            onClick={onOpenNewChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Start new message"
          >
            <Plus size={14} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-grow overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
            <p>Loading contacts...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <MessageSquarePlus size={22} />
            </div>
            <p className="text-xs font-bold text-slate-700">No conversations yet</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              Select any member from the community to begin chatting.
            </p>
            <button
              onClick={onOpenNewChat}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <UserPlus size={14} />
              <span>Start a Conversation</span>
            </button>
          </div>
        ) : (
          displayList.map((item) => {
            const isActive =
              item.type === 'conversation' && item.data._id === activeConversationId;
            return (
              <Link
                key={item.user._id}
                to={item.type === 'conversation' ? `/messages/${item.data._id}` : '#'}
                onClick={(e) => {
                  if (item.type === 'connection') {
                    e.preventDefault();
                    onStartConversation(item.user._id);
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 shadow-xs'
                    : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {item.user.profilePictureUrl ? (
                    <img
                      src={item.user.profilePictureUrl}
                      alt={item.user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {item.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs truncate">{item.user.name}</p>
                    {item.user.role && (
                      <span className="text-[10px] text-slate-400 capitalize">
                        {item.user.role}
                      </span>
                    )}
                  </div>
                  {item.type === 'connection' ? (
                    <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                      <MessageSquarePlus size={12} /> Click to start chat
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.data.lastMessage?.content || 'Tap to open conversation'}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
