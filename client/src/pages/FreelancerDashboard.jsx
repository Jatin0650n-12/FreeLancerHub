import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProjects, getMyProposals } from '../services/api';
import {
  Clock,
  CheckCircle2,
  FileText,
  BriefcaseBusiness,
  Search,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Send,
  Calendar,
} from 'lucide-react';

const ProjectSection = ({ title, icon: Icon, items, renderItem, emptyMessage, emptyCta }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isExpanded ? items : items.slice(0, 4);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs mb-8 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Icon size={17} />
            </div>
          )}
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {items.length}
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-slate-500 py-12 px-6">
          <p className="text-sm">{emptyMessage}</p>
          {emptyCta && (
            <div className="mt-4">
              {emptyCta}
            </div>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {visibleItems.map((item) => renderItem(item))}
        </div>
      )}

      {items.length > 4 && (
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {isExpanded ? 'Show Less' : `Show ${items.length - 4} More`}
          </button>
        </div>
      )}
    </div>
  );
};

const ProjectListItem = ({ project }) => {
  const isCompleted = project.status === 'completed';

  return (
    <div className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1 flex-1 min-w-0 pr-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/project/${project._id}`}
            className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors truncate"
          >
            {project.title}
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            {isCompleted ? 'Completed' : 'In Progress'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5">
          <span>
            Client: <span className="font-medium text-slate-800">{project.client?.name || 'Client'}</span>
          </span>
          <span className="font-semibold text-emerald-600">₹{project.budget?.toLocaleString()}</span>
        </div>
      </div>

      <Link
        to={`/project/${project._id}`}
        className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 flex-shrink-0"
      >
        <FolderOpen size={15} />
        <span>Open Workspace</span>
      </Link>
    </div>
  );
};

const ProposalListItem = ({ proposal }) => {
  let statusBadge = {
    text: 'Awaiting Review',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  if (proposal.status === 'accepted') {
    statusBadge = {
      text: 'Accepted ✓',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  } else if (proposal.status === 'rejected') {
    statusBadge = {
      text: 'Declined',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }

  return (
    <div className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1 flex-1 min-w-0 pr-4">
        <Link
          to={`/project/${proposal.project?._id}`}
          className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors truncate block"
        >
          {proposal.project?.title || 'Project'}
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <span className="text-emerald-600 font-bold">₹{proposal.bidAmount?.toLocaleString()}</span>
            <span>proposed bid</span>
          </span>
          {proposal.estimatedDays && (
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-slate-400" />
              <span>Est. {proposal.estimatedDays} days</span>
            </span>
          )}
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border self-start sm:self-center ${statusBadge.badgeClass}`}
      >
        {statusBadge.text}
      </span>
    </div>
  );
};

const FreelancerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, proposalsData] = await Promise.all([
          getMyProjects(),
          getMyProposals(),
        ]);
        setProjects(projectsData || []);
        setProposals(proposalsData || []);
      } catch (err) {
        setError('Failed to fetch your dashboard information.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200/70 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200/70 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-200/70 rounded-3xl" />
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

  const activeProjects = projects.filter((p) => p.status === 'in-progress');
  const completedProjects = projects.filter((p) => p.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-blue-500/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md mb-2">
            <Sparkles size={14} /> Freelancer Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Freelancer Dashboard
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Manage your ongoing client work, proposals, deliverables, and payouts.
          </p>
        </div>
        <Link
          to="/find-work"
          className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] flex-shrink-0"
        >
          <Search size={18} />
          <span>Explore Open Jobs</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Workspaces</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-2">{activeProjects.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Currently in progress</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Proposals</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-2">{proposals.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Bids submitted</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Projects</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{completedProjects.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Finished contracts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Contracts</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{projects.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Overall awarded</p>
        </div>
      </div>

      {/* Active Projects */}
      <ProjectSection
        title="Active Projects in Progress"
        icon={Clock}
        items={activeProjects}
        renderItem={(project) => <ProjectListItem key={project._id} project={project} />}
        emptyMessage="You have no active projects right now."
        emptyCta={
          <Link
            to="/find-work"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            <Search size={14} />
            <span>Find Work on the Marketplace</span>
          </Link>
        }
      />

      {/* Proposals */}
      <ProjectSection
        title="Your Submitted Proposals"
        icon={Send}
        items={proposals}
        renderItem={(proposal) => <ProposalListItem key={proposal._id} proposal={proposal} />}
        emptyMessage="You haven't submitted any proposals yet."
        emptyCta={
          <Link
            to="/find-work"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            <BriefcaseBusiness size={14} />
            <span>Browse Open Client Jobs</span>
          </Link>
        }
      />

      {/* Completed */}
      <ProjectSection
        title="Completed Projects"
        icon={CheckCircle2}
        items={completedProjects}
        renderItem={(project) => <ProjectListItem key={project._id} project={project} />}
        emptyMessage="No completed projects yet. Finish active tasks to complete your first contract."
      />
    </div>
  );
};

export default FreelancerDashboard;
