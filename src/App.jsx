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
  
  const { currentRole, currentUser, toggleRole, setIsAuthModalOpen, openAuthModalWithoutClose } = useLogistics();

  // Automatically pop up Login/Register modal on initial website open if customer is not logged in
  useEffect(() => {
    if (!currentUser) {
      openAuthModalWithoutClose();
    }
  }, []);

  // Scroll to top of page whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // Navigation tab switcher synced with Browser History API (pushState)
  const changeActiveTab = (tab, pushHistory = true) => {
    if (!currentUser && (tab === 'book' || tab === 'track' || tab === 'customer-dashboard' || tab === 'driver-dashboard' || tab === 'admin-dashboard')) {
      openAuthModalWithoutClose();
      return;
    }
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
    if (!currentUser && (activeTab === 'driver-dashboard' || activeTab === 'admin-dashboard' || activeTab === 'customer-dashboard' || activeTab === 'track' || activeTab === 'book')) {
      return <HomePage setActiveTab={changeActiveTab} />;
    }

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
