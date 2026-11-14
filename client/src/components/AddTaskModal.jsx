import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-slate-900">Add Project Task</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create a task in the backlog to track milestone progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Task Description
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
              placeholder="e.g. Design wireframes for checkout flow"
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTaskModal;
