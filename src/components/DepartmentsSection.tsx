import React from "react";
import { 
  Stethoscope, Heart, Baby, Brain, Bone, Sparkles, ArrowRight, CheckCircle2 
} from "lucide-react";
import { DEPARTMENTS } from "../data";
import { Department } from "../types";

// Icon components mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Stethoscope: Stethoscope,
  Heart: Heart,
  Baby: Baby,
  Brain: Brain,
  Bone: Bone,
  Sparkles: Sparkles
};

const deptImages: Record<string, string> = {
  "General Medicine": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
  "Cardiology": "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=600&auto=format&fit=crop",
  "Pediatrics": "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
  "Neurology": "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=600&auto=format&fit=crop",
  "Orthopedics": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600&auto=format&fit=crop",
  "Dermatology": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop"
};

// Simple helper component to render images with elegant custom fallback on load errors
function SafeDepartmentImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-emerald-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-radial-gradient from-emerald-900/40 to-emerald-950 opacity-70" />
        <div className="text-center p-4 relative z-10 space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400/80 uppercase font-bold block">
            Palicon Hospital
          </span>
          <span className="text-xs text-emerald-200/40 font-sans block">{alt} Live Portal</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
    />
  );
}

interface DepartmentsSectionProps {
  onSelectSpecialty: (specialty: string) => void;
}

export default function DepartmentsSection({ onSelectSpecialty }: DepartmentsSectionProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-sans tracking-tight">
            Our Specialty Departments
          </h1>
          <p className="text-sm sm:text-base text-emerald-900/60 leading-relaxed font-sans">
            Explore dedicated clinical services matching your symptoms. Click on any department to view available doctors and schedule an appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map((dept) => {
            const IconComponent = iconMap[dept.icon] || Stethoscope;
            return (
              <div 
                key={dept.name} 
                className="bg-white rounded-3xl border border-emerald-100/80 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group"
              >
                {/* Upper Section with fitting Background Image & Info */}
                <div className="relative p-6 bg-emerald-950 min-h-[190px] flex flex-col justify-end overflow-hidden">
                  <SafeDepartmentImage 
                    src={deptImages[dept.name] || deptImages["General Medicine"]}
                    alt={dept.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/75 to-emerald-950/20 pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 border border-white/10">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-white font-sans tracking-tight">
                        {dept.name}
                      </h3>
                      <p className="text-[11px] text-emerald-100/80 leading-relaxed font-sans font-light min-h-[32px] line-clamp-2">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Section with Symptoms & Call-To-Action */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-white">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest font-mono">
                      Associated Symptoms
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.symptoms.map((symptom) => (
                        <span 
                          key={symptom} 
                          className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/50 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-50">
                    <button
                      onClick={() => onSelectSpecialty(dept.name)}
                      id={`dept-action-${dept.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="w-full inline-flex justify-center items-center gap-1.5 py-2.5 rounded-xl border border-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-600 hover:text-white group-hover:border-emerald-600 transition-all cursor-pointer"
                    >
                      View Specialists
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
