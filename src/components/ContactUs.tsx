import React, { useState } from "react";
import { 
  Building2, Phone, Mail, Clock, ShieldCheck, HeartPulse, Send, CheckCircle2, AlertTriangle, ShieldAlert, BadgeCheck
} from "lucide-react";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface ContactUsProps {
  onSuccessMessage: (msg: string) => void;
}

export default function ContactUs({ onSuccessMessage }: ContactUsProps) {
  // Input form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Support Inquiry");
  const [message, setMessage] = useState("");
  const [errorInput, setErrorInput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSent, setSuccessSent] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorInput("Please complete all required fields (Name, Email, Message).");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorInput("Please provide a valid email format.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorInput(null);

      const inquiryId = `inq-${Date.now()}`;
      const newInquiry = {
        id: inquiryId,
        visitorName: name,
        visitorEmail: email,
        visitorPhone: phone || "No Phone",
        subject: subject,
        message: message,
        status: "pending",
        createdAt: Timestamp.now()
      };

      // Write direct to firestore under /inquiries/{inquiryId}
      await setDoc(doc(db, "inquiries", inquiryId), newInquiry);

      // Trigger success states
      setSuccessSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      onSuccessMessage("Support inquiry submitted. Our clinical helpdesk will message back shortly!");
    } catch (err) {
      console.error("Failed to submit inquiry to firestore", err);
      setErrorInput("Failed to sync your message. Please check connection guidelines.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        
        {/* Urgent Emergency Banner block */}
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-xl animate-pulse">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950 font-sans uppercase tracking-wide">24/7 Clinical Emergency Line</h3>
              <p className="text-xs text-rose-900/60 font-sans">Are you or a loved one in need of immediate emergency services or ambulance dispatch?</p>
            </div>
          </div>
          <a
            href="tel:+2348072606299"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-sm shadow-rose-200 shrink-0"
          >
            <Phone className="w-4 h-4" /> Call +234 807 260 6299
          </a>
        </div>

        {/* Content Columns: Form and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Details & Custom Map Iframe */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold font-mono tracking-wider py-1 px-2.5 rounded uppercase">
                  Palicon Helplines
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 mt-2 font-sans">Corporate Facility Info</h2>
                <p className="text-xs text-emerald-900/50">Visit us or send direct inquiries. We are active across standard telecom channels.</p>
              </div>

              {/* Contact Specific Keys */}
              <div className="space-y-4">
                <div className="flex gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 font-sans uppercase tracking-wider font-mono">Hospital Address</h4>
                    <p className="text-xs text-emerald-900/60 leading-relaxed font-sans mt-0.5">
                      PALICON HOSPITAL, 1 Popoola Odusami Street, Balogun Lane, Abule Folly, Lagos 105101, Lagos, Nigeria
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/fFxvqoR8BGFxkPf29"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-950 underline mt-2 transition-colors cursor-pointer"
                    >
                      🗺️ Open Google Maps &rarr;
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 font-sans uppercase tracking-wider font-mono">Clinical Enquiries</h4>
                    <p className="text-xs text-emerald-900/60 leading-none font-sans mt-0.5">
                      +234 807 260 6299
                    </p>
                    <a href="https://wa.me/2348072606299" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold underline block mt-1">
                      Start custom WhatsApp chat &rarr;
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 border border-indigo-100 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 font-sans uppercase tracking-wider font-mono">Email Communications</h4>
                    <p className="text-xs text-emerald-900/60 font-sans mt-0.5">
                      desk@paliconhospital.org
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-100 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 font-sans uppercase tracking-wider font-mono">Clinical Hours</h4>
                    <p className="text-xs text-emerald-900/60 leading-relaxed font-sans mt-0.5">
                      Open 24 Hours / 7 Days a Week (Round-the-clock Clinic consults, ER triage, Diagnostics, and Surgery)
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">
                      Active 24/7/365 Non-stop
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google map iframe */}
            <div className="bg-white p-3 rounded-3xl border border-emerald-50 shadow-sm overflow-hidden h-64 relative">
              <iframe
                title="Palicon Hospital Map"
                src="https://maps.google.com/maps?q=PALICON%20HOSPITAL,%201%20Popoola%20Odusami%20Street,%20Lagos,%20Nigeria&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full rounded-2xl border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Block: Interactive form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-sans">Clinical Enquiries Form</h2>
              <p className="text-xs text-emerald-900/50">Submit an inquiry block. Support messages are reviewed by logistics admins directly.</p>
            </div>

            {successSent ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <BadgeCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 font-sans text-sm">Inquiry Lodged Safely!</h4>
                  <p className="text-xs text-emerald-900/60 leading-relaxed font-sans mt-1 max-w-sm mx-auto">
                    Thanks for reaching out. We have registered your support ticket in our secure clinical queue. An attendee will follow up via email or phone.
                  </p>
                </div>
                <button
                  onClick={() => setSuccessSent(false)}
                  className="text-xs font-bold text-emerald-700 bg-white border border-emerald-100 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Your Full Name <span className="text-rose-600">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Your Email address <span className="text-rose-600">*</span></label>
                    <input
                      type="email"
                      placeholder="e.g. john@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Phone Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. +234 812 345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Category / Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-semibold text-emerald-950"
                    >
                      <option value="General Support Inquiry">General Support Inquiry</option>
                      <option value="Appointment Escalation">Appointment Escalation</option>
                      <option value="Medical Vault Help">Medical Records / Vault Help</option>
                      <option value="Billing Details Enquiry">Billing Details & Payments</option>
                      <option value="Feedback / Complaint">Feedback or Complaint</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-950 uppercase font-mono">Inquiry Message Content <span className="text-rose-600">*</span></label>
                  <textarea
                    placeholder="Provide full clinical context, symptoms notes, or administrative questions..."
                    rows={5}
                    required
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-hidden focus:border-emerald-500 font-sans"
                  />
                  <div className="text-[10px] text-emerald-900/40 text-right">
                    {message.length}/2000 characters
                  </div>
                </div>

                {errorInput && (
                  <div className="text-xs font-bold border border-rose-100 bg-rose-50 text-rose-700 p-2.5 rounded-xl flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> {errorInput}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-inquiry-btn"
                  className="w-full inline-flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-md shadow-emerald-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    "Sending Secure Inquiry..."
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Send Clinical Inquiries
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
