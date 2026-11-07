import React, { useState, useEffect, useRef } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ShipmentDetailsView } from './components/ShipmentDetailsView';
import { SingaporeGoogleMapBackground } from './components/SingaporeGoogleMapBackground';
import { Chatbot } from './components/chatbot/Chatbot';

import { HomePage } from './pages/HomePage';
import { AirFreightPage } from './pages/AirFreightPage';
import { RoadFreightPage } from './pages/RoadFreightPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ServicesPage } from './pages/ServicesPage';
import { ShipmentDocumentationPage } from './pages/ShipmentDocumentationPage';
import { ContactPage } from './pages/ContactPage';
import { TrackShipmentPage } from './pages/TrackShipmentPage';
import { QuotePage } from './pages/QuotePage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CrmPage } from './pages/CrmPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { StaffLoginPage } from './pages/StaffLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LegalDialog, openLegalDialog } from './components/LegalDialog';
import { CookieBanner } from './components/CookieBanner';
import { CheckCircle2, AlertCircle, Info, X, ArrowLeft } from 'lucide-react';
import { normalizeRole, isStaffRole } from './utils/roles';
import { supabase } from './services/supabase';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in my-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4 text-center max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900">An unexpected error occurred.</h2>
            <p className="text-xs text-slate-500">{this.state.error?.toString()}</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ToastNotification = () => {
  const { toast, showToast } = useLogistics();
  if (!toast) return null;

  return (
    <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-[100] animate-fade-in max-w-[calc(100vw-2rem)] sm:max-w-md pointer-events-auto">
      <div className={`px-4 sm:px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 text-xs sm:text-sm font-bold backdrop-blur-md transition-all ${
        toast.type === 'warning'
          ? 'bg-amber-950/95 text-amber-100 border-amber-700 shadow-amber-950/50'
          : toast.type === 'info'
          ? 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/50'
          : 'bg-[#0B1F3A]/95 text-white border-emerald-500/50 shadow-2xl ring-1 ring-emerald-400/20'
      }`}>
        {toast.type === 'warning' ? (
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-sky-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span className="flex-1 leading-snug">{toast.message}</span>
        <button
          onClick={() => showToast(null)}
          className="ml-2 p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-colors shrink-0 cursor-pointer"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const MainContent = () => {
  const { currentRole, setCurrentRole, currentUser, setCurrentUser, loginUser, logoutUser, setIsAuthModalOpen, setAuthRedirectTab, showToast } = useLogistics();

  const validTabs = [
    'home', 
    'air-freight',
    'road-freight',
    'road-transportation',
    'about', 
    'services', 
    'documentation',
    'shipment-documentation-support',
    'shipment-documentation',
    'contact', 
    'track', 
    'quote', 
    'customer-dashboard', 
    'my-shipments', 
    'manage-shipment', 
    'admin-dashboard',
    'crm',
    'privacy-policy',
    'privacy',
    'terms-of-service',
    'terms',
    'staff-login',
    'admin-login'
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    
    if (
      path === '/admin-login' || 
      path.endsWith('/admin-login') || 
      rawHash === 'admin-login' || 
      rawHash === '/admin-login'
    ) {
      return 'admin-login';
    }

    if (
      path === '/staff-login' || 
      path.endsWith('/staff-login') || 
      rawHash === 'staff-login' || 
      rawHash === '/staff-login' ||
      rawHash.startsWith('staff-login') ||
      rawHash.startsWith('staff-setup') ||
      rawHash.startsWith('staff-reset') ||
      path.includes('staff-setup') ||
      path.includes('staff-reset')
    ) {
      return 'staff-login';
    }

    if (
      path === '/crm' || 
      path.endsWith('/crm') || 
      rawHash === 'crm' || 
      rawHash === '/crm'
    ) {
      return 'crm';
    }

    if (
      path === '/admin' || 
      path.endsWith('/admin') || 
      rawHash === 'admin' || 
      rawHash === '/admin' || 
      rawHash === 'admin-dashboard'
    ) {
      return 'admin-dashboard';
    }
    if (
      path === '/privacy-policy' || 
      path === '/privacy' ||
      rawHash === 'privacy-policy' || 
      rawHash === '/privacy-policy' ||
      rawHash === 'privacy'
    ) {
      setTimeout(() => openLegalDialog('privacy'), 50);
      return 'home';
    }
    if (
      path === '/terms-of-service' || 
      path === '/terms' || 
      rawHash === 'terms-of-service' || 
      rawHash === 'terms' || 
      rawHash === '/terms-of-service' || 
      rawHash === '/terms'
    ) {
      setTimeout(() => openLegalDialog('terms'), 50);
      return 'home';
    }
    if (
      path === '/airway-services' || 
      path.endsWith('/airway-services') || 
      path === '/services/airway-services' || 
      rawHash === 'airway-services' || 
      rawHash === '/airway-services'
    ) {
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        window.history.replaceState({ tab: 'air-freight' }, '', '#air-freight');
      }
      return 'air-freight';
    }
    if (
      path === '/documentation' ||
      path === '/customs-clearance' || 
      path.endsWith('/customs-clearance') || 
      path === '/services/customs-clearance' || 
      path === '/customs' || 
      rawHash === 'documentation' ||
      rawHash === '/documentation' ||
      rawHash === 'customs-clearance' || 
      rawHash === '/customs-clearance' || 
      rawHash === 'customs'
    ) {
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        window.history.replaceState({ tab: 'documentation' }, '', '#documentation');
      }
      return 'documentation';
    }
    if (rawHash.startsWith('track-map-')) return 'track';
    if ((path === '/quote' || rawHash === 'quote' || rawHash === '/quote') && !currentUser) {
      return 'home';
    }
    return validTabs.includes(rawHash) ? rawHash : 'home';
  });

  const [isVerifyingRoute, setIsVerifyingRoute] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
    return (
      path === '/crm' || path.endsWith('/crm') || rawHash === 'crm' || rawHash === '/crm' ||
      path === '/admin' || path.endsWith('/admin') || rawHash === 'admin' || rawHash === '/admin' || rawHash === 'admin-dashboard'
    );
  });

  const lastVerifiedTabRef = useRef(null);
  const currentUserRef = useRef(currentUser);
  const currentRoleRef = useRef(currentRole);

  useEffect(() => {
    currentUserRef.current = currentUser;
    if (!currentUser) {
      lastVerifiedTabRef.current = null;
    }
  }, [currentUser]);

  useEffect(() => {
    currentRoleRef.current = currentRole;
  }, [currentRole]);

  // Security Route Guard:
  // On every load and refresh of /crm and /admin, get Supabase session and read role & status from public.profiles.
  // Allow /crm only for ADMIN, CRM, or READONLY with status Active; /admin only for ADMIN.
  // Wrapped in try/catch/finally with an 8-second timeout. Fails closed on timeout or error.
  const failClosedSignOut = async (destTab = 'staff-login', reasonMsg = 'Could not verify access. Please sign in again.') => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('josan_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch (e) {}

    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut().catch(() => {});
      }
    } catch (e) {}

    lastVerifiedTabRef.current = null;
    if (setCurrentUser) setCurrentUser(null);
    if (setCurrentRole) setCurrentRole('CUSTOMER');
    setIsVerifyingRoute(false);
    if (showToast && reasonMsg) {
      showToast(reasonMsg, 'error');
    }
    setActiveTab(destTab);
    if (typeof window !== 'undefined') {
      window.location.hash = `#${destTab}`;
      if (window.history && window.history.replaceState) {
        window.history.replaceState({ tab: destTab }, '', `#${destTab}`);
      }
    }
  };

  const performSecurityCheck = async (targetTab, marker) => {
    let timeoutId = null;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('VERIFY_TIMEOUT'));
      }, 8000);
    });

    try {
      await Promise.race([
        (async () => {
          if (!supabase || !supabase.auth) {
            throw new Error('NO_SUPABASE');
          }

          // 1. Get Supabase session
          const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
          if (marker.cancelled) return;

          const session = sessionData?.session;
          if (sessionErr || !session || !session.user) {
            throw new Error('NO_SESSION');
          }

          // 2. Read role and status from public.profiles
          const { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select('id, role, status, name, email, company')
            .eq('id', session.user.id)
            .maybeSingle();
          if (marker.cancelled) return;

          if (profileErr || !profile) {
            throw new Error('NO_PROFILE');
          }

          // 3. Status check: Active only
          const status = (profile.status || '').toLowerCase();
          if (status !== 'active') {
            throw new Error('INACTIVE');
          }

          // 4. Normalize role
          const normRole = normalizeRole(profile.role);

          // Allow /crm only for ADMIN, CRM or READONLY with status Active
          if (targetTab === 'crm') {
            if (!isStaffRole(normRole)) {
              throw new Error('UNAUTHORIZED_ROLE');
            }
          } else if (targetTab === 'admin-dashboard') {
            if (normRole === 'ADMIN') {
              // Authorized
            } else if (isStaffRole(normRole)) {
              // Staff account but not admin -> redirect to crm
              if (marker.cancelled) return;
              lastVerifiedTabRef.current = 'crm';
              if (showToast) {
                showToast('Access Denied: Only Administrator accounts can access the Admin workspace.', 'error');
              }
              setActiveTab('crm');
              if (typeof window !== 'undefined') {
                window.location.hash = '#crm';
                if (window.history && window.history.replaceState) {
                  window.history.replaceState({ tab: 'crm' }, '', '#crm');
                }
              }
              return;
            } else {
              throw new Error('UNAUTHORIZED_ROLE');
            }
          }

          if (marker.cancelled) return;

          // Successfully verified
          lastVerifiedTabRef.current = targetTab;

          const verifiedUser = {
            id: session.user.id,
            name: profile.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Staff Member',
            email: session.user.email,
            role: normRole,
            rawRole: normRole,
            displayRole: normRole === 'ADMIN' ? 'Admin' : normRole === 'CRM' ? 'CRM Operations' : 'Read-only',
            company: profile.company || 'Josan Logistics Operations',
            status: profile.status
          };
          if (setCurrentUser) setCurrentUser(verifiedUser);
          if (setCurrentRole) setCurrentRole(normRole);
        })(),
        timeoutPromise
      ]);
    } catch (err) {
      if (marker.cancelled) return;
      marker.cancelled = true;
      await failClosedSignOut(
        'staff-login',
        'Could not verify access. Please sign in again.'
      );
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      if (!marker.cancelled) {
        setIsVerifyingRoute(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab !== 'crm' && activeTab !== 'admin-dashboard') {
      setIsVerifyingRoute(false);
      lastVerifiedTabRef.current = null;
      return;
    }

    // Run once per navigation; do not re-run if already verified for this tab
    if (lastVerifiedTabRef.current === activeTab) {
      setIsVerifyingRoute(false);
      return;
    }

    setIsVerifyingRoute(true);

    const marker = { cancelled: false };

    // Run outside of any synchronous auth callback turn
    const timer = setTimeout(() => {
      performSecurityCheck(activeTab, marker);
    }, 0);

    return () => {
      marker.cancelled = true;
      clearTimeout(timer);
    };
  }, [activeTab]);

  // Customer protected routes check
  useEffect(() => {
    if (!currentUser) {
      if (['customer-dashboard', 'my-shipments', 'manage-shipment', 'quote'].includes(activeTab)) {
        if (activeTab === 'quote' && setAuthRedirectTab) {
          setAuthRedirectTab('quote');
        }
        setIsAuthModalOpen(true);
        if (showToast) {
          showToast(`Please sign in or create an account to access ${activeTab === 'quote' ? 'instant quote' : 'your dashboard'}.`, 'warning');
        }
        changeActiveTab('home');
      }
    }

    // Automatically log out admin session when returning to public website pages
    const isSpecialAdminPortalTab = 
      activeTab === 'admin-dashboard' || 
      activeTab === 'crm' || 
      activeTab === 'staff-login' || 
      activeTab === 'admin-login';

    const effectiveRole = normalizeRole(currentUser?.role || currentRole);
    if (!isSpecialAdminPortalTab && effectiveRole === 'ADMIN') {
      logoutUser(true);
    }
  }, [currentUser, activeTab]);

  // Scroll to top of page whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // Dynamic page titles and meta descriptions per active route
  useEffect(() => {
    const pageMeta = {
      'home': {
        title: 'Josan Logistics | Air Freight Documentation & Commercial Road Transportation',
        description: 'Josan Logistics provides air freight documentation support and commercial road transportation coordination in Singapore.'
      },
      'air-freight': {
        title: 'Air Freight Services & Documentation | Josan Logistics',
        description: 'Comprehensive air freight services including Air Waybill (AWB) preparation, billing, shipment documentation and cargo movement coordination in Singapore.'
      },
      'road-freight': {
        title: 'Commercial Road Transportation | Josan Logistics',
        description: 'Reliable road transportation for commercial goods and products coordinated through our network of trusted transport partners in Singapore.'
      },
      'shipment-documentation-support': {
        title: 'Shipment Documentation Support | Josan Logistics',
        description: 'We help businesses prepare and organise shipment documents, including Air Waybill details, commercial invoices, packing lists and billing documents. We provide documentation support only and do not provide customs clearance.'
      },
      'shipment-documentation': {
        title: 'Shipment Documentation Support | Josan Logistics',
        description: 'We help businesses prepare and organise shipment documents, including Air Waybill details, commercial invoices, packing lists and billing documents. We provide documentation support only and do not provide customs clearance.'
      },
      'customs-clearance': {
        title: 'Shipment Documentation Support | Josan Logistics',
        description: 'We help businesses prepare and organise shipment documents, including Air Waybill details, commercial invoices, packing lists and billing documents. We provide documentation support only and do not provide customs clearance.'
      },
      'airway-request': {
        title: 'Request Air Freight Services | Josan Logistics',
        description: 'Submit your commercial shipment details for Air Waybill preparation, billing, and air freight documentation support.'
      },
      'about': {
        title: 'About Us | Josan Logistics Pte. Ltd.',
        description: 'Learn about Josan Logistics, our reliable logistics coordination, and our focus on air freight documentation and commercial road transportation.'
      },
      'services': {
        title: 'Our Logistics Services | Josan Logistics',
        description: 'Explore our core logistics solutions: Air Freight Services, Commercial Road Transportation, and Shipment Documentation Support.'
      },
      'contact': {
        title: 'Contact Us | Josan Logistics',
        description: 'Get in touch with Josan Logistics for air freight documentation, commercial road transport inquiries, and freight quotes.'
      },
      'track': {
        title: 'Track Shipment | Josan Logistics',
        description: 'Real-time shipment and Air Waybill (AWB) consignment tracking.'
      },
      'quote': {
        title: 'Request a Freight Quote | Josan Logistics',
        description: 'Request competitive freight quotes for air freight services and commercial road transportation.'
      },
      'privacy-policy': {
        title: 'Privacy Policy | Josan Logistics Pte. Ltd.',
        description: 'Josan Logistics Singapore PDPA compliance and commercial freight data privacy policy.'
      },
      'terms-of-service': {
        title: 'Terms of Service | Josan Logistics Pte. Ltd.',
        description: 'Commercial road freight coordination, Air Waybill preparation, and shipment documentation Terms of Service.'
      },
      'staff-login': {
        title: 'Staff Gateway | Josan Logistics Operations',
        description: 'Restricted staff authentication gateway for Josan Logistics operations and administrative staff.'
      }
    };

    const currentMeta = pageMeta[activeTab] || pageMeta['home'];
    document.title = currentMeta.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', currentMeta.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = currentMeta.description;
      document.head.appendChild(metaDesc);
    }
  }, [activeTab]);

  const [trackNavKey, setTrackNavKey] = useState(0);

  // Navigation tab switcher synced with Browser History API (pushState)
  const changeActiveTab = (tab, pushHistory = true, userOverride = null) => {
    if (tab === 'track') {
      setTrackNavKey(prev => prev + 1);
    }
    const savedLocalUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('josan_staff_user') || localStorage.getItem('josan_user') || 'null') : null;
    const effectiveUser = (userOverride !== null && userOverride !== undefined) ? userOverride : (currentUser || savedLocalUser);
    const effectiveRole = normalizeRole(effectiveUser?.role || currentRole || savedLocalUser?.role);
    const isStaffAuth = Boolean(effectiveUser && isStaffRole(effectiveRole));

    // Check authentication for protected customer pages
    if (!effectiveUser && (
      tab === 'customer-dashboard' || 
      tab === 'my-shipments' || 
      tab === 'manage-shipment' ||
      tab === 'track' ||
      tab === 'quote'
    )) {
      if (setAuthRedirectTab) setAuthRedirectTab(tab);
      setIsAuthModalOpen(true);
      if (showToast) {
        if (tab === 'track') {
          showToast('Please sign in to track road shipments.', 'warning');
        } else if (tab === 'quote') {
          showToast('Please sign in or create an account to get an instant quote.', 'warning');
        } else {
          showToast('Please sign in or create an account to view your dashboard.', 'warning');
        }
      }
      return;
    }

    // Protected CRM and Admin route checks: handled strictly by security route guard via database
    if (tab === 'crm' || tab === 'admin-dashboard' || tab === 'admin') {
      const dest = tab === 'admin' ? 'admin-dashboard' : tab;
      if (lastVerifiedTabRef.current !== dest) {
        setIsVerifyingRoute(true);
      }
      setActiveTab(dest);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const hash = `#${dest}`;
      if (typeof window !== 'undefined') {
        if (window.location.hash !== hash) {
          window.location.hash = hash;
        }
        if (pushHistory && !window.location.hash.startsWith('#track-map-')) {
          try {
            window.history.pushState({ tab: dest }, '', hash);
          } catch (e) {}
        }
      }
      return;
    }

    setActiveTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const hash = `#${tab}`;
    if (typeof window !== 'undefined') {
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
      if (pushHistory && !window.location.hash.startsWith('#track-map-')) {
        try {
          window.history.pushState({ tab }, '', hash);
        } catch (e) {}
      }
    }
  };

  // Sync with Browser Back / Forward buttons (popstate & hashchange) and handle /admin and /driver
  useEffect(() => {
    const syncHistoryState = (e) => {
      const path = window.location.pathname.toLowerCase();
      const rawHash = (window.location.hash || '').toLowerCase();
      const cleanHash = rawHash.replace(/^#\/?/, '').toLowerCase();
      
      // Staff login route
      if (
        path === '/staff-login' || 
        path.endsWith('/staff-login') || 
        rawHash === '#staff-login' || 
        rawHash === '#/staff-login' ||
        rawHash === '#staff/login' ||
        rawHash === '#/staff/login' ||
        cleanHash === 'staff-login'
      ) {
        setActiveTab('staff-login');
        return;
      }

      // Privacy policy & Terms of service routes: open pop-up dialog without reloading or clearing form state
      if (path === '/privacy-policy' || path === '/privacy' || rawHash === '#privacy-policy' || rawHash === '#/privacy-policy' || rawHash === '#privacy' || cleanHash === 'privacy-policy' || cleanHash === 'privacy') {
        openLegalDialog('privacy');
        return;
      }

      if (path === '/terms-of-service' || path === '/terms' || rawHash === '#terms-of-service' || rawHash === '#/terms-of-service' || rawHash === '#terms' || cleanHash === 'terms-of-service' || cleanHash === 'terms') {
        openLegalDialog('terms');
        return;
      }

      // Direct /crm route: guarded by security route guard via database
      if (path === '/crm' || path.endsWith('/crm') || rawHash === '#crm' || rawHash === '#/crm' || cleanHash === 'crm') {
        if (lastVerifiedTabRef.current !== 'crm') {
          setIsVerifyingRoute(true);
        }
        setActiveTab('crm');
        return;
      }

      // Direct /admin route: guarded by security route guard via database
      if (path === '/admin-login' || rawHash === '#admin-login' || cleanHash === 'admin-login') {
        setActiveTab('admin-login');
        return;
      }

      if (path === '/admin' || path.endsWith('/admin') || rawHash === '#admin' || rawHash === '#/admin' || rawHash === '#admin-dashboard' || cleanHash === 'admin' || cleanHash === 'admin-dashboard') {
        if (lastVerifiedTabRef.current !== 'admin-dashboard') {
          setIsVerifyingRoute(true);
        }
        setActiveTab('admin-dashboard');
        return;
      }

      // Protected /driver direct route check
      if (path === '/driver' || path.endsWith('/driver') || rawHash === '#driver' || rawHash === '#/driver' || rawHash === '#driver-dashboard') {
        const userRole = currentUserRef.current?.role || currentRoleRef.current;
        if (currentUserRef.current && userRole === 'driver') {
          setActiveTab('driver-dashboard');
        } else {
          setIsAuthModalOpen(true);
          if (showToast) showToast('Please sign in with Driver credentials to access Driver Portal.', 'warning');
          setActiveTab('home');
        }
        return;
      }

      if (rawHash.startsWith('#track-map-') || rawHash === '#track' || rawHash === '#/track' || path === '/track') {
        setActiveTab('track');
        return;
      }

      if (rawHash === '#quote' || rawHash === '#/quote' || path === '/quote') {
        if (!currentUserRef.current) {
          if (setAuthRedirectTab) setAuthRedirectTab('quote');
          setIsAuthModalOpen(true);
          if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
          setActiveTab('home');
          return;
        }
        setActiveTab('quote');
        return;
      }

      // 301 Redirect for old airway-services URLs
      if (
        path === '/airway-services' || 
        path.endsWith('/airway-services') || 
        path === '/services/airway-services' || 
        rawHash === '#airway-services' || 
        rawHash === '#/airway-services'
      ) {
        if (window.history && window.history.replaceState) {
          window.history.replaceState({ tab: 'air-freight' }, '', '#air-freight');
        }
        window.location.hash = '#air-freight';
        setActiveTab('air-freight');
        return;
      }

      // Services specific routes
      if (
        path === '/services/air-freight' || 
        path.endsWith('/services/air-freight') ||
        rawHash === '#/services/air-freight' || 
        rawHash === '#services/air-freight'
      ) {
        setActiveTab('air-freight');
        return;
      }
      if (
        path === '/services/road-transportation' || 
        path.endsWith('/services/road-transportation') ||
        path === '/services/road-freight' || 
        rawHash === '#/services/road-transportation' || 
        rawHash === '#services/road-transportation'
      ) {
        setActiveTab('road-freight');
        return;
      }
      if (
        path === '/services/documentation' || 
        path.endsWith('/services/documentation') ||
        path === '/services/shipment-documentation' || 
        rawHash === '#/services/documentation' || 
        rawHash === '#services/documentation'
      ) {
        setActiveTab('shipment-documentation-support');
        return;
      }

      if (cleanHash && validTabs.includes(cleanHash)) {
        setActiveTab(cleanHash);
      } else if (cleanHash && document.getElementById(cleanHash)) {
        const el = document.getElementById(cleanHash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e && e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else if (!cleanHash) {
        setActiveTab('home');
      }
    };

    syncHistoryState();
    window.addEventListener('popstate', syncHistoryState);
    window.addEventListener('hashchange', syncHistoryState);
    return () => {
      window.removeEventListener('popstate', syncHistoryState);
      window.removeEventListener('hashchange', syncHistoryState);
    };
  }, []);

  const renderPage = () => {
    if (isVerifyingRoute && (activeTab === 'crm' || activeTab === 'admin-dashboard')) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-300">Verifying secure authorization...</p>
        </div>
      );
    }

    const savedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('josan_user') || 'null') : null;
    const activeAuthUser = currentUser || savedUser;

    if (!activeAuthUser && (
      activeTab === 'customer-dashboard' || 
      activeTab === 'my-shipments' || 
      activeTab === 'manage-shipment'
    )) {
      return <HomePage setActiveTab={changeActiveTab} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={changeActiveTab} />;
      case 'air-freight':
        return <AirFreightPage setActiveTab={changeActiveTab} />;
      case 'road-freight':
      case 'road-transportation':
        return <RoadFreightPage setActiveTab={changeActiveTab} />;
      case 'about':
        return <AboutUsPage setActiveTab={changeActiveTab} />;
      case 'services':
        return <ServicesPage setActiveTab={changeActiveTab} />;
      case 'documentation':
      case 'shipment-documentation-support':
      case 'shipment-documentation':
      case 'customs-clearance':
        return <ShipmentDocumentationPage setActiveTab={changeActiveTab} />;
      case 'contact':
        return <ContactPage setActiveTab={changeActiveTab} />;
      case 'privacy-policy':
      case 'privacy':
        return <PrivacyPolicyPage setActiveTab={changeActiveTab} />;
      case 'terms-of-service':
      case 'terms':
        return <TermsOfServicePage setActiveTab={changeActiveTab} />;
      case 'staff-login':
        return <StaffLoginPage setActiveTab={changeActiveTab} />;
      case 'admin-login':
        return <AdminLoginPage setActiveTab={changeActiveTab} />;
      case 'track':
        return <TrackShipmentPage key={`track-${trackNavKey}`} setActiveTab={changeActiveTab} />;
      case 'quote':
        return <QuotePage setActiveTab={changeActiveTab} />;
      case 'customer-dashboard':
        return <CustomerDashboardPage setActiveTab={changeActiveTab} initialSubTab="orders" />;
      case 'my-shipments':
        return <CustomerDashboardPage setActiveTab={changeActiveTab} initialSubTab="orders" />;
      case 'manage-shipment':
        return <CustomerDashboardPage setActiveTab={changeActiveTab} initialSubTab="manage" />;
      case 'admin-dashboard':
        return <AdminDashboardPage setActiveTab={changeActiveTab} />;
      case 'crm':
        return <CrmPage setActiveTab={changeActiveTab} />;
      default:
        return <HomePage setActiveTab={changeActiveTab} />;
    }
  };

  const isAdminOrCrmView = 
    activeTab === 'admin-dashboard' || 
    activeTab === 'crm' || 
    activeTab === 'staff-login' || 
    activeTab === 'admin-login' ||
    Boolean(activeTab?.includes('admin')) ||
    Boolean(activeTab?.includes('crm')) ||
    (typeof window !== 'undefined' && (
      window.location.pathname.startsWith('/admin') ||
      window.location.pathname.startsWith('/crm') ||
      window.location.hash.includes('admin') ||
      window.location.hash.includes('crm')
    ));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 w-full overflow-x-hidden">
      {!isAdminOrCrmView && <Navbar activeTab={activeTab} setActiveTab={changeActiveTab} />}
      <main className="flex-1 w-full overflow-x-hidden">
        <ErrorBoundary onReset={() => changeActiveTab('home')}>
          {renderPage()}
        </ErrorBoundary>
      </main>
      {!isAdminOrCrmView && <Footer setActiveTab={changeActiveTab} />}
      <AuthModal setActiveTab={changeActiveTab} />
      <ShipmentDetailsView />
      <InvoiceModal />
      <ToastNotification />
      {!isAdminOrCrmView && <Chatbot />}
      {!isAdminOrCrmView && <CookieBanner />}
      <LegalDialog />
    </div>
  );
};

export default function App() {
  return (
    <LogisticsProvider>
      <MainContent />
    </LogisticsProvider>
  );
}
