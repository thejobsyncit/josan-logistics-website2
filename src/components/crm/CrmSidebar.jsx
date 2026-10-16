import React from 'react';
import {
  LayoutDashboard,
  Users,
  Plane,
  Truck,
  FileText,
  FileSpreadsheet,
  Receipt,
  Handshake,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
  PackageCheck,
  Tag
} from 'lucide-react';

export const CRM_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users, badgeKey: 'customers' },
  { id: 'airway-requests', label: 'Airway Requests', icon: Plane, badgeKey: 'airway' },
  { id: 'road-shipments', label: 'Road Shipments', icon: Truck, badgeKey: 'road' },
  { id: 'cargo-pricing', label: 'Cargo & Pricing', icon: Tag, badgeKey: 'cargo' },
  { id: 'documents', label: 'Documents', icon: FileText, badgeKey: 'docs' },
  { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet, badgeKey: 'quotes' },
  { id: 'billing', label: 'Billing', icon: Receipt, badgeKey: 'billing' },
  { id: 'transportation-partners', label: 'Transportation Partners', icon: Handshake, badgeKey: 'partners' },
  { id: 'notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifs' },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const CrmSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  badgeCounts = {},
  currentUser,
  onLogout,
  onBackToWebsite
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#10182D] text-slate-200 border-r border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Top Header / Branding */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-amber-600 flex items-center justify-center text-white font-black shadow-orange-glow shrink-0">
              <span className="text-base tracking-wider font-mono">JL</span>
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-white text-sm tracking-tight truncate">JOSAN LOGISTICS</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30">
                    CRM
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">Customer & Ops Management</p>
              </div>
            )}
          </div>

          {/* Close for mobile, Collapse toggle for desktop */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Operations & Relationship
            </div>
          )}

          {CRM_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const badgeValue = tab.badgeKey ? badgeCounts[tab.badgeKey] : null;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer group relative ${isActive
                    ? 'bg-gradient-to-r from-[#FF6B00] to-orange-600 text-white shadow-orange-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                title={isCollapsed ? tab.label : undefined}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#FF6B00]'
                      }`}
                  />
                  {!isCollapsed && <span className="truncate">{tab.label}</span>}
                </div>

                {!isCollapsed && badgeValue !== null && badgeValue !== undefined && badgeValue > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                  >
                    {badgeValue}
                  </span>
                )}

                {/* Collapsed active dot / badge indicator */}
                {isCollapsed && badgeValue !== null && badgeValue > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00] absolute top-2 right-2 ring-2 ring-[#10182D]"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Logistics Scope & User Account */}
        <div className="p-3 border-t border-slate-800 bg-[#0B1120]/70 space-y-2.5 shrink-0">
          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Logistics Scope</span>
              </div>

              <p className="text-[10px] text-slate-400 leading-snug">
                AWB preparation, billing & shipment documentation • Third-party transportation partners
              </p>
            </div>
          )}
          {/* Quick link back to customer website */}
          <button
            type="button"
            onClick={onBackToWebsite}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer ${isCollapsed ? 'px-0' : ''
              }`}
            title="Return to Public Website"
          >
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
            {!isCollapsed && <span className="truncate">Public Website</span>}
          </button>

          {/* Current Staff User */}
          <div className={`flex items-center justify-between pt-1 ${isCollapsed ? 'flex-col gap-2' : ''}`}>
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-[#FF6B00] shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
              </div>
              {!isCollapsed && (
                <div className="truncate leading-tight">
                  <p className="text-xs font-extrabold text-white truncate">
                    {currentUser?.name || 'CRM Operations'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentUser?.email || 'crm@josanlogistics.com'}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
