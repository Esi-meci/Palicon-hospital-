import React from "react";
import { 
  Stethoscope, Heart, Baby, Bone, Sparkles, ArrowRight, CheckCircle2, Scissors, Ambulance, FlaskConical, Activity, Check, ShieldAlert, BadgeInfo, ChevronLeft, ChevronRight
} from "lucide-react";
import { DEPARTMENTS } from "../data";
import { Department } from "../types";

// Icon components mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Stethoscope: Stethoscope,
  Heart: Heart,
  Baby: Baby,
  Bone: Bone,
  Sparkles: Sparkles,
  Scissors: Scissors,
  Ambulance: Ambulance,
  FlaskConical: FlaskConical,
  Activity: Activity
};

const deptImages: Record<string, string> = {
  "OBSTETRICS AND GYNAECOLOGY": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop", // female obstetrician talking to patient
  "GENERAL SURGERY": "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop", // surgical team in OR
  "PEDIATRICS": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop", // smiling doctor checkup child
  "ACCIDENT AND EMMERGENCY": "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=600&auto=format&fit=crop", // paramedic ambulance team
  "GERIATRICS": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop", // senior woman and smiling physical therapist
  "GENERAL MEDICINE": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop", // professional smiling physician woman
  "ORTHOPEDICS": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop", // therapist checking a patient's movement
  "MEDICAL LABORATORY SERVICES": "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=600&auto=format&fit=crop", // lab researcher scientist
  "RADIOLOGY": "https://images.unsplash.com/photo-1516841273335-e39b37888115?q=80&w=600&auto=format&fit=crop" // tech demonstrating diagnostic scanners with colleague
};

// Premium background slides for Departments Hero Section
const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
    title: "Clinical Excellence",
    accent: "Clinical Pillars",
    desc: "Palicon Hospital is structured into specialized, fully cohesive clinical wards. Each department combines cutting-edge diagnostic suites, dedicated consultation chambers, and certified specialists to deliver absolute care symmetry for you and your loved ones."
  },
  {
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop",
    title: "Advanced Diagnostics",
    accent: "Precision Triage",
    desc: "Harnessing the latest-tier clinical technology, advanced ultrasound layouts, and automated bio-analysis pipelines to extract absolute diagnostics with zero delay."
  },
  {
    url: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop",
    title: "Surgical Mastery",
    accent: "Modern OT Facilities",
    desc: "Our state-of-the-art laminar air operating suites are manned by seasoned, certified consultants 24 hours a day to handle elective and high-critical emergencies."
  },
  {
    url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=1200&auto=format&fit=crop",
    title: "Comprehensive Care",
    accent: "Caring Specialists",
    desc: "Every specialized department functions as an interconnected organism to secure a seamless diagnostic-to-treatment patient pipeline."
  }
];

// Simple helper component to render images transparently without heavy overlay shading
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
      className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-500"
    />
  );
}

interface DepartmentsSectionProps {
  onSelectSpecialty: (specialty: string) => void;
}

export default function DepartmentsSection({ onSelectSpecialty }: DepartmentsSectionProps) {
  const [currentHeroSlide, setCurrentHeroSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Premium Hero Section on Departments Page - Pure images, neutral dark overlays, zero green tints */}
      <div className="relative bg-neutral-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        
        {/* Carousel Background Images with Crossfade (Strictly Image with neutral dark gradient mask) */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          {heroSlides.map((slide, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroSlide ? "opacity-100" : "opacity-0"}`}
            >
              <img 
                src={slide.url}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
              {/* Neutral dark overlay purely for text contrast - no colored tints */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-black/30 lg:from-neutral-950/95 lg:via-neutral-950/70 lg:to-black/20" />
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 text-neutral-300 border border-neutral-800">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
                {heroSlides[currentHeroSlide].accent}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Departments of <br />
              <span className="text-neutral-200">{heroSlides[currentHeroSlide].title}</span>
            </h1>
            
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans max-w-2xl min-h-[80px]">
              {heroSlides[currentHeroSlide].desc}
            </p>
          </div>

          {/* Solid Dark Protected Overlay Box for absolute readability */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-850 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-2xl relative">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 border border-neutral-800">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-sm text-white">Direct Doctor Matching</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  Clicking any division displays certified, pre-verified physicians. Request secure scheduling with your chosen clinician instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 border border-neutral-800">
                <BadgeInfo className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-sm text-white">Continuous Support Services</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  Need clarification about symptoms? Open our 24/7 Live Chat down in the corner to converse with our active health administrators.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel manual controllers positioned AFTER the clinical service overlay blocks: Centered on small rows, left-aligned on desktop */}
        <div className="max-w-7xl mx-auto relative z-10 mt-8 flex justify-center lg:justify-start">
          <div className="flex items-center gap-4 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-neutral-800">
            <button 
              onClick={handlePrevSlide}
              className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center transition-all cursor-pointer border border-neutral-800"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentHeroSlide ? "bg-white w-4" : "bg-neutral-600"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNextSlide}
              className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center transition-all cursor-pointer border border-neutral-800"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-sans tracking-tight">
            Specialized Care Divisions
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900/60 leading-relaxed font-sans">
            Filter and explore our state-of-the-art departments. Use the "View Specialists" button to find a registered doctor on-call.
          </p>
        </div>

        {/* Departments Grid with Clear Image settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEPARTMENTS.map((dept) => {
            const IconComponent = iconMap[dept.icon] || Stethoscope;
            return (
              <div 
                key={dept.name} 
                className="bg-white rounded-3xl border border-emerald-100/80 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-350 text-left flex flex-col justify-between group shadow-sm"
              >
                {/* 100% Full-Opacity people image section with bottom-aligned Title */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  <SafeDepartmentImage 
                    src={deptImages[dept.name] || deptImages["GENERAL MEDICINE"]}
                    alt={dept.name}
                  />
                  {/* Gentle dark gradient for white title readability on bottom-left, keeping rest of image pristine */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Subtle white/semi-transparent icon badge over the photo of clinical team */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md text-emerald-800 flex items-center justify-center shadow-md border border-white/50 transition-transform group-hover:scale-110 duration-300 z-10">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Department Title positioned bottom left with white text */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-lg font-black text-white font-sans tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                {/* Bottom Section containing Black Explanation text and Symptoms */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-white">
                  <div className="space-y-3">
                    {/* Highly readable, high-contrast pure black/dark-slate description text */}
                    <p className="text-sm text-black leading-relaxed font-sans font-normal">
                      {dept.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                        Associated Symptoms
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.symptoms.map((symptom) => (
                          <span 
                            key={symptom} 
                            className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 text-slate-800 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-50">
                    <button
                      onClick={() => onSelectSpecialty(dept.name)}
                      id={`dept-action-${dept.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="w-full inline-flex justify-center items-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-emerald-600 hover:text-white group-hover:border-emerald-600 hover:border-emerald-650 transition-all cursor-pointer"
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

