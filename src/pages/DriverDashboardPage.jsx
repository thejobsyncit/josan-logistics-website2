import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { RealTruckGraphic } from '../components/RealTruckGraphic';
import { SingaporeGoogleMapBackground } from '../components/SingaporeGoogleMapBackground';
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
  FileText,
  Edit2,
  Save,
  X,
  Bell
} from 'lucide-react';

export const DriverDashboardPage = ({ setActiveTab }) => {
  const { 
    drivers, 
    shipments, 
    currentUser, 
    updateUserProfile,
    updateShipmentStatus, 
    toggleDriverStatus,
    showToast,
    driverSubTab: driverTab,
    setDriverSubTab: setDriverTab,
    driverIntimations
  } = useLogistics();

  const defaultDriver = {
    id: 'DRV-101',
    name: 'Robert Martinez (Driver)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+65 9123 4567',
    email: 'robert.m@josanlogistics.com',
    licenseNumber: 'SG-CLASS4-9182',
    dob: '1990-05-12',
    vehicleType: 'EV Express Cargo Van',
    vehicleId: 'SG-8819',
    status: 'On Delivery',
    deliveriesCompleted: 540,
    onTimeRate: '99.6%',
    rating: 4.9,
    assignedHub: 'Changi Air Cargo Logistics Hub',
    safetyScore: '99/100',
    joinedDate: 'Jan 2024'
  };

  const defaultJob = {
    id: 'JOS-88190-SG',
    sender: 'Razer Asia-Pacific HQ',
    origin: 'Changi Air Cargo Complex',
    destination: 'Jurong Port Industrial Estate',
    status: 'In Transit',
    cargoType: 'High-Tech Electronics & Microchips',
    weight: '245.5 kg',
    price: 'S$ 420.00',
    vehicle: 'Josan EV Express Truck #SG-8819',
    estimatedDelivery: 'Today, 4:30 PM'
  };

  // Pick current driver or default driver with currentUser fallback overrides
  const baseDriver = (drivers || []).find(d => d.email === currentUser?.email) || drivers?.[0] || defaultDriver;
  const driverInfo = {
    ...baseDriver,
    name: currentUser?.name || baseDriver.name,
    email: currentUser?.email || baseDriver.email,
    phone: currentUser?.phone || baseDriver.phone,
    licenseNumber: currentUser?.licenseNumber || baseDriver.licenseNumber,
    dob: currentUser?.dob || baseDriver.dob || '1990-05-12',
    assignedHub: currentUser?.company || baseDriver.assignedHub,
  };

  const [driverStatus, setDriverStatus] = useState(driverInfo.status || 'On Delivery');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCountryCode, setEditCountryCode] = useState('+65');
  const [editPhoneDigits, setEditPhoneDigits] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editHub, setEditHub] = useState('');

  const startEditingDriverProfile = () => {
    setEditName(driverInfo.name || '');
    const phoneVal = driverInfo.phone || '';
    const matched = countryCodesList.find(c => phoneVal.startsWith(c.code));
    if (matched) {
      setEditCountryCode(matched.code);
      setEditPhoneDigits(phoneVal.replace(matched.code, '').replace(/[^0-9]/g, ''));
    } else {
      setEditCountryCode('+65');
      setEditPhoneDigits(phoneVal.replace(/[^0-9]/g, ''));
    }
    setEditLicense(driverInfo.licenseNumber || '');
    setEditDob(driverInfo.dob || '');
    setEditHub(driverInfo.assignedHub || '');
    setIsEditingProfile(true);
  };

  const handleSaveDriverProfile = (e) => {
    e.preventDefault();
    const cleanDigits = editPhoneDigits.replace(/[^0-9]/g, '');
    updateUserProfile({
      name: editName,
      phone: `${editCountryCode} ${cleanDigits}`,
      licenseNumber: editLicense,
      dob: editDob,
      company: editHub
    });
    setIsEditingProfile(false);
    showToast('Driver Profile updated successfully!');
  };

  // Available jobs queue for drivers to accept
  const [availableJobs, setAvailableJobs] = useState([
    {
      id: 'JOB-99201-SG',
      client: 'Apex Medical Supplies SG',
      pickup: 'Changi Air Cargo Depot',
      dropoff: 'Singapore General Hospital (SGH)',
      weight: '120 kg',
      payout: 'S$ 380.00',
      distance: '18 km',
      cargo: 'Emergency Medical Kits',
      urgency: 'High Priority'
    },
    {
      id: 'JOB-44102-SG',
      client: 'Vanguard Electronics APAC',
      pickup: 'Pasir Panjang Terminal Hub',
      dropoff: 'Woodlands High-Tech Loop',
      weight: '450 kg',
      payout: 'S$ 520.00',
      distance: '24 km',
      cargo: 'Microchip Servers',
      urgency: 'Express SLA'
    },
    {
      id: 'JOB-77194-SG',
      client: 'Sheng Siong Logistics',
      pickup: 'Tuas Bio-Park Depot',
      dropoff: 'Jurong Industrial Estate, SG',
      weight: '800 kg',
      payout: 'S$ 640.00',
      distance: '30 km',
      cargo: 'Cold Chain Pharma Products',
      urgency: 'Cold Chain'
    }
  ]);

  // Filter shipments assigned to this driver
  const assignedShipments = (shipments || []).filter(s => 
    s.driverId === driverInfo.id || s.driverName === driverInfo.name
  );

  const [activeJob, setActiveJob] = useState(
    assignedShipments.find(s => s.status !== 'Delivered') || assignedShipments[0] || shipments?.[0] || defaultJob
  );

  // Delivery Update Form State
  const [proofPhotoUploaded, setProofPhotoUploaded] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setProofPhotoUploaded(true);
        showToast('Cargo delivery photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Moving Anime Truck animation state
  const [truckProgress, setTruckProgress] = useState(15);
  const [currentSpeed, setCurrentSpeed] = useState(65);

  useEffect(() => {
    const timer = setInterval(() => {
      setTruckProgress(prev => (prev >= 85 ? 15 : prev + 0.35));
      setCurrentSpeed(62 + Math.floor(Math.random() * 8));
    }, 100);

    return () => clearInterval(timer);
  }, []);

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
    if (!proofPhotoUploaded) {
      showToast('Please upload cargo delivery photo verification before completing delivery', 'warning');
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

        {/* Duty Status Selector & Edit Profile Button */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={startEditingDriverProfile}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-orange-sm"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold text-slate-400 pl-2">Duty Status:</span>
            {['Available', 'On Delivery', 'Off-Duty'].map((st) => (
              <button
                key={st}
                onClick={() => handleToggleDuty(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
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
      </div>

      {/* ORDER PROXIMITY & ADMIN DISPATCH INTIMATIONS PANEL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <span className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute top-0 right-0"></span>
              <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-slate-900">Order Dispatch Intimations & Proximity Alerts</h3>
                <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full animate-pulse">
                  {(driverIntimations || []).length} Active Intimations
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Automated intimations triggered when orders are placed near your location or assigned directly by Admin.
              </p>
            </div>
          </div>
        </div>

        {(!driverIntimations || driverIntimations.length === 0) ? (
          <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-2 border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-extrabold text-slate-700">All Intimated Orders Responded To</p>
            <p className="text-[11px] text-slate-400">You will be intimated immediately when a new customer order is placed nearby or assigned by Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driverIntimations.map((intimation) => (
              <div 
                key={intimation.id}
                className={`p-5 rounded-2xl border transition-all shadow-sm space-y-3 relative ${
                  intimation.type === 'admin_assigned' 
                    ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-400/30' 
                    : 'bg-slate-50 border-slate-200 hover:border-orange-300'
                }`}
              >
                {/* Intimation Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      intimation.type === 'admin_assigned' 
                        ? 'bg-red-600 text-white shadow-sm' 
                        : 'bg-emerald-600 text-white shadow-sm'
                    }`}>
                      {intimation.type === 'admin_assigned' ? '🚨 Direct Admin Assignment' : '📍 Nearby Proximity Alert'}
                    </span>
                    {intimation.distanceKm && (
                      <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        {intimation.distanceKm} km from hub
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{intimation.timestamp}</span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{intimation.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{intimation.message}</p>
                </div>

                {/* Pickup & Delivery Details */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5 font-medium">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-bold">Pickup Location:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">{intimation.pickup}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-bold">Delivery Destination:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">{intimation.delivery}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">Cargo: <strong>{intimation.cargoType} ({intimation.weight})</strong></span>
                    <span className="text-emerald-700 font-extrabold">{intimation.price}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => acceptDriverIntimation(intimation.id, driverInfo)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept & Start Pickup</span>
                  </button>
                  <button
                    onClick={() => declineDriverIntimation(intimation.id)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT DRIVER PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-orange-600 font-extrabold text-sm uppercase tracking-wider">
                <User className="w-5 h-5" />
                <span>Edit Driver Profile Details</span>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriverProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Driver Full Name *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Alphabets Only</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    const alphaOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setEditName(alphaOnly);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus-orange"
                  required
                />
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">Strictly letters only (Numbers & symbols blocked)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Phone Contact *</span>
                    <span className="text-[10px] text-orange-600 font-bold uppercase">Digits Only</span>
                  </label>
                  <div className="flex items-center">
                    <select
                      value={editCountryCode}
                      onChange={(e) => setEditCountryCode(e.target.value)}
                      className="p-2.5 bg-slate-100 border border-slate-300 rounded-l-xl text-slate-900 font-extrabold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none"
                    >
                      {countryCodesList.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.flag} {item.code} ({item.country})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={getPhoneLength(editCountryCode)}
                      value={editPhoneDigits}
                      onChange={(e) => {
                        const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(editCountryCode));
                        setEditPhoneDigits(numericOnly);
                      }}
                      placeholder={`e.g. ${'9'.repeat(getPhoneLength(editCountryCode))}`}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-r-xl text-slate-900 font-mono font-bold focus-orange text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">License Number</label>
                  <input
                    type="text"
                    value={editLicense}
                    onChange={(e) => setEditLicense(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus-orange"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus-orange"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Logistics Hub</label>
                  <input
                    type="text"
                    value={editHub}
                    onChange={(e) => setEditHub(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus-orange"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center space-x-2 shadow-orange-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Driver Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            {/* INTEGRATED INTERACTIVE GOOGLE MAPS CONTAINER */}
            <div className="relative h-96 sm:h-[420px] rounded-3xl border border-slate-300 overflow-hidden shadow-2xl">
              <SingaporeGoogleMapBackground 
                origin={activeJob.origin}
                destination={activeJob.destination}
                vehicle={activeJob.vehicle || 'Josan EV Semi-Truck'}
                truckProgress={truckProgress}
                currentSpeed={currentSpeed}
              />
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
                <h3 className="text-sm font-extrabold text-slate-900">Delivery Sequential Steps Checklist (Click step to update status)</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { step: '1', title: 'Arrive at Dispatch Hub & Scan Barcode', desc: activeJob.origin, status: activeJob.status === 'Picked Up' || activeJob.status === 'In Transit' || activeJob.status === 'Out for Delivery' || activeJob.status === 'Delivered' ? 'Completed' : 'Active', targetStatus: 'Picked Up' },
                    { step: '2', title: 'Inspect Cargo & Verify Security Seal', desc: 'Seal #JOS-99182 Intact', status: activeJob.status === 'In Transit' || activeJob.status === 'Out for Delivery' || activeJob.status === 'Delivered' ? 'Completed' : activeJob.status === 'Picked Up' ? 'Active' : 'Pending', targetStatus: 'In Transit' },
                    { step: '3', title: 'En Route Highway Telematics Checkpoint', desc: 'In Transit', status: activeJob.status === 'Out for Delivery' || activeJob.status === 'Delivered' ? 'Completed' : activeJob.status === 'In Transit' ? 'Active' : 'Pending', targetStatus: 'Out for Delivery' },
                    { step: '4', title: 'Doorstep Delivery & E-Signature Upload', desc: activeJob.destination, status: activeJob.status === 'Delivered' ? 'Completed' : activeJob.status === 'Out for Delivery' ? 'Active' : 'Pending', targetStatus: 'Delivered' },
                  ].map((s, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleStatusChange(activeJob.id, s.targetStatus)}
                      title={`Click to set status to ${s.targetStatus}`}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer hover:border-orange-400 transition-all ${
                        s.status === 'Completed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : s.status === 'Active'
                          ? 'bg-orange-50 border-orange-200 text-orange-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
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
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200">
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

              {/* STEP 2: UPLOAD PROOF (PHOTO) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-orange-500" />
                  <span>2. Upload Cargo Photo Verification</span>
                </h3>

                <div className="max-w-md mx-auto text-xs">
                  {/* Photo Proof Input & Preview */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-700 text-left">Cargo Photo Verification</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="cargo-photo-upload" 
                      className="hidden" 
                      onChange={handlePhotoChange} 
                    />
                    <div 
                      onClick={() => document.getElementById('cargo-photo-upload').click()}
                      className={`h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 cursor-pointer transition-all overflow-hidden relative ${
                        proofPhotoUploaded
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-300 hover:border-orange-500 bg-white text-slate-500'
                      }`}
                    >
                      {proofPhotoUploaded && photoPreview ? (
                        <div className="w-full h-full relative group">
                          <img src={photoPreview} alt="Cargo Proof" className="w-full h-full object-cover rounded-lg" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-white font-extrabold text-xs">
                            Change Photo
                          </div>
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
