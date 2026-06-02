import { Doctor, Department } from "./types";

export const DEPARTMENTS: Department[] = [
  {
    name: "OBSTETRICS AND GYNAECOLOGY",
    icon: "Baby",
    description: "Comprehensive prenatal care, general wellness, childbirth services, reproductive healthcare, and surgical gynaecological treatments.",
    symptoms: ["Pregnancy Consultation", "Menstrual Concerns", "Antenatal Care", "Pelvic Pain", "Ultrasound Scans"]
  },
  {
    name: "GENERAL SURGERY",
    icon: "Scissors",
    description: "Advanced surgical solutions for deep system pathologies, trauma operations, hernia corrections, and soft tissue procedures.",
    symptoms: ["Abdominal Patches", "Hernia Pain", "Appendicitis Symptoms", "Gallbladder Stones", "Surgical Consultations"]
  },
  {
    name: "PEDIATRICS",
    icon: "Baby",
    description: "Expert, compassionate clinical care for infants, growing children, and teenagers, preserving childhood development pathways.",
    symptoms: ["Childhood Fever", "Growth Evaluation", "Pediatric Rashes", "Development Tracking", "Routine Immunizations"]
  },
  {
    name: "ACCIDENT AND EMMERGENCY",
    icon: "Ambulance",
    description: "24/7 hyper-responsive level-1 emergency triage, critical trauma intervention, and immediate acute medical stabilizing care.",
    symptoms: ["Severe Injuries", "Acute Respiratory Distress", "Sudden Chest Pain", "High Fever Crisis", "Immediate Trauma Services"]
  },
  {
    name: "GERIATRICS",
    icon: "Heart",
    description: "Specialized diagnostics and continuous clinical care for older adults, focusing on preservation of mobility, cognitive health, and comfort.",
    symptoms: ["Age-related Mobility Blocks", "Memory Assessment", "Polypharmacy Management", "Balance & Fall Hazards", "Frailty Evaluation"]
  },
  {
    name: "GENERAL MEDICINE",
    icon: "Stethoscope",
    description: "Primary healthcare, complete physical evaluations, routine checkups, immunizations, and chronic illness management.",
    symptoms: ["Cold & Flu", "High Blood Pressure", "Dull Migraines", "Fatigue Queries", "Annual Physical Exams"]
  },
  {
    name: "ORTHOPEDICS",
    icon: "Bone",
    description: "Advanced musculoskeletal diagnoses, joint alignment therapies, fracture bone restoration, and professional sports medicine.",
    symptoms: ["Joint Dislocation Pain", "Post-Fracture Checkups", "Chronic Back Tension", "Strains & Muscle Sprains"]
  },
  {
    name: "MEDICAL LABORATORY SERVICES",
    icon: "FlaskConical",
    description: "Precision-driven chemical biochemistry, complete diagnostic blood count tracking, hormonal panels, and clinical pathology tests.",
    symptoms: ["Complete Blood Counts", "Urinalysis Scans", "Cholesterol Panels", "Hormonal Assays", "Pathology Underpinnings"]
  },
  {
    name: "RADIOLOGY",
    icon: "Activity",
    description: "Ultra-precise digital X-rays, high-definition ultrasound scans, computed tomography (CT), and advanced diagnostic imaging.",
    symptoms: ["Bone Fractures Scans", "Chest Imaging", "Abdomen Ultrasound", "CT Diagnostics Consultation", "MRI Reviews"]
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Olusegun Bello",
    specialty: "ACCIDENT AND EMMERGENCY",
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
    specialty: "PEDIATRICS",
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
    specialty: "GENERAL SURGERY",
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
    specialty: "ORTHOPEDICS",
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
    specialty: "GENERAL MEDICINE",
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
    specialty: "OBSTETRICS AND GYNAECOLOGY",
    rating: 4.8,
    experience: "8 Years",
    fees: 12000,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
    availability: "Tue, Wed (2:00 PM - 6:00 PM)",
    email: "amina.yusuf@paliconhospital.org"
  },
  {
    id: "doc-7",
    name: "Dr. Kingsley Peters",
    specialty: "GERIATRICS",
    rating: 4.9,
    experience: "16 Years",
    fees: 16000,
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=256&auto=format&fit=crop",
    availability: "Mon, Wed (11:00 AM - 4:00 PM)",
    email: "kingsley.peters@paliconhospital.org"
  },
  {
    id: "doc-8",
    name: "Dr. Helen Bassey",
    specialty: "MEDICAL LABORATORY SERVICES",
    rating: 4.8,
    experience: "11 Years",
    fees: 8000,
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=256&auto=format&fit=crop",
    availability: "Tue, Thu, Fri (8:00 AM - 3:00 PM)",
    email: "helen.bassey@paliconhospital.org"
  },
  {
    id: "doc-9",
    name: "Dr. Tochukwu Obi",
    specialty: "RADIOLOGY",
    rating: 4.9,
    experience: "13 Years",
    fees: 14000,
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=256&auto=format&fit=crop",
    availability: "Mon, Wed, Thu (9:00 AM - 2:00 PM)",
    email: "tochukwu.obi@paliconhospital.org"
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
