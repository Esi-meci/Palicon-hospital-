import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Award, HeartHandshake, Phone, ArrowRight, Activity, CalendarClock, ChevronLeft, ChevronRight, HeartPulse 
} from "lucide-react";
import TestimonialsSection from "./TestimonialsSection";

interface HomeHeroProps {
  onBookNow: () => void;
  onExploreDoctors: () => void;
  onViewDepartments: () => void;
}

export default function HomeHero({ onBookNow, onExploreDoctors, onViewDepartments }: HomeHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
      title: "State-Of-The-Art Medical Facility",
      desc: "Our ultra-modern reception lobby and diagnostics suites at Abule Folly, Lagos."
    },
    {
      url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
      title: "Precision Diagnostic Ultrasound",
      desc: "Advanced therapeutic scanners and sterile consulting suites."
    },
    {
      url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop",
      title: "Private Specialist Consultations",
      desc: "Warm clinical consultation rooms designed with absolute comfort and privacy."
    },
    {
      url: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800&auto=format&fit=crop",
      title: "Fully Stocked Hospital Pharmacy",
      desc: "Immaculate diagnostic dispensaries with secure medicine checks 24/7."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-emerald-50">
        <div className="absolute inset-0 bg-linear-to-tr from-emerald-50/20 via-transparent to-emerald-50/10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column Text Content */}
            <div className="space-y-6 sm:max-w-xl lg:max-w-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100/50">
                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-xs font-semibold font-mono tracking-wider uppercase">Zero-Trust Medical Care</span>
              </div>
              
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl tracking-tight text-emerald-950 leading-tight">
                Your Health, Secured. <br />
                <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Expert Care</span> Anytime.
              </h1>
              
              <p className="font-sans text-base sm:text-lg text-emerald-900/60 leading-relaxed">
                Welcome to Palicon Hospital. Book secure real-time appointments, review private medical diagnoses, and get intelligent health briefs securely synchronized in our cloud-fortified vault.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onBookNow}
                  id="hero-book-btn"
                  className="inline-flex justify-center items-center gap-2 px-6 h-12 rounded-xl bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all cursor-pointer animate-none"
                >
                  <CalendarClock className="w-5 h-5" />
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={onExploreDoctors}
                  id="hero-doctors-btn"
                  className="inline-flex justify-center items-center gap-2 px-6 h-12 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-50/50 transition-all cursor-pointer animate-none"
                >
                  Meet Our Doctors
                </button>
              </div>

              {/* Stats Footer on Hero */}
              <div className="grid grid-cols-3 gap-4 pt-6 text-left border-t border-emerald-50">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">25+</div>
                  <div className="text-xs text-emerald-900/50 uppercase font-semibold font-mono">Specialists</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">15k+</div>
                  <div className="text-xs text-emerald-900/50 uppercase font-semibold font-mono">Patients Helped</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">99.2%</div>
                  <div className="text-xs text-emerald-900/50 uppercase font-semibold font-mono">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Column Banner Graphic inside Card with Interactive Carousel */}
            <div className="relative">
              <div className="relative bg-emerald-950 rounded-3xl overflow-hidden shadow-2xl border border-emerald-850">
                
                {/* Carousel Image Plate */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
                  {carouselImages.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    >
                      <img
                        src={slide.url}
                        alt={slide.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-100"
                      />
                    </div>
                  ))}

                  {/* Manual Navigation Arrows */}
                  <button
                    onClick={handlePrev}
                    id="carousel-prev"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    id="carousel-next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Visual Slide dots indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                    {carouselImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentSlide ? "bg-emerald-400 scale-125" : "bg-white/40"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Info and Emergency Panel */}
                <div className="p-6 text-white text-left space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest font-mono">
                      {carouselImages[currentSlide].title}
                    </span>
                    <span className="bg-emerald-800/60 border border-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">
                      ● Palicon Suite Live
                    </span>
                  </div>

                  <p className="text-emerald-100/90 text-sm leading-relaxed font-sans">
                    {carouselImages[currentSlide].desc}
                  </p>

                  <div className="bg-rose-950/40 rounded-xl p-4 border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-rose-600 text-white p-2 rounded-lg animate-pulse">
                        <HeartPulse className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-rose-300 uppercase tracking-widest font-mono font-bold">24/7 Clinical Emergency Line</div>
                        <a href="tel:+2348072606299" className="text-sm font-black font-mono text-rose-400 hover:text-rose-300 block transition-colors">+234 807 260 6299</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-emerald-300/80 font-mono">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Encryption
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-emerald-400" /> Certified Physicians
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Highlights / Features Row */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Accredited Staff */}
          <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="relative h-44 bg-emerald-950 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop"
                alt="Accredited Staff"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating glassmorphic badge */}
              <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300 flex items-center justify-center border border-white/15 shadow-xs">
                <Award className="w-5 h-5 text-emerald-200" />
              </div>
              
              <div className="relative p-4 z-10 w-full h-full flex items-end">
                <div>
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                    Verified Team
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 font-sans">Accredited Staff</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-center bg-white text-left">
              <p className="text-sm text-emerald-900/60 leading-relaxed font-sans">
                All listed medical specialists are certified with continuous performance reviews, post-clinical audits, and clinical credentials verification.
              </p>
            </div>
          </div>

          {/* Card 2: Secure Patients Vault */}
          <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="relative h-44 bg-emerald-950 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop"
                alt="Secure Patients Vault"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating glassmorphic badge */}
              <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300 flex items-center justify-center border border-white/15 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              
              <div className="relative p-4 z-10 w-full h-full flex items-end">
                <div>
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                    Zero-Trust Security
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 font-sans">Secure Patients Vault</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-center bg-white text-left">
              <p className="text-sm text-emerald-900/60 leading-relaxed font-sans">
                Dynamic role-based security layers block external snooping, ensuring only you and your physician access diagnostic and appointment details.
              </p>
            </div>
          </div>

          {/* Card 3: Compassionate Care */}
          <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="relative h-44 bg-emerald-950 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=400&auto=format&fit=crop"
                alt="Compassionate Care"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating glassmorphic badge */}
              <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300 flex items-center justify-center border border-white/15 shadow-xs">
                <HeartHandshake className="w-5 h-5 text-emerald-200" />
              </div>
              
              <div className="relative p-4 z-10 w-full h-full flex items-end">
                <div>
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                    Holistic Support
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 font-sans">Compassionate Care</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-center bg-white text-left">
              <p className="text-sm text-emerald-900/60 leading-relaxed font-sans">
                Our specialists emphasize proactive, non-invasive health checkups tailored completely to patient family history and lifestyle goals.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Informative Grid */}
      <section className="py-12 bg-white border-t border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-emerald-950 font-sans">How Palicon Hospital Works</h2>
            <p className="text-sm text-emerald-900/50 font-sans">
              From immediate booking to real-time status tracking and medical records vault, managing your health metrics is completely streamlined.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto">1</div>
              <h5 className="font-bold text-emerald-950 text-sm">Create Account</h5>
              <p className="text-xs text-emerald-900/50 px-4">Register in seconds with Google Single Sign-On securely.</p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center mx-auto">2</div>
              <h5 className="font-bold text-emerald-950 text-sm">Select Specialty</h5>
              <p className="text-xs text-emerald-900/50 px-4">Scan our comprehensive departments and verified medical team availability.</p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center mx-auto">3</div>
              <h5 className="font-bold text-emerald-950 text-sm">Book Time Slot</h5>
              <p className="text-xs text-emerald-900/50 px-4">Secure your precise consultation slot and log symptom descriptions easily.</p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center mx-auto">4</div>
              <h5 className="font-bold text-emerald-950 text-sm">Review Diagnostics</h5>
              <p className="text-xs text-emerald-900/50 px-4">Access generated report briefs, file uploads, and Gemini clinical breakdowns anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Block */}
      <TestimonialsSection />

    </div>
  );
}
