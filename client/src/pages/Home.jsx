import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import {
    HiMagnifyingGlass,
    HiCalendar,
    HiMapPin,
    HiClock,
    HiTicket,
    HiShieldCheck,
    HiSparkles,
    HiArrowRight,
    HiUserGroup,
    HiXMark
} from 'react-icons/hi2';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 350);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen py-8 space-y-12">
            {/* Neumorphic Hero Container */}
            <section className="neu-flat-lg rounded-3xl p-8 md:p-14 text-[#25272a] text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 neu-badge px-4 py-2 rounded-full text-xs font-bold text-slate-700 tracking-wide uppercase mb-6">
                    <HiSparkles className="w-4 h-4 text-slate-600" />
                    Event Booking & Management
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight text-[#25272a]">
                    Discover & Experience <br />
                    <span className="text-slate-600">Extraordinary Events</span>
                </h1>

                <p className="text-slate-600 text-sm md:text-base mb-8 max-w-lg font-medium leading-relaxed">
                    Explore handpicked technology retreats, workshops, and exclusive conferences happening around you.
                </p>

                {/* Neumorphic Inset Search Bar */}
                <div className="w-full max-w-md relative flex items-center">
                    <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search events by title..."
                        className="w-full pl-12 pr-10 py-3.5 rounded-2xl text-xs font-bold neu-input placeholder:text-slate-400 placeholder:font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            title="Clear search"
                        >
                            <HiXMark className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </section>

            {/* Feature Highlight Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="neu-flat p-7 rounded-2xl flex flex-col items-start space-y-4">
                    <div className="w-12 h-12 rounded-xl neu-inset flex items-center justify-center text-slate-700 text-xl">
                        <HiClock className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#25272a]">Instant Ticket Booking</h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        Secure seats smoothly with real-time verification and automated email receipt delivery.
                    </p>
                </div>

                <div className="neu-flat p-7 rounded-2xl flex flex-col items-start space-y-4">
                    <div className="w-12 h-12 rounded-xl neu-inset flex items-center justify-center text-slate-700 text-xl">
                        <HiTicket className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#25272a]">Manage Bookings</h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        Access, view, or manage your event ticket requests anytime directly from your dashboard.
                    </p>
                </div>

                <div className="neu-flat p-7 rounded-2xl flex flex-col items-start space-y-4">
                    <div className="w-12 h-12 rounded-xl neu-inset flex items-center justify-center text-slate-700 text-xl">
                        <HiShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#25272a]">2FA Security</h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        Every transaction and registration is protected with standard email OTP verification.
                    </p>
                </div>
            </section>

            {/* Upcoming Events Grid */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-300/40 pb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-[#25272a] tracking-tight">Upcoming Events</h2>
                        <span className="neu-badge text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                            {events.length} Available
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500 font-medium">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="neu-flat rounded-2xl p-12 text-center text-slate-600 font-medium text-sm">
                        No events match your search terms. Try searching for a different keyword.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            const availablePercent = Math.max(0, Math.min(100, (event.availableSeats / event.totalSeats) * 100));
                            return (
                                <article
                                    key={event._id}
                                    className="neu-flat rounded-2xl overflow-hidden flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-200"
                                >
                                    {/* Image Container */}
                                    <div className="h-48 bg-slate-200/50 overflow-hidden relative">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg uppercase tracking-wider">
                                                {event.category || 'Event'}
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 neu-badge px-3 py-1 rounded-xl text-xs font-extrabold text-[#25272a]">
                                            {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                        <div>
                                            <span className="inline-block neu-badge text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                                                {event.category}
                                            </span>
                                            <h3 className="text-base font-bold text-[#25272a] line-clamp-1">
                                                {event.title}
                                            </h3>
                                        </div>

                                        <div className="space-y-2 text-xs font-semibold text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <HiCalendar className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>
                                                    {new Date(event.date).toLocaleDateString(undefined, {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <HiMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        {/* Progress & CTA */}
                                        <div className="pt-3 border-t border-slate-300/40 space-y-3">
                                            <div>
                                                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                                                    <span className="text-slate-500 flex items-center gap-1">
                                                        <HiUserGroup className="w-3.5 h-3.5" /> Seats
                                                    </span>
                                                    <span className="text-slate-700">
                                                        {event.availableSeats} left
                                                    </span>
                                                </div>
                                                <div className="w-full neu-inset rounded-full h-2 p-0.5 overflow-hidden">
                                                    <div
                                                        className="bg-slate-600 h-1.5 rounded-full transition-all duration-300"
                                                        style={{ width: `${availablePercent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <Link
                                                to={`/events/${event._id}`}
                                                className="w-full flex items-center justify-center gap-2 neu-button py-2.5 px-4 rounded-xl text-xs font-bold"
                                            >
                                                <span>View Details</span>
                                                <HiArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Subtle Neumorphic Footer */}
            <footer className="pt-12 pb-6 border-t border-slate-300/40 text-center space-y-3">
                <div className="inline-flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl neu-button flex items-center justify-center text-slate-700">
                        <HiSparkles className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-[#25272a]">Eventify</span>
                </div>
                <p className="text-slate-500 text-xs max-w-sm mx-auto font-medium">
                    Clean, full-stack event discovery & ticket reservation platform.
                </p>
                <div className="text-[11px] text-slate-400 font-semibold">
                    &copy; {new Date().getFullYear()} Eventify. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
