import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  MapPin, 
  Building2, 
  User, 
  Phone, 
  Package, 
  Filter, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

export const RoadTransportationTab = ({
  shipments = [],
  transportationPartners = [],
  onViewShipment,
  onUpdateStatus,
  onAssignPartner
}) => {
  const [search, setSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('All');

  // Road shipments only
  const roadShipments = shipments.filter(s => 
    s.service === 'Road Transportation' || 
    s.serviceType?.toLowerCase().includes('road') || 
    s.type === 'road' ||
    s.mode === 'Road' ||
    (!s.service?.includes('Air') && !s.serviceType?.includes('air'))
  );

  const filtered = roadShipments.filter(s => {
    const partner = s.transportationPartner || s.carrier || 'Woodlands Linehaul Logistics Pte Ltd';
    if (partnerFilter !== 'All' && partner !== partnerFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const cust = s.customer || s.customerName || s.sender || '';
    return (
      s.id?.toLowerCase().includes(q) ||
      cust.toLowerCase().includes(q) ||
      partner.toLowerCase().includes(q) ||
      s.origin?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q) ||
      s.driverName?.toLowerCase().includes(q) ||
      s.vehiclePlate?.toLowerCase().includes(q)
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
              Commercial Goods Haulage
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {roadShipments.length} Active Road Runs
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Road Transportation & Partner Dispatch</h2>
          <p className="text-xs text-slate-500">
            Commercial goods transportation operated strictly via third-party Transportation Partners.
          </p>
        </div>
      </div>

      {/* Business Model Notice Badge */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-slate-700 font-medium">
            <strong className="text-slate-900">Partner Fleet Model:</strong> Josan arranges commercial freight through contracted, vetted third-party Transportation Partners across Singapore.
          </span>
        </div>
        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md">
          Contracted Partners
        </span>
      </div>

      {/* Search and Partner Filter Bar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Shipment, Pickup/Delivery, Transportation Partner, Driver..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Transportation Partner:</span>
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Partners</option>
            <option value="Woodlands Linehaul Logistics Pte Ltd">Woodlands Linehaul Logistics</option>
            <option value="Tuas Prime Haulage Pte Ltd">Tuas Prime Haulage</option>
            <option value="Jurong Freight Express Partners">Jurong Freight Express Partners</option>
            <option value="Changi Feeder Transport Co.">Changi Feeder Transport Co.</option>
          </select>
        </div>
      </div>

      {/* Road Shipments Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3">Shipment & Goods</th>
              <th className="p-3">Pickup Location</th>
              <th className="p-3">Delivery Location</th>
              <th className="p-3">Transportation Partner</th>
              <th className="p-3">Vehicle & Driver</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No road shipments found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const partnerName = item.transportationPartner || item.carrier || 'Woodlands Linehaul Logistics Pte Ltd';
                const vehiclePlate = item.vehiclePlate || 'SG-8819';
                const vehicleType = item.vehicleType || '14ft Box Truck';
                const driverName = item.driverName || 'Tan Wei Ming (Partner Driver)';
                const driverPhone = item.driverPhone || '+65 9123 4567';
                const goodsDescription = item.cargoType || 'Commercial Precision Goods';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          <Truck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-slate-900">{item.id}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]" title={goodsDescription}>
                            {goodsDescription}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono">{item.weight || '2,400 kg'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-700">
                      <div className="flex items-start space-x-1.5 max-w-[150px]">
                        <MapPin className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] truncate" title={item.origin || item.senderAddress}>
                          {item.origin || item.senderAddress || 'Jurong Central Freight Hub'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-700">
                      <div className="flex items-start space-x-1.5 max-w-[150px]">
                        <MapPin className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] truncate" title={item.destination || item.receiverAddress}>
                          {item.destination || item.receiverAddress || 'Woodlands Checkpoint Depot'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 truncate max-w-[160px]" title={partnerName}>
                            {partnerName}
                          </p>
                          <span className="text-[9px] text-emerald-600 font-bold">Third-Party Partner</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-mono font-bold text-slate-900">{vehiclePlate} <span className="font-sans font-normal text-slate-400 text-[10px]">({vehicleType})</span></p>
                        <p className="text-[10px] text-slate-600">{driverName}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{driverPhone}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value)}
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
                      <button
                        onClick={() => onViewShipment(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#FF6B00] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
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
    </div>
  );
};
