import React, { useState } from 'react';
import { 
  Package, 
  Plane, 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar,
  UserCheck,
  UserPlus
} from 'lucide-react';

export const ShipmentsTab = ({
  shipments = [],
  onViewShipment,
  onUpdateStatus,
  onCreateShipment,
  onOpenAssignDriver
}) => {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = shipments.filter(s => {
    const serviceLabel = s.service || (s.serviceType?.toLowerCase().includes('air') ? 'Airway Services' : 'Road Transportation');
    if (serviceFilter !== 'All' && serviceLabel !== serviceFilter) return false;
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const cust = s.customer || s.customerName || s.sender || '';
    return (
      s.id?.toLowerCase().includes(q) ||
      cust.toLowerCase().includes(q) ||
      s.origin?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q) ||
      s.awbNumber?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Documentation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Shipment Operations
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {filtered.length} of {shipments.length} Total Shipments
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Consignment & Shipment Management</h2>
          <p className="text-xs text-slate-500">
            Pipeline workflow: New → Documentation → Processing → In Transit → Delivered → Completed
          </p>
        </div>

        <button
          onClick={onCreateShipment}
          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Shipment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Shipment ID, Customer, Location, AWB..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Service:</span>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Services</option>
            <option value="Airway Services">Airway Services</option>
            <option value="Road Transportation">Road Transportation</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">1. New</option>
            <option value="Documentation">2. Documentation</option>
            <option value="Processing">3. Processing</option>
            <option value="In Transit">4. In Transit</option>
            <option value="Delivered">5. Delivered</option>
            <option value="Completed">6. Completed</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3">Shipment ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Service</th>
              <th className="p-3">Origin → Destination</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned Driver</th>
              <th className="p-3">Update Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  No shipments found matching the criteria.
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const serviceLabel = s.service || (s.serviceType?.toLowerCase().includes('air') ? 'Airway Services' : 'Road Transportation');
                const isAir = serviceLabel.includes('Airway') || serviceLabel.includes('Air');
                const cust = s.customer || s.customerName || s.sender || 'Corporate Account';
                const hasDriver = !!(s.driverName || s.driverId);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      <button
                        onClick={() => onViewShipment(s)}
                        className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer"
                      >
                        {s.id}
                      </button>
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      {cust}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center space-x-1 font-bold ${
                        isAir ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {isAir ? <Plane className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                        <span>{serviceLabel}</span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-[180px]">
                      <div className="truncate font-semibold text-slate-800" title={s.origin}>
                        {s.origin || 'Singapore Hub'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" title={s.destination}>
                        → {s.destination || 'Singapore Bay'}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>

                    {/* ASSIGNED DRIVER COLUMN */}
                    <td className="p-3">
                      {hasDriver ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[120px]">{s.driverName}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {s.vehiclePlate || 'SG-8819'} {s.driverPhone ? `• ${s.driverPhone}` : ''}
                          </div>
                          {onOpenAssignDriver && (
                            <button
                              onClick={() => onOpenAssignDriver(s)}
                              className="text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer block"
                            >
                              Change Driver
                            </button>
                          )}
                        </div>
                      ) : (
                        <div>
                          {onOpenAssignDriver ? (
                            <button
                              onClick={() => onOpenAssignDriver(s)}
                              className="px-2.5 py-1 bg-orange-50 hover:bg-[#FF6B00] text-orange-700 hover:text-white border border-orange-200 rounded-lg text-[10px] font-extrabold transition-all flex items-center space-x-1 cursor-pointer shadow-2xs"
                              title="Assign driver with email & password"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>Assign Driver</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                              Unassigned
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <select
                        value={s.status}
                        onChange={(e) => onUpdateStatus(s.id, e.target.value)}
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

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {onOpenAssignDriver && (
                          <button
                            onClick={() => onOpenAssignDriver(s)}
                            className="px-2.5 py-1.5 bg-orange-50 hover:bg-[#FF6B00] text-orange-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            title="Assign or reassign driver"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewShipment(s)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Details
                        </button>
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
  );
};
