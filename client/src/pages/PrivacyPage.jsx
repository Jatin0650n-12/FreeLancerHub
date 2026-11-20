import React from "react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: November 2026 • FreeLancerHub
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Introduction</h2>
              <p>
                At <strong>FreeLancerHub</strong>, accessible from <a href="https://free-lancer-hub.vercel.app" className="text-blue-600 hover:underline">https://free-lancer-hub.vercel.app</a>, one of our main priorities is the privacy of our visitors and registered users. This Privacy Policy outlines what information we collect, how it is used, and how it is secured.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Information We Collect</h2>
              <p>We collect information to provide better services to all our users, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Personal Identification Details:</strong> Name, email address, password (stored encrypted using bcrypt), role (Client or Freelancer), profile picture, skills, and bio.</li>
                <li><strong>Project & Workspace Data:</strong> Project titles, descriptions, bid proposals, task boards, deliverables, and direct messages.</li>
                <li><strong>Payment Transaction Data:</strong> Invoicing history, Razorpay Order IDs, and payment verification signatures. <em>(Note: We never store your full credit/debit card numbers or UPI PINs; these are processed securely by Razorpay)</em>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To operate, maintain, and provide the core features of the platform.</li>
                <li>To enable real-time messaging, notifications, and collaboration between clients and freelancers.</li>
                <li>To process invoices and facilitate secure settlements via Razorpay.</li>
                <li>To protect against fraud, unauthorized transactions, and system abuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Payment Gateway Data & Security</h2>
              <p>
                All online transactions are processed through <strong>Razorpay</strong>, which complies with <strong>PCI-DSS (Payment Card Industry Data Security Standard) Level 1</strong> guidelines. Your payment information is encrypted in transit using industry-standard TLS/SSL protocols.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Data Sharing & Third Parties</h2>
              <p>
                We do not sell, trade, or rent users' personal identification information to third parties. We only share information with trusted third-party service providers (such as MongoDB Atlas for database hosting, Cloudinary for file attachments, and Razorpay for payment processing) strictly to deliver our platform features.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">6. User Rights & Data Retention</h2>
              <p>
                You have the right to access, update, or request deletion of your account and personal data at any time through your Profile Settings or by emailing our privacy contact.
              </p>
            </section>

            <section className="pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-1">Privacy Officer Contact</h2>
              <p>
                If you have questions or suggestions about our Privacy Policy, please contact us at: <a href="mailto:jatingoyal.1722@gmail.com" className="text-blue-600 font-semibold hover:underline">jatingoyal.1722@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
