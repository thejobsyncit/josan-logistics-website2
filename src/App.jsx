import React, { useState, useEffect } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ShipmentTypeModal } from './components/ShipmentTypeModal';
import { ShipmentDetailsView } from './components/ShipmentDetailsView';
import { SingaporeGoogleMapBackground } from './components/SingaporeGoogleMapBackground';

import { HomePage } from './pages/HomePage';
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
import { CrmPage } from './pages/CrmPage';
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
    <div className="fixed bottom-6 right-6 z-[90] animate-fade-in">
      <div className={`px-5 py-4 rounded-2xl shadow-2xl border flex items-center space-x-3 text-sm font-extrabold ${
        toast.type === 'warning'
          ? 'bg-amber-900 text-amber-100 border-amber-700'
          : toast.type === 'info'
          ? 'bg-slate-900 text-white border-slate-700'
          : 'bg-orange-600 text-white border-orange-500 shadow-orange-glow'
      }`}>
        {toast.type === 'warning' ? (
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-orange-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
        )}
        <span>{toast.message}</span>
        <button
          onClick={() => showToast(null)}
          className="ml-3 p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
          title="Dismiss notification"
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
    'about', 
    'services', 
    'customs-clearance', 
    'contact', 
    'track', 
    'fleet', 
    'quote', 
    'book', 
    'domestic-shipment', 
    'international-shipment', 
    'customer-dashboard', 
    'my-shipments', 
    'manage-shipment', 
    'driver-dashboard', 
    'admin-dashboard',
    'crm'
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    if (path === '/crm' || path.endsWith('/crm') || rawHash === 'crm' || rawHash === '/crm') {
      return 'crm';
    }
    if (rawHash.startsWith('track-map-')) return 'track';
    return validTabs.includes(rawHash) ? rawHash : 'home';
  });
  
  const { currentRole, currentUser, setIsAuthModalOpen, setAuthRedirectTab, showToast } = useLogistics();

  // Enforce strict protected role routes
  useEffect(() => {
    if (!currentUser) {
      if (['driver-dashboard', 'admin-dashboard', 'customer-dashboard', 'my-shipments', 'manage-shipment', 'book', 'track'].includes(activeTab)) {
        if (['book', 'track'].includes(activeTab) && setAuthRedirectTab) {
          setAuthRedirectTab(activeTab);
        }
        setIsAuthModalOpen(true);
        if (showToast) {
          showToast(`Please sign in or create an account to access ${activeTab === 'book' ? 'shipment booking' : activeTab === 'track' ? 'live tracking' : 'your dashboard'}.`, 'warning');
        }
        changeActiveTab('home');
      }
    } else {
      const userRole = currentUser.role || currentRole;
      if (userRole === 'customer' && (activeTab === 'driver-dashboard' || activeTab === 'admin-dashboard')) {
        changeActiveTab('customer-dashboard');
      } else if (userRole === 'driver' && (activeTab === 'customer-dashboard' || activeTab === 'admin-dashboard')) {
        changeActiveTab('driver-dashboard');
      }
    }
  }, [currentUser, activeTab]);

  // Scroll to top of page whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const [trackNavKey, setTrackNavKey] = useState(0);

  // Navigation tab switcher synced with Browser History API (pushState)
  const changeActiveTab = (tab, pushHistory = true) => {
    if (tab === 'track') {
      setTrackNavKey(prev => prev + 1);
    }
    // Check authentication for protected pages (Book and Track require login)
    if (!currentUser && (
      tab === 'book' || 
      tab === 'domestic-shipment' || 
      tab === 'international-shipment' || 
      tab === 'customer-dashboard' || 
      tab === 'my-shipments' || 
      tab === 'manage-shipment' ||
      tab === 'track'
    )) {
      if (setAuthRedirectTab) setAuthRedirectTab(tab);
      setIsAuthModalOpen(true);
      if (showToast) {
        if (tab === 'track') {
          showToast('Please sign in to track road shipments.', 'warning');
        } else {
          showToast('Please sign in or create an account to book a shipment.', 'warning');
        }
      }
      return;
    }

    // Protect Admin and Driver portals strictly
    if (tab === 'admin-dashboard') {
      const role = currentUser?.role || currentRole;
      if (!currentUser || role !== 'admin') {
        setIsAuthModalOpen(true);
        if (showToast) showToast('Admin authentication required for Admin Dashboard', 'warning');
        return;
      }
    }

    if (tab === 'driver-dashboard') {
      const role = currentUser?.role || currentRole;
      if (!currentUser || role !== 'driver') {
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
      
      // Direct /crm route check
      if (path === '/crm' || path.endsWith('/crm') || rawHash === '#crm' || rawHash === '#/crm') {
        setActiveTab('crm');
        return;
      }

      // Protected /admin direct route check
      if (path === '/admin' || path.endsWith('/admin') || rawHash === '#admin' || rawHash === '#/admin' || rawHash === '#admin-dashboard') {
        const userRole = currentUser?.role || currentRole;
        if (currentUser && userRole === 'admin') {
          setActiveTab('admin-dashboard');
        } else {
          setIsAuthModalOpen(true);
          if (showToast) showToast('Please sign in with Admin credentials to access Admin Hub.', 'warning');
          setActiveTab('home');
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
        if (!currentUser) {
          if (setAuthRedirectTab) setAuthRedirectTab('track');
          setIsAuthModalOpen(true);
          if (showToast) showToast('Please sign in to track road shipments.', 'warning');
          setActiveTab('home');
          return;
        }
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
      activeTab === 'international-shipment' ||
      activeTab === 'track'
    )) {
      return <HomePage setActiveTab={changeActiveTab} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={changeActiveTab} />;
      case 'about':
        return <AboutUsPage setActiveTab={changeActiveTab} />;
      case 'services':
        return <ServicesPage setActiveTab={changeActiveTab} />;
      case 'customs-clearance':
        return <CustomsClearancePage setActiveTab={changeActiveTab} />;
      case 'contact':
        return <ContactPage />;
      case 'track':
        return <TrackShipmentPage key={`track-${trackNavKey}`} setActiveTab={changeActiveTab} />;
      case 'fleet':
        return <FleetPage setActiveTab={changeActiveTab} />;
      case 'quote':
        return <QuotePage setActiveTab={changeActiveTab} />;
      case 'book':
        return <BookShipmentPage setActiveTab={changeActiveTab} />;
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
        return <AdminDashboardPage />;
      case 'crm':
        return <CrmPage setActiveTab={changeActiveTab} />;
      default:
        return <HomePage setActiveTab={changeActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 w-full overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={changeActiveTab} />
      <main className="flex-1 w-full overflow-x-hidden">
        <ErrorBoundary onReset={() => changeActiveTab('home')}>
          {renderPage()}
        </ErrorBoundary>
      </main>
      <Footer setActiveTab={changeActiveTab} />
      <AuthModal setActiveTab={changeActiveTab} />
      <ShipmentTypeModal setActiveTab={changeActiveTab} />
      <ShipmentDetailsView />
      <InvoiceModal />
      <ToastNotification />
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
