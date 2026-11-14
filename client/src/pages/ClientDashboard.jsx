import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProjects } from '../services/api';
import {
  PlusCircle,
  Eye,
  Clock,
  CheckCircle2,
  Briefcase,
  DollarSign,
  Users,
  ArrowRight,
  FolderOpen,
  Sparkles,
  Search,
} from 'lucide-react';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getMyProjects();
        setProjects(data || []);
      } catch (err) {
        setError('Failed to fetch your projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openCount = projects.filter((p) => p.status === 'open').length;
  const inProgressCount = projects.filter((p) => p.status === 'in-progress').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200/70 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200/70 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-200/70 rounded-2xl" />
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-blue-500/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md mb-2">
            <Sparkles size={14} /> Client Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Client'}
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Track bids, review deliverables, collaborate with talent, and manage milestone payouts.
          </p>
        </div>
        <Link
          to="/project/new"
          className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] flex-shrink-0"
        >
          <PlusCircle size={18} />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Projects</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{projects.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">All created listings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Open for Bids</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-600 mt-2">{openCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Awaiting assignment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">{inProgressCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Active workspaces</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Successfully finished</p>
        </div>
      </div>

      {/* Main Listings Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header & Filter Tabs */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any project to view proposals or enter its dedicated workspace.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'all', label: 'All', count: projects.length },
              { id: 'open', label: 'Open', count: openCount },
              { id: 'in-progress', label: 'Active', count: inProgressCount },
              { id: 'completed', label: 'Done', count: completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    filter === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List of Projects */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={30} />
            </div>
            <h3 className="text-base font-bold text-slate-900">No projects found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {filter === 'all'
                ? "You haven't posted any projects yet. Post your first project to start receiving bids from top freelancers."
                : `There are currently no projects matching the "${filter}" status filter.`}
            </p>
            {filter === 'all' && (
              <Link
                to="/project/new"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <PlusCircle size={16} />
                <span>Create First Project</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProjects.map((project) => (
              <ProjectListItem key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectListItem = ({ project }) => {
  const statusConfig = {
    open: {
      text: 'Open for Bids',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dotClass: 'bg-blue-500 animate-pulse',
    },
    'in-progress': {
      text: 'In Progress',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dotClass: 'bg-amber-500',
    },
    completed: {
      text: 'Completed',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotClass: 'bg-emerald-500',
    },
  };

  const currentStatus = statusConfig[project.status] || {
    text: project.status,
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  };

  return (
    <div className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5 flex-1 min-w-0 pr-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/project/${project._id}`}
            className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors truncate"
          >
            {project.title}
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStatus.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dotClass}`} />
            {currentStatus.text}
          </span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">₹{project.budget?.toLocaleString()}</span>
            <span>budget</span>
          </span>
          {project.freelancer ? (
            <span className="flex items-center gap-1.5 text-slate-600">
              <span>Freelancer:</span>
              <span className="font-medium text-slate-900">{project.freelancer.name}</span>
            </span>
          ) : (
            <span className="text-slate-400 italic">No freelancer assigned yet</span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        {project.status === 'open' ? (
          <Link
            to={`/project/${project._id}/proposals`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            <Eye size={15} />
            <span>Review Proposals</span>
          </Link>
        ) : (
          <Link
            to={`/project/${project._id}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FolderOpen size={15} />
            <span>Open Workspace</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
