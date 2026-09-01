import React, { useState, useEffect } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { SingaporeGoogleMapBackground } from './components/SingaporeGoogleMapBackground';

import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { TrackShipmentPage } from './pages/TrackShipmentPage';
import { BookShipmentPage } from './pages/BookShipmentPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
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
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
          {/* Header Card with Prominent Return to Dashboard Button */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => {
                this.setState({ hasError: false });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Return to Dashboard</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Singapore Telematics Live Demo Map
              </span>
            </div>
          </div>

          {/* Clean Demo Map (No Truck Graphic) */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 h-[480px] sm:h-[550px] relative">
            <SingaporeGoogleMapBackground
              showTruck={false}
              origin="Changi Air Cargo Complex"
              destination="Jurong Port Industrial Estate"
            />
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
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
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
  const validTabs = ['home', 'about', 'services', 'contact', 'track', 'book', 'customer-dashboard', 'driver-dashboard', 'admin-dashboard'];

  const [activeTab, setActiveTab] = useState(() => {
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    if (rawHash.startsWith('track-map-')) return 'track';
    return validTabs.includes(rawHash) ? rawHash : 'home';
  });
  
  const { currentRole, toggleRole } = useLogistics();

  // Scroll to top of page whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // Navigation tab switcher synced with Browser History API (pushState)
  const changeActiveTab = (tab, pushHistory = true) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const hash = `#${tab}`;
    if (pushHistory && window.location.hash !== hash && !window.location.hash.startsWith('#track-map-')) {
      window.history.pushState({ tab }, '', hash);
    }
  };

  // Sync with Browser Back / Forward buttons (popstate & hashchange)
  useEffect(() => {
    const syncHistoryState = (e) => {
      const path = window.location.pathname.toLowerCase();
      const rawHash = window.location.hash.toLowerCase();
      
      if (path === '/admin' || path.endsWith('/admin') || rawHash === '#admin' || rawHash === '#/admin') {
        toggleRole('admin');
        setActiveTab('admin-dashboard');
        return;
      }

      if (rawHash.startsWith('#track-map-')) {
        setActiveTab('track');
        return;
      }

      const cleanHash = rawHash.replace('#', '');
      if (cleanHash && validTabs.includes(cleanHash)) {
        setActiveTab(cleanHash);
      } else if (e && e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else {
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
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={changeActiveTab} />;
      case 'about':
        return <AboutUsPage setActiveTab={changeActiveTab} />;
      case 'services':
        return <ServicesPage setActiveTab={changeActiveTab} />;
      case 'contact':
        return <ContactPage />;
      case 'track':
        return <TrackShipmentPage setActiveTab={changeActiveTab} />;
      case 'book':
        return <BookShipmentPage setActiveTab={changeActiveTab} />;
      case 'customer-dashboard':
        return <CustomerDashboardPage setActiveTab={changeActiveTab} />;
      case 'driver-dashboard':
        return <DriverDashboardPage setActiveTab={changeActiveTab} />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      default:
        return <HomePage setActiveTab={changeActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={changeActiveTab} />
      <main className="flex-1">
        <ErrorBoundary onReset={() => changeActiveTab('home')}>
          {renderPage()}
        </ErrorBoundary>
      </main>
      <Footer setActiveTab={changeActiveTab} />
      <AuthModal setActiveTab={changeActiveTab} />
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
