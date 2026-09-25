import React, { useState, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { 
  Package, 
  Truck, 
  Plane,
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
  FileText,
  Calculator,
  User,
  MapPin,
  Layers,
  Zap,
  Thermometer,
  Shield,
  CreditCard,
  Target,
  Phone,
  Mail,
  Globe,
  ArrowRight
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { 
    currentRole, 
    currentUser, 
    toggleRole, 
    setIsAuthModalOpen, 
    setAuthRedirectTab,
    setActiveTrackingId,
    logoutUser,
    updateUserProfile,
    showToast,
    setIsShipmentTypeModalOpen,
    resetShipmentScope,
    setShipmentScope,
    setCustomerSubTab
  } = useLogistics();

  const [headerSearch, setHeaderSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileShipmentsOpen, setMobileShipmentsOpen] = useState(false);
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

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCountryCode, setEditCountryCode] = useState('+65');
  const [editPhoneDigits, setEditPhoneDigits] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editPhoto, setEditPhoto] = useState('');

  const handleLogout = () => {
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
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
      if (setAuthRedirectTab) setAuthRedirectTab('track');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in to track road shipments.', 'warning');
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

  const handleGoToServiceSection = (sectionId) => {
    dropdownIgnoreHoverRef.current = true;
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);

    if (sectionId === 'air-freight') {
      setActiveTab('air-freight');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'road-transportation' || sectionId === 'road-freight') {
      setActiveTab('road-freight');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'customs-clearance') {
      setActiveTab('customs-clearance');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    // Mapping dropdown IDs to the exact element IDs on ServicesPage
    const targetMap = {
      'road-transportation': 'road-transportation',
      'ftl-transportation': 'ftl-transportation',
      'ltl-transportation': 'ltl-transportation',
      'express-delivery': 'express-delivery',
      'specialized-cargo': 'specialized-cargo',
      'cargo-types': 'cargo-types',
      'parcel-delivery': 'parcel-delivery',
      'bulk-shipment': 'bulk-shipment',
      'intra-city-transport': 'intra-city-transport',
      'inter-city-logistics': 'inter-city-logistics'
    };

    const targetId = targetMap[sectionId] || sectionId;

    setActiveTab('services');

    const scrollToElement = () => {
      const el = document.getElementById(targetId) || document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    };

    // Attempt immediate scroll or retry as React switches to Services tab
    if (!scrollToElement()) {
      setTimeout(scrollToElement, 60);
      setTimeout(scrollToElement, 180);
      setTimeout(scrollToElement, 400);
    }
  };

  const handleGoToShipmentTab = (tabId) => {
    shipmentDropdownIgnoreHoverRef.current = true;
    setShipmentDropdownOpen(false);
    setMobileMenuOpen(false);

    if (tabId === 'book' || tabId === 'domestic-shipment') {
      if (!currentUser) {
        if (setAuthRedirectTab) setAuthRedirectTab('book');
        setIsAuthModalOpen(true);
        if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
        return;
      }
      if (setShipmentScope) setShipmentScope('domestic');
      setActiveTab('domestic-shipment');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (tabId === 'my-shipments') {
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }
      if (setCustomerSubTab) setCustomerSubTab('orders');
      setActiveTab('customer-dashboard');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleCustomerDashboardNav = (subTab) => {
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (subTab === 'track') {
      setActiveTab('track');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (setCustomerSubTab) setCustomerSubTab(subTab);
    setActiveTab('customer-dashboard');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Public Navigation Links
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services', hasDropdown: true },
    { id: 'track', label: 'Track Shipment' },
    { id: 'contact', label: 'Contact' }
  ];

  const servicesDropdownItems = [
    { id: 'air-freight', label: 'Air Freight', icon: Plane },
    { id: 'road-transportation', label: 'Road Transportation', icon: Truck }
  ];

  const shipmentsDropdownItems = [
    { id: 'book', label: 'Book Shipment', desc: 'Express road haulage & priority dispatch' },
    { id: 'my-shipments', label: 'My Shipments', desc: 'View active consignments, status & delivery history' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#10182D] border-b border-slate-800 shadow-md transition-all duration-300">
      {/* Main Navbar (76px height) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          
          {/* Logo */}
          <div 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <img 
              src="/assets/josan_logo.png" 
              alt="Josan Logistics Logo" 
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="flex flex-col">
              <span className="text-white font-black text-lg sm:text-xl tracking-wider leading-none">
                JOSAN
              </span>
              <span className="text-[#FF6B00] font-black text-[9px] sm:text-[10px] tracking-widest uppercase mt-0.5">
                LOGISTICS PTE. LTD.
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-3 2xl:space-x-5">
            {navItems.map((item) => {
              if (item.id === 'services') {
                const isServicesActive = activeTab === 'services' || activeTab === 'customs-clearance';
                return (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={handleMouseEnterServices}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    <button
                      onClick={() => {
                        setServicesDropdownOpen(false);
                        setActiveTab('services');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className={`py-2 text-sm 2xl:text-[15px] transition-all duration-150 inline-flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
                        isServicesActive
                          ? 'text-white font-bold border-b-2 border-[#FF6B00]'
                          : 'text-slate-300 hover:text-white font-medium'
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#FF6B00]' : 'text-slate-400'}`} />
                    </button>

                    {/* Services Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute left-0 top-full pt-2 w-52 z-50 animate-fade-in">
                        <div className="bg-[#10182D] rounded-2xl border border-slate-700/80 shadow-2xl p-1.5 space-y-1">
                          {servicesDropdownItems.map((s) => {
                            const IconComp = s.icon;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => handleGoToServiceSection(s.id)}
                                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-800/90 text-white hover:text-[#FF6B00] text-xs font-bold transition-colors flex items-center space-x-2.5 group cursor-pointer"
                              >
                                <IconComp className="w-4 h-4 text-slate-400 group-hover:text-[#FF6B00] transition-colors shrink-0" />
                                <span>{s.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'shipments') {
                const isShipmentActive = activeTab === 'book' || activeTab === 'domestic-shipment' || activeTab === 'international-shipment' || activeTab === 'customer-dashboard' || activeTab === 'my-shipments';
                return (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={handleMouseEnterShipment}
                    onMouseLeave={handleMouseLeaveShipment}
                  >
                    <button
                      onClick={() => handleGoToShipmentTab('book')}
                      className={`py-2 text-sm 2xl:text-[15px] transition-all duration-150 inline-flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                        isShipmentActive
                          ? 'text-white font-bold border-b-2 border-[#FF6B00]'
                          : 'text-slate-300 hover:text-white font-medium'
                      }`}
                    >
                      <span>Shipments</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shipmentDropdownOpen ? 'rotate-180 text-[#FF6B00]' : 'text-slate-400'}`} />
                    </button>

                    {/* Shipments Dropdown Menu */}
                    {shipmentDropdownOpen && (
                      <div className="absolute left-0 top-full pt-2 w-80 z-50 animate-fade-in">
                        <div className="bg-[#10182D] rounded-2xl border border-slate-700/80 shadow-2xl p-2.5 space-y-1">
                          {shipmentsDropdownItems.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleGoToShipmentTab(s.id)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors block group cursor-pointer"
                            >
                              <span className="block text-xs font-bold text-white group-hover:text-[#FF6B00] transition-colors">
                                {s.label}
                              </span>
                              <span className="block text-[11px] font-medium text-slate-400 mt-0.5 leading-snug">
                                {s.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'track' && !currentUser) {
                      if (setAuthRedirectTab) setAuthRedirectTab('track');
                      setIsAuthModalOpen(true);
                      if (showToast) showToast('Please sign in to track road and air shipments.', 'warning');
                      return;
                    }
                    if (item.id === 'quote' && !currentUser) {
                      if (setAuthRedirectTab) setAuthRedirectTab('quote');
                      setIsAuthModalOpen(true);
                      if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                      return;
                    }
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className={`py-2 text-xs 2xl:text-sm transition-all duration-150 whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-white font-bold border-b-2 border-[#FF6B00]'
                      : 'text-slate-300 hover:text-white font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Section: CTAs + Customer Account */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* CTA 1: Instant Quote (Vibrant Orange Pill) */}
            <button
              onClick={() => {
                if (!currentUser) {
                  if (setAuthRedirectTab) setAuthRedirectTab('quote');
                  setIsAuthModalOpen(true);
                  if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                  return;
                }
                setActiveTab('quote');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="h-10 px-5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8500] hover:from-[#E55C00] hover:to-[#FF6B00] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <span>INSTANT QUOTE</span>
              <ArrowRight className="w-3.5 h-3.5 -rotate-45" />
            </button>

            {/* CTA 2: Book Shipment (Dark Navy Translucent Pill) */}
            <button
              onClick={() => {
                if (!currentUser) {
                  if (setAuthRedirectTab) setAuthRedirectTab('book');
                  setIsAuthModalOpen(true);
                  if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
                  return;
                }
                if (setShipmentScope) setShipmentScope('domestic');
                setActiveTab('domestic-shipment');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="h-10 px-4 rounded-full bg-[#10182D] hover:bg-slate-800 text-white font-medium text-xs border border-slate-700 shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Package className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Book Shipment</span>
            </button>

            {/* Customer Login / Dashboard Navigation Menu (Hidden on Admin Dashboard, and Admin sessions do not display in public website navbar) */}
            {activeTab === 'admin-dashboard' ? null : (currentUser && currentUser.role !== 'admin') ? (
              <div className="relative pl-1">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-750 border border-slate-700 shadow-sm transition-all cursor-pointer hover:border-slate-600"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-orange-500/80 bg-[#FF6B00] flex items-center justify-center shrink-0 shadow-sm">
                    {currentUser.photo ? (
                      <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-extrabold text-xs text-white uppercase">{currentUser.name ? currentUser.name.charAt(0) : 'U'}</span>
                    )}
                  </div>
                  <div className="text-left hidden sm:block max-w-[120px]">
                    <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-[#FF8500] font-black uppercase tracking-wider leading-none mt-0.5">{currentUser.role || currentRole}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </button>

                {/* Customer Dashboard Navigation Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-[#10182D] rounded-2xl border border-slate-700 shadow-2xl p-2 z-50 text-white animate-fade-in space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/20 text-[#FF8500] border border-orange-500/30 text-[10px] font-black rounded-full uppercase">
                        {currentUser.role || currentRole} Portal
                      </span>
                    </div>

                    {/* Customer Specific Separate Dashboard Navigation */}
                    {(currentUser.role === 'customer' || currentRole === 'customer') && (
                      <div className="space-y-0.5 py-1">
                        <button
                          onClick={() => handleCustomerDashboardNav('profile')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-orange-400" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('orders')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Package className="w-4 h-4 text-orange-400" />
                          <span>My Shipments</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('track')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-orange-400" />
                          <span>Track Shipment</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('billing')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-orange-400" />
                          <span>Invoices</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('addresses')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 text-orange-400" />
                          <span>Saved Addresses</span>
                        </button>
                      </div>
                    )}

                    {/* Driver Portal Link if authenticated as Driver */}
                    {(currentUser.role === 'driver' || currentRole === 'driver') && (
                      <div className="space-y-0.5 py-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setActiveTab('driver-dashboard');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                        >
                          <Truck className="w-4 h-4 text-orange-400" />
                          <span>Open Driver Portal</span>
                        </button>
                      </div>
                    )}

                    {/* Admin Portal Link if authenticated as Admin */}
                    {(currentUser.role === 'admin' || currentRole === 'admin') && (
                      <div className="space-y-0.5 py-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setActiveTab('admin-dashboard');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-orange-400" />
                          <span>Open Admin Hub</span>
                        </button>
                      </div>
                    )}

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="h-10 px-4 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-500 bg-slate-800/80 border border-slate-700 rounded-full transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Login</span>
              </button>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-[#FF6B00] rounded-xl focus:outline-none border border-slate-700 bg-slate-850"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0B1020] border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Mobile CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                if (!currentUser) {
                  if (setAuthRedirectTab) setAuthRedirectTab('quote');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                  if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                  return;
                }
                setActiveTab('quote');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="py-2.5 px-3 rounded-xl text-xs font-extrabold border-2 border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Get a Quote</span>
            </button>

            <button
              onClick={() => {
                if (!currentUser) {
                  if (setAuthRedirectTab) setAuthRedirectTab('book');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                  if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
                  return;
                }
                resetShipmentScope();
                setActiveTab('book');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="py-2.5 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Book Shipment</span>
            </button>
          </div>

          {/* Mobile Navigation List */}
          <div className="grid grid-cols-1 gap-1 border-t border-slate-100 pt-3">
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'home' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* About */}
            <button
              onClick={() => {
                setActiveTab('about');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'about' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              About
            </button>

            {/* Services (Accordion) */}
            <div className="space-y-1">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-slate-700 hover:bg-slate-50"
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileServicesOpen ? 'rotate-180 text-orange-600' : ''}`} />
              </button>

              {mobileServicesOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-orange-200 ml-4 py-1">
                  {servicesDropdownItems.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleGoToServiceSection(s.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 block"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Track Shipment */}
            <button
              onClick={() => {
                if (!currentUser) {
                  if (setAuthRedirectTab) setAuthRedirectTab('track');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                  if (showToast) showToast('Please sign in to track air and road shipments.', 'warning');
                  return;
                }
                setActiveTab('track');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'track' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Track Shipment
            </button>

            {/* Contact Us */}
            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'contact' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Mobile Customer Account / Login Area */}
          <div className="pt-3 border-t border-slate-100">
            {(currentUser && currentUser.role !== 'admin') ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5 p-2 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{currentUser.email}</p>
                  </div>
                </div>

                {/* Separate Customer Dashboard Links on Mobile */}
                {(currentUser.role === 'customer' || currentRole === 'customer') && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs font-bold">
                    <button
                      onClick={() => handleCustomerDashboardNav('profile')}
                      className="p-2 bg-slate-50 hover:bg-orange-50 text-slate-700 rounded-lg text-left"
                    >
                      👤 My Profile
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('orders')}
                      className="p-2 bg-slate-50 hover:bg-orange-50 text-slate-700 rounded-lg text-left"
                    >
                      📦 My Shipments
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('track')}
                      className="p-2 bg-slate-50 hover:bg-orange-50 text-slate-700 rounded-lg text-left"
                    >
                      📍 Track Shipment
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('billing')}
                      className="p-2 bg-slate-50 hover:bg-orange-50 text-slate-700 rounded-lg text-left"
                    >
                      📄 Invoices
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('addresses')}
                      className="p-2 bg-slate-50 hover:bg-orange-50 text-slate-700 rounded-lg text-left col-span-2"
                    >
                      🏠 Saved Addresses
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold text-center cursor-pointer mt-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full h-11 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl text-sm font-semibold text-center shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
