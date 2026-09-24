import React from 'react';
import { 
  Package, 
  Plane, 
  Truck, 
  Clock, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Eye, 
  Filter 
} from 'lucide-react';

export const DashboardOverviewTab = ({
  shipments = [],
  serviceRequests = [],
  documents = [],
  onNavigateTab,
  onViewShipment,
  onViewRequest,
  liveDate,
  liveTime
}) => {
  // 6 KPI Calculations strictly based on actual data
  const totalShipments = shipments.length;
  const airwayShipments = shipments.filter(s => 
    s.service === 'Airway Services' || 
    s.serviceType?.toLowerCase().includes('air') || 
    s.type === 'air' ||
    s.mode === 'Air'
  ).length;
  const roadShipments = shipments.filter(s => 
    s.service === 'Road Transportation' || 
    s.serviceType?.toLowerCase().includes('road') || 
    s.type === 'road' ||
    s.mode === 'Road' ||
    (!s.service?.includes('Air') && !s.serviceType?.includes('air'))
  ).length;
  const pendingRequests = serviceRequests.filter(r => 
    r.status === 'Pending' || r.status === 'Under Review'
  ).length;
  const documentationRequests = documents.filter(d => 
    d.status === 'Pending' || d.status === 'Under Review' || d.status === 'Submitted'
  ).length;
  const completedShipments = shipments.filter(s => 
    s.status === 'Delivered' || s.status === 'Completed'
  ).length;

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

  const getRequestStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Quoted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Operations Control
            </span>
            <span className="text-xs font-bold text-slate-400">Singapore Commercial Logistics</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">Admin Operations Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium">
            Airway Services, Third-Party Road Transportation & Consignment Documentation
          </p>
        </div>
        <div className="flex items-center space-x-2.5 text-xs text-slate-600 self-start sm:self-auto bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
          <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
          <div className="text-left sm:text-right leading-tight">
            <div className="font-bold text-slate-700 text-xs">{liveDate || 'Singapore Time'}</div>
            <div className="text-[11px] font-semibold text-slate-400 font-mono">{liveTime || 'UTC+8 (SGT)'}</div>
          </div>
        </div>
      </div>

      {/* 6 CONFIRMED DASHBOARD KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* 1. Total Shipments */}
        <div 
          onClick={() => onNavigateTab('shipments')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 border-t-4 border-t-[#0B132B] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              {totalShipments}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Total Shipments</p>
          </div>
        </div>

        {/* 2. Airway Shipments */}
        <div 
          onClick={() => onNavigateTab('airway_services')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 border-t-4 border-t-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Airway</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Plane className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              {airwayShipments}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Airway Shipments</p>
          </div>
        </div>

        {/* 3. Road Shipments */}
        <div 
          onClick={() => onNavigateTab('road_transportation')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 border-t-4 border-t-orange-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Road</span>
            <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              {roadShipments}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Road Shipments</p>
          </div>
        </div>

        {/* 4. Pending Requests */}
        <div 
          onClick={() => onNavigateTab('service_requests')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 border-t-4 border-t-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Inquiries</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              {pendingRequests}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Pending Requests</p>
          </div>
        </div>

        {/* 5. Documentation Requests */}
        <div 
          onClick={() => onNavigateTab('documentation')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 border-t-4 border-t-purple-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Compliance</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              {documentationRequests}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Documentation Requests</p>
          </div>
        </div>

        {/* 6. Completed Shipments */}
        <div 
          onClick={() => onNavigateTab('shipments')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Fulfilled</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              {completedShipments}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Completed Shipments</p>
          </div>
        </div>
      </div>

      {/* OPERATIONS TABLES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TABLE 1: RECENT SHIPMENTS TABLE */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Recent Shipments</h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Shipment pipeline: New → Documentation → Processing → In Transit → Delivered → Completed
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('shipments')}
              className="text-xs font-bold text-[#FF6B00] hover:text-orange-600 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-bold">Shipment ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Service</th>
                  <th className="pb-3 font-bold">Origin</th>
                  <th className="pb-3 font-bold">Destination</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {shipments.slice(0, 6).map((shipment) => {
                  const serviceLabel = shipment.service || (shipment.serviceType?.toLowerCase().includes('air') ? 'Airway Services' : 'Road Transportation');
                  const isAir = serviceLabel.includes('Airway') || serviceLabel.includes('Air');
                  const customerName = shipment.customer || shipment.customerName || shipment.sender || 'Corporate Shipper';
                  const origin = shipment.origin || 'Singapore Logistics Hub';
                  const destination = shipment.destination || 'Singapore Commercial Bay';

                  return (
                    <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-900">
                        <button
                          onClick={() => onViewShipment(shipment)}
                          className="hover:text-orange-600 hover:underline cursor-pointer inline-flex items-center space-x-1.5"
                        >
                          <span>{shipment.id}</span>
                        </button>
                      </td>
                      <td className="py-3 text-slate-800 font-semibold truncate max-w-[130px]" title={customerName}>
                        {customerName}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center space-x-1 text-[11px] font-bold ${
                          isAir ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {isAir ? <Plane className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                          <span className="truncate max-w-[110px]">{serviceLabel}</span>
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 truncate max-w-[110px]" title={origin}>
                        {origin}
                      </td>
                      <td className="py-3 text-slate-600 truncate max-w-[110px]" title={destination}>
                        {destination}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onViewShipment(shipment)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#FF6B00] hover:text-white text-slate-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 2: RECENT SERVICE REQUESTS TABLE */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Recent Service Requests</h2>
              <p className="text-[11px] text-slate-400 font-medium">Customer inquiry and booking submissions</p>
            </div>
            <button
              onClick={() => onNavigateTab('service_requests')}
              className="text-xs font-bold text-[#FF6B00] hover:text-orange-600 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-bold">Request ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Service</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {serviceRequests.slice(0, 6).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900">
                      <button
                        onClick={() => onViewRequest(req)}
                        className="hover:text-orange-600 hover:underline cursor-pointer"
                      >
                        #{req.id}
                      </button>
                    </td>
                    <td className="py-3 text-slate-800 font-semibold truncate max-w-[110px]" title={req.customer || req.customerName}>
                      {req.customer || req.customerName}
                    </td>
                    <td className="py-3 text-slate-600 truncate max-w-[100px]" title={req.service}>
                      {req.service}
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                      {req.date || req.createdAt?.split(' ')[0] || 'Today'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRequestStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onViewRequest(req)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-[#FF6B00] hover:text-white text-slate-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
