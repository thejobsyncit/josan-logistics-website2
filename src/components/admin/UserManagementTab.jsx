import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Mail, 
  Lock, 
  KeyRound, 
  LogOut, 
  RotateCcw, 
  Copy, 
  ShieldAlert, 
  History, 
  Clock, 
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  getStoredStaffToken, 
  fetchStaffUsers, 
  inviteStaffMember, 
  toggleStaffStatus, 
  deleteStaffMember, 
  forceStaffPasswordReset, 
  forceStaffLogout, 
  fetchStaffAuditLogs 
} from '../../utils/staffApi';

export const UserManagementTab = () => {
  const { currentUser, showToast } = useLogistics();

  // Active view: 'staff' (Users Page) or 'audit' (Audit Log)
  const [activeSubTab, setActiveSubTab] = useState('staff');
  
  // Staff Users State
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State for Inviting Staff Member
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('CRM Operations'); // 'Admin' | 'CRM Operations' | 'Read-only'
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // Invitation Success Dialog
  const [invitationResult, setInvitationResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Forced Reset Dialog
  const [forcedResetResult, setForcedResetResult] = useState(null);
  const [copiedResetLink, setCopiedResetLink] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');

  // Check if current user is Admin
  const isAdmin = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'admin');

  // Load Staff Users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = getStoredStaffToken();
      const res = await fetchStaffUsers(token);
      if (res && res.users) {
        setStaffUsers(res.users);
      }
    } catch (err) {
      console.warn('[UserManagement] Could not load staff users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load Audit Logs
  const loadAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const token = getStoredStaffToken();
      const res = await fetchStaffAuditLogs(token);
      if (res && res.logs) {
        setAuditLogs(res.logs);
      }
    } catch (err) {
      console.warn('[UserManagement] Could not load audit logs:', err.message);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadAuditLogs();
    }
  }, [isAdmin]);

  // Handle Send Invitation
  const handleSendInvite = async (e) => {
    e.preventDefault();
    setInviteError('');
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Please fill in both name and work email.');
      return;
    }

    setInviteLoading(true);
    try {
      const token = getStoredStaffToken();
      const res = await inviteStaffMember(token, {
        name: inviteName.trim(),
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole
      });

      if (res.success) {
        setIsInviteModalOpen(false);
        setInvitationResult({
          email: inviteEmail.trim().toLowerCase(),
          name: inviteName.trim(),
          role: inviteRole,
          inviteLink: `${window.location.origin}/#staff-setup?token=${res.invitationToken}`,
          expiresAt: res.expiresAt
        });
        setInviteName('');
        setInviteEmail('');
        setInviteRole('CRM Operations');
        if (showToast) showToast('Staff invitation dispatched successfully.', 'success');
        loadUsers();
        loadAuditLogs();
      }
    } catch (err) {
      setInviteError(err.message || 'Failed to dispatch staff invitation.');
    } finally {
      setInviteLoading(false);
    }
  };

  // Handle Toggle Status (Deactivate / Activate)
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Deactivated' : 'Active';
    const confirmMsg = newStatus === 'Deactivated'
      ? `Are you sure you want to deactivate ${user.name}? They will immediately lose access and active sessions will be terminated.`
      : `Activate staff account for ${user.name}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const token = getStoredStaffToken();
      const res = await toggleStaffStatus(token, { userId: user.id, status: newStatus });
      if (res.success) {
        if (showToast) showToast(`Account for ${user.name} set to ${newStatus}.`, 'success');
        loadUsers();
        loadAuditLogs();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Status change failed.', 'error');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Permanently delete staff account for ${user.name} (${user.email})? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = getStoredStaffToken();
      const res = await deleteStaffMember(token, user.id);
      if (res.success) {
        if (showToast) showToast(`Staff member ${user.name} removed.`, 'success');
        loadUsers();
        loadAuditLogs();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete user.', 'error');
    }
  };

  // Handle Force Password Reset
  const handleForcePasswordReset = async (user) => {
    if (!window.confirm(`Force password reset for ${user.name}? All current active sessions will be revoked and a 1-hour reset link generated.`)) {
      return;
    }

    try {
      const token = getStoredStaffToken();
      const res = await forceStaffPasswordReset(token, user.id);
      if (res.success) {
        setForcedResetResult({
          user,
          resetLink: `${window.location.origin}/#staff-reset?token=${res.resetToken}`
        });
        if (showToast) showToast(`Password reset forced for ${user.name}.`, 'warning');
        loadUsers();
        loadAuditLogs();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to force password reset.', 'error');
    }
  };

  // Handle Force Logout
  const handleForceLogout = async (user) => {
    if (!window.confirm(`Terminate all active login sessions for ${user.name}? The user will be required to log in again.`)) {
      return;
    }

    try {
      const token = getStoredStaffToken();
      const res = await forceStaffLogout(token, user.id);
      if (res.success) {
        if (showToast) showToast(`Forced logout applied. ${user.name}'s sessions terminated.`, 'success');
        loadUsers();
        loadAuditLogs();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to force logout.', 'error');
    }
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return staffUsers.filter(u => {
      const q = search.toLowerCase();
      const matchesSearch = 
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' ? true : u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffUsers, search, roleFilter, statusFilter]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const q = auditSearch.toLowerCase();
      const actorStr = typeof log.actor === 'object' ? `${log.actor.name || ''} ${log.actor.email || ''}` : String(log.actor || '');
      return (
        (log.eventType && log.eventType.toLowerCase().includes(q)) ||
        (log.targetUser && log.targetUser.toLowerCase().includes(q)) ||
        actorStr.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q))
      );
    });
  }, [auditLogs, auditSearch]);

  // Format Date helper
  const formatDate = (isoString) => {
    if (!isoString) return 'Never logged in';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Strict Admin Gate: visible to admins only
  if (!isAdmin) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-red-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Restricted Access - Administrators Only</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          You do not have administrative privileges to manage staff accounts or review system security audit records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-orange-100 text-[#FF6B00] font-bold text-xs uppercase tracking-wider">
              Admin Governance
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Staff Account Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-7 h-7 text-[#FF6B00]" />
            <span>Staff Users &amp; Access Control</span>
          </h1>
          <p className="text-xs text-slate-500">
            Provision staff invitations (48h expiry), enforce Two-Factor Authentication, execute forced logouts, and inspect security audit records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              loadUsers();
              loadAuditLogs();
            }}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation: Staff Users vs Security Audit Log */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'staff'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Directory ({staffUsers.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('audit');
            loadAuditLogs();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'audit'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: STAFF DIRECTORY */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              {/* Role Filter */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                <span>Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="CRM Operations">CRM Operations</option>
                  <option value="Read-only">Read-only</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">2FA Security</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading && staffUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                        <span>Loading staff directory...</span>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No staff members found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isCurrentAdmin = user.email.toLowerCase() === currentUser?.email?.toLowerCase();
                      
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                          
                          {/* Name & Email */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-inner">
                                {(user.name || 'S').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                                  <span>{user.name}</span>
                                  {isCurrentAdmin && (
                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              user.role === 'Admin'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : user.role === 'CRM Operations'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              user.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{user.status}</span>
                            </span>
                          </td>

                          {/* 2FA */}
                          <td className="py-3.5 px-4">
                            {user.twoFactorConfirmed ? (
                              <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>2FA Enabled</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-amber-600 font-bold text-[11px]">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Pending Setup</span>
                              </span>
                            )}
                            {user.mustChangePassword && (
                              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                                • Password change required
                              </div>
                            )}
                          </td>

                          {/* Last Login Time */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-700 font-medium text-[11px] flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{formatDate(user.lastLoginAt)}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              
                              {/* Force Logout */}
                              <button
                                onClick={() => handleForceLogout(user)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                title="Force Logout (Invalidate Active Sessions)"
                              >
                                <LogOut className="w-4 h-4" />
                              </button>

                              {/* Force Password Reset */}
                              <button
                                onClick={() => handleForcePasswordReset(user)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                                title="Force Password Reset (1-Hour Link)"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>

                              {/* Deactivate / Activate */}
                              {!isCurrentAdmin && (
                                <button
                                  onClick={() => handleToggleStatus(user)}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    user.status === 'Active'
                                      ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                                      : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                  title={user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                                >
                                  {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                </button>
                              )}

                              {/* Delete */}
                              {!isCurrentAdmin && (
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Permanently Delete Staff Member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SECURITY AUDIT LOG (Requirement 7) */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search audit records by event, email, or details..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredAuditLogs.length} audit event{filteredAuditLogs.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Target User</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {auditLoading && auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                        <span>Loading audit logs...</span>
                      </td>
                    </tr>
                  ) : filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => {
                      const actorDisplay = typeof log.actor === 'object' ? `${log.actor.name || log.actor.email} (${log.actor.role || 'Staff'})` : String(log.actor || 'System');
                      
                      const isAlert = log.eventType === 'FAILED_LOGIN_ALERT' || log.eventType === 'LOGIN_FAILED';
                      
                      return (
                        <tr key={log.id} className={`hover:bg-slate-50/70 transition-colors ${isAlert ? 'bg-red-50/40' : ''}`}>
                          <td className="py-3 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                            {formatDate(log.timestamp)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.eventType === 'LOGIN_SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                              log.eventType === 'LOGIN_FAILED' ? 'bg-red-100 text-red-800' :
                              log.eventType === 'FAILED_LOGIN_ALERT' ? 'bg-red-600 text-white animate-pulse' :
                              log.eventType === 'USER_INVITED' ? 'bg-blue-100 text-blue-800' :
                              log.eventType === 'ACCOUNT_CREATED' ? 'bg-purple-100 text-purple-800' :
                              log.eventType === 'FORCED_LOGOUT' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {log.eventType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-800 font-sans text-xs">
                            {actorDisplay}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {log.targetUser || '—'}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {log.ip || '127.0.0.1'}
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-sans text-xs">
                            {log.details}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STAFF MEMBER / INVITATION (48-HOUR ONE-TIME LINK) */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Add Staff Member</h3>
                  <p className="text-[11px] text-slate-300">Generates a one-time 48-hour invitation link</p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSendInvite} className="p-6 space-y-4">
              
              {inviteError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Staff Member Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jessica Tan"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Corporate Work Email</label>
                <input
                  type="email"
                  placeholder="jessica.tan@josanlogistics.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Role Selector: Exactly the 3 required options */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Staff Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="Admin">Admin (Full administrative &amp; user management governance)</option>
                  <option value="CRM Operations">CRM Operations (Logistics, dispatch, quotes, tracking)</option>
                  <option value="Read-only">Read-only (Inspection &amp; audit visibility only)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Role permissions are strictly enforced on the server for all pages and actions.
                </p>
              </div>

              {/* Security Policy Reminder */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                  <span>Credential Security Policy</span>
                </div>
                <p>
                  No passwords are transmitted via email. The staff member will receive a secure one-time link (expires in 48 hours) to configure their own 12+ character password and authenticator app (2FA).
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
                >
                  {inviteLoading ? (
                    <span>Issuing Link...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Issue 48-Hour Invitation</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: INVITATION GENERATED (SUCCESS) */}
      {invitationResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Staff Invitation Link Generated</h3>
                <p className="text-xs text-slate-500">One-time registration link • Valid for 48 hours</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Recipient:</span>
                <span className="font-bold text-slate-900">{invitationResult.name} ({invitationResult.email})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Role:</span>
                <span className="font-bold text-orange-600">{invitationResult.role}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Link Expiration:</span>
                <span className="font-mono text-slate-700">{formatDate(invitationResult.expiresAt)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">One-Time Invitation Link:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={invitationResult.inviteLink}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 select-all focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(invitationResult.inviteLink);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 3000);
                  }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Transmit this link securely to the staff member. When opened, the portal will guide them to set a 12+ character password and pair their authenticator app. The link expires automatically in 48 hours.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInvitationResult(null)}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORCED RESET GENERATED (1-HOUR LINK) */}
      {forcedResetResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Password Reset Forced</h3>
                <p className="text-xs text-slate-500">Active sessions revoked • 1-Hour Reset Link Generated</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              A mandatory password reset has been triggered for <strong>{forcedResetResult.user.name}</strong> ({forcedResetResult.user.email}). All active sessions for this account have been terminated on the server.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">1-Hour Password Reset Link:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={forcedResetResult.resetLink}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 select-all focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(forcedResetResult.resetLink);
                    setCopiedResetLink(true);
                    setTimeout(() => setCopiedResetLink(false), 3000);
                  }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedResetLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedResetLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setForcedResetResult(null)}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
