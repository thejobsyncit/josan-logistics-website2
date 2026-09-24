import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Bell, 
  ChevronDown, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Shield, 
  Plane, 
  Truck 
} from 'lucide-react';

export const AdminHeader = ({
  searchQuery,
  setSearchQuery,
  onSelectSearchResult,
  notifications = [],
  onOpenNotifications,
  onOpenSettings,
  onOpenOverview,
  currentUser,
  onLogout,
  shipments = [],
  customers = [],
  documents = []
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Filter matching records for the quick search popup
  const q = (searchQuery || '').trim().toLowerCase();
  const matchingShipments = q ? shipments.filter(s => 
    s.id?.toLowerCase().includes(q) ||
    s.customer?.toLowerCase().includes(q) ||
    s.customerName?.toLowerCase().includes(q) ||
    s.sender?.toLowerCase().includes(q) ||
    s.awbNumber?.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchingCustomers = q ? customers.filter(c => 
    c.name?.toLowerCase().includes(q) ||
    c.company?.toLowerCase().includes(q) ||
    c.email?.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchingDocs = q ? documents.filter(d => 
    d.name?.toLowerCase().includes(q) ||
    d.type?.toLowerCase().includes(q) ||
    d.shipmentId?.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Search Input for Operational Data (NO tracking search) */}
      <div className="relative max-w-lg w-full" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search shipments, airway AWB, road dispatch, customers, documents..."
            className="w-full pl-9 pr-10 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchOpen && q && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fade-in max-h-96 overflow-y-auto">
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-700 flex justify-between">
              <span>Search Results for "{searchQuery}"</span>
              <span className="text-slate-400 font-normal">Click to navigate</span>
            </div>

            {matchingShipments.length === 0 && matchingCustomers.length === 0 && matchingDocs.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching shipments, customers or documents found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {matchingShipments.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Shipments ({matchingShipments.length})
                    </p>
                    {matchingShipments.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onSelectSearchResult('shipment', s);
                          setIsSearchOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {s.service?.includes('Air') || s.serviceType?.includes('air') ? (
                            <Plane className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          ) : (
                            <Truck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          )}
                          <span className="font-mono font-bold text-slate-900">{s.id}</span>
                          <span className="text-slate-500 truncate max-w-[150px]">{s.customer || s.customerName || s.sender}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingCustomers.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Customers ({matchingCustomers.length})
                    </p>
                    {matchingCustomers.map(c => (
                      <div
                        key={c.id || c.name}
                        onClick={() => {
                          onSelectSearchResult('customer', c);
                          setIsSearchOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <span className="text-[10px] text-slate-400 truncate">{c.company}</span>
                        </div>
                        <span className="text-[10px] text-blue-600 font-bold">View Profile →</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingDocs.length > 0 && (
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Documents ({matchingDocs.length})
                    </p>
                    {matchingDocs.map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onSelectSearchResult('document', d);
                          setIsSearchOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-800 truncate">{d.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({d.type})</span>
                        </div>
                        <span className="text-[10px] text-blue-600 font-bold">View Doc →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Operations Overview Badge */}
        <span className="hidden sm:flex items-center text-[11px] font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
          Operations Overview
        </span>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          title="Operational Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {unreadNotifications.length}
            </span>
          )}
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2.5 pl-2 sm:pl-3 py-1 pr-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B132B] to-slate-800 text-white flex items-center justify-center font-black text-xs shadow-xs">
              A
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-black text-slate-900">Admin</p>
              <p className="text-[10px] font-semibold text-slate-400">Josan Operations</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-2 space-y-1 animate-fade-in text-xs font-medium">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">Josan Operations Admin</p>
                <p className="text-[10px] text-slate-400 font-mono">admin@josanlogistics.com</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenOverview();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-orange-50 text-orange-600 font-bold cursor-pointer flex items-center justify-between"
              >
                <span>Portal Settings</span>
                <Settings className="w-3.5 h-3.5 text-orange-500" />
              </button>
              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold cursor-pointer flex items-center justify-between"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
