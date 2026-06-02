import React, { useState } from "react";
import { ShieldCheck, HeartPulse, UserCheck, Star, Sparkles, ChevronDown, ChevronUp, History, Network } from "lucide-react";
import TestimonialsSection from "./TestimonialsSection";

interface FAQItem {
  question: string;
  answer: string;
}

export default function AboutUs() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const coreValues = [
    {
      title: "Patient-Centered Care",
      desc: "Every clinical decision and care recommendation starts with our patients' comfort, dignity, and recovery.",
      icon: HeartPulse,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Clinical Excellence",
      desc: "Our medical practitioners hold certifications in advanced global specialties, keeping at the forefront of medical technology.",
      icon: UserCheck,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "Integrity & Discretion",
      desc: "We guard patient health data and electronic clinical records with cutting-edge private encrypted infrastructure.",
      icon: ShieldCheck,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Compassion & Respect",
      desc: "We value each human life and maintain warm, empathetic hospital desks to support both patients and their families.",
      icon: Star,
      color: "text-amber-600 bg-amber-50 border-amber-100"
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: "Where is Palicon Hospital located?",
      answer: "We are situated in Lagos at PALICON HOSPITAL (1 Popoola Odusami Street, Balogun Lane, Abule Folly, Lagos 105101, Lagos State, Nigeria). You can view our exact spot on Google Maps at https://maps.app.goo.gl/fFxvqoR8BGFxkPf29. Our facility features ample parking space, physical access control, and 24/7 security."
    },
    {
      question: "What are your business and consulting hours?",
      answer: "Palicon Hospital is fully open 24 hours a day, 7 days a week, 365 days a year, including all holidays. Our specialist care panels, diagnostic wards, imaging suites, labs, trauma response desks, and pharmacies are completely active round-the-clock."
    },
    {
      question: "How do I book an appointment with a specialist?",
      answer: "You can easily schedule a consultation by logging in to our secure patient portal. Once authenticated, navigate to \"Our Doctors\", choose your preferred practitioner and available time slot, and submit. Your reservation goes live instantly!"
    },
    {
      question: "Is my medical data confidential?",
      answer: "Yes, confidentiality is core to our values. Palicon Hospital utilizes advanced cloud database authentication and authorization protocols so that only you and your explicitly assigned medical staff can review clinical records or diagnostic lab sheets."
    },
    {
      question: "Do you support virtual consultations?",
      answer: "Yes! We run state-of-the-art tele-consultation support channels. If you cannot commute physically to Abule Folly, we offer live chats, WhatsApp integration, and direct virtual appointment lines."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16 text-left">
        
        {/* Hero Section */}
        <div className="bg-emerald-900 rounded-3xl p-8 sm:p-12 md:p-16 text-white relative overflow-hidden shadow-xl border border-emerald-800">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-800/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-emerald-800 text-emerald-300 font-mono text-[10px] sm:text-xs font-bold uppercase py-1 px-3 rounded-full border border-emerald-700 inline-block tracking-wider">
              About Palicon Hospital
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans">
              Setting the Gold Standard in Quality Healthcare
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-sans font-light">
              Palicon Hospital is Nigeria's leading private healthcare facility, dedicated to patient recovery, clinically advanced diagnostic precision, and empathetic clinical services. Located in the heart of Lagos, we merge world-class talent with private, secure medical databases.
            </p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-100 mb-6">
                <History className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-950 font-sans">Our Dynamic Mission</h2>
              <p className="text-sm sm:text-base text-emerald-900/60 leading-relaxed font-sans mt-3">
                To deliver premium, safe, specialized, and evidence-based healthcare to our local and international communities. We commit to utilizing modern technology, compassionate clinical empathy, and private data-vaulting infrastructure to achieve the best clinical outcomes.
              </p>
            </div>
            <div className="text-xs text-emerald-800 font-mono tracking-wide mt-6 border-t border-emerald-5 w-fit pt-2 uppercase font-bold">
              • Established in Lagos
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center border border-blue-100 mb-6">
                <Network className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-950 font-sans">Our Direct Vision</h2>
              <p className="text-sm sm:text-base text-emerald-900/60 leading-relaxed font-sans mt-3">
                To stand as the most trusted medical service institution in West Africa, recognized for breakthrough diagnostics, seamless telemedicine integrations, rapid response times, and exceptional clinical expertise that guides families toward holistic recovery.
              </p>
            </div>
            <div className="text-xs text-blue-800 font-mono tracking-wide mt-6 border-t border-emerald-5 w-fit pt-2 uppercase font-bold">
              • 24/7 Trauma Services
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-sans">Why Patients Choose Palicon</h2>
            <p className="text-sm text-emerald-900/55 mt-1">Our reputation is backed by solid statistics, clinical outcomes, and high patient satisfaction.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center border-t-4 border-t-emerald-600">
              <span className="text-4xl font-extrabold text-emerald-950 block">99.2%</span>
              <h3 className="text-xs font-bold text-emerald-800 uppercase font-mono tracking-wider mt-2">Patient Recovery Success</h3>
              <p className="text-xs text-emerald-900/50 mt-1 leading-relaxed">Reflecting our detailed diagnostic analysis and aggressive clinical follow-ups.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center border-t-4 border-t-blue-600">
              <span className="text-4xl font-extrabold text-emerald-950 block">15 Min</span>
              <h3 className="text-xs font-bold text-blue-800 uppercase font-mono tracking-wider mt-2">Max ER Response Time</h3>
              <p className="text-xs text-emerald-900/50 mt-1 leading-relaxed">Our trauma desk triggers visual and dispatch alerts instantly on triage.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center border-t-4 border-t-indigo-600">
              <span className="text-4xl font-extrabold text-emerald-950 block">100%</span>
              <h3 className="text-xs font-bold text-indigo-800 uppercase font-mono tracking-wider mt-2">Data Privacy Guarantee</h3>
              <p className="text-xs text-emerald-900/50 mt-1 leading-relaxed">Electronic records stored inside fully roles-guarded Firestore rules nodes.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center border-t-4 border-t-amber-500">
              <span className="text-4xl font-extrabold text-emerald-950 block">25+</span>
              <h3 className="text-xs font-bold text-amber-800 uppercase font-mono tracking-wider mt-2">Specialized Consultants</h3>
              <p className="text-xs text-emerald-900/50 mt-1 leading-relaxed">From top global institutions supporting inpatient and home-consult slots.</p>
            </div>
          </div>
        </div>

        {/* Our Core Values */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-sans">Our Medical Pillar Values</h2>
            <p className="text-sm text-emerald-900/55 mt-1">These values guide every single interaction inside our outpatient clinics and surgical units.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="bg-white border border-emerald-50 p-6 rounded-2xl shadow-xs space-y-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${val.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-emerald-950 text-sm font-sans">{val.title}</h3>
                  <p className="text-xs text-emerald-900/60 leading-relaxed font-sans">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 border border-emerald-100 rounded">FAQ Support</span>
            <h2 className="text-2xl font-extrabold text-emerald-950 font-sans mt-2">Frequently Asked Inquiries</h2>
            <p className="text-xs text-emerald-900/50 mt-1">Get instant answers about scheduling checkups, health reports security, and trauma support.</p>
          </div>

          <div className="divide-y divide-emerald-50">
            {faqs.map((faq, index) => {
              const isOpen = openFAQIndex === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => toggleFAQ(index)}
                    id={`faq-btn-${index}`}
                    className="w-full flex justify-between items-center text-left py-2 hover:text-emerald-700 transition-colors focus:outline-hidden cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-emerald-950 font-sans">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-emerald-900/40" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="mt-2 text-xs sm:text-sm text-emerald-900/60 leading-relaxed font-sans pr-8">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Block */}
        <TestimonialsSection />

      </div>
    </div>
  );
}
