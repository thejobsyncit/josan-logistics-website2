import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Clock, 
  Menu, 
  ChevronDown, 
  Plane, 
  Truck, 
  FileSpreadsheet, 
  Users, 
  FileText, 
  ExternalLink
} from 'lucide-react';

export const CrmHeader = ({
  activeTab = 'dashboard',
  activeTabTitle = '',
  setMobileOpen,
  onOpenNewAirway,
  onOpenNewRoad,
  onOpenNewQuote,
  onOpenNewCustomer,
  onOpenUploadDoc,
  globalSearch = '',
  setGlobalSearch,
  notifications = [],
  unreadNotifCount,
  onNotificationClick,
  onMarkAllNotifsRead,
  onBackToWebsite,
  currentUser = null
}) => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [liveTime, setLiveTime] = useState('');
  const [liveDate, setLiveDate] = useState('');

  const quickActionRef = useRef(null);
  const notifRef = useRef(null);

  // Live Singapore Clock (strictly SGT - Asia/Singapore)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveDate(now.toLocaleDateString('en-GB', { 
        timeZone: 'Asia/Singapore',
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      }));
      setLiveTime(now.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Singapore',
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }) + ' SGT');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleOutsideInteraction = (e) => {
      if (quickActionRef.current && !quickActionRef.current.contains(e.target)) {
        setIsQuickActionOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsQuickActionOpen(false);
        setIsNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute unread count reliably
  const unreadCount = typeof unreadNotifCount === 'number'
    ? unreadNotifCount
    : (notifications || []).filter(n => !n.read).length;

  const toggleQuickAction = () => {
    setIsQuickActionOpen(prev => {
      if (!prev) setIsNotifDropdownOpen(false);
      return !prev;
    });
  };

  const toggleNotifDropdown = () => {
    setIsNotifDropdownOpen(prev => {
      if (!prev) setIsQuickActionOpen(false);
      return !prev;
    });
  };

  const handleSelectQuickAction = (actionFn) => {
    setIsQuickActionOpen(false);
    if (typeof actionFn === 'function') {
      actionFn();
    }
  };

  const handleSelectNotification = (n) => {
    setIsNotifDropdownOpen(false);
    if (typeof onNotificationClick === 'function') {
      onNotificationClick(n);
    }
  };

  const handleMarkAllRead = () => {
    if (typeof onMarkAllNotifsRead === 'function') {
      onMarkAllNotifsRead();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile hamburger & Active Section Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setMobileOpen?.(true)}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden cursor-pointer"
          title="Open Navigation"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider hidden sm:inline">
            Josan CRM
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h1 className="text-base sm:text-lg font-black text-slate-900 font-heading tracking-tight capitalize">
            {activeTabTitle || activeTab.replace('-', ' ')}
          </h1>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={globalSearch || ''}
          onChange={(e) => setGlobalSearch?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setGlobalSearch?.('');
          }}
          placeholder="Quick search requests, customers, quotations, invoices..."
          className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB] transition-all"
        />
        {Boolean(globalSearch) && (
          <button
            type="button"
            onClick={() => setGlobalSearch?.('')}
            className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls: Quick Actions, Clock, Notifications, Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Real-time Singapore Clock (SGT) */}
        <div className="hidden xl:flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-[#2463EB]" />
          <span>{liveDate ? `${liveDate}, ${liveTime}` : 'Loading SGT...'}</span>
        </div>

        {/* Quick Action Dropdown */}
        {/* Quick Action Dropdown */}
        <div className="relative" ref={quickActionRef}>
          <button
            type="button"
            onClick={toggleQuickAction}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Intake</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isQuickActionOpen ? 'rotate-180' : ''}`} />
          </button>

          {isQuickActionOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in text-xs font-bold text-slate-700">
              <div className="px-3 py-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400">
                Logistics Workflows
              </div>

              {/* 1. Air Freight Request */}
              <button
                type="button"
                onClick={() => handleSelectQuickAction(onOpenNewAirway)}
                className="w-full px-3 py-2 text-left hover:bg-orange-50 hover:text-orange-950 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Plane className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 leading-tight">Air Freight Request</p>
                  <p className="text-[10px] text-slate-500 font-medium">AWB, docs &amp; airport transfer</p>
                </div>
              </button>

              {/* 2. Road Coordination */}
              <button
                type="button"
                onClick={() => handleSelectQuickAction(onOpenNewRoad)}
                className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-950 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 leading-tight">Road Coordination</p>
                  <p className="text-[10px] text-slate-500 font-medium">Book commercial roadway</p>
                </div>
              </button>

              {/* 3. Create Quotation */}
              <button
                type="button"
                onClick={() => handleSelectQuickAction(onOpenNewQuote)}
                className="w-full px-3 py-2 text-left hover:bg-purple-50 hover:text-purple-700 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 leading-tight">Create Quotation</p>
                  <p className="text-[10px] text-slate-500 font-medium">Itemized customer quote</p>
                </div>
              </button>

              <div className="my-1 border-t border-slate-100"></div>

              {/* 4. Add Customer */}
              <button
                type="button"
                onClick={() => handleSelectQuickAction(onOpenNewCustomer)}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 leading-tight">Add Customer</p>
                  <p className="text-[10px] text-slate-500 font-medium">New corporate account</p>
                </div>
              </button>

              {/* 5. Shipment Documents */}
              <button
                type="button"
                onClick={() => handleSelectQuickAction(onOpenUploadDoc)}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 leading-tight">Shipment Documents</p>
                  <p className="text-[10px] text-slate-500 font-medium">Invoices, packing lists &amp; AWB</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={toggleNotifDropdown}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#2463EB] text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 py-3 z-50 animate-fade-in">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm text-slate-900">CRM Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#EAF2FF] text-[#2463EB] rounded-full text-[10px] font-black">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-[#2463EB] hover:text-[#1D4ED8] cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 px-2 py-1">
                {(notifications || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">
                    No active notifications
                  </div>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleSelectNotification(n)}
                      className={`p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                        !n.read ? 'bg-[#EAF2FF]/40' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center shrink-0 mt-0.5">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 line-clamp-1">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          {n.timestamp || 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back to Website Pill */}
        <button
          type="button"
          onClick={() => onBackToWebsite?.()}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
          title="Return to Public Website"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span>Website</span>
        </button>

        {/* CRM Operator Profile Pill */}
        {(() => {
          const staffName = currentUser?.name || currentUser?.fullName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Staff Member');
          const staffRole = currentUser?.displayRole || (currentUser?.role === 'admin' ? 'Administrator' : 'CRM Operations');
          const staffInitial = (staffName.charAt(0) || currentUser?.email?.charAt(0) || 'S').toUpperCase();

          return (
            <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0B1F5B] to-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs" title={staffName}>
                {staffInitial}
              </div>
              <div className="hidden lg:block leading-tight">
                <p className="text-xs font-black text-slate-900 truncate max-w-[140px]" title={staffName}>
                  {staffName}
                </p>
                <p className="text-[10px] font-bold text-[#2463EB]">{staffRole}</p>
              </div>
            </div>
          );
        })()}
      </div>
    </header>
  );
};
