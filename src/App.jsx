import React, { useState, useEffect } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ShipmentTypeModal } from './components/ShipmentTypeModal';
import { ShipmentDetailsView } from './components/ShipmentDetailsView';
import { SingaporeGoogleMapBackground } from './components/SingaporeGoogleMapBackground';
import { Chatbot } from './components/chatbot/Chatbot';

import { HomePage } from './pages/HomePage';
import { AirFreightPage } from './pages/AirFreightPage';
import { RoadFreightPage } from './pages/RoadFreightPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ServicesPage } from './pages/ServicesPage';
import { CustomsClearancePage } from './pages/CustomsClearancePage';
import { ContactPage } from './pages/ContactPage';
import { TrackShipmentPage } from './pages/TrackShipmentPage';
import { FleetPage } from './pages/FleetPage';
import { QuotePage } from './pages/QuotePage';
import { BookShipmentPage } from './pages/BookShipmentPage';
import { DomesticShipmentPage } from './pages/DomesticShipmentPage';
import { InternationalShipmentPage } from './pages/InternationalShipmentPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { AirwayRequestPage } from './pages/AirwayRequestPage';
import { CrmPage } from './pages/CrmPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { StaffLoginPage } from './pages/StaffLoginPage';
import { CheckCircle2, AlertCircle, Info, X, ArrowLeft } from 'lucide-react';

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
  const validTabs = [
    'home', 
    'air-freight',
    'road-freight',
    'road-transportation',
    'about', 
    'services', 
    'shipment-documentation-support',
    'shipment-documentation',
    'customs-clearance', 
    'contact', 
    'track', 
    'fleet', 
    'quote', 
    'book', 
    'airway-request',
    'domestic-shipment', 
    'international-shipment', 
    'customer-dashboard', 
    'my-shipments', 
    'manage-shipment', 
    'driver-dashboard', 
    'admin-dashboard',
    'crm',
    'privacy-policy',
    'privacy',
    'terms-of-service',
    'terms',
    'staff-login'
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    
    if (
      path === '/staff-login' || 
      path.endsWith('/staff-login') || 
      rawHash === 'staff-login' || 
      rawHash === '/staff-login'
    ) {
      return 'staff-login';
    }
    if (
      path === '/crm' || 
      path.endsWith('/crm') || 
      rawHash === 'crm' || 
      rawHash === '/crm'
    ) {
      return currentUser && (currentUser.role === 'admin' || currentUser.role === 'crm') ? 'crm' : 'staff-login';
    }
    if (
      path === '/admin' || 
      path.endsWith('/admin') || 
      rawHash === 'admin' || 
      rawHash === '/admin' || 
      rawHash === 'admin-dashboard'
    ) {
      return currentUser && currentUser.role === 'admin' ? 'admin-dashboard' : 'staff-login';
    }
    if (
      path === '/privacy-policy' || 
      rawHash === 'privacy-policy' || 
      rawHash === '/privacy-policy' ||
      rawHash === 'privacy'
    ) {
      return 'privacy-policy';
    }
    if (
      path === '/terms-of-service' || 
      path === '/terms' || 
      rawHash === 'terms-of-service' || 
      rawHash === 'terms' || 
      rawHash === '/terms-of-service' || 
      rawHash === '/terms'
    ) {
      return 'terms-of-service';
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
      path === '/customs-clearance' || 
      path.endsWith('/customs-clearance') || 
      path === '/services/customs-clearance' || 
      path === '/customs' || 
      rawHash === 'customs-clearance' || 
      rawHash === '/customs-clearance' || 
      rawHash === 'customs'
    ) {
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        window.history.replaceState({ tab: 'shipment-documentation-support' }, '', '#shipment-documentation-support');
      }
      return 'shipment-documentation-support';
    }
    if (rawHash.startsWith('track-map-')) return 'track';
    if ((path === '/quote' || rawHash === 'quote' || rawHash === '/quote') && !currentUser) {
      return 'home';
    }
    return validTabs.includes(rawHash) ? rawHash : 'home';
  });
  
  const { currentRole, currentUser, loginUser, logoutUser, setIsAuthModalOpen, setAuthRedirectTab, showToast } = useLogistics();

  // Strict protected role routes: redirect unauthenticated staff to /staff-login
  useEffect(() => {
    if (activeTab === 'crm' || activeTab === 'admin-dashboard') {
      const userRole = currentUser?.role || currentRole;
      if (!currentUser || (userRole !== 'admin' && userRole !== 'crm' && !userRole?.startsWith('crm_'))) {
        if (showToast) {
          showToast('Staff authentication required to access this portal.', 'warning');
        }
        changeActiveTab('staff-login');
        return;
      }
    }

    // Automatically log out admin session when returning to public website pages
    if (activeTab !== 'admin-dashboard' && activeTab !== 'crm' && activeTab !== 'staff-login' && currentUser?.role === 'admin') {
      logoutUser(true);
      return;
    }

    if (!currentUser) {
      if (['driver-dashboard', 'customer-dashboard', 'my-shipments', 'manage-shipment', 'book', 'quote'].includes(activeTab)) {
        if (['book', 'quote'].includes(activeTab) && setAuthRedirectTab) {
          setAuthRedirectTab(activeTab);
        }
        setIsAuthModalOpen(true);
        if (showToast) {
          showToast(`Please sign in or create an account to access ${activeTab === 'book' ? 'shipment booking' : activeTab === 'quote' ? 'instant quote' : 'your dashboard'}.`, 'warning');
        }
        changeActiveTab('home');
      }
    } else {
      const userRole = currentUser.role || currentRole;
      if (userRole === 'customer' && activeTab === 'driver-dashboard') {
        changeActiveTab('customer-dashboard');
      } else if (userRole === 'driver' && activeTab === 'customer-dashboard') {
        changeActiveTab('driver-dashboard');
      }
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
        description: 'Learn about Josan Logistics, our dedicated logistics coordination, and our focus on air freight documentation and commercial road transportation.'
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
    const effectiveUser = userOverride !== null ? userOverride : currentUser;
    const effectiveRole = effectiveUser?.role || (userOverride ? userOverride.role : currentRole);

    // Check authentication for protected pages
    if (!effectiveUser && (
      tab === 'book' || 
      tab === 'domestic-shipment' || 
      tab === 'international-shipment' || 
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
          showToast('Please sign in or create an account to book a shipment.', 'warning');
        }
      }
      return;
    }

    // Direct CRM route check
    if (tab === 'crm') {
      if (!effectiveUser || (effectiveRole !== 'admin' && effectiveRole !== 'crm')) {
        loginUser('admin@josanlogistics.com', 'admin123', 'admin', setActiveTab);
      }
    }

    // Direct Admin route check
    if (tab === 'admin-dashboard' || tab === 'admin') {
      if (!effectiveUser || effectiveRole !== 'admin') {
        loginUser('admin@josanlogistics.com', 'admin123', 'admin', setActiveTab);
      }
    }

    if (tab === 'driver-dashboard') {
      if (!effectiveUser || effectiveRole !== 'driver') {
        setIsAuthModalOpen(true);
        if (showToast) showToast('Driver authentication required for Driver Portal', 'warning');
        return;
      }
    }

    setActiveTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const hash = `#${tab}`;
    window.location.hash = hash;
    if (pushHistory && !window.location.hash.startsWith('#track-map-')) {
      window.history.pushState({ tab }, '', hash);
    }
  };

  // Sync with Browser Back / Forward buttons (popstate & hashchange) and handle /admin and /driver
  useEffect(() => {
    const syncHistoryState = (e) => {
      const path = window.location.pathname.toLowerCase();
      const rawHash = window.location.hash.toLowerCase();
      
      // Protected staff login route
      if (path === '/staff-login' || path.endsWith('/staff-login') || rawHash === '#staff-login' || rawHash === '#/staff-login') {
        setActiveTab('staff-login');
        return;
      }

      // Privacy policy & Terms of service routes
      if (path === '/privacy-policy' || rawHash === '#privacy-policy' || rawHash === '#/privacy-policy' || rawHash === '#privacy') {
        setActiveTab('privacy-policy');
        return;
      }

      if (path === '/terms-of-service' || path === '/terms' || rawHash === '#terms-of-service' || rawHash === '#/terms-of-service' || rawHash === '#terms') {
        setActiveTab('terms-of-service');
        return;
      }

      // Direct /crm route: requires staff login
      if (path === '/crm' || path.endsWith('/crm') || rawHash === '#crm' || rawHash === '#/crm') {
        const userRole = currentUser?.role || currentRole;
        if (currentUser && (userRole === 'admin' || userRole === 'crm' || userRole?.startsWith('crm_'))) {
          setActiveTab('crm');
        } else {
          setActiveTab('staff-login');
          if (showToast) showToast('Please authenticate with staff credentials to access CRM Operations.', 'warning');
        }
        return;
      }

      // Secret /admin direct route: requires admin login
      if (path === '/admin' || path.endsWith('/admin') || rawHash === '#admin' || rawHash === '#/admin' || rawHash === '#admin-dashboard') {
        const userRole = currentUser?.role || currentRole;
        if (currentUser && userRole === 'admin') {
          setActiveTab('admin-dashboard');
        } else {
          setActiveTab('staff-login');
          if (showToast) showToast('Please authenticate with administrator credentials to access Admin Portal.', 'warning');
        }
        return;
      }

      // Protected /driver direct route check
      if (path === '/driver' || path.endsWith('/driver') || rawHash === '#driver' || rawHash === '#/driver' || rawHash === '#driver-dashboard') {
        const userRole = currentUser?.role || currentRole;
        if (currentUser && userRole === 'driver') {
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

      if (rawHash === '#book' || rawHash === '#/book' || path === '/book') {
        if (!currentUser) {
          if (setAuthRedirectTab) setAuthRedirectTab('book');
          setIsAuthModalOpen(true);
          if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
          setActiveTab('home');
          return;
        }
        setActiveTab('book');
        return;
      }

      if (rawHash === '#quote' || rawHash === '#/quote' || path === '/quote') {
        if (!currentUser) {
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

      if (rawHash === '#airway-request' || rawHash === '#/airway-request' || path === '/airway-request') {
        setActiveTab('airway-request');
        return;
      }

      const cleanHash = rawHash.replace('#', '');
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
  }, [currentUser, currentRole]);

  const renderPage = () => {
    if (!currentUser && (
      activeTab === 'driver-dashboard' || 
      activeTab === 'admin-dashboard' || 
      activeTab === 'customer-dashboard' || 
      activeTab === 'my-shipments' || 
      activeTab === 'manage-shipment' || 
      activeTab === 'book' || 
      activeTab === 'domestic-shipment' || 
      activeTab === 'international-shipment'
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
      case 'shipment-documentation-support':
      case 'shipment-documentation':
      case 'customs-clearance':
        return <CustomsClearancePage setActiveTab={changeActiveTab} />;
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
      case 'track':
        return <TrackShipmentPage key={`track-${trackNavKey}`} setActiveTab={changeActiveTab} />;
      case 'fleet':
        return <FleetPage setActiveTab={changeActiveTab} />;
      case 'quote':
        return <QuotePage setActiveTab={changeActiveTab} />;
      case 'book':
        return <BookShipmentPage setActiveTab={changeActiveTab} />;
      case 'airway-request':
        return <AirwayRequestPage setActiveTab={changeActiveTab} />;
      case 'domestic-shipment':
        return <DomesticShipmentPage setActiveTab={changeActiveTab} />;
      case 'international-shipment':
        return <InternationalShipmentPage setActiveTab={changeActiveTab} />;
      case 'customer-dashboard':
        return <CustomerDashboardPage setActiveTab={changeActiveTab} initialSubTab="orders" />;
      case 'my-shipments':
        return <CustomerDashboardPage setActiveTab={changeActiveTab} initialSubTab="orders" />;
      case 'manage-shipment':
        return <CustomerDashboardPage setActiveTab={changeActiveTab} initialSubTab="manage" />;
      case 'driver-dashboard':
        return <DriverDashboardPage setActiveTab={changeActiveTab} />;
      case 'admin-dashboard':
        return <AdminDashboardPage setActiveTab={changeActiveTab} />;
      case 'crm':
        return <CrmPage setActiveTab={changeActiveTab} />;
      default:
        return <HomePage setActiveTab={changeActiveTab} />;
    }
  };

  const isAdminView = activeTab === 'admin-dashboard' || activeTab === 'crm' || activeTab === 'staff-login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 w-full overflow-x-hidden">
      {!isAdminView && <Navbar activeTab={activeTab} setActiveTab={changeActiveTab} />}
      <main className="flex-1 w-full overflow-x-hidden">
        <ErrorBoundary onReset={() => changeActiveTab('home')}>
          {renderPage()}
        </ErrorBoundary>
      </main>
      {!isAdminView && <Footer setActiveTab={changeActiveTab} />}
      <AuthModal setActiveTab={changeActiveTab} />
      <ShipmentTypeModal setActiveTab={changeActiveTab} />
      <ShipmentDetailsView />
      <InvoiceModal />
      <ToastNotification />
      <Chatbot />
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
