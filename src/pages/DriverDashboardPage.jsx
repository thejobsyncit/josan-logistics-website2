import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  Navigation, 
  Package, 
  UserCheck, 
  AlertTriangle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Star,
  DollarSign,
  Upload,
  Camera,
  CheckSquare,
  Compass,
  ArrowRight,
  Zap,
  Award,
  User,
  Calendar,
  FileText
} from 'lucide-react';

export const DriverDashboardPage = ({ setActiveTab }) => {
  const { 
    drivers, 
    shipments, 
    currentUser, 
    updateShipmentStatus, 
    toggleDriverStatus,
    showToast,
    driverSubTab: driverTab,
    setDriverSubTab: setDriverTab
  } = useLogistics();

  // Pick current driver or default driver DRV-102
  const driverInfo = drivers.find(d => d.email === currentUser?.email) || drivers[1] || drivers[0];
  const [driverStatus, setDriverStatus] = useState(driverInfo.status || 'On Delivery');

  // Available jobs queue for drivers to accept
  const [availableJobs, setAvailableJobs] = useState([
    {
      id: 'JOB-99201-US',
      client: 'Apex Medical Supplies',
      pickup: 'San Jose, CA Depot',
      dropoff: 'San Francisco General Hospital, CA',
      weight: '120 kg',
      payout: '$380.00',
      distance: '48 miles',
      cargo: 'Emergency Medical Kits',
      urgency: 'High Priority'
    },
    {
      id: 'JOB-44102-US',
      client: 'Vanguard Electronics',
      pickup: 'Fremont Logistics Hub',
      dropoff: 'Oakland Cargo Terminal, CA',
      weight: '450 kg',
      payout: '$520.00',
      distance: '32 miles',
      cargo: 'Microchip Servers',
      urgency: 'Express SLA'
    },
    {
      id: 'JOB-77194-US',
      client: 'GreenEarth Organics',
      pickup: 'Sacramento Produce Depot',
      dropoff: 'San Jose Distribution Center, CA',
      weight: '800 kg',
      payout: '$640.00',
      distance: '120 miles',
      cargo: 'Refrigerated Organic Produce',
      urgency: 'Cold Chain'
    }
  ]);

  // Filter shipments assigned to this driver
  const assignedShipments = shipments.filter(s => 
    s.driverId === driverInfo.id || s.driverName === driverInfo.name
  );

  const [activeJob, setActiveJob] = useState(
    assignedShipments.find(s => s.status !== 'Delivered') || assignedShipments[0] || shipments[0]
  );

  // Delivery Update Form State
  const [recipientName, setRecipientName] = useState('Marcus Vance');
  const [proofPhotoUploaded, setProofPhotoUploaded] = useState(false);
  const [proofSignature, setProofSignature] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState('Delivered directly to receiving dock bay #4 with signature.');

  const handleStatusChange = (shipmentId, newStatus) => {
    updateShipmentStatus(shipmentId, newStatus);
    setActiveJob(prev => ({ ...prev, status: newStatus }));
    showToast(`Updated shipment ${shipmentId} status to: ${newStatus}`);
  };

  const handleAcceptAvailableJob = (job) => {
    setAvailableJobs(prev => prev.filter(j => j.id !== job.id));
    showToast(`Accepted freight job #${job.id}. Payout of ${job.payout} added to current queue!`);
  };

  const handleToggleDuty = (newDutyStatus) => {
    setDriverStatus(newDutyStatus);
    toggleDriverStatus(driverInfo.id, newDutyStatus);
  };

  const handleCompleteDeliverySubmit = (e) => {
    e.preventDefault();
    if (!recipientName) {
      showToast('Please enter recipient name before completing delivery', 'warning');
      return;
    }
    updateShipmentStatus(activeJob.id, 'Delivered');
    setActiveJob(prev => ({ ...prev, status: 'Delivered' }));
    showToast(`Shipment #${activeJob.id} successfully marked DELIVERED! Proof of delivery uploaded.`);
    setDriverTab('dashboard');
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* DRIVER PROFILE HEADER BANNER */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border-t-4 border-orange-500 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center space-x-5">
          <img 
            src={driverInfo.photo} 
            alt={driverInfo.name} 
            className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-orange-sm shrink-0" 
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-slate-800 px-3 py-0.5 rounded-full border border-slate-700">
                Driver Telematics & Dispatch Portal
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">ID: {driverInfo.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{driverInfo.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center space-x-3">
              <span>Vehicle: <strong className="text-orange-400">{driverInfo.vehicleType} ({driverInfo.vehicleId})</strong></span>
              <span>•</span>
              <span>Hub: <strong>{driverInfo.assignedHub}</strong></span>
            </p>
          </div>
        </div>

        {/* Duty Status Selector */}
        <div className="relative z-10 flex items-center space-x-3 bg-slate-800 p-2 rounded-2xl border border-slate-700">
          <span className="text-xs font-bold text-slate-400 pl-2">Duty Status:</span>
          {['Available', 'On Delivery', 'Off-Duty'].map((st) => (
            <button
              key={st}
              onClick={() => handleToggleDuty(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                driverStatus === st
                  ? st === 'Available' 
                    ? 'bg-emerald-500 text-white shadow-md'
                    : st === 'On Delivery'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-700 text-slate-200'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* DRIVER MODULE NAVIGATION SUB-TABS (a. Dashboard | b. Navigation | c. Delivery Update) */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap gap-2 text-xs font-bold">
        {[
          { id: 'dashboard', label: 'a. Driver Dashboard (Available & Earnings)', icon: Truck },
          { id: 'navigation', label: 'b. Navigation & Route Optimization', icon: Compass },
          { id: 'update', label: 'c. Delivery Update & Proof Uploader', icon: CheckSquare },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setDriverTab(tab.id)}
              className={`px-5 py-3 rounded-xl transition-all flex items-center space-x-2 ${
                driverTab === tab.id
                  ? 'bg-orange-gradient text-white shadow-orange-sm font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUB-SCREEN (a): DRIVER DASHBOARD (AVAILABLE DELIVERIES, CURRENT JOB, EARNINGS) */}
      {/* ========================================================================= */}
      {driverTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Earnings & Performance Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Today's Earnings</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">$680.00 USD</h3>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +$140 SLA Distance Bonus
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Assigned Freight Jobs</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{assignedShipments.length} Active</h3>
                <span className="text-[11px] font-bold text-orange-600 flex items-center mt-1">
                  <Truck className="w-3.5 h-3.5 mr-1 animate-pulse" /> 1 Currently In Route
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Driver Safety & SLA</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">⭐ {driverInfo.rating} / 5.0</h3>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {driverInfo.onTimeRate} On-Time SLA
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Completed</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{driverInfo.deliveriesCompleted} Jobs</h3>
                <span className="text-[11px] font-bold text-slate-500 flex items-center mt-1">
                  <Award className="w-3.5 h-3.5 mr-1 text-orange-500" /> Lifetime Top Driver
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* CURRENT ACTIVE JOB & AVAILABLE DELIVERIES QUEUE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Current Active Job Highlight */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border-t-4 border-orange-500 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    Current Active Job
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-2">Shipment #{activeJob.id}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                  activeJob.status === 'Delivered'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                }`}>
                  {activeJob.status}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Sender / Client:</span>
                    <strong className="text-white font-bold">{activeJob.sender}</strong>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Pickup Point:</span>
                    <strong className="text-orange-400 font-bold">{activeJob.origin}</strong>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Destination Point:</span>
                    <strong className="text-emerald-400 font-bold">{activeJob.destination}</strong>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>Freight Type & Weight:</span>
                    <strong className="text-white font-bold">{activeJob.cargoType} ({activeJob.weight})</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => setDriverTab('navigation')}
                    className="w-full sm:w-1/2 py-3 px-4 bg-orange-gradient hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-orange-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Open Navigation Map</span>
                  </button>
                  <button
                    onClick={() => setDriverTab('update')}
                    className="w-full sm:w-1/2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs border border-slate-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckSquare className="w-4 h-4 text-orange-400" />
                    <span>Update Status / Proof</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Available Deliveries Queue */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Available Deliveries Queue</h3>
                  <p className="text-xs text-slate-500">Pick up new freight jobs in your assigned dispatch region.</p>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  {availableJobs.length} Jobs Ready
                </span>
              </div>

              <div className="space-y-3">
                {availableJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-orange-300 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs font-extrabold text-orange-600">{job.id}</span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{job.client}</h4>
                      </div>
                      <span className="text-base font-extrabold text-emerald-600 font-mono">{job.payout}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-bold">Route & Distance</span>
                        <span className="font-bold text-slate-900">{job.pickup} → {job.dropoff} ({job.distance})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">Cargo Specs</span>
                        <span className="font-bold text-slate-900">{job.cargo} ({job.weight})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptAvailableJob(job)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-orange-400" />
                      <span>Accept Freight Job ({job.payout})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Earnings Summary Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900">Weekly Earnings & Mileage Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-400 font-bold uppercase block">Base Freight Pay</span>
                <p className="text-xl font-extrabold text-slate-900">$520.00 USD</p>
                <p className="text-slate-500 text-[11px]">Guaranteed rate per completed haul</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-400 font-bold uppercase block">Distance Mileage Pay</span>
                <p className="text-xl font-extrabold text-slate-900">$110.00 USD</p>
                <p className="text-slate-500 text-[11px]">$0.45 per long-haul telematics mile</p>
              </div>

              <div className="p-5 bg-orange-50 rounded-2xl border border-orange-200 space-y-2">
                <span className="text-orange-800 font-bold uppercase block">On-Time SLA Bonus</span>
                <p className="text-xl font-extrabold text-orange-600">$50.00 USD</p>
                <p className="text-orange-700 text-[11px]">Awarded for 99%+ on-time rate</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SCREEN (b): NAVIGATION SCREEN (INTEGRATED MAP, ROUTE OPTIMIZATION, STEPS) */}
      {/* ========================================================================= */}
      {driverTab === 'navigation' && (
        <div className="space-y-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Real-Time GPS Telematics & AI Dispatch
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">Driver Navigation & Route Optimizer</h2>
                <p className="text-xs text-slate-500">Live GPS map tracking, traffic rerouting, and delivery step checklist.</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                  GPS Lock Active
                </span>
              </div>
            </div>

            {/* INTEGRATED MAP SIMULATION CONTAINER */}
            <div className="relative h-80 sm:h-96 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
              
              {/* Top Map Telematics Header Overlay */}
              <div className="relative z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-xs text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Optimal Route</p>
                    <p className="font-extrabold text-slate-100">{activeJob.origin} → {activeJob.destination}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Speed & Telemetry</p>
                  <p className="font-extrabold text-orange-400 font-mono">65 MPH (Cruising Highway)</p>
                </div>
              </div>

              {/* Animated Map Route Graphics */}
              <div className="relative inset-0 flex items-center justify-center my-auto">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#334155" strokeWidth="6" strokeDasharray="8 8" />
                  <line x1="10%" y1="50%" x2="60%" y2="50%" stroke="#F26722" strokeWidth="6" />
                </svg>

                {/* Origin Marker A */}
                <div className="absolute left-[10%] flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-bold shadow-lg">A</div>
                  <span className="text-[11px] text-slate-300 font-bold mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded">{activeJob.origin}</span>
                </div>

                {/* Live Moving Truck Icon */}
                <div className="absolute left-[60%] flex flex-col items-center -translate-x-1/2">
                  <div className="w-12 h-12 rounded-2xl bg-orange-gradient text-white flex items-center justify-center shadow-orange-glow animate-bounce">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-orange-300 font-mono font-bold mt-1 bg-slate-900/90 px-2.5 py-0.5 rounded border border-orange-500/40">
                    Truck #{driverInfo.vehicleId} (In Route)
                  </span>
                </div>

                {/* Destination Marker B */}
                <div className="absolute right-[10%] flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-rose-500 text-rose-400 flex items-center justify-center text-xs font-bold shadow-lg">B</div>
                  <span className="text-[11px] text-slate-300 font-bold mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded">{activeJob.destination}</span>
                </div>
              </div>

              {/* Bottom Map Stats Bar Overlay */}
              <div className="relative z-10 grid grid-cols-3 gap-2 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 text-center text-xs text-white">
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Est. Arrival</span>
                  <span className="font-extrabold text-white font-mono">{activeJob.estimatedDelivery}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Distance Remaining</span>
                  <span className="font-extrabold text-orange-400 font-mono">1,420 Miles</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Fuel Efficiency</span>
                  <span className="font-extrabold text-emerald-400 font-mono">8.4 MPG (+14% AI Saved)</span>
                </div>
              </div>

            </div>

            {/* ROUTE OPTIMIZATION & DELIVERY STEPS CHECKLIST */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Route Optimization AI Suggestions */}
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>AI Neural Route Optimization</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                    <p className="font-bold">✓ Primary Express Toll Bypass Selected</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Saves 24 mins & avoids metro traffic bottleneck.</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-900">
                    <p className="font-bold">⚠ Weather Alert Rerouting</p>
                    <p className="text-[11px] text-orange-700 mt-0.5">Minor rain on I-80. Speed capped at 65 mph for safety.</p>
                  </div>
                </div>
              </div>

              {/* Delivery Steps Timeline */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Delivery Sequential Steps Checklist</h3>

                <div className="space-y-3 text-xs">
                  {[
                    { step: '1', title: 'Arrive at Dispatch Hub & Scan Barcode', desc: activeJob.origin, status: 'Completed', icon: CheckCircle2 },
                    { step: '2', title: 'Inspect Cargo & Verify Security Seal', desc: 'Seal #JOS-99182 Intact', status: 'Completed', icon: CheckCircle2 },
                    { step: '3', title: 'En Route Highway Telematics Checkpoint', desc: 'In Transit', status: 'Active', icon: Truck },
                    { step: '4', title: 'Doorstep Delivery & E-Signature Upload', desc: activeJob.destination, status: 'Pending', icon: MapPin },
                  ].map((s, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      s.status === 'Completed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : s.status === 'Active'
                        ? 'bg-orange-50 border-orange-200 text-orange-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          s.status === 'Completed'
                            ? 'bg-emerald-500 text-white'
                            : s.status === 'Active'
                            ? 'bg-orange-500 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {s.step}
                        </div>
                        <div>
                          <p className="font-extrabold">{s.title}</p>
                          <p className="text-[11px] opacity-80">{s.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/60">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setDriverTab('update')}
                    className="w-full py-3 bg-orange-gradient hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-orange-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Proceed To Delivery Update Screen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SCREEN (c): DELIVERY UPDATE SCREEN (MARK PICKED, UPLOAD PROOF, COMPLETE) */}
      {/* ========================================================================= */}
      {driverTab === 'update' && (
        <div className="space-y-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Proof of Delivery (POD) Portal
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">Delivery Update & E-Signature Uploader</h2>
                <p className="text-xs text-slate-500">Update live package status, upload proof photos, and confirm delivery completion.</p>
              </div>

              <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                Shipment #{activeJob.id}
              </span>
            </div>

            <form onSubmit={handleCompleteDeliverySubmit} className="space-y-8">
              
              {/* STEP 1: MARK AS PICKED / STATUS SWITCHER */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-orange-500" />
                  <span>1. Mark Live Telematics Status</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
                  {[
                    { status: 'Picked Up', label: 'Mark Picked Up' },
                    { status: 'In Transit', label: 'In Transit' },
                    { status: 'Out for Delivery', label: 'Out for Delivery' },
                    { status: 'Delivered', label: 'Delivered ✓' }
                  ].map((st) => (
                    <button
                      key={st.status}
                      type="button"
                      onClick={() => handleStatusChange(activeJob.id, st.status)}
                      className={`p-3.5 rounded-xl border transition-all ${
                        activeJob.status === st.status
                          ? 'bg-orange-gradient text-white border-orange-500 shadow-orange-sm font-extrabold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: UPLOAD PROOF (PHOTO & E-SIGNATURE) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-orange-500" />
                  <span>2. Upload Cargo Photo & Recipient Signature</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* Photo Proof Simulator */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-700">Cargo Photo Verification</label>
                    <div 
                      onClick={() => {
                        setProofPhotoUploaded(true);
                        showToast('Cargo delivery photo captured and verified!');
                      }}
                      className={`h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
                        proofPhotoUploaded
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-300 hover:border-orange-500 bg-white text-slate-500'
                      }`}
                    >
                      {proofPhotoUploaded ? (
                        <div className="text-center space-y-1">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="font-extrabold text-xs">Photo Captured Successfully ✓</p>
                          <p className="text-[10px] text-emerald-700">Timestamped & GPS Encrypted</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <Upload className="w-8 h-8 text-orange-500 mx-auto" />
                          <p className="font-bold text-xs text-slate-800">Tap to Upload / Capture Delivery Photo</p>
                          <p className="text-[10px] text-slate-400">Supports JPG, PNG (Max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* E-Signature Pad Simulator */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-700">Recipient Full Name & Electronic Signature</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Enter recipient full name..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus-orange mb-2"
                      required
                    />

                    <div className="h-24 bg-white rounded-xl border border-slate-300 p-3 relative flex items-center justify-center">
                      <span className="font-mono text-slate-400 italic text-sm select-none">
                        [ Signature: {recipientName || 'Recipient Sign Here'} ]
                      </span>
                      <span className="absolute bottom-1 right-2 text-[9px] font-bold text-emerald-600">✓ Digital Signature Valid</span>
                    </div>
                  </div>

                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Notes / Special Instructions</label>
                  <textarea
                    rows={2}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus-orange"
                  />
                </div>
              </div>

              {/* STEP 3: COMPLETE DELIVERY BUTTON */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Status will instantly update client tracking timeline and issue an electronic invoice POD.
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95 shrink-0"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>3. Complete Freight Delivery</span>
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};
