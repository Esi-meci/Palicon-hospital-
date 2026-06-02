import React, { useState } from "react";
import { Star, Clock, Heart, Search, Filter, CalendarCheck2 } from "lucide-react";
import { INITIAL_DOCTORS, DEPARTMENTS } from "../data";
import { Doctor } from "../types";

interface DoctorsSectionProps {
  onBookAppointment: (doctor: Doctor) => void;
  selectedSpecialtyFilter: string;
  setSelectedSpecialtyFilter: (specialty: string) => void;
  doctors: Doctor[];
}

function SafeDoctorImage({ src, name, className }: { src: string; name: string; className: string }) {
  const [hasError, setHasError] = useState(false);
  const lowercaseName = name.toLowerCase();
  const isFemale = lowercaseName.includes("ngozi") || 
                   lowercaseName.includes("funmilayo") || 
                   lowercaseName.includes("amina") || 
                   lowercaseName.includes("sarah") || 
                   lowercaseName.includes("elena") || 
                   lowercaseName.includes("chloe") ||
                   lowercaseName.includes("yusuf") ||
                   lowercaseName.includes("achebe");
                   
  const fallbackUrl = isFemale 
    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop";

  return (
    <img 
      src={hasError ? fallbackUrl : src} 
      alt={name} 
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export default function DoctorsSection({ 
  onBookAppointment, 
  selectedSpecialtyFilter, 
  setSelectedSpecialtyFilter,
  doctors
}: DoctorsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const specialties = ["All", ...DEPARTMENTS.map((d) => d.name)];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = 
      selectedSpecialtyFilter === "All" || doc.specialty === selectedSpecialtyFilter;
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-sans tracking-tight">
            Our Medical Directory
          </h1>
          <p className="text-sm text-emerald-900/60 leading-relaxed font-sans">
            Schedule a consultation with our verified clinical specialists. All of our medical experts offer both on-premise and safe remote consultations.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/30" />
            <input
              type="text"
              placeholder="Search doctors by name or medical specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="doctor-search-input"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Quick Select Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-800" />
            <select
              value={selectedSpecialtyFilter}
              onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
              id="doctor-specialty-select"
              className="w-full bg-slate-50 border border-slate-200 py-2 px-3 rounded-xl text-xs font-semibold text-emerald-950 focus:outline-hidden focus:border-emerald-500"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s} Spec</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap gap-2 justify-center">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialtyFilter(specialty)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedSpecialtyFilter === specialty
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                  : "bg-white text-emerald-950 border border-emerald-100 hover:bg-emerald-50"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-48 bg-emerald-800 flex items-end">
                    <SafeDoctorImage 
                      src={doc.image} 
                      name={doc.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative p-4 z-10 w-full flex justify-between items-end">
                      <div>
                        <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                          {doc.specialty}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1">{doc.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-lg shadow-xs text-xs font-bold text-emerald-950">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {doc.rating}
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-4">
                    <div className="border-b border-emerald-50 pb-3">
                      <span className="text-emerald-900/40 font-semibold block uppercase tracking-wider text-[10px]">Experience</span>
                      <span className="text-emerald-950 font-bold text-sm">{doc.experience}</span>
                    </div>

                    <div className="space-y-2 text-xs text-emerald-900/70">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                        <span className="font-mono">{doc.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 border-t border-emerald-50 bg-slate-50/50">
                  <button
                    onClick={() => onBookAppointment(doc)}
                    id={`doc-book-btn-${doc.id}`}
                    className="w-full inline-flex justify-center items-center gap-1.5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 hover:translate-y-[-1px] transition-all shadow-sm shadow-emerald-100 cursor-pointer"
                  >
                    <CalendarCheck2 className="w-4 h-4" />
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl py-12 px-4 text-center border border-emerald-100">
            <p className="text-sm font-semibold text-emerald-950">No medical professionals match your current query.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedSpecialtyFilter("All"); }}
              className="mt-3 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
