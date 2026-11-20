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
  CheckCircle2,
  Tag,
  Zap,
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Full-Stack',
  'Frontend',
  'Backend',
  'Mobile Apps',
  'UI/UX Design',
  'AI & ML',
];

const BUDGET_RANGES = [
  { id: 'all', label: 'All Budgets' },
  { id: 'low', label: '< ₹15,000', max: 15000 },
  { id: 'mid', label: '₹15,000 - ₹50,000', min: 15000, max: 50000 },
  { id: 'high', label: '₹50,000+', min: 50000 },
];

const FindWorkPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBudget, setSelectedBudget] = useState('all');
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
      const matchesSearch = !q || titleMatch || descMatch || clientMatch;

      // Category filter
      let matchesCategory = true;
      if (selectedCategory !== 'All Categories') {
        const cat = selectedCategory.toLowerCase();
        matchesCategory =
          project.title?.toLowerCase().includes(cat) ||
          project.description?.toLowerCase().includes(cat);
      }

      // Budget filter
      let matchesBudget = true;
      if (selectedBudget === 'low') {
        matchesBudget = Number(project.budget) <= 15000;
      } else if (selectedBudget === 'mid') {
        matchesBudget = Number(project.budget) >= 15000 && Number(project.budget) <= 50000;
      } else if (selectedBudget === 'high') {
        matchesBudget = Number(project.budget) >= 50000;
      }

      return matchesSearch && matchesCategory && matchesBudget;
    })
    .sort((a, b) => {
      if (sortBy === 'highest-budget') return (b.budget || 0) - (a.budget || 0);
      if (sortBy === 'lowest-budget') return (a.budget || 0) - (b.budget || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 bg-gradient-to-r from-slate-200 to-slate-100 rounded-3xl animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner with modern glass card & stats */}
      <div className="bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 p-8 sm:p-10 rounded-3xl text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-blue-100">
              <Sparkles size={14} className="text-amber-300" /> Open Project Marketplace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Find Your Next High-Impact Gig
            </h1>
            <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
              Explore verified client job postings. Submit tailored proposals, collaborate via real-time workspaces, and receive secure milestone payouts.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-6 shrink-0 text-center">
            <div>
              <p className="text-2xl font-black text-white">{projects.length}</p>
              <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Active Jobs</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-2xl font-black text-emerald-300">100%</p>
              <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Escrow Protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by role, framework, title, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal size={16} className="text-slate-400 ml-1 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="highest-budget">Sort: Highest Budget</option>
              <option value="lowest-budget">Sort: Lowest Budget</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25 scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Budget Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-bold text-slate-700 mr-1 flex items-center gap-1">
            <DollarSign size={13} className="text-blue-600" /> Budget:
          </span>
          {BUDGET_RANGES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBudget(b.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedBudget === b.id
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredProjects.length}</strong> open{' '}
          {filteredProjects.length === 1 ? 'project' : 'projects'}
        </span>
        {(searchQuery || selectedCategory !== 'All Categories' || selectedBudget !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setSelectedBudget('all');
            }}
            className="text-blue-600 hover:underline font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Project Cards List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-900">No open projects match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your category selection, keywords, or budget range to see other opportunities.
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/project/${project._id}`}
              className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
            >
              {project.title}
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open for Bids
            </span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Budget Pill */}
        <div className="flex-shrink-0 sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ₹{project.budget?.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider flex sm:justify-end items-center gap-1">
            <CheckCircle2 size={12} /> Verified Budget
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            {project.client?.profilePictureUrl ? (
              <img
                src={project.client.profilePictureUrl}
                alt={project.client.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                {project.client?.name?.charAt(0) || 'C'}
              </div>
            )}
            <span>{project.client?.name || 'Verified Client'}</span>
          </span>

          <span className="flex items-center gap-1 text-slate-400">
            <Clock size={14} />
            <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
          </span>
        </div>

        <Link
          to={`/project/${project._id}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <span>View Details & Bid</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default FindWorkPage;
