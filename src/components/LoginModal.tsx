import React, { useState } from "react";
import { X, Mail, User, ShieldCheck, Activity, LogIn } from "lucide-react";
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

  // Derive a user's display name politely from email handle
  const deriveNameFromEmail = (emailStr: string) => {
    const part = emailStr.split("@")[0] || "User";
    return part
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handlePasswordlessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const lowercaseEmail = email.trim().toLowerCase();
      const isAdmin = lowercaseEmail === "gowinmercy@gmail.com";
      const role: UserRole = isAdmin ? "admin" : "patient";

      const finalName = name.trim() || deriveNameFromEmail(lowercaseEmail);
      const sanitizedMail = lowercaseEmail.replace(/[^a-zA-Z0-9]/g, "-");
      const uid = `usr-${sanitizedMail}-${isAdmin ? "admin" : "patient"}`;

      const newProfile: UserProfile = {
        uid,
        email: lowercaseEmail,
        name: finalName,
        role,
        createdAt: Timestamp.now()
      };

      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, newProfile);

      localStorage.setItem("palicon_user_session", JSON.stringify(newProfile));
      onSuccess(newProfile);
    } catch (err: any) {
      console.error("Smart credentials sync failed", err);
      setErrorMsg("Database authentication sync failed. Please attempt again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    setErrorMsg(null);
    try {
      await onGoogleLoginTrigger();
    } catch (err: any) {
      console.warn("Google Authentication error:", err);
      setErrorMsg("Google Sign-up failed or was blocked. You can still login immediately using the simple Email sign-in form below!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 
        Background Dim Backdrop with click close behavior REMOVED.
        This completely prevents browser refocus or iframe click losses from closing the authentication modal!
      */}
      <div
        className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs"
        id="login-modal-backdrop"
      />

      {/* Center Card Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-white border border-emerald-100 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden flex flex-col z-10 relative"
        id="login-modal-panel"
      >
        {/* Header Block */}
        <div className="bg-emerald-900 px-5 py-4 text-white flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-sans font-extrabold text-base tracking-tight">Login / SignUp</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:bg-emerald-800 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
            id="close-login-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* content space */}
        <div className="p-5 space-y-5 text-left">
          
          {/* Option 1: Google Authentication Button (Large & Highlighted) */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleClick}
              disabled={isSubmitting || isProcessingGoogle}
              id="google-login-action-btn"
              className="w-full py-3 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
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
              {isProcessingGoogle ? "Opening Google..." : "SignUp with google"}
            </button>
          </div>

          {/* Simple OR Divider */}
          <div className="flex items-center gap-2">
            <span className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase">Or Sign In with Email</span>
            <span className="h-px bg-slate-100 flex-1" />
          </div>

          {/* Option 2: Simple customized session details */}
          <form onSubmit={handlePasswordlessSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-slate-700 block pl-0.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-emerald-800/40" />
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  id="login-email-input"
                />
              </div>
            </div>

            {/* Name field (optional) */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-slate-700 block pl-0.5">Your Name (Optional)</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-emerald-800/40" />
                <input
                  type="text"
                  placeholder="e.g. Mercy Godwin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  id="login-name-input"
                />
              </div>
            </div>

            {/* Submit Action */}
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
                  Continue as Patient
                </>
              )}
            </button>
          </form>

          {/* Error notification banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-rose-800 text-[11px] font-semibold leading-relaxed"
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
