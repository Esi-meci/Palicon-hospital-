import React, { useState, useEffect } from "react";
import { 
  Calendar, FileText, Plus, ShieldAlert, Sparkles, AlertCircle, Clock, Trash2, CheckCircle2, UploadCloud, Eye, BrainCircuit 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function parseAppointmentDateTime(dateStr: string, timeStr: string): Date | null {
  try {
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) {
      const d = new Date(`${dateStr} ${timeStr}`);
      return isNaN(d.getTime()) ? null : d;
    }
    let [_, hoursStr, minutesStr, ampm] = match;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (ampm.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    } else if (ampm.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }
    
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const dateObj = new Date(year, month, day, hours, minutes, 0, 0);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  } catch (err) {
    return null;
  }
}
import { Appointment, MedicalReport, UserProfile, Doctor } from "../types";

interface PatientDashboardProps {
  user: UserProfile;
  appointments: Appointment[];
  reports: MedicalReport[];
  doctors: Doctor[];
  onCancelAppointment: (id: string) => Promise<void>;
  onAddReport: (reportDetails: { diagnosis: string; notes: string; doctorName: string; fileName: string; fileData: string }) => Promise<void>;
  onBookDoctorDirectly: (doctor: Doctor) => void;
  onInstantBook: (details: { doctorId: string; doctorName: string; doctorSpecialty: string; date: string; time: string; notes: string }) => Promise<void>;
}

