import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import {
  HiUser,
  HiEnvelope,
  HiLockClosed,
  HiShieldCheck,
  HiSparkles,
  HiExclamationTriangle,
  HiCheckCircle,
} from "react-icons/hi2";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!showOTP) {
        const { data } = await api.post("/auth/register", formData);
        setShowOTP(true);
        setSuccessMsg(
          data.message ||
            "OTP sent to your email. Please verify to activate your account."
        );
      } else {
        await api.post("/auth/verify-otp", { email: formData.email, otp });
        setSuccessMsg("Account verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="neu-flat-lg p-8 sm:p-10 rounded-3xl space-y-6">
        {/* Neumorphic Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center mx-auto text-slate-700">
            <HiSparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#25272a] tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Join Eventify today
          </p>
        </div>

        {error && (
          <div className="neu-inset p-3.5 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2">
            <HiExclamationTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="neu-inset p-3.5 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
            <HiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOTP ? (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <HiUser className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <HiEnvelope className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <HiLockClosed className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative flex items-center">
                <HiShieldCheck className="absolute left-4 text-slate-600 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="123456"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-center font-bold tracking-widest text-base neu-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 neu-button-accent rounded-2xl text-xs font-extrabold uppercase tracking-wider disabled:opacity-50 mt-4"
          >
            {loading
              ? "Processing..."
              : showOTP
                ? "Verify OTP & Complete Setup"
                : "Create Account"}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-300/40 text-center text-xs font-semibold text-slate-500">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-slate-800 font-extrabold hover:underline"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
