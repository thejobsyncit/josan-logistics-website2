import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Mail, 
  Phone, 
  Building2, 
  Lock,
  Sparkles
} from 'lucide-react';

export const UserManagementTab = ({
  systemUsers = [],
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToggleStatus
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'crm_ops',
    roleTitle: '',
    status: 'Active'
  });

  const roleDefinitions = [
    { key: 'admin', label: 'Admin (System Administrator)', title: 'Chief Administrator' },
    { key: 'crm_manager', label: 'CRM Operations Manager', title: 'CRM Operations Lead' },
    { key: 'crm_ops', label: 'CRM Logistics Dispatcher', title: 'Logistics Dispatch Coordinator' },
    { key: 'crm_finance', label: 'CRM Finance & Billing', title: 'Billing & Commercial Accounts' },
    { key: 'customer', label: 'Customer Client Portal', title: 'Enterprise Client Contact' }
  ];

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return systemUsers.filter(u => {
      const q = search.toLowerCase();
      const matchesSearch = 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.company && u.company.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' ? true : u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [systemUsers, search, roleFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '+65 ',
      company: 'Josan Logistics Operations',
      role: 'crm_ops',
      roleTitle: 'Logistics Dispatch Coordinator',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      company: user.company || '',
      role: user.role || 'crm_ops',
      roleTitle: user.roleTitle || '',
      status: user.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleRoleChange = (selectedRole) => {
    const matched = roleDefinitions.find(r => r.key === selectedRole);
    setFormData(prev => ({
      ...prev,
      role: selectedRole,
      roleTitle: matched ? matched.title : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      role: formData.role,
      roleTitle: formData.roleTitle.trim() || (roleDefinitions.find(r => r.key === formData.role)?.title || 'Team Member'),
      status: formData.status
    };

    if (editingUser) {
      onUpdateUser(editingUser.id, payload);
    } else {
      onAddUser(payload);
    }

    setIsModalOpen(false);
  };

  // Metrics
  const totalCount = systemUsers.length;
  const activeCount = systemUsers.filter(u => u.status === 'Active').length;
  const adminCount = systemUsers.filter(u => u.role === 'admin').length;
  const crmStaffCount = systemUsers.filter(u => u.role?.startsWith('crm')).length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">User Management & Accounts</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-700">
              {totalCount} Total Users
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage system administrators, CRM operations staff, account statuses, and platform access.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add System User</span>
        </button>
      </div>

      {/* 2. Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Registered</p>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Active Accounts</p>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-purple-600">System Admins</p>
          <p className="text-2xl font-black text-purple-600 font-mono mt-0.5">{adminCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">CRM Operations Staff</p>
          <p className="text-2xl font-black text-blue-600 font-mono mt-0.5">{crmStaffCount}</p>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, company..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="crm_manager">CRM Managers</option>
            <option value="crm_ops">CRM Dispatchers</option>
            <option value="crm_finance">CRM Finance</option>
            <option value="customer">Customer Accounts</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
            <option value="Suspended">Suspended</option>
          </select>

          {(search || roleFilter !== 'All' || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 4. Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User & Contact</th>
                <th className="p-4">Role & Designation</th>
                <th className="p-4">Organization / Department</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-center">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    No system users found matching the query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-xs font-mono uppercase shrink-0">
                          {user.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          {user.phone && <div className="text-[10px] text-slate-400">{user.phone}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : user.role?.startsWith('crm')
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">{user.roleTitle || 'Authorized User'}</p>
                    </td>

                    {/* Organization */}
                    <td className="p-4">
                      <span className="text-slate-800 font-bold block">{user.company || 'Josan Logistics'}</span>
                      <span className="text-[10px] text-slate-400">Singapore Commercial Team</span>
                    </td>

                    {/* Last Activity */}
                    <td className="p-4 font-mono text-[11px] text-slate-600">
                      {user.lastLogin || 'Recent'}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(user.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          user.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        {user.status || 'Active'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#2463EB] hover:bg-[#EAF2FF] transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete user ${user.name}?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-heading">
                  {editingUser ? 'Edit User Account' : 'Add New System User'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure role assignment and access permissions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Darren Josan"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. user@josanlogistics.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+65 9123 4567"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Organization / Department</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Josan Operations Hub"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB] cursor-pointer"
                  >
                    {roleDefinitions.map(r => (
                      <option key={r.key} value={r.key}>{r.label.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB] cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