export default function PatientDashboard({
  user,
  appointments,
  reports,
  doctors,
  onCancelAppointment,
  onAddReport,
  onBookDoctorDirectly,
  onInstantBook
}: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<"appointments" | "vault">("appointments");
  
  // Instant quick booking form states
  const [selectedDocId, setSelectedDocId] = useState("");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("");
  const [aptNotes, setAptNotes] = useState("");
  const [isBookingInstant, setIsBookingInstant] = useState(false);
  const [bookingInstantSuccess, setBookingInstantSuccess] = useState(false);
  const [bookingInstantError, setBookingInstantError] = useState<string | null>(null);

  const handleInstantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId || !aptDate || !aptTime || !aptNotes) {
      setBookingInstantError("Please resolve all scheduler parameters first.");
      return;
    }
    const matchingDoc = doctors.find((d) => d.id === selectedDocId);
    if (!matchingDoc) {
      setBookingInstantError("Selected doctor records not indexed in clinical registry.");
      return;
    }

    try {
      setIsBookingInstant(true);
      setBookingInstantError(null);
      setBookingInstantSuccess(false);

      await onInstantBook({
        doctorId: matchingDoc.id,
        doctorName: matchingDoc.name,
        doctorSpecialty: matchingDoc.specialty,
        date: aptDate,
        time: aptTime,
        notes: aptNotes,
      });

      setBookingInstantSuccess(true);
      setSelectedDocId("");
      setAptDate("");
      setAptTime("");
      setAptNotes("");
      
      // Auto-clear success notification after 5 seconds
      setTimeout(() => setBookingInstantSuccess(false), 5000);
    } catch (err) {
      setBookingInstantError(err instanceof Error ? err.message : "Failed to record booking");
    } finally {
      setIsBookingInstant(false);
    }
  };
  
  // Custom states for synthetic report upload
  const [isOpenUploader, setIsOpenUploader] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Gemini Brief State
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [geminiBrief, setGeminiBrief] = useState<string | null>(null);
  const [isCompilingBrief, setIsCompilingBrief] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);

  // Filter user specific logs
  const userAppointments = appointments.filter(a => a.patientId === user.uid);
  const userReports = reports.filter(r => r.patientId === user.uid);

  // Local state notification system for appointments:
  // Detects and signals alerts that are exactly 48h, 24h, and 5h before each upcoming booked session.
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("palicon_dismissed_alerts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dismissAlert = (alertKey: string) => {
    const updated = [...dismissedAlerts, alertKey];
    setDismissedAlerts(updated);
    try {
      localStorage.setItem("palicon_dismissed_alerts", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const now = new Date();
  
  const appointmentAlerts = userAppointments
    .filter(apt => apt.status !== "cancelled" && apt.status !== "completed")
    .flatMap(apt => {
      const aptDateObj = parseAppointmentDateTime(apt.date, apt.time);
      if (!aptDateObj) return [];
      
      const diffMs = aptDateObj.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const alertsForThisApt = [];

      // 5 hours before threshold
      if (diffHours > 0 && diffHours <= 5) {
        const key = `${apt.id}_5h`;
        if (!dismissedAlerts.includes(key)) {
          alertsForThisApt.push({
            key,
            aptId: apt.id,
            doctorName: apt.doctorName,
            time: apt.time,
            title: "Urgent: Session is Starting Soon!",
            message: `Your appointment with ${apt.doctorName} is in less than 5 hours (scheduled for ${apt.time} today). Please be ready!`,
            type: "urgent", // red/amber
            timeLeftLabel: `${Math.ceil(diffHours)} hours remaining`
          });
        }
      } 
      // 24 hours before threshold
      else if (diffHours > 5 && diffHours <= 24) {
        const key = `${apt.id}_24h`;
        if (!dismissedAlerts.includes(key)) {
          alertsForThisApt.push({
            key,
            aptId: apt.id,
            doctorName: apt.doctorName,
            time: apt.time,
            title: "Appointment Reminder (24h Alert)",
            message: `Your appointment with ${apt.doctorName} is in less than 24 hours (scheduled for ${apt.date} at ${apt.time}).`,
            type: "warning", // yellow/emerald-amber
            timeLeftLabel: "Less than 24 hours"
          });
        }
      }
      // 48 hours before threshold
      else if (diffHours > 24 && diffHours <= 48) {
        const key = `${apt.id}_48h`;
        if (!dismissedAlerts.includes(key)) {
          alertsForThisApt.push({
            key,
            aptId: apt.id,
            doctorName: apt.doctorName,
            time: apt.time,
            title: "Upcoming Appointment Notice (48h)",
            message: `Attending reminder: Appointment scheduled with ${apt.doctorName} is coming up in less than 48 hours (scheduled for ${apt.date} at ${apt.time}).`,
            type: "info", // cool blue/gray
            timeLeftLabel: "Less than 48 hours"
          });
        }
      }

      return alertsForThisApt;
    });

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis || !doctorName || !fileName || !fileData) {
      setUploadError("Please provide all required clinical file parameters.");
      return;
    }

    try {
      setUploadError(null);
      setIsUploading(true);
      await onAddReport({
        diagnosis,
        notes,
        doctorName,
        fileName,
        fileData
      });
      setDiagnosis("");
      setNotes("");
      setDoctorName("");
      setFileName("");
      setFileData("");
      setIsOpenUploader(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to record report");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerBrief = async (report: MedicalReport) => {
    setSelectedReport(report);
    setGeminiBrief(null);
    setBriefError(null);
    setIsCompilingBrief(true);

    try {
      const res = await fetch("/api/analyze-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diagnosis: report.diagnosis,
          notes: report.notes,
          patientName: user.name
        })
      });

      if (!res.ok) {
        throw new Error("Failed response from health brief server");
      }

      const data = await res.json();
      setGeminiBrief(data.analysis);
    } catch (err) {
      setBriefError(err instanceof Error ? err.message : "Failure loading report briefs");
    } finally {
      setIsCompilingBrief(false);
    }
  };

  // Helper to parse simple markdown to bullet HTML elements to avoid import problems
  const renderBriefText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.trim().startsWith("###") || line.trim().startsWith("##")) {
        return <h4 key={i} className="text-sm font-bold text-emerald-950 font-sans mt-4 border-b border-emerald-50 pb-1">{line.replace(/[#*]/g, "").trim()}</h4>;
      }
      if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
        return <li key={i} className="text-xs text-emerald-900/70 py-0.5 list-disc ml-4 font-sans">{line.replace(/^[-*]\s*/, "").replace(/\*\*/g, "").trim()}</li>;
      }
      if (line.trim().match(/^\d+\./)) {
        return <h5 key={i} className="text-xs font-bold text-emerald-900 font-sans mt-3">{line.replace(/\*\*/g, "").trim()}</h5>;
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-xs text-emerald-900/60 leading-relaxed font-sans">{line.replace(/\*\*/g, "").trim()}</p>;
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left Side: Patient Profile & Statistics Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-extrabold text-2xl uppercase flex items-center justify-center">
                {user.name[0]}
              </div>
              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 px-2 py-0.5 rounded font-mono uppercase">
                  Patient Profile
                </span>
                <h2 className="text-lg font-bold text-emerald-950 font-sans mt-1">{user.name}</h2>
                <p className="text-xs text-emerald-900/50 block font-mono">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-emerald-50 pt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                <span className="text-2xl font-extrabold text-emerald-950 block">{userAppointments.length}</span>
                <span className="text-[10px] text-emerald-900/50 uppercase font-mono font-bold">Appointments</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center font-sans">
                <span className="text-2xl font-extrabold text-emerald-950 block">{userReports.length}</span>
                <span className="text-[10px] text-emerald-900/50 uppercase font-mono font-bold">Vault Files</span>
              </div>
            </div>
          </div>

          {/* Secure Health ID Badge */}
          <div className="bg-emerald-800 text-white p-6 rounded-2xl shadow-md border border-emerald-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-700/30 rounded-full translate-x-8 -translate-y-8" />
            <span className="text-[9px] font-mono tracking-widest text-emerald-300 uppercase font-bold block">Hospital Admission Brief</span>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-emerald-300 block">Patient ID:</span>
                  <span className="font-mono font-bold truncate block">{user.uid.slice(0, 10)}...</span>
                </div>
                <div>
                  <span className="text-emerald-300 block">Status Desk:</span>
                  <span className="font-bold">Active Care</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-200/90 leading-relaxed pt-2 border-t border-emerald-700/60 font-sans">
                🔐 Dynamic cloud authorization rules are active. Only healthcare staff with explicit roles can look up admissions.
              </div>
            </div>
          </div>

          {/* Way 1: ⚡ Instant Inline Appointment Scheduler Form */}
          <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-emerald-50 pb-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 font-sans uppercase tracking-wider font-mono">Quick Scheduler</h4>
                <p className="text-[10px] text-emerald-900/40 uppercase font-mono font-bold">Way 1: Instant Secure Booking</p>
              </div>
            </div>

            <form onSubmit={handleInstantSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-950 uppercase font-mono tracking-wider">Select Specialist</label>
                <select
                  required
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-sans cursor-pointer text-emerald-955 font-medium"
                >
                  <option value="">-- Choose attending doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-950 uppercase font-mono tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-hidden text-emerald-955 font-semibold font-mono cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-950 uppercase font-mono tracking-wider">Session Time</label>
                  <select
                    required
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-hidden text-emerald-955 font-semibold font-mono cursor-pointer"
                  >
                    <option value="">-- Slots --</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-950 uppercase font-mono tracking-wider">Symptoms Note</label>
                <textarea
                  placeholder="e.g. routine checkup, allergy treatment"
                  required
                  rows={2}
                  value={aptNotes}
                  onChange={(e) => setAptNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-hidden text-emerald-955 font-sans"
                />
              </div>

              {bookingInstantError && (
                <div className="text-[10px] text-rose-700 bg-rose-50 border border-rose-100 p-2 rounded-lg font-bold font-sans">
                  {bookingInstantError}
                </div>
              )}

              {bookingInstantSuccess && (
                <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-extrabold font-sans">
                  ✓ Slot reserved successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={isBookingInstant}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-xs uppercase tracking-wider font-mono"
              >
                {isBookingInstant ? "Booking..." : "Submit Secure Reservation"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Tab Workspace */}
        <div className="lg:col-span-2 space-y-6">

          {/* Dynamic Appointment Alert Reminders */}
          <AnimatePresence>
            {appointmentAlerts.length > 0 && (
              <div className="space-y-3 bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between border-b border-rose-100/40 pb-2">
                  <span className="text-xs font-bold text-emerald-950 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                    APPOINTMENT NOTICES ({appointmentAlerts.length})
                  </span>
                  <span className="text-[10px] text-emerald-900/40">Real-time schedule monitoring</span>
                </div>
                
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {appointmentAlerts.map((alert) => {
                    const urgentColor = "bg-rose-50/70 border-rose-200 text-rose-950";
                    const warningColor = "bg-amber-50/70 border-amber-200 text-amber-950";
                    const infoColor = "bg-sky-50/70 border-sky-200 text-sky-950";
                    
                    let colorClasses = infoColor;
                    let iconBg = "bg-sky-500 text-white";
                    if (alert.type === "urgent") {
                      colorClasses = urgentColor;
                      iconBg = "bg-rose-600 text-white";
                    } else if (alert.type === "warning") {
                      colorClasses = warningColor;
                      iconBg = "bg-amber-500 text-white";
                    }

                    return (
                      <motion.div
                        key={alert.key}
                        initial={{ opacity: 0, scale: 0.98, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className={`border rounded-xl p-3.5 flex gap-3 relative shadow-xs ${colorClasses}`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Clock className="w-4 h-4 animate-pulse" />
                        </div>
                        <div className="flex-1 pr-14 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs sm:text-sm font-sans">{alert.title}</h4>
                            <span className="text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 rounded-md bg-white/70 border border-black/5">
                              {alert.timeLeftLabel}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-emerald-950/80 mt-1 leading-relaxed">
                            {alert.message}
                          </p>
                        </div>
                        <button
                          onClick={() => dismissAlert(alert.key)}
                          className="absolute right-3 top-3.5 text-black/40 hover:text-rose-700 font-bold text-xs cursor-pointer p-1 transition-colors hover:bg-black/5 rounded uppercase tracking-wider font-mono text-[10px]"
                          title="Dismiss alert"
                        >
                          Dismiss
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </AnimatePresence>
          
          {/* Tabs Selector Navigation */}
          <div className="flex border-b border-emerald-100">
            <button
              onClick={() => setActiveTab("appointments")}
              id="patient-tab-appointments"
              className={`pb-3 px-6 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "appointments"
                  ? "text-emerald-700 border-b-2 border-emerald-600"
                  : "text-emerald-900/40 hover:text-emerald-800"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Appointments
              </span>
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              id="patient-tab-vault"
              className={`pb-3 px-6 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "vault"
                  ? "text-emerald-700 border-b-2 border-emerald-600"
                  : "text-emerald-900/40 hover:text-emerald-800"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Clinical Vault ({userReports.length})
              </span>
            </button>
          </div>

          {/* Tab Content: Appointments History */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-sans font-bold text-lg text-emerald-950">Appointments Schedule</h3>
                <span className="text-xs text-emerald-900/40 font-mono">Real-time status tracking</span>
              </div>

              {userAppointments.length > 0 ? (
                <div className="space-y-3">
                  {userAppointments.map((apt) => {
                    const isCancelled = apt.status === "cancelled";
                    const isPending = apt.status === "pending";
                    return (
                      <div 
                        key={apt.id} 
                        className="bg-white border border-emerald-100 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-emerald-950 text-sm font-sans">{apt.doctorName}</h4>
                            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold font-mono">
                              {apt.doctorSpecialty}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-xs text-emerald-900/60 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" /> {apt.time}
                            </span>
                          </div>

                          {apt.notes && (
                            <p className="text-xs text-emerald-950 bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed font-sans mt-2 max-w-xl">
                              <span className="font-semibold text-emerald-800">Your Symptoms Note:</span> {apt.notes}
                            </p>
                          )}
                        </div>

                        {/* Status tag & Cancel Button */}
                        <div className="flex sm:flex-col items-end gap-3 justify-between shrink-0">
                          <motion.span
                            key={apt.status}
                            initial={{ scale: 0.85, opacity: 0.5, y: -2 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold leading-none border transition-colors duration-300 ${
                              apt.status === "confirmed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                              apt.status === "cancelled" ? "bg-rose-100 text-rose-800 border-rose-200" :
                              apt.status === "completed" ? "bg-slate-100 text-slate-800 border-slate-200" :
                              "bg-amber-100 text-amber-800 border-amber-200" // pending
                            }`}
                          >
                            {apt.status}
                          </motion.span>

                          {isPending && (
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to cancel this booking slot?")) {
                                  onCancelAppointment(apt.id);
                                }
                              }}
                              id={`cancel-apt-${apt.id}`}
                              className="text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl py-12 px-4 text-center border border-emerald-100 space-y-2">
                  <p className="text-sm font-semibold text-emerald-950">You have no active appointment reservations.</p>
                  <p className="text-xs text-emerald-900/50">Schedule a specialty care visit from our medical professional directory or use one of the quick direct booking options below.</p>
                </div>
              )}

              {/* Way 2: Interactive Specialists Referral Cards list-view */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="border-b border-emerald-50 pb-3 flex justify-between items-center flex-wrap gap-2 text-left">
                  <div>
                    <h3 className="font-sans font-bold text-sm text-emerald-950">Recommended Hospital Panels</h3>
                    <p className="text-[10px] text-emerald-900/40 uppercase font-mono font-bold">Way 2: Book via Specialist Referral Cards</p>
                  </div>
                  <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50/70 py-0.5 px-2 rounded-md font-mono">Modal Trigger</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.slice(0, 4).map((doc) => {
                    const lowercaseName = doc.name.toLowerCase();
                    const isFemale = lowercaseName.includes("ngozi") || 
                                     lowercaseName.includes("funmilayo") || 
                                     lowercaseName.includes("amina") || 
                                     lowercaseName.includes("sarah") || 
                                     lowercaseName.includes("elena") || 
                                     lowercaseName.includes("chloe") ||
                                     lowercaseName.includes("yusuf") ||
                                     lowercaseName.includes("achebe");
                    const placeholderPic = isFemale 
                      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop";

                    return (
                      <div key={doc.id} className="border border-emerald-50 rounded-xl p-4 bg-slate-50/50 flex items-center gap-3 justify-between hover:border-emerald-200 transition-colors text-left group">
                        <div className="flex items-center gap-3">
                          <img 
                            src={doc.image || placeholderPic} 
                            alt={doc.name} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = placeholderPic;
                            }}
                            className="w-11 h-11 rounded-full object-cover shrink-0 border border-emerald-100" 
                          />
                          <div className="text-left">
                            <h4 className="font-bold text-xs text-emerald-950 font-sans">{doc.name}</h4>
                            <span className="text-[9px] bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded font-bold font-mono uppercase">
                              {doc.specialty}
                            </span>
                            <div className="text-[10px] text-emerald-900/50 block font-mono mt-0.5">{doc.availability}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => onBookDoctorDirectly(doc)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 p-2 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                          title={`Schedule Session with ${doc.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Tab Content: Health Records Clinical Vault */}
          {activeTab === "vault" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-sans font-bold text-lg text-emerald-950">My Medical Records Vault</h3>
                  <p className="text-xs text-emerald-900/50">Keep reports synchronized. View or review clinical briefs.</p>
                </div>
                <button
                  onClick={() => setIsOpenUploader(!isOpenUploader)}
                  id="patient-add-report-btn"
                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Record
                </button>
              </div>

              {/* Collapsible synthetic brief uploader */}
              {isOpenUploader && (
                <form onSubmit={handleUploadReport} className="bg-white border border-emerald-100 rounded-2xl p-5 space-y-4 shadow-xs text-left">
                  <h4 className="text-sm font-bold text-emerald-950 font-sans border-b border-emerald-50 pb-2 flex items-center gap-1">
                    <UploadCloud className="w-4 h-4 text-emerald-600" /> Sync Diagnostic Document
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Primary Diagnosis</label>
                      <input
                        type="text"
                        placeholder="e.g. Hypertension, Iron Deficiency"
                        required
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Attending Doctor Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Robert Chen"
                        required
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Clinical Note File Name</label>
                      <input
                        type="text"
                        placeholder="e.g. blood-examination-may26.pdf"
                        required
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Report Clinical Content / Data</label>
                      <input
                        type="text"
                        placeholder="e.g. Sys: 140, Dia: 90, Pulse: 82 bpm"
                        required
                        value={fileData}
                        onChange={(e) => setFileData(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Clinical Remarks / Symptoms Recap</label>
                    <textarea
                      placeholder="Enter other comments or details about the diagnosis..."
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                    />
                  </div>

                  {uploadError && (
                    <div className="border border-rose-100 bg-rose-50 text-rose-700 p-2 text-xs font-semibold rounded-lg">
                      {uploadError}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpenUploader(false)}
                      className="text-xs font-bold text-emerald-950 border border-emerald-100 px-4 py-2 rounded-xl hover:bg-emerald-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      id="save-vault-doc-btn"
                      className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl"
                    >
                      {isUploading ? "Uploading..." : "Save to Clinical Vault"}
                    </button>
                  </div>
                </form>
              )}

              {userReports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="bg-white border border-emerald-100 rounded-xl p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="bg-emerald-50 text-emerald-800 font-bold font-mono px-2 py-0.5 rounded text-[9px] uppercase">
                            Report ID: {report.id.slice(0, 5)}
                          </span>
                          <span className="text-[10px] text-emerald-900/40 font-mono">
                            {report.uploadedAt && typeof report.uploadedAt.toDate === "function" 
                              ? report.uploadedAt.toDate().toLocaleDateString()
                              : "Recently Uploaded"}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-emerald-950 text-sm font-sans truncate">{report.diagnosis}</h4>
                          <p className="text-xs text-emerald-900/50 leading-none">Attending Practitioner: {report.doctorName}</p>
                        </div>

                        <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-lg text-xs space-y-1.5 font-mono">
                          <div>
                            <span className="text-emerald-950 font-bold">Doc Name:</span> <span className="text-emerald-800">{report.fileName}</span>
                          </div>
                          <div>
                            <span className="text-emerald-950 font-bold">Lab Data:</span> <span className="text-emerald-900/70">{report.fileData}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-emerald-50 mt-4">
                        <button
                          onClick={() => handleTriggerBrief(report)}
                          id={`brief-trigger-${report.id}`}
                          className="w-full inline-flex justify-center items-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          <BrainCircuit className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                          Compile Gemini Health Brief
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl py-12 px-4 text-center border border-emerald-100">
                  <p className="text-sm font-semibold text-emerald-950">Vault file directories are empty.</p>
                  <p className="text-xs text-emerald-900/50 mt-1">Upload verified medical diagnostics or lab sheets to request summaries.</p>
                </div>
              )}

              {/* Gemini Brief Render Drawer / Modal */}
              {selectedReport && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative text-left shadow-xs mt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                      <div>
                        <h4 className="text-base font-bold text-emerald-950 font-sans">Gemini AI Health Advisor</h4>
                        <p className="text-[10px] text-emerald-900/50 uppercase tracking-widest font-mono font-bold">Report Review Match</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedReport(null); setGeminiBrief(null); }}
                      className="text-emerald-900/40 hover:text-emerald-950 text-sm font-bold cursor-pointer"
                    >
                      Clear Brief
                    </button>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-emerald-100 space-y-3 shadow-xs">
                    <div className="grid grid-cols-2 gap-2 text-xs border-b border-emerald-50 pb-2">
                      <div>
                        <span className="text-emerald-950 font-bold">Analyzing Record:</span> {selectedReport.diagnosis}
                      </div>
                      <div>
                        <span className="text-emerald-950 font-bold">Staff:</span> {selectedReport.doctorName}
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none pt-2 font-sans space-y-2">
                      {isCompilingBrief && (
                        <div className="flex items-center justify-center gap-2 py-8 text-xs text-emerald-800 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-bounce" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                          Generating smart recommendations...
                        </div>
                      )}

                      {briefError && (
                        <div className="text-xs text-rose-700 font-semibold p-2 border border-rose-100 bg-rose-50 rounded-lg">
                          Failed to analyze report content: {briefError}
                        </div>
                      )}

                      {geminiBrief && renderBriefText(geminiBrief)}
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-900/40 italic leading-relaxed text-center font-sans">
                    ⚠ Disclaimer: AI Summaries are automatic, private diagnostic assistants and do not replace formal, live clinical diagnostics.
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
