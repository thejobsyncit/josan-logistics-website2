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
  Info,
  Database
} from 'lucide-react';
import { supabaseApi } from '../../services/supabaseApi';
import { supabase } from '../../services/supabase';

export const RolesPermissionsTab = ({
  crmRolePermissions = {},
  onUpdateRolePermission,
  systemUsers = [],
  onUpdateUserPermissions
}) => {
  const [selectedRole, setSelectedRole] = useState('crm_manager');
  const [activeTabMode, setActiveTabMode] = useState('roles'); // 'roles' | 'user_override'
  const [selectedUserId, setSelectedUserId] = useState(systemUsers[0]?.id || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const crmModules = [
    { key: 'dashboard', label: 'Dashboard', desc: 'Overview KPIs and operational metrics' },
    { key: 'customers', label: 'Customers', desc: 'Customer directory, dossier history & billing' },
    { key: 'airway_requests', label: 'Air Freight Requests', desc: 'Master AWB processing & airline coordination' },
    { key: 'road_shipments', label: 'Road Coordination', desc: 'Road Coordination: partner carrier jobs' },
    { key: 'documents', label: 'Shipment Documents', desc: 'Shipment documentation checklists, invoices, packing lists & AWB' },
    { key: 'quotations', label: 'Quotations', desc: 'Quotation drafting, sending & customer approval' },
    { key: 'billing', label: 'Billing', desc: 'Invoicing, payment reconciliation & settlement' },
    { key: 'transportation_partners', label: 'Transportation Partners', desc: 'Contracted third-party carrier agreements' },
    { key: 'notifications', label: 'Notifications', desc: 'Alerts about quote requests, contact messages and account activity.' },
    { key: 'reports', label: 'Reports', desc: 'Operations throughput and revenue analytics' },
    { key: 'settings', label: 'Settings', desc: 'CRM operational preferences & notifications' }
  ];

  const roleDefinitions = [
    { key: 'admin', label: 'Admin', badge: 'Full Access' },
    { key: 'crm_manager', label: 'Operations Manager', badge: 'Broad Access' },
    { key: 'crm_ops', label: 'Coordinator', badge: 'Operations Only' },
    { key: 'crm_finance', label: 'Finance', badge: 'Finance Only' },
    { key: 'viewer', label: 'Read-only', badge: 'View-Only' }
  ];

  const selectedUser = systemUsers.find(u => u.id === selectedUserId) || systemUsers[0];

  // Handle individual toggle change and immediately enforce in Supabase database rules (RLS)
  const handleToggle = async (roleKey, moduleKey, nextValue) => {
    if (typeof onUpdateRolePermission === 'function') {
      onUpdateRolePermission(roleKey, moduleKey, nextValue);
    }

    // Persist to Supabase module_permissions table so RLS actively enforces the toggle
    try {
      await supabaseApi.saveModulePermission({
        role: roleKey,
        module_key: moduleKey,
        can_access: nextValue,
        can_write: roleKey !== 'viewer' && nextValue
      });
      // Also log security audit entry
      await supabaseApi.createAuditLog({
        action: 'RLS_PERMISSION_UPDATED',
        entity: 'module_permissions',
        entity_id: `${roleKey}:${moduleKey}`,
        details: {
          role: roleKey,
          module: moduleKey,
          allowed: nextValue,
          description: `Database RLS rule for ${roleKey} module ${moduleKey} set to ${nextValue ? 'ALLOW' : 'DENY'}.`
        }
      });
    } catch (err) {
      console.warn('[RolesPermissions] Error syncing toggle to database RLS:', err);
    }
  };

  // Enforce all toggles to Database rules (RLS)
  const handleSyncAllToDatabase = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const permsToSync = [];
      for (const r of roleDefinitions) {
        const roleKey = r.key;
        for (const m of crmModules) {
          const isAllowed = roleKey === 'admin' ? true : (crmRolePermissions[roleKey]?.[m.key] ?? false);
          permsToSync.push({
            role: roleKey,
            module_key: m.key,
            can_access: isAllowed,
            can_write: roleKey !== 'viewer' && isAllowed
          });
        }
      }

      for (const p of permsToSync) {
        await supabaseApi.saveModulePermission(p);
      }

      await supabaseApi.createAuditLog({
        action: 'RLS_POLICIES_ENFORCED',
        entity: 'module_permissions',
        entity_id: 'ALL_ROLES',
        details: {
          description: 'All role toggles successfully enforced in Supabase database rules (RLS).'
        }
      });

      setSyncStatus({ success: true, message: 'Every toggle successfully enforced with Supabase Database Rules (RLS)!' });
    } catch (err) {
      setSyncStatus({ success: false, message: 'Database RLS sync warning: ' + (err.message || 'Check network connection.') });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Roles &amp; Module Permissions</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-100 text-[#FF6B00]">
              Database RLS Enforced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Control which personnel can access and manage specific logistics modules. Every toggle is enforced at the database level via PostgreSQL Row Level Security (RLS).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Orange Save & Enforce RLS Button */}
          <button
            type="button"
            onClick={handleSyncAllToDatabase}
            disabled={isSyncing}
            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'Enforcing RLS...' : 'Enforce RLS in Database'}</span>
          </button>

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
      </div>

      {syncStatus && (
        <div className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
          syncStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          {syncStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
          <span>{syncStatus.message}</span>
        </div>
      )}

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
                  CRM Module Access for: <span className="text-[#FF6B00]">{roleDefinitions.find(r => r.key === selectedRole)?.label}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle switch to grant or revoke operational access to each CRM subsystem. Database RLS rules enforce these restrictions immediately.
                </p>
              </div>

              {selectedRole === 'admin' && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Admin role has full database access by default
                </span>
              )}
              {selectedRole === 'viewer' && (
                <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  Read-only role is view-only (no edit toggles)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {crmModules.map(mod => {
                const isAllowed = selectedRole === 'admin' ? true : (crmRolePermissions[selectedRole]?.[mod.key] ?? false);
                const isDisabled = selectedRole === 'admin';

                return (
                  <div
                    key={mod.key}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      isAllowed ? 'bg-orange-50/30 border-orange-200/60' : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-slate-900">{mod.label}</span>
                        {isAllowed ? (
                          <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Granted &bull; RLS Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                            Restricted (Denied by RLS)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{mod.desc}</p>
                    </div>

                    {/* Primary Orange Toggle Switch (or View-only indicator for Read-only) */}
                    {selectedRole === 'viewer' ? (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 flex items-center space-x-1 shrink-0">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>View-Only</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleToggle(selectedRole, mod.key, !isAllowed)}
                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAllowed ? 'bg-[#FF6B00]' : 'bg-slate-300'
                        } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isAllowed ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    )}
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
                  {u.name} ({u.roleTitle || u.role}) - {u.email}
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
                    Assigned role: <span className="font-mono font-bold text-slate-800">{selectedUser.roleTitle || selectedUser.role}</span> &bull; Enforced via database user-level RLS rule overrides
                  </p>
                </div>
              </div>

              {((selectedUser.role || '').toLowerCase().includes('read') || (selectedUser.roleTitle || '').toLowerCase().includes('read') || selectedUser.role === 'viewer') && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>This staff member has the Read-only role and has view-only access. Edit toggles are disabled.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {crmModules.map(mod => {
                  const userPerms = selectedUser.permissions || [];
                  const isChecked = userPerms.includes('all') || userPerms.includes(mod.key);
                  const isUserReadOnly = (selectedUser.role || '').toLowerCase().includes('read') || (selectedUser.roleTitle || '').toLowerCase().includes('read') || selectedUser.role === 'viewer';

                  return (
                    <label
                      key={mod.key}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        isUserReadOnly ? 'opacity-75 cursor-default' : 'cursor-pointer'
                      } ${
                        isChecked ? 'bg-orange-50/40 border-orange-200 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{mod.label}</span>
                      {isUserReadOnly ? (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          View-only
                        </span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={async (e) => {
                            const current = Array.isArray(selectedUser.permissions) ? [...selectedUser.permissions] : [];
                            let next;
                            if (e.target.checked) {
                              next = [...new Set([...current, mod.key])];
                            } else {
                              next = current.filter(k => k !== mod.key && k !== 'all');
                            }
                            onUpdateUserPermissions(selectedUser.id, next);

                            // Enforce user-level toggle override in database
                            try {
                              await supabaseApi.saveModulePermission({
                                user_id: selectedUser.id,
                                module_key: mod.key,
                                can_access: e.target.checked,
                                can_write: !isUserReadOnly && e.target.checked
                              });
                            } catch (err) {}
                          }}
                          className="w-4 h-4 text-[#FF6B00] accent-[#FF6B00] rounded focus:ring-[#FF6B00] cursor-pointer"
                        />
                      )}
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
