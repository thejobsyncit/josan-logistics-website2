import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  X
} from 'lucide-react';

/**
 * Calculates correct invoice total (Subtotal + 9% GST) consistently
 */
export const getInvoiceTotal = (inv) => {
  if (!inv) return 0;
  if (inv.total !== undefined && inv.total !== null && !isNaN(Number(inv.total))) {
    return Number(inv.total);
  }
  const base = Number(inv.subtotal || inv.amount || 0);
  return Number((base * 1.09).toFixed(2));
};

/**
 * Clean text helper for entity and company name matching
 */
const cleanText = (str) => {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/\b(pte\.?|ltd\.?|inc\.?|llc|corp\.?|co\.?)\b/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
};

/**
 * Soft string match helper for company and customer names
 */
const stringMatch = (a, b) => {
  if (!a || !b) return false;
  const cleanA = cleanText(a);
  const cleanB = cleanText(b);
  if (!cleanA || !cleanB) return false;
  if (cleanA === cleanB) return true;
  if (cleanA.length >= 4 && cleanB.length >= 4) {
    if (cleanA.includes(cleanB) || cleanB.includes(cleanA)) return true;
  }
  return false;
};

export const CrmCustomersTab = ({
  customers = [],
  airwayRequests = [],
  shipments = [],
  documents = [],
  invoices = [],
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  selectedCustomerFromSearch = null
}) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(selectedCustomerFromSearch);
  const [customerModalTab, setCustomerModalTab] = useState('overview'); // overview, airway, road, docs, billing, notes
  const [notesSavedFeedback, setNotesSavedFeedback] = useState(false);

  // Sync selectedCustomerFromSearch whenever the prop changes
  useEffect(() => {
    if (selectedCustomerFromSearch) {
      setViewingCustomer(selectedCustomerFromSearch);
      setCustomerModalTab('overview');
    }
  }, [selectedCustomerFromSearch]);

  // Sync viewing customer when parent customers array updates
  useEffect(() => {
    if (viewingCustomer) {
      const fresh = customers.find(c => c.id === viewingCustomer.id);
      if (fresh) {
        setViewingCustomer(fresh);
      }
    }
  }, [customers]);

  // New customer form state
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    tier: 'Standard Corporate',
    creditLimit: 'S$ 30,000',
    paymentTerms: 'Net 30 Days',
    notes: '',
    status: 'Active'
  });

  // Filter logic
  const filteredCustomers = customers.filter(c => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term ||
      c.name?.toLowerCase().includes(term) ||
      c.company?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term) ||
      c.address?.toLowerCase().includes(term);

    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCustomers = filteredCustomers.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  // Keep pagination bounded when customer data or filters change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  /**
   * Helper to retrieve related data for a customer reliably
   */
  const getCustomerRelations = (cust) => {
    if (!cust) return { airway: [], road: [], docs: [], invs: [], totalSpent: 0 };
    
    const custId = cust.id ? String(cust.id).trim().toLowerCase() : '';
    const custEmail = cust.email ? cust.email.trim().toLowerCase() : '';
    const custName = cust.name ? cust.name.trim() : '';
    const custCompany = cust.company ? cust.company.trim() : '';

    const matchesThisCustomer = (entityId, entityEmail, entityName, entityCompany) => {
      if (custId && entityId && String(entityId).trim().toLowerCase() === custId) return true;
      if (custEmail && entityEmail && entityEmail.trim().toLowerCase() === custEmail) return true;
      if (custCompany && (stringMatch(entityCompany, custCompany) || stringMatch(entityName, custCompany))) return true;
      if (custName && (stringMatch(entityName, custName) || stringMatch(entityCompany, custName))) return true;
      return false;
    };

    // 1. Airway Requests
    const airway = airwayRequests.filter(r => 
      matchesThisCustomer(r.customerId, r.email, r.customerName, r.company)
    );

    // 2. Road Shipments
    const road = shipments.filter(s => 
      matchesThisCustomer(s.customerId, s.customerEmail || s.senderEmail, s.customerName || s.sender, s.company)
    );

    // Map all linked consignment / airway request IDs for cross-referencing documents and invoices
    const linkedRefIds = new Set([
      ...road.map(s => s.id?.trim().toUpperCase()).filter(Boolean),
      ...airway.map(a => a.id?.trim().toUpperCase()).filter(Boolean)
    ]);

    // 3. Documents
    const docs = documents.filter(d => {
      const refId = (d.shipmentId || d.requestId)?.trim().toUpperCase();
      if (refId && linkedRefIds.has(refId)) return true;
      return matchesThisCustomer(d.customerId, d.customerEmail, d.customerName, d.company);
    });

    // 4. Invoices
    const invs = invoices.filter(i => {
      const refId = (i.shipmentId || i.requestId)?.trim().toUpperCase();
      if (refId && linkedRefIds.has(refId)) return true;
      return matchesThisCustomer(i.customerId, i.customerEmail, i.customerName, i.company);
    });

    // 5. Total Spent (sum of paid invoices with accurate totals)
    const totalSpent = invs
      .filter(i => (i.paymentStatus || '').toLowerCase() === 'paid')
      .reduce((sum, i) => sum + getInvoiceTotal(i), 0);

    return { airway, road, docs, invs, totalSpent };
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const name = newCustomerData.name?.trim();
    const email = newCustomerData.email?.trim();
    if (!name || !email) return;

    const company = (newCustomerData.company || name).trim();
    const newCust = {
      ...newCustomerData,
      name,
      company,
      email,
      phone: newCustomerData.phone?.trim() || '',
      address: newCustomerData.address?.trim() || '',
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    if (onAddCustomer) {
      onAddCustomer(newCust);
    }

    setIsAddModalOpen(false);
    setNewCustomerData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      tier: 'Standard Corporate',
      creditLimit: 'S$ 30,000',
      paymentTerms: 'Net 30 Days',
      notes: '',
      status: 'Active'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    const name = editingCustomer.name?.trim();
    const email = editingCustomer.email?.trim();
    if (!name || !email) return;

    const updatedData = {
      ...editingCustomer,
      name,
      company: (editingCustomer.company || name).trim(),
      email,
      phone: editingCustomer.phone?.trim() || '',
      address: editingCustomer.address?.trim() || ''
    };

    if (onUpdateCustomer) {
      onUpdateCustomer(editingCustomer.id, updatedData);
    }
    if (viewingCustomer && viewingCustomer.id === editingCustomer.id) {
      setViewingCustomer(updatedData);
    }
    setEditingCustomer(null);
  };

  const handleArchiveCustomer = (cust) => {
    if (!cust) return;
    const label = cust.company || cust.name || cust.id;
    if (window.confirm(`Archive customer account "${label}"?`)) {
      if (onDeleteCustomer) {
        onDeleteCustomer(cust.id);
      }
      if (viewingCustomer && viewingCustomer.id === cust.id) {
        setViewingCustomer(null);
      }
    }
  };

  const handleSaveNotes = () => {
    if (!viewingCustomer) return;
    if (onUpdateCustomer) {
      onUpdateCustomer(viewingCustomer.id, { notes: viewingCustomer.notes || '' });
    }
    setNotesSavedFeedback(true);
    setTimeout(() => setNotesSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-heading">Corporate Customer Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage shipper corporate accounts, track linked airway requests, road transport bookings, document vault, and billing history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by customer name, company, email, phone, or address..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={tierFilter}
            onChange={(e) => { setTierFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Account Tiers</option>
            <option value="Enterprise Key Account">Enterprise Key Account</option>
            <option value="Standard Corporate">Standard Corporate</option>
            <option value="GDP Certified Medical Shipper">GDP Certified Medical Shipper</option>
            <option value="Aviation Express Client">Aviation Express Client</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(search || tierFilter !== 'All' || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setTierFilter('All'); setStatusFilter('All'); setCurrentPage(1); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Customers Table View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Customer & Company</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Account Tier</th>
                <th className="p-4 text-center">Airway Req.</th>
                <th className="p-4 text-center">Road Shipments</th>
                <th className="p-4 text-center">Docs</th>
                <th className="p-4">Billing History</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 font-medium">
                    No customer accounts match your search filters.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cust) => {
                  const relations = getCustomerRelations(cust);

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Company */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                            {cust.company?.charAt(0).toUpperCase() || cust.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div className="leading-tight">
                            <p className="font-extrabold text-slate-900 text-xs hover:text-[#2463EB] cursor-pointer" onClick={() => setViewingCustomer(cust)}>
                              {cust.company || cust.name}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{cust.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">#{cust.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-4 text-slate-600">
                        <p className="flex items-center space-x-1.5 text-[11px] truncate max-w-[200px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{cust.email}</span>
                        </p>
                        <p className="flex items-center space-x-1.5 text-[11px] mt-1 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{cust.phone || '—'}</span>
                        </p>
                      </td>

                      {/* Tier & Status */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px] border border-slate-200 block w-fit">
                          {cust.tier || 'Standard Corporate'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">
                          Terms: {cust.paymentTerms || 'Net 30'}
                        </span>
                      </td>

                      {/* Airway Requests count */}
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-[#EAF2FF] text-[#0B1F5B] font-mono font-bold rounded-lg border border-[#DCE5F0] text-xs">
                          {relations.airway.length}
                        </span>
                      </td>

                      {/* Road Shipments count */}
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-mono font-bold rounded-lg border border-emerald-200 text-xs">
                          {relations.road.length}
                        </span>
                      </td>

                      {/* Documents count */}
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 font-mono font-bold rounded-lg border border-purple-200 text-xs">
                          {relations.docs.length}
                        </span>
                      </td>

                      {/* Billing history */}
                      <td className="p-4">
                        <p className="font-mono font-extrabold text-slate-900 text-xs">
                          S$ {relations.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {relations.invs.length} Invoices ({relations.invs.filter(i => (i.paymentStatus || '').toLowerCase() === 'paid').length} Settled)
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => { setViewingCustomer(cust); setCustomerModalTab('overview'); }}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="View Customer 360 Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCustomer(cust)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Edit Customer Info"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchiveCustomer(cust)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Archive Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {filteredCustomers.length === 0 ? 0 : ((safeCurrentPage - 1) * pageSize) + 1} to {Math.min(safeCurrentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length} accounts
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="font-bold text-slate-800 px-2">{safeCurrentPage} / {totalPages}</span>
              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* MODAL 1: CUSTOMER 360° PROFILE VIEW                                     */}
      {/* ======================================================================= */}
      {viewingCustomer && (() => {
        const relations = getCustomerRelations(viewingCustomer);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#0B1F5B] to-slate-900 text-white p-6 relative flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2463EB] to-[#1D4ED8] text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                    {viewingCustomer.company?.charAt(0).toUpperCase() || viewingCustomer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-extrabold text-white font-heading">
                        {viewingCustomer.company || viewingCustomer.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white/20 text-white border border-white/20">
                        {viewingCustomer.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Contact: {viewingCustomer.name} • {viewingCustomer.email} • {viewingCustomer.phone}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#2463EB]" />
                      <span>{viewingCustomer.address || 'Singapore Logistics Hub'}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingCustomer(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs inside Customer Modal */}
              <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1.5 text-xs font-bold shrink-0">
                {[
                  { id: 'overview', label: 'Account Overview' },
                  { id: 'airway', label: `Airway Requests (${relations.airway.length})` },
                  { id: 'road', label: `Road Shipments (${relations.road.length})` },
                  { id: 'docs', label: `Documents (${relations.docs.length})` },
                  { id: 'billing', label: `Billing History (${relations.invs.length})` },
                  { id: 'notes', label: 'Notes & Activity' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCustomerModalTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      customerModalTab === tab.id
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Body Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
                {/* 1. Account Overview */}
                {customerModalTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Total Revenue Paid</span>
                        <p className="text-lg font-black font-mono text-slate-900 mt-1">
                          S$ {relations.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="p-4 bg-[#EAF2FF]/80 rounded-2xl border border-[#DCE5F0] text-center">
                        <span className="text-[10px] uppercase font-bold text-[#0B1F5B]">Airway Requests</span>
                        <p className="text-lg font-black font-mono text-[#2463EB] mt-1">{relations.airway.length}</p>
                      </div>
                      <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-800">Road Shipments</span>
                        <p className="text-lg font-black font-mono text-emerald-600 mt-1">{relations.road.length}</p>
                      </div>
                      <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 text-center">
                        <span className="text-[10px] uppercase font-bold text-purple-800">Total Documents</span>
                        <p className="text-lg font-black font-mono text-purple-600 mt-1">{relations.docs.length}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Account Terms & Credit Limit</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-medium">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Tier Category</span>
                          <span className="font-bold text-slate-800">{viewingCustomer.tier || 'Standard Corporate'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Credit Facility</span>
                          <span className="font-bold text-slate-800">{viewingCustomer.creditLimit || 'S$ 50,000'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Settlement Terms</span>
                          <span className="font-bold text-slate-800">{viewingCustomer.paymentTerms || 'Net 30 Days'}</span>
                        </div>
                      </div>
                    </div>

                    {viewingCustomer.notes && (
                      <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-amber-800">Customer Relationship Notes</span>
                        <p className="text-amber-900 leading-relaxed font-medium">{viewingCustomer.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Airway Requests Tab */}
                {customerModalTab === 'airway' && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-900">Linked Airway Service Requests</h4>
                    {relations.airway.length === 0 ? (
                      <p className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                        No airway service requests submitted yet for this customer.
                      </p>
                    ) : (
                      relations.airway.map(r => (
                        <div key={r.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-slate-900">#{r.id}</span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded text-[10px] font-bold">
                                {r.status}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1 font-medium">{r.origin} → {r.destination}</p>
                            <p className="text-[11px] text-slate-400">{r.cargoDescription} • {r.packagesCount} • {r.totalWeight}</p>
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">{r.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. Road Shipments Tab */}
                {customerModalTab === 'road' && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-900">Linked Road Consignments</h4>
                    {relations.road.length === 0 ? (
                      <p className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                        No road haulage shipments booked yet for this customer.
                      </p>
                    ) : (
                      relations.road.map(s => (
                        <div key={s.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-slate-900">#{s.id}</span>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                                {s.status}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1 font-medium">{s.origin} → {s.destination}</p>
                            <p className="text-[11px] text-slate-400">{s.cargoType} • {s.weight}</p>
                          </div>
                          <span className="font-mono font-bold text-slate-800">{s.price || 'S$ 450.00'}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 4. Documents Tab */}
                {customerModalTab === 'docs' && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-900">Document Vault</h4>
                    {relations.docs.length === 0 ? (
                      <p className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                        No documents uploaded for this customer.
                      </p>
                    ) : (
                      relations.docs.map(d => (
                        <div key={d.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                            <div>
                              <p className="font-extrabold text-slate-900">{d.name}</p>
                              <p className="text-[10px] text-slate-400">{d.type} • {d.fileSize} • Uploaded {d.uploadDate}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold">
                            {d.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. Billing History */}
                {customerModalTab === 'billing' && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-900">Invoices & Billing History</h4>
                    {relations.invs.length === 0 ? (
                      <p className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                        No invoices generated for this customer.
                      </p>
                    ) : (
                      relations.invs.map(i => (
                        <div key={i.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-slate-900">#{i.invoiceNumber || i.id}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                (i.paymentStatus || '').toLowerCase() === 'paid' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {i.paymentStatus}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Issue: {i.issueDate} • Due: {i.dueDate}</p>
                          </div>
                          <span className="font-mono font-black text-slate-900 text-sm">
                            S$ {getInvoiceTotal(i).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 6. Notes Tab */}
                {customerModalTab === 'notes' && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-slate-900">Internal Account Notes</h4>
                    <textarea
                      value={viewingCustomer.notes || ''}
                      onChange={(e) => setViewingCustomer({ ...viewingCustomer, notes: e.target.value })}
                      placeholder="Add customer preferences, operational guidelines, credit terms, or account manager notes..."
                      rows={5}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#2463EB]"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {notesSavedFeedback ? (
                          <span className="text-emerald-600 font-bold">✓ Notes saved successfully!</span>
                        ) : (
                          'Internal notes visible to CRM team only.'
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================================= */}
      {/* MODAL 2: ADD NEW CUSTOMER                                               */}
      {/* ======================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 font-heading">Add Corporate Customer</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomerData.company}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, company: e.target.value })}
                  placeholder="e.g. Apex Precision Logistics Pte Ltd"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  placeholder="e.g. Darren Tan (Supply Chain Lead)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newCustomerData.email}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                    placeholder="logistics@company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                    placeholder="+65 6789 0123"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Registered Business Address</label>
                <input
                  type="text"
                  value={newCustomerData.address}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                  placeholder="e.g. 10 Pasir Panjang Road, Mapletree Business City, Singapore"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Account Tier</label>
                  <select
                    value={newCustomerData.tier}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, tier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    <option value="Standard Corporate">Standard Corporate</option>
                    <option value="Enterprise Key Account">Enterprise Key Account</option>
                    <option value="GDP Certified Medical Shipper">GDP Certified Medical Shipper</option>
                    <option value="Aviation Express Client">Aviation Express Client</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Payment Terms</label>
                  <select
                    value={newCustomerData.paymentTerms}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, paymentTerms: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Prepaid / Advanced">Prepaid / Advanced</option>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Account Relationship Notes</label>
                <textarea
                  value={newCustomerData.notes}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, notes: e.target.value })}
                  placeholder="Special handling instructions, billing contacts, preferred transportation modes..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer shadow-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: EDIT CUSTOMER INFO                                             */}
      {/* ======================================================================= */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 font-heading">Edit Customer Account</h3>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.company || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Address</label>
                <input
                  type="text"
                  value={editingCustomer.address || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Account Tier</label>
                  <select
                    value={editingCustomer.tier || 'Standard Corporate'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, tier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Standard Corporate">Standard Corporate</option>
                    <option value="Enterprise Key Account">Enterprise Key Account</option>
                    <option value="GDP Certified Medical Shipper">GDP Certified Medical Shipper</option>
                    <option value="Aviation Express Client">Aviation Express Client</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Payment Terms</label>
                  <select
                    value={editingCustomer.paymentTerms || 'Net 30 Days'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, paymentTerms: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Prepaid / Advanced">Prepaid / Advanced</option>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
