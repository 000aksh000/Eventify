import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  HiSparkles,
  HiTicket,
  HiUser,
  HiArrowRightOnRectangle,
  HiSquares2X2,
  HiShieldCheck,
} from "react-icons/hi2";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#eef0f3] neu-flat-sm border-b border-[#e2e8f0]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Neumorphic Brand Emblem Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-slate-700 group-hover:text-slate-900 transition-colors">
              <HiSparkles className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#25272a]">
              Eventify
            </span>
          </Link>

          {/* Neumorphic Nav Bar Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive("/")
                  ? "neu-inset text-slate-800 font-extrabold"
                  : "neu-button text-slate-600"
              }`}
            >
              <HiTicket className="w-4 h-4 opacity-70" />
              Events
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive("/admin") || isActive("/dashboard")
                      ? "neu-inset text-slate-800 font-extrabold"
                      : "neu-button text-slate-600"
                  }`}
                >
                  {user.role === "admin" ? (
                    <HiShieldCheck className="w-4 h-4 text-slate-700" />
                  ) : (
                    <HiSquares2X2 className="w-4 h-4 opacity-70" />
                  )}
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>

                <div className="h-5 w-px bg-slate-300/60 mx-1 hidden sm:block" />

                <div className="flex items-center gap-2.5 neu-inset rounded-xl px-3.5 py-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-300/60 text-slate-800 flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-[#25272a] hidden sm:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold neu-button text-slate-600 hover:text-rose-600 transition-all"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold neu-button text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold neu-button-accent"
                >
                  <HiUser className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
