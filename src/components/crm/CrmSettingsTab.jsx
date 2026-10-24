import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plane, 
  Truck, 
  FileText, 
  Bell, 
  User, 
  Save,
  Info
} from 'lucide-react';

export const CrmSettingsTab = ({
  currentUser,
  showToast
}) => {
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Josan Logistics Pte Ltd',
    uen: '202412345K',
    gstReg: 'M90384721',
    address: '1 Freight Close, Changi Air Cargo Complex, Singapore 819830',
    opsPhone: '+65 6789 0123',
    opsEmail: 'ops@josanlogistics.com',
    crmSupportEmail: 'crm@josanlogistics.com',
    currency: 'SGD (S$)',
    gstRate: 9
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnAirwayIntake: true,
    emailOnQuoteAccepted: true,
    smsOnPartnerAssigned: true,
    alertOnDocumentUploaded: true,
    dailySummaryReport: true
  });

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (showToast) showToast('Company profile and CRM settings saved!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <h2 className="text-xl font-black text-slate-900 font-heading">CRM Configuration & Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage company operational identity, service portfolio boundaries, notification triggers, and compliance parameters.
        </p>
      </div>

      {/* Strict Compliance Statement (Prominently displaying Business Model boundaries) */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0B1F5B] text-white p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Logistics Business Model & Compliance Mandate</h3>
            <p className="text-[11px] text-slate-400">Josan Logistics operating scope and SLA integrity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="font-extrabold text-[#2463EB] block text-[11px] uppercase tracking-wider">
              Core Approved Service Offerings:
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li>✓ <strong>Air Freight Services:</strong> AWB Preparation, AWB Billing, Shipment Documentation, Transportation Support.</li>
              <li>✓ <strong>Road Transportation:</strong> Commercial transport of goods through audited transportation arrangements/partners.</li>
              <li>✓ <strong>Documentation:</strong> Shipment documentation and customs-related documentation clearance support.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="font-extrabold text-amber-400 block text-[11px] uppercase tracking-wider">
              Strict Non-Operation Exclusions:
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li>✕ No warehouse management operations</li>
              <li>✕ No aircraft management or ownership</li>
              <li>✕ No airline operations</li>
              <li>✕ No airport terminal management</li>
              <li>✕ Do not claim company-owned fleet</li>
              <li>✕ Do not create fake live tracking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Company Profile Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Operating Entity Profile</h3>
          <p className="text-xs text-slate-500">Corporate details printed on quotations, bills, and documents</p>
        </div>

        <form onSubmit={handleSaveCompany} className="space-y-4 text-xs font-bold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 block mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1">UEN Registration Number</label>
              <input
                type="text"
                value={companySettings.uen}
                onChange={(e) => setCompanySettings({ ...companySettings, uen: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 block mb-1">GST Tax Reg. No.</label>
              <input
                type="text"
                value={companySettings.gstReg}
                onChange={(e) => setCompanySettings({ ...companySettings, gstReg: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1">Singapore GST Rate (%)</label>
              <input
                type="number"
                value={companySettings.gstRate}
                onChange={(e) => setCompanySettings({ ...companySettings, gstRate: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 block mb-1">Registered Operational Address</label>
            <input
              type="text"
              value={companySettings.address}
              onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 block mb-1">Operations Contact Number</label>
              <input
                type="tel"
                value={companySettings.opsPhone}
                onChange={(e) => setCompanySettings({ ...companySettings, opsPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1">CRM Operations Email</label>
              <input
                type="email"
                value={companySettings.crmSupportEmail}
                onChange={(e) => setCompanySettings({ ...companySettings, crmSupportEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Company Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Operational Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4 text-xs font-bold">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Automated Alerts & Dispatch Triggers</h3>
          <p className="text-slate-500 font-medium">Configure real-time notification dispatches to operators</p>
        </div>

        <div className="space-y-3">
          {[
            { id: 'emailOnAirwayIntake', title: 'New Airway Service Intake', desc: 'Notify operations desk immediately when a customer submits Request Airway Service.' },
            { id: 'emailOnQuoteAccepted', title: 'Customer Quotation Approval', desc: 'Alert account managers when a proposal is accepted by shipper.' },
            { id: 'smsOnPartnerAssigned', title: 'Road Partner Dispatch Alert', desc: 'Notify transportation partners upon road haulage consignment assignment.' },
            { id: 'alertOnDocumentUploaded', title: 'Document Vault Clearance Audit', desc: 'Queue compliance officer review upon document upload.' }
          ].map((item) => (
            <label key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings[item.id]}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.id]: e.target.checked })}
                className="accent-[#2463EB] rounded mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 block">{item.title}</span>
                <span className="text-slate-500 font-medium text-[11px] block">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
