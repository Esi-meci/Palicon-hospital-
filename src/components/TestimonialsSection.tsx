import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "The digital portal is incredibly fast. I booked my Cardiology consult with Dr. Ngozi in under two minutes, and my medical brief was immediately published to my secure patients vault.",
    author: "Adebayo O.",
    role: "Verified Patient",
    location: "Lagos, Nigeria",
    rating: 5
  },
  {
    id: 2,
    quote: "Palicon Hospital has set a brand new benchmark for West African healthcare. Their trauma desk triggers visual and dispatch alerts instantly on triage. When we had our toddler emergency at midnight, they were fully active in minutes.",
    author: "Sarah A.",
    role: "Verified Parent",
    location: "Ikeja, Lagos",
    rating: 5
  },
  {
    id: 3,
    quote: "As a technology professional, seeing absolute role-based Firebase security parameters applied to physical clinical profiles left me completely convinced with their clinical privacy metrics.",
    author: "Chinedu U.",
    role: "Verified Patient",
    location: "Lekki, Lagos",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-slate-50 border-t border-b border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100/50">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase">Patient Testimonials</span>
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-950 font-sans tracking-tight">
            Loved & Trusted by Patients
          </h2>
          <p className="text-sm text-emerald-900/60 leading-relaxed font-sans">
            Read certified experiences from individuals who have successfully scheduled consultations, received urgent care, and accessed secure diagnostics with us.
          </p>
        </div>

        {/* Testimonial Cards Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id} 
              className="bg-white rounded-3xl p-8 border border-emerald-100/60 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between relative group text-left"
            >
              {/* Giant background Quote icon for classy editorial styling */}
              <div className="absolute top-6 right-6 text-emerald-50/70 group-hover:text-emerald-100/50 transition-colors pointer-events-none">
                <Quote className="w-12 h-12" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* 5-Stars representation */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Patient quote */}
                <p className="text-sm text-emerald-950 font-sans leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author details */}
              <div className="mt-8 pt-4 border-t border-emerald-50/85 flex items-center justify-between relative z-10">
                <div>
                  <h4 className="font-bold text-sm text-emerald-950 font-sans">{t.author}</h4>
                  <p className="text-[10px] text-emerald-900/50 font-sans mt-0.5">
                    {t.role} • {t.location}
                  </p>
                </div>
                
                {/* Micro Verified badge */}
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 py-1 px-2.5 rounded-full border border-emerald-100/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[9px] font-extrabold font-mono uppercase tracking-wider">Verified</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
