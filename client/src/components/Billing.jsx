import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  ArrowRight,
  Send,
} from 'lucide-react';

const Billing = ({ project, invoice, user, onInitiatePayment, onInvoiceCreate }) => {
  const [amount, setAmount] = useState(project.budget || '');

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    onInvoiceCreate(Number(amount));
  };

  // Freelancer view
  if (user?._id === project.freelancer?._id) {
    if (invoice) {
      const isPaid = invoice.status === 'paid';
      return (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto">
          <div className="text-center space-y-3">
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {isPaid ? <CheckCircle2 size={28} /> : <Clock size={28} />}
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {isPaid ? 'Invoice Paid in Full' : 'Invoice Dispatched'}
            </h3>

            <p className="text-xs text-slate-500">
              {isPaid
                ? 'Payment has been settled and the project is marked complete.'
                : 'Waiting for client review and Razorpay settlement.'}
            </p>

            <div className="my-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Amount Due
              </span>
              <p className="text-4xl font-extrabold text-slate-900 mt-1">
                ₹{invoice.amount?.toLocaleString()}
              </p>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPaid ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'
                    }`}
                  />
                  {isPaid ? 'Settled & Verified' : 'Awaiting Payment'}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Generate Milestone Invoice</h3>
            <p className="text-xs text-slate-500">
              Deliverables completed? Request payment from the client.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateInvoice} className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Invoice Amount (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 pr-4 py-3 block w-full bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                placeholder="Enter amount"
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Defaulted to project budget of ₹{project.budget?.toLocaleString()}.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Send size={16} />
            <span>Send Invoice to Client</span>
          </button>
        </form>
      </div>
    );
  }

  // Client view
  if (user?._id === project.client?._id) {
    if (!invoice) {
      return (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Clock size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Invoice Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            The freelancer has not generated an invoice for this project yet. They will submit it upon completing the milestones.
          </p>
        </div>
      );
    }

    const isPaid = invoice.status === 'paid';

    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payment Request
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Invoice #{invoice._id.slice(-6).toUpperCase()}
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isPaid ? 'Paid & Completed' : 'Pending Payment'}
          </span>
        </div>

        {/* Itemized breakdown */}
        <div className="my-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Project Services:</span>
            <span className="font-semibold text-slate-900">{project.title}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Freelancer:</span>
            <span className="font-semibold text-slate-900">{project.freelancer?.name || 'Assigned Freelancer'}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Platform Fee:</span>
            <span className="text-emerald-600 font-semibold">Free (₹0)</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span className="font-bold text-slate-900">Total Payable:</span>
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{invoice.amount?.toLocaleString()}
            </span>
          </div>
        </div>

        {!isPaid ? (
          <div className="space-y-4">
            <button
              onClick={onInitiatePayment}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Lock size={18} />
              <span>Proceed to Pay via Razorpay</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Secured 256-bit payment • UPI, Netbanking, Cards accepted</span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 font-semibold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>This invoice has been successfully paid and verified!</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Billing;
