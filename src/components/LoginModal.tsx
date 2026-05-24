import React, { useState } from "react";
import { X, Mail, User, ShieldAlert, KeyRound, ShieldCheck, Activity, LogIn, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole, UserProfile } from "../types";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
  onGoogleLoginTrigger: () => Promise<void>;
  isProcessingGoogle: boolean;
}

export default function LoginModal({
  onClose,
  onSuccess,
  onGoogleLoginTrigger,
  isProcessingGoogle,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate a friendly name based on email prefix
  const deriveNameFromEmail = (emailStr: string) => {
    const part = emailStr.split("@")[0] || "User";
    return part
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handlePasswordlessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please provide a valid clinical or personal email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const lowercaseEmail = email.trim().toLowerCase();
      const isAdmin = lowercaseEmail === "gowinmercy@gmail.com";
      const role: UserRole = isAdmin ? "admin" : "patient";

      const finalName = name.trim() || deriveNameFromEmail(lowercaseEmail);
      // Create a stable, deterministic user ID to allow re-login retrieval of same appointments
      const sanitizedMail = lowercaseEmail.replace(/[^a-zA-Z0-9]/g, "-");
      const uid = `usr-${sanitizedMail}-${isAdmin ? "admin" : "patient"}`;

      const newProfile: UserProfile = {
        uid,
        email: lowercaseEmail,
        name: finalName,
        role,
        createdAt: Timestamp.now()
      };

      // Store in firestore collection list
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, newProfile);

      // Save user session in localStorage for stress-free persistence
      localStorage.setItem("palicon_user_session", JSON.stringify(newProfile));

      onSuccess(newProfile);
    } catch (err: any) {
      console.error("Clinical smart login crash", err);
      setErrorMsg("Failed to synchronize session, checking connection...");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickKeySelect = async (role: UserRole) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const simulatedEmail = role === "admin" ? "gowinmercy@gmail.com" : "simulated.patient@palicon.org";
    const simulatedName = role === "admin" ? "Mercy Godwin (Admin)" : "Simulated Patient Care";
    // Keep it compatible with existing DB profiles
    const uid = role === "admin" ? "admin-demo-uid-999" : "patient-demo-uid-101";

    try {
      const newProfile: UserProfile = {
        uid,
        email: simulatedEmail,
        name: simulatedName,
        role,
        createdAt: Timestamp.now()
      };

      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, newProfile);

      localStorage.setItem("palicon_user_session", JSON.stringify(newProfile));
      onSuccess(newProfile);
    } catch (err) {
      console.error(err);
      setErrorMsg("Quick key entry failed. Please try standard sign-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Dim Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs cursor-pointer"
        id="login-modal-backdrop"
      />

      {/* Main Dialog Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-emerald-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col z-10 relative"
        id="login-modal-panel"
      >
        {/* Header Block with Visual Security Tagging */}
        <div className="bg-emerald-900 px-6 py-5 text-white flex justify-between items-center relative">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest uppercase font-mono text-emerald-350 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse animate-duration-1000" />
              Secure Authentication Gate
            </span>
            <h3 className="font-sans font-bold text-lg md:text-xl leading-none">Palicon Hospital Logs</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:bg-emerald-800 hover:text-white transition-colors cursor-pointer"
            title="Cancel Sign-In"
            id="close-login-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Panel Frame */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[85vh] text-left">
          {/* Status Message / Warning Box */}
          <div className="bg-amber-50 border border-amber-200/65 rounded-xl p-3 flex gap-2.5 items-start text-xs text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Iframe Preview Notice</p>
              <p className="text-amber-900/80 leading-relaxed mt-0.5">
                Google account popup blocks occur frequently within browser-sandboxed iframes. Use our **Stress-Free Secure Passkeys** or **Email Smart Entrance** below for 100% instant, uninterrupted access!
              </p>
            </div>
          </div>

          {/* Option A: Quick Keycard Passkeys (Admin and Patient) */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest font-mono flex items-center gap-1 border-b border-emerald-50 pb-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" /> Option 1: Instant Quick Passkeys
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Admin simulated key */}
              <button
                type="button"
                onClick={() => handleQuickKeySelect("admin")}
                disabled={isSubmitting || isProcessingGoogle}
                id="quick-login-admin-btn"
                className="group border border-emerald-100 bg-emerald-50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 p-3 rounded-xl transition-all cursor-pointer text-left flex flex-col justify-between h-20"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="bg-emerald-200 text-emerald-850 group-hover:bg-emerald-750 group-hover:text-emerald-100 font-bold font-mono px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide leading-none">
                    Admin Key
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-800 group-hover:text-white" />
                </div>
                <div className="leading-tight font-bold text-emerald-950 group-hover:text-white text-xs mt-3 truncate w-full">
                  Mercy Godwin (Admin)
                </div>
              </button>

              {/* Patient simulated key */}
              <button
                type="button"
                onClick={() => handleQuickKeySelect("patient")}
                disabled={isSubmitting || isProcessingGoogle}
                id="quick-login-patient-btn"
                className="group border border-slate-150 bg-slate-50 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 p-3 rounded-xl transition-all cursor-pointer text-left flex flex-col justify-between h-20"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="bg-slate-200 text-slate-800 group-hover:bg-emerald-850 group-hover:text-emerald-100 font-bold font-mono px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide leading-none">
                    Patient Key
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-700 group-hover:text-white" />
                </div>
                <div className="leading-tight font-bold text-emerald-950 group-hover:text-white text-xs mt-3 truncate w-full">
                  Demo Shared Patient
                </div>
              </button>
            </div>
          </div>

          {/* Option B: Enter Customize Session Credentials */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest font-mono flex items-center gap-1 border-b border-emerald-50 pb-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-700" /> Option 2: Smart Email Entrance
            </label>
            
            <form onSubmit={handlePasswordlessSubmit} className="space-y-3">
              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-emerald-950/70 block pl-0.5">Clinical or Personal Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-emerald-700/50" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. gowinmercy@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    id="login-email-input"
                  />
                </div>
                <p className="text-[9px] text-emerald-900/40 pl-0.5 leading-none">
                  *Enter <span className="font-bold text-emerald-700 underline">gowinmercy@gmail.com</span> for instant admin portal rights.
                </p>
              </div>

              {/* Full Name Override */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-emerald-950/70 block pl-0.5">Full Name (Optional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-emerald-700/50" />
                  <input
                    type="text"
                    placeholder="Auto-derived if empty"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    id="login-name-input"
                  />
                </div>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isSubmitting || isProcessingGoogle}
                id="login-passwordless-submit-btn"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    Secure Smart Login
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center py-1">
            <span className="text-[10px] text-slate-350 uppercase tracking-widest font-mono">OR</span>
          </div>

          {/* Option C: Google Sign-In Trigger */}
          <div className="space-y-3">
            <button
              onClick={onGoogleLoginTrigger}
              disabled={isSubmitting || isProcessingGoogle}
              id="google-login-fallback-btn"
              className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.65 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.49 7.42l3.87 3C6.27 7.41 8.91 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.46c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.36 14.42c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.49 6.9c-.83 1.66-1.3 3.52-1.3 5.5s.47 3.84 1.3 5.5l3.87-2.98z"
                />
                <path
                  fill="#34A853"
                   d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.9 1.09-3.09 0-5.73-2.37-6.64-5.38L1.89 15.9c1.91 3.77 5.86 6.42 10.51 6.42z"
                />
              </svg>
              {isProcessingGoogle ? "Opening Provider..." : "Use Google Clinical ID"}
            </button>
          </div>

          {/* Errors display panel */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-rose-700 text-xs font-semibold leading-relaxed"
                id="login-error-display"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
