import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Truck, 
  Navigation, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Radio, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Send, 
  Search, 
  Filter, 
  Zap, 
  Battery, 
  Wifi, 
  UserCheck, 
  MapPin, 
  X,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export default function CrmDriverFleetTab() {
  const { 
    drivers = [], 
    shipments = [], 
    isSocketConnected, 
    assignDriverToShipment, 
    showToast 
  } = useLogistics();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [dispatchShipmentId, setDispatchShipmentId] = useState('');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Filtered drivers list
  const filteredDrivers = drivers.filter(d => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term || 
      (d.name && d.name.toLowerCase().includes(term)) ||
      (d.vehicleType && d.vehicleType.toLowerCase().includes(term)) ||
      (d.vehicleId && d.vehicleId.toLowerCase().includes(term)) ||
      (d.phone && d.phone.toLowerCase().includes(term));
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate live stats
  const totalDrivers = drivers.length;
  const activeDeliveryCount = drivers.filter(d => d.status === 'On Delivery' || d.status === 'In Transit').length;
  const availableCount = drivers.filter(d => d.status === 'Available' || d.status === 'Online').length;
  const offlineCount = drivers.filter(d => d.status === 'Offline').length;

  // Unassigned / Pending Shipments for dispatch modal
  const pendingShipments = shipments.filter(s => s.status === 'Booking Confirmed' || s.status === 'Pickup Scheduled' || !s.driverId);

  const handleOpenDispatch = (driver) => {
    setSelectedDriver(driver);
    setDispatchShipmentId(pendingShipments[0]?.id || '');
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!selectedDriver || !dispatchShipmentId) {
      showToast('Please select a valid shipment for dispatch', 'error');
      return;
    }
    const success = assignDriverToShipment(dispatchShipmentId, selectedDriver.id);
    if (success) {
      setIsDispatchModalOpen(false);
      setSelectedDriver(null);
    }
  };

  return (
    <div className="space-[#1e293b] space-y-6">
      {/* Top Banner & Telematics Indicator */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${isSocketConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                {isSocketConnected ? 'Live Driver Telematics & Socket Sync Online' : 'Simulation Mode (Socket Reconnecting)'}
              </span>
              <span className="text-xs text-slate-400">Updates via Socket.IO Port 5001</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Driver App Telematics & Dispatch Operations</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Monitor active drivers in real time, view live GPS location pings, battery/signal health, and dispatch customer shipments directly from CRM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 text-center">
              <span className="text-xs text-slate-400 block font-medium">Active Telematics</span>
              <span className="text-xl font-black text-emerald-400">{activeDeliveryCount} / {totalDrivers}</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 text-center">
              <span className="text-xs text-slate-400 block font-medium">Available Fleet</span>
              <span className="text-xl font-black text-blue-400">{availableCount}</span>
            </div>
          </div>
        </div>

        {/* Quick Fleet Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Registered Fleet</p>
              <p className="text-base font-bold text-white">{totalDrivers} Mobile Drivers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">On Delivery</p>
              <p className="text-base font-bold text-emerald-400">{activeDeliveryCount} En Route</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Ready for Dispatch</p>
              <p className="text-base font-bold text-sky-400">{availableCount} Available</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700/40 text-slate-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Offline Drivers</p>
              <p className="text-base font-bold text-slate-300">{offlineCount} Standby</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search driver by name, phone, vehicle plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Status:</span>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            {['All', 'Available', 'On Delivery', 'Offline'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(driver => {
          const isOnline = driver.status !== 'Offline';
          const isOnDelivery = driver.status === 'On Delivery' || driver.status === 'In Transit';

          return (
            <div 
              key={driver.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 relative flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Status Badge & Rating */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={driver.photo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"} 
                        alt={driver.name} 
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                        isOnDelivery ? 'bg-emerald-500 animate-pulse' : isOnline ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{driver.name}</h3>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {driver.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {driver.phone}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isOnDelivery 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : isOnline 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {isOnDelivery && <Zap className="w-3 h-3 animate-spin text-emerald-600" />}
                    {driver.status}
                  </span>
                </div>

                {/* Vehicle & Telematics Details */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-2 text-xs mb-4">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      Vehicle Plate:
                    </span>
                    <span className="font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {driver.vehicleId || driver.vehiclePlate || 'SG-8819'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Vehicle Category:</span>
                    <span className="font-semibold text-slate-800">{driver.vehicleType || 'Express Cargo Van'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      Live GPS Ping:
                    </span>
                    <span className="font-mono text-slate-900 text-[11px] font-semibold">
                      {driver.lastLocation || '1.3521, 103.8200 (Singapore)'}
                    </span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs border-y border-slate-100 py-3 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Completed</span>
                    <span className="font-extrabold text-slate-800">{driver.deliveriesCompleted || 120}+</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">On-Time</span>
                    <span className="font-extrabold text-emerald-600">{driver.onTimeRate || '99.2%'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Safety Rating</span>
                    <span className="font-extrabold text-blue-600 flex items-center justify-center gap-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {driver.rating || 4.9}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleOpenDispatch(driver)}
                  disabled={isOnDelivery}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isOnDelivery
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {isOnDelivery ? 'On Active Delivery' : 'Dispatch Shipment'}
                </button>

                <a
                  href={`tel:${driver.phone}`}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
                  title="Call Driver"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch Modal */}
      {isDispatchModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsDispatchModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Direct CRM Driver Dispatch</h3>
                <p className="text-xs text-slate-500">Assign pending customer shipment to driver roster</p>
              </div>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                <img 
                  src={selectedDriver.photo} 
                  alt={selectedDriver.name} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedDriver.name}</h4>
                  <p className="text-xs text-slate-500">{selectedDriver.vehicleType} • Plate {selectedDriver.vehicleId || selectedDriver.vehiclePlate}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Pending Customer Shipment:
                </label>
                {pendingShipments.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-200">
                    No unassigned pending shipments found. Create or select a shipment in the main portal.
                  </div>
                ) : (
                  <select
                    value={dispatchShipmentId}
                    onChange={(e) => setDispatchShipmentId(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {pendingShipments.map(s => (
                      <option key={s.id} value={s.id}>
                        Order #{s.id} — {s.cargoType || 'Freight'} ({s.origin?.split(',')[0]} → {s.destination?.split(',')[0]})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pendingShipments.length === 0}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
