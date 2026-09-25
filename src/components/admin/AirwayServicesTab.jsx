import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  Plane, 
  Search, 
  FileText, 
  CreditCard, 
  FileCheck, 
  Truck, 
  Users, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Eye,
  Download,
  X,
  MessageSquare,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Package,
  Building2,
  User,
  Mail,
  Phone,
  DollarSign,
  Paperclip,
  ChevronRight,
  Filter,
  Save,
  Send
} from 'lucide-react';

export const AirwayServicesTab = ({
  shipments = [],
  airwayRequests: propAirwayRequests,
  onUpdateAirwayRequestStatus: propUpdateStatus,
  onUpdateAirwayRequestNotes: propUpdateNotes,
  onViewShipment,
  onUpdateStatus
}) => {
  const context = useLogistics();
  
  // Use context if props not directly passed
  const airwayRequests = propAirwayRequests || context.airwayRequests || [];
  const updateAirwayRequestStatus = propUpdateStatus || context.updateAirwayRequestStatus;
  const updateAirwayRequestNotes = propUpdateNotes || context.updateAirwayRequestNotes;
  const showToast = context.showToast;

  // View state: 'requests' (Airway Requests) or 'consignments' (AWB Consignments)
  const [activeSubTab, setActiveSubTab] = useState('requests');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [selectedStatusInModal, setSelectedStatusInModal] = useState('');

  // Status definitions in sequence
  const STATUSES = [
    'New',
    'Under Review',
    'Documentation',
    'Billing',
    'Transportation Coordination',
    'Completed'
  ];

  // Filter airway shipments from generic shipments table
  const airwayShipments = shipments.filter(s => 
    s.service === 'Airway Services' || 
    s.serviceType?.toLowerCase().includes('air') || 
    s.type === 'air' ||
    s.mode === 'Air'
  );

  // Filter Airway Requests
  const filteredRequests = airwayRequests.filter(req => {
    if (statusFilter !== 'All' && req.status !== statusFilter) return false;
    if (serviceFilter !== 'All') {
      const services = Array.isArray(req.services) ? req.services : [req.services || req.service];
      if (!services.some(s => s?.toLowerCase().includes(serviceFilter.toLowerCase()))) return false;
    }

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const cust = req.customerName || req.customer || '';
    const company = req.company || '';
    const cargo = req.cargoDescription || req.cargo || '';
    const origin = req.origin || '';
    const dest = req.destination || '';
    const id = req.id || '';

    return (
      id.toLowerCase().includes(q) ||
      cust.toLowerCase().includes(q) ||
      company.toLowerCase().includes(q) ||
      cargo.toLowerCase().includes(q) ||
      origin.toLowerCase().includes(q) ||
      dest.toLowerCase().includes(q)
    );
  });

  // Filter AWB Consignments
  const filteredConsignments = airwayShipments.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const cust = s.customer || s.customerName || s.sender || '';
    return (
      s.id?.toLowerCase().includes(q) ||
      s.awbNumber?.toLowerCase().includes(q) ||
      cust.toLowerCase().includes(q) ||
      s.origin?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Documentation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Billing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Transportation Coordination':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getServiceBadgeColor = (serviceName) => {
    if (serviceName.includes('Preparation')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (serviceName.includes('Billing')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (serviceName.includes('Documentation')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (serviceName.includes('Transportation')) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const handleOpenModal = (req) => {
    setSelectedRequest(req);
    setEditingNotes(req.adminNotes || '');
    setSelectedStatusInModal(req.status || 'New');
  };

  const handleSaveModalChanges = () => {
    if (!selectedRequest) return;
    
    if (updateAirwayRequestStatus && selectedStatusInModal !== selectedRequest.status) {
      updateAirwayRequestStatus(selectedRequest.id, selectedStatusInModal);
    }

    if (updateAirwayRequestNotes) {
      updateAirwayRequestNotes(selectedRequest.id, editingNotes);
    }

    // Update local modal state
    setSelectedRequest(prev => ({
      ...prev,
      status: selectedStatusInModal,
      adminNotes: editingNotes
    }));

    if (showToast) {
      showToast(`Airway Request #${selectedRequest.id} updated successfully!`, 'success');
    }
  };

  const handleQuickStatusChange = (requestId, newStatus) => {
    if (updateAirwayRequestStatus) {
      updateAirwayRequestStatus(requestId, newStatus);
    }
    if (showToast) {
      showToast(`Request #${requestId} status set to ${newStatus}`, 'success');
    }
  };

  // Helper to format documents display
  const getDocCount = (req) => {
    if (!req.documents) return 0;
    if (Array.isArray(req.documents)) return req.documents.length;
    if (typeof req.documents === 'object') {
      return Object.values(req.documents).filter(Boolean).length;
    }
    return 0;
  };

  const getDocList = (req) => {
    if (!req.documents) return [];
    if (Array.isArray(req.documents)) return req.documents;
    if (typeof req.documents === 'object') {
      return Object.entries(req.documents)
        .filter(([_, file]) => Boolean(file))
        .map(([type, file]) => ({
          type: type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          name: typeof file === 'string' ? file : file.name || `${type}.pdf`,
          size: typeof file === 'object' && file.size ? `${Math.round(file.size / 1024)} KB` : 'Verified'
        }));
    }
    return [];
  };

  // Status index for progress bar in modal
  const currentStatusIndex = selectedRequest ? STATUSES.indexOf(selectedRequest.status) : 0;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Banner & Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center space-x-1.5">
                <Plane className="w-3.5 h-3.5" />
                <span>Airway Operations</span>
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-full">
                {airwayRequests.length} Airway Requests
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
              Airway Requests & AWB Services
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Manage inbound Airway Service Requests (AWB preparation, billing, shipment documentation, and airport transportation support). Review cargo specifications, customer uploaded documents, and advance the coordination pipeline.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveSubTab('requests')}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeSubTab === 'requests'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Airway Requests</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeSubTab === 'requests' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {airwayRequests.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('consignments')}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeSubTab === 'consignments'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>AWB Consignments</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeSubTab === 'consignments' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {airwayShipments.length}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Core Airway Services Reference Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-200 transition-all">
            <div className="flex items-center space-x-2 text-blue-700 font-extrabold text-xs">
              <FileText className="w-4 h-4 shrink-0" />
              <span>AWB Preparation</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
              Standard Air Waybill issuance, IATA master documentation and carrier coordination.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:border-emerald-200 transition-all">
            <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-xs">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>AWB Billing</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
              Consolidated freight rate calculation, terminal handling charges, and documentation disbursements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-200 transition-all">
            <div className="flex items-center space-x-2 text-purple-700 font-extrabold text-xs">
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>Shipment Documentation</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
              Commercial invoice, packing list, certificate of origin, and Singapore TradeNet customs clearance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 hover:border-orange-200 transition-all">
            <div className="flex items-center space-x-2 text-orange-700 font-extrabold text-xs">
              <Truck className="w-4 h-4 shrink-0" />
              <span>Transportation Support</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
              First-mile commercial road feeder transport between customer premises and Changi Airport cargo terminal.
            </p>
          </div>
        </div>
      </div>

      {/* VIEW 1: AIRWAY REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Request ID, customer, company, cargo..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange shadow-2xs"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Service:</span>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                >
                  <option value="All">All Services</option>
                  <option value="Preparation">AWB Preparation</option>
                  <option value="Billing">AWB Billing</option>
                  <option value="Documentation">Shipment Documentation</option>
                  <option value="Transportation">Transportation Support</option>
                </select>
              </div>
            </div>
          </div>

          {/* Airway Requests Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Request ID & Date</th>
                  <th className="p-3.5">Customer Details</th>
                  <th className="p-3.5">Shipment Details</th>
                  <th className="p-3.5">Requested Services</th>
                  <th className="p-3.5">Uploaded Docs</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Admin Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <FileCheck className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                      <p className="font-bold text-slate-700 text-sm">No airway service requests found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Requests submitted through the Airway Request form will automatically appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const services = Array.isArray(req.services) ? req.services : [req.services || req.service || 'AWB Preparation'];
                    const docList = getDocList(req);
                    const docCount = docList.length;

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Request ID & Date */}
                        <td className="p-3.5 align-top">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                              <Plane className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-mono font-black text-blue-600 text-sm block">
                                {req.id}
                              </span>
                              <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                <span>{req.date || 'Today'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Customer Details */}
                        <td className="p-3.5 align-top">
                          <p className="font-bold text-slate-900 text-xs">
                            {req.customerName || req.customer || 'Customer'}
                          </p>
                          {req.company && (
                            <p className="text-[11px] text-slate-600 font-medium flex items-center space-x-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{req.company}</span>
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {req.phone || req.email}
                          </p>
                        </td>

                        {/* 3. Shipment Details */}
                        <td className="p-3.5 align-top max-w-[200px]">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-800 text-xs truncate" title={req.cargoDescription}>
                              {req.cargoDescription || 'Air Consignment'}
                            </p>
                            <div className="text-[10px] text-slate-500 space-y-0.5">
                              <p className="truncate"><span className="font-semibold text-slate-700">From:</span> {req.origin || 'Changi (SIN)'}</p>
                              <p className="truncate"><span className="font-semibold text-slate-700">To:</span> {req.destination || 'International'}</p>
                              <p className="font-mono text-slate-600">
                                {req.packagesCount || '1 pkgs'} • {req.totalWeight || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 4. Requested Services */}
                        <td className="p-3.5 align-top">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {services.map((svc, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getServiceBadgeColor(svc)}`}
                              >
                                {svc}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 5. Uploaded Documents */}
                        <td className="p-3.5 align-top">
                          {docCount > 0 ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                <Paperclip className="w-3 h-3" />
                                <span>{docCount} File{docCount > 1 ? 's' : ''} Attached</span>
                              </span>
                              <div className="text-[10px] text-slate-500 space-y-0.5">
                                {docList.slice(0, 2).map((d, i) => (
                                  <p key={i} className="truncate max-w-[120px]" title={d.name || d.type}>
                                    • {d.type || d.name}
                                  </p>
                                ))}
                                {docCount > 2 && (
                                  <p className="text-[9px] text-slate-400 font-bold">+{docCount - 2} more</p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None uploaded</span>
                          )}
                        </td>

                        {/* 6. Status Selector */}
                        <td className="p-3.5 align-top">
                          <select
                            value={req.status || 'New'}
                            onChange={(e) => handleQuickStatusChange(req.id, e.target.value)}
                            className={`py-1 px-2.5 rounded-lg text-[11px] font-black border cursor-pointer focus:outline-none transition-all ${getStatusBadge(req.status)}`}
                          >
                            {STATUSES.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>

                        {/* 7. Admin Notes Snippet */}
                        <td className="p-3.5 align-top max-w-[160px]">
                          <p className="text-[11px] text-slate-600 line-clamp-2 italic" title={req.adminNotes}>
                            {req.adminNotes ? `"${req.adminNotes}"` : <span className="text-slate-300 not-italic">No notes yet</span>}
                          </p>
                        </td>

                        {/* 8. Actions */}
                        <td className="p-3.5 align-top text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenModal(req)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE AWB CONSIGNMENTS */}
      {activeSubTab === 'consignments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search AWB Number, Customer, Carrier Support..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange shadow-2xs"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold">
              Showing {filteredConsignments.length} Active Consignments
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">AWB Details</th>
                  <th className="p-3.5">Customer / Shipper</th>
                  <th className="p-3.5">Carrier Support</th>
                  <th className="p-3.5">Origin / Destination</th>
                  <th className="p-3.5">AWB Billing</th>
                  <th className="p-3.5">Docs Status</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredConsignments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No airway consignments found.
                    </td>
                  </tr>
                ) : (
                  filteredConsignments.map((item) => {
                    const awbNum = item.awbNumber || `AWB-${item.id.replace(/\D/g, '').slice(-7) || '618-29401'}`;
                    const carrier = item.carrierSupport || item.carrier || 'Singapore Airlines Cargo (SQ)';
                    const cust = item.customer || item.customerName || item.sender || 'Changi Aviation Client';
                    const billingAmount = item.price || 'S$ 1,450.00';
                    const billingStatus = item.paymentStatus || 'Billed';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <Plane className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="font-mono font-bold text-blue-600">{awbNum}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Ref: {item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{cust}</p>
                          <p className="text-[10px] text-slate-400">{item.senderPhone || '+65 6543 2100'}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-700 block">{carrier}</span>
                          <span className="text-[10px] text-slate-400">Changi Air Cargo Gate 4</span>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          <p className="font-semibold text-slate-800">{item.origin || 'SIN - Singapore Changi'}</p>
                          <p className="text-[10px] text-slate-400">↳ {item.destination || 'BKK - Bangkok Suvarnabhumi'}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-mono font-bold text-slate-900">{billingAmount}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                            billingStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {billingStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            Docs Ready (4/4)
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={item.status}
                            onChange={(e) => onUpdateStatus && onUpdateStatus(item.id, e.target.value)}
                            className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus-orange"
                          >
                            <option value="New">New</option>
                            <option value="Documentation">Documentation</option>
                            <option value="Processing">Processing</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => onViewShipment && onViewShipment(item)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            AWB Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: AIRWAY REQUEST FULL REVIEW & WORKFLOW */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#0B132B] text-white p-6 sm:p-7 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-xl text-[#FF6B00]">
                      {selectedRequest.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getStatusBadge(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-300 mt-1">
                    Airway Service Request Details & Coordination
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Workflow Pipeline Progress Bar */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">
                Airway Service Coordination Pipeline:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {STATUSES.map((step, idx) => {
                  const isCurrent = selectedRequest.status === step;
                  const isPassed = currentStatusIndex > idx;
                  return (
                    <div
                      key={step}
                      onClick={() => setSelectedStatusInModal(step)}
                      className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
                        selectedStatusInModal === step
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black'
                          : isPassed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 font-medium'
                      }`}
                    >
                      <div className="text-[9px] uppercase tracking-wider opacity-75">Step {idx + 1}</div>
                      <div className="text-[11px] leading-tight mt-0.5 truncate" title={step}>{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Customer & Shipment Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-xs">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Customer Details</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Full Name</span>
                      <span className="font-bold text-slate-900">{selectedRequest.customerName || selectedRequest.customer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Company Name</span>
                      <span className="font-semibold text-slate-800">{selectedRequest.company || '—'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
                        <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline font-medium break-all">
                          {selectedRequest.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone Number</span>
                        <a href={`tel:${selectedRequest.phone}`} className="text-slate-800 font-mono font-bold">
                          {selectedRequest.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-xs">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>Shipment Specifications</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Cargo / Description</span>
                      <span className="font-bold text-slate-900">{selectedRequest.cargoDescription || 'Air Consignment'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Origin</span>
                        <span className="font-semibold text-slate-800">{selectedRequest.origin}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Destination</span>
                        <span className="font-semibold text-slate-800">{selectedRequest.destination}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Packages</span>
                        <span className="font-bold text-slate-800">{selectedRequest.packagesCount || '1'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Weight</span>
                        <span className="font-bold text-slate-800">{selectedRequest.totalWeight || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Value</span>
                        <span className="font-bold text-slate-800">{selectedRequest.approximateValue || '—'}</span>
                      </div>
                    </div>
                    {selectedRequest.dimensions && (
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Dimensions</span>
                        <span className="text-slate-700 font-mono">{selectedRequest.dimensions}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Requested Services */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-xs">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Requested Airway Services</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Array.isArray(selectedRequest.services) ? selectedRequest.services : [selectedRequest.services || 'AWB Preparation']).map((svc, i) => (
                    <div key={i} className="flex items-center space-x-2 p-2.5 rounded-xl bg-white border border-blue-100">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-xs text-slate-800">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-purple-900 font-extrabold text-xs">
                    <Paperclip className="w-4 h-4 text-purple-600" />
                    <span>Customer Uploaded Documents ({getDocCount(selectedRequest)})</span>
                  </div>
                </div>
                {getDocList(selectedRequest).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No files attached by customer during submission.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getDocList(selectedRequest).map((doc, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-purple-100 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-800 truncate">{doc.type}</p>
                          <p className="text-[10px] text-slate-400 truncate">{doc.name}</p>
                          {doc.size && <span className="text-[9px] text-purple-600 font-mono">{doc.size}</span>}
                        </div>
                        <button
                          onClick={() => {
                            if (showToast) showToast(`Downloading ${doc.name}...`, 'info');
                          }}
                          className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 transition-colors cursor-pointer shrink-0"
                          title="Download document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Notes & Status Setting */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-xs">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Admin Coordination Notes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-500">Status:</span>
                    <select
                      value={selectedStatusInModal}
                      onChange={(e) => setSelectedStatusInModal(e.target.value)}
                      className={`py-1 px-2.5 rounded-lg text-xs font-black border cursor-pointer ${getStatusBadge(selectedStatusInModal)}`}
                    >
                      {STATUSES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add administrative notes, IATA master AWB reference, carrier confirmation, or clearance updates..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus-orange"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveModalChanges}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
