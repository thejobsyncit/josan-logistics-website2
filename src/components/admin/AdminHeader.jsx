import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Bell, 
  ChevronDown, 
  Users, 
  Settings, 
  LogOut, 
  Shield, 
  Globe, 
  Sliders,
  ExternalLink
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
  systemUsers = []
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

  // Filter matching system records
  const q = (searchQuery || '').trim().toLowerCase();
  const matchingUsers = q ? systemUsers.filter(u => 
    u.name?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q) ||
    u.role?.toLowerCase().includes(q) ||
    u.company?.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs font-sans">
      {/* Search Input for System Administration */}
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
            placeholder="Search system users, roles, website content, services..."
            className="w-full pl-9 pr-10 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#2463EB] rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 transition-all shadow-2xs"
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
              <span>System Search for "{searchQuery}"</span>
              <span className="text-slate-400 font-normal">Click to navigate</span>
            </div>

            {matchingUsers.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching system users found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {matchingUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      if (onSelectSearchResult) onSelectSearchResult('user', user);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900">{user.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{user.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {user.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions: CRM Portal Link, Notifications, Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Direct Link to CRM Portal */}
        <a
          href="/crm"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2FF] hover:bg-[#EAF2FF] text-[#2463EB] border border-[#DCE5F0] text-xs font-extrabold transition-colors cursor-pointer"
          title="Open CRM Operations Portal in separate section"
        >
          <span>Open CRM</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2463EB] ring-2 ring-white" />
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0B1F5B] text-white flex items-center justify-center font-black text-xs font-mono">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'AJ'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'Alexander Josan'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                System Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name || 'Alexander Josan'}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser?.email || 'admin@josanlogistics.com'}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => { setProfileDropdownOpen(false); onOpenSettings(); }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Settings</span>
                </button>
                <a
                  href="/crm"
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#2463EB]" />
                  <span>Switch to CRM Portal</span>
                </a>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setProfileDropdownOpen(false); onLogout(); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
