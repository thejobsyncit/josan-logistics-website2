import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Plane, 
  Truck, 
  FileCheck, 
  Users, 
  Handshake, 
  ClipboardList, 
  BarChart3, 
  Bell, 
  Settings, 
  ArrowLeft, 
  Globe 
} from 'lucide-react';

export const AdminSidebar = ({ 
  adminTab, 
  setAdminTab, 
  counts = {}, 
  onReturnToPublic 
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments', icon: Package, count: counts.shipments },
    { id: 'airway_services', label: 'Airway Services', icon: Plane, count: counts.airway },
    { id: 'road_transportation', label: 'Road Transportation', icon: Truck, count: counts.road },
    { id: 'documentation', label: 'Documentation', icon: FileCheck, count: counts.documents },
    { id: 'customers', label: 'Customers', icon: Users, count: counts.customers },
    { id: 'transportation_partners', label: 'Transportation Partners', icon: Handshake, count: counts.partners },
    { id: 'service_requests', label: 'Service Requests', icon: ClipboardList, count: counts.requests },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: counts.notifications },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-72 bg-[#0B132B] text-slate-300 p-4 sm:p-5 flex flex-col justify-between shrink-0 border-r border-slate-800 shadow-2xl z-20 min-h-screen">
      <div className="space-y-5">
        {/* Brand Header */}
        <div 
          onClick={() => setAdminTab('overview')}
          className="flex items-center space-x-3 cursor-pointer group px-2 py-1"
        >
          <img 
            src="/assets/josan_logo.png" 
            alt="Josan Logistics Official Brand Logo" 
            className="h-10 sm:h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200" 
          />
          <div className="flex flex-col">
            <span className="text-white font-black text-lg tracking-wider leading-none">
              JOSAN
            </span>
            <span className="text-[#FF6B00] font-black text-[9px] tracking-widest uppercase mt-0.5">
              LOGISTICS PTE. LTD.
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>

        {/* System Status Indicator */}
        <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px] shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-bold text-slate-200">
              Operations Portal Online
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">SG Hub</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isSelected = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setAdminTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between font-bold text-xs cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && item.count !== null && item.count > 0 && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold shrink-0 ml-1.5 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation: Link back to public site */}
      <div className="space-y-3 pt-6 border-t border-slate-800/80 mt-6">
        <button
          onClick={onReturnToPublic}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs font-semibold cursor-pointer group shadow-2xs"
          title="Return to Public Website"
        >
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-3.5 h-3.5 text-orange-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Customer Website</span>
          </div>
          <Globe className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
        </button>

        {/* Brand Card */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3.5">
          <p className="text-[11px] font-black text-white leading-tight">
            Efficient Logistics
          </p>
          <p className="text-[10px] font-medium text-orange-400 mt-0.5">
            Airway • Road • Documentation
          </p>
          <p className="text-[9px] text-slate-400 mt-1">
            Singapore Commercial Support
          </p>
        </div>
      </div>
    </aside>
  );
};
