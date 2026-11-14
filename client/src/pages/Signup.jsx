import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Laptop,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/register", form);
      const { token, user } = res.data;

      login({ token, user });
      toast.success("Welcome aboard! Account created successfully.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-blue-100/50 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles size={20} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Freelancer<span className="text-blue-600">Hub</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the modern workspace for clients and top freelance talent.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-10">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("freelancer")}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    form.role === "freelancer"
                      ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Laptop
                    size={20}
                    className={form.role === "freelancer" ? "text-blue-600" : "text-slate-400"}
                  />
                  <div className="mt-2">
                    <p className={`font-bold text-sm ${form.role === "freelancer" ? "text-blue-900" : "text-slate-900"}`}>
                      Freelancer
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Find work & get paid
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("client")}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    form.role === "client"
                      ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Briefcase
                    size={20}
                    className={form.role === "client" ? "text-blue-600" : "text-slate-400"}
                  />
                  <div className="mt-2">
                    <p className={`font-bold text-sm ${form.role === "client" ? "text-blue-900" : "text-slate-900"}`}>
                      Client
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Post jobs & hire talent
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Alex Rivera"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
