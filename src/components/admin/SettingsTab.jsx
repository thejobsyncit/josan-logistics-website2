import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  Shield, 
  Bell, 
  Check, 
  RefreshCw, 
  Lock, 
  Save, 
  Plane, 
  FileCheck 
} from 'lucide-react';

export const SettingsTab = ({ onSaveToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('company'); // 'company' | 'services' | 'security' | 'alerts'

  const [companySettings, setCompanySettings] = useState({
    companyName: 'Josan Logistics Pte. Ltd.',
    uen: '201829481K',
    gstReg: 'M90382910X',
    contactEmail: 'operations@josanlogistics.com',
    supportPhone: '+65 6789 1234',
    address: '7 Changi South Street 2, #03-01 Changi Logistics Centre, Singapore 486415',
    currency: 'SGD (S$)',
    timezone: 'Asia/Singapore (UTC+8)',
    operatingRegion: 'Singapore Domestic & Port Corridors',
  });

  const [servicesSettings, setServicesSettings] = useState({
    defaultCarrierSupport: 'Singapore Airlines Cargo (SQ)',
    awbProcessingSla: '4 Hours',
    transportPartnerModel: 'Contracted 3rd-Party Haulage Partners',
    minPartnerInsurance: 'S$ 100,000 per consignment',
    docRetentionYears: '5 Years (Singapore Customs Compliant)',
    autoArchiveDocs: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '60 minutes',
    adminEmail: 'admin@josanlogistics.com',
    roleAccessLevel: 'Full Administrative Operations',
  });

  const [alertSettings, setAlertSettings] = useState({
    emailOnNewRequest: true,
    emailOnDocUpload: true,
    emailOnStatusChange: true,
    dailyDigestEmail: false,
  });

  const handleSaveAll = (e) => {
    e.preventDefault();
    if (onSaveToast) onSaveToast('Settings successfully updated and saved to system profile.', 'success');
  };

  const handleResetDefaults = () => {
    setCompanySettings({
      companyName: 'Josan Logistics Pte. Ltd.',
      uen: '201829481K',
      gstReg: 'M90382910X',
      contactEmail: 'operations@josanlogistics.com',
      supportPhone: '+65 6789 1234',
      address: '7 Changi South Street 2, #03-01 Changi Logistics Centre, Singapore 486415',
      currency: 'SGD (S$)',
      timezone: 'Asia/Singapore (UTC+8)',
      operatingRegion: 'Singapore Domestic & Port Corridors',
    });
    if (onSaveToast) onSaveToast('Default operational profile restored.', 'info');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              System Configuration
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Singapore Operations
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Platform & Operations Settings</h2>
          <p className="text-xs text-slate-500">
            Configure company legal registration, airway & road partner rules, access security, and alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* 4 CONFIRMED SETTINGS TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'company', label: 'Company & Profile', icon: Building2 },
          { id: 'services', label: 'Transportation & Services', icon: Truck },
          { id: 'security', label: 'Security & Access', icon: Shield },
          { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#FF6B00] text-white shadow-2xs font-extrabold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANY & PROFILE */}
      {activeSubTab === 'company' && (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs animate-fade-in">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Building2 className="w-4 h-4 text-orange-600" />
              <span>Legal Entity & Singapore Registration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">UEN Registration Number</label>
                <input
                  type="text"
                  value={companySettings.uen}
                  onChange={(e) => setCompanySettings({ ...companySettings, uen: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">GST Registration Number</label>
                <input
                  type="text"
                  value={companySettings.gstReg}
                  onChange={(e) => setCompanySettings({ ...companySettings, gstReg: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Support Phone</label>
                <input
                  type="text"
                  value={companySettings.supportPhone}
                  onChange={(e) => setCompanySettings({ ...companySettings, supportPhone: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Contact & Dispatch Email</label>
                <input
                  type="email"
                  value={companySettings.contactEmail}
                  onChange={(e) => setCompanySettings({ ...companySettings, contactEmail: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Registered Logistics Office Address</label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange shadow-2xs"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: TRANSPORTATION & SERVICES */}
      {activeSubTab === 'services' && (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs animate-fade-in">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Truck className="w-4 h-4 text-orange-600" />
              <span>Transportation & Service Execution Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Transportation Partner Operating Model</label>
                <input
                  type="text"
                  value={servicesSettings.transportPartnerModel}
                  readOnly
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 shadow-2xs cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Contracted 3rd-party haulage partners (no company fleet owned).</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Minimum Partner Insurance</label>
                <input
                  type="text"
                  value={servicesSettings.minPartnerInsurance}
                  onChange={(e) => setServicesSettings({ ...servicesSettings, minPartnerInsurance: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Airline Carrier Partner</label>
                <input
                  type="text"
                  value={servicesSettings.defaultCarrierSupport}
                  onChange={(e) => setServicesSettings({ ...servicesSettings, defaultCarrierSupport: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">AWB Processing SLA</label>
                <input
                  type="text"
                  value={servicesSettings.awbProcessingSla}
                  onChange={(e) => setServicesSettings({ ...servicesSettings, awbProcessingSla: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Customs Document Retention Period</label>
                <input
                  type="text"
                  value={servicesSettings.docRetentionYears}
                  onChange={(e) => setServicesSettings({ ...servicesSettings, docRetentionYears: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange shadow-2xs"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: SECURITY & ACCESS */}
      {activeSubTab === 'security' && (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs animate-fade-in">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Shield className="w-4 h-4 text-orange-600" />
              <span>Admin Access & Session Governance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Email Account</label>
                <input
                  type="email"
                  value={securitySettings.adminEmail}
                  readOnly
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700 shadow-2xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Session Inactivity Timeout</label>
                <select
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs cursor-pointer"
                >
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="120 minutes">120 minutes</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                  />
                  <span className="font-bold text-slate-800">Require Two-Factor Authentication (2FA) for Admin Portal logins</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: ALERTS & NOTIFICATIONS */}
      {activeSubTab === 'alerts' && (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs animate-fade-in">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Bell className="w-4 h-4 text-orange-600" />
              <span>Operational Notification Preferences</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.emailOnNewRequest}
                  onChange={(e) => setAlertSettings({ ...alertSettings, emailOnNewRequest: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <div>
                  <span className="font-bold text-slate-900 block">New Service Request Alert</span>
                  <span className="text-[11px] text-slate-500">Receive email notification when a customer submits an inquiry or booking request.</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.emailOnDocUpload}
                  onChange={(e) => setAlertSettings({ ...alertSettings, emailOnDocUpload: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Document Upload Notification</span>
                  <span className="text-[11px] text-slate-500">Alert operations team when new shipment or customs documents are uploaded.</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.emailOnStatusChange}
                  onChange={(e) => setAlertSettings({ ...alertSettings, emailOnStatusChange: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Shipment Status Progression</span>
                  <span className="text-[11px] text-slate-500">Notify dispatch leads when road transportation partners mark shipments as delivered.</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
