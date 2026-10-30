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
  FileCheck,
  MessageSquare,
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  getAdminChatSessions, 
  deleteChatSession, 
  deleteCustomerChatsOnRequest 
} from '../../services/chatStorageService';
import { useLogistics } from '../../context/LogisticsContext';

export const SettingsTab = ({ onSaveToast }) => {
  const { siteSettings, updateSiteSettings } = useLogistics();
  const [activeSubTab, setActiveSubTab] = useState('company'); // 'company' | 'services' | 'security' | 'alerts'

  const [companySettings, setCompanySettings] = useState({
    companyName: siteSettings?.company_name || 'Josan Logistics Pte. Ltd.',
    uen: siteSettings?.uen || '',
    gstReg: siteSettings?.gst_reg || '',
    contactEmail: siteSettings?.contact_email || 'contact@josanlogistics.com.sg',
    supportPhone: siteSettings?.phone || '+65 6789 0123',
    address: siteSettings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
    currency: 'SGD (S$)',
    timezone: 'Asia/Singapore (UTC+8)',
    operatingRegion: 'Singapore Domestic & Port Corridors',
  });

  // Keep in sync with siteSettings from Supabase / Context
  React.useEffect(() => {
    if (siteSettings) {
      setCompanySettings({
        companyName: siteSettings.company_name || 'Josan Logistics Pte. Ltd.',
        uen: siteSettings.uen === '201829481K' || siteSettings.uen === '202412345K' ? '' : (siteSettings.uen || ''),
        gstReg: siteSettings.gst_reg === 'M90382910X' || siteSettings.gst_reg === 'M90384721' ? '' : (siteSettings.gst_reg || ''),
        contactEmail: siteSettings.contact_email || 'contact@josanlogistics.com.sg',
        supportPhone: siteSettings.phone || '+65 6789 0123',
        address: siteSettings.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
        currency: 'SGD (S$)',
        timezone: 'Asia/Singapore (UTC+8)',
        operatingRegion: 'Singapore Domestic & Port Corridors',
      });
    }
  }, [siteSettings]);

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

  const [chatSessions, setChatSessions] = useState(() => getAdminChatSessions());
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [deletionFeedback, setDeletionFeedback] = useState(null);

  const refreshChatSessions = () => {
    setChatSessions(getAdminChatSessions());
  };

  const handleDeleteCustomerChats = (e) => {
    e?.preventDefault();
    if (!customerSearchQuery.trim()) return;
    const deleted = deleteCustomerChatsOnRequest(customerSearchQuery);
    refreshChatSessions();
    if (deleted > 0) {
      setDeletionFeedback({
        type: 'success',
        msg: `Successfully deleted ${deleted} chat session(s) matching "${customerSearchQuery}" on customer request.`
      });
      if (onSaveToast) onSaveToast(`Deleted ${deleted} chat record(s) on request`, 'success');
    } else {
      setDeletionFeedback({
        type: 'info',
        msg: `No chat sessions found matching "${customerSearchQuery}".`
      });
    }
    setCustomerSearchQuery('');
  };

  const handleDeleteSingleSession = (sessionId) => {
    deleteChatSession(sessionId);
    refreshChatSessions();
    if (onSaveToast) onSaveToast(`Chat session deleted`, 'info');
  };

  const handleSaveAll = async (e) => {
    e?.preventDefault();
    if (typeof updateSiteSettings === 'function') {
      await updateSiteSettings({
        company_name: companySettings.companyName,
        uen: companySettings.uen ? companySettings.uen.trim() : '',
        gst_reg: companySettings.gstReg ? companySettings.gstReg.trim() : '',
        phone: companySettings.supportPhone ? companySettings.supportPhone.trim() : '+65 6789 0123',
        contact_email: companySettings.contactEmail ? companySettings.contactEmail.trim() : 'contact@josanlogistics.com.sg',
        registered_office: companySettings.address ? companySettings.address.trim() : '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
      });
    }
    if (onSaveToast) onSaveToast('Settings successfully updated and saved to system profile & database.', 'success');
  };

  const handleResetDefaults = () => {
    setCompanySettings({
      companyName: 'Josan Logistics Pte. Ltd.',
      uen: '',
      gstReg: '',
      contactEmail: 'contact@josanlogistics.com.sg',
      supportPhone: '+65 6789 0123',
      address: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
      currency: 'SGD (S$)',
      timezone: 'Asia/Singapore (UTC+8)',
      operatingRegion: 'Singapore Domestic & Port Corridors',
    });
    if (onSaveToast) onSaveToast('Default real corporate profile restored.', 'info');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-[#2463EB] uppercase tracking-wider bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#DCE5F0]">
              System Configuration
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Singapore Operations
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Platform & Operations Settings</h2>
          <p className="text-xs text-slate-500">
            Configure company legal registration, air freight &amp; road partner rules, access security, and alerts.
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
            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
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
          { id: 'chatPrivacy', label: 'AI Chat Privacy & Retention', icon: MessageSquare },
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
                  ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#FF6B00]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANY & PROFILE */}
      {activeSubTab === 'company' && (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs animate-fade-in">
          {/* Demo Values Warning Banner */}
          {siteSettings?.demo_mode && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start space-x-3 text-amber-900 shadow-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-amber-900">Demo values</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-200 text-amber-800 border border-amber-300">
                    demo_mode: true
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  This portal is operating in demonstration mode. The contact phone (+65 6789 0123) and regulatory numbers are demonstration values. Please enter real ACRA UEN and IRAS GST registration numbers before production deployment.
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Building2 className="w-4 h-4 text-[#FF6B00]" />
              <span>Legal Entity &amp; Singapore Registration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">UEN Registration Number</label>
                <input
                  type="text"
                  value={companySettings.uen}
                  onChange={(e) => setCompanySettings({ ...companySettings, uen: e.target.value })}
                  placeholder="[ENTER REAL UEN or leave blank]"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-2xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Leave blank until real ACRA UEN is issued.</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">GST Registration Number</label>
                <input
                  type="text"
                  value={companySettings.gstReg}
                  onChange={(e) => setCompanySettings({ ...companySettings, gstReg: e.target.value })}
                  placeholder="[ENTER REAL or leave blank]"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-2xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Leave blank if non-GST registered or pending IRAS registration.</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Support Phone</label>
                <input
                  type="text"
                  value={companySettings.supportPhone}
                  onChange={(e) => setCompanySettings({ ...companySettings, supportPhone: e.target.value })}
                  placeholder="+65 6789 0123"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-2xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Single site phone from site_settings (currently +65 6789 0123, a demo).</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Contact Email</label>
                <input
                  type="email"
                  value={companySettings.contactEmail}
                  onChange={(e) => setCompanySettings({ ...companySettings, contactEmail: e.target.value })}
                  placeholder="contact@josanlogistics.com.sg"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-2xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Primary contact email across all public pages, quotes, and documentation.</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Registered Office Address</label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  placeholder="10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438 [CONFIRM]"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-2xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438 [CONFIRM]</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 transition-all text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Profile</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: TRANSPORTATION & SERVICES */}
      {activeSubTab === 'services' && (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs animate-fade-in">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Truck className="w-4 h-4 text-[#2463EB]" />
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
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-blue shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Airline Carrier Partner</label>
                <input
                  type="text"
                  value={servicesSettings.defaultCarrierSupport}
                  onChange={(e) => setServicesSettings({ ...servicesSettings, defaultCarrierSupport: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-blue shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">AWB Processing SLA</label>
                <input
                  type="text"
                  value={servicesSettings.awbProcessingSla}
                  onChange={(e) => setServicesSettings({ ...servicesSettings, awbProcessingSla: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-blue shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Customs Document Retention Period</label>
                <input
                  type="text"
                  value={servicesSettings.docRetentionYears}
                  onChange={(e) => setServicesSettings({ ...servicesSettings, docRetentionYears: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs"
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
              <Shield className="w-4 h-4 text-[#2463EB]" />
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
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-blue shadow-2xs cursor-pointer"
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
                    className="w-4 h-4 rounded text-[#2463EB] focus:ring-[#2463EB]/25 border-slate-300"
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
              <Bell className="w-4 h-4 text-[#2463EB]" />
              <span>Operational Notification Preferences</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.emailOnNewRequest}
                  onChange={(e) => setAlertSettings({ ...alertSettings, emailOnNewRequest: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2463EB] focus:ring-[#2463EB]/25 border-slate-300"
                />
                <div>
                  <span className="font-bold text-slate-900 block">New Service Request Alert</span>
                  <span className="text-[11px] text-slate-500">Receive email notification when a customer submits an inquiry or quote request.</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.emailOnDocUpload}
                  onChange={(e) => setAlertSettings({ ...alertSettings, emailOnDocUpload: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2463EB] focus:ring-[#2463EB]/25 border-slate-300"
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
                  className="w-4 h-4 rounded text-[#2463EB] focus:ring-[#2463EB]/25 border-slate-300"
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

      {/* TAB 5: AI CHAT PRIVACY & RETENTION */}
      {activeSubTab === 'chatPrivacy' && (
        <div className="space-y-6 text-xs animate-fade-in">
          {/* Policy Overview Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-[#2463EB]" />
                  <span>JOSAN AI Chat Storage &amp; Retention Controls</span>
                </h3>
                <p className="text-slate-500 text-[11px] mt-1">
                  Store chats for follow-up on enquiry or quote requests and delete them after 30 days, visible to admin staff only.
                </p>
              </div>
              <button
                type="button"
                onClick={refreshChatSessions}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer self-start shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  1. Storage Purpose
                </span>
                <span className="font-bold text-slate-900 text-xs block">
                  Follow up on enquiry or quote request
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Visible to admin staff only. Attached to quote/enquiry ref or sent by customer.
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  2. Retention Rule
                </span>
                <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Delete them after 30 days
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Chat records are automatically purged after 30 days. Visible to admin staff only.
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  3. Privacy Rights
                </span>
                <span className="font-bold text-[#2463EB] text-xs block">
                  Delete on Customer Request
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Admin tool below permanently deletes a customer's chats on request.
                </span>
              </div>
            </div>
          </div>

          {/* Delete Customer Chats On Request Tool */}
          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Admin Action: Delete Customer's Chats on Request
                </h4>
                <p className="text-[11px] text-slate-500">
                  Search by customer email, name, or session ID to permanently purge all associated records.
                </p>
              </div>
            </div>

            <form onSubmit={handleDeleteCustomerChats} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                placeholder="Enter customer email, name, or session ID..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus-blue"
              />
              <button
                type="submit"
                disabled={!customerSearchQuery.trim()}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Customer's Chats on Request</span>
              </button>
            </form>

            {deletionFeedback && (
              <div className={`p-3 rounded-xl border text-[11px] font-bold flex items-center space-x-2 animate-fade-in ${
                deletionFeedback.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{deletionFeedback.msg}</span>
              </div>
            )}
          </div>

          {/* Stored Chat Sessions Table */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Stored Support & Quote Chats ({chatSessions.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Visible to admin staff only. Kept strictly for quote follow-up and service quality.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 self-start">
                Purge Window: &le; 30 Days
              </span>
            </div>

            {chatSessions.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-1">
                <p className="font-bold text-slate-700">No active stored chat records found.</p>
                <p className="text-[11px] text-slate-400">
                  Customer chats will be listed here when visitors submit inquiries through JOSAN AI.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                {chatSessions.map((session) => (
                  <div key={session.sessionId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {session.customerName || 'Website Visitor'}
                        </span>
                        {session.customerEmail && (
                          <span className="text-[11px] font-mono text-slate-500">
                            &lt;{session.customerEmail}&gt;
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                          {session.messageCount || 0} msgs
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                          Admin Only
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate font-mono italic">
                        "{session.preview || 'Inquiry regarding air or road freight'}"
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        <span>Session: <code className="font-mono text-slate-600">{session.sessionId}</code></span>
                        <span>&bull;</span>
                        <span>Updated: {new Date(session.updatedAt || session.createdAt).toLocaleString()}</span>
                        <span>&bull;</span>
                        <span className="text-slate-500 font-medium">Purpose: {session.purpose || 'Quote follow-up & support quality'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSingleSession(session.sessionId)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer self-start sm:self-center shrink-0"
                      title="Permanently delete this chat session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
