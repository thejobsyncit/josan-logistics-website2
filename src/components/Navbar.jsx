import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Package, 
  Truck, 
  Search, 
  UserCheck, 
  ShieldCheck, 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Edit2,
  Save
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { 
    currentRole, 
    currentUser, 
    toggleRole, 
    setIsAuthModalOpen, 
    setActiveTrackingId,
    logoutUser,
    setCustomerSubTab,
    setDriverSubTab,
    updateUserProfile,
    showToast
  } = useLogistics();

  const [headerSearch, setHeaderSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editDob, setEditDob] = useState('');

  const startEditing = () => {
    setEditName(currentUser?.name || '');
    setEditPhone(currentUser?.phone || '');
    setEditCompany(currentUser?.company || '');
    setEditLicense(currentUser?.licenseNumber || '');
    setEditDob(currentUser?.dob || '');
    setIsEditing(true);
  };

  const saveProfileChanges = (e) => {
    e.preventDefault();
    const activeRole = currentUser?.role || currentRole;
    const updated = {
      name: editName,
      phone: editPhone,
      company: activeRole === 'customer' ? editCompany : currentUser?.company,
      licenseNumber: activeRole === 'driver' ? editLicense : currentUser?.licenseNumber,
      dob: activeRole === 'driver' ? editDob : currentUser?.dob
    };
    updateUserProfile(updated);
    setIsEditing(false);
  };

  const handleHeaderSearch = (e) => {
    if (e) e.preventDefault();
    if (headerSearch.trim()) {
      const term = headerSearch.trim();
      setActiveTrackingId(term);
      setActiveTab('track');
      setHeaderSearch('');
      setMobileMenuOpen(false);
      if (showToast) showToast(`Loaded Live Satellite Telematics for #${term.toUpperCase()}`);
    }
  };

  let navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  if (currentUser) {
    const role = currentUser.role || currentRole;
    if (role === 'customer') {
      navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'services', label: 'Services' },
        { id: 'track', label: 'Track Shipment' },
        { id: 'book', label: 'Book Shipment' },
        { id: 'contact', label: 'Contact' },
        { id: 'customer-dashboard', label: 'My Orders' },
      ];
    } else if (role === 'driver') {
      navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'services', label: 'Services' },
        { id: 'contact', label: 'Contact' },
        { id: 'driver-dashboard', label: 'Driver Portal' },
      ];
    } else if (role === 'admin') {
      navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'services', label: 'Services' },
        { id: 'track', label: 'Track Shipment' },
        { id: 'contact', label: 'Contact' },
        { id: 'admin-dashboard', label: 'Admin Portal' },
      ];
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <img 
              src="/assets/josan_logo.jpg" 
              alt="Josan Logistics Logo" 
              className="h-12 sm:h-14 w-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-200" 
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-slate-700 hover:text-orange-500 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Widget & User Profile / Login */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Tracking Search Bar */}
            <form onSubmit={handleHeaderSearch} className="relative flex items-center">
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Track ID (e.g. JOS-89421-US)..."
                className="w-48 xl:w-56 pl-9 pr-7 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus-orange placeholder:text-slate-400 font-semibold"
              />
              <button 
                type="submit" 
                title="Search Parcel"
                className="absolute left-2.5 text-slate-400 hover:text-orange-500 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {currentUser ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3 relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-200">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</p>
                    <p className="text-[10px] text-orange-600 font-semibold capitalize">{currentUser.role || currentRole}</p>
                  </div>
                </button>
                <button
                  onClick={logoutUser}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Floating Profile Details Dropdown Card */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-[380px] bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 z-50 text-slate-955 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-sm font-extrabold uppercase tracking-wider text-orange-600">
                        {isEditing ? 'Edit Profile Details' : 'Profile Details'}
                      </span>
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsEditing(false);
                        }}
                        className="text-slate-450 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {isEditing ? (
                      <form onSubmit={saveProfileChanges} className="space-y-4 text-xs text-left">
                        {/* Name Input */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name (Alphabets Only)</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => {
                              const alphaOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                              setEditName(alphaOnly);
                            }}
                            className="w-full p-2.5 bg-slate-55 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                            required
                          />
                        </div>

                        {/* Phone Input */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full p-2.5 bg-slate-55 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                            required
                          />
                        </div>

                        {/* Company Name (if Customer) */}
                        {currentRole === 'customer' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                            <input
                              type="text"
                              value={editCompany}
                              onChange={(e) => setEditCompany(e.target.value)}
                              className="w-full p-2.5 bg-slate-55 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                              required
                            />
                          </div>
                        )}

                        {/* License Number (if Driver) */}
                        {currentRole === 'driver' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">License Number</label>
                            <input
                              type="text"
                              value={editLicense}
                              onChange={(e) => setEditLicense(e.target.value)}
                              className="w-full p-2.5 bg-slate-55 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                              required
                            />
                          </div>
                        )}

                        {/* DOB (if Driver) */}
                        {currentRole === 'driver' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                            <input
                              type="date"
                              value={editDob}
                              onChange={(e) => setEditDob(e.target.value)}
                              className="w-full p-2.5 bg-slate-55 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                              required
                            />
                          </div>
                        )}

                        <div className="pt-2 flex items-center space-x-3">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-orange-sm"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4 text-xs text-left">
                        {/* Name */}
                        <div>
                          <span className="block text-xs text-slate-400 font-bold uppercase">Full Name</span>
                          <span className="font-bold text-sm text-slate-800">{currentUser.name}</span>
                        </div>

                        {/* Email */}
                        <div>
                          <span className="block text-xs text-slate-400 font-bold uppercase">Email Address</span>
                          <span className="font-bold text-sm text-slate-800">{currentUser.email}</span>
                        </div>

                        {/* Phone */}
                        <div>
                          <span className="block text-xs text-slate-400 font-bold uppercase">Phone Number</span>
                          <span className="font-bold text-sm text-slate-800">{currentUser.phone || '+65 8765 4321'}</span>
                        </div>

                        {/* Company (if Customer) */}
                        {currentRole === 'customer' && (
                          <div>
                            <span className="block text-xs text-slate-400 font-bold uppercase">Company Name</span>
                            <span className="font-bold text-sm text-slate-800">{currentUser.company || 'Global Client Corp'}</span>
                          </div>
                        )}

                        {/* License Number (if Driver) */}
                        {currentRole === 'driver' && (
                          <div>
                            <span className="block text-xs text-slate-400 font-bold uppercase">License Number</span>
                            <span className="font-bold text-sm text-slate-800">{currentUser.licenseNumber || 'S9876543A'}</span>
                          </div>
                        )}

                        {/* Date of Birth (if Driver) */}
                        {currentRole === 'driver' && (
                          <div>
                            <span className="block text-xs text-slate-400 font-bold uppercase">Date of Birth</span>
                            <span className="font-bold text-sm text-slate-800">{currentUser.dob || '1990-05-12'}</span>
                          </div>
                        )}

                        {/* Status */}
                        <div>
                          <span className="block text-xs text-slate-400 font-bold uppercase">Account Status</span>
                          <span className="text-emerald-600 font-extrabold flex items-center space-x-1.5 mt-0.5 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                            <span>Active & Verified</span>
                          </span>
                        </div>

                        {/* Access Level */}
                        <div>
                          <span className="block text-xs text-slate-400 font-bold uppercase">Access Level</span>
                          <span className="inline-block px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-extrabold rounded-full uppercase mt-1">
                            {currentRole}
                          </span>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={startEditing}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                          >
                            <Edit2 className="w-4 h-4 text-orange-400" />
                            <span>Edit Profile Info</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-orange-sm transition-all flex items-center space-x-1.5"
              >
                <span>Sign In / Register</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-orange-500 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleHeaderSearch} className="relative mb-3 flex items-center">
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Track Shipment ID..."
              className="w-full pl-9 pr-7 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus-orange"
            />
            <button 
              type="submit" 
              title="Search Parcel"
              className="absolute left-3 text-slate-400 hover:text-orange-500 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  activeTab === item.id
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {currentUser ? (
              <>
                <div className="text-xs text-slate-500">
                  Active Mode: <span className="font-bold text-orange-600 capitalize">{currentUser.role || currentRole}</span>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 underline cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
