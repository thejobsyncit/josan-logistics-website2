import React, { useState } from 'react';
import { 
  Plane, 
  Search, 
  Plus, 
  Filter, 
  ArrowRight, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  X, 
  Building2, 
  User, 
  MapPin, 
  Package, 
  DollarSign, 
  CreditCard, 
  Truck, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AIRWAY_STATUS_STAGES = [
  'New',
  'Under Review',
  'Documentation',
  'Billing',
  'Transportation Coordination',
  'Completed'
];

export const CrmAirwayRequestsTab = ({
  airwayRequests = [],
  onUpdateStatus,
  onUpdateNotes,
  onAddRequest,
  selectedRequestFromSearch = null
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected request for details view modal
  const [activeRequestModal, setActiveRequestModal] = useState(selectedRequestFromSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  // New Request Form State
  const [newRequestData, setNewRequestData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    receiverName: '',
    receiverCompany: '',
    origin: 'SIN - Singapore Changi Airport',
    destination: 'BKK - Bangkok Suvarnabhumi Airport, Thailand',
    cargoDescription: '',
    packagesCount: '1 crate',
    totalWeight: '100 kg',
    dimensions: '100 x 80 x 80 cm',
    approximateValue: 'SGD 15,000',
    incoterm: '',
    services: ['AWB Preparation', 'Shipment Documentation'],
    documents: [],
    notes: ''
  });

  // Filter logic
  const filteredRequests = airwayRequests.filter(r => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term ||
      r.id?.toLowerCase().includes(term) ||
      r.customerName?.toLowerCase().includes(term) ||
      r.company?.toLowerCase().includes(term) ||
      r.cargoDescription?.toLowerCase().includes(term) ||
      r.origin?.toLowerCase().includes(term) ||
      r.destination?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesService = serviceFilter === 'All' || (r.services && r.services.includes(serviceFilter));

    return matchesSearch && matchesStatus && matchesService;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Documentation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Billing':
        return 'bg-[#EAF2FF] text-[#0B1F5B] border-[#DCE5F0]';
      case 'Transportation Coordination':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRequestData.customerName || !newRequestData.cargoDescription) return;

    onAddRequest({
      ...newRequestData,
      adminNotes: newRequestData.notes || 'Created manually via CRM intake console'
    });

    setIsCreateModalOpen(false);
    setNewRequestData({
      customerName: '',
      company: '',
      email: '',
      phone: '',
      receiverName: '',
      receiverCompany: '',
      origin: 'SIN - Singapore Changi Airport',
      destination: 'BKK - Bangkok Suvarnabhumi Airport, Thailand',
      cargoDescription: '',
      packagesCount: '1 crate',
      totalWeight: '100 kg',
      dimensions: '100 x 80 x 80 cm',
      approximateValue: 'SGD 15,000',
      incoterm: '',
      services: ['AWB Preparation', 'Shipment Documentation'],
      documents: [],
      notes: ''
    });
  };

  const handleNextStage = (req) => {
    const currentIndex = AIRWAY_STATUS_STAGES.indexOf(req.status);
    if (currentIndex >= 0 && currentIndex < AIRWAY_STATUS_STAGES.length - 1) {
      const nextStatus = AIRWAY_STATUS_STAGES[currentIndex + 1];
      onUpdateStatus(req.id, nextStatus);
      if (activeRequestModal && activeRequestModal.id === req.id) {
        setActiveRequestModal({ ...activeRequestModal, status: nextStatus });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Airway Service Requests</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#EAF2FF] text-[#2463EB]">
              {airwayRequests.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage inbound website airway service requests: AWB Preparation, AWB Billing, Shipment Documentation, and Transportation Support.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Airway Request</span>
        </button>
      </div>

      {/* Stage Flow Stepper Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-[700px]">
          {AIRWAY_STATUS_STAGES.map((stage, idx) => {
            const count = airwayRequests.filter(r => r.status === stage).length;
            const isSelected = statusFilter === stage;

            return (
              <React.Fragment key={stage}>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter(isSelected ? 'All' : stage);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1F5B] text-white border-[#0B1F5B] shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wider">{stage}</p>
                  <p className={`text-base font-black font-mono mt-0.5 ${isSelected ? 'text-[#2463EB]' : 'text-slate-900'}`}>
                    {count}
                  </p>
                </button>
                {idx < AIRWAY_STATUS_STAGES.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by Request ID, customer, cargo, origin, or destination..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {AIRWAY_STATUS_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Services</option>
            <option value="AWB Preparation">AWB Preparation</option>
            <option value="AWB Billing">AWB Billing</option>
            <option value="Shipment Documentation">Shipment Documentation</option>
            <option value="Transportation Support">Transportation Support</option>
          </select>

          {(search || statusFilter !== 'All' || serviceFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStatusFilter('All'); setServiceFilter('All'); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Airway Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Customer & Shipper</th>
                <th className="p-4">Origin & Destination</th>
                <th className="p-4">Cargo & Specs</th>
                <th className="p-4">Requested Services</th>
                <th className="p-4">Documents</th>
                <th className="p-4">Status & Progression</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 font-medium">
                    No airway service requests found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Request ID */}
                    <td className="p-4">
                      <span className="font-mono font-black text-slate-900 text-xs block">
                        #{req.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        {req.date || 'Recent'}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <p className="font-extrabold text-slate-900 text-xs hover:text-[#2463EB] cursor-pointer" onClick={() => { setActiveRequestModal(req); setTempNotes(req.adminNotes || ''); }}>
                        {req.company || req.customerName}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{req.customerName}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{req.email}</p>
                    </td>

                    {/* Origin & Destination */}
                    <td className="p-4 text-slate-700">
                      <p className="font-bold truncate max-w-[180px]">{req.origin?.split(',')[0] || req.origin}</p>
                      <p className="text-[11px] text-[#2463EB] font-bold flex items-center space-x-1 mt-0.5 truncate max-w-[180px]">
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        <span className="truncate">{req.destination?.split(',')[0] || req.destination}</span>
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Incoterm: {req.incoterm || 'Not specified'}</span>
                    </td>

                    {/* Cargo Specs */}
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-xs line-clamp-1 max-w-[180px]">
                        {req.cargoDescription}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {req.packagesCount} • {req.totalWeight} • {req.dimensions}
                      </p>
                      <span className="font-mono font-bold text-emerald-700 text-[10px] block mt-0.5">
                        Val: {req.approximateValue || 'SGD 10,000'}
                      </span>
                    </td>

                    {/* Requested Services */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[170px]">
                        {(req.services || ['AWB Preparation']).map((svc, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Documents */}
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold font-mono">
                        {req.documents?.length || 0} docs
                      </span>
                    </td>

                    {/* Status & Transition */}
                    <td className="p-4">
                      <div className="space-y-1.5">
                        <select
                          value={req.status}
                          onChange={(e) => onUpdateStatus(req.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold border cursor-pointer ${getStatusBadgeStyle(req.status)}`}
                        >
                          {AIRWAY_STATUS_STAGES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>

                        {req.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => handleNextStage(req)}
                            className="text-[10px] font-bold text-[#2463EB] hover:text-[#1D4ED8] flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Next Step</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => { setActiveRequestModal(req); setTempNotes(req.adminNotes || ''); }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredRequests.length)} of {filteredRequests.length} requests</span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors"
              >
                Previous
              </button>
              <span className="font-bold text-slate-800 px-2">{currentPage} / {totalPages}</span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* MODAL 1: AIRWAY REQUEST DETAIL VIEW & STAGE COORDINATION               */}
      {/* ======================================================================= */}
      {activeRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0B1F5B] to-slate-900 text-white p-6 relative flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-black text-[#2463EB] bg-white/10 px-2 py-0.5 rounded-lg border border-white/20">
                    #{activeRequestModal.id}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">Airway Service Request</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Customer: {activeRequestModal.customerName} ({activeRequestModal.company})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Route: {activeRequestModal.origin} → {activeRequestModal.destination}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase border ${getStatusBadgeStyle(activeRequestModal.status)}`}>
                  {activeRequestModal.status}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveRequestModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stepper Progression Bar */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 overflow-x-auto">
              <div className="flex items-center space-x-2 text-[10px] font-extrabold text-slate-600 min-w-[550px]">
                {AIRWAY_STATUS_STAGES.map((st, i) => {
                  const isCurrent = activeRequestModal.status === st;
                  const isPassed = AIRWAY_STATUS_STAGES.indexOf(activeRequestModal.status) > i;

                  return (
                    <div 
                      key={st} 
                      onClick={() => {
                        onUpdateStatus(activeRequestModal.id, st);
                        setActiveRequestModal({ ...activeRequestModal, status: st });
                      }}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                        isCurrent 
                          ? 'bg-[#2463EB] text-white border-[#2463EB]' 
                          : isPassed 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Shipper & Consignee Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Shipper / Customer</span>
                  <p className="font-extrabold text-slate-900 text-sm">{activeRequestModal.customerName}</p>
                  <p className="text-slate-600 font-medium">{activeRequestModal.company}</p>
                  <p className="text-slate-500">📧 {activeRequestModal.email}</p>
                  <p className="text-slate-500">📞 {activeRequestModal.phone}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Receiver / Consignee</span>
                  <p className="font-extrabold text-slate-900 text-sm">{activeRequestModal.receiverName || 'Commercial Consignee'}</p>
                  <p className="text-slate-600 font-medium">{activeRequestModal.receiverCompany || 'Receiving Company / Consignee'}</p>
                  <p className="text-slate-500">📧 {activeRequestModal.receiverEmail || 'N/A'}</p>
                  <p className="text-slate-500">📞 {activeRequestModal.receiverPhone || 'N/A'}</p>
                </div>
              </div>

              {/* Cargo Specifications */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Cargo & Packaging Specifications</span>
                <p className="font-bold text-slate-900 text-sm">{activeRequestModal.cargoDescription}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Packages</span>
                    <span className="font-bold text-slate-800">{activeRequestModal.packagesCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Weight</span>
                    <span className="font-bold text-slate-800">{activeRequestModal.totalWeight}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dimensions</span>
                    <span className="font-bold text-slate-800">{activeRequestModal.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Cargo Value</span>
                    <span className="font-bold text-emerald-700 font-mono">{activeRequestModal.approximateValue}</span>
                  </div>
                </div>
              </div>

              {/* Requested Services */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Requested Airway Services</span>
                <div className="flex flex-wrap gap-2">
                  {(activeRequestModal.services || ['AWB Preparation']).map((s, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#EAF2FF] text-[#2463EB] border border-[#DCE5F0] rounded-xl font-bold text-xs">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attached Documents */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Attached Shipment Documents</span>
                {!activeRequestModal.documents || activeRequestModal.documents.length === 0 ? (
                  <p className="p-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No documents attached yet to this airway request.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeRequestModal.documents.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">{doc.name}</p>
                            <p className="text-[10px] text-slate-500">{doc.type} • {doc.size || '180 KB'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#2463EB] hover:underline cursor-pointer">
                          View
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Notes Editor */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Internal Operations Notes</span>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Record AWB preparation, documentation updates, transportation coordination, and other operational notes..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs focus:outline-none focus:border-[#2463EB]"
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNotes(activeRequestModal.id, tempNotes);
                    setActiveRequestModal({ ...activeRequestModal, adminNotes: tempNotes });
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveRequestModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                {activeRequestModal.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() => handleNextStage(activeRequestModal)}
                    className="px-4 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Advance to Next Stage</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: CREATE AIRWAY SERVICE REQUEST                                   */}
      {/* ======================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">New Airway Service Intake</h3>
                <p className="text-xs text-slate-500">Record customer airway documentation or coordination request</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-bold">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newRequestData.customerName}
                    onChange={(e) => setNewRequestData({ ...newRequestData, customerName: e.target.value })}
                    placeholder="e.g. Marcus Lim"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Company / Entity</label>
                  <input
                    type="text"
                    value={newRequestData.company}
                    onChange={(e) => setNewRequestData({ ...newRequestData, company: e.target.value })}
                    placeholder="e.g. Changi Aviation Logistics"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newRequestData.email}
                    onChange={(e) => setNewRequestData({ ...newRequestData, email: e.target.value })}
                    placeholder="ops@client.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newRequestData.phone}
                    onChange={(e) => setNewRequestData({ ...newRequestData, phone: e.target.value })}
                    placeholder="+65 6543 2100"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
              </div>

              {/* Route */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Origin</label>
                  <input
                    type="text"
                    value={newRequestData.origin}
                    onChange={(e) => setNewRequestData({ ...newRequestData, origin: e.target.value })}
                    placeholder="SIN - Singapore Changi Airport"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Destination</label>
                  <input
                    type="text"
                    value={newRequestData.destination}
                    onChange={(e) => setNewRequestData({ ...newRequestData, destination: e.target.value })}
                    placeholder="BKK - Bangkok Suvarnabhumi Airport"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
              </div>

              {/* Cargo Description */}
              <div>
                <label className="text-slate-700 block mb-1">Cargo / Product Description *</label>
                <input
                  type="text"
                  required
                  value={newRequestData.cargoDescription}
                  onChange={(e) => setNewRequestData({ ...newRequestData, cargoDescription: e.target.value })}
                  placeholder="e.g. Avionics replacement components & calibration units"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-slate-700 block mb-1">Packages</label>
                  <input
                    type="text"
                    value={newRequestData.packagesCount}
                    onChange={(e) => setNewRequestData({ ...newRequestData, packagesCount: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Weight</label>
                  <input
                    type="text"
                    value={newRequestData.totalWeight}
                    onChange={(e) => setNewRequestData({ ...newRequestData, totalWeight: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newRequestData.dimensions}
                    onChange={(e) => setNewRequestData({ ...newRequestData, dimensions: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Approx. Value</label>
                  <input
                    type="text"
                    value={newRequestData.approximateValue}
                    onChange={(e) => setNewRequestData({ ...newRequestData, approximateValue: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Services checkboxes */}
              <div>
                <label className="text-slate-700 block mb-1.5">Requested Airway Services</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'AWB Preparation',
                    'AWB Billing',
                    'Shipment Documentation',
                    'Transportation Support'
                  ].map((svc) => {
                    const isChecked = newRequestData.services.includes(svc);
                    return (
                      <label 
                        key={svc} 
                        className={`p-2 rounded-xl border flex items-center space-x-2 cursor-pointer transition-colors ${
                          isChecked ? 'bg-[#EAF2FF]/80 border-[#DCE5F0] text-[#0B1F5B]' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRequestData({ ...newRequestData, services: [...newRequestData.services, svc] });
                            } else {
                              setNewRequestData({ ...newRequestData, services: newRequestData.services.filter(s => s !== svc) });
                            }
                          }}
                          className="accent-[#2463EB] rounded"
                        />
                        <span className="font-bold text-xs">{svc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-slate-700 block mb-1">Intake / Operations Notes</label>
                <textarea
                  value={newRequestData.notes}
                  onChange={(e) => setNewRequestData({ ...newRequestData, notes: e.target.value })}
                  placeholder="Additional customer requirements, shipment instructions, documentation details..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer shadow-sm"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
