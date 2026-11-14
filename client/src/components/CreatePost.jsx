import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/api';
import { toast } from 'react-toastify';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      return toast.error('Post content cannot be empty.');
    }

    setIsSubmitting(true);
    try {
      const postData = {
        postType: 'text',
        content: { text: text.trim() },
      };
      const newPost = await createPost(postData);
      toast.success('Shared with the network!');
      setText('');
      if (onPostCreated) onPostCreated(newPost);
    } catch (err) {
      toast.error(err.message || 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 mb-6 shadow-xs">
      <div className="flex items-start gap-3.5">
        {user?.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white resize-none transition-all"
            rows="3"
            placeholder="Share a milestone, request project advice, or post a discussion #topic..."
          />
          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Tip: Use hashtags like <span className="text-blue-600 font-medium">#webdev</span> or <span className="text-blue-600 font-medium">#design</span>
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="ml-auto px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Posting...' : 'Share Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
