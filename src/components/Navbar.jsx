import React, { useState, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
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
  ChevronDown,
  Sparkles,
  Edit2,
  Save,
  Camera,
  FileText
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { 
    currentRole, 
    currentUser, 
    toggleRole, 
    setIsAuthModalOpen, 
    setActiveTrackingId,
    logoutUser,
    updateUserProfile,
    showToast,
    setIsShipmentTypeModalOpen,
    resetShipmentScope,
    setShipmentScope
  } = useLogistics();

  const [headerSearch, setHeaderSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownIgnoreHoverRef = useRef(false);

  const [shipmentDropdownOpen, setShipmentDropdownOpen] = useState(false);
  const shipmentDropdownIgnoreHoverRef = useRef(false);

  const handleMouseEnterServices = () => {
    if (dropdownIgnoreHoverRef.current) return;
    setServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownIgnoreHoverRef.current = false;
    setServicesDropdownOpen(false);
  };

  const handleMouseEnterShipment = () => {
    if (shipmentDropdownIgnoreHoverRef.current) return;
    setShipmentDropdownOpen(true);
  };

  const handleMouseLeaveShipment = () => {
    shipmentDropdownIgnoreHoverRef.current = false;
    setShipmentDropdownOpen(false);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCountryCode, setEditCountryCode] = useState('+65');
  const [editPhoneDigits, setEditPhoneDigits] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editDob, setEditDob] = useState('');

  const handleLogout = () => {
    setIsProfileOpen(false);
    logoutUser();
    if (setActiveTab) {
      setActiveTab('home');
    }
    if (typeof window !== 'undefined') {
      window.location.hash = '#home';
      if (window.history && window.history.pushState) {
        window.history.pushState({ tab: 'home' }, '', '#home');
      }
    }
  };
  const [editPhoto, setEditPhoto] = useState('');

  const handleEditPhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = () => {
    setEditName(currentUser?.name || '');
    const phoneVal = currentUser?.phone || '';
    const matched = countryCodesList.find(c => phoneVal.startsWith(c.code));
    if (matched) {
      setEditCountryCode(matched.code);
      setEditPhoneDigits(phoneVal.replace(matched.code, '').replace(/[^0-9]/g, ''));
    } else {
      setEditCountryCode('+65');
      setEditPhoneDigits(phoneVal.replace(/[^0-9]/g, ''));
    }
    setEditCompany(currentUser?.company || '');
    setEditLicense(currentUser?.licenseNumber || '');
    setEditDob(currentUser?.dob || '');
    setEditPhoto(currentUser?.photo || '');
    setIsEditing(true);
  };

  const saveProfileChanges = (e) => {
    e.preventDefault();
    const cleanDigits = editPhoneDigits.replace(/[^0-9]/g, '');
    const activeRole = currentUser?.role || currentRole;
    const updated = {
      name: editName,
      phone: `${editCountryCode} ${cleanDigits}`,
      company: activeRole === 'customer' ? editCompany : currentUser?.company,
      licenseNumber: activeRole === 'driver' ? editLicense : currentUser?.licenseNumber,
      dob: activeRole === 'driver' ? editDob : currentUser?.dob,
      photo: editPhoto || currentUser?.photo
    };
    updateUserProfile(updated);
    setIsEditing(false);
  };

  const handleHeaderSearch = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (headerSearch.trim()) {
      const term = headerSearch.trim();
      setActiveTrackingId(term);
      setActiveTab('track');
      setHeaderSearch('');
      setMobileMenuOpen(false);
      if (showToast) showToast(`Loaded Live Satellite Telematics for #${term.toUpperCase()}`);
    }
  };

  const handleGoToServices = () => {
    dropdownIgnoreHoverRef.current = true;
    setActiveTab('services');
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    
    setTimeout(() => {
      const targetElem = document.getElementById('freight-services-grid');
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleGoToCustomsClearance = () => {
    dropdownIgnoreHoverRef.current = true;
    setActiveTab('customs-clearance');
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleGoToShipmentTab = (tabId) => {
    shipmentDropdownIgnoreHoverRef.current = true;
    if (tabId === 'book') {
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }
      resetShipmentScope();
      setActiveTab('book');
      setShipmentDropdownOpen(false);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (tabId === 'domestic') {
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }
      setShipmentScope('domestic');
      setActiveTab('book');
      setShipmentDropdownOpen(false);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (tabId === 'international') {
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }
      setShipmentScope('international');
      setActiveTab('book');
      setShipmentDropdownOpen(false);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    setActiveTab(tabId);
    setShipmentDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  let navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services', hasDropdown: true },
    { id: 'shipment', label: 'Shipment', hasDropdown: true },
    { id: 'contact', label: 'Contact' },
  ];

  if (currentUser) {
    const role = currentUser.role || currentRole;
    if (role === 'customer') {
      navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'services', label: 'Services', hasDropdown: true },
        { id: 'shipment', label: 'Shipment', hasDropdown: true },
        { id: 'contact', label: 'Contact' },
      ];
    } else if (role === 'driver') {
      navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'services', label: 'Services', hasDropdown: true },
        { id: 'shipment', label: 'Shipment', hasDropdown: true },
        { id: 'contact', label: 'Contact' },
        { id: 'driver-dashboard', label: 'Driver Portal' },
      ];
    } else if (role === 'admin') {
      navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'services', label: 'Services', hasDropdown: true },
        { id: 'shipment', label: 'Shipment', hasDropdown: true },
        { id: 'contact', label: 'Contact' },
        { id: 'admin-dashboard', label: 'Admin Hub' },
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
              src="/assets/josan_logo.png" 
              alt="Josan Logistics Logo" 
              className="h-12 sm:h-14 w-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-200" 
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.id === 'services') {
                return (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={handleMouseEnterServices}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    <button
                      onClick={handleGoToServices}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 inline-flex items-center space-x-1 cursor-pointer ${
                        activeTab === 'services' || activeTab === 'customs-clearance'
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:text-orange-500 hover:bg-slate-50'
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesDropdownOpen ? 'rotate-180 text-orange-600' : ''}`} />
                    </button>

                    {/* Services Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute left-0 top-full pt-1 w-72 sm:w-80 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 space-y-1">
                          <button
                            type="button"
                            onClick={handleGoToServices}
                            className="w-full text-left p-3 rounded-xl hover:bg-orange-50/80 transition-colors block group cursor-pointer"
                          >
                            <span className="block text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                              Roadways Freight Services
                            </span>
                            <span className="block text-xs font-medium text-slate-500 mt-0.5">
                              Dedicated Highway Trucking, FTL & LTL
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={handleGoToCustomsClearance}
                            className="w-full text-left p-3 rounded-xl hover:bg-orange-50/80 transition-colors block group cursor-pointer border-t border-slate-100"
                          >
                            <span className="block text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                              Customs Clearance
                            </span>
                            <span className="block text-xs font-medium text-slate-500 mt-0.5">
                              Smooth clearance, from docs to release
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'shipment') {
                const isShipmentActive = activeTab === 'book' || activeTab === 'track' || activeTab === 'customer-dashboard' || activeTab === 'my-shipments' || activeTab === 'manage-shipment';
                return (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={handleMouseEnterShipment}
                    onMouseLeave={handleMouseLeaveShipment}
                  >
                    <button
                      onClick={() => handleGoToShipmentTab('book')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 inline-flex items-center space-x-1 cursor-pointer ${
                        isShipmentActive
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:text-orange-500 hover:bg-slate-50'
                      }`}
                    >
                      <span>Shipment</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shipmentDropdownOpen ? 'rotate-180 text-orange-600' : ''}`} />
                    </button>

                    {/* Shipment Dropdown Menu */}
                    {shipmentDropdownOpen && (
                      <div className="absolute left-0 top-full pt-1 w-72 sm:w-80 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 space-y-1">
                          <button
                            type="button"
                            onClick={() => handleGoToShipmentTab('domestic')}
                            className="w-full text-left p-3 rounded-xl hover:bg-orange-50/80 transition-colors block group cursor-pointer"
                          >
                            <span className="block text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                              Book Road Shipment
                            </span>
                            <span className="block text-xs font-medium text-slate-500 mt-0.5">
                              Express motorbike, van, lorry & road haulage
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleGoToShipmentTab('my-shipments')}
                            className="w-full text-left p-3 rounded-xl hover:bg-orange-50/80 transition-colors block group cursor-pointer border-t border-slate-100"
                          >
                            <span className="block text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                              My Shipments
                            </span>
                            <span className="block text-xs font-medium text-slate-500 mt-0.5">
                              View active orders & delivery history
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleGoToShipmentTab('track')}
                            className="w-full text-left p-3 rounded-xl hover:bg-orange-50/80 transition-colors block group cursor-pointer border-t border-slate-100"
                          >
                            <span className="block text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                              Track Shipment
                            </span>
                            <span className="block text-xs font-medium text-slate-500 mt-0.5">
                              Real-time GPS telematics & status updates
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
              );
            })}
          </nav>

          {/* Search Widget & User Profile / Login */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Tracking Search Bar (Only shown when user is signed in) */}
            {currentUser && (
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
            )}

            {currentUser ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3 relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-400 bg-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                    {currentUser.photo ? (
                      <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-orange-600">{currentUser.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</p>
                    <p className="text-[10px] text-orange-600 font-semibold capitalize">{currentUser.role || currentRole}</p>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
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
                        {/* Profile Image Edit Field */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Picture</label>
                          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                            <img
                              src={editPhoto || currentUser.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt="Profile Preview"
                              className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shrink-0"
                            />
                            <div>
                              <label className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-extrabold shadow-orange-sm cursor-pointer transition-all inline-flex items-center space-x-1.5">
                                <Camera className="w-3.5 h-3.5" />
                                <span>Change Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEditPhotoUpload}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Upload new image file</span>
                            </div>
                          </div>
                        </div>

                        {/* Name Input */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name (Alphabets Only)</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => {
                              const lettersOnly = e.target.value.replace(/[0-9]/g, '');
                              setEditName(lettersOnly);
                            }}
                            className="w-full p-2.5 bg-slate-55 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                            required
                          />
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Letters only (no numbers)</span>
                        </div>

                        {/* Phone Input with Country Code Selector */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center justify-between">
                            <span>Phone Number *</span>
                            <span className="text-[10px] text-orange-600 font-bold uppercase">Digits Only</span>
                          </label>
                          <div className="flex items-center">
                            <select
                              value={editCountryCode}
                              onChange={(e) => setEditCountryCode(e.target.value)}
                              className="p-2.5 bg-slate-100 border border-slate-300 rounded-l-xl text-slate-900 font-extrabold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none"
                            >
                              {countryCodesList.map((item) => (
                                <option key={item.code} value={item.code}>
                                  {item.flag} {item.code} ({item.country})
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={getPhoneLength(editCountryCode)}
                              value={editPhoneDigits}
                              onChange={(e) => {
                                const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(editCountryCode));
                                setEditPhoneDigits(numericOnly);
                              }}
                              placeholder={`e.g. ${'9'.repeat(getPhoneLength(editCountryCode))}`}
                              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-r-xl font-mono font-bold text-slate-900 focus-orange text-xs"
                              required
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-1">
                            Accepts numbers only (max {getPhoneLength(editCountryCode)} digits for {editCountryCode})
                          </span>
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
                        {/* Profile Header Image Display */}
                        <div className="flex items-center space-x-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <div className="relative shrink-0">
                            <img
                              src={currentUser.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={currentUser.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                          </div>
                          <div className="text-left space-y-0.5 overflow-hidden">
                            <h4 className="font-extrabold text-slate-900 text-sm leading-tight truncate">{currentUser.name}</h4>
                            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">{currentRole} Account</p>
                            <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                          </div>
                        </div>

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
          {currentUser && (
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
          )}

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              if (item.id === 'services') {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        handleGoToServices();
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                        activeTab === 'services' || activeTab === 'customs-clearance'
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Services</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="pl-4 space-y-1 border-l-2 border-orange-200 ml-4">
                      <button
                        onClick={handleGoToServices}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-slate-800 hover:text-orange-600 hover:bg-orange-50 block"
                      >
                        Roadways Freight Services
                      </button>
                      <button
                        onClick={handleGoToCustomsClearance}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-slate-800 hover:text-orange-600 hover:bg-orange-50 block"
                      >
                        Customs Clearance
                      </button>
                    </div>
                  </div>
                );
              }

              if (item.id === 'shipment') {
                const isShipmentActive = activeTab === 'book' || activeTab === 'track' || activeTab === 'customer-dashboard' || activeTab === 'my-shipments' || activeTab === 'manage-shipment';
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => handleGoToShipmentTab('book')}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                        isShipmentActive
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Shipment</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="pl-4 space-y-1 border-l-2 border-orange-200 ml-4">
                      <button
                        onClick={() => handleGoToShipmentTab('domestic')}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-slate-800 hover:text-orange-600 hover:bg-orange-50 block"
                      >
                        Book Road Shipment
                      </button>
                      <button
                        onClick={() => handleGoToShipmentTab('my-shipments')}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-slate-800 hover:text-orange-600 hover:bg-orange-50 block"
                      >
                        My Shipments
                      </button>
                      <button
                        onClick={() => handleGoToShipmentTab('track')}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-slate-800 hover:text-orange-600 hover:bg-orange-50 block"
                      >
                        Track Shipment
                      </button>
                    </div>
                  </div>
                );
              }

              return (
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
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {currentUser ? (
              <>
                <div className="text-xs text-slate-500">
                  Active Mode: <span className="font-bold text-orange-600 capitalize">{currentUser.role || currentRole}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
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
