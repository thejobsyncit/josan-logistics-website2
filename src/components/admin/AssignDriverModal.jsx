import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  UserPlus, 
  Mail, 
  Lock, 
  Phone, 
  Truck, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AssignDriverModal = ({
  isOpen,
  onClose,
  shipment,
  drivers = [],
  onAssignDriver,
  onSwitchToDriverPortal
}) => {
  if (!isOpen || !shipment) return null;

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'existing'
  const [selectedExistingDriverId, setSelectedExistingDriverId] = useState(
    drivers.find(d => d.status === 'Available')?.id || drivers[0]?.id || ''
  );

  // New Driver Form Data
  const [newDriverData, setNewDriverData] = useState({
    name: '',
    email: '',
    password: 'driver' + Math.floor(100 + Math.random() * 900),
    phone: '+65 ',
    vehicleType: '14ft Box Truck',
    vehicleId: 'SG-' + Math.floor(1000 + Math.random() * 9000),
    licenseNumber: 'SG-CLASS4-' + Math.floor(1000 + Math.random() * 9000),
    assignedHub: 'Jurong Port Logistics Hub'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [assignmentSuccess, setAssignmentSuccess] = useState(null);
  const [copiedState, setCopiedState] = useState(false);

  const vehicleOptions = [
    '14ft Box Truck',
    'Josan EV Express Cargo Van',
    '24ft Heavy Freight Lorry',
    'Refrigerated Cold-Chain Van',
    '40ft Prime Mover Container Truck',
    'Changi Air Cargo Feeder Van'
  ];

  const hubOptions = [
    'Changi Air Cargo Logistics Hub',
    'Jurong Port Logistics Hub',
    'Tuas Mega Port Terminal',
    'Woodlands Linehaul Logistics Depot',
    'Central Express Freight Bay'
  ];

  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let pass = 'drv@';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewDriverData(prev => ({ ...prev, password: pass }));
  };

  const handleAssignNewDriver = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newDriverData.name.trim()) {
      setErrorMsg('Please enter driver full name.');
      return;
    }
    if (!newDriverData.email.trim() || !newDriverData.email.includes('@')) {
      setErrorMsg('Please enter a valid driver login email address.');
      return;
    }
    if (!newDriverData.password || newDriverData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters for portal login.');
      return;
    }
    if (!newDriverData.phone.trim() || newDriverData.phone.length < 8) {
      setErrorMsg('Please enter a valid contact phone number.');
      return;
    }

    const driverPayload = {
      ...newDriverData,
      name: newDriverData.name.trim(),
      email: newDriverData.email.trim().toLowerCase(),
      status: 'On Delivery'
    };

    if (onAssignDriver) {
      const assigned = onAssignDriver({
        shipmentId: shipment.id,
        driverData: driverPayload,
        isNewDriver: true
      });
      setAssignmentSuccess(driverPayload);
    }
  };

  const handleAssignExistingDriver = () => {
    setErrorMsg('');
    const matched = drivers.find(d => d.id === selectedExistingDriverId);
    if (!matched) {
      setErrorMsg('Please select an existing driver from the roster.');
      return;
    }

    if (onAssignDriver) {
      onAssignDriver({
        shipmentId: shipment.id,
        driverData: matched,
        isNewDriver: false
      });
      setAssignmentSuccess(matched);
    }
  };

  const handleCopyCredentials = () => {
    if (!assignmentSuccess) return;
    const text = `JOSAN LOGISTICS - DRIVER PORTAL CREDENTIALS
Assigned Shipment: #${shipment.id}
Driver Name: ${assignmentSuccess.name}
Portal Login Email: ${assignmentSuccess.email}
Portal Password: ${assignmentSuccess.password || 'driver123'}
Vehicle: ${assignmentSuccess.vehicleType || 'Commercial Box Truck'} (${assignmentSuccess.vehicleId || 'SG-8819'})
Hub: ${assignmentSuccess.assignedHub || 'Singapore Operations Hub'}
Driver Portal URL: ${window.location.origin}/#driver-dashboard`;

    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 3000);
  };

  const customerName = shipment.customer || shipment.customerName || shipment.sender || 'Enterprise Shipper';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg text-slate-900">Assign Shipment Driver</h3>
                <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  #{shipment.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Customer: <strong className="text-slate-700">{customerName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shipment Route Summary Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Pickup / Origin</span>
            <div className="flex items-center space-x-1 font-semibold text-slate-800 truncate mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="truncate">{shipment.origin || 'Changi Cargo Complex'}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Delivery / Destination</span>
            <div className="flex items-center space-x-1 font-semibold text-slate-800 truncate mt-0.5">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate">{shipment.destination || 'Jurong Receiving Hub'}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cargo & Weight</span>
            <span className="font-semibold text-slate-800 truncate block mt-0.5">
              {shipment.cargoType || 'Commercial Freight'} ({shipment.weight || '500 kg'})
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Driver</span>
            <span className="font-semibold text-slate-800 truncate block mt-0.5">
              {shipment.driverName ? `${shipment.driverName} (${shipment.vehiclePlate || 'Assigned'})` : 'None (Unassigned)'}
            </span>
          </div>
        </div>

        {/* SUCCESS CONFIRMATION STATE */}
        {assignmentSuccess ? (
          <div className="space-y-5 animate-fade-in">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-base font-extrabold text-emerald-900">
                Driver Assigned & Provisioned Successfully!
              </h4>
              <p className="text-xs text-emerald-700">
                Shipment <strong className="font-mono">#{shipment.id}</strong> has been assigned to{' '}
                <strong>{assignmentSuccess.name}</strong>. The driver can now log into their dedicated Driver Portal using the credentials below.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Driver Portal Login Credentials
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  Account Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase mb-1">
                    Login Email Address
                  </span>
                  <span className="text-white font-bold select-all break-all">
                    {assignmentSuccess.email}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase mb-1">
                    Login Password
                  </span>
                  <span className="text-orange-300 font-bold select-all">
                    {assignmentSuccess.password || 'driver123'}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase mb-1">
                    Assigned Vehicle Plate
                  </span>
                  <span className="text-slate-200 font-bold">
                    {assignmentSuccess.vehicleId || 'SG-8819'}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase mb-1">
                    Contact Phone
                  </span>
                  <span className="text-slate-200 font-bold">
                    {assignmentSuccess.phone || '+65 9123 4567'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleCopyCredentials}
                  className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-orange-600/30"
                >
                  {copiedState ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedState ? 'Credentials Copied!' : 'Copy Login Credentials'}</span>
                </button>

                {onSwitchToDriverPortal && (
                  <button
                    onClick={() => {
                      onSwitchToDriverPortal(assignmentSuccess);
                    }}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700"
                    title="Switch directly into the Driver Portal as this user to test"
                  >
                    <span>Test Login Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close & Return to Shipments
              </button>
            </div>
          </div>
        ) : (
          /* ASSIGNMENT FORM */
          <div className="space-y-5">
            {/* Mode Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('new');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-orange-500" />
                <span>Register & Assign New Driver</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('existing');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeTab === 'existing'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Select Existing Driver ({drivers.length})</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: REGISTER NEW DRIVER */}
            {activeTab === 'new' && (
              <form onSubmit={handleAssignNewDriver} className="space-y-4">
                <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-2xl text-[11px] text-orange-950 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>
                    Provide the driver's basic details and portal credentials. An active driver account will be instantly created with this email and password so they can log into their portal immediately.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Driver Full Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Driver Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Tan Wei Ming"
                      value={newDriverData.name}
                      onChange={(e) => setNewDriverData({ ...newDriverData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus-orange shadow-2xs"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>Contact Phone</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+65 9123 4567"
                      value={newDriverData.phone}
                      onChange={(e) => setNewDriverData({ ...newDriverData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus-orange shadow-2xs"
                    />
                  </div>

                  {/* Login Email */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>Portal Login Email</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="driver@josanlogistics.com"
                      value={newDriverData.email}
                      onChange={(e) => setNewDriverData({ ...newDriverData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus-orange shadow-2xs"
                    />
                  </div>

                  {/* Login Password */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Portal Password</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-0.5 cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Generate</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter password"
                        value={newDriverData.password}
                        onChange={(e) => setNewDriverData({ ...newDriverData, password: e.target.value })}
                        className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus-orange shadow-2xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <Truck className="w-3 h-3 text-slate-400" />
                      <span>Assigned Vehicle Type</span>
                    </label>
                    <select
                      value={newDriverData.vehicleType}
                      onChange={(e) => setNewDriverData({ ...newDriverData, vehicleType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus-orange shadow-2xs cursor-pointer"
                    >
                      {vehicleOptions.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Plate Number */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Vehicle Plate Registration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SG-8819"
                      value={newDriverData.vehicleId}
                      onChange={(e) => setNewDriverData({ ...newDriverData, vehicleId: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus-orange shadow-2xs"
                    />
                  </div>

                  {/* Driving License Class */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Driving License Number</label>
                    <input
                      type="text"
                      placeholder="e.g. SG-CLASS4-9910"
                      value={newDriverData.licenseNumber}
                      onChange={(e) => setNewDriverData({ ...newDriverData, licenseNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus-orange shadow-2xs"
                    />
                  </div>

                  {/* Operating Hub */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Home Dispatch Hub</label>
                    <select
                      value={newDriverData.assignedHub}
                      onChange={(e) => setNewDriverData({ ...newDriverData, assignedHub: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus-orange shadow-2xs cursor-pointer"
                    >
                      {hubOptions.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Assign Driver</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SELECT EXISTING REGISTERED DRIVER */}
            {activeTab === 'existing' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Select an active driver from your fleet roster to dispatch for Consignment #{shipment.id}:
                </p>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {drivers.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No drivers registered yet. Please switch to the "Register & Assign New Driver" tab.
                    </div>
                  ) : (
                    drivers.map((drv) => {
                      const isSelected = selectedExistingDriverId === drv.id;
                      const isAvailable = drv.status === 'Available';

                      return (
                        <div
                          key={drv.id}
                          onClick={() => setSelectedExistingDriverId(drv.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-orange-50/80 border-[#FF6B00] shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                              <img
                                src={drv.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                                alt={drv.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-xs text-slate-900">{drv.name}</span>
                                <span className="font-mono text-[10px] text-slate-500">{drv.id}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                                <span>{drv.email}</span>
                                <span>•</span>
                                <span className="font-mono">{drv.vehicleId || 'SG-8819'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {drv.status || 'Available'}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Pass: {drv.password || 'driver123'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignExistingDriver}
                    disabled={drivers.length === 0}
                    className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Assign Selected Driver</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
