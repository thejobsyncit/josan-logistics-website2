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
  FileText,
  Calculator,
  User,
  MapPin,
  Layers,
  Zap,
  Thermometer,
  Shield,
  CreditCard
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

  const handleGoToServiceSection = (sectionId) => {
    dropdownIgnoreHoverRef.current = true;
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);

    if (sectionId === 'customs-clearance') {
      setActiveTab('customs-clearance');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab('services');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }, 80);
  };

  const handleGoToShipmentTab = (tabId) => {
    shipmentDropdownIgnoreHoverRef.current = true;
    setShipmentDropdownOpen(false);
    setMobileMenuOpen(false);

    if (tabId === 'book' || tabId === 'domestic-shipment') {
      if (!currentUser) {
        setIsAuthModalOpen(true);
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

  // Public Navigation Links (Always Clean & Standard across all public visitors)
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services', hasDropdown: true },
    { id: 'shipments', label: 'Shipments', hasDropdown: true },
    { id: 'track', label: 'Track Shipment' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const servicesDropdownItems = [
    { id: 'road-transportation', label: 'Road Transportation', desc: 'Overland highway linehaul & regional freight' },
    { id: 'ftl-transportation', label: 'FTL', desc: 'Dedicated full truckload point-to-point delivery' },
    { id: 'ltl-transportation', label: 'LTL', desc: 'Consolidated partial pallet freight & scheduled runs' },
    { id: 'express-delivery', label: 'Express Delivery', desc: 'Under 4h rapid city & express courier dispatch' },
    { id: 'specialized-cargo', label: 'Specialized Cargo', desc: 'Multi-temp cold chain (-25°C to +25°C) & reefer vans' },
    { id: 'customs-clearance', label: 'Customs Clearance', desc: 'TradeNet documentation, brokerage & port release' },
    { id: 'cargo-types', label: 'Cargo Types', desc: 'Explore supported commodities & industry classifications' }
  ];

  const shipmentsDropdownItems = [
    { id: 'book', label: 'Book Shipment', desc: 'Express road haulage & priority dispatch' },
    { id: 'my-shipments', label: 'My Shipments', desc: 'View active consignments, status & delivery history' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs transition-all duration-300">
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
              className="h-11 sm:h-13 w-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-200" 
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 2xl:space-x-1.5">
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
                      onClick={() => handleGoToServiceSection('road-transportation')}
                      className={`px-3 py-2 rounded-lg text-sm 2xl:text-[15px] font-medium transition-all duration-150 inline-flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
                        isServicesActive
                          ? 'bg-[#FFF8F2] text-[#FF6B00] font-semibold'
                          : 'text-[#10182D] hover:text-[#FF6B00] hover:bg-[#FFF8F2]/60'
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#FF6B00]' : ''}`} />
                    </button>

                    {/* Services Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute left-0 top-full pt-1.5 w-80 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-2 space-y-0.5">
                          {servicesDropdownItems.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleGoToServiceSection(s.id)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-[#FFF8F2] transition-colors block group cursor-pointer"
                            >
                              <span className="block text-xs font-bold text-[#10182D] group-hover:text-[#FF6B00] transition-colors">
                                {s.label}
                              </span>
                              <span className="block text-[11px] font-medium text-[#64748B] mt-0.5 leading-snug">
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
                      className={`px-3 py-2 rounded-lg text-sm 2xl:text-[15px] font-medium transition-all duration-150 inline-flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                        isShipmentActive
                          ? 'bg-[#FFF8F2] text-[#FF6B00] font-semibold'
                          : 'text-[#10182D] hover:text-[#FF6B00] hover:bg-[#FFF8F2]/60'
                      }`}
                    >
                      <span>Shipments</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shipmentDropdownOpen ? 'rotate-180 text-[#FF6B00]' : ''}`} />
                    </button>

                    {/* Shipments Dropdown Menu */}
                    {shipmentDropdownOpen && (
                      <div className="absolute left-0 top-full pt-1.5 w-80 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-2 space-y-0.5">
                          {shipmentsDropdownItems.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleGoToShipmentTab(s.id)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-[#FFF8F2] transition-colors block group cursor-pointer"
                            >
                              <span className="block text-xs font-bold text-[#10182D] group-hover:text-[#FF6B00] transition-colors">
                                {s.label}
                              </span>
                              <span className="block text-[11px] font-medium text-[#64748B] mt-0.5 leading-snug">
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

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg text-sm 2xl:text-[15px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-[#FFF8F2] text-[#FF6B00] font-semibold'
                      : 'text-[#10182D] hover:text-[#FF6B00] hover:bg-[#FFF8F2]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Section: CTAs + Customer Account */}
          <div className="hidden lg:flex items-center space-x-2.5 2xl:space-x-3">
            
            {/* CTA 1: Get a Quote (Primary Orange) */}
            <button
              onClick={() => {
                setActiveTab('quote');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="h-11 px-4 2xl:px-5 rounded-lg sm:rounded-xl bg-[#FF6B00] hover:bg-[#E55C00] text-white font-sans text-xs 2xl:text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Get a Quote</span>
            </button>

            {/* CTA 2: Book Shipment (Dark Navy Secondary CTA) */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                  return;
                }
                if (setShipmentScope) setShipmentScope('domestic');
                setActiveTab('domestic-shipment');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="h-11 px-4 2xl:px-5 rounded-lg sm:rounded-xl bg-[#10182D] hover:bg-[#1A243F] text-white font-sans text-xs 2xl:text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Package className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Book Shipment</span>
            </button>

            {/* Customer Login / Dashboard Navigation Menu */}
            {currentUser ? (
              <div className="relative pl-1">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-orange-400 bg-orange-100 flex items-center justify-center shrink-0 shadow-2xs">
                    {currentUser.photo ? (
                      <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-extrabold text-xs text-orange-600">{currentUser.name ? currentUser.name.charAt(0) : 'U'}</span>
                    )}
                  </div>
                  <div className="text-left hidden 2xl:block max-w-[120px]">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wider">{currentUser.role || currentRole}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Customer Dashboard Navigation Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 text-slate-900 animate-fade-in space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-black rounded-full uppercase">
                        {currentUser.role || currentRole} Portal
                      </span>
                    </div>

                    {/* Customer Specific Separate Dashboard Navigation */}
                    {(currentUser.role === 'customer' || currentRole === 'customer') && (
                      <div className="space-y-0.5 py-1">
                        <button
                          onClick={() => handleCustomerDashboardNav('profile')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('orders')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Package className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                          <span>My Shipments</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('track')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                          <span>Track Shipment</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('billing')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                          <span>Invoices</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('addresses')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
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
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center space-x-2 cursor-pointer"
                        >
                          <Truck className="w-4 h-4 text-orange-500" />
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
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center space-x-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-orange-500" />
                          <span>Open Admin Hub</span>
                        </button>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors cursor-pointer"
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
                className="h-11 px-4 text-xs 2xl:text-sm font-semibold text-[#10182D] hover:text-[#FF6B00] hover:border-[#FF6B00] bg-white border border-[#E2E8F0] rounded-lg sm:rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Login</span>
              </button>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-orange-500 rounded-xl focus:outline-none border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Mobile CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
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
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
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

            {/* About Us */}
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
              About Us
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

            {/* Shipments (Accordion) */}
            <div className="space-y-1">
              <button
                onClick={() => setMobileShipmentsOpen(!mobileShipmentsOpen)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-slate-700 hover:bg-slate-50"
              >
                <span>Shipments</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileShipmentsOpen ? 'rotate-180 text-orange-600' : ''}`} />
              </button>

              {mobileShipmentsOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-orange-200 ml-4 py-1">
                  {shipmentsDropdownItems.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleGoToShipmentTab(s.id)}
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

            {/* Fleet */}
            <button
              onClick={() => {
                setActiveTab('fleet');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'fleet' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Fleet
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
              Contact Us
            </button>
          </div>

          {/* Mobile Customer Account / Login Area */}
          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
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
