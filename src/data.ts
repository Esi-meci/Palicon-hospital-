import { Doctor, Department } from "./types";

export const DEPARTMENTS: Department[] = [
  {
    name: "General Medicine",
    icon: "Stethoscope",
    description: "Primary healthcare, wellness physicals, vaccinations, and chronic health management.",
    symptoms: ["Cold & Flu", "Fever", "Headache", "Blood Pressure Care", "Routine Checkups"]
  },
  {
    name: "Cardiology",
    icon: "Heart",
    description: "Comprehensive cardiovascular diagnostics, heart health checks, and therapy plans.",
    symptoms: ["Chest Pain", "Palpitations", "Shortness of Breath", "Arrhythmia", "Dizziness"]
  },
  {
    name: "Pediatrics",
    icon: "Baby",
    description: "Expert, compassionate clinical care for infants, growing children, and teenagers.",
    symptoms: ["Childhood Fever", "Growth Evaluation", "Pediatric Rashes", "Development Tracking"]
  },
  {
    name: "Neurology",
    icon: "Brain",
    description: "Advanced neurological diagnostics and clinical treatments for nervous system conditions.",
    symptoms: ["Chronic Migraine", "Neuropathy", "Tremors", "Cognitive Assessment", "Sleep Disorders"]
  },
  {
    name: "Orthopedics",
    icon: "Bone",
    description: "Expert musculoskeletal wellness, bone and joint alignment, and sports medicine.",
    symptoms: ["Joint Pain", "Fracture Recovery", "Back & Neck Pain", "Strains & Sprains"]
  },
  {
    name: "Dermatology",
    icon: "Sparkles",
    description: "Restorative skin treatments, medical acne resolutions, and cosmetic dermatology.",
    symptoms: ["Eczema", "Persistent Rashes", "Acne", "Skin Lesions", "Allergies"]
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Olusegun Bello",
    specialty: "Cardiology",
    rating: 4.9,
    experience: "14 Years",
    fees: 15000,
    image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=256&auto=format&fit=crop",
    availability: "Mon, Wed, Fri (9:00 AM - 1:00 PM)",
    email: "olusegun.bello@paliconhospital.org"
  },
  {
    id: "doc-2",
    name: "Dr. Ngozi Achebe",
    specialty: "Pediatrics",
    rating: 4.8,
    experience: "10 Years",
    fees: 11000,
    image: "https://images.unsplash.com/photo-1651008011206-43c3919babcf?q=80&w=256&auto=format&fit=crop",
    availability: "Tue, Thu (10:00 AM - 4:00 PM)",
    email: "ngozi.achebe@paliconhospital.org"
  },
  {
    id: "doc-3",
    name: "Dr. Emeka Okafor",
    specialty: "Neurology",
    rating: 5.0,
    experience: "18 Years",
    fees: 18000,
    image: "https://images.unsplash.com/photo-1631215534059-400c2858b4f3?q=80&w=256&auto=format&fit=crop",
    availability: "Mon, Thu (1:00 PM - 5:00 PM)",
    email: "emeka.okafor@paliconhospital.org"
  },
  {
    id: "doc-4",
    name: "Dr. Funmilayo Alao",
    specialty: "Orthopedics",
    rating: 4.7,
    experience: "12 Years",
    fees: 13000,
    image: "https://images.unsplash.com/photo-1622960206462-7d97b8377f52?q=80&w=256&auto=format&fit=crop",
    availability: "Wed, Fri (10:00 AM - 3:00 PM)",
    email: "funmilayo.alao@paliconhospital.org"
  },
  {
    id: "doc-5",
    name: "Dr. Babajide Sowore",
    specialty: "General Medicine",
    rating: 4.9,
    experience: "15 Years",
    fees: 9500,
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=256&auto=format&fit=crop",
    availability: "Mon, Tue, Wed, Thu, Fri (8:30 AM - 12:00 PM)",
    email: "babajide.sowore@paliconhospital.org"
  },
  {
    id: "doc-6",
    name: "Dr. Amina Yusuf",
    specialty: "Dermatology",
    rating: 4.8,
    experience: "8 Years",
    fees: 12000,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
    availability: "Tue, Wed (2:00 PM - 6:00 PM)",
    email: "amina.yusuf@paliconhospital.org"
  }
];

export const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM"
];
