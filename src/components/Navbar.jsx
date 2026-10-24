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

  const handleMouseEnterServices = () => {
    if (dropdownIgnoreHoverRef.current) return;
    setServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownIgnoreHoverRef.current = false;
    setServicesDropdownOpen(false);
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
    if (headerSearch.trim()) {
      const term = headerSearch.trim();
      setActiveTrackingId(term);
      setActiveTab('track');
      setHeaderSearch('');
      setMobileMenuOpen(false);
      if (showToast) showToast(`Loaded Tracking Record for #${term.toUpperCase()}`);
    }
  };

  const handleGoToServiceSection = (sectionId) => {
    dropdownIgnoreHoverRef.current = true;
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);

    if (sectionId === 'air-freight') {
      setActiveTab('air-freight');
      if (typeof window !== 'undefined') {
        window.location.hash = '#services/air-freight';
        if (window.history && window.history.pushState) {
          window.history.pushState({ tab: 'air-freight' }, '', '#services/air-freight');
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'road-transportation' || sectionId === 'road-freight') {
      setActiveTab('road-freight');
      if (typeof window !== 'undefined') {
        window.location.hash = '#services/road-transportation';
        if (window.history && window.history.pushState) {
          window.history.pushState({ tab: 'road-freight' }, '', '#services/road-transportation');
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'shipment-documentation-support' || sectionId === 'customs-clearance' || sectionId === 'documentation') {
      setActiveTab('shipment-documentation-support');
      if (typeof window !== 'undefined') {
        window.location.hash = '#services/documentation';
        if (window.history && window.history.pushState) {
          window.history.pushState({ tab: 'shipment-documentation-support' }, '', '#services/documentation');
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab('services');
    if (typeof window !== 'undefined') {
      window.location.hash = '#services';
      if (window.history && window.history.pushState) {
        window.history.pushState({ tab: 'services' }, '', '#services');
      }
    }
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

  // Active state for any service page (overview or dedicated pages)
  const isServicesActive = [
    'services',
    'air-freight',
    'road-freight',
    'road-transportation',
    'shipment-documentation-support',
    'shipment-documentation',
    'customs-clearance'
  ].includes(activeTab);

  // Public Navigation Links
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services', hasDropdown: true },
    { id: 'track', label: 'Track Shipment' },
    { id: 'contact', label: 'Contact' }
  ];

  const servicesDropdownItems = [
    { id: 'air-freight', label: 'Air Freight Services', icon: Plane },
    { id: 'road-transportation', label: 'Commercial Road Transportation', icon: Truck },
    { id: 'shipment-documentation-support', label: 'Shipment Documentation Support', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1F3A] border-b border-[#1E3A5F] shadow-md transition-all duration-300">
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
              <span className="text-[#B6C2D1] font-bold text-[9px] sm:text-[10px] tracking-widest uppercase mt-0.5">
                LOGISTICS PTE. LTD.
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-3 2xl:space-x-5">
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
                      onClick={() => {
                        setServicesDropdownOpen(false);
                        setActiveTab('services');
                        if (typeof window !== 'undefined') {
                          window.location.hash = '#services';
                          if (window.history && window.history.pushState) {
                            window.history.pushState({ tab: 'services' }, '', '#services');
                          }
                        }
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className={`py-2 text-sm 2xl:text-[15px] transition-all duration-150 inline-flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
                        isServicesActive
                          ? 'text-white font-bold border-b-2 border-white'
                          : 'text-slate-300 hover:text-white font-medium'
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                    </button>

                    {/* Services Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute left-0 top-full pt-2 w-72 z-50 animate-fade-in">
                        <div className="bg-[#0B1F3A] rounded-2xl border border-[#1E3A5F] shadow-2xl p-1.5 space-y-1">
                          {servicesDropdownItems.map((s) => {
                            const IconComp = s.icon;
                            const isItemActive = activeTab === s.id || 
                              (s.id === 'road-transportation' && (activeTab === 'road-freight' || activeTab === 'road-transportation')) ||
                              (s.id === 'shipment-documentation-support' && (activeTab === 'shipment-documentation' || activeTab === 'customs-clearance'));

                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => handleGoToServiceSection(s.id)}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2.5 group cursor-pointer ${
                                  isItemActive 
                                    ? 'bg-[#132A4A] text-[#F26B21]' 
                                    : 'hover:bg-[#132A4A] text-white hover:text-[#B6C2D1]'
                                }`}
                              >
                                <IconComp className={`w-4 h-4 transition-colors shrink-0 ${isItemActive ? 'text-[#F26B21]' : 'text-slate-400 group-hover:text-white'}`} />
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

              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
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
                      ? 'text-white font-bold border-b-2 border-white'
                      : 'text-slate-300 hover:text-white font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Section: Phone link + ONE Quote CTA + Login / Account Dropdown */}
          <div className="hidden lg:flex items-center space-x-3.5">
            
            {/* Clickable tel: link next to Quote button */}
            <a
              href="tel:+6567890123"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-200 hover:text-[#F26B21] transition-colors px-2 py-1.5 whitespace-nowrap cursor-pointer group"
              title="Call Us: +65 6789 0123"
            >
              <Phone className="w-3.5 h-3.5 text-[#F26B21] group-hover:scale-110 transition-transform shrink-0" />
              <span>+65 6789 0123</span>
            </a>

            {/* Clickable WhatsApp link */}
            <a
              href="https://wa.me/6567890123"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors px-2 py-1.5 whitespace-nowrap cursor-pointer group"
              title="WhatsApp: +65 6789 0123"
            >
              <svg className="w-3.5 h-3.5 fill-current text-emerald-400 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* ONLY ONE orange primary button labeled "Get a Quote" */}
            <button
              type="button"
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
              className="h-10 px-5 rounded-full bg-[#F26B21] hover:bg-[#D95A13] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer whitespace-nowrap active:scale-95 shadow-sm"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 -rotate-45" />
            </button>

            {/* Customer Login / Dashboard Navigation Menu */}
            {activeTab === 'admin-dashboard' ? null : currentUser ? (
              <div className="relative pl-1">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#132A4A] hover:bg-[#1A365D] border border-[#1E3A5F] shadow-sm transition-all cursor-pointer group"
                  title="My Account"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                    {currentUser.photo ? (
                      <img src={currentUser.photo} alt={currentUser.name || 'Account'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-extrabold text-xs text-white uppercase">
                        {(currentUser.name || 'U').charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-left hidden sm:block max-w-[150px]">
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {currentUser.name || 'Account'}
                    </p>
                    <p className="text-[10px] text-[#B6C2D1] font-semibold uppercase tracking-wider leading-none mt-0.5 truncate">
                      {currentUser.company || (currentUser.role ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Portal` : 'Corporate Portal')}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isProfileOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {/* Customer Dashboard Navigation Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-[#0B1F3A] rounded-2xl border border-[#1E3A5F] shadow-2xl p-2 z-50 text-white animate-fade-in space-y-1">
                    <div className="px-3 py-2 border-b border-[#1E3A5F]">
                      <p className="text-xs font-bold text-white truncate">
                        {currentUser.name || 'Account'}
                      </p>
                      {currentUser.email && (
                        <p className="text-[10px] text-[#B6C2D1] font-mono truncate">{currentUser.email}</p>
                      )}
                      <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {currentUser.role ? `${currentUser.role.toUpperCase()} PORTAL` : 'CORPORATE PORTAL'}
                      </span>
                    </div>

                    {/* Customer Specific Separate Dashboard Navigation */}
                    {(currentUser.role === 'customer' || currentRole === 'customer') && (
                      <div className="space-y-0.5 py-1">
                        <button
                          onClick={() => handleCustomerDashboardNav('profile')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#132A4A] flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-[#B6C2D1]" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('orders')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#132A4A] flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Package className="w-4 h-4 text-[#B6C2D1]" />
                          <span>My Shipments</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('track')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#132A4A] flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-[#B6C2D1]" />
                          <span>Track Shipment</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('billing')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#132A4A] flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-[#B6C2D1]" />
                          <span>Invoices</span>
                        </button>

                        <button
                          onClick={() => handleCustomerDashboardNav('addresses')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#132A4A] flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 text-[#B6C2D1]" />
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
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#132A4A] flex items-center space-x-2 cursor-pointer"
                        >
                          <Truck className="w-4 h-4 text-[#B6C2D1]" />
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
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#132A4A] flex items-center space-x-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#B6C2D1]" />
                          <span>Open Admin Hub</span>
                        </button>
                      </div>
                    )}

                    <div className="border-t border-[#1E3A5F] pt-1">
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
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="h-10 px-4 rounded-full border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm flex items-center space-x-1.5"
                title="Customer & Partner Login"
              >
                <User className="w-3.5 h-3.5 text-slate-300" />
                <span>Login</span>
              </button>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white rounded-xl focus:outline-none border border-[#1E3A5F] bg-[#132A4A]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1F3A] border-b border-[#1E3A5F] px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Mobile CTAs: Get a Quote + Phone hotline */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
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
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F26B21] hover:bg-[#D95A13] text-white flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Get a Quote</span>
            </button>

            <a
              href="tel:+6567890123"
              className="py-2.5 px-3 bg-[#132A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white border border-[#1E3A5F] rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shrink-0"
              title="Call Us: +65 6789 0123"
            >
              <Phone className="w-3.5 h-3.5 text-[#F26B21]" />
              <span>Call</span>
            </a>

            <a
              href="https://wa.me/6567890123"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shrink-0"
              title="WhatsApp: +65 6789 0123"
            >
              <svg className="w-3.5 h-3.5 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Navigation List */}
          <div className="grid grid-cols-1 gap-1 border-t border-[#1E3A5F] pt-3">
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'home' ? 'bg-white/10 text-white font-extrabold' : 'text-slate-300 hover:text-white hover:bg-white/5'
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
                activeTab === 'about' ? 'bg-white/10 text-white font-extrabold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </button>

            {/* Services (Overview click + Accordion dropdown) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-xl hover:bg-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('services');
                    setMobileMenuOpen(false);
                    if (typeof window !== 'undefined') {
                      window.location.hash = '#services';
                      if (window.history && window.history.pushState) {
                        window.history.pushState({ tab: 'services' }, '', '#services');
                      }
                    }
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex-1 cursor-pointer ${
                    isServicesActive ? 'bg-white/10 text-white font-extrabold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Services
                </button>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="p-2.5 text-slate-400 hover:text-white rounded-xl cursor-pointer"
                  aria-label="Toggle Services submenu"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-white' : ''}`} />
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-white/20 ml-4 py-1">
                  {servicesDropdownItems.map(s => {
                    const isSubActive = activeTab === s.id || 
                      (s.id === 'road-transportation' && (activeTab === 'road-freight' || activeTab === 'road-transportation')) || 
                      (s.id === 'shipment-documentation-support' && (activeTab === 'shipment-documentation' || activeTab === 'customs-clearance'));
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleGoToServiceSection(s.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold block cursor-pointer transition-colors ${
                          isSubActive ? 'text-[#F26B21] bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
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
                activeTab === 'track' ? 'bg-white/10 text-white font-extrabold' : 'text-slate-300 hover:text-white hover:bg-white/5'
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
                activeTab === 'contact' ? 'bg-white/10 text-white font-extrabold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Mobile Customer Account / Login Area */}
          <div className="pt-3 border-t border-[#1E3A5F]">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5 p-2 bg-[#132A4A] rounded-xl border border-[#1E3A5F]">
                  <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {currentUser.name || 'Account'}
                    </p>
                    {currentUser.email && (
                      <p className="text-[10px] text-[#B6C2D1] font-mono">{currentUser.email}</p>
                    )}
                  </div>
                </div>

                {/* Separate Customer Dashboard Links on Mobile */}
                {(currentUser.role === 'customer' || currentRole === 'customer') && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs font-bold">
                    <button
                      onClick={() => handleCustomerDashboardNav('profile')}
                      className="p-2 bg-[#132A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white rounded-lg text-left"
                    >
                      👤 My Profile
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('orders')}
                      className="p-2 bg-[#132A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white rounded-lg text-left"
                    >
                      📦 My Shipments
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('track')}
                      className="p-2 bg-[#132A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white rounded-lg text-left"
                    >
                      📍 Track Shipment
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('billing')}
                      className="p-2 bg-[#132A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white rounded-lg text-left"
                    >
                      📄 Invoices
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('addresses')}
                      className="p-2 bg-[#132A4A] hover:bg-[#1A365D] text-slate-200 hover:text-white rounded-lg text-left col-span-2"
                    >
                      🏠 Saved Addresses
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold text-center cursor-pointer mt-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
              >
                <User className="w-4 h-4 text-slate-300" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
