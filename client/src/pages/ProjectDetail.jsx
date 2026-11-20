import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getProjectById,
  getTasksForProject,
  createTask,
  updateTaskStatus,
  createReview,
  submitProposal,
  getMyProposals,
  createInvoice,
  checkUserReview,
  createRazorpayOrder,
  verifyPayment,
  getReviewsForUser,
} from "../services/api";
import { loadRazorpayScript } from "../utils/loadRazorpay.js";
import { useAuth } from "../context/AuthContext";
import TaskBoard from "../components/TaskBoard.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import Deliverables from "../components/Deliverables.jsx";
import ProjectChat from "../components/ProjectChat.jsx";
import Billing from "../components/Billing.jsx";
import ProposalModal from "../components/ProposalModal.jsx";
import { useVideoCall } from "../context/VideoCallContext";
import {
  MessageSquare,
  Clock,
  DollarSign,
  FileText,
  ListTodo,
  Briefcase,
  CheckCircle,
  LoaderCircle,
  Star,
  Sparkles,
  User,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

// --- HELPER COMPONENTS ---

const LeaveReviewForm = ({ project, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const reviewee = user._id === project.client._id ? project.freelancer : project.client;
  const revieweeId = reviewee?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!revieweeId) return toast.error("Could not determine who to review.");
    setIsSubmitting(true);
    try {
      await createReview(project._id, { rating, comment, revieweeId });
      toast.success("Thank you for your review!");
      if (onReviewSubmit) onReviewSubmit();
    } catch (error) {
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 my-6 shadow-xs text-left">
      <div className="flex items-center gap-2 mb-2">
        <Star size={20} className="text-amber-500 fill-amber-500" />
        <h3 className="font-bold text-lg text-slate-900">
          Leave a Review for {reviewee?.name || "Participant"}
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        Help the community build trust by sharing your experience working on this project.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Rating Score
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  size={26}
                  className={`${
                    star <= rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 fill-slate-100"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-bold text-slate-700">{rating} / 5</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Feedback & Testimonial
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about communication, quality of deliverables, and adherence to milestones..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
            rows="3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Publish Review"}
        </button>
      </form>
    </div>
  );
};

const ReviewDisplayCard = ({ title, review }) => {
  if (!review) return null;
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 mb-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-sm text-slate-900">{title}</h4>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={15}
              className={
                i < review.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200 fill-slate-100"
              }
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-600 italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        "{review.comment}"
      </p>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { projectId } = useParams();
  const { user } = useAuth();
  const { startVideoCall } = useVideoCall();

  const fetchProjectData = useCallback(async () => {
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);

      const isParticipant =
        user && (user._id === projectData.client?._id || user._id === projectData.freelancer?._id);

      const [reviewStatus, clientReviews, freelancerReviews, proposalsData, tasksData] =
        await Promise.all([
          checkUserReview(projectId),
          getReviewsForUser(projectData.client?._id),
          projectData.freelancer?._id
            ? getReviewsForUser(projectData.freelancer._id)
            : Promise.resolve([]),
          user?.role === "freelancer" ? getMyProposals() : Promise.resolve([]),
          isParticipant && ["in-progress", "completed"].includes(projectData.status)
            ? getTasksForProject(projectId)
            : Promise.resolve([]),
        ]);

      setReviews([...(clientReviews || []), ...(freelancerReviews || [])]);
      setHasReviewed(reviewStatus?.hasReviewed || false);
      setTasks(tasksData || []);

      if (user?.role === "freelancer") {
        setHasSubmitted(proposalsData.some((p) => p.project?._id === projectId));
      }
    } catch (err) {
      setError("Failed to fetch project details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => {
    setLoading(true);
    fetchProjectData();
  }, [projectId]);

  const handleInitiatePayment = async () => {
    if (!project?.invoice) return toast.error("No invoice found.");
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        return toast.error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      setIsProcessingPayment(true);
      const orderData = await createRazorpayOrder(project.invoice._id);
      setIsProcessingPayment(false);

      if (!orderData || !orderData.orderId) {
        return toast.error("Could not initiate payment order.");
      }

      const options = {
        key:
          orderData.keyId ||
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          "rzp_test_U03VsdhlsnDcGo",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Freelancer Project Hub",
        description: `Payment for Invoice #${project.invoice._id.slice(-6)}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setIsProcessingPayment(true);
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: project.invoice._id,
            });
            toast.success("Payment successful!");
            handlePaymentSuccess();
          } catch (verifyErr) {
            toast.error(verifyErr.message || "Payment verification failed.");
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        toast.error(response.error?.description || "Payment failed");
        setIsProcessingPayment(false);
      });
      paymentObject.open();
    } catch (error) {
      setIsProcessingPayment(false);
      toast.error(error.message || "Could not initiate payment.");
    }
  };

  const handlePaymentSuccess = () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      await fetchProjectData();
      setIsProcessingPayment(false);
    }, 2000);
  };

  const handleReviewSubmit = async () => {
    await fetchProjectData();
    setHasReviewed(true);
  };

  const handleInvoiceCreate = async (amount) => {
    try {
      await createInvoice(projectId, { amount });
      toast.success("Invoice created successfully!");
      fetchProjectData();
    } catch (error) {
      toast.error(error.message || "Failed to create invoice.");
    }
  };

  const handleProposalSubmit = async (proposalData) => {
    try {
      await submitProposal(projectId, proposalData);
      toast.success("Your proposal has been submitted!");
      setIsProposalModalOpen(false);
      setHasSubmitted(true);
    } catch (error) {
      toast.error(error.message || "Failed to submit proposal.");
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(projectId, taskId, newStatus);
      toast.success("Task status updated!");
      await fetchProjectData();
    } catch (error) {
      toast.error(error.message || "Failed to update task.");
    }
  };

  const handleCreateTask = async (title) => {
    try {
      await createTask(projectId, { title });
      toast.success("New task added!");
      setIsAddTaskModalOpen(false);
      await fetchProjectData();
    } catch (error) {
      toast.error(error.message || "Failed to add task.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-slate-200/70 rounded-3xl" />
        <div className="h-12 bg-slate-200/70 rounded-2xl w-96" />
        <div className="h-72 bg-slate-200/70 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl">
        <h3 className="font-bold text-slate-800">Project not found</h3>
      </div>
    );
  }

  const isProjectParticipant =
    user && (user._id === project.client?._id || user._id === project.freelancer?._id);
  const otherParticipant =
    user?._id === project.client?._id ? project.freelancer : project.client;
  const myReview = reviews.find((r) => r.reviewer?._id === user?._id);
  const reviewOfMe = reviews.find(
    (r) => r.reviewee === user?._id && r.project === projectId
  );

  const statusConfig = {
    open: {
      text: "Open for Proposals",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500 animate-pulse",
    },
    "in-progress": {
      text: "In Progress",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500 animate-pulse",
    },
    completed: {
      text: "Completed",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
  };

  const currentStatus = statusConfig[project.status] || {
    text: project.status,
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  const TabButton = ({ tabName, label, icon: Icon, badge }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
        activeTab === tabName
          ? "bg-blue-600 text-white shadow-xs shadow-blue-500/25"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
      }`}
    >
      <Icon size={17} />
      <span>{label}</span>
      {badge !== undefined && (
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === tabName
              ? "bg-blue-500 text-white"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );

  const renderBillingContent = () => {
    if (isProcessingPayment) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center bg-white p-12 rounded-3xl border border-slate-200/80 shadow-xs"
        >
          <LoaderCircle className="mx-auto h-10 w-10 text-blue-600 animate-spin" />
          <p className="font-bold text-base text-slate-900 mt-4">Verifying payment with Razorpay...</p>
          <p className="text-xs text-slate-500 mt-1">Please do not close this window.</p>
        </motion.div>
      );
    }
    return (
      <Billing
        project={project}
        invoice={project.invoice}
        user={user}
        onInitiatePayment={handleInitiatePayment}
        onPaymentSuccess={handlePaymentSuccess}
        onInvoiceCreate={handleInvoiceCreate}
      />
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Participant Workspace View */}
        {isProjectParticipant ? (
          <div>
            {/* Header Workspace Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <Link to="/dashboard" className="hover:text-blue-600">Projects</Link>
                    <span>/</span>
                    <span className="text-slate-700">Workspace #{projectId.slice(-6).toUpperCase()}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {project.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                    {currentStatus.text}
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/80">
                    ₹{project.budget?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Participants Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Client */}
                  <div className="flex items-center gap-2">
                    {project.client?.profilePictureUrl ? (
                      <img
                        src={project.client.profilePictureUrl}
                        alt={project.client.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {project.client?.name?.charAt(0) || "C"}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900">{project.client?.name}</p>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Client</span>
                    </div>
                  </div>

                  <span className="text-slate-300">✦</span>

                  {/* Freelancer */}
                  {project.freelancer ? (
                    <div className="flex items-center gap-2">
                      {project.freelancer.profilePictureUrl ? (
                        <img
                          src={project.freelancer.profilePictureUrl}
                          alt={project.freelancer.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {project.freelancer.name?.charAt(0) || "F"}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900">{project.freelancer.name}</p>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Freelancer</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Freelancer not assigned</span>
                  )}
                </div>

                {/* Right quick launchers for video call & chat */}
                {otherParticipant && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startVideoCall(otherParticipant, project._id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Video size={15} />
                      <span>Start Video Call</span>
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={15} />
                      <span>Chat</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Reviews banner */}
            {project.status === "completed" && (
              <div>
                {!hasReviewed && (
                  <LeaveReviewForm project={project} onReviewSubmit={handleReviewSubmit} />
                )}
                {hasReviewed && (
                  <ReviewDisplayCard title="Your Submitted Review" review={myReview} />
                )}
                {otherParticipant && (
                  <ReviewDisplayCard
                    title={`Review from ${otherParticipant.name}`}
                    review={reviewOfMe}
                  />
                )}
              </div>
            )}

            {/* Segmented Workspace Tabs */}
            <div className="mb-6 flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
              <TabButton tabName="overview" label="Overview" icon={Briefcase} />
              <TabButton tabName="tasks" label="Kanban Tasks" icon={ListTodo} badge={tasks.length} />
              <TabButton tabName="deliverables" label="Deliverables" icon={FileText} />
              <TabButton tabName="billing" label="Billing & Payments" icon={DollarSign} />
            </div>

            {/* Tab Panels */}
            <div>
              {activeTab === "overview" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Project Description & Scope</h3>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    {project.description}
                  </div>
                </div>
              )}

              {activeTab === "tasks" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Task Board</h3>
                      <p className="text-xs text-slate-500">Track and organize milestones collaboratively.</p>
                    </div>
                    <button
                      onClick={() => setIsAddTaskModalOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle size={15} />
                      <span>Add Task</span>
                    </button>
                  </div>
                  <TaskBoard tasks={tasks} onStatusChange={handleTaskStatusChange} />
                </div>
              )}

              {activeTab === "deliverables" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-slate-900">Project Deliverables Hub</h3>
                    <p className="text-xs text-slate-500">Upload completed work, assets, and design files.</p>
                  </div>
                  <Deliverables project={project} />
                </div>
              )}

              {activeTab === "billing" && renderBillingContent()}
            </div>
          </div>
        ) : (
          /* Non-Participant Public/Marketplace View */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {currentStatus.text}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {project.title}
                </h1>
                <p className="text-xs text-slate-500">
                  Posted by{" "}
                  <Link
                    to={`/profile/${project.client?._id}`}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {project.client?.name || "Client"}
                  </Link>{" "}
                  on {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Client Budget
                </span>
                <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  ₹{project.budget?.toLocaleString()}
                </p>
              </div>
            </div>

            {project.status === "in-progress" && project.freelancer && (
              <div className="my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center font-medium">
                This project has already been awarded to{" "}
                <Link
                  to={`/profile/${project.freelancer._id}`}
                  className="font-bold underline"
                >
                  {project.freelancer.name}
                </Link>
                . Proposals are no longer accepted.
              </div>
            )}

            <div className="my-8">
              <h3 className="font-bold text-base text-slate-900 mb-3">Project Overview</h3>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {project.description}
              </div>
            </div>

            {/* Proposal Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-center">
              {user?.role === "freelancer" && project.status === "open" && !hasSubmitted && (
                <button
                  onClick={() => setIsProposalModalOpen(true)}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Submit a Proposal</span>
                  <ArrowRight size={17} />
                </button>
              )}

              {user?.role === "freelancer" && hasSubmitted && (
                <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-3 px-6 rounded-xl">
                  <CheckCircle size={18} className="text-emerald-600" />
                  <span>You have already submitted a proposal for this project</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Button for Participants */}
      {isProjectParticipant && otherParticipant && (
        <>
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer"
            title={`Chat with ${otherParticipant.name}`}
          >
            <MessageSquare size={24} />
          </button>
          <ProjectChat
            project={project}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </>
      )}

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onSubmit={handleProposalSubmit}
        projectTitle={project?.title}
      />
    </>
  );
};

export default ProjectDetail;
