import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Building2, 
  User, 
  MapPin, 
  Package, 
  DollarSign, 
  CreditCard, 
  Check, 
  Save
} from 'lucide-react';

export const AIRWAY_STATUS_STAGES = [
  'New',
  'Under review',
  'Quote sent',
  'Paid',
  'AWB prepared',
  'Documents sent',
  'Completed',
  'Declined',
  'Cancelled'
];

export const CrmAirwayRequestsTab = ({
  airwayRequests = [],
  onUpdateStatus,
  onUpdateNotes,
  onUpdateRequest,
  onAddRequest,
  selectedRequestFromSearch = null
}) => {
  // Navigation & View Mode: null = List Page, object = Detail Page
  const [viewingRequest, setViewingRequest] = useState(selectedRequestFromSearch);

  // Search & Filter state for List Page
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Detail Page Edit Form State (synced with viewingRequest)
  const [detailForm, setDetailForm] = useState(null);
  const [detailNotes, setDetailNotes] = useState('');

  // Sync selectedRequestFromSearch prop
  useEffect(() => {
    if (selectedRequestFromSearch) {
      setViewingRequest(selectedRequestFromSearch);
    }
  }, [selectedRequestFromSearch]);

  // Keep viewingRequest and detailForm in sync when airwayRequests update
  useEffect(() => {
    if (viewingRequest) {
      const fresh = airwayRequests.find(r => r.id === viewingRequest.id);
      if (fresh) {
        setViewingRequest(fresh);
      }
    }
  }, [airwayRequests]);

  // When viewingRequest changes, populate detailForm
  useEffect(() => {
    if (viewingRequest) {
      const length = parseFloat(viewingRequest.lengthCm) || 0;
      const width = parseFloat(viewingRequest.widthCm) || 0;
      const height = parseFloat(viewingRequest.heightCm) || 0;
      const packages = parseInt(viewingRequest.packagesCount, 10) || 1;
      const gross = parseFloat(viewingRequest.grossWeight) || parseFloat(viewingRequest.totalWeight) || 0;

      // Volumetric weight: (L × W × H ÷ 6000) × packages
      const vol = (length > 0 && width > 0 && height > 0)
        ? Number((((length * width * height) / 6000) * packages).toFixed(2))
        : (parseFloat(viewingRequest.volumetricWeight) || 0);

      // Chargeable weight: higher of gross vs volumetric
      const chg = Number(Math.max(gross, vol).toFixed(2));

      setDetailForm({
        ...viewingRequest,
        packagesCount: packages,
        grossWeight: gross,
        lengthCm: length,
        widthCm: width,
        heightCm: height,
        volumetricWeight: vol,
        chargeableWeight: chg,
        ratePerKg: parseFloat(viewingRequest.ratePerKg) || 0,
        freight: parseFloat(viewingRequest.freight) || 0,
        documentFee: viewingRequest.documentFee || '[CONFIRM]',
        otherCharges: parseFloat(viewingRequest.otherCharges) || 0,
        totalCharges: parseFloat(viewingRequest.totalCharges) || 0,
        paymentTerms: viewingRequest.paymentTerms || 'Prepaid',
        invoiceReceived: viewingRequest.invoiceReceived ?? false,
        packingListReceived: viewingRequest.packingListReceived ?? false,
        awbNumber: viewingRequest.awbNumber || '',
        quoteStatus: viewingRequest.quoteStatus || 'Draft',
        quoteSentDate: viewingRequest.quoteSentDate || '',
        paymentStatus: viewingRequest.paymentStatus || 'Unpaid',
        paymentMethod: viewingRequest.paymentMethod || 'Bank transfer [CONFIRM]',
        assignedTo: viewingRequest.assignedTo || 'Unassigned',
        plannedDate: viewingRequest.plannedDate || viewingRequest.date || '[CONFIRM]',
        shipperName: viewingRequest.shipperName || viewingRequest.customerName || viewingRequest.company || '',
        shipperAddress: viewingRequest.shipperAddress || '[CONFIRM]',
        shipperContact: viewingRequest.shipperContact || viewingRequest.phone || viewingRequest.email || '',
        consigneeName: viewingRequest.consigneeName || viewingRequest.receiverName || viewingRequest.receiverCompany || '',
        consigneeAddress: viewingRequest.consigneeAddress || '[CONFIRM]',
        consigneeContact: viewingRequest.consigneeContact || viewingRequest.receiverPhone || viewingRequest.receiverEmail || '',
        originAirport: viewingRequest.originAirport || viewingRequest.origin || 'SIN - Singapore Changi Airport',
        destinationAirport: viewingRequest.destinationAirport || viewingRequest.destination || '',
        airline: viewingRequest.airline || '',
        flightNumber: viewingRequest.flightNumber || ''
      });
      setDetailNotes(viewingRequest.adminNotes || viewingRequest.notes || '');
    } else {
      setDetailForm(null);
      setDetailNotes('');
    }
  }, [viewingRequest?.id]);

  // Recalculate weights and charges on detail form changes
  const handleDetailInputChange = (field, value) => {
    setDetailForm(prev => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };

      const packages = parseInt(updated.packagesCount, 10) || 1;
      const gross = parseFloat(updated.grossWeight) || 0;
      const length = parseFloat(updated.lengthCm) || 0;
      const width = parseFloat(updated.widthCm) || 0;
      const height = parseFloat(updated.heightCm) || 0;

      // Volumetric weight: (L × W × H ÷ 6000) × packages
      const vol = (length > 0 && width > 0 && height > 0)
        ? Number((((length * width * height) / 6000) * packages).toFixed(2))
        : 0;
      updated.volumetricWeight = vol;

      // Chargeable weight: higher of gross vs volumetric (auto-calculated, read-only)
      const chg = Number(Math.max(gross, vol).toFixed(2));
      updated.chargeableWeight = chg;

      // Charges calculations
      const rate = parseFloat(updated.ratePerKg) || 0;
      const freight = Number((rate * chg).toFixed(2));
      updated.freight = freight;

      const docFee = updated.documentFee === '[CONFIRM]' || !updated.documentFee ? 75 : parseFloat(updated.documentFee) || 0;
      const other = parseFloat(updated.otherCharges) || 0;
      updated.totalCharges = Number((freight + (typeof docFee === 'number' ? docFee : 0) + other).toFixed(2));

      return updated;
    });
  };

  const handleSaveDetailChanges = () => {
    if (!detailForm) return;
    const updatedData = {
      ...detailForm,
      adminNotes: detailNotes
    };

    if (onUpdateRequest) {
      onUpdateRequest(detailForm.id, updatedData);
    } else {
      if (onUpdateStatus && detailForm.status !== viewingRequest?.status) {
        onUpdateStatus(detailForm.id, detailForm.status);
      }
      if (onUpdateNotes && detailNotes !== viewingRequest?.adminNotes) {
        onUpdateNotes(detailForm.id, detailNotes);
      }
    }
    setViewingRequest(updatedData);
  };

  // Distinct assignees for filter
  const assigneesList = useMemo(() => {
    const set = new Set();
    airwayRequests.forEach(r => {
      if (r.assignedTo && r.assignedTo !== 'Unassigned') {
        set.add(r.assignedTo);
      }
    });
    return Array.from(set);
  }, [airwayRequests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return airwayRequests.filter(r => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term ||
        r.id?.toLowerCase().includes(term) ||
        r.customerName?.toLowerCase().includes(term) ||
        r.company?.toLowerCase().includes(term) ||
        r.cargoDescription?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        r.origin?.toLowerCase().includes(term) ||
        r.originAirport?.toLowerCase().includes(term) ||
        r.destination?.toLowerCase().includes(term) ||
        r.destinationAirport?.toLowerCase().includes(term) ||
        r.assignedTo?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchesAssigned = assignedFilter === 'All' ||
        (assignedFilter === 'Unassigned' ? (!r.assignedTo || r.assignedTo === 'Unassigned') : r.assignedTo === assignedFilter);

      return matchesSearch && matchesStatus && matchesAssigned;
    });
  }, [airwayRequests, search, statusFilter, assignedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under review':
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Quote sent':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AWB prepared':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Documents sent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Declined':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // New Request Form State (Create Modal)
  const [newRequestData, setNewRequestData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    shipperName: '',
    shipperAddress: '[CONFIRM]',
    shipperContact: '',
    consigneeName: '',
    consigneeAddress: '[CONFIRM]',
    consigneeContact: '',
    originAirport: 'SIN - Singapore Changi Airport',
    destinationAirport: '',
    plannedDate: '[CONFIRM]',
    cargoDescription: '',
    packagesCount: 1,
    grossWeight: 100,
    lengthCm: 100,
    widthCm: 80,
    heightCm: 80,
    ratePerKg: 0,
    documentFee: '[CONFIRM]',
    paymentTerms: 'Prepaid',
    invoiceReceived: false,
    packingListReceived: false,
    assignedTo: 'Unassigned',
    notes: ''
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRequestData.customerName || !newRequestData.cargoDescription) return;

    const packages = parseInt(newRequestData.packagesCount, 10) || 1;
    const gross = parseFloat(newRequestData.grossWeight) || 0;
    const l = parseFloat(newRequestData.lengthCm) || 0;
    const w = parseFloat(newRequestData.widthCm) || 0;
    const h = parseFloat(newRequestData.heightCm) || 0;

    const vol = (l > 0 && w > 0 && h > 0)
      ? Number((((l * w * h) / 6000) * packages).toFixed(2))
      : 0;
    const chg = Number(Math.max(gross, vol).toFixed(2));

    const rate = parseFloat(newRequestData.ratePerKg) || 0;
    const freight = Number((rate * chg).toFixed(2));
    const docFee = 75;
    const total = Number((freight + docFee).toFixed(2));

    if (onAddRequest) {
      onAddRequest({
        ...newRequestData,
        origin: newRequestData.originAirport,
        destination: newRequestData.destinationAirport,
        packagesCount: packages,
        grossWeight: gross,
        totalWeight: `${gross} kg`,
        dimensions: `${l} × ${w} × ${h} cm`,
        volumetricWeight: vol,
        chargeableWeight: chg,
        ratePerKg: rate,
        freight: freight,
        documentFee: '[CONFIRM]',
        totalCharges: total,
        adminNotes: newRequestData.notes || 'Created via CRM staff console'
      });
    }

    setIsCreateModalOpen(false);
    setNewRequestData({
      customerName: '',
      company: '',
      email: '',
      phone: '',
      shipperName: '',
      shipperAddress: '[CONFIRM]',
      shipperContact: '',
      consigneeName: '',
      consigneeAddress: '[CONFIRM]',
      consigneeContact: '',
      originAirport: 'SIN - Singapore Changi Airport',
      destinationAirport: '',
      plannedDate: '[CONFIRM]',
      cargoDescription: '',
      packagesCount: 1,
      grossWeight: 100,
      lengthCm: 100,
      widthCm: 80,
      heightCm: 80,
      ratePerKg: 0,
      documentFee: '[CONFIRM]',
      paymentTerms: 'Prepaid',
      invoiceReceived: false,
      packingListReceived: false,
      assignedTo: 'Unassigned',
      notes: ''
    });
  };

  // =========================================================================
  // VIEW: DETAIL PAGE
  // =========================================================================
  if (viewingRequest && detailForm) {
    const isGrossHigher = (detailForm.grossWeight || 0) >= (detailForm.volumetricWeight || 0);

    return (
      <div className="space-y-6 animate-fade-in text-slate-800">
        {/* Detail Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setViewingRequest(null)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to requests</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                #{detailForm.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusBadgeStyle(detailForm.status)}`}>
                {detailForm.status}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleSaveDetailChanges}
              className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save changes</span>
            </button>
          </div>
        </div>

        {/* 9 SECTIONS IN EXACT REQUIRED ORDER */}
        <div className="space-y-6">
          {/* SECTION 1: REQUEST */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">1. Request</h3>
              <p className="text-[11px] text-slate-500">Request reference, intake date, operational status, and staff assignment.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
              <div>
                <label className="text-slate-500 block mb-1">Request ID</label>
                <input
                  type="text"
                  readOnly
                  value={`#${detailForm.id}`}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Intake date</label>
                <input
                  type="text"
                  value={detailForm.date || ''}
                  onChange={(e) => handleDetailInputChange('date', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Status</label>
                <select
                  value={detailForm.status}
                  onChange={(e) => handleDetailInputChange('status', e.target.value)}
                  className={`w-full p-2 rounded-lg font-bold border cursor-pointer ${getStatusBadgeStyle(detailForm.status)}`}
                >
                  {AIRWAY_STATUS_STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Assigned to</label>
                <input
                  type="text"
                  value={detailForm.assignedTo || 'Unassigned'}
                  onChange={(e) => handleDetailInputChange('assignedTo', e.target.value)}
                  placeholder="Staff member name"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* AWB Number field: plain editable text field, who assigns = [CONFIRM] */}
            <div className="pt-2 border-t border-slate-100">
              <div className="max-w-md">
                <label className="text-slate-700 font-bold block mb-1">
                  AWB number [CONFIRM: who assigns]
                </label>
                <input
                  type="text"
                  value={detailForm.awbNumber || ''}
                  onChange={(e) => handleDetailInputChange('awbNumber', e.target.value)}
                  placeholder="e.g. 016-12345678 (plain editable text, no auto-generation)"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 focus:outline-none focus:border-[#2463EB]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Plain editable text field. No auto-generation.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: CUSTOMER */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">2. Customer</h3>
              <p className="text-[11px] text-slate-500">Corporate client and primary account point of contact.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
              <div>
                <label className="text-slate-500 block mb-1">Customer name</label>
                <input
                  type="text"
                  value={detailForm.customerName || ''}
                  onChange={(e) => handleDetailInputChange('customerName', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Company name</label>
                <input
                  type="text"
                  value={detailForm.company || ''}
                  onChange={(e) => handleDetailInputChange('company', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Email</label>
                <input
                  type="email"
                  value={detailForm.email || ''}
                  onChange={(e) => handleDetailInputChange('email', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={detailForm.phone || ''}
                  onChange={(e) => handleDetailInputChange('phone', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SHIPPER AND CONSIGNEE */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">3. Shipper and consignee</h3>
              <p className="text-[11px] text-slate-500">Origin shipper and destination consignee details printed on air freight documents.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              {/* Shipper */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Shipper</span>
                <div>
                  <label className="text-slate-500 block mb-1">Shipper name</label>
                  <input
                    type="text"
                    value={detailForm.shipperName || ''}
                    onChange={(e) => handleDetailInputChange('shipperName', e.target.value)}
                    placeholder="Shipper name"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Shipper address [CONFIRM]</label>
                  <input
                    type="text"
                    value={detailForm.shipperAddress || '[CONFIRM]'}
                    onChange={(e) => handleDetailInputChange('shipperAddress', e.target.value)}
                    placeholder="[CONFIRM]"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Shipper contact</label>
                  <input
                    type="text"
                    value={detailForm.shipperContact || ''}
                    onChange={(e) => handleDetailInputChange('shipperContact', e.target.value)}
                    placeholder="Phone or email"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Consignee */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Consignee</span>
                <div>
                  <label className="text-slate-500 block mb-1">Consignee name</label>
                  <input
                    type="text"
                    value={detailForm.consigneeName || ''}
                    onChange={(e) => handleDetailInputChange('consigneeName', e.target.value)}
                    placeholder="Consignee name"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Consignee address [CONFIRM]</label>
                  <input
                    type="text"
                    value={detailForm.consigneeAddress || '[CONFIRM]'}
                    onChange={(e) => handleDetailInputChange('consigneeAddress', e.target.value)}
                    placeholder="[CONFIRM]"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Consignee contact</label>
                  <input
                    type="text"
                    value={detailForm.consigneeContact || ''}
                    onChange={(e) => handleDetailInputChange('consigneeContact', e.target.value)}
                    placeholder="Phone or email"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: ROUTE */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">4. Route</h3>
              <p className="text-[11px] text-slate-500">Air freight corridor, planned shipping date, airline and flight reference.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-medium">
              <div className="lg:col-span-1">
                <label className="text-slate-500 block mb-1">Origin airport</label>
                <input
                  type="text"
                  value={detailForm.originAirport || ''}
                  onChange={(e) => handleDetailInputChange('originAirport', e.target.value)}
                  placeholder="e.g. SIN - Singapore Changi Airport"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="text-slate-500 block mb-1">Destination airport</label>
                <input
                  type="text"
                  value={detailForm.destinationAirport || ''}
                  onChange={(e) => handleDetailInputChange('destinationAirport', e.target.value)}
                  placeholder="e.g. BKK - Bangkok Suvarnabhumi Airport"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Planned date [CONFIRM]</label>
                <input
                  type="text"
                  value={detailForm.plannedDate || '[CONFIRM]'}
                  onChange={(e) => handleDetailInputChange('plannedDate', e.target.value)}
                  placeholder="[CONFIRM]"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Airline (optional)</label>
                <input
                  type="text"
                  value={detailForm.airline || ''}
                  onChange={(e) => handleDetailInputChange('airline', e.target.value)}
                  placeholder="e.g. Singapore Airlines (SQ)"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Flight number (optional)</label>
                <input
                  type="text"
                  value={detailForm.flightNumber || ''}
                  onChange={(e) => handleDetailInputChange('flightNumber', e.target.value)}
                  placeholder="e.g. SQ 708"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: GOODS */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">5. Goods</h3>
              <p className="text-[11px] text-slate-500">Commercial cargo details, packaging specs, and IATA chargeable weight auto-calculation.</p>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-slate-500 block mb-1">Cargo description</label>
                <input
                  type="text"
                  value={detailForm.cargoDescription || ''}
                  onChange={(e) => handleDetailInputChange('cargoDescription', e.target.value)}
                  placeholder="Commercial product description"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1">Packages</label>
                  <input
                    type="number"
                    min="1"
                    value={detailForm.packagesCount || 1}
                    onChange={(e) => handleDetailInputChange('packagesCount', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Gross weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={detailForm.grossWeight || 0}
                    onChange={(e) => handleDetailInputChange('grossWeight', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Length (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={detailForm.lengthCm || 0}
                    onChange={(e) => handleDetailInputChange('lengthCm', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Width (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={detailForm.widthCm || 0}
                    onChange={(e) => handleDetailInputChange('widthCm', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={detailForm.heightCm || 0}
                    onChange={(e) => handleDetailInputChange('heightCm', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Auto-calculated Weights Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Volumetric weight</span>
                    <span className="text-[10px] text-slate-400 font-mono">(L × W × H ÷ 6000) × packages</span>
                  </div>
                  <p className="text-base font-black font-mono text-slate-800 mt-1">
                    {detailForm.volumetricWeight} kg
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Calculated based on standard air freight dimensional ratio</p>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-bold">Chargeable weight</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0B1F5B]">
                      Auto-calculate • Read-only
                    </span>
                  </div>
                  <p className="text-xl font-black font-mono text-[#0B1F5B] mt-1">
                    {detailForm.chargeableWeight} kg
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Higher of gross ({detailForm.grossWeight} kg) vs volumetric ({detailForm.volumetricWeight} kg): {isGrossHigher ? 'Gross weight applies' : 'Volumetric weight applies'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: CHARGES */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">6. Charges</h3>
              <p className="text-[11px] text-slate-500">Air freight rate, document fee, payment terms, and total billing breakdown.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs font-medium">
              <div>
                <label className="text-slate-500 block mb-1">Rate / kg (S$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={detailForm.ratePerKg || 0}
                  onChange={(e) => handleDetailInputChange('ratePerKg', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Freight (S$)</label>
                <input
                  type="number"
                  readOnly
                  value={detailForm.freight || 0}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Rate × Chargeable wt</span>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Document fee [CONFIRM]</label>
                <input
                  type="text"
                  value={detailForm.documentFee || '[CONFIRM]'}
                  onChange={(e) => handleDetailInputChange('documentFee', e.target.value)}
                  placeholder="[CONFIRM]"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Other charges (S$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={detailForm.otherCharges || 0}
                  onChange={(e) => handleDetailInputChange('otherCharges', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Total (S$)</label>
                <input
                  type="number"
                  readOnly
                  value={detailForm.totalCharges || 0}
                  className="w-full p-2 bg-[#EAF2FF] border border-[#DCE5F0] rounded-lg text-[#0B1F5B] font-mono font-black"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Auto-calculated sum</span>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Terms</label>
                <select
                  value={detailForm.paymentTerms || 'Prepaid'}
                  onChange={(e) => handleDetailInputChange('paymentTerms', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold cursor-pointer"
                >
                  <option value="Prepaid">Prepaid</option>
                  <option value="Collect">Collect</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 7: DOCUMENTS */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">7. Documents</h3>
              <p className="text-[11px] text-slate-500">Customer-received files and documentation issued by Josan Logistics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              {/* Received from customer */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Received from customer</span>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <span className="font-bold text-slate-800">Commercial invoice</span>
                    <input
                      type="checkbox"
                      checked={Boolean(detailForm.invoiceReceived)}
                      onChange={(e) => handleDetailInputChange('invoiceReceived', e.target.checked)}
                      className="accent-[#2463EB] w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <span className="font-bold text-slate-800">Packing list</span>
                    <input
                      type="checkbox"
                      checked={Boolean(detailForm.packingListReceived)}
                      onChange={(e) => handleDetailInputChange('packingListReceived', e.target.checked)}
                      className="accent-[#2463EB] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                {detailForm.documents && detailForm.documents.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Customer attached files</span>
                    {detailForm.documents.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                        <span className="truncate max-w-[200px] text-slate-700 font-mono text-[11px]">{d.name || d}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Attached</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Issued by us */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Issued by us</span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 block">Air Waybill (AWB)</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {detailForm.awbNumber ? `Ref: ${detailForm.awbNumber}` : 'AWB number pending'}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      detailForm.status === 'AWB prepared' || detailForm.status === 'Documents sent' || detailForm.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {detailForm.status === 'AWB prepared' || detailForm.status === 'Documents sent' || detailForm.status === 'Completed' ? 'Prepared' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 block">Air freight documents package</span>
                      <span className="text-[10px] text-slate-500">Invoice & packing documentation set</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      detailForm.status === 'Documents sent' || detailForm.status === 'Completed'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {detailForm.status === 'Documents sent' || detailForm.status === 'Completed' ? 'Sent' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: QUOTE AND PAYMENT */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">8. Quote and payment</h3>
              <p className="text-[11px] text-slate-500">Commercial quotation transmission status and settlement record.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
              <div>
                <label className="text-slate-500 block mb-1">Quote status</label>
                <select
                  value={detailForm.quoteStatus || 'Draft'}
                  onChange={(e) => handleDetailInputChange('quoteStatus', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Quote sent">Quote sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Quote sent date</label>
                <input
                  type="text"
                  value={detailForm.quoteSentDate || ''}
                  onChange={(e) => handleDetailInputChange('quoteSentDate', e.target.value)}
                  placeholder="e.g. 2026-09-24 or not sent"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Payment status</label>
                <select
                  value={detailForm.paymentStatus || 'Unpaid'}
                  onChange={(e) => handleDetailInputChange('paymentStatus', e.target.value)}
                  className={`w-full p-2 rounded-lg font-bold border cursor-pointer ${
                    detailForm.paymentStatus === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : detailForm.paymentStatus === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Payment method [CONFIRM]</label>
                <select
                  value={detailForm.paymentMethod || 'Bank transfer [CONFIRM]'}
                  onChange={(e) => handleDetailInputChange('paymentMethod', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer"
                >
                  <option value="Bank transfer [CONFIRM]">Bank transfer [CONFIRM]</option>
                  <option value="PayNow [CONFIRM]">PayNow [CONFIRM]</option>
                  <option value="Corporate credit [CONFIRM]">Corporate credit [CONFIRM]</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 9: HISTORY AND INTERNAL NOTES */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">9. History and internal notes</h3>
              <p className="text-[11px] text-slate-500">Audit trail of status changes and operational team notes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              {/* History Timeline */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Status change history</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-56 overflow-y-auto space-y-2">
                  {!detailForm.history || detailForm.history.length === 0 ? (
                    <p className="text-slate-400 font-medium py-2 text-center">No status changes recorded yet.</p>
                  ) : (
                    detailForm.history.map((h, idx) => (
                      <div key={idx} className="p-2 bg-white rounded border border-slate-200 space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{h.date}</span>
                          <span className="font-bold text-slate-600">{h.user || 'Staff'}</span>
                        </div>
                        <p className="text-slate-800 font-medium">{h.action}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Internal operations notes</span>
                <textarea
                  value={detailNotes}
                  onChange={(e) => setDetailNotes(e.target.value)}
                  placeholder="Record team review updates, AWB preparation notes, and customer communication remarks..."
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-800 focus:outline-none focus:border-[#2463EB]"
                />
                <button
                  type="button"
                  onClick={handleSaveDetailChanges}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Save internal notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LIST PAGE (TABLE)
  // =========================================================================
  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 font-sans">Air freight requests</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700">
              {airwayRequests.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage inbound air freight document requests, Air Waybill (AWB) preparation, and billing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New request</span>
        </button>
      </div>

      {/* Stage Flow Stepper Ribbon with Exact 9 Statuses */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-[850px]">
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
                  className={`flex-1 p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1F5B] text-white border-[#0B1F5B]'
                      : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase truncate">{stage}</p>
                  <p className={`text-base font-bold font-mono mt-0.5 ${isSelected ? 'text-[#2463EB]' : 'text-slate-900'}`}>
                    {count}
                  </p>
                </button>
                {idx < AIRWAY_STATUS_STAGES.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Filters and Search Bar: Filter by Status and Assigned to */}
      <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by request ID, customer, cargo, origin, destination, assigned to..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Filter by Status */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All statuses</option>
            {AIRWAY_STATUS_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Filter by Assigned to */}
          <select
            value={assignedFilter}
            onChange={(e) => { setAssignedFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All assigned to</option>
            <option value="Unassigned">Unassigned</option>
            {assigneesList.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {(search || statusFilter !== 'All' || assignedFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStatusFilter('All'); setAssignedFilter('All'); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* TABLE: EXACT REQUIRED 9 COLUMNS IN ORDER */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-900 font-extrabold uppercase text-[11px]">
              <tr>
                <th className="p-3.5">1. Request</th>
                <th className="p-3.5">2. Customer</th>
                <th className="p-3.5">3. Route</th>
                <th className="p-3.5">4. Goods</th>
                <th className="p-3.5">5. Documents received</th>
                <th className="p-3.5">6. Quote</th>
                <th className="p-3.5">7. Payment</th>
                <th className="p-3.5">8. Status</th>
                <th className="p-3.5">9. Assigned to</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-12 text-center text-slate-400 font-medium">
                    No air freight requests yet. New requests arrive under Quotations.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => {
                  const gross = parseFloat(req.grossWeight) || parseFloat(req.totalWeight) || 0;
                  const chg = parseFloat(req.chargeableWeight) || gross;
                  const pkgs = req.packagesCount || 1;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Request (ID + date) */}
                      <td className="p-3.5">
                        <span className="font-mono font-black text-slate-900 text-xs block">
                          #{req.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          {req.date || 'Recent'}
                        </span>
                      </td>

                      {/* 2. Customer */}
                      <td className="p-3.5">
                        <p
                          className="font-extrabold text-slate-900 text-xs hover:text-[#2463EB] cursor-pointer"
                          onClick={() => setViewingRequest(req)}
                        >
                          {req.company || req.customerName}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{req.customerName}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{req.email}</p>
                      </td>

                      {/* 3. Route (Origin airport → Destination airport) */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[180px]" title={req.originAirport || req.origin}>
                            {req.originAirport?.split(',')[0] || req.origin?.split(',')[0] || 'SIN'}
                          </p>
                          <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                            <span>→</span>
                            <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]" title={req.destinationAirport || req.destination}>
                              {req.destinationAirport?.split(',')[0] || req.destination?.split(',')[0] || '—'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Goods (description, packages, gross weight / chargeable weight) */}
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 text-xs truncate max-w-[160px]" title={req.cargoDescription}>
                          {req.cargoDescription || 'General commercial cargo'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {pkgs} pkg • {gross} kg gross / {chg} kg chg
                        </p>
                      </td>

                      {/* 5. Documents received (Invoice: Yes/No, Packing list: Yes/No) */}
                      <td className="p-3.5">
                        <div className="space-y-1 text-[11px] font-bold">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-slate-500 text-[10px]">Invoice:</span>
                            <span className={req.invoiceReceived ? 'text-emerald-700' : 'text-slate-500'}>
                              {req.invoiceReceived ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-slate-500 text-[10px]">Packing list:</span>
                            <span className={req.packingListReceived ? 'text-emerald-700' : 'text-slate-500'}>
                              {req.packingListReceived ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 6. Quote */}
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-slate-800 text-xs block">
                          {req.quoteAmount || (req.totalCharges ? `S$ ${req.totalCharges}` : '—')}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {req.quoteStatus || 'Draft'}
                        </span>
                      </td>

                      {/* 7. Payment */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.paymentStatus === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {req.paymentStatus || 'Unpaid'}
                        </span>
                      </td>

                      {/* 8. Status */}
                      <td className="p-3.5">
                        <select
                          value={req.status}
                          onChange={(e) => {
                            if (onUpdateStatus) {
                              onUpdateStatus(req.id, e.target.value);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${getStatusBadgeStyle(req.status)}`}
                        >
                          {AIRWAY_STATUS_STAGES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>

                      {/* 9. Assigned to */}
                      <td className="p-3.5">
                        <span className="text-slate-700 text-xs font-medium block">
                          {req.assignedTo || 'Unassigned'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingRequest(req)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
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
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="font-bold text-slate-800 px-2">{currentPage} / {totalPages}</span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL: NEW AIR FREIGHT REQUEST */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 font-sans">New air freight request</h3>
                <p className="text-xs text-slate-500">Intake customer documentation request and Air Waybill details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Customer name *</label>
                  <input
                    type="text"
                    required
                    value={newRequestData.customerName}
                    onChange={(e) => setNewRequestData({ ...newRequestData, customerName: e.target.value })}
                    placeholder="Customer name"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Company name</label>
                  <input
                    type="text"
                    value={newRequestData.company}
                    onChange={(e) => setNewRequestData({ ...newRequestData, company: e.target.value })}
                    placeholder="Company name"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
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
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newRequestData.phone}
                    onChange={(e) => setNewRequestData({ ...newRequestData, phone: e.target.value })}
                    placeholder="+65 6543 2100"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Route */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Origin airport</label>
                  <input
                    type="text"
                    value={newRequestData.originAirport}
                    onChange={(e) => setNewRequestData({ ...newRequestData, originAirport: e.target.value })}
                    placeholder="SIN - Singapore Changi Airport"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Destination airport *</label>
                  <input
                    type="text"
                    required
                    value={newRequestData.destinationAirport}
                    onChange={(e) => setNewRequestData({ ...newRequestData, destinationAirport: e.target.value })}
                    placeholder="e.g. BKK - Bangkok Suvarnabhumi Airport"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Cargo Description */}
              <div>
                <label className="text-slate-700 block mb-1">Cargo description *</label>
                <input
                  type="text"
                  required
                  value={newRequestData.cargoDescription}
                  onChange={(e) => setNewRequestData({ ...newRequestData, cargoDescription: e.target.value })}
                  placeholder="Commercial product description"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              {/* Specs & Dimensions */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="text-slate-700 block mb-1">Packages</label>
                  <input
                    type="number"
                    min="1"
                    value={newRequestData.packagesCount}
                    onChange={(e) => setNewRequestData({ ...newRequestData, packagesCount: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Gross wt (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newRequestData.grossWeight}
                    onChange={(e) => setNewRequestData({ ...newRequestData, grossWeight: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Length (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={newRequestData.lengthCm}
                    onChange={(e) => setNewRequestData({ ...newRequestData, lengthCm: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Width (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={newRequestData.widthCm}
                    onChange={(e) => setNewRequestData({ ...newRequestData, widthCm: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={newRequestData.heightCm}
                    onChange={(e) => setNewRequestData({ ...newRequestData, heightCm: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Documents received checkboxes */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Documents received</span>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRequestData.invoiceReceived}
                      onChange={(e) => setNewRequestData({ ...newRequestData, invoiceReceived: e.target.checked })}
                      className="accent-[#2463EB] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">Commercial invoice received</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRequestData.packingListReceived}
                      onChange={(e) => setNewRequestData({ ...newRequestData, packingListReceived: e.target.checked })}
                      className="accent-[#2463EB] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">Packing list received</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-slate-700 block mb-1">Internal notes</label>
                <textarea
                  value={newRequestData.notes}
                  onChange={(e) => setNewRequestData({ ...newRequestData, notes: e.target.value })}
                  placeholder="Record customer air freight document instructions..."
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs text-slate-800 focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-lg font-bold cursor-pointer active:scale-95 transition-all"
                >
                  Create request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
