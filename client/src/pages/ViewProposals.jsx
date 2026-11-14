import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProposalsForProject, updateProposalStatus, getProjectById } from '../services/api';
import { Check, X, ArrowLeft, Calendar, DollarSign, Sparkles, User } from 'lucide-react';

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectData, proposalsData] = await Promise.all([
        getProjectById(projectId),
        getProposalsForProject(projectId),
      ]);
      setProject(projectData);
      setProposals(proposalsData || []);
    } catch (err) {
      setError('Failed to fetch project proposals.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResponse = async (proposalId, status) => {
    try {
      await updateProposalStatus(proposalId, status);
      toast.success(`Proposal has been ${status}!`);
      navigate('/client');
    } catch (err) {
      toast.error(err.message || 'Failed to update proposal.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-16 bg-slate-200/70 rounded-3xl" />
        <div className="h-44 bg-slate-200/70 rounded-3xl" />
        <div className="h-44 bg-slate-200/70 rounded-3xl" />
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/client"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Client Workspace</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Proposal Submissions ({proposals.length})
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {project?.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Target Budget: <span className="font-bold text-emerald-600">₹{project?.budget?.toLocaleString()}</span>
          </p>
        </div>

        <Link
          to={`/project/${projectId}`}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-center"
        >
          View Full Brief
        </Link>
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Proposals Submitted Yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Freelancers across the network are reviewing your job posting. Check back soon for bids.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              onRespond={handleResponse}
              isProjectOpen={project?.status === 'open'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProposalCard = ({ proposal, onRespond, isProjectOpen }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden hover:border-slate-300 transition-colors">
      <div className="p-6 sm:p-8 space-y-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {proposal.freelancer?.profilePictureUrl ? (
              <img
                src={proposal.freelancer.profilePictureUrl}
                alt={proposal.freelancer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {proposal.freelancer?.name?.charAt(0) || 'F'}
              </div>
            )}

            <div>
              <Link
                to={`/profile/${proposal.freelancer?._id}`}
                className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {proposal.freelancer?.name}
              </Link>
              <p className="text-xs text-slate-400 capitalize">
                Freelancer • Applied {new Date(proposal.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bid Amount
            </span>
            <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
              ₹{proposal.bidAmount?.toLocaleString()}
            </p>
            {proposal.estimatedDays && (
              <span className="text-xs text-slate-500 flex items-center sm:justify-end gap-1 mt-0.5">
                <Calendar size={13} className="text-slate-400" />
                <span>Est. {proposal.estimatedDays} days</span>
              </span>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {proposal.coverLetter}
        </div>
      </div>

      {/* Action Footer */}
      {isProjectOpen && (
        <div className="bg-slate-50/70 border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={() => onRespond(proposal._id, 'declined')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={() => onRespond(proposal._id, 'accepted')}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} />
            <span>Accept Proposal & Assign</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewProposals;
