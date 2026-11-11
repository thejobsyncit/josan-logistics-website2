import React, { useState, useRef, useEffect } from 'react';
import josanLogo from '../assets/josan_logo.png';
import { useLogistics } from '../context/LogisticsContext';
import { getPhoneLinks } from '../config/siteConfig';
import { normalizeRole, isStaffRole } from '../utils/roles';
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
    setCustomerSubTab,
    managedServices,
    websiteContent
  } = useLogistics();

  const phoneLinks = getPhoneLinks(websiteContent?.contact?.phone);

  const [headerSearch, setHeaderSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileShipmentsOpen, setMobileShipmentsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownIgnoreHoverRef = useRef(false);

  // Profile Dropdown and Keyboard / Outside Click Accessibility
  const profileDropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  // Light shadow on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    if (!isProfileOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        if (avatarButtonRef.current) {
          avatarButtonRef.current.focus();
        }
      }
    };

    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current && 
        !profileDropdownRef.current.contains(e.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Compute initials for subtle round avatar
  const getUserInitials = (user) => {
    if (!user) return 'U';
    const name = (user.name || '').trim();
    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

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
      company: (normalizeRole(activeRole) === 'CUSTOMER' || activeRole === 'customer') ? editCompany : currentUser?.company,
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

    if (sectionId === 'shipment-documentation-support' || sectionId === 'documentation') {
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
    'documentation'
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
    ...(managedServices?.airway?.active !== false ? [{ id: 'air-freight', label: 'Air Freight Services', icon: Plane }] : []),
    ...(managedServices?.road?.active !== false ? [{ id: 'road-transportation', label: 'Commercial Road Transportation', icon: Truck }] : []),
    ...(Boolean(managedServices?.documentation?.active) ? [{ id: 'shipment-documentation-support', label: 'Shipment Documentation Support', icon: FileText }] : [])
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-navy)] border-b border-[var(--color-navy-border)]">
      {/* Main Navbar (72px height, 3-zone layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] w-full">
          
          {/* ZONE 1: Logo (Left) with at least 40px margin to the menu */}
          <div 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 cursor-pointer shrink-0 mr-10"
          >
            <img 
              src={josanLogo} 
              alt="Josan Logistics Logo" 
              className="h-10 sm:h-11 w-auto object-contain" 
            />
            <div className="flex flex-col">
              <span className="text-[var(--color-on-navy)] font-black text-lg sm:text-xl tracking-wider leading-none">
                JOSAN
              </span>
              <span className="text-[var(--color-on-navy-muted)] font-bold text-[9px] sm:text-[10px] tracking-widest uppercase mt-0.5">
                LOGISTICS PTE. LTD.
              </span>
            </div>
          </div>

          {/* ZONE 2: Menu Centred (Home, About, Services dropdown, Track Shipment, Contact) */}
          <nav className="hidden min-[1100px]:flex items-center justify-center h-full flex-1 space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              if (item.id === 'services') {
                return (
                  <div 
                    key={item.id} 
                    className="relative h-full flex items-center"
                    onMouseEnter={handleMouseEnterServices}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    <button
                      type="button"
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
                      className={`relative h-full flex items-center space-x-1 px-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] focus-visible:-outline-offset-4 ${
                        isServicesActive
                          ? 'text-[var(--color-on-navy)] font-semibold'
                          : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)]'
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[var(--color-on-navy)]' : 'text-[var(--color-on-navy-muted)]'}`} />
                      {/* Active underline: straight 2px line */}
                      {isServicesActive && (
                        <span className="absolute bottom-2 left-2 right-2 h-[2px] bg-[var(--color-orange)]" />
                      )}
                    </button>

                    {/* Services Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-72 z-50">
                        <div className="bg-[var(--color-navy)] rounded-[2px] border border-[var(--color-navy-border)] p-1.5 space-y-1">
                          {servicesDropdownItems.map((s) => {
                            const IconComp = s.icon;
                            const isItemActive = activeTab === s.id || 
                              (s.id === 'road-transportation' && (activeTab === 'road-freight' || activeTab === 'road-transportation')) ||
                              (s.id === 'shipment-documentation-support' && (activeTab === 'shipment-documentation' || activeTab === 'documentation' || activeTab === 'shipment-documentation-support'));

                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => handleGoToServiceSection(s.id)}
                                className={`w-full text-left px-3.5 py-2.5 rounded-[2px] text-xs font-semibold transition-colors flex items-center space-x-2.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] ${
                                  isItemActive 
                                    ? 'bg-[var(--color-navy-hover)] text-[var(--color-on-navy)]' 
                                    : 'hover:bg-[var(--color-navy-hover)] text-[var(--color-on-navy)]'
                                }`}
                              >
                                <IconComp className={`w-4 h-4 transition-colors shrink-0 ${isItemActive ? 'text-[var(--color-on-navy)]' : 'text-[var(--color-on-navy-muted)]'}`} />
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
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className={`relative h-full flex items-center px-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] focus-visible:-outline-offset-4 ${
                    isActive
                      ? 'text-[var(--color-on-navy)] font-semibold'
                      : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Active underline: straight 2px line */}
                  {isActive && (
                    <span className="absolute bottom-2 left-2 right-2 h-[2px] bg-[var(--color-orange)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Actions on Right (Phone, Get a Quote text link, Login text link or Account Menu) */}
          <div className="hidden min-[1100px]:flex items-center justify-end space-x-5 shrink-0 ml-10">
            {/* Phone link: plain small phone icon + number */}
            <a
              href={phoneLinks.telHref}
              className="inline-flex items-center space-x-1.5 text-sm font-medium text-[var(--color-on-navy)] hover:underline underline-offset-4 transition-colors py-1 px-1.5 rounded-[2px] whitespace-nowrap cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] focus-visible:outline-offset-2"
              title={`Call Us: ${phoneLinks.display}`}
            >
              <Phone className="w-3.5 h-3.5 text-[var(--color-on-navy-muted)] shrink-0" />
              <span>{phoneLinks.display}</span>
            </a>

            {/* Plain text link with underline on hover */}
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
              className="text-sm font-medium text-[var(--color-on-navy)] hover:underline underline-offset-4 py-1 px-1.5 rounded-[2px] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] focus-visible:outline-offset-2"
            >
              Get a Quote
            </button>

            {/* Logged Out: Plain text Login link | Logged In: Account Menu */}
            {activeTab === 'admin-dashboard' ? null : currentUser ? (
              <div className="relative">
                <button
                  ref={avatarButtonRef}
                  type="button"
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                  aria-label="User account menu"
                  className="w-9 h-9 rounded-[var(--radius)] border border-[var(--color-navy-border)] hover:border-[var(--color-on-navy)] bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] flex items-center justify-center font-semibold text-xs sm:text-sm text-[var(--color-on-navy)] transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] focus-visible:outline-offset-2"
                  title="My Account"
                >
                  {currentUser.photo ? (
                    <img src={currentUser.photo} alt={currentUser.name || 'Account'} className="w-full h-full rounded-[var(--radius)] object-cover" />
                  ) : (
                    <span>{getUserInitials(currentUser)}</span>
                  )}
                </button>

                {/* Customer Dashboard Navigation Dropdown */}
                {isProfileOpen && (
                  <div 
                    ref={profileDropdownRef}
                    role="menu"
                    className="absolute right-0 top-[calc(100%+10px)] w-72 sm:w-80 bg-[var(--color-navy)] rounded-[2px] border border-[var(--color-navy-border)] p-3 z-50 text-[var(--color-on-navy)]"
                  >
                    {/* Header: Full Name, Company (own line), Email (truncated) */}
                    <div className="pb-3 border-b border-[var(--color-navy-border)] px-1">
                      <p className="text-sm font-bold text-[var(--color-on-navy)] truncate leading-snug" title={currentUser.name}>
                        {currentUser.name || 'Valued Customer'}
                      </p>
                      
                      {currentUser.company ? (
                        <p className="text-xs text-[var(--color-on-navy-muted)] truncate mt-1 leading-snug" title={currentUser.company}>
                          {currentUser.company}
                        </p>
                      ) : null}

                      {currentUser.email ? (
                        <p className="text-[11px] text-[var(--color-on-navy-muted)] font-mono truncate mt-1" title={currentUser.email}>
                          {currentUser.email}
                        </p>
                      ) : null}

                      <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 bg-[var(--color-navy-hover)] text-[var(--color-on-navy-muted)] border border-[var(--color-navy-border)] text-[11px] font-semibold rounded-[2px]">
                          {currentUser.role ? `${normalizeRole(currentUser.role) || 'Customer'} Portal` : 'Customer Portal'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items: My Account, My Quotes, Track Shipments */}
                    <div className="py-2 space-y-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleCustomerDashboardNav('profile')}
                        className="w-full text-left px-3 py-2 rounded-[2px] text-xs font-semibold text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)] flex items-center space-x-2.5 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                      >
                        <User className="w-4 h-4 text-[var(--color-on-navy-muted)]" />
                        <span>My Account</span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleCustomerDashboardNav('orders')}
                        className="w-full text-left px-3 py-2 rounded-[2px] text-xs font-semibold text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)] flex items-center space-x-2.5 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                      >
                        <Calculator className="w-4 h-4 text-[var(--color-on-navy-muted)]" />
                        <span>My Quotes</span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setActiveTab('track');
                          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left px-3 py-2 rounded-[2px] text-xs font-semibold text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)] flex items-center space-x-2.5 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                      >
                        <Search className="w-4 h-4 text-[var(--color-on-navy-muted)]" />
                        <span>Track Shipments</span>
                      </button>

                      {/* Admin Portal Link if authenticated as Admin */}
                      {normalizeRole(currentUser?.role || currentRole) === 'ADMIN' && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setActiveTab('admin-dashboard');
                          }}
                          className="w-full text-left px-3 py-2 rounded-[2px] text-xs font-semibold text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)] flex items-center space-x-2.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                        >
                          <ShieldCheck className="w-4 h-4 text-[var(--color-on-navy-muted)]" />
                          <span>Admin Hub</span>
                        </button>
                      )}
                    </div>

                    {/* Divider and Log out */}
                    <div className="border-t border-[var(--color-navy-border)] pt-2">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-[2px] text-xs font-semibold text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)] flex items-center space-x-2.5 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm font-medium text-[var(--color-on-navy)] hover:underline underline-offset-4 py-1 px-1.5 rounded-[2px] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] focus-visible:outline-offset-2"
                title="Customer & Partner Login"
              >
                Login
              </button>
            )}

          </div>

          {/* Mobile hamburger button (below 1100px) */}
          <div className="flex min-[1100px]:hidden items-center space-x-2.5">
            {currentUser && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="w-8 h-8 rounded-[var(--radius)] border border-[var(--color-navy-border)] bg-[var(--color-navy-hover)] flex items-center justify-center font-semibold text-xs text-[var(--color-on-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                title={currentUser.name || 'Account'}
              >
                {getUserInitials(currentUser)}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--color-on-navy)] rounded-[var(--radius)] border border-[var(--color-navy-border)] bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="min-[1100px]:hidden bg-[var(--color-navy)] border-b border-[var(--color-navy-border)] px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Mobile CTAs: Get a Quote + Phone hotline */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
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
              className="py-2 px-1 text-sm font-medium text-[var(--color-on-navy)] hover:underline underline-offset-4 rounded-[var(--radius)] cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
            >
              Get a Quote
            </button>

            <div className="flex items-center gap-2">
              <a
                href={phoneLinks.telHref}
                className="py-2 px-2.5 text-[var(--color-on-navy)] hover:underline underline-offset-4 rounded-[var(--radius)] text-xs font-medium flex items-center space-x-1.5 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                title={`Call Us: ${phoneLinks.display}`}
              >
                <Phone className="w-3.5 h-3.5 text-[var(--color-on-navy-muted)]" />
                <span>{phoneLinks.display}</span>
              </a>

              <a
                href={phoneLinks.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] text-[var(--color-on-navy)] border border-[var(--color-navy-border)] rounded-[var(--radius)] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                title={`WhatsApp: ${phoneLinks.display}`}
              >
                <svg className="w-3.5 h-3.5 fill-current text-[var(--color-whatsapp)]" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Mobile Navigation List */}
          <div className="grid grid-cols-1 gap-1 border-t border-[var(--color-navy-border)] pt-3">
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className={`text-left px-3.5 py-2.5 rounded-[var(--radius)] text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] ${
                activeTab === 'home' ? 'bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] font-semibold' : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)]'
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
              className={`text-left px-3.5 py-2.5 rounded-[var(--radius)] text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] ${
                activeTab === 'about' ? 'bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] font-semibold' : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)]'
              }`}
            >
              About
            </button>

            {/* Services (Overview click + Accordion dropdown) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-[var(--radius)] hover:bg-[var(--color-navy-hover)]">
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
                  className={`text-left px-3.5 py-2.5 rounded-[var(--radius)] text-sm font-medium flex-1 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] ${
                    isServicesActive ? 'bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] font-semibold' : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)]'
                  }`}
                >
                  Services
                </button>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="p-2.5 text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] rounded-[var(--radius)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
                  aria-label="Toggle Services submenu"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-[var(--color-on-navy)]' : ''}`} />
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-[var(--color-navy-border)] ml-4 py-1">
                  {servicesDropdownItems.map(s => {
                    const isSubActive = activeTab === s.id || 
                      (s.id === 'road-transportation' && (activeTab === 'road-freight' || activeTab === 'road-transportation')) || 
                      (s.id === 'shipment-documentation-support' && (activeTab === 'shipment-documentation' || activeTab === 'documentation' || activeTab === 'shipment-documentation-support'));
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleGoToServiceSection(s.id)}
                        className={`w-full text-left px-3 py-2 rounded-[2px] text-xs font-semibold block cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] ${
                          isSubActive ? 'text-[var(--color-on-navy)] bg-[var(--color-navy-hover)]' : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)]'
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
              className={`text-left px-3.5 py-2.5 rounded-[var(--radius)] text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] ${
                activeTab === 'track' ? 'bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] font-semibold' : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)]'
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
              className={`text-left px-3.5 py-2.5 rounded-[var(--radius)] text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)] ${
                activeTab === 'contact' ? 'bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] font-semibold' : 'text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)]'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Mobile Customer Account / Login Area */}
          <div className="pt-3 border-t border-[var(--color-navy-border)]">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5 p-2 bg-[var(--color-navy-hover)] rounded-[var(--radius)] border border-[var(--color-navy-border)]">
                  <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--color-navy-border)] text-[var(--color-on-navy)] flex items-center justify-center font-semibold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-on-navy)]">
                      {currentUser.name || 'Account'}
                    </p>
                    {currentUser.email && (
                      <p className="text-[10px] text-[var(--color-on-navy-muted)] font-mono">{currentUser.email}</p>
                    )}
                  </div>
                </div>

                {/* Separate Customer Dashboard Links on Mobile */}
                {normalizeRole(currentUser?.role || currentRole) === 'CUSTOMER' && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs font-semibold">
                    <button
                      onClick={() => handleCustomerDashboardNav('profile')}
                      className="p-2 bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] text-[var(--color-on-navy)] rounded-[var(--radius)] text-left"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('orders')}
                      className="p-2 bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] text-[var(--color-on-navy)] rounded-[var(--radius)] text-left"
                    >
                      My Shipments
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('track')}
                      className="p-2 bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] text-[var(--color-on-navy)] rounded-[var(--radius)] text-left"
                    >
                      Track Shipment
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('billing')}
                      className="p-2 bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] text-[var(--color-on-navy)] rounded-[var(--radius)] text-left"
                    >
                      Invoices
                    </button>
                    <button
                      onClick={() => handleCustomerDashboardNav('addresses')}
                      className="p-2 bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] text-[var(--color-on-navy)] rounded-[var(--radius)] text-left col-span-2"
                    >
                      Saved Addresses
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-[var(--color-navy-hover)] hover:bg-[var(--color-navy-border)] text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] rounded-[var(--radius)] text-xs font-semibold text-center cursor-pointer mt-2"
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
                className="py-2 px-1 text-sm font-medium text-[var(--color-on-navy)] hover:underline underline-offset-4 rounded-[var(--radius)] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-on-navy)]"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
