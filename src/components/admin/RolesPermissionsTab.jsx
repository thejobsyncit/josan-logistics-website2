import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Save, 
  User, 
  Check, 
  X,
  Sparkles,
  Info
} from 'lucide-react';

export const RolesPermissionsTab = ({
  crmRolePermissions = {},
  onUpdateRolePermission,
  systemUsers = [],
  onUpdateUserPermissions
}) => {
  const [selectedRole, setSelectedRole] = useState('crm_manager');
  const [activeTabMode, setActiveTabMode] = useState('roles'); // 'roles' | 'user_override'
  const [selectedUserId, setSelectedUserId] = useState(systemUsers[0]?.id || '');

  const crmModules = [
    { key: 'dashboard', label: 'Dashboard', desc: 'Overview KPIs and operational metrics' },
    { key: 'customers', label: 'Customers', desc: 'Customer directory, dossier history & billing' },
    { key: 'airway_requests', label: 'Airway Requests', desc: 'Master AWB processing & airline coordination' },
    { key: 'road_shipments', label: 'Road Shipments', desc: 'Commercial linehaul trucking & haulage dispatches' },
    { key: 'cargo_pricing', label: 'Cargo & Pricing', desc: 'Configure product types, price/KG and tiered slabs' },
    { key: 'documents', label: 'Documents', desc: 'TradeNet permits, invoices, packing lists & AWB' },
    { key: 'quotations', label: 'Quotations', desc: 'Quotation drafting, sending & customer approval' },
    { key: 'billing', label: 'Billing', desc: 'Invoicing, payment reconciliation & settlement' },
    { key: 'transportation_partners', label: 'Transportation Partners', desc: 'Contracted third-party carrier agreements' },
    { key: 'notifications', label: 'Notifications', desc: 'Operational alerts & customer milestones' },
    { key: 'reports', label: 'Reports', desc: 'Operations throughput and revenue analytics' },
    { key: 'settings', label: 'Settings', desc: 'CRM operational preferences & notifications' }
  ];

  const roleDefinitions = [
    { key: 'admin', label: 'Chief Administrator', badge: 'Full Access' },
    { key: 'crm_manager', label: 'CRM Operations Lead', badge: 'Broad Access' },
    { key: 'crm_ops', label: 'Logistics Dispatcher', badge: 'Operations Only' },
    { key: 'crm_finance', label: 'Billing & Commercial', badge: 'Finance Only' },
    { key: 'viewer', label: 'Observer / Read-Only', badge: 'Auditor' }
  ];

  const selectedUser = systemUsers.find(u => u.id === selectedUserId) || systemUsers[0];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Roles & CRM Module Permissions</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
              RBAC Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Control which personnel can access and manage specific logistics modules inside the separate /crm portal.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTabMode('roles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTabMode === 'roles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Role-Based Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTabMode('user_override')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTabMode === 'user_override' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Custom Overrides
          </button>
        </div>
      </div>

      {/* MODE 1: ROLE MATRIX */}
      {activeTabMode === 'roles' && (
        <div className="space-y-6">
          {/* Role selector pills */}
          <div className="flex flex-wrap gap-2">
            {roleDefinitions.map(r => {
              const isSelected = selectedRole === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setSelectedRole(r.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {r.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Module permissions checklist for active role */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  CRM Module Access for: <span className="text-[#2463EB]">{roleDefinitions.find(r => r.key === selectedRole)?.label}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle switch to grant or revoke operational access to each CRM subsystem.
                </p>
              </div>

              {selectedRole === 'admin' && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Admin role has full access by default
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {crmModules.map(mod => {
                const isAllowed = crmRolePermissions[selectedRole]?.[mod.key] ?? false;
                const isDisabled = selectedRole === 'admin';

                return (
                  <div
                    key={mod.key}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      isAllowed ? 'bg-[#EAF2FF]/40 border-[#DCE5F0]' : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-slate-900">{mod.label}</span>
                        {isAllowed ? (
                          <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Granted
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                            Restricted
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{mod.desc}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => onUpdateRolePermission(selectedRole, mod.key, !isAllowed)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isAllowed ? 'bg-[#2463EB]' : 'bg-slate-300'
                      } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isAllowed ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: USER OVERRIDES */}
      {activeTabMode === 'user_override' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-700">Select Specific User Account</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full max-w-md px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {systemUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role}) - {u.email}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Individual Permissions for {selectedUser.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Default role: <span className="font-mono font-bold text-slate-800">{selectedUser.role}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {crmModules.map(mod => {
                  const userPerms = selectedUser.permissions || [];
                  const isChecked = userPerms.includes('all') || userPerms.includes(mod.key);

                  return (
                    <label
                      key={mod.key}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-[#EAF2FF]/50 border-[#DCE5F0] text-[#2463EB]-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{mod.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const current = Array.isArray(selectedUser.permissions) ? [...selectedUser.permissions] : [];
                          let next;
                          if (e.target.checked) {
                            next = [...new Set([...current, mod.key])];
                          } else {
                            next = current.filter(k => k !== mod.key && k !== 'all');
                          }
                          onUpdateUserPermissions(selectedUser.id, next);
                        }}
                        className="w-4 h-4 text-[#2463EB] rounded focus:ring-[#2463EB] cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
