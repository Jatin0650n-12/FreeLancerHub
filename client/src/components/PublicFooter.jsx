import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Mail, Heart } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Freelancer<span className="text-blue-500">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern collaboration workspace connecting elite freelancers and forward-thinking businesses with verified milestone payments.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck size={16} />
              <span>Secured by 256-bit Razorpay</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Freelancer Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal (Mandatory for Razorpay) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Have questions or need assistance with milestone billing or account support?
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail size={14} className="text-blue-400" />
                <a href="mailto:jatingoyal.1722@gmail.com" className="hover:underline">
                  jatingoyal.1722@gmail.com
                </a>
              </div>
              <p className="text-[11px] text-slate-500">
                Operational in Haryana, India • Support response within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FreeLancerHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/refund-policy" className="hover:text-slate-300 transition-colors">Refunds</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
