import React, { useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you! Your message has been received.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
            Help & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Contact FreeLancerHub
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Have questions about milestone billing, accounts, or payment processing? We are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Cards */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Mail size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Email Support</h3>
              <p className="text-xs text-slate-500 mt-1">Direct inquiries & disputes</p>
              <a
                href="mailto:jatingoyal.1722@gmail.com"
                className="text-xs font-semibold text-blue-600 hover:underline block mt-2"
              >
                jatingoyal.1722@gmail.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Operating Hours</h3>
              <p className="text-xs text-slate-500 mt-1">Monday – Friday</p>
              <p className="text-xs font-semibold text-slate-700 mt-2">9:00 AM – 6:00 PM IST</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Response within 24-48 hours</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <MapPin size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Registered Office</h3>
              <p className="text-xs text-slate-500 mt-1">FreeLancerHub Platform</p>
              <p className="text-xs font-semibold text-slate-700 mt-2">Haryana, India</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs md:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Send us a Message</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and our support team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-emerald-900">Message Delivered</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Thank you for reaching out. We have received your inquiry and will reply to{" "}
                  <strong>{formData.email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="you@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Inquiry regarding milestone payment / invoice"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Provide details of your query..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

