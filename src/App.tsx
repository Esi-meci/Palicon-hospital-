import React, { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  deleteDoc
} from "firebase/firestore";
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from "./firebase";
import { UserProfile, Doctor, Appointment, MedicalReport, UserRole, Inquiry } from "./types";
import { INITIAL_DOCTORS } from "./data";

// Extracted Subcomponents
import Navbar from "./components/Navbar";
import HomeHero from "./components/HomeHero";
import DepartmentsSection from "./components/DepartmentsSection";
import DoctorsSection from "./components/DoctorsSection";
import BookingModal from "./components/BookingModal";
import PatientDashboard from "./components/PatientDashboard";
import AdminPanel from "./components/AdminPanel";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import LiveChatWidget from "./components/LiveChatWidget";

// Lucide icon for local display alerts
import { Sparkles, Activity, ShieldAlert, BadgeCheck, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [currentView, setView] = useState<string>("home");
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Firestore Data Collections
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Dialog and Care State parameters
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  // Seeding trigger: Seeds doctors collections on initial mount for clean look
  useEffect(() => {
    const loadDoctorsAndSeed = () => {
      const doctorsRef = collection(db, "doctors");
      // Use standard real-time listener for doctors so admins can add or remove them cleanly
      const unsubscribe = onSnapshot(doctorsRef, (snapshot) => {
        if (snapshot.empty) {
          // Fallback to static initial list if database is freshly deployed
          setDoctors(INITIAL_DOCTORS);
        } else {
          const list: Doctor[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Doctor);
          });
          setDoctors(list);
        }
      }, (error) => {
        console.warn("Public doctors listing using offline fallback lists", error);
        setDoctors(INITIAL_DOCTORS);
      });
      return unsubscribe;
    };

    const unsubDoctors = loadDoctorsAndSeed();
    return () => unsubDoctors();
  }, []);

  // Monitor Authentication and Sync User Profile Document
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (userObj) => {
      setFirebaseUser(userObj);
      if (userObj) {
        try {
          // Fetch or record profile document in Firestore
          const userDocRef = doc(db, "users", userObj.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data() as UserProfile);
          } else {
            // Self-assign role: "admin" if email is bootstrapped, else "patient"
            const role: UserRole = userObj.email === "gowinmercy@gmail.com" ? "admin" : "patient";
            const newProfile: UserProfile = {
              uid: userObj.uid,
              name: userObj.displayName || "Authenticated Patient",
              email: userObj.email || "no-email@palicon.org",
              role: role,
              createdAt: Timestamp.now()
            };
            
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error("Failed to sync authenticated user profile", err);
          // Safe offline state mapping for demo compatibility
          setUserProfile({
            uid: userObj.uid,
            name: userObj.displayName || "Patient Demo-Mode",
            email: userObj.email || "tester@palicon.org",
            role: userObj.email === "gowinmercy@gmail.com" ? "admin" : "patient",
            createdAt: Timestamp.now()
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Database synchronization according to user role permissions
  useEffect(() => {
    if (!userProfile) {
      setAppointments([]);
      setReports([]);
      setPatients([]);
      return;
    }

    let unsubAppointments = () => {};
    let unsubReports = () => {};
    let unsubPatients = () => {};
    let unsubInquiries = () => {};

    const uid = userProfile.uid;

    if (userProfile.role === "admin") {
      // Admin sees everything
      const aptsRef = collection(db, "appointments");
      unsubAppointments = onSnapshot(aptsRef, (snapshot) => {
        const list: Appointment[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Appointment);
        });
        setAppointments(list.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, "appointments");
      });

      const usersRef = collection(db, "users");
      unsubPatients = onSnapshot(usersRef, (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as UserProfile);
        });
        setPatients(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, "users");
      });

      // Show reports that exist
      const reportsRef = collection(db, "reports");
      unsubReports = onSnapshot(reportsRef, (snapshot) => {
        const list: MedicalReport[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as MedicalReport);
        });
        setReports(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, "reports");
      });

      // Show inquiries that exist
      const inquiriesRef = collection(db, "inquiries");
      unsubInquiries = onSnapshot(inquiriesRef, (snapshot) => {
        const list: Inquiry[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Inquiry);
        });
        setInquiries(list.sort((a,b) => {
          const secA = a.createdAt?.seconds || 0;
          const secB = b.createdAt?.seconds || 0;
          return secB - secA;
        }));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, "inquiries");
      });

    } else {
      // Patient sees only their own data (Secure List Queries enforced)
      const aptsQuery = query(collection(db, "appointments"), where("patientId", "==", uid));
      unsubAppointments = onSnapshot(aptsQuery, (snapshot) => {
        const list: Appointment[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Appointment);
        });
        setAppointments(list.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, `appointments patientId=${uid}`);
      });

      const reportsQuery = query(collection(db, "reports"), where("patientId", "==", uid));
      unsubReports = onSnapshot(reportsQuery, (snapshot) => {
        const list: MedicalReport[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as MedicalReport);
        });
        setReports(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, `reports patientId=${uid}`);
      });
    }

    return () => {
      unsubAppointments();
      unsubReports();
      unsubPatients();
      unsubInquiries();
    };
  }, [userProfile]);

  // Handle Authentication trigger
  const handleLogin = async () => {
    try {
      setGlobalError(null);
      await signInWithPopup(auth, googleProvider);
      triggerSuccessBanner("Successfully logged into clinical workspace.");
    } catch (err) {
      setGlobalError("Authentication failed. Please verify popup blocks or credentials.");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView("home");
      triggerSuccessBanner("Logged out successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  // Helper simulated Login option for Quick Testing inside sandboxed environments
  const handleSimulatedLogin = async (role: UserRole) => {
    try {
      setLoading(true);
      setGlobalError(null);
      // Simulate by generating a stable UID in state
      const simulatedEmail = role === "admin" ? "gowinmercy@gmail.com" : "simulated.patient@palicon.org";
      const simulatedName = role === "admin" ? "Mercy Godwin (Admin)" : "Simulated Patient Care";
      const mockUid = role === "admin" ? "admin-demo-uid-999" : "patient-demo-uid-101";

      const mockProfile: UserProfile = {
        uid: mockUid,
        name: simulatedName,
        email: simulatedEmail,
        role: role,
        createdAt: Timestamp.now()
      };

      // Write user profile directly to database to allow query sync to function fully
      const mockUserRef = doc(db, "users", mockUid);
      await setDoc(mockUserRef, mockProfile);
      
      setUserProfile(mockProfile);
      setView("dashboard");
      triggerSuccessBanner(`Demo Mode Active: Authenticated as ${role.toUpperCase()}`);
    } catch (err) {
      console.error("Error setting up simulated dashboard profile", err);
      setGlobalError("Simulated registration error.");
    } finally {
      setLoading(false);
    }
  };

  // Handle saving booked appointment from modal
  const handleConfirmBooking = async (details: { date: string; time: string; notes: string }) => {
    if (!userProfile || !bookingDoctor) {
      throw new Error("Missing active profile or destination specialist parameters.");
    }

    const appointmentId = `apt-${Date.now()}`;
    const newApt: Appointment = {
      id: appointmentId,
      patientId: userProfile.uid,
      patientName: userProfile.name,
      patientEmail: userProfile.email,
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      doctorSpecialty: bookingDoctor.specialty,
      date: details.date,
      time: details.time,
      status: "pending",
      notes: details.notes,
      createdAt: Timestamp.now()
    };

    try {
      const aptRef = doc(db, "appointments", appointmentId);
      await setDoc(aptRef, newApt);
      triggerSuccessBanner(`Care appointment with ${bookingDoctor.name} holds successful reservation!`);
      setView("dashboard");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `appointments/${appointmentId}`);
    }
  };

  // Handle instant direct booking from patient dashboard
  const handleDirectInstantBook = async (details: { doctorId: string; doctorName: string; doctorSpecialty: string; date: string; time: string; notes: string }) => {
    if (!userProfile) {
      throw new Error("Missing active profile parameter.");
    }

    const appointmentId = `apt-${Date.now()}`;
    const newApt: Appointment = {
      id: appointmentId,
      patientId: userProfile.uid,
      patientName: userProfile.name,
      patientEmail: userProfile.email,
      doctorId: details.doctorId,
      doctorName: details.doctorName,
      doctorSpecialty: details.doctorSpecialty,
      date: details.date,
      time: details.time,
      status: "pending",
      notes: details.notes,
      createdAt: Timestamp.now()
    };

    try {
      const aptRef = doc(db, "appointments", appointmentId);
      await setDoc(aptRef, newApt);
      triggerSuccessBanner(`Care appointment with ${details.doctorName} holds successful reservation!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `appointments/${appointmentId}`);
      throw error;
    }
  };

  // Handle Patient cancel booking
  const handleCancelAppointment = async (id: string) => {
    try {
      const aptDocRef = doc(db, "appointments", id);
      const appointmentSnap = await getDoc(aptDocRef);
      if (appointmentSnap.exists()) {
        const aptData = appointmentSnap.data() as Appointment;
        const updatedApt = { ...aptData, status: "cancelled" };
        await setDoc(aptDocRef, updatedApt);
        triggerSuccessBanner("Appointment slot cancelled successfully.");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  // Handle Admin updating appointment status (confirmed, completed, etc.)
  const handleUpdateStatus = async (id: string, newStatus: "confirmed" | "completed" | "cancelled") => {
    try {
      const aptDocRef = doc(db, "appointments", id);
      const appointmentSnap = await getDoc(aptDocRef);
      if (appointmentSnap.exists()) {
        const aptData = appointmentSnap.data() as Appointment;
        const updatedApt = { ...aptData, status: newStatus };
        await setDoc(aptDocRef, updatedApt);
        triggerSuccessBanner(`Appointment state successfully transitioned to ${newStatus}.`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  // Handle adding new synthetic clinical report document to vault
  const handleAddReport = async (details: { diagnosis: string; notes: string; doctorName: string; fileName: string; fileData: string }) => {
    if (!userProfile) return;
    const reportId = `rep-${Date.now()}`;
    const newReport: MedicalReport = {
      id: reportId,
      patientId: userProfile.uid,
      patientName: userProfile.name,
      doctorName: details.doctorName,
      diagnosis: details.diagnosis,
      notes: details.notes,
      fileName: details.fileName,
      fileData: details.fileData,
      status: "Ready for review",
      uploadedAt: Timestamp.now()
    };

    try {
      const reportRef = doc(db, "reports", reportId);
      await setDoc(reportRef, newReport);
      triggerSuccessBanner("Record synced inside your encrypted clinical vault.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `reports/${reportId}`);
    }
  };

  // Admin registers a new clinical Doctor registry
  const handleAddDoctorRegistry = async (newDoc: Omit<Doctor, "rating">) => {
    try {
      const typedDoc: Doctor = {
        ...newDoc,
        rating: 4.9
      };
      await setDoc(doc(db, "doctors", typedDoc.id), typedDoc);
      triggerSuccessBanner(`Successfully registered ${typedDoc.name} in clinical directories.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `doctors/${newDoc.id}`);
    }
  };

  // Admin removes a doctor from registry
  const handleRemoveDoctorRegistry = async (id: string) => {
    try {
      await deleteDoc(doc(db, "doctors", id));
      triggerSuccessBanner("Doctor removed from directory logs.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `doctors/${id}`);
    }
  };

  const handleReplyInquiry = async (id: string, replyMessage: string) => {
    try {
      const inquiryRef = doc(db, "inquiries", id);
      const inquirySnap = await getDoc(inquiryRef);
      if (inquirySnap.exists()) {
        const updated = {
          ...inquirySnap.data(),
          adminReply: replyMessage,
          status: "replied",
          repliedAt: Timestamp.now()
        };
        await setDoc(inquiryRef, updated);
        triggerSuccessBanner("Support reply transmitted successfully.");
      }
    } catch (err) {
      console.error("Failed to update inquiry state on Firestore", err);
      setGlobalError("Failed to submit support reply.");
    }
  };

  const triggerSuccessBanner = (message: string) => {
    setGlobalSuccess(message);
    setTimeout(() => setGlobalSuccess(null), 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-emerald-950 flex flex-col justify-between font-sans selection:bg-emerald-100 select-none">
      
      {/* Universal Success & Failure Notification Bars */}
      <div>
        {globalSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-3 text-xs font-bold font-mono tracking-wide shadow-md flex items-center justify-center gap-2 animate-bounce">
            <BadgeCheck className="w-4 h-4 text-emerald-100" />
            {globalSuccess}
          </div>
        )}

        {globalError && (
          <div className="bg-rose-600 text-white px-4 py-3 text-xs font-bold font-mono tracking-wide shadow-md flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-100" />
            {globalError}
            <button onClick={() => setGlobalError(null)} className="underline ml-4 cursor-pointer">dismiss</button>
          </div>
        )}

        {/* Global Loading Screen */}
        {loading && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-xs z-50 flex flex-col justify-center items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs font-bold tracking-widest text-emerald-950 uppercase font-mono">Loading Palicon...</span>
          </div>
        )}

        {/* Common Header Navigation */}
        <Navbar 
          currentView={currentView} 
          setView={setView} 
          user={userProfile} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
          onBookClick={() => {
            const firstDoctor = doctors[0] || null;
            if (firstDoctor) {
              setBookingDoctor(firstDoctor);
            } else {
              setView("doctors");
            }
          }}
        />

        {/* Dynamic Inner Layout Body Router */}
        <main className="flex-1 pb-16">
          {currentView === "home" && (
            <HomeHero 
              onBookNow={() => {
                const firstDoctor = doctors[0] || null;
                if (firstDoctor) {
                  setBookingDoctor(firstDoctor);
                } else {
                  setView("doctors");
                }
              }} 
              onExploreDoctors={() => { setSelectedSpecialty("All"); setView("doctors"); }}
              onViewDepartments={() => setView("departments")}
            />
          )}

          {currentView === "departments" && (
            <DepartmentsSection 
              onSelectSpecialty={(specialty) => {
                setSelectedSpecialty(specialty);
                setView("doctors");
              }}
            />
          )}

          {currentView === "doctors" && (
            <DoctorsSection 
              onBookAppointment={(doc) => setBookingDoctor(doc)}
              selectedSpecialtyFilter={selectedSpecialty}
              setSelectedSpecialtyFilter={setSelectedSpecialty}
              doctors={doctors}
            />
          )}

          {currentView === "about" && (
            <AboutUs />
          )}

          {currentView === "contact" && (
            <ContactUs onSuccessMessage={triggerSuccessBanner} />
          )}

          {currentView === "dashboard" && userProfile && (
            userProfile.role === "admin" ? (
              <AdminPanel 
                user={userProfile} 
                appointments={appointments} 
                doctors={doctors} 
                patients={patients}
                inquiries={inquiries}
                onUpdateStatus={handleUpdateStatus}
                onAddDoctor={handleAddDoctorRegistry}
                onRemoveDoctor={handleRemoveDoctorRegistry}
                onReplyInquiry={handleReplyInquiry}
              />
            ) : (
              <PatientDashboard 
                user={userProfile} 
                appointments={appointments} 
                reports={reports}
                onCancelAppointment={handleCancelAppointment}
                onAddReport={handleAddReport}
                doctors={doctors}
                onBookDoctorDirectly={(doc) => setBookingDoctor(doc)}
                onInstantBook={handleDirectInstantBook}
              />
            )
          )}

          {currentView === "dashboard" && !userProfile && (
            <div className="py-24 max-w-md mx-auto px-4 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-emerald-700 mx-auto" strokeWidth={1.5} />
              <div className="space-y-1">
                <h2 className="text-xl font-sans font-bold text-emerald-950">Patient Admission Gate Locked</h2>
                <p className="text-sm text-emerald-900/60 leading-relaxed font-sans">
                  Please authenticate with your secure clinical login card or select one of our quick developer simulation profiles to explore.
                </p>
              </div>

              {/* Developer Environment Preset Selectors */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3 mt-6">
                <div className="text-[10px] text-emerald-900/40 uppercase tracking-widest font-mono font-bold">
                  Quick Developer Preset Access
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSimulatedLogin("patient")}
                    id="simulate-patient-btn"
                    className="inline-flex justify-center items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Simulate Patient
                  </button>
                  <button
                    onClick={() => handleSimulatedLogin("admin")}
                    id="simulate-admin-btn"
                    className="inline-flex justify-center items-center gap-1 bg-emerald-800 hover:bg-emerald-950 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Simulate Admin
                  </button>
                </div>
                <div className="text-[10px] text-emerald-900/40 leading-relaxed font-sans">
                  *Quick access profiles simulate full role permissions dynamically using live Firestore document indexing.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Appointment Booking Modal Drawer */}
      {bookingDoctor && (
        <BookingModal 
          doctor={bookingDoctor} 
          onClose={() => setBookingDoctor(null)} 
          onConfirm={handleConfirmBooking}
          isAuthenticated={!!userProfile}
          onLoginTrigger={() => {
            setBookingDoctor(null);
            handleLogin();
          }}
        />
      )}

      {/* Dynamic, fully improved professional hospital footer */}
      <footer className="bg-emerald-950 text-white border-t border-emerald-900 font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {/* Branding & Mission */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-emerald-450 font-sans">Palicon Hospital</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed font-light font-sans">
                Delivering clinical excellence, empathetic patient recovery, and private secure electronic diagnostics data vaults to Lagos State and international patients.
              </p>
              <div className="flex gap-4 text-emerald-200/50 pt-1">
                <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold text-emerald-400">Quick Navigation</h4>
              <div className="flex flex-col gap-2 text-xs text-emerald-200/80 font-sans">
                <button onClick={() => setView("home")} className="text-left hover:text-emerald-400 cursor-pointer">Home</button>
                <button onClick={() => setView("departments")} className="text-left hover:text-emerald-400 cursor-pointer">Medical Departments</button>
                <button onClick={() => setView("doctors")} className="text-left hover:text-emerald-400 cursor-pointer">Find Doctors</button>
                <button onClick={() => setView("about")} className="text-left hover:text-emerald-400 cursor-pointer">About Hospital</button>
                <button onClick={() => setView("contact")} className="text-left hover:text-emerald-400 cursor-pointer">Contact Desk</button>
              </div>
            </div>

            {/* Address & Contact details */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold text-emerald-400 font-sans">Palicon Location Info</h4>
              <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
                1 Popoola Odusami Street, Balogun Lane, Abule Folly, Lagos 105101, Lagos, Nigeria
              </p>
              <div className="space-y-1.5 text-xs text-emerald-200/80 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Contact Hotline:</span>
                  <a href="tel:+2348072606299" className="hover:text-emerald-400 font-mono">+234 807 260 6299</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Emergency Core Desk:</span>
                  <span className="text-rose-400 font-bold uppercase font-mono">24 Hours / 7 Days Active</span>
                </div>
                <div className="pt-2 text-[10px] text-emerald-200/50">
                  <span className="font-bold uppercase font-mono h-fit inline-block border border-emerald-800 rounded bg-emerald-950/50 px-1 py-0.5 mr-1 text-emerald-450">
                    WhatsApp Access
                  </span>
                  <a href="https://wa.me/2348072606299" target="_blank" rel="noreferrer" className="underline hover:text-emerald-400 text-emerald-300">
                    Instantly start a Chat with Palicon Helpdesk &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-emerald-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-emerald-200/40 font-mono">
            <div>
              &copy; 2026 Palicon Hospital Medical Group. All rights reserved.
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TLS Secure Clinical Registry</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat on WhatsApp button */}
      <motion.div 
        drag
        dragMomentum={false}
        className="fixed bottom-24 right-6 z-45 cursor-grab active:cursor-grabbing"
      >
        <a
          href="https://wa.me/2348072606299?text=Hello%20Palicon%20Hospital%20Lagos%2C%20I%20would%20like%20to%20inquire%20about%20your%20medical%20services."
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Chat on WhatsApp"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.454L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.228 1.975 13.76 1.03 11.998 1.03c-5.435 0-9.856 4.373-9.86 9.8.001 1.706.452 3.3 1.311 4.773L2.425 21.6l6.222-1.619zm11.234-5.397c-.332-.164-1.961-.956-2.264-1.066-.3-.11-.52-.164-.74.164-.218.328-.846 1.066-1.037 1.285-.19.218-.38.245-.71.081-.33-.163-1.393-.507-2.653-1.62-.98-.863-1.642-1.93-1.834-2.256-.19-.328-.02-.505.145-.669.148-.148.33-.382.495-.574.165-.19.22-.328.33-.546.11-.218.055-.41-.028-.574-.083-.163-.74-1.782-1.013-2.441-.267-.643-.538-.553-.74-.564-.19-.01-.41-.01-.63-.01-.22 0-.58.081-.884.41-.304.328-1.162 1.12-1.162 2.73 0 1.61 1.194 3.167 1.36 3.385.164.218 2.35 3.541 5.694 4.966.795.34 1.416.541 1.9.697.8.251 1.528.216 2.102.13.64-.096 1.961-.793 2.237-1.558.275-.765.275-1.42.19-1.558-.083-.138-.304-.22-.635-.384z"/>
          </svg>
        </a>
      </motion.div>

      {/* Floating Live Support Inquiry Widget */}
      <LiveChatWidget user={userProfile} onSuccessMessage={triggerSuccessBanner} />

    </div>
  );
}
