import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { RealTruckGraphic } from '../components/RealTruckGraphic';
import { SingaporeGoogleMapBackground } from '../components/SingaporeGoogleMapBackground';
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
  ChevronRight,
  X,
  Maximize2
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
  const [fullscreenMapShipment, setFullscreenMapShipment] = useState(null);
  const mapSectionRef = useRef(null);

  // Live Moving Anime Truck animation state
  const [truckProgress, setTruckProgress] = useState(20);
  const [currentSpeed, setCurrentSpeed] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setTruckProgress(prev => (prev >= 80 ? 20 : prev + 0.35));
      setCurrentSpeed(64 + Math.floor(Math.random() * 8));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTrackingId) {
      setSearchInput(activeTrackingId);
      const found = getShipmentByTracking(activeTrackingId);
      if (found) setCurrentShipment(found);
    }
  }, [activeTrackingId, shipments]);

  const openFullscreenMap = (sampleOrId) => {
    let found = null;
    if (typeof sampleOrId === 'string') {
      found = getShipmentByTracking(sampleOrId) || shipments.find(s => s.id.toUpperCase() === sampleOrId.toUpperCase());
    } else if (sampleOrId && sampleOrId.id) {
      found = getShipmentByTracking(sampleOrId.id) || shipments.find(s => s.id.toUpperCase() === sampleOrId.id.toUpperCase());
    }
    
    if (!found && typeof sampleOrId === 'object') {
      found = {
        id: sampleOrId.id,
        origin: sampleOrId.origin,
        destination: sampleOrId.dest || sampleOrId.destination || 'Singapore Hub',
        status: sampleOrId.status || 'In Transit',
        driverName: sampleOrId.driver || 'Tan Wei Ming',
        estimatedDelivery: 'Today, 4:30 PM (SGT)'
      };
    }

    if (!found) {
      found = shipments[0] || {
        id: 'JOS-88190-SG',
        origin: 'Changi Air Cargo Complex',
        destination: 'Jurong Port Industrial Estate',
        status: 'In Transit',
        driverName: 'Tan Wei Ming',
        estimatedDelivery: 'Today, 4:30 PM (SGT)'
      };
    }

    setCurrentShipment(found);
    setSearchInput(found.id);
    setActiveTrackingId(found.id);
    setFullscreenMapShipment(found);
    showToast(`Fullscreen satellite tracking opened for ${found.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
<<<<<<< HEAD
      openFullscreenMap(searchInput.trim());
=======
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
>>>>>>> 854782f4d2a83145f0c8b4c19ee573a45837e1ed
    }
  };

  const handleSelectDemo = (sampleOrId) => {
    openFullscreenMap(sampleOrId);
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

<<<<<<< HEAD
        {/* Demo Selector Cards - Individual Live Tracking for Each Shipment */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-700 text-xs uppercase tracking-wider block">
              Singapore Live Dispatch Tracking Queue (Click any parcel to track live):
            </span>
            <span className="text-[11px] text-orange-600 font-bold">4 Active Telematics Feeds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { id: 'JOS-88190-SG', status: 'In Transit', statusBg: 'bg-orange-100 text-orange-800 border-orange-200', origin: 'Changi Air Cargo', dest: 'Jurong Port Hub', driver: 'Tan Wei Ming' },
              { id: 'JOS-44021-SG', status: 'Out for Delivery', statusBg: 'bg-blue-100 text-blue-800 border-blue-200', origin: 'Pasir Panjang Terminal', dest: 'Woodlands Tech Park', driver: 'Muhammad Rizal' },
              { id: 'JOS-66301-SG', status: 'Delivered', statusBg: 'bg-emerald-100 text-emerald-800 border-emerald-200', origin: 'Tuas Mega Port', dest: 'Biopolis Bio-Hub', driver: 'Gurpreet Singh' },
              { id: 'JOS-99210-SG', status: 'Monsoon Rain Delay', statusBg: 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse', origin: 'Jurong Logistics Hub', dest: 'Woodlands Checkpoint', driver: 'Robert Martinez' }
            ].map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleSelectDemo(sample.id)}
                className={`p-4 rounded-2xl transition-all border flex flex-col justify-between cursor-pointer space-y-3 ${
                  currentShipment?.id === sample.id
                    ? 'bg-slate-900 text-white border-orange-500 shadow-xl ring-2 ring-orange-500/40'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-sm">{sample.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${sample.statusBg}`}>
                    ● {sample.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-[11px] opacity-90 truncate">{sample.origin} → {sample.dest}</p>
                  <p className="text-[10px] opacity-75">Driver: {sample.driver}</p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFullscreenMap(sample);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-orange-sm active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 animate-pulse" />
                  <span>Enter GPS Tracker →</span>
                </button>
              </div>
            ))}
          </div>
=======
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
>>>>>>> 854782f4d2a83145f0c8b4c19ee573a45837e1ed
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
            <div ref={mapSectionRef} className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 relative overflow-hidden scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-orange-400" />
                  <span className="font-extrabold text-sm">Live GPS Telematics Map Simulation</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">Route: {currentShipment.origin} → {currentShipment.destination}</span>
                  <button
                    onClick={() => setFullscreenMapShipment(currentShipment)}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand Fullscreen Map</span>
                  </button>
                </div>
              </div>

              {/* Simulated Map Container with Singapore Google Map Vector */}
              <div className="relative h-80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <SingaporeGoogleMapBackground 
                  origin={currentShipment.origin}
                  destination={currentShipment.destination}
                  vehicle={currentShipment.driverName ? `${currentShipment.driverName}'s Truck` : 'Josan EV Semi-Truck'}
                  truckProgress={truckProgress}
                  currentSpeed={currentSpeed}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Telematics Satellite Lock: <strong className="text-emerald-400">ONLINE (100% Signal)</strong></span>
                <span>Speed: <strong className="text-orange-400 font-mono font-bold">{currentSpeed} mph</strong></span>
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

      {/* FULLSCREEN LIVE GPS MAP MODAL OVERLAY */}
      {fullscreenMapShipment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 bg-slate-900/85 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-700 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header Bar */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-gradient text-white flex items-center justify-center font-extrabold text-sm shadow-orange-sm">
                  📡
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-base sm:text-lg text-white">{fullscreenMapShipment.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500 text-white shadow-xs">
                      ● {fullscreenMapShipment.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Live Satellite GPS Telematics | {fullscreenMapShipment.origin} → {fullscreenMapShipment.destination}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setFullscreenMapShipment(null)}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-extrabold transition-all border border-rose-500/40 flex items-center space-x-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close Fullscreen Map</span>
              </button>
            </div>

            {/* Main Interactive Google Map Canvas Overlay */}
            <div className="flex-1 relative w-full h-full bg-slate-100 overflow-hidden">
              <SingaporeGoogleMapBackground
                origin={fullscreenMapShipment.origin}
                destination={fullscreenMapShipment.destination}
                vehicle={fullscreenMapShipment.driverName ? `${fullscreenMapShipment.driverName}'s Heavy Semi-Truck` : 'Josan EV Express Truck'}
                truckProgress={truckProgress}
                currentSpeed={currentSpeed}
              />
            </div>

            {/* Modal Footer HUD */}
            <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 text-xs shrink-0">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Driver</p>
                  <p className="font-extrabold text-white text-xs">{fullscreenMapShipment.driverName || 'Tan Wei Ming'}</p>
                </div>
                <div className="border-l border-slate-800 pl-4 sm:pl-6">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Speed Telemetry</p>
                  <p className="font-extrabold text-orange-400 text-xs font-mono">{currentSpeed} mph</p>
                </div>
                <div className="border-l border-slate-800 pl-4 sm:pl-6">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Est Arrival</p>
                  <p className="font-extrabold text-emerald-400 text-xs">{fullscreenMapShipment.estimatedDelivery || 'Today, 4:30 PM (SGT)'}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedInvoiceShipment(fullscreenMapShipment);
                  setFullscreenMapShipment(null);
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Freight Invoice</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
