import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Calendar, DollarSign, Sparkles } from 'lucide-react';

const ProposalModal = ({ isOpen, onClose, onSubmit, projectTitle }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim() || !bidAmount) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        coverLetter: coverLetter.trim(),
        bidAmount: Number(bidAmount),
        estimatedDays: estimatedDays ? Number(estimatedDays) : undefined,
      });
      setCoverLetter('');
      setBidAmount('');
      setEstimatedDays('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-2xl overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8 border-b border-slate-100">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-2">
            <Sparkles size={13} /> Project Bid
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Submit Your Proposal
          </h2>
          <p className="text-xs text-slate-500 mt-1 truncate">
            Project: <span className="font-semibold text-slate-800">{projectTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="bidAmount"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Proposed Bid (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-base">
                    ₹
                  </span>
                  <input
                    id="bidAmount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. 18000"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="estimatedDays"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Est. Delivery (Days)
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="estimatedDays"
                    type="number"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. 7"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="coverLetter"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                Cover Letter & Pitch
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white resize-none"
                rows="6"
                placeholder="Introduce yourself, highlight relevant past work, explain your technical approach, and detail how you will deliver this project successfully."
                required
              />
            </div>
          </div>

          <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Submitting...' : 'Send Proposal'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProposalModal;
