import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  HiTicket,
  HiXMark,
  HiClock,
  HiArrowRight,
  HiCalendar,
  HiCurrencyRupee,
} from "react-icons/hi2";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this ticket booking request?"
      )
    ) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-medium">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      {/* Neumorphic Profile Banner */}
      <div className="neu-flat-lg rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl neu-inset text-slate-800 flex items-center justify-center text-2xl font-black uppercase shrink-0">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#25272a] tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>{" "}
              Verified Account Dashboard
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl neu-button text-xs font-bold text-slate-800 shrink-0"
        >
          <HiTicket className="w-4 h-4" /> Explore Events
        </Link>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-300/40 pb-4">
        <h2 className="text-lg font-bold text-[#25272a] flex items-center gap-2">
          <HiTicket className="w-5 h-5 text-slate-600" /> My Ticket Requests
        </h2>
        <span className="text-xs font-bold text-slate-600 neu-badge px-3 py-1 rounded-full">
          {bookings.length} Total
        </span>
      </div>

      {/* Bookings Grid */}
      {bookings.length === 0 ? (
        <div className="neu-flat rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 neu-inset rounded-2xl flex items-center justify-center mx-auto text-slate-500">
            <HiTicket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#25272a]">
              No ticket requests found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
              You haven't reserved any event tickets yet. Explore upcoming
              events and reserve your seats now.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl neu-button text-xs font-bold text-slate-800"
          >
            Browse All Events <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="neu-flat rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                {booking.eventId ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-[#25272a] text-sm leading-snug line-clamp-2">
                        {booking.eventId.title}
                      </h3>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider neu-badge ${
                            booking.status === "confirmed"
                              ? "text-emerald-800 font-extrabold"
                              : booking.status === "cancelled"
                                ? "text-rose-800 font-extrabold"
                                : "text-amber-800 font-extrabold"
                          }`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider neu-badge text-slate-700">
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-slate-600 neu-inset p-3.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <HiCalendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(booking.eventId.date).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiCurrencyRupee className="w-4 h-4 text-slate-400" />
                        <span>
                          {booking.amount === 0
                            ? "Free Ticket"
                            : `₹${booking.amount}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <HiClock className="w-4 h-4" />
                        <span>
                          Booked{" "}
                          {new Date(booking.bookedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-rose-600 italic">
                    Event details unavailable
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-slate-300/30 flex items-center justify-between text-xs font-bold">
                {booking.eventId && booking.status !== "cancelled" ? (
                  <>
                    <Link
                      to={`/events/${booking.eventId._id}`}
                      className="text-slate-800 hover:underline flex items-center gap-1"
                    >
                      View Details <HiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                    >
                      <HiXMark className="w-4 h-4" /> Cancel
                    </button>
                  </>
                ) : (
                  <span className="text-slate-400 italic mx-auto">
                    Booking Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
