import React, { useState } from "react";
import { 
  Users, Calendar, Plus, Filter, ShieldAlert, Award, FileCheck2, Clock, Trash2, Check, CheckCircle2, RefreshCw, MessageSquare, Mail, Share2, Send 
} from "lucide-react";
import { Appointment, Doctor, MedicalReport, UserProfile, Inquiry } from "../types";
import { INITIAL_DOCTORS } from "../data";

interface AdminPanelProps {
  user: UserProfile;
  appointments: Appointment[];
  doctors: Doctor[];
  patients: UserProfile[];
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, newStatus: "confirmed" | "completed" | "cancelled") => Promise<void>;
  onAddDoctor: (newDoctor: Omit<Doctor, "rating">) => Promise<void>;
  onRemoveDoctor: (id: string) => Promise<void>;
  onReplyInquiry: (id: string, replyMessage: string) => Promise<void>;
}

export default function AdminPanel({
  user,
  appointments,
  doctors,
  patients,
  inquiries,
  onUpdateStatus,
  onAddDoctor,
  onRemoveDoctor,
  onReplyInquiry
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"appointments" | "doctors" | "patients" | "inquiries">("appointments");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // New Doctor Form States
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [docName, setDocName] = useState("");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState(100);
  const [availability, setAvailability] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  // Inquiry States
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Derive selected inquiry
  const selectedInquiry = (inquiries || []).find((i) => i.id === selectedInquiryId);

  const handleAdminReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryId || !replyText) return;
    try {
      setIsSendingReply(true);
      await onReplyInquiry(selectedInquiryId, replyText);
      setReplyText("");
    } catch (err) {
      console.error("AdminPanel reply submission error", err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    return statusFilter === "all" || apt.status === statusFilter;
  });

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !experience || !availability || !docEmail) {
      setDocError("Please input all required doctor parameters.");
      return;
    }

    try {
      setDocError(null);
      setIsSavingDoc(true);
      
      const newDocId = `doc-${Date.now()}`;
      // Generate standard picture featuring Black clinical specialists
      const randomImage = specialty === "Pediatrics" 
        ? "https://images.unsplash.com/photo-1651008011206-43c3919babcf?q=80&w=256&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=256&auto=format&fit=crop";

      await onAddDoctor({
        id: newDocId,
        name: docName,
        specialty,
        experience,
        fees: Number(fees),
        image: randomImage,
        availability,
        email: docEmail
      });

      setDocName("");
      setExperience("");
      setAvailability("");
      setDocEmail("");
      setIsOpenForm(false);
    } catch (err) {
      setDocError(err instanceof Error ? err.message : "Failed to record doctor registry");
    } finally {
      setIsSavingDoc(false);
    }
  };

  // Metric highlights
  const pendingCount = appointments.filter(a => a.status === "pending").length;
  const confirmedCount = appointments.filter(a => a.status === "confirmed").length;
  const totalRevenue = appointments
    .filter(a => a.status === "completed" || a.status === "confirmed")
    .reduce((val, a) => {
      const matchDoc = doctors.find(d => d.id === a.doctorId);
      return val + (matchDoc ? matchDoc.fees : 100);
    }, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        
        {/* Header section with credentials overview */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white font-mono px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                Admin Area
              </span>
              <span className="text-xs text-emerald-900/40">Credential: {user.email}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-sans mt-1">Hospital Logistics Panel</h1>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "appointments" ? "bg-emerald-600 text-white" : "bg-slate-100 text-emerald-950 hover:bg-slate-200"
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("doctors")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "doctors" ? "bg-emerald-600 text-white" : "bg-slate-100 text-emerald-950 hover:bg-slate-200"
              }`}
            >
              Doctors Manager
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "patients" ? "bg-emerald-600 text-white" : "bg-slate-100 text-emerald-950 hover:bg-slate-200"
              }`}
            >
              Admissions Directory ({patients.length})
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              id="admin-tab-inquiries"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "inquiries" ? "bg-emerald-600 text-white" : "bg-slate-100 text-emerald-950 hover:bg-slate-200"
              }`}
            >
              Support Chats
              {(inquiries || []).filter(i => i.status === "pending").length > 0 && (
                <span className="bg-rose-500 text-white rounded-full text-[9px] px-1 min-w-[16px] h-4 flex items-center justify-center font-bold">
                  {(inquiries || []).filter(i => i.status === "pending").length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard metrics highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[10px] text-emerald-900/40 uppercase tracking-widest font-mono font-bold block">Admitted Patients</span>
            <div className="text-3xl font-extrabold text-emerald-950 mt-1 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" /> {patients.length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[10px] text-emerald-900/40 uppercase tracking-widest font-mono font-bold block">Pending Consults</span>
            <div className="text-3xl font-extrabold text-amber-600 mt-1 flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-500 animate-pulse" /> {pendingCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[10px] text-emerald-900/40 uppercase tracking-widest font-mono font-bold block">Confirmed Care</span>
            <div className="text-3xl font-extrabold text-emerald-800 mt-1 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" /> {confirmedCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[10px] text-emerald-900/40 uppercase tracking-widest font-mono font-bold block">Accrued Fees Value</span>
            <div className="text-3xl font-extrabold text-emerald-950 mt-1">
              ${totalRevenue} USD
            </div>
          </div>
        </div>

        {/* TAB WORKSPACE: Appointments Logistics */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="text-lg font-bold text-emerald-950 font-sans">Hospital Appointment Logs</h2>
              
              {/* Filter controls */}
              <div className="flex items-center gap-2 bg-white p-2 border border-emerald-100 rounded-xl">
                <Filter className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-semibold text-emerald-950">Care State:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  id="admin-status-filter"
                  className="bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-lg text-xs font-semibold text-emerald-950 focus:outline-hidden"
                >
                  <option value="all">All Logs</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredAppointments.length > 0 ? (
              <div className="space-y-3">
                {filteredAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="bg-white border border-emerald-50 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4 text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                          apt.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                          apt.status === "cancelled" ? "bg-rose-100 text-rose-800" :
                          apt.status === "completed" ? "bg-slate-100 text-slate-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {apt.status}
                        </span>
                        <h4 className="font-bold text-emerald-950 text-sm font-sans">
                          {apt.patientName} &rarr; <span className="text-emerald-700">{apt.doctorName}</span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-emerald-900/60 font-mono">
                        <div>
                          <span className="font-semibold text-emerald-900/40">SPECIALTY:</span> {apt.doctorSpecialty}
                        </div>
                        <div>
                          <span className="font-semibold text-emerald-900/40">DATE:</span> {apt.date}
                        </div>
                        <div>
                          <span className="font-semibold text-emerald-900/40">TIME:</span> {apt.time}
                        </div>
                      </div>

                      {apt.notes && (
                        <p className="text-xs text-emerald-950 bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed font-sans max-w-2xl">
                          <span className="font-semibold text-emerald-800">Symptom Note:</span> {apt.notes}
                        </p>
                      )}
                    </div>

                    {/* Admin Status transition actions */}
                    <div className="flex gap-2 shrink-0 self-end md:self-center">
                      {apt.status === "pending" && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(apt.id, "confirmed")}
                            id={`admin-confirm-${apt.id}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Confirm Booking
                          </button>
                          <button
                            onClick={() => onUpdateStatus(apt.id, "cancelled")}
                            id={`admin-cancel-pending-${apt.id}`}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-100 text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {apt.status === "confirmed" && (
                        <button
                          onClick={() => onUpdateStatus(apt.id, "completed")}
                          id={`admin-complete-${apt.id}`}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl py-12 px-4 text-center border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-950">No hospital schedules match this status query.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB WORKSPACE: Doctors Management */}
        {activeTab === "doctors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-emerald-950 font-sans">Active Medical Registry</h2>
              <button
                onClick={() => setIsOpenForm(!isOpenForm)}
                id="admin-add-doctor-btn"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Register Specialist
              </button>
            </div>

            {/* REGISTER SPECIALIST COLLAPSIBLE FORM */}
            {isOpenForm && (
              <form onSubmit={handleCreateDoctor} className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-4 shadow-xs text-left">
                <h3 className="text-sm font-bold text-emerald-950 font-sans border-b border-emerald-50 pb-2 flex items-center gap-1">
                  <Award className="w-4 h-4 text-emerald-600" /> New Medical Professional Enrollment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Arthur Doyle"
                      required
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Medical Specialty</label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden font-semibold"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Professional Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Years"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Consultation Fees (USD)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={500}
                      value={fees}
                      onChange={(e) => setFees(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Practitioner Email</label>
                    <input
                      type="email"
                      placeholder="e.g. doyle@palicon.org"
                      required
                      value={docEmail}
                      onChange={(e) => setDocEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Weekly Availability (Serialized)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mon, Wed, Fri (9:00 AM - 1:00 PM)"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>

                {docError && (
                  <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 p-2 rounded-lg font-semibold">
                    {docError}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="text-xs font-bold text-emerald-950 border border-emerald-100 px-4 py-2 rounded-xl hover:bg-emerald-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDoc}
                    id="save-doctor-submit-btn"
                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl"
                  >
                    {isSavingDoc ? "Recording Registry..." : "Save Professional Record"}
                  </button>
                </div>
              </form>
            )}

            {/* Doctors lists display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div 
                  key={doc.id} 
                  className="bg-white border border-emerald-100 rounded-xl p-5 shadow-xs flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={doc.image} 
                      alt={doc.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl border border-emerald-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[8px] font-mono">
                          {doc.specialty}
                        </span>
                        <h4 className="font-bold text-emerald-950 text-sm font-sans">{doc.name}</h4>
                      </div>
                      <p className="text-[10px] text-emerald-900/50 mt-0.5 leading-none font-mono">ID: {doc.id} | Email: {doc.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove professional entry for ${doc.name}?`)) {
                        onRemoveDoctor(doc.id);
                      }
                    }}
                    id={`admin-remove-doc-${doc.id}`}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Registry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB WORKSPACE: Admitted Patients */}
        {activeTab === "patients" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 font-sans">Patient Profile Registry</h2>
            
            {patients.length > 0 ? (
              <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-emerald-100 font-mono font-bold text-emerald-900/60 uppercase">
                      <th className="p-4">Profile Name</th>
                      <th className="p-4">Secure Email Address</th>
                      <th className="p-4">Access Level</th>
                      <th className="p-4">Registered On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50 font-sans text-emerald-950">
                    {patients.map((pat) => (
                      <tr key={pat.uid} className="hover:bg-emerald-50/20">
                        <td className="p-4 font-bold">{pat.name}</td>
                        <td className="p-4 font-mono">{pat.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            pat.role === "admin" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                          }`}>
                            {pat.role}
                          </span>
                        </td>
                        <td className="p-4 font-mono">
                          {pat.createdAt && typeof pat.createdAt.toDate === "function"
                            ? pat.createdAt.toDate().toLocaleDateString()
                            : "Baseline User"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-2xl py-12 px-4 text-center border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-950">Patient admission list is empty.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB WORKSPACE: Support Inquiries Chats */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-emerald-950 font-sans">Live Support Chat & Inquiries</h2>
                <p className="text-xs text-emerald-900/50">Messages submitted through the public website or floated widgets.</p>
              </div>
            </div>

            {inquiries && inquiries.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Listing Column */}
                <div className="lg:col-span-1 bg-white border border-emerald-100 rounded-2xl p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider font-mono px-1">Inbox ({inquiries.length})</h3>
                  
                  <div className="space-y-2">
                    {inquiries.map((inq) => {
                      const isPending = inq.status === "pending";
                      return (
                        <button
                          key={inq.id}
                          onClick={() => setSelectedInquiryId(inq.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-2 cursor-pointer ${
                            selectedInquiryId === inq.id
                              ? "bg-emerald-50 border-emerald-200 shadow-xs"
                              : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-emerald-950 truncate max-w-[120px]">{inq.visitorName}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              isPending ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          
                          <p className="font-mono text-[10px] text-emerald-900/45 truncate">{inq.visitorEmail}</p>
                          <p className="text-emerald-950/70 line-clamp-2 leading-relaxed">{inq.message}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Conversation Panel */}
                <div className="lg:col-span-2">
                  {selectedInquiry ? (
                    <div className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-6 text-xs text-emerald-950">
                      
                      {/* Inquiry Header */}
                      <div className="border-b border-emerald-100 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase border border-emerald-100">
                            Ticket: {selectedInquiry.id}
                          </span>
                          <h3 className="text-base font-bold text-emerald-950 font-sans mt-2">{selectedInquiry.visitorName}</h3>
                          <div className="text-xs font-mono text-emerald-900/60 mt-1 flex flex-wrap gap-x-4">
                            <span>Email: {selectedInquiry.visitorEmail}</span>
                            {selectedInquiry.visitorPhone && <span>Phone: {selectedInquiry.visitorPhone}</span>}
                          </div>
                        </div>

                        {/* Forwarding quick-links helper */}
                        <div className="flex gap-2">
                          <a
                            href={`https://wa.me/2348072606299?text=${encodeURIComponent(
                              `Hello ${selectedInquiry.visitorName}, replying to your Palicon Hospital inquiry: "${selectedInquiry.message}"`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors"
                          >
                            <Share2 className="w-3 h-3 text-emerald-600" /> WhatsApp Forward
                          </a>
                          <a
                            href={`mailto:${selectedInquiry.visitorEmail}?subject=${encodeURIComponent(
                              `Re: ${selectedInquiry.subject || "Palicon Support Ticket"}`
                            )}&body=${encodeURIComponent(
                              `Dear ${selectedInquiry.visitorName},\n\nReplying to your inquiry:\n"${selectedInquiry.message}"\n\nBest regards,\nPalicon Hospital Care Team`
                            )}`}
                            className="inline-flex items-center gap-1 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors"
                          >
                            <Mail className="w-3 h-3" /> Email Forward
                          </a>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="font-mono text-[10px] text-emerald-900/40 uppercase font-black">Visitor Inquiry Statement:</span>
                          <p className="text-sm leading-relaxed text-emerald-950">{selectedInquiry.message}</p>
                          <div className="text-[10px] text-emerald-900/40 text-right pt-2 font-mono">
                            Sent at: {selectedInquiry.createdAt && typeof selectedInquiry.createdAt.toDate === "function"
                              ? selectedInquiry.createdAt.toDate().toLocaleString()
                              : "Baseline Sync"}
                          </div>
                        </div>

                        {/* Admin replies listing or answer block */}
                        {selectedInquiry.adminReply ? (
                          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-1">
                            <span className="font-mono text-[10px] text-emerald-700 uppercase font-black">Admin Helpdesk Response:</span>
                            <p className="text-sm leading-relaxed text-emerald-950 font-sans italic">"{selectedInquiry.adminReply}"</p>
                            <div className="text-[10px] text-emerald-900/40 text-right pt-2 font-mono">
                              Replied at: {selectedInquiry.repliedAt && typeof selectedInquiry.repliedAt.toDate === "function"
                                ? selectedInquiry.repliedAt.toDate().toLocaleString()
                                : "Just Now"}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-[11px] font-sans">
                            Ticket is pending response. Complete the input below to reply or use WhatsApp / Email forwards above.
                          </div>
                        )}
                      </div>

                      {/* Reply Editor Form */}
                      <form onSubmit={handleAdminReplySubmit} className="space-y-3 border-t border-emerald-50 pt-4">
                        <label className="text-[10px] font-bold text-emerald-950 uppercase font-mono">Draft Helpdesk Reply Address</label>
                        <div className="flex gap-2">
                          <textarea
                            placeholder="Type premium supportive message response..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            required
                            rows={3}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:border-emerald-500 font-sans"
                          />
                          <button
                            type="submit"
                            disabled={isSendingReply || !replyText}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            {isSendingReply ? "Sending..." : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      </form>

                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl py-24 text-center border border-emerald-100 text-xs font-semibold text-emerald-900/40">
                      Choose an inquiry thread on the left directory index to begin communications.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl py-16 px-4 text-center border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-900/40">Inbox is empty. No live inquiries detected.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
