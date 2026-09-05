import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { RealTruckGraphic } from '../components/RealTruckGraphic';
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
  Bell,
  Volume2,
  VolumeX,
  PhoneCall,
  MessageSquare,
  BatteryCharging,
  Sparkles,
  Target,
  ShieldAlert,
  Sun,
  Fuel
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
    driverIntimations,
    acceptDriverIntimation,
    declineDriverIntimation
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
  const [editPhoto, setEditPhoto] = useState('');

  // Driver Smart Utilities State
  const [isVoiceGuidanceOn, setIsVoiceGuidanceOn] = useState(true);
  const [showDispatchSupportModal, setShowDispatchSupportModal] = useState(false);
  const [showEVHubModal, setShowEVHubModal] = useState(false);
  const [quickSmsSent, setQuickSmsSent] = useState(false);

  const toggleVoiceGuidance = () => {
    setIsVoiceGuidanceOn(prev => {
      const nextState = !prev;
      showToast(nextState ? '🔊 Voice Navigation Guidance Activated' : '🔇 Voice Navigation Guidance Muted');
      return nextState;
    });
  };

  const handleSendArrivalSMS = () => {
    setQuickSmsSent(true);
    showToast('💬 Automated SMS sent to recipient: "Driver is 5 mins away at loading dock!"');
    setTimeout(() => setQuickSmsSent(false), 8000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
    setEditPhoto(currentUser?.photo || driverInfo.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
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
      company: editHub,
      photo: editPhoto
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

      {/* DRIVER FEATURE EXPLORER HEADER NAVIGATION BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-slate-900">Driver Feature Explorer & Control Portal</h2>
                <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  4 Dedicated Modules
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Switch between dedicated driver feature pages to explore live telemetry, route timeline steppers, and dispatch alerts.
              </p>
            </div>
          </div>

          {/* Quick Action Tools Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleVoiceGuidance}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                isVoiceGuidanceOn
                  ? 'bg-orange-50 border-orange-300 text-orange-800 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {isVoiceGuidanceOn ? <Volume2 className="w-4 h-4 text-orange-600 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{isVoiceGuidanceOn ? 'Voice Guidance ON' : 'Muted'}</span>
            </button>

            <button
              onClick={() => setShowEVHubModal(true)}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <BatteryCharging className="w-4 h-4 text-emerald-600" />
              <span>EV Chargers</span>
            </button>

            <button
              onClick={() => setShowDispatchSupportModal(true)}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
              <span>SOS Dispatch Hotline</span>
            </button>
          </div>
        </div>

        {/* 4 DEDICATED MODULE PAGE BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
          {[
            { 
              id: 'intimations', 
              label: '1. Dispatch Intimations & Alerts', 
              sublabel: 'Proximity & admin order alerts', 
              icon: Bell, 
              badge: `${(driverIntimations || []).length} Active Alerts`, 
              badgeBg: 'bg-orange-50 text-orange-700 border-orange-200' 
            },
            { 
              id: 'dashboard', 
              label: '2. Driver Dashboard & Earnings', 
              sublabel: 'Available freight jobs & payouts', 
              icon: Truck, 
              badge: '3 Jobs Ready', 
              badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            },
            { 
              id: 'navigation', 
              label: '3. Navigation & Route Optimizer', 
              sublabel: 'Live GPS & timeline stepper', 
              icon: Compass, 
              badge: 'LIVE GPS', 
              badgeBg: 'bg-orange-50 text-orange-600 border-orange-200' 
            },
            { 
              id: 'update', 
              label: '4. Delivery Update & Proof POD', 
              sublabel: 'POD photos & E-signatures', 
              icon: CheckSquare, 
              badge: 'POD Portal', 
              badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' 
            },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = driverTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDriverTab(tab.id)}
                className={`p-4 rounded-2xl transition-all text-left flex items-start space-x-3 cursor-pointer ${
                  isActive
                    ? 'bg-orange-gradient text-white shadow-orange-md font-extrabold ring-2 ring-orange-400/50 scale-[1.01]'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 font-bold'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-white text-orange-500 border border-slate-200 shadow-2xs'}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-extrabold block truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{tab.label}</span>
                  <p className={`text-[11px] mt-0.5 font-medium truncate ${isActive ? 'text-orange-100' : 'text-slate-500'}`}>{tab.sublabel}</p>
                  <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border mt-2.5 ${
                    isActive ? 'bg-white/20 text-white border-white/30' : tab.badgeBg
                  }`}>
                    {tab.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Weather & Telematics Mini Banner */}
        <div className="bg-slate-900 text-white rounded-2xl px-5 py-3 border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3 shadow-inner">
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <Sun className="w-4 h-4" />
              <span>Singapore 28°C Clear</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center space-x-1 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-orange-400" />
              <span>Expressway Telematics: <strong>PIE / TPE Traffic Smooth (65 KM/H)</strong></span>
            </span>
          </div>

          <div className="flex items-center space-x-3 font-mono text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>EV Battery: 94% (Range 340 KM)</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-orange-400 font-bold">Driver SLA: 99.6% On-Time</span>
          </div>
        </div>
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
              {/* Profile Photo Upload Field */}
              <div className="bg-orange-50/80 p-3.5 rounded-2xl border border-orange-200 space-y-2">
                <label className="block text-xs font-extrabold text-orange-950">
                  Driver Profile Picture
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative shrink-0">
                    <img
                      src={editPhoto || currentUser?.photo || driverInfo.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt="Driver Profile Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-extrabold shadow-orange-sm cursor-pointer transition-all inline-flex items-center space-x-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Browse & Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                      This uploaded image will be automatically updated across your profile and driver roster.
                    </p>
                  </div>
                </div>
              </div>
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

      {/* ========================================================================= */}
      {/* MODULE PAGE 1: DEDICATED ORDER INTIMATIONS & PROXIMITY ALERTS PAGE */}
      {/* ========================================================================= */}
      {driverTab === 'intimations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute top-0 right-0"></span>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold shadow-sm">
                  <Bell className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-slate-900">Order Dispatch Intimations & Proximity Alerts</h2>
                  <span className="bg-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full animate-pulse">
                    {(driverIntimations || []).length} Active Intimations
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Automated intimations triggered when orders are placed near your location or assigned directly by Admin.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Proximity Radar Active</span>
            </div>
          </div>

          {(!driverIntimations || driverIntimations.length === 0) ? (
            <div className="p-12 bg-slate-50 rounded-3xl text-center space-y-3 border border-dashed border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-800">All Intimated Orders Responded To</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You are on active standby. New customer orders placed nearby or assigned by Admin will intimate you instantly right here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {driverIntimations.map((intimation) => (
                <div 
                  key={intimation.id}
                  className={`p-6 rounded-3xl border transition-all shadow-md space-y-4 relative ${
                    intimation.type === 'admin_assigned' 
                      ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-400/30' 
                      : 'bg-slate-50/90 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {/* Intimation Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        intimation.type === 'admin_assigned' 
                          ? 'bg-red-600 text-white shadow-sm' 
                          : 'bg-emerald-600 text-white shadow-sm'
                      }`}>
                        {intimation.type === 'admin_assigned' ? '🚨 Direct Admin Assignment' : '📍 Nearby Proximity Alert'}
                      </span>
                      {intimation.distanceKm && (
                        <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
                          {intimation.distanceKm} km from hub
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">{intimation.timestamp}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">{intimation.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{intimation.message}</p>
                  </div>

                  {/* Pickup & Delivery Details */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 text-xs space-y-2 font-medium">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 font-bold">Pickup Location:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[220px]">{intimation.pickup}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 font-bold">Delivery Destination:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[220px]">{intimation.delivery}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500">Cargo: <strong className="text-slate-900">{intimation.cargoType} ({intimation.weight})</strong></span>
                      <span className="text-emerald-700 font-extrabold text-sm font-mono">{intimation.price}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const targetId = intimation.id || intimation.shipmentId;
                        const newActive = acceptDriverIntimation(targetId, driverInfo);
                        if (newActive) {
                          setActiveJob(newActive);
                          setDriverTab('dashboard');
                        }
                      }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept & Start Freight Pickup</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const targetId = intimation.id || intimation.shipmentId;
                        declineDriverIntimation(targetId);
                      }}
                      className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

            {/* DELIVERY TIMELINE STEPPER CONTAINER */}
            <div className="bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span>DELIVERY TIMELINE STEPPER</span>
                </h3>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 font-mono">
                  Active Order: #{activeJob?.id || 'JOS-88190-SG'} ({activeJob?.status || 'In Transit'})
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {((activeJob && activeJob.timeline && activeJob.timeline.length > 0) 
                  ? activeJob.timeline 
                  : [
                      { title: 'Order Booked & TradeNet Customs Cleared', location: activeJob?.origin || 'Changi Air Cargo Complex (SIN)', timestamp: activeJob?.createdDate || 'Aug 31, 08:15 AM', completed: true },
                      { title: 'Picked Up by Josan Fleet Courier', location: activeJob?.origin ? `${activeJob.origin} Depot` : 'Changi Logistics Depot', timestamp: 'Aug 31, 10:40 AM', completed: true },
                      { title: `In Transit via ${activeJob?.currentLocation || 'Expressway Hub'}`, location: activeJob?.currentLocation || 'Tampines Logistics Depot', timestamp: 'Aug 31, 01:20 PM', completed: activeJob?.status === 'Delivered', current: activeJob?.status !== 'Delivered' },
                      { title: 'Out for Final Dispatch', location: activeJob?.destination ? `${activeJob.destination} Hub` : 'Jurong Port Hub', timestamp: activeJob?.estimatedDelivery || 'Today, 03:30 PM', completed: activeJob?.status === 'Delivered' },
                      { title: 'Delivered & Digital E-Signature Signed', location: activeJob?.destination || '10 Jurong Port Road', timestamp: activeJob?.status === 'Delivered' ? 'Delivered' : activeJob?.estimatedDelivery || 'Today, 04:30 PM', completed: activeJob?.status === 'Delivered' }
                    ]
                ).map((step, idx) => {
                  const isCompleted = step.completed || activeJob?.status === 'Delivered';
                  const isCurrent = step.current || (!isCompleted && idx === 2);

                  return (
                    <div key={idx} className="relative flex items-start space-x-4 group">
                      {/* Timeline Node Icon */}
                      <div className={`absolute -left-6 sm:-left-8 top-0.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                        isCurrent
                          ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-orange-sm'
                          : isCompleted
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Card */}
                      <div className={`flex-1 p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-orange-50/80 border-orange-200 shadow-sm'
                          : isCompleted
                          ? 'bg-white border-slate-200/90 shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200/70 opacity-60'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-orange-600' : 'text-slate-900'}`}>
                            {step.title}
                          </h4>
                          {step.timestamp && (
                            <span className="text-[11px] font-semibold text-slate-400 font-mono">{step.timestamp}</span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{step.location}</span>
                        </p>

                        {/* Interactive Driver Actions for Current Active Step */}
                        {isCurrent && (
                          <div className="mt-3 pt-3 border-t border-orange-200/80 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                window.location.href = 'tel:+6591823344';
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Call Recipient (+65 9182 3344)</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleSendArrivalSMS}
                              disabled={quickSmsSent}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
                                quickSmsSent
                                  ? 'bg-emerald-600 text-white border border-emerald-600'
                                  : 'bg-orange-500 hover:bg-orange-600 text-white border border-orange-500'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{quickSmsSent ? 'SMS Sent ✓' : 'Send 5-Min Arrival SMS'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDriverTab('update')}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ml-auto"
                            >
                              <span>Update POD</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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

      {/* SOS DISPATCH CONTROL HOTLINE MODAL */}
      {showDispatchSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-200 max-w-lg w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-red-600 font-extrabold text-sm uppercase tracking-wider">
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <span>24/7 Dispatch Control & Emergency Hotline</span>
              </div>
              <button
                onClick={() => setShowDispatchSupportModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-950 space-y-1">
                <p className="font-extrabold text-sm flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Immediate Driver Support Desk</span>
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Need route assistance, breakdown support, or customer dispatch clearance? Contact HQ instantly.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Dispatch HQ Master Desk (Singapore)', number: '+65 6789 0100', role: 'Live Route & Dispatch Assistance' },
                  { title: 'Highway Breakdown & Towing Desk', number: '+65 6789 0101', role: '24/7 Roadside Rescue' },
                  { title: 'EV Fleet Telematics Tech Support', number: '+65 6789 0102', role: 'Battery & Sensor Support' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs">{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.role}</p>
                    </div>
                    <a
                      href={`tel:${item.number}`}
                      onClick={() => showToast(`Dialing ${item.title}...`)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {item.number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  showToast('🚨 SOS Signal Transmitted to HQ Dispatch! Emergency Team Alerted.', 'warning');
                  setShowDispatchSupportModal(false);
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>Trigger Silent SOS Alert To Dispatch HQ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EV SUPERCHARGER & REST HUBS MODAL */}
      {showEVHubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 max-w-lg w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-600 font-extrabold text-sm uppercase tracking-wider">
                <BatteryCharging className="w-5 h-5" />
                <span>Josan EV Superchargers & Driver Lounges</span>
              </div>
              <button
                onClick={() => setShowEVHubModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                Ultra-fast 150 kW EV charging stations with reserved driver rest bays & coffee lounges along your current route.
              </p>

              <div className="space-y-2.5">
                {[
                  { name: 'Changi Logistics Hub Supercharger', dist: '2.4 km away', chargers: '8/12 Available', speed: '150 kW DC Fast', lounge: 'AC Lounge + Coffee' },
                  { name: 'Tampines Express Freight Depot', dist: '5.8 km away', chargers: '5/8 Available', speed: '120 kW Fast', lounge: 'Rest Bay' },
                  { name: 'Jurong Port Fleet Superstation', dist: '18.2 km away', chargers: '11/16 Available', speed: '200 kW Ultra', lounge: 'Full Amenities' }
                ].map((station, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-xs">{station.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded-full">
                        {station.dist}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>⚡ Charger Status: <strong>{station.chargers}</strong> ({station.speed})</span>
                      <span className="text-slate-500 font-semibold">☕ {station.lounge}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Rerouting GPS navigation to ${station.name}...`);
                        setShowEVHubModal(false);
                        setDriverTab('navigation');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Reroute & Charge Battery</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowEVHubModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Close Finder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
