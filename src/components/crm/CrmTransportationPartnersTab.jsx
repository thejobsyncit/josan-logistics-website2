import React, { useState } from 'react';
import { 
  Handshake, 
  Search, 
  Plus, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  X, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const PARTNER_STATUSES = [
  'Active Partner',
  'Under Contract',
  'Pending Audit',
  'Inactive'
];

export const CrmTransportationPartnersTab = ({
  partners = [],
  shipments = [],
  onAddPartner,
  onUpdatePartner,
  onDeletePartner,
  onAssignPartnerToShipment
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [assigningPartner, setAssigningPartner] = useState(null); // partner object to assign shipments to

  // New Partner Form State
  const [newPartnerData, setNewPartnerData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    serviceArea: 'Singapore Islandwide Corridors (Tuas, Jurong, Woodlands, Changi)',
    operatingZones: 'Northern & Western Corridors',
    vehicleTypes: '14ft Box Trucks, 24ft Heavy Lorries',
    agreementStatus: 'Active Partner',
    registeredVehicles: 6,
    designatedDrivers: 8,
    address: 'Singapore Logistics District',
    notes: 'Contracted commercial roadway partner under bilateral service level agreement.'
  });

  // Filter logic
  const filteredPartners = partners.filter(p => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term ||
      p.name?.toLowerCase().includes(term) ||
      p.contactPerson?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.phone?.toLowerCase().includes(term) ||
      p.operatingZones?.toLowerCase().includes(term) ||
      p.serviceArea?.toLowerCase().includes(term) ||
      p.vehicleTypes?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'All' || p.agreementStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active Partner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Under Contract':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Audit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Inactive':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newPartnerData.name || !newPartnerData.contactPerson) return;

    onAddPartner(newPartnerData);
    setIsAddOpen(false);
    setNewPartnerData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      serviceArea: 'Singapore Islandwide Corridors (Tuas, Jurong, Woodlands, Changi)',
      operatingZones: 'Northern & Western Corridors',
      vehicleTypes: '14ft Box Trucks, 24ft Heavy Lorries',
      agreementStatus: 'Active Partner',
      registeredVehicles: 6,
      designatedDrivers: 8,
      address: 'Singapore Logistics District',
      notes: 'Contracted commercial roadway partner under bilateral service level agreement.'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPartner) return;
    onUpdatePartner(editingPartner.id, editingPartner);
    setEditingPartner(null);
  };

  // Get unassigned road shipments
  const unassignedShipments = shipments.filter(s => 
    !s.transportationPartnerId && (!s.transportationPartner || s.transportationPartner === 'Unassigned Partner')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Transportation Partners Roster</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-700">
              {partners.length} Partners
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Licensed 3rd-party logistics companies contracted to fulfill commercial roadway freight and airport transfers for Josan Logistics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transportation Partner</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partner name, contact, operating zones, vehicle types..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Agreement Statuses</option>
            {PARTNER_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {(search || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStatusFilter('All'); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Partners Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPartners.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 font-medium">
            No transportation partners found matching your search.
          </div>
        ) : (
          filteredPartners.map((partner) => {
            const assignedShipments = shipments.filter(s => 
              s.transportationPartnerId === partner.id || 
              (s.transportationPartner && s.transportationPartner.includes(partner.name))
            );

            return (
              <div
                key={partner.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                      <Truck className="w-6 h-6 text-[#2463EB]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">{partner.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getStatusBadge(partner.agreementStatus)}`}>
                          {partner.agreementStatus || 'Active'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Lead: {partner.contactPerson} • {partner.phone}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: #{partner.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingPartner(partner)}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg cursor-pointer transition-colors"
                      title="Edit Partner"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove transportation partner "${partner.name}"?`)) {
                          onDeletePartner(partner.id);
                        }
                      }}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                      title="Remove Partner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Service Area & Vehicle Info */}
                <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-[#2463EB] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700">Operating Zones & Service Area:</span>
                      <p className="text-slate-600">{partner.operatingZones || partner.serviceArea}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-1 border-t border-slate-200/80">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700">Vehicle / Service Information:</span>
                      <p className="text-slate-600">{partner.vehicleTypes}</p>
                    </div>
                  </div>
                </div>

                {/* Stats & Assignment Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Shipments</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {assignedShipments.length} Active
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Units</span>
                      <span className="font-mono font-bold text-slate-700">
                        {partner.registeredVehicles || 4} Trucks
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAssigningPartner(partner)}
                    className="px-3 py-1.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs shadow-sm flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <span>Assign Road Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================================= */}
      {/* MODAL 1: ASSIGN PARTNER TO PENDING ROAD REQUESTS                        */}
      {/* ======================================================================= */}
      {assigningPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">Assign Road Consignments</h3>
                <p className="text-xs text-slate-500">Partner: {assigningPartner.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setAssigningPartner(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select any active road transport consignment to assign to <span className="font-bold text-slate-900">{assigningPartner.name}</span>:
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
              {shipments.map((s) => {
                const isCurrentlyAssigned = s.transportationPartnerId === assigningPartner.id || s.transportationPartner === assigningPartner.name;

                return (
                  <div
                    key={s.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isCurrentlyAssigned
                        ? 'bg-blue-50/80 border-blue-300'
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900">#{s.id}</span>
                        <span className="text-[10px] text-slate-400">({s.status})</span>
                      </div>
                      <p className="font-extrabold text-slate-900 line-clamp-1">{s.sender || s.customerName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{s.origin} → {s.destination}</p>
                      <p className="text-[10px] text-slate-400">{s.cargoType} • {s.weight}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAssignPartnerToShipment(s.id, assigningPartner.id, assigningPartner.name);
                        setAssigningPartner(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer ${
                        isCurrentlyAssigned
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2463EB] hover:bg-[#1D4ED8] text-white shadow-sm'
                      }`}
                    >
                      {isCurrentlyAssigned ? 'Assigned ✓' : 'Assign to Route'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: ADD TRANSPORTATION PARTNER                                     */}
      {/* ======================================================================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">Contract Transportation Partner</h3>
                <p className="text-xs text-slate-500">Add licensed 3rd-party roadway hauler to partner roster</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Partner / Carrier Company Name *</label>
                <input
                  type="text"
                  required
                  value={newPartnerData.name}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, name: e.target.value })}
                  placeholder="e.g. Woodlands Linehaul Logistics Pte Ltd"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Key Operations Contact Person *</label>
                <input
                  type="text"
                  required
                  value={newPartnerData.contactPerson}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, contactPerson: e.target.value })}
                  placeholder="e.g. Tan Wei Ming (Partner Lead)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPartnerData.phone}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, phone: e.target.value })}
                    placeholder="+65 9123 4567"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newPartnerData.email}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, email: e.target.value })}
                    placeholder="dispatch@partner.sg"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Service Area / Operating Zones *</label>
                <input
                  type="text"
                  required
                  value={newPartnerData.operatingZones}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, operatingZones: e.target.value })}
                  placeholder="e.g. Northern & Western Corridors (Woodlands, Jurong, Tuas)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Vehicle / Service Capabilities *</label>
                <input
                  type="text"
                  required
                  value={newPartnerData.vehicleTypes}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, vehicleTypes: e.target.value })}
                  placeholder="e.g. 14ft Box Trucks, 24ft Lorries, 40ft Prime Movers, Reefer Vans"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Agreement Status</label>
                  <select
                    value={newPartnerData.agreementStatus}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, agreementStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    <option value="Active Partner">Active Partner</option>
                    <option value="Under Contract">Under Contract</option>
                    <option value="Pending Audit">Pending Audit</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Fleet Unit Capacity</label>
                  <input
                    type="number"
                    value={newPartnerData.registeredVehicles}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, registeredVehicles: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer shadow-sm"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: EDIT TRANSPORTATION PARTNER                                    */}
      {/* ======================================================================= */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 font-heading">Edit Transportation Partner</h3>
              <button
                type="button"
                onClick={() => setEditingPartner(null)}
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
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={editingPartner.contactPerson}
                  onChange={(e) => setEditingPartner({ ...editingPartner, contactPerson: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingPartner.phone}
                    onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={editingPartner.email}
                    onChange={(e) => setEditingPartner({ ...editingPartner, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Operating Zones</label>
                <input
                  type="text"
                  value={editingPartner.operatingZones || editingPartner.serviceArea || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, operatingZones: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Vehicle Information</label>
                <input
                  type="text"
                  value={editingPartner.vehicleTypes}
                  onChange={(e) => setEditingPartner({ ...editingPartner, vehicleTypes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Agreement Status</label>
                <select
                  value={editingPartner.agreementStatus}
                  onChange={(e) => setEditingPartner({ ...editingPartner, agreementStatus: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Active Partner">Active Partner</option>
                  <option value="Under Contract">Under Contract</option>
                  <option value="Pending Audit">Pending Audit</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
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
