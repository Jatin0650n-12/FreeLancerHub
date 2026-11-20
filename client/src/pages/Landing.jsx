import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicFooter from "../components/PublicFooter";
import {
  ArrowRight,
  CheckCircle2,
  KanbanSquare,
  MessageSquare,
  FileCheck2,
  Briefcase,
  Users,
  ShieldCheck,
  Zap,
  Sparkles,
  DollarSign,
  Star,
  ChevronRight,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen overflow-x-hidden">
      {/* Modern Top Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles size={18} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Freelancer<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Gradient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-6 shadow-xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            Next-Gen Freelance Collaboration Platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
          >
            Where Client & Freelancer{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Projects Thrive.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Eliminate endless email threads and disorganized spreadsheets. Manage bids,
            interactive Kanban tasks, Cloudinary file deliverables, real-time Socket.IO chat,
            and secure Razorpay payouts—in one cohesive workspace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-base border border-slate-200/90 shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              Sign In to Workspace
            </Link>
          </motion.div>

          <p className="mt-4 text-xs text-slate-500 font-medium">
            ✓ Free 14-day client & freelancer onboarding • No credit card required
          </p>

          {/* Interactive UI Mockup Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 relative mx-auto max-w-4xl rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-200/80"
          >
            <div className="rounded-xl border border-slate-200/70 bg-slate-900 text-slate-100 p-5 text-left overflow-hidden">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400">
                    freelancerprojecthub.workspace / live-collaboration
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Connected & Synchronized
                </span>
              </div>

              {/* Mock Dashboard Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Column 1: Task Board */}
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <KanbanSquare size={14} className="text-blue-400" /> In Progress
                    </span>
                    <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">3 Tasks</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs">
                      <p className="font-medium text-slate-100">Design Mobile Component Kit</p>
                      <p className="text-[10px] text-slate-400 mt-1">Due today • High Priority</p>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs">
                      <p className="font-medium text-slate-100">Implement Razorpay Gateway</p>
                      <p className="text-[10px] text-emerald-400 mt-1">✓ Automated Verification</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Live Chat */}
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                      <MessageSquare size={14} className="text-emerald-400" /> Project Chat
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-700/60 p-2 rounded-lg">
                        <span className="font-bold text-blue-400 text-[10px]">Client:</span>
                        <p className="text-slate-200">The latest release looks fantastic!</p>
                      </div>
                      <div className="bg-blue-600/30 border border-blue-500/30 p-2 rounded-lg ml-3">
                        <span className="font-bold text-blue-300 text-[10px]">Freelancer:</span>
                        <p className="text-slate-100">Deliverable uploaded. Ready for review!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Invoicing & Payment */}
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-amber-400" /> Milestone Billing
                    </span>
                    <span className="text-emerald-400 font-bold text-xs">₹45,000</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-medium">Ready for Release</span>
                    </div>
                    <div className="w-full py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded text-center text-xs font-semibold flex items-center justify-center gap-1">
                      <Lock size={12} /> Pay Securely via Razorpay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="border-y border-slate-200/80 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">₹25M+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Total Payouts Processed</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">10,000+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Verified Freelancers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">99.8%</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">On-Time Deliveries</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 tracking-tight">Instant</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">UPI & Card Settlement</p>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
            All-In-One Workspace
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Built for High-Trust Collaboration
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Everything your agency or freelance business needs, without bloated tools or disconnected apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <KanbanSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Live Kanban Workflow</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Track project progression in real-time across To Do, In Progress, and Done stages with instant updates for clients and freelancers.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Real-Time Chat & Alerts</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Communicate contextually within dedicated project workspaces or via 1-on-1 direct messages powered by Socket.IO.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Razorpay Payments</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Effortless milestone settlements with UPI, Netbanking, and Credit/Debit cards. Automatic project completion upon verified payment.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <FileCheck2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">File Delivery Hub</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Secure Cloudinary media storage. Upload deliverables, assets, contracts, and revisions with organized versioning.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Social Feed & Connections</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Connect with peers, share updates, discover job postings, and build your freelance reputation with verified client reviews.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Custom Bidding & Proposals</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Freelancers propose tailored bids with estimated completion dates. Clients review, negotiate, and accept with a single click.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Ready to upgrade your freelance workflow?
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Join hundreds of forward-thinking clients and freelancers delivering high-impact projects together.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-white text-blue-900 rounded-xl font-bold text-base shadow-lg hover:bg-slate-100 transition-all hover:scale-[1.02]"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-blue-800/80 hover:bg-blue-800 text-white rounded-xl font-bold text-base border border-blue-500/50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Mandatory Compliance Footer for Razorpay / RBI verification */}
      <PublicFooter />
    </div>
  );
}
