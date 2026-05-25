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
  const [showDropdown, setShowDropdown] = React.useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "departments", label: "Departments" },
    { id: "doctors", label: "Our Doctors" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact Us" }
  ];

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Navigation Links Grouped Cloroser Together */}
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <button 
                onClick={() => setView("home")} 
                className="flex items-center gap-2 cursor-pointer group"
                id="nav-logo-btn"
              >
                <div className="bg-emerald-600 text-white p-2 rounded-xl group-hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                  <Heart className="w-5 h-5 fill-emerald-100" />
                </div>
                <span className="font-sans font-extrabold text-xl tracking-tight text-emerald-950">
                  Palicon<span className="text-emerald-600">Hospital</span>
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer ${
                    currentView === item.id
                      ? "text-emerald-800 bg-emerald-50/80 font-bold"
                      : "text-emerald-955/70 hover:text-emerald-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Portal / Dashboard Access Shortcut */}
              {user && currentView !== "dashboard" && (
                <button
                  onClick={() => setView("dashboard")}
                  id="nav-link-portal"
                  className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    currentView === "dashboard"
                      ? "text-emerald-800 bg-emerald-50/80 font-bold"
                      : "text-emerald-955/70 hover:text-emerald-900 hover:bg-slate-50"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  {user.role === "admin" ? "Admin Panel" : "Patient Portal"}
                </button>
              )}
            </div>
          </div>

          {/* User Sign In/Profile Area */}
          <div className="hidden md:flex items-center space-x-3">
            {(!user || user.role !== "admin") && (
              <button
                onClick={onBookClick}
                id="nav-book-appointment-btn"
                className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl border border-emerald-200 text-emerald-800 font-extrabold text-xs uppercase tracking-wider bg-emerald-50/20 hover:bg-emerald-650 hover:text-white hover:border-emerald-650 hover:bg-emerald-600 hover:border-emerald-605 transition-all cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4 shrink-0 text-emerald-600 group-hover:text-white" />
                Book Appointment
              </button>
            )}

            {user ? (
              <div className="relative" id="user-profile-dropdown-container">
                {/* Avatar Toggle Button */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  id="nav-avatar-toggle"
                  className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-xl transition-all border border-slate-100 cursor-pointer active:scale-95"
                  title="View Profile Actions"
                >
                  <div className="w-8.5 h-8.5 bg-gradient-to-tr from-emerald-600 to-emerald-850 bg-emerald-700 text-white font-black rounded-full flex items-center justify-center border border-emerald-100 shadow-xs uppercase text-sm shrink-0">
                    {user.name ? user.name[0] : "P"}
                  </div>
                  <div className="text-[11px] flex flex-col items-start leading-none text-left font-sans pl-0.5">
                    <span className="font-bold text-emerald-950 max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                    <span className="text-[9px] font-mono text-emerald-700 capitalize font-semibold mt-0.5">{user.role}</span>
                  </div>
                  <span className="text-[8px] text-emerald-900/40 leading-none pl-1 select-none">▼</span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Full screen overlay background to capture off-target clicks safely */}
                    <button 
                      className="fixed inset-0 z-40 w-full h-full bg-transparent cursor-default focus:outline-none" 
                      onClick={() => setShowDropdown(false)}
                      aria-label="Close dropdown"
                    />
                    
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-emerald-150 rounded-2xl shadow-xl z-50 py-3 text-left overflow-hidden animate-in fade-in duration-100">
                      {/* User details header in dropdown block */}
                      <div className="px-4 py-2 border-b border-slate-50 pb-3 mb-2">
                        <span className="inline-flex bg-emerald-50 text-emerald-800 border border-emerald-100/60 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase font-mono tracking-wider">
                          {user.role === "admin" ? "🛠️ Administrator" : "🏥 Verified Patient"}
                        </span>
                        <div className="text-sm font-bold text-emerald-950 truncate mt-1.5">{user.name}</div>
                        <div className="text-[10px] text-emerald-900/40 truncate font-mono mt-0.5">{user.email}</div>
                      </div>

                      {/* View dashboard portal shortcut link */}
                      {currentView !== "dashboard" && (
                        <button
                          onClick={() => {
                            setView("dashboard");
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-emerald-950 hover:bg-emerald-50/70 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          {user.role === "admin" ? "Open Administration Hub" : "View My Patient Portal"}
                        </button>
                      )}

                      {/* Log out option */}
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-50 mt-1.5 pt-2.5"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                        Log Out Account
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                id="nav-login-btn"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow-sm shadow-emerald-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Login/SignUp
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

          {user && currentView !== "dashboard" && (
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
            {(!user || user.role !== "admin") && (
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
            )}

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
                Login/SignUp
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
