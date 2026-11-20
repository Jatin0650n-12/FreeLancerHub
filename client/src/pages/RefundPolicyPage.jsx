import React from "react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { RotateCcw, Clock, AlertCircle } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Cancellation & Refund Policy
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: November 2026 • FreeLancerHub
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview</h2>
              <p>
                At <strong>FreeLancerHub</strong>, we want to ensure complete transparency in how project milestones, cancellations, and refunds are handled. This Cancellation & Refund Policy explains our procedures for resolving milestone disputes and processing refunds.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Project Cancellation Policy</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Cancellation Prior to Project Commencement:</strong> If a client hires a freelancer and cancels the contract before any deliverables or tasks have been started by the freelancer, the client is eligible for a <strong>100% full refund</strong> of any upfront milestone payment.
                </li>
                <li>
                  <strong>Cancellation During In-Progress Milestones:</strong> If work has already begun, mutual agreement between the client and freelancer is required. Partial payment will be compensated for completed work, and the remaining unspent milestone balance will be refunded to the client.
                </li>
                <li>
                  <strong>Mutual Cancellation:</strong> Both parties can mutually agree to terminate a contract at any stage through the project workspace.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Milestone Refund Eligibility</h2>
              <p>Refunds may be requested under the following conditions:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>The freelancer failed to deliver the agreed-upon project specifications or missed agreed deadlines without prior notice.</li>
                <li>The work delivered does not meet the clear technical requirements documented in the proposal.</li>
                <li>A duplicate or accidental payment was made by the client on an invoice.</li>
              </ul>
              <p className="mt-2 text-xs text-slate-500 italic">
                * Note: Once a client reviews, accepts a milestone, and releases payment, that milestone is considered settled and non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Refund Processing Time & Method</h2>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 my-3">
                <Clock size={20} className="text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">Standard Processing Window:</p>
                  <p className="mt-1">
                    Approved refunds are initiated within <strong>24–48 hours</strong> and will be credited back to the customer's original payment source (UPI, Card, or Netbanking account via Razorpay) within <strong>5 to 7 business days</strong>, subject to the issuing bank's settlement cycle.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. How to Request a Refund</h2>
              <p>
                To request a refund or raise a billing dispute:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 mt-2">
                <li>Email our support team at <a href="mailto:jatingoyal.1722@gmail.com" className="text-blue-600 font-semibold hover:underline">jatingoyal.1722@gmail.com</a> with the subject <em>"Refund Request - [Project / Invoice ID]"</em>.</li>
                <li>Include your registered email address, project title, and a brief description of the issue.</li>
                <li>Our support desk will review the project chat and task logs and respond within 24 hours.</li>
              </ol>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
