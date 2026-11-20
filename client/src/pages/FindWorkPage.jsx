import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOpenProjects } from '../services/api';
import {
  BriefcaseBusiness,
  Clock,
  DollarSign,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  User,
  SlidersHorizontal,
} from 'lucide-react';

const FindWorkPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpenProjects = async () => {
      try {
        const data = await getOpenProjects();
        setProjects(data || []);
      } catch (err) {
        setError('Failed to fetch open projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchOpenProjects();
  }, []);

  const filteredProjects = projects
    .filter((project) => {
      const q = searchQuery.toLowerCase();
      const titleMatch = project.title?.toLowerCase().includes(q);
      const descMatch = project.description?.toLowerCase().includes(q);
      const clientMatch = project.client?.name?.toLowerCase().includes(q);
      return titleMatch || descMatch || clientMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'highest-budget') return (b.budget || 0) - (a.budget || 0);
      if (sortBy === 'lowest-budget') return (a.budget || 0) - (b.budget || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 bg-slate-200/70 rounded-3xl" />
        <div className="h-12 bg-slate-200/70 rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-200/70 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md mb-3">
          <Sparkles size={14} /> Open Project Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Find Your Next High-Impact Gig
        </h1>
        <p className="text-blue-100 text-sm mt-2 max-w-2xl leading-relaxed">
          Browse verified client job postings. Submit competitive proposals, connect with project owners, and grow your independent career.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by keywords, title, skills, or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal size={16} className="text-slate-400 ml-1 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="highest-budget">Sort: Highest Budget</option>
            <option value="lowest-budget">Sort: Lowest Budget</option>
          </select>
        </div>
      </div>

      {/* Job Cards Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Showing {filteredProjects.length} open {filteredProjects.length === 1 ? 'project' : 'projects'}</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Job Cards Grid */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-900">No open projects match your search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search terms or clearing filters to see all available opportunities.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <JobCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

const JobCard = ({ project }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/project/${project._id}`}
              className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              {project.title}
            </Link>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Open for Bids
            </span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex-shrink-0 sm:text-right">
          <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
            ₹{project.budget?.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Fixed Budget</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            {project.client?.profilePictureUrl ? (
              <img
                src={project.client.profilePictureUrl}
                alt={project.client.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                {project.client?.name?.charAt(0) || 'C'}
              </div>
            )}
            <span>{project.client?.name || 'Verified Client'}</span>
          </span>

          <span className="flex items-center gap-1">
            <Clock size={14} className="text-slate-400" />
            <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
          </span>
        </div>

        <Link
          to={`/project/${project._id}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <span>View & Submit Proposal</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default FindWorkPage;
