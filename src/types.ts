export type UserRole = "patient" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: any; // Firestore Timestamp
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  fees: number;
  image: string;
  availability: string; // e.g. "Mon, Wed, Fri (9am - 5pm)"
  email: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt: any; // Firestore Timestamp
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  notes: string;
  fileName: string;
  fileData: string; // File text or simulated report data
  status: string; // e.g., "Ready", "Reviewed"
  uploadedAt: any; // Firestore Timestamp
}

export interface Department {
  name: string;
  icon: string;
  description: string;
  symptoms: string[];
}

export interface Inquiry {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  subject?: string;
  message: string;
  adminReply?: string;
  status: "pending" | "replied";
  adminTyping?: boolean;
  createdAt: any; // Firestore Timestamp
  repliedAt?: any; // Firestore Timestamp
}

