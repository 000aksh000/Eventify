import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  HiCalendar,
  HiMapPin,
  HiUserGroup,
  HiCurrencyRupee,
  HiArrowLeft,
  HiShieldCheck,
  HiCheckCircle,
  HiExclamationTriangle,
} from "react-icons/hi2";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg(
          "OTP sent to your email address. Enter the code below to confirm booking.",
        );
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        setSuccessMsg(
          "Booking requested successfully! Your ticket request is pending admin approval.",
        );
        setShowOTP(false);
        setEvent({ ...event, availableSeats: event.availableSeats - 1 });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-medium">
        Loading event details...
      </div>
    );
  }
  if (error && !event) {
    return (
      <div className="text-center py-20 text-rose-500 font-medium">
        {error || "Event not found"}
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      {/* Neumorphic Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 neu-button px-4 py-2 rounded-xl text-xs font-bold text-slate-700 uppercase tracking-wider"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to all events
      </Link>

      {/* Neumorphic Main Container */}
      <div className="neu-flat-lg rounded-3xl overflow-hidden">
        {/* Event Image */}
        <div className="h-72 md:h-96 bg-slate-200/50 relative overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-extrabold text-3xl uppercase tracking-widest">
              {event.category}
            </div>
          )}
          <div className="absolute top-4 left-4 neu-badge text-slate-800 text-xs font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider">
            {event.category}
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Event Content */}
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#25272a] tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                {event.description}
              </p>
            </div>

            {/* Neumorphic Sidebar Card */}
            <div className="w-full lg:w-80 neu-flat p-6 rounded-2xl shrink-0 space-y-6">
              <h3 className="text-sm font-extrabold text-[#25272a] border-b border-slate-300/40 pb-3 uppercase tracking-wider">
                Ticket Details
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <HiCurrencyRupee className="w-4 h-4 text-slate-400" /> Price
                  </span>
                  <span className="font-extrabold text-sm text-[#25272a]">
                    {event.ticketPrice === 0 ? "FREE" : `₹${event.ticketPrice}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <HiUserGroup className="w-4 h-4 text-slate-400" />{" "}
                    Availability
                  </span>
                  <span className="font-bold text-slate-700">
                    <span
                      className={
                        event.availableSeats < 10
                          ? "text-amber-700 font-black"
                          : ""
                      }
                    >
                      {event.availableSeats}
                    </span>{" "}
                    / {event.totalSeats}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <HiCalendar className="w-4 h-4 text-slate-400" /> Date
                  </span>
                  <span className="font-bold text-slate-700">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <HiMapPin className="w-4 h-4 text-slate-400" /> Location
                  </span>
                  <span className="font-bold text-slate-700 text-right truncate max-w-[140px]">
                    {event.location}
                  </span>
                </div>
              </div>

              {/* OTP Box */}
              {showOTP && (
                <div className="pt-3 border-t border-slate-300/40 space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Email Verification OTP
                  </label>
                  <div className="relative flex items-center">
                    <HiShieldCheck className="absolute left-3 text-slate-600 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="6-digit OTP"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-center font-bold tracking-widest text-xs neu-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="neu-inset p-3 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <HiExclamationTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="neu-inset p-3 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <HiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                  isSoldOut || (successMsg && !showOTP)
                    ? "neu-button text-slate-400 cursor-not-allowed opacity-60"
                    : "neu-button-accent"
                }`}
              >
                {bookingLoading
                  ? "Processing..."
                  : showOTP
                    ? "Verify OTP & Confirm Booking"
                    : successMsg && !showOTP
                      ? "Request Submitted"
                      : isSoldOut
                        ? "Event Sold Out"
                        : "Register & Reserve Ticket"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
