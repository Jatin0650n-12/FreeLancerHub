import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MessageSquarePlus, User, Sparkles, Loader2 } from 'lucide-react';
import { getAllUsers } from '../services/api';

const NewChatModal = ({ isOpen, onClose, onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers(search);
        setUsers(data || []);
      } catch (err) {
        console.error('Failed to load users for new chat:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 200);
    return () => clearTimeout(timer);
  }, [isOpen, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquarePlus size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">New Message</h2>
              <p className="text-xs text-slate-500">
                Select a member or search by name to start a direct conversation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin mx-auto text-blue-600" />
              <p className="text-xs mt-2">Finding members...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-700">No members found</p>
              <p className="text-slate-500 mt-1">Try searching with a different keyword.</p>
            </div>
          ) : (
            users.map((targetUser) => (
              <div
                key={targetUser._id}
                className="py-3 px-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {targetUser.profilePictureUrl ? (
                    <img
                      src={targetUser.profilePictureUrl}
                      alt={targetUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                      {targetUser.name?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-900 truncate">
                        {targetUser.name}
                      </p>
                      {targetUser.role && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {targetUser.role}
                        </span>
                      )}
                    </div>
                    {targetUser.bio && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {targetUser.bio}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectUser(targetUser._id);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex-shrink-0"
                >
                  Message
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NewChatModal;

