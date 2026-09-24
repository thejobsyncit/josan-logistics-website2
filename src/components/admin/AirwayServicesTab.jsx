import React, { useState } from 'react';
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
  AlertCircle 
} from 'lucide-react';

export const AirwayServicesTab = ({
  shipments = [],
  onViewShipment,
  onUpdateStatus,
  onUpdateAwbDetails
}) => {
  const [search, setSearch] = useState('');
  const [selectedAirwayShipment, setSelectedAirwayShipment] = useState(null);

  // Filter airway shipments only
  const airwayShipments = shipments.filter(s => 
    s.service === 'Airway Services' || 
    s.serviceType?.toLowerCase().includes('air') || 
    s.type === 'air' ||
    s.mode === 'Air'
  );

  const filtered = airwayShipments.filter(s => {
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
            <span className="text-xs font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Airway Operations
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {airwayShipments.length} Active Airway Consignments
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Airway Services & AWB Management</h2>
          <p className="text-xs text-slate-500">
            AWB preparation, AWB billing, shipment documentation, and airport transportation support.
          </p>
        </div>
      </div>

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
          <div className="flex items-center space-x-2 text-blue-700 font-extrabold text-xs">
            <FileText className="w-4 h-4" />
            <span>AWB Preparation</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
            Standard Air Waybill issuance, IATA master documentation and carrier booking support.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-xs">
            <CreditCard className="w-4 h-4" />
            <span>AWB Billing</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
            Consolidated freight rate calculation, terminal handling charges, and documentation disbursements.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
          <div className="flex items-center space-x-2 text-purple-700 font-extrabold text-xs">
            <FileCheck className="w-4 h-4" />
            <span>Shipment Documentation</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
            Commercial invoice, packing list, certificate of origin, and customs clearance support.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
          <div className="flex items-center space-x-2 text-orange-700 font-extrabold text-xs">
            <Truck className="w-4 h-4" />
            <span>Transportation Support</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
            Local feeder connection between shipper premises and Changi Airport cargo terminal.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
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
      </div>

      {/* Airway Consignments Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3">AWB Details</th>
              <th className="p-3">Customer / Shipper</th>
              <th className="p-3">Carrier Support</th>
              <th className="p-3">Origin / Destination</th>
              <th className="p-3">AWB Billing</th>
              <th className="p-3">Docs Status</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  No airway consignments found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const awbNum = item.awbNumber || `AWB-${item.id.replace(/\D/g, '').slice(-7) || '618-29401'}`;
                const carrier = item.carrierSupport || item.carrier || 'Singapore Airlines Cargo (SQ)';
                const cust = item.customer || item.customerName || item.sender || 'Changi Aviation Client';
                const billingAmount = item.price || 'S$ 1,450.00';
                const billingStatus = item.paymentStatus || 'Billed';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
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
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{cust}</p>
                      <p className="text-[10px] text-slate-400">{item.senderPhone || '+65 6543 2100'}</p>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700 block">{carrier}</span>
                      <span className="text-[10px] text-slate-400">Changi Air Cargo Gate 4</span>
                    </td>
                    <td className="p-3 text-slate-600">
                      <p className="font-semibold text-slate-800">{item.origin || 'SIN - Singapore Changi'}</p>
                      <p className="text-[10px] text-slate-400">↳ {item.destination || 'BKK - Bangkok Suvarnabhumi'}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-mono font-bold text-slate-900">{billingAmount}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        billingStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {billingStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        Docs Ready (4/4)
                      </span>
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
  );
};
