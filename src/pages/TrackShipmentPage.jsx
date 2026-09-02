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
  Maximize2,
  ArrowLeft
} from 'lucide-react';

export const TrackShipmentPage = ({ setActiveTab }) => {
  const { 
    shipments, 
    activeTrackingId, 
    setActiveTrackingId, 
    getShipmentByTracking, 
    setSelectedInvoiceShipment,
    showToast
  } = useLogistics();

  const [searchInput, setSearchInput] = useState(activeTrackingId || 'JOS-88190-SG');
  
  const resolveShipmentData = (sampleOrId) => {
    let searchStr = '';
    if (typeof sampleOrId === 'string') {
      searchStr = sampleOrId.trim();
    } else if (sampleOrId && sampleOrId.id) {
      searchStr = sampleOrId.id.trim();
    }

    let found = getShipmentByTracking(searchStr) || shipments.find(s => s?.id?.toUpperCase() === searchStr.toUpperCase());

    if (!found && typeof sampleOrId === 'object' && sampleOrId.id) {
      found = {
        id: sampleOrId.id || 'JOS-88190-SG',
        origin: sampleOrId.origin || 'Changi Air Cargo',
        destination: sampleOrId.dest || sampleOrId.destination || 'Jurong Port Hub',
        status: sampleOrId.status || 'In Transit',
        currentLocation: 'Pan Island Expressway (PIE) KM 18.4',
        driverName: sampleOrId.driver || sampleOrId.driverName || 'Tan Wei Ming',
        driverPhone: '+65 9123 4567',
        vehicle: 'Josan EV Express Cargo Truck (SG-8819)',
        sender: 'TechCorp Solutions SG',
        senderAddress: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
        receiver: 'Apex Dynamics SG Hub',
        receiverAddress: '89 Orchard Road, Singapore 238854',
        weight: '180.0 kg',
        pieces: 2,
        cargoType: 'General Goods',
        serviceLevel: 'Express Freight (SG Same-Day)',
        declaredValue: '$12,000',
        price: '$890.00',
        createdDate: 'Aug 29, 2026',
        estimatedDelivery: 'Today, 4:30 PM (SGT)',
        timeline: [
          { title: 'Parcel Registered in Telematics System', timestamp: 'Today 09:00 AM', location: 'Singapore Depot', completed: true },
          { title: 'Active In-Transit Satellite Tracking', timestamp: 'Today 11:30 AM', location: 'PIE Expressway', completed: true, current: true },
          { title: 'Delivered to Receiver', timestamp: 'Pending', location: 'Destination Hub', completed: false }
        ]
      };
    }

    if (!found) {
      const trackingCode = (searchStr || 'JOS-88190-SG').toUpperCase();
      found = {
        id: trackingCode,
        origin: 'Changi Air Cargo Complex',
        destination: 'Jurong Port Industrial Estate',
        status: 'In Transit',
        currentLocation: 'Pan Island Expressway (PIE) KM 18.4',
        driverName: 'Tan Wei Ming',
        driverPhone: '+65 9123 4567',
        vehicle: 'Josan EV Express Cargo Truck (SG-8819)',
        sender: 'TechCorp Solutions SG',
        senderAddress: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
        receiver: 'Apex Dynamics SG Hub',
        receiverAddress: '89 Orchard Road, Singapore 238854',
        weight: '180.0 kg',
        pieces: 2,
        cargoType: 'General Goods',
        serviceLevel: 'Express Freight (SG Same-Day)',
        declaredValue: '$12,000',
        price: '$890.00',
        createdDate: 'Aug 29, 2026',
        estimatedDelivery: 'Today, 4:30 PM (SGT)',
        timeline: [
          { title: 'Parcel Registered in Telematics System', timestamp: 'Today 09:00 AM', location: 'Singapore Depot', completed: true },
          { title: 'Active In-Transit Satellite Tracking', timestamp: 'Today 11:30 AM', location: 'PIE Expressway', completed: true, current: true },
          { title: 'Delivered to Receiver', timestamp: 'Pending', location: 'Destination Hub', completed: false }
        ]
      };
    }

    return found;
  };

  const [currentShipment, setCurrentShipment] = useState(() => resolveShipmentData(searchInput));
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
      const found = resolveShipmentData(activeTrackingId);
      if (found) setCurrentShipment(found);
    }
  }, [activeTrackingId, shipments]);

  // Handle browser back button (popstate) to close fullscreen GPS modal safely without leaving app
  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.hash.startsWith('#track-map-')) {
        setFullscreenMapShipment(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openFullscreenMap = (sampleOrId) => {
    const found = resolveShipmentData(sampleOrId);
    setFullscreenMapShipment(found);
  };

  const handleSelectDemo = (sampleOrId) => {
    const found = resolveShipmentData(sampleOrId);
    setCurrentShipment(found);
    setSearchInput(found.id);
    setActiveTrackingId(found.id);
    if (showToast) showToast(`Loaded live satellite tracking feed for ${found.id}`);
  };

  const closeFullscreenMap = () => {
    setFullscreenMapShipment(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      handleSelectDemo(searchInput.trim());
    }
  };

  const handleViewInvoice = () => {
    const shipmentToView = currentShipment || shipments[0] || resolveShipmentData('JOS-88190-SG');
    setSelectedInvoiceShipment(shipmentToView);
    if (showToast) showToast(`Viewing Official Freight Bill & Invoice for #${shipmentToView.id}`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Top Header Card with Prominent Return to Dashboard Button */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => {
              if (setActiveTab) {
                setActiveTab('customer-dashboard');
              } else {
                window.location.hash = '#customer-dashboard';
              }
            }}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to Dashboard</span>
          </button>
          
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-200">
              <Navigation className="w-3.5 h-3.5" />
              <span>Singapore Telematics Satellite Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-1">Live Demo GPS Tracker</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedInvoiceShipment(currentShipment)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>View Freight Invoice</span>
          </button>
        </div>
      </div>



      {/* Search Bar & Demo Parcel Switcher */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
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
              className="w-full sm:w-auto px-8 py-3 bg-orange-gradient hover:bg-orange-600 text-white rounded-lg font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
            >
              Search Parcel
            </button>
          </div>
        </form>

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
                onClick={() => handleSelectDemo(sample)}
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
                    handleSelectDemo(sample);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-orange-sm active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Track Shipment Status →</span>
                </button>
              </div>
            ))}
          </div>
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

              {/* LIVE GPS TELEMATICS MAP WITH MOVING TRUCK FOR CUSTOMER PORTAL */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-orange-500" />
                    <span>Live Customer GPS Satellite Map & Telematics Route</span>
                  </h3>
                  <span className="text-xs font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Live Signal Active</span>
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-300 overflow-hidden h-80 shadow-xl relative">
                  <SingaporeGoogleMapBackground
                    origin={currentShipment.origin}
                    destination={currentShipment.destination}
                    vehicle={currentShipment.vehicle || 'Josan EV Express Truck #SG-8819'}
                    truckProgress={truckProgress}
                    currentSpeed={currentSpeed}
                    showTruck={true}
                  />
                </div>
              </div>

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
                  onClick={handleViewInvoice}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-orange-sm transition-all text-center cursor-pointer"
                >
                  Generate Official Bill of Lading
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* FULL-SCREEN INTERACTIVE LIVE GPS SATELLITE TRACKING MODAL FOR CUSTOMERS */}
      {fullscreenMapShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fade-in">
          {/* Top Header Bar */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 px-6 flex items-center justify-between shadow-2xl text-white">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-orange-glow text-lg">
                🚛
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-extrabold font-mono text-white">{fullscreenMapShipment.id}</h2>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>GPS LIVE SIGNAL ACTIVE</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {fullscreenMapShipment.origin || 'Changi Air Cargo'} → {fullscreenMapShipment.destination || fullscreenMapShipment.dest || 'Jurong Port Hub'} (Driver: {fullscreenMapShipment.driverName || 'Tan Wei Ming'})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={closeFullscreenMap}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close Live Tracking View</span>
              </button>
            </div>
          </div>

          {/* Main Full-Screen Map Container */}
          <div className="flex-1 relative overflow-hidden bg-slate-900">
            <SingaporeGoogleMapBackground
              origin={fullscreenMapShipment.origin}
              destination={fullscreenMapShipment.destination || fullscreenMapShipment.dest}
              vehicle={fullscreenMapShipment.vehicle || 'Josan EV Express Truck #SG-8819'}
              truckProgress={truckProgress}
              currentSpeed={currentSpeed}
              showTruck={true}
            />
          </div>

          {/* Bottom Telematics Control Dashboard */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Live Vehicle Telemetry</p>
              <p className="text-sm font-extrabold text-orange-400 font-mono mt-0.5">
                {currentSpeed} KM/H (PIE Highway)
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">GPS Satellite Coordinates</p>
              <p className="text-xs font-extrabold text-white font-mono mt-0.5">
                1.3521° N, 103.8198° E
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated SLA Arrival</p>
              <p className="text-xs font-extrabold text-white font-mono mt-0.5">
                Today, 4:30 PM (SGT)
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Battery & Efficiency</p>
              <p className="text-xs font-extrabold text-emerald-400 font-mono mt-0.5">
                94% (EV SLA Active)
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
