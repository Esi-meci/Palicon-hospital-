import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, BadgeCheck, ShieldAlert, Sparkles, Phone, HeartPulse } from "lucide-react";
import { collection, doc, setDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface LiveChatWidgetProps {
  user: UserProfile | null;
  onSuccessMessage: (msg: string) => void;
}

export default function LiveChatWidget({ user, onSuccessMessage }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(() => {
    return localStorage.getItem("palicon_active_inquiry_id");
  });
  const [activeInquiry, setActiveInquiry] = useState<any | null>(null);

  // Subscribe to real-time updates for active inquiry
  useEffect(() => {
    if (!activeInquiryId) {
      setActiveInquiry(null);
      return;
    }

    const docRef = doc(db, "inquiries", activeInquiryId);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setActiveInquiry({ id: docSnap.id, ...docSnap.data() });
      } else {
        setActiveInquiry(null);
      }
    }, (err) => {
      console.error("LiveChatWidget listen error:", err);
    });

    return () => unsub();
  }, [activeInquiryId]);

  // Auto-fill logged in credentials
  useEffect(() => {
    if (user) {
      setVisitorName(user.name);
      setVisitorEmail(user.email);
    } else {
      setVisitorName("");
      setVisitorEmail("");
    }
  }, [user]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText) return;

    const emailToUse = visitorEmail || "anonymous@palicon.org";
    const nameToUse = visitorName || "Guest Visitor";

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const inquiryId = `inq-${Date.now()}`;
      const newInquiry = {
        id: inquiryId,
        visitorName: nameToUse,
        visitorEmail: emailToUse,
        visitorPhone: user ? "Authenticated Portal" : "Web Live Chat Widget",
        subject: "Web Live Chat Support",
        message: messageText,
        status: "pending",
        createdAt: Timestamp.now()
      };

      await setDoc(doc(db, "inquiries", inquiryId), newInquiry);
      
      setActiveInquiryId(inquiryId);
      localStorage.setItem("palicon_active_inquiry_id", inquiryId);

      setFeedbackSuccess(true);
      setMessageText("");
      onSuccessMessage("Support inquiry logged on helpdesk queue!");
      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("LiveChatWidget error submitting", err);
      setErrorMessage("Could not record chat inquiry block.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-40 font-sans flex flex-col items-end gap-3 select-none"
    >
      
      {/* Floating Panel (Conditional view) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white border border-emerald-100 rounded-2xl shadow-xl w-80 sm:w-96 text-left overflow-hidden flex flex-col h-[400px]"
          >
          
          {/* Header */}
          <div className="bg-emerald-800 p-4 text-white flex items-center justify-between cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <h4 className="font-bold text-sm tracking-tight">Palicon Helpdesk Support</h4>
                <p className="text-[10px] text-emerald-200">Usually responds in a few minutes</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-100 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-rose-50 text-[10px] sm:text-xs text-rose-950 px-4 py-2 font-bold flex items-center justify-between gap-1.5 border-b border-rose-100 shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600 shrink-0 animate-pulse" />
              <span>Emergency Hotline:</span>
            </div>
            <a href="tel:+2348072606299" className="text-rose-600 hover:underline font-mono font-black">+234 807 260 6299</a>
          </div>

          {/* Chat Body Scroll */}
          <div 
            onPointerDown={(e) => e.stopPropagation()}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs text-emerald-950 cursor-auto"
          >
            
            {/* System welcome speech bubble */}
            <div className="flex gap-2 items-start max-w-[85%]">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0">
                P
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-emerald-50 shadow-xs space-y-1">
                <p className="leading-relaxed text-emerald-950">
                  Hello! Welcome to Palicon Hospital. How may we assist with your health plans or appointments queue today?
                </p>
                <p className="text-[9px] text-emerald-950/40">Palicon Care Team • Just now</p>
              </div>
            </div>

            {/* If success banner holds true */}
            {feedbackSuccess && (
              <div className="bg-emerald-100 text-emerald-950 border border-emerald-200 p-3 rounded-xl flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Submitted successfully into our admin live workspace dashboard!</span>
              </div>
            )}

            {activeInquiry && (
              <div className="flex flex-col gap-4">
                {/* User's Message */}
                <div className="flex gap-2 items-start max-w-[85%] self-end flex-row-reverse text-right">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 text-xs">
                    U
                  </div>
                  <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-xs shadow-xs text-left">
                    <p className="leading-relaxed font-semibold">{activeInquiry.message}</p>
                    <p className="text-[9px] text-white/60">You • {activeInquiry.createdAt && typeof activeInquiry.createdAt.toDate === "function" ? activeInquiry.createdAt.toDate().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) : "Just now"}</p>
                  </div>
                </div>

                {/* Admin's Reply */}
                {activeInquiry.adminReply && (
                  <div className="flex gap-2 items-start max-w-[85%] self-start text-left">
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
                      P
                    </div>
                    <div className="bg-emerald-100 text-emerald-950 p-3 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-200">
                      <p className="leading-relaxed font-semibold">{activeInquiry.adminReply}</p>
                      <p className="text-[9px] text-emerald-950/50">Palicon Support • {activeInquiry.repliedAt && typeof activeInquiry.repliedAt.toDate === "function" ? activeInquiry.repliedAt.toDate().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) : "Just now"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Typing Indicator */}
            <AnimatePresence>
              {activeInquiry?.adminTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-2 items-start max-w-[85%] self-start text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    P
                  </div>
                  <div className="bg-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-300 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-emerald-950 animate-pulse">Palicon is typing</span>
                      <div className="flex gap-1 items-center pt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-rose-700 text-[11px]">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Embedded form input area */}
          <form 
            onSubmit={handleSendChat} 
            onPointerDown={(e) => e.stopPropagation()}
            className="p-3 bg-white border-t border-emerald-50 shrink-0 space-y-2 cursor-auto"
          >
            
            {/* If anonymous visitor, collect email & name on fly */}
            {!user && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-hidden focus:border-emerald-500 font-sans"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message here..."
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[9px] text-emerald-900/40 pt-1 px-1">
              <span>Palicon Secure Transport (TLS)</span>
              <a href="https://wa.me/2348072606299" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                or use WhatsApp
              </a>
            </div>
          </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all relative transform hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing"
        title="Palicon Support"
        id="live-chat-floating-toggle"
      >
        {isOpen ? <X className="w-6 h-6" style={{ color: '#ffefef' }} /> : <MessageSquare className="w-6 h-6" style={{ color: '#ffefef' }} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
            1
          </span>
        )}
      </button>

    </motion.div>
  );
}
