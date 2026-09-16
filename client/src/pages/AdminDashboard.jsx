import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  HiCurrencyRupee,
  HiUserGroup,
  HiClock,
  HiPlus,
  HiTrash,
  HiCheck,
  HiXMark,
  HiShieldCheck,
  HiTicket,
  HiCalendar,
} from "react-icons/hi2";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/my"),
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      setShowEventForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      setBookings((prev) => prev.filter((b) => b.eventId?._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Delete Event Error:", error);
      alert(error.response?.data?.message || "Error deleting event");
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error cancelling booking");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-medium">
        Loading admin dashboard...
      </div>
    );
  }

  const totalRevenue = bookings.reduce(
    (sum, b) =>
      b.paymentStatus === "paid" && b.status === "confirmed"
        ? sum + b.amount
        : sum,
    0
  );
  const paidClientsCount = new Set(
    bookings
      .filter((b) => b.paymentStatus === "paid" && b.status === "confirmed")
      .map((b) => b.userId?._id)
  ).size;
  const pendingRequestsCount = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8">
      {/* Neumorphic Admin Header Banner */}
      <div className="neu-flat-lg rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl neu-inset text-slate-700 flex items-center justify-center shrink-0">
            <HiShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#25272a] tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Manage events, inspect revenue analytics, and approve ticket
              requests.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="w-full md:w-auto flex items-center justify-center gap-2 neu-button-accent py-3 px-5 rounded-2xl text-xs font-extrabold uppercase tracking-wider shrink-0"
        >
          <HiPlus className="w-4 h-4" />
          {showEventForm ? "Cancel Creation" : "Create New Event"}
        </button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="neu-flat p-6 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-[#25272a]">
              ₹{totalRevenue}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl neu-inset text-slate-700 flex items-center justify-center text-xl font-bold">
            <HiCurrencyRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="neu-flat p-6 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Paid Clients
            </p>
            <h3 className="text-3xl font-black text-[#25272a]">
              {paidClientsCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl neu-inset text-slate-700 flex items-center justify-center text-xl font-bold">
            <HiUserGroup className="w-6 h-6" />
          </div>
        </div>

        <div className="neu-flat p-6 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Pending Requests
            </p>
            <h3 className="text-3xl font-black text-[#25272a]">
              {pendingRequestsCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl neu-inset text-slate-700 flex items-center justify-center text-xl font-bold">
            <HiClock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Create Event Form */}
      {showEventForm && (
        <div className="neu-flat-lg p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-black text-[#25272a]">
            Create & Publish Event
          </h2>
          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              required
              type="text"
              placeholder="Event Title"
              className="px-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Category (e.g., Tech, Music, Design)"
              className="px-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              required
              type="date"
              className="px-4 py-3.5 rounded-2xl text-xs font-semibold neu-input text-slate-700"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Location"
              className="px-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Total Seats Capacity"
              className="px-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Ticket Price (0 for Free)"
              className="px-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
            />

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Image URL (Unsplash or direct image link)"
                className="w-full px-4 py-3.5 rounded-2xl text-xs font-semibold neu-input"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            <textarea
              required
              placeholder="Detailed Event Description..."
              className="px-4 py-3.5 rounded-2xl md:col-span-2 h-28 text-xs font-semibold neu-input"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <button
              type="submit"
              className="md:col-span-2 neu-button-accent font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider mt-2"
            >
              Publish Event Now
            </button>
          </form>
        </div>
      )}

      {/* Data Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* All Events Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300/40 pb-3">
            <h2 className="text-base font-bold text-[#25272a] flex items-center gap-2">
              <HiTicket className="w-5 h-5 text-slate-600" /> All Events
            </h2>
            <span className="text-xs font-bold neu-badge px-3 py-1 rounded-full text-slate-700">
              {events.length}
            </span>
          </div>

          <div className="neu-flat rounded-3xl p-4 overflow-hidden">
            <ul className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {events.length === 0 ? (
                <li className="p-8 text-center text-xs text-slate-500 font-medium">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="p-4 rounded-2xl neu-inset flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-[#25272a] text-xs truncate">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <HiCalendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span>
                          {event.availableSeats}/{event.totalSeats} seats left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {confirmDeleteId === event._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            disabled={deletingId === event._id}
                            className="px-3 py-1.5 neu-button bg-rose-600 text-rose-600 font-bold text-[11px] rounded-xl hover:bg-rose-700 transition"
                          >
                            {deletingId === event._id
                              ? "Deleting..."
                              : "Confirm Delete"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1.5 neu-button text-slate-500 rounded-xl text-xs"
                          >
                            <HiXMark className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(event._id)}
                          className="p-2 neu-button text-rose-600 hover:text-rose-700 rounded-xl shrink-0"
                          title="Delete event"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Booking Requests Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300/40 pb-3">
            <h2 className="text-base font-bold text-[#25272a] flex items-center gap-2">
              <HiClock className="w-5 h-5 text-slate-600" /> Ticket Booking
              Requests
            </h2>
            <span className="text-xs font-bold neu-badge px-3 py-1 rounded-full text-slate-700">
              {bookings.length}
            </span>
          </div>

          <div className="neu-flat rounded-3xl p-4 overflow-hidden">
            <ul className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {bookings.length === 0 ? (
                <li className="p-8 text-center text-xs text-slate-500 font-medium">
                  No booking requests yet.
                </li>
              ) : (
                bookings.map((booking) => (
                  <li
                    key={booking._id}
                    className="p-5 rounded-2xl neu-inset space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-[#25272a] text-xs leading-snug">
                        {booking.eventId?.title || "Deleted Event"}
                      </h4>
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
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 font-semibold">
                      <p className="flex justify-between">
                        <span className="text-slate-400">User:</span>
                        <span className="text-slate-800">
                          {booking.userId?.name} ({booking.userId?.email})
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-slate-800">
                          {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-400">Requested:</span>
                        <span>
                          {new Date(booking.bookedAt).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {booking.status === "pending" && (
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "paid")
                          }
                          className="flex-1 neu-button text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1 text-emerald-700"
                        >
                          <HiCheck className="w-3.5 h-3.5" /> Approve Paid
                        </button>
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "not_paid")
                          }
                          className="flex-1 neu-button text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1 text-slate-700"
                        >
                          <HiCheck className="w-3.5 h-3.5" /> Approve Free
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="neu-button text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1 text-rose-600"
                        >
                          <HiXMark className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
