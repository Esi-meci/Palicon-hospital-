import React from "react";
import { 
  User, LogIn, LogOut, Shield, Heart, Menu, X, Calendar 
} from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onBookClick: () => void;
}

export default function Navbar({ 
  currentView, 
  setView, 
  user, 
  onLogin, 
  onLogout,
  onBookClick
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "departments", label: "Departments" },
    { id: "doctors", label: "Our Doctors" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact Us" }
  ];

  return (
    <nav className="bg-white border-b border-emerald-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => setView("home")} 
              className="flex items-center gap-2 cursor-pointer group"
              id="nav-logo-btn"
            >
              <div className="bg-emerald-600 text-white p-2 rounded-xl group-hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                <Heart className="w-5 h-5 fill-emerald-100" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-emerald-950">
                Palicon<span className="text-emerald-600">Hospital</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                id={`nav-link-${item.id}`}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                  currentView === item.id
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-emerald-900/70 hover:text-emerald-800 hover:bg-emerald-50/50"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Portal / Dashboard Access */}
            {user && (
              <button
                onClick={() => setView("dashboard")}
                id="nav-link-portal"
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  currentView === "dashboard"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-emerald-900/70 hover:text-emerald-800 hover:bg-emerald-50/50"
                }`}
              >
                <Calendar className="w-4 h-4" />
                {user.role === "admin" ? "Admin Panel" : "Patient Portal"}
              </button>
            )}
          </div>

          {/* User Sign In/Profile Area */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onBookClick}
              id="nav-book-appointment-btn"
              className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl border border-emerald-250 text-emerald-800 font-extrabold text-sm bg-emerald-50/40 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer shadow-xs"
            >
              <Calendar className="w-4 h-4 shrink-0 text-emerald-600 group-hover:text-white" />
              Book Appointment
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono font-medium text-emerald-800 flex items-center gap-1 justify-end">
                    {user.role === "admin" && (
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> Admin
                      </span>
                    )}
                    {user.role === "patient" && (
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                        Patient
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-emerald-950 max-w-[150px] truncate">{user.name}</div>
                </div>
                
                <div className="w-9 h-9 bg-emerald-100 text-emerald-800 font-bold rounded-full flex items-center justify-center border border-emerald-200 shadow-sm uppercase">
                  {user.name[0]}
                </div>

                <button
                  onClick={onLogout}
                  id="nav-logout-btn"
                  className="p-2 text-emerald-900/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                id="nav-login-btn"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow-sm shadow-emerald-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Secure Portal
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-emerald-950 hover:bg-emerald-50 cursor-pointer"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1 border-t border-emerald-50 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                currentView === item.id
                  ? "text-emerald-700 bg-emerald-50 font-bold"
                  : "text-emerald-950 hover:bg-emerald-50/50"
              }`}
            >
              {item.label}
            </button>
          ))}

          {user && (
            <button
              onClick={() => {
                setView("dashboard");
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                currentView === "dashboard"
                  ? "text-emerald-700 bg-emerald-50 font-bold"
                  : "text-emerald-950 hover:bg-emerald-50/50"
              }`}
            >
              {user.role === "admin" ? "Admin Panel" : "Patient Portal"}
            </button>
          )}

          <div className="pt-4 pb-2 border-t border-emerald-50 mt-4 px-4 space-y-3">
            <button
              onClick={() => {
                onBookClick();
                setIsOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl border border-emerald-150 text-emerald-800 font-extrabold text-base bg-emerald-50/40 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-emerald-600 group-hover:text-white" />
              Book Appointment
            </button>

            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-emerald-950">{user.name}</div>
                  <div className="text-xs text-emerald-700">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLogin();
                  setIsOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-base shadow-sm hover:bg-emerald-700"
              >
                <LogIn className="w-5 h-5" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
