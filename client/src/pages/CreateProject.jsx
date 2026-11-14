import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProject } from '../services/api';
import {
  PlusCircle,
  Briefcase,
  FileText,
  DollarSign,
  ArrowRight,
  Sparkles,
  Loader2,
  ChevronLeft,
} from 'lucide-react';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBudgetQuickSelect = (amt) => {
    setFormData((prev) => ({ ...prev, budget: amt.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.budget) {
      return toast.error('Please fill out all project fields.');
    }
    setIsSubmitting(true);
    try {
      await createProject({
        ...formData,
        budget: Number(formData.budget),
      });
      toast.success('Project posted to the marketplace successfully!');
      navigate('/client');
    } catch (err) {
      toast.error(err.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/client"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to Client Dashboard</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
            <Sparkles size={14} /> New Job Listing
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Post a Project to the Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify your requirements, scope, and budget. Freelancers will submit custom proposals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Project Title
            </label>
            <div className="relative">
              <Briefcase
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                placeholder="e.g. Full-Stack Web App using React & Node.js"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Project Scope & Requirements
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none"
              placeholder="Outline the main goals, deliverables, tech stack requirements, and expected timeline in detail..."
              required
            />
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="budget"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Budget Allocation (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                placeholder="e.g. 25000"
                required
              />
            </div>

            {/* Quick budget pills */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-[11px] font-semibold text-slate-400">Quick select:</span>
              {[5000, 15000, 30000, 50000, 100000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => handleBudgetQuickSelect(amt)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Publishing Project...</span>
                </>
              ) : (
                <>
                  <span>Publish Project to Marketplace</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
