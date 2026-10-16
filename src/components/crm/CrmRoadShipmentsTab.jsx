import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  MapPin, 
  Building2, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Handshake, 
  X, 
  User, 
  Phone, 
  Calendar,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ROAD_STATUS_OPTIONS = [
  'New',
  'Review',
  'Quotation',
  'Confirmed',
  'Transportation Coordination',
  'Delivered',
  'Completed'
];

export const CrmRoadShipmentsTab = ({
  shipments = [],
  transportationPartners = [],
  documents = [],
  onUpdateStatus,
  onAssignPartner,
  onUpdateNotes,
  onAddShipment,
  selectedShipmentFromSearch = null
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [partnerFilter, setPartnerFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [activeShipmentModal, setActiveShipmentModal] = useState(selectedShipmentFromSearch);
  const [assignPartnerModalShipment, setAssignPartnerModalShipment] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  // Form state for creating a new road consignment
  const [newRoadData, setNewRoadData] = useState({
    customer: '',
    senderPhone: '+65 6789 0123',
    pickupLocation: 'Jurong Logistics Hub Gate 4, Singapore',
    deliveryLocation: 'Woodlands Distribution Terminal, Singapore',
    goodsDescription: '',
    packages: 4,
    weight: '450 kg',
    transportationPartnerId: '',
    serviceLevel: 'Commercial Road Freight & Highway Linehaul (FTL)',
    price: 'S$ 550.00',
    notes: ''
  });

  // Filter logic
  const filteredShipments = shipments.filter(s => {
    const term = search.trim().toLowerCase();
    const customerName = (s.sender || s.customerName || '').toLowerCase();
    const goods = (s.cargoType || s.goodsDescription || '').toLowerCase();
    const pickup = (s.origin || s.pickupLocation || s.senderAddress || '').toLowerCase();
    const delivery = (s.destination || s.deliveryLocation || s.receiverAddress || '').toLowerCase();
    const partner = (s.transportationPartner || s.driverName || '').toLowerCase();

    const matchesSearch = !term ||
      s.id?.toLowerCase().includes(term) ||
      customerName.includes(term) ||
      goods.includes(term) ||
      pickup.includes(term) ||
      delivery.includes(term) ||
      partner.includes(term);

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter || 
      (statusFilter === 'Active' && s.status !== 'Delivered' && s.status !== 'Cancelled');
    
    const matchesPartner = partnerFilter === 'All' || 
      (s.transportationPartnerId && s.transportationPartnerId === partnerFilter) ||
      (s.transportationPartner && s.transportationPartner.includes(partnerFilter));

    return matchesSearch && matchesStatus && matchesPartner;
  });

  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / pageSize));
  const paginatedShipments = filteredShipments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New':
      case 'Booking Received':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Review':
      case 'Quotation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Confirmed':
      case 'Processing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Transportation Coordination':
      case 'Partner Assigned':
      case 'Pickup Scheduled':
      case 'In Transit':
      case 'Near Destination':
        return 'bg-[#EAF2FF] text-[#0B1F5B] border-[#DCE5F0]';
      case 'Delivered':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
      case 'Delayed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRoadData.customer || !newRoadData.goodsDescription) return;

    const partnerObj = transportationPartners.find(p => p.id === newRoadData.transportationPartnerId);
    const newId = `JOS-${Math.floor(10000 + Math.random() * 90000)}-SG`;

    onAddShipment({
      id: newId,
      sender: newRoadData.customer,
      customerName: newRoadData.customer,
      senderPhone: newRoadData.senderPhone,
      senderAddress: newRoadData.pickupLocation,
      origin: newRoadData.pickupLocation,
      destination: newRoadData.deliveryLocation,
      receiverAddress: newRoadData.deliveryLocation,
      receiver: 'Receiving Distribution Bay',
      receiverPhone: '+65 6123 4567',
      cargoType: newRoadData.goodsDescription,
      pieces: Number(newRoadData.packages) || 1,
      weight: newRoadData.weight,
      transportationPartnerId: partnerObj?.id || '',
      transportationPartner: partnerObj?.name || 'Contracted Roadway Partner',
      serviceLevel: newRoadData.serviceLevel,
      price: newRoadData.price,
      status: partnerObj ? 'Partner Assigned' : 'Booking Received',
      createdDate: new Date().toLocaleString(),
      adminNotes: newRoadData.notes || 'Booked via CRM road consignment workflow'
    });

    setIsCreateModalOpen(false);
    setNewRoadData({
      customer: '',
      senderPhone: '+65 6789 0123',
      pickupLocation: 'Jurong Logistics Hub Gate 4, Singapore',
      deliveryLocation: 'Woodlands Distribution Terminal, Singapore',
      goodsDescription: '',
      packages: 4,
      weight: '450 kg',
      transportationPartnerId: '',
      serviceLevel: 'Commercial Road Freight & Highway Linehaul (FTL)',
      price: 'S$ 550.00',
      notes: ''
    });
  };

  const handlePartnerAssignmentSubmit = (partnerId) => {
    if (!assignPartnerModalShipment) return;
    const partner = transportationPartners.find(p => p.id === partnerId);
    if (!partner) return;

    onAssignPartner(assignPartnerModalShipment.id, partner.id, partner.name);
    if (activeShipmentModal && activeShipmentModal.id === assignPartnerModalShipment.id) {
      setActiveShipmentModal({
        ...activeShipmentModal,
        transportationPartnerId: partner.id,
        transportationPartner: partner.name,
        status: 'Partner Assigned'
      });
    }
    setAssignPartnerModalShipment(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Road Transportation Shipments</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
              {shipments.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Commercial transportation of goods dispatched through contracted logistics and haulage partners across Singapore.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Road Consignment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by Request ID, customer, goods description, pickup, delivery, partner..."
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
            <option value="Active">All Active Transits</option>
            {ROAD_STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={partnerFilter}
            onChange={(e) => { setPartnerFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Partners</option>
            {transportationPartners.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {(search || statusFilter !== 'All' || partnerFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStatusFilter('All'); setPartnerFilter('All'); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Road Shipments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Pickup Location</th>
                <th className="p-4">Delivery Location</th>
                <th className="p-4">Goods & Specs</th>
                <th className="p-4">Transportation Partner</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedShipments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 font-medium">
                    No road shipments found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedShipments.map((s) => {
                  const linkedDocs = documents.filter(d => d.shipmentId === s.id);
                  const partnerName = s.transportationPartner || s.driverName || 'Unassigned Partner';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Request ID */}
                      <td className="p-4">
                        <span className="font-mono font-black text-slate-900 text-xs block">
                          #{s.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          {s.createdDate?.split(' ')[0] || 'Recent'}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 text-xs hover:text-[#2463EB] cursor-pointer" onClick={() => { setActiveShipmentModal(s); setTempNotes(s.adminNotes || ''); }}>
                          {s.sender || s.customerName || 'Commercial Shipper'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{s.senderPhone || '—'}</p>
                      </td>

                      {/* Pickup Location */}
                      <td className="p-4 text-slate-700">
                        <p className="font-bold line-clamp-1 max-w-[180px]">{s.origin || s.pickupLocation || s.senderAddress}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Origin Gate</span>
                      </td>

                      {/* Delivery Location */}
                      <td className="p-4 text-slate-700">
                        <p className="font-bold line-clamp-1 max-w-[180px]">{s.destination || s.deliveryLocation || s.receiverAddress}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Destination Gate</span>
                      </td>

                      {/* Goods Description & Packages/Weight */}
                      <td className="p-4">
                        <p className="font-bold text-slate-900 line-clamp-1 max-w-[170px]">
                          {s.cargoType || s.goodsDescription || 'General Commercial Cargo'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {s.pieces || 1} pkg • {s.weight || '350 kg'}
                        </p>
                      </td>

                      {/* Transportation Partner */}
                      <td className="p-4">
                        <div className="flex items-center space-x-1.5">
                          <Handshake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-extrabold text-slate-900 text-xs line-clamp-1 max-w-[150px]">
                            {partnerName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAssignPartnerModalShipment(s)}
                          className="text-[10px] font-bold text-[#2463EB] hover:underline mt-0.5 block cursor-pointer"
                        >
                          Change Partner
                        </button>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <select
                          value={s.status}
                          onChange={(e) => onUpdateStatus(s.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold border cursor-pointer ${getStatusStyle(s.status)}`}
                        >
                          {ROAD_STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => { setActiveShipmentModal(s); setTempNotes(s.adminNotes || ''); }}
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
            <span>Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredShipments.length)} of {filteredShipments.length} consignments</span>
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
      {/* MODAL 1: ROAD SHIPMENT DOSSIER VIEW                                     */}
      {/* ======================================================================= */}
      {activeShipmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0B1F5B] to-slate-900 text-white p-6 relative flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-black text-emerald-400 bg-white/10 px-2 py-0.5 rounded-lg border border-white/20">
                    #{activeShipmentModal.id}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">Road Consignment Dossier</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Customer: {activeShipmentModal.sender || activeShipmentModal.customerName}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Service Level: {activeShipmentModal.serviceLevel || 'Express Roadway Linehaul'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase border ${getStatusStyle(activeShipmentModal.status)}`}>
                  {activeShipmentModal.status}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveShipmentModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Pickup & Delivery Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Pickup Location</span>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {activeShipmentModal.origin || activeShipmentModal.pickupLocation || activeShipmentModal.senderAddress}
                  </p>
                  <p className="text-slate-500 font-medium mt-1">Shipper Contact: {activeShipmentModal.senderPhone || '—'}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Delivery Destination</span>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {activeShipmentModal.destination || activeShipmentModal.deliveryLocation || activeShipmentModal.receiverAddress}
                  </p>
                  <p className="text-slate-500 font-medium mt-1">Consignee: {activeShipmentModal.receiver || 'Receiving Dock Gate'}</p>
                </div>
              </div>

              {/* Goods & Cargo Specs */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Goods Description & Packaging</span>
                <p className="font-bold text-slate-900 text-sm">
                  {activeShipmentModal.cargoType || activeShipmentModal.goodsDescription || 'General Commercial Freight'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Packages</span>
                    <span className="font-bold text-slate-800">{activeShipmentModal.pieces || 1} units</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gross Weight</span>
                    <span className="font-bold text-slate-800">{activeShipmentModal.weight || '400 kg'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Quoted Rate</span>
                    <span className="font-bold text-slate-800 font-mono">{activeShipmentModal.price || 'S$ 540.00'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Payment Status</span>
                    <span className={`font-bold font-mono ${activeShipmentModal.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {activeShipmentModal.paymentStatus || 'Unpaid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transportation Partner Info */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block">Assigned Transportation Partner</span>
                  <p className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                    <Handshake className="w-4 h-4 text-blue-600" />
                    <span>{activeShipmentModal.transportationPartner || activeShipmentModal.driverName || 'No Partner Assigned'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Commercial arrangement through licensed Singapore roadway network</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAssignPartnerModalShipment(activeShipmentModal)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
                >
                  Change Partner
                </button>
              </div>

              {/* Internal Notes Editor */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Internal Operations Notes</span>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Dispatch logs, driver partner arrangement notes, gate clearance permits..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs focus:outline-none focus:border-[#2463EB]"
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNotes(activeShipmentModal.id, tempNotes);
                    setActiveShipmentModal({ ...activeShipmentModal, adminNotes: tempNotes });
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveShipmentModal(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: ASSIGN TRANSPORTATION PARTNER                                  */}
      {/* ======================================================================= */}
      {assignPartnerModalShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">Assign Transportation Partner</h3>
                <p className="text-xs text-slate-500">Consignment #{assignPartnerModalShipment.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setAssignPartnerModalShipment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select an audited transportation partner from your approved network to fulfill this road transportation request:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {transportationPartners.map((partner) => {
                const isSelected = assignPartnerModalShipment.transportationPartnerId === partner.id ||
                  assignPartnerModalShipment.transportationPartner === partner.name;

                return (
                  <div
                    key={partner.id}
                    onClick={() => handlePartnerAssignmentSubmit(partner.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <p className="font-extrabold text-slate-900 text-xs truncate">{partner.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{partner.operatingZones || partner.serviceArea}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Vehicles: {partner.vehicleTypes}</p>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? 'Assigned' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: BOOK NEW ROAD CONSIGNMENT                                      */}
      {/* ======================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">Book Road Consignment</h3>
                <p className="text-xs text-slate-500">Commercial road transportation arrangement</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Customer / Shipper Name *</label>
                  <input
                    type="text"
                    required
                    value={newRoadData.customer}
                    onChange={(e) => setNewRoadData({ ...newRoadData, customer: e.target.value })}
                    placeholder="e.g. Razer Asia-Pacific HQ"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Shipper Phone</label>
                  <input
                    type="tel"
                    value={newRoadData.senderPhone}
                    onChange={(e) => setNewRoadData({ ...newRoadData, senderPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={newRoadData.pickupLocation}
                    onChange={(e) => setNewRoadData({ ...newRoadData, pickupLocation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Delivery Location *</label>
                  <input
                    type="text"
                    required
                    value={newRoadData.deliveryLocation}
                    onChange={(e) => setNewRoadData({ ...newRoadData, deliveryLocation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Goods Description *</label>
                <input
                  type="text"
                  required
                  value={newRoadData.goodsDescription}
                  onChange={(e) => setNewRoadData({ ...newRoadData, goodsDescription: e.target.value })}
                  placeholder="e.g. High-Tech Electronics & Microchips"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Packages Count</label>
                  <input
                    type="number"
                    value={newRoadData.packages}
                    onChange={(e) => setNewRoadData({ ...newRoadData, packages: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Weight</label>
                  <input
                    type="text"
                    value={newRoadData.weight}
                    onChange={(e) => setNewRoadData({ ...newRoadData, weight: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Estimated Price</label>
                  <input
                    type="text"
                    value={newRoadData.price}
                    onChange={(e) => setNewRoadData({ ...newRoadData, price: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Assign Transportation Partner</label>
                <select
                  value={newRoadData.transportationPartnerId}
                  onChange={(e) => setNewRoadData({ ...newRoadData, transportationPartnerId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="">-- Assign Later --</option>
                  {transportationPartners.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.operatingZones || p.serviceArea})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Consignment Notes</label>
                <textarea
                  value={newRoadData.notes}
                  onChange={(e) => setNewRoadData({ ...newRoadData, notes: e.target.value })}
                  placeholder="Dock appointment times, special tailgate requirements, fragile instructions..."
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
