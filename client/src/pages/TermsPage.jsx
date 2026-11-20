import React from "react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { FileText, ShieldAlert, CheckCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: November 2026 • FreeLancerHub
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview & Acceptance of Terms</h2>
              <p>
                Welcome to <strong>FreeLancerHub</strong> ("we," "our," or "us"). By accessing or using our platform via <a href="https://free-lancer-hub.vercel.app" className="text-blue-600 hover:underline">https://free-lancer-hub.vercel.app</a> or any associated services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Services Offered</h2>
              <p>
                FreeLancerHub provides an online marketplace and collaboration software enabling clients to post projects and hire freelancers for digital services (such as software development, design, and writing). The platform provides task tracking (Kanban), direct messaging, milestone invoicing, and secure payment processing.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. User Accounts & Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>You must provide accurate, current, and complete information during registration.</li>
                <li>You are solely responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You agree not to use the platform for any illegal, fraudulent, or abusive activities.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Payments & Billing</h2>
              <p>
                All project milestone payments are processed through our authorized payment gateway partner, <strong>Razorpay Software Private Limited</strong>. By making a payment, you agree to Razorpay's terms and privacy policies.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Payments are quoted and settled in Indian Rupees (INR ₹) unless explicitly stated otherwise.</li>
                <li>Clients agree to pay invoices generated for approved milestones and agreed deliverables.</li>
                <li>Applicable taxes and transaction processing charges may apply as detailed during checkout.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Intellectual Property</h2>
              <p>
                Upon complete invoice settlement, ownership of deliverables created by the freelancer transfers to the client, unless otherwise agreed in writing between the two parties. FreeLancerHub retains full proprietary rights over its website, software, and brand assets.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">6. Limitation of Liability</h2>
              <p>
                FreeLancerHub provides the platform on an "as is" and "as available" basis. To the fullest extent permitted by Indian law, FreeLancerHub shall not be liable for indirect, incidental, or consequential damages resulting from user interactions or service outages.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">7. Governing Law & Jurisdiction</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Haryana, India.
              </p>
            </section>

            <section className="pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-1">Contact for Terms Inquiries</h2>
              <p>
                For questions regarding these Terms, contact us at: <a href="mailto:jatingoyal.1722@gmail.com" className="text-blue-600 font-semibold hover:underline">jatingoyal.1722@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
