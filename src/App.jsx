import React, { useState, useEffect } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';

import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { TrackShipmentPage } from './pages/TrackShipmentPage';
import { BookShipmentPage } from './pages/BookShipmentPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useLogistics();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 text-sm font-extrabold ${
        toast.type === 'warning'
          ? 'bg-amber-900 text-amber-100 border-amber-700'
          : toast.type === 'info'
          ? 'bg-slate-900 text-white border-slate-700'
          : 'bg-orange-600 text-white border-orange-500 shadow-orange-glow'
      }`}>
        {toast.type === 'warning' ? (
          <AlertCircle className="w-5 h-5 text-amber-400" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-orange-400" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-white" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { currentRole, toggleRole } = useLogistics();

  // Listen for /admin or #admin in the URL bar to strictly open Admin Portal
  useEffect(() => {
    const checkAdminUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.endsWith('/admin') || hash === '#admin' || hash === '#/admin') {
        toggleRole('admin');
        setActiveTab('admin-dashboard');
      }
    };

    checkAdminUrl();
    window.addEventListener('popstate', checkAdminUrl);
    window.addEventListener('hashchange', checkAdminUrl);
    return () => {
      window.removeEventListener('popstate', checkAdminUrl);
      window.removeEventListener('hashchange', checkAdminUrl);
    };
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'about':
        return <AboutUsPage setActiveTab={setActiveTab} />;
      case 'services':
        return <ServicesPage setActiveTab={setActiveTab} />;
      case 'contact':
        return <ContactPage />;
      case 'track':
        return <TrackShipmentPage />;
      case 'book':
        return <BookShipmentPage setActiveTab={setActiveTab} />;
      case 'customer-dashboard':
        return <CustomerDashboardPage setActiveTab={setActiveTab} />;
      case 'driver-dashboard':
        return <DriverDashboardPage setActiveTab={setActiveTab} />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer setActiveTab={setActiveTab} />
      <AuthModal setActiveTab={setActiveTab} />
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
