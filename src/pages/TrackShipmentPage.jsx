import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Search, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  ShieldCheck, 
  Phone, 
  Printer, 
  Navigation,
  Package,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const TrackShipmentPage = () => {
  const { 
    shipments, 
    activeTrackingId, 
    setActiveTrackingId, 
    getShipmentByTracking,
    setSelectedInvoiceShipment,
    showToast
  } = useLogistics();

  const [searchInput, setSearchInput] = useState(activeTrackingId || 'JOS-88190-SG');
  const [currentShipment, setCurrentShipment] = useState(() => getShipmentByTracking(searchInput));

  useEffect(() => {
    if (activeTrackingId) {
      setSearchInput(activeTrackingId);
      const found = getShipmentByTracking(activeTrackingId);
      if (found) setCurrentShipment(found);
    }
  }, [activeTrackingId, shipments]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const found = getShipmentByTracking(searchInput.trim());
      if (found) {
        setCurrentShipment(found);
        setActiveTrackingId(found.id);
        showToast(`Tracking record loaded for ${found.id}`);
      } else {
        showToast(`No shipment found matching "${searchInput}". Showing Singapore demo order JOS-88190-SG`, 'warning');
        const fallback = getShipmentByTracking('JOS-88190-SG');
        setCurrentShipment(fallback);
      }
    }
  };

  const handleSelectDemo = (id) => {
    setSearchInput(id);
    setActiveTrackingId(id);
    const found = getShipmentByTracking(id);
    if (found) setCurrentShipment(found);
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Header & Search Bar Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-2 border border-orange-200">
              <Navigation className="w-3.5 h-3.5" />
              <span>Singapore Telematics Satellite Network</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-sans">Live Freight Tracking (Singapore)</h1>
          </div>

          <button
            onClick={() => setSelectedInvoiceShipment(currentShipment)}
            className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>View Freight Invoice</span>
          </button>
        </div>

        {/* Highlighted Orange Tracking Input */}
        <form onSubmit={handleSearchSubmit} className="bg-orange-500 p-2 sm:p-3 rounded-2xl shadow-orange-glow">
          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full flex-1">
              <Search className="w-5 h-5 text-orange-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Tracking Number (e.g. JOS-88190-SG)..."
                className="w-full pl-11 pr-4 py-3 text-sm font-extrabold text-slate-900 bg-transparent border-none focus:outline-none placeholder:text-slate-400 uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-orange-gradient hover:bg-orange-600 text-white rounded-lg font-bold text-sm shadow-md transition-all shrink-0"
            >
              Search Parcel
            </button>
          </div>
        </form>

        {/* Demo Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">Singapore Dispatch Samples:</span>
          {[
            { id: 'JOS-88190-SG', label: 'In Transit (Changi → Jurong)' },
            { id: 'JOS-44021-SG', label: 'Out for Delivery (Pasir Panjang)' },
            { id: 'JOS-66301-SG', label: 'Delivered (Pharma Bio-Hub)' },
            { id: 'JOS-99210-SG', label: 'Monsoon Rain Delay (Tuas Port)' }
          ].map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectDemo(sample.id)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition-all border ${
                currentShipment?.id === sample.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-orange-400'
              }`}
            >
              {sample.id} <span className="font-sans font-normal opacity-80">({sample.label})</span>
            </button>
          ))}
        </div>

      </div>

      {currentShipment && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Status & Interactive Timeline */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Status Header Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Identifier</p>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-mono">{currentShipment.id}</h2>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase flex items-center space-x-2 ${
                    currentShipment.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentShipment.status === 'Delayed'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                      : 'bg-orange-100 text-orange-800 border border-orange-300 pulse-badge'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      currentShipment.status === 'Delivered' ? 'bg-emerald-500' : currentShipment.status === 'Delayed' ? 'bg-amber-500' : 'bg-orange-500'
                    }`}></span>
                    <span>{currentShipment.status}</span>
                  </span>
                </div>
              </div>

              {/* Current Location & Estimated Delivery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Current Location</p>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5 flex items-center space-x-1 text-orange-600">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{currentShipment.currentLocation}</span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Estimated SLA Delivery</p>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5 flex items-center space-x-1">
                    <Clock className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>{currentShipment.estimatedDelivery}</span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Service Class</p>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{currentShipment.serviceLevel}</p>
                </div>
              </div>

              {/* AUTOMATED WEATHER & TELEMATICS RADAR ALERT BANNER */}
              {(currentShipment.status === 'Delayed' || currentShipment.weatherDelay?.active) && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-amber-900 font-extrabold text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce" />
                      <span>Automated Weather & Telematics Radar Alert</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase font-mono text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                      Live Dispatch Alert Active
                    </span>
                  </div>

                  <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                    ⛈️ <strong>Weather Condition Flagged:</strong> {currentShipment.weatherDelay?.condition || 'Heavy Thunderstorm & Flash Flood Alert on Highway Corridor (Wind: 55 mph)'}. Our automated satellite telematics system flagged route safety hazards and adjusted speed SLA for cargo protection.
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
                    <div className="flex items-center space-x-1.5 text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>📱 <strong>SMS Notification Sent:</strong> Recipient notified via mobile</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <span>📧 <strong>Email Alert Issued:</strong> Detailed telematics log delivered</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DELIVERY TIMELINE (ORANGE PROGRESS INDICATORS) */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-6">Delivery Timeline Stepper</h3>
                
                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-slate-200">
                  {currentShipment.timeline.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent = step.current;

                    return (
                      <div key={idx} className="relative flex items-start space-x-4 group">
                        
                        {/* Timeline Node Icon */}
                        <div className={`absolute -left-6 sm:-left-8 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                          isCurrent
                            ? 'bg-orange-500 text-white ring-4 ring-orange-100 pulse-badge scale-110 shadow-orange-sm'
                            : isCompleted
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div className={`flex-1 p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-orange-50/70 border-orange-200 shadow-sm'
                            : isCompleted
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-orange-600' : 'text-slate-900'}`}>
                              {step.title}
                            </h4>
                            <span className="text-[11px] font-semibold text-slate-500 font-mono">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{step.location}</span>
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Simulated Live Route Progress Visual Map */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-orange-400" />
                  <span className="font-extrabold text-sm">Live GPS Telematics Map Simulation</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: {currentShipment.origin} → {currentShipment.destination}</span>
              </div>

              {/* Simulated Map Container */}
              <div className="relative h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                
                {/* SVG Route Line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="#334155" strokeWidth="4" strokeDasharray="6 6" />
                  <line x1="15%" y1="50%" x2="55%" y2="50%" stroke="#F26722" strokeWidth="4" />
                </svg>

                {/* Origin Marker */}
                <div className="absolute left-[15%] flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 text-white flex items-center justify-center text-[10px] font-bold">A</div>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">{currentShipment.origin}</span>
                </div>

                {/* Moving Pulse Truck Marker */}
                <div className="absolute left-[55%] -translate-x-1/2 flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-orange-glow pulse-badge">
                    <Truck className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-orange-400 font-bold mt-1 bg-slate-900/90 px-2 py-0.5 rounded border border-orange-500/30">
                    {currentShipment.currentLocation}
                  </span>
                </div>

                {/* Destination Marker */}
                <div className="absolute right-[15%] flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 text-white flex items-center justify-center text-[10px] font-bold">B</div>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">{currentShipment.destination}</span>
                </div>

              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Telematics Satellite Lock: <strong className="text-emerald-400">ONLINE (100% Signal)</strong></span>
                <span>Speed: <strong className="text-white">68 mph</strong></span>
              </div>
            </div>

          </div>

          {/* Right Sidebar Specs & Driver Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Driver Specs Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Assigned Driver & Vehicle</h3>
              
              <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center border-2 border-orange-300">
                  {currentShipment.driverName ? currentShipment.driverName.charAt(0) : 'D'}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{currentShipment.driverName || 'Gurpreet Singh'}</h4>
                  <p className="text-xs text-orange-600 font-semibold">{currentShipment.vehicle}</p>
                  <p className="text-[10px] text-slate-500">License: Valid & Verified</p>
                </div>
              </div>

              <a
                href={`tel:${currentShipment.driverPhone || '+15553928810'}`}
                className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold text-xs border border-orange-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver ({currentShipment.driverPhone || '+1 555-0192'})</span>
              </a>
            </div>

            {/* Parcel Freight Details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 text-xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Package Specifications</h3>
              
              <div className="space-y-3 divide-y divide-slate-100">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Sender / Originator:</span>
                  <span className="font-bold text-slate-900">{currentShipment.sender}</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-500">Receiver / Destination:</span>
                  <span className="font-bold text-slate-900">{currentShipment.receiver}</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-500">Cargo Type:</span>
                  <span className="font-bold text-slate-900">{currentShipment.cargoType}</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-500">Weight & Quantity:</span>
                  <span className="font-mono font-bold text-slate-900">{currentShipment.weight} ({currentShipment.pieces || 1} Pcs)</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-500">Declared Value:</span>
                  <span className="font-mono font-bold text-slate-900">{currentShipment.declaredValue || '$15,000'}</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-500">Freight Fee Paid:</span>
                  <span className="font-mono font-bold text-orange-600">{currentShipment.price}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedInvoiceShipment(currentShipment)}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-orange-sm transition-all text-center"
                >
                  Generate Official Bill of Lading
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
