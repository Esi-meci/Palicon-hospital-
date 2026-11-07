import { Doctor, Department } from "./types";
import nurseAhmedImg from "./assets/images/nurse-ahmed-rosemary.jpeg";
import nurseOlaogunImg from "./assets/images/nurse-olaogun-niniola.jpeg";
import nurseTreasureImg from "./assets/images/nurse-ogochukwu-treasure.jpeg";
import nrsKanayoImg from "./assets/images/nrs-kanayo-florence.jpeg";
import nrsAborowaImg from "./assets/images/nrs-aborowa-ayomide-o.jpeg";
import nrsChijiokeImg from "./assets/images/nrs-chijioke-chioma-priscilla.jpeg";
import oshinBusolaImg from "./assets/images/oshin-busola-o.jpeg";
import ainaSegunImg from "./assets/images/aina-segun-johnson.jpeg";

export const DEPARTMENTS: Department[] = [
  {
    name: "Nursing",
    icon: "HeartHandshake",
    description: "Dedicated patient clinical nursing, continuous bedside care, post-surgical observation, wound dressing, vitals triage, and medication administration.",
    symptoms: ["Wound Dressing", "Medication Injections", "Post-Surgical Nursing", "Vitals Assessment", "Bedside Monitoring"]
  },
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
    name: "Nurse Ogochukwu Treasure",
    specialty: "Nursing",
    rating: 5.0,
    experience: "12 Years",
    fees: 11000,
    image: nurseTreasureImg || "/Nurse Ogochukwu Treasure.jpeg",
    availability: "Mon, Thu, Fri (9:00 AM - 4:00 PM)",
    email: "ogochukwu.treasure@paliconhospital.org"
  },
  {
    id: "doc-2",
    name: "Nurse Ahmed Temitope Rosemary",
    specialty: "Nursing",
    rating: 4.9,
    experience: "14 Years",
    fees: 10000,
    image: nurseAhmedImg || "/Nurse Ahmed Temitope Rosemary.jpeg",
    availability: "Mon, Wed, Fri (8:00 AM - 2:00 PM)",
    email: "ahmed.rosemary@paliconhospital.org"
  },
  {
    id: "doc-3",
    name: "Nurse Olaogun Niniola",
    specialty: "Nursing",
    rating: 4.8,
    experience: "10 Years",
    fees: 9500,
    image: nurseOlaogunImg || "/Nurse Olaogun Niniola.jpeg",
    availability: "Tue, Thu, Sat (8:00 AM - 3:00 PM)",
    email: "olaogun.niniola@paliconhospital.org"
  },
  {
    id: "doc-nrs-kanayo",
    name: "Nrs Kanayo Florence",
    specialty: "Nursing",
    rating: 4.9,
    experience: "11 Years",
    fees: 10500,
    image: nrsKanayoImg || "/Nrs Kanayo Florence.jpeg",
    availability: "Mon, Tue, Thu (8:00 AM - 3:00 PM)",
    email: "kanayo.florence@paliconhospital.org"
  },
  {
    id: "doc-nrs-aborowa",
    name: "Nrs Aborowa Ayomide O",
    specialty: "Nursing",
    rating: 4.9,
    experience: "9 Years",
    fees: 9500,
    image: nrsAborowaImg || "/Nrs Aborowa Ayomide O.jpeg",
    availability: "Tue, Wed, Fri (9:00 AM - 4:00 PM)",
    email: "aborowa.ayomide@paliconhospital.org"
  },
  {
    id: "doc-nrs-chijioke",
    name: "Nrs Chijioke Chioma Priscilla",
    specialty: "Nursing",
    rating: 5.0,
    experience: "13 Years",
    fees: 11500,
    image: nrsChijiokeImg || "/Nrs Chijioke Chioma Priscilla.jpeg",
    availability: "Wed, Thu, Sat (8:00 AM - 2:30 PM)",
    email: "chijioke.chioma@paliconhospital.org"
  },
  {
    id: "doc-nrs-oshin",
    name: "Nurse Oshin Busola O",
    specialty: "Nursing",
    rating: 4.9,
    experience: "10 Years",
    fees: 10000,
    image: oshinBusolaImg || "/Nurse Oshin Busola O.jpeg",
    availability: "Mon, Wed, Fri (8:00 AM - 3:00 PM)",
    email: "oshin.busola@paliconhospital.org"
  },
  {
    id: "staff-aina-segun",
    name: "Aina Segun Johnson",
    specialty: "Lab scientist",
    rating: 5.0,
    experience: "9 Years",
    fees: 8500,
    image: ainaSegunImg || "/Aina Segun Johnson.jpeg",
    availability: "Mon, Tue, Wed, Thu, Fri (8:00 AM - 4:00 PM)",
    email: "aina.segun@paliconhospital.org"
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
