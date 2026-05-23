import React, { useState } from "react";
import { X, Calendar, Clock, Contact, FileClock, ShieldAlert, LogIn } from "lucide-react";
import { Doctor } from "../types";
import { TIME_SLOTS } from "../data";

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onConfirm: (bookingDetails: { date: string; time: string; notes: string }) => Promise<void>;
  isAuthenticated: boolean;
  onLoginTrigger: () => void;
}

export default function BookingModal({
  doctor,
  onClose,
  onConfirm,
  isAuthenticated,
  onLoginTrigger
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!doctor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setError("Please pick an appointment date.");
      return;
    }
    if (!selectedTime) {
      setError("Please select a convenient time slot.");
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await onConfirm({
        date: selectedDate,
        time: selectedTime,
        notes
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent selecting past dates
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-emerald-50 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex justify-between items-center relative">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-200 uppercase font-bold block">Appointment Desk</span>
            <h3 className="text-xl font-sans font-bold text-white mt-1">Book Consultation</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:bg-emerald-700/50 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
          
          {/* Doctor Brief Card */}
          <div className="bg-slate-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-cover rounded-xl border border-emerald-200" 
            />
            <div>
              <span className="bg-emerald-100 text-emerald-800 font-bold font-mono px-2 py-0.5 rounded text-[9px] uppercase">
                {doctor.specialty}
              </span>
              <h4 className="font-bold text-emerald-950 font-sans mt-0.5">{doctor.name}</h4>
              <p className="text-xs text-emerald-900/50 mt-0.5 leading-none">Feeds: ${doctor.fees} USD / Consultation</p>
            </div>
          </div>

          {!isAuthenticated ? (
            /* Warning Shield for Unauthenticated users */
            <div className="border border-amber-200 bg-amber-50/50 p-5 rounded-2xl space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-emerald-950 text-sm">Security Authentication Required</h5>
                <p className="text-xs text-emerald-900/60 leading-relaxed px-2">
                  To protect clinical data and sync consultation logs securely, you must sign in before booking an appointment.
                </p>
              </div>
              <button
                onClick={onLoginTrigger}
                id="booking-security-login-btn"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Auth Gate Login
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Pick a Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Choose Consultation Date
                </label>
                <input
                  type="date"
                  min={today}
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              {/* Time Slots Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> Select Available Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 text-center rounded-lg text-xs font-semibold border transition-all ${
                        selectedTime === slot
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white border-slate-200 text-emerald-950 hover:bg-emerald-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Context */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1">
                  <Contact className="w-3.5 h-3.5 text-emerald-600" /> Symptoms / Symptoms Notes
                </label>
                <textarea
                  placeholder="Tell us about the symptoms you are seeking care for (e.g., cold, joint ache, dry cough)..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-lg text-xs font-semibold leading-relaxed">
                  {error}
                </div>
              )}

              {/* Action Rows */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="confirm-booking-submit-btn"
                  className="w-full h-11 inline-flex justify-center items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <FileClock className="w-4 h-4" />
                  {isSubmitting ? "Saving Booking..." : "Lock Booking Slot"}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
