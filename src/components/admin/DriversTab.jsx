import React, { useState } from 'react';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Lock, 
  KeyRound, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Package, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';

export const DriversTab = ({
  drivers = [],
  shipments = [],
  onAddDriver,
  onUpdateDriver,
  onUpdateDriverPassword,
  onRemoveDriver,
  onOpenAssignShipment,
  onViewShipment,
  onTestDriverLogin,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hubFilter, setHubFilter] = useState('All');

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [assignShipmentDriver, setAssignShipmentDriver] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState({});

  // New Driver Form state
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    password: 'driver' + Math.floor(100 + Math.random() * 900),
    phone: '+65 ',
    vehicleType: '14ft Box Truck',
    vehicleId: 'SG-' + Math.floor(1000 + Math.random() * 9000),
    licenseNumber: 'SG-CLASS4-' + Math.floor(1000 + Math.random() * 9000),
    assignedHub: 'Jurong Port Logistics Hub'
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  // Edit Driver Form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleType: '',
    vehicleId: '',
    licenseNumber: '',
    assignedHub: '',
    status: 'Available'
  });
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Filtered drivers list
  const filteredDrivers = drivers.filter(d => {
    if (statusFilter !== 'All' && (d.status || 'Available') !== statusFilter) return false;
    if (hubFilter !== 'All' && (d.assignedHub || '') !== hubFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.phone?.toLowerCase().includes(q) ||
      d.vehicleId?.toLowerCase().includes(q) ||
      d.id?.toLowerCase().includes(q) ||
      d.assignedHub?.toLowerCase().includes(q)
    );
  });

  // Calculate metrics
  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter(d => (d.status || 'Available') === 'Available').length;
  const onDeliveryDrivers = drivers.filter(d => d.status === 'On Delivery').length;
  const assignedShipmentsCount = shipments.filter(s => s.driverId || s.driverName).length;

  const togglePasswordReveal = (driverId) => {
    setRevealedPasswords(prev => ({ ...prev, [driverId]: !prev[driverId] }));
  };

  const handleCopyCredentials = (driver) => {
    const text = `JOSAN LOGISTICS - DRIVER CREDENTIALS\nName: ${driver.name}\nEmail: ${driver.email}\nPassword: ${driver.password || 'driver123'}\nPortal: ${window.location.origin}/#driver-dashboard`;
    navigator.clipboard.writeText(text);
    setCopiedId(driver.id);
    if (showToast) showToast(`Login credentials copied for ${driver.name}`, 'success');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleGenerateRegPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let pass = 'drv@';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewDriver(prev => ({ ...prev, password: pass }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!newDriver.name.trim()) {
      setRegError('Please enter driver full name.');
      return;
    }
    if (!newDriver.email.trim() || !newDriver.email.includes('@')) {
      setRegError('Please enter a valid driver login email address.');
      return;
    }
    if (!newDriver.password || newDriver.password.length < 4) {
      setRegError('Password must be at least 4 characters for portal login.');
      return;
    }
    if (!newDriver.phone.trim() || newDriver.phone.length < 8) {
      setRegError('Please enter a valid contact phone number.');
      return;
    }

    if (onAddDriver) {
      onAddDriver({
        ...newDriver,
        name: newDriver.name.trim(),
        email: newDriver.email.trim().toLowerCase(),
        status: 'Available'
      });
    }

    setIsRegisterModalOpen(false);
    setNewDriver({
      name: '',
      email: '',
      password: 'driver' + Math.floor(100 + Math.random() * 900),
      phone: '+65 ',
      vehicleType: '14ft Box Truck',
      vehicleId: 'SG-' + Math.floor(1000 + Math.random() * 9000),
      licenseNumber: 'SG-CLASS4-' + Math.floor(1000 + Math.random() * 9000),
      assignedHub: 'Jurong Port Logistics Hub'
    });
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setEditFormData({
      name: driver.name || '',
      email: driver.email || '',
      password: driver.password || 'driver123',
      phone: driver.phone || '',
      vehicleType: driver.vehicleType || '14ft Box Truck',
      vehicleId: driver.vehicleId || 'SG-8819',
      licenseNumber: driver.licenseNumber || 'SG-CLASS4-9910',
      assignedHub: driver.assignedHub || 'Changi Air Cargo Logistics Hub',
      status: driver.status || 'Available'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingDriver) return;

    if (onUpdateDriver) {
      onUpdateDriver(editingDriver.id, editFormData);
    }
    if (editFormData.password && onUpdateDriverPassword) {
      onUpdateDriverPassword(editingDriver.id, editFormData.password);
    }
    setEditingDriver(null);
  };

  // Find active shipments assigned to a driver
  const getDriverShipments = (driver) => {
    return shipments.filter(s => 
      s.driverId === driver.id || 
      s.driverName === driver.name ||
      (s.driverEmail && s.driverEmail === driver.email)
    );
  };

  // Unassigned shipments for assignment modal
  const unassignedShipments = shipments.filter(s => !s.driverId && !s.driverName);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Fleet Operations & Personnel
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {drivers.length} Registered Drivers
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Drivers & Portal Access Management</h2>
          <p className="text-xs text-slate-500 font-medium max-w-2xl mt-0.5">
            Administer driver roster, provision email & password credentials for the Driver Operations Portal, and assign active consignments.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Driver</span>
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Drivers</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">{totalDrivers}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Registered fleet drivers</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available for Dispatch</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">{availableDrivers}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Ready for new assignment</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">On Active Delivery</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">{onDeliveryDrivers}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">En route with cargo</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Assigned Shipments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">{assignedShipmentsCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Dispatched to driver roster</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search driver name, email, phone, plate, ID..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Delivery">On Delivery</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Hub:</span>
          <select
            value={hubFilter}
            onChange={(e) => setHubFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Hubs</option>
            <option value="Changi Air Cargo Logistics Hub">Changi Logistics Hub</option>
            <option value="Jurong Port Logistics Hub">Jurong Port Hub</option>
            <option value="Tuas Mega Port Terminal">Tuas Mega Port</option>
            <option value="Woodlands Linehaul Logistics Depot">Woodlands Linehaul</option>
          </select>
        </div>
      </div>

      {/* DRIVERS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Driver & ID</th>
                <th className="p-3.5">Portal Login Credentials</th>
                <th className="p-3.5">Vehicle & License</th>
                <th className="p-3.5">Assigned Hub</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Active Assignment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No drivers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  const assignedList = getDriverShipments(driver);
                  const activeShipment = assignedList.find(s => s.status !== 'Delivered' && s.status !== 'Completed') || assignedList[0];
                  const isAvailable = (driver.status || 'Available') === 'Available';
                  const isPasswordRevealed = revealedPasswords[driver.id];
                  const isCopied = copiedId === driver.id;

                  return (
                    <tr key={driver.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Driver & ID */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                            <img
                              src={driver.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                              alt={driver.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{driver.name}</p>
                            <p className="font-mono text-[10px] text-slate-400 font-bold">{driver.id}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{driver.phone || '+65 9123 4567'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Portal Login Credentials */}
                      <td className="p-3.5">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5 max-w-[220px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>Login</span>
                            </span>
                            <button
                              onClick={() => handleCopyCredentials(driver)}
                              className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-0.5 cursor-pointer"
                              title="Copy email and password for driver login"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <p className="text-slate-900 font-bold truncate text-[11px]" title={driver.email}>
                            {driver.email}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-[11px]">
                            <span className="text-slate-500 font-bold">
                              {isPasswordRevealed ? (driver.password || 'driver123') : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordReveal(driver.id)}
                              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                              title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                            >
                              {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle & License */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 flex items-center space-x-1">
                            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{driver.vehicleType || '14ft Box Truck'}</span>
                          </p>
                          <p className="font-mono font-bold text-orange-600 text-[11px]">
                            {driver.vehicleId || 'SG-8819'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {driver.licenseNumber || 'SG-CLASS4'}
                          </p>
                        </div>
                      </td>

                      {/* Hub */}
                      <td className="p-3.5 text-slate-600 max-w-[140px]">
                        <div className="flex items-start space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate text-[11px] font-medium" title={driver.assignedHub}>
                            {driver.assignedHub || 'Changi Hub'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : driver.status === 'On Delivery'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {driver.status || 'Available'}
                        </span>
                      </td>

                      {/* Active Assignment */}
                      <td className="p-3.5">
                        {activeShipment ? (
                          <div className="space-y-1">
                            <button
                              onClick={() => onViewShipment && onViewShipment(activeShipment)}
                              className="font-mono font-bold text-blue-600 hover:text-orange-600 hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <Package className="w-3 h-3" />
                              <span>{activeShipment.id}</span>
                            </button>
                            <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                              {activeShipment.destination || 'Singapore Destination'}
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssignShipmentDriver(driver)}
                            className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                          >
                            + Assign Shipment
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {onTestDriverLogin && (
                            <button
                              onClick={() => onTestDriverLogin(driver)}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                              title="Test login as this driver into Driver Portal"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(driver)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Driver Credentials & Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove ${driver.name} from the fleet?`)) {
                                if (onRemoveDriver) onRemoveDriver(driver.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Driver"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: REGISTER NEW DRIVER */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Register New Driver</h3>
                  <p className="text-xs text-slate-500">Provide basic details & create portal login credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Tan"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+65 9123 4567"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Portal Login Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="driver@josanlogistics.com"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Portal Password *</label>
                    <button
                      type="button"
                      onClick={handleGenerateRegPassword}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-0.5 cursor-pointer"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Generate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={newDriver.password}
                      onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                      className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vehicle Type</label>
                  <select
                    value={newDriver.vehicleType}
                    onChange={(e) => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs cursor-pointer"
                  >
                    <option value="14ft Box Truck">14ft Box Truck</option>
                    <option value="Josan EV Express Cargo Van">Josan EV Express Cargo Van</option>
                    <option value="24ft Heavy Freight Lorry">24ft Heavy Freight Lorry</option>
                    <option value="Refrigerated Cold-Chain Van">Refrigerated Cold-Chain Van</option>
                    <option value="40ft Prime Mover Container Truck">40ft Prime Mover Container Truck</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vehicle Registration Plate</label>
                  <input
                    type="text"
                    required
                    value={newDriver.vehicleId}
                    onChange={(e) => setNewDriver({ ...newDriver, vehicleId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">License Number</label>
                  <input
                    type="text"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Operating Base Hub</label>
                  <select
                    value={newDriver.assignedHub}
                    onChange={(e) => setNewDriver({ ...newDriver, assignedHub: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs cursor-pointer"
                  >
                    <option value="Changi Air Cargo Logistics Hub">Changi Logistics Hub</option>
                    <option value="Jurong Port Logistics Hub">Jurong Port Hub</option>
                    <option value="Tuas Mega Port Terminal">Tuas Mega Port</option>
                    <option value="Woodlands Linehaul Logistics Depot">Woodlands Linehaul</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm cursor-pointer"
                >
                  Save & Authorize Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT DRIVER DETAILS & PASSWORD */}
      {editingDriver && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Edit Driver & Credentials</h3>
                  <p className="text-xs text-slate-500">Update contact, vehicle, or reset portal login password</p>
                </div>
              </div>
              <button
                onClick={() => setEditingDriver(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Driver Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Portal Login Email</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Portal Password</label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editFormData.password}
                      onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                      className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vehicle Type</label>
                  <input
                    type="text"
                    value={editFormData.vehicleType}
                    onChange={(e) => setEditFormData({ ...editFormData, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vehicle Plate</label>
                  <input
                    type="text"
                    value={editFormData.vehicleId}
                    onChange={(e) => setEditFormData({ ...editFormData, vehicleId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hub</label>
                  <input
                    type="text"
                    value={editFormData.assignedHub}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedHub: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange shadow-2xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDriver(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK ASSIGN SHIPMENT TO DRIVER */}
      {assignShipmentDriver && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Assign Consignment to {assignShipmentDriver.name}</h3>
                  <p className="text-xs text-slate-500">Pick an active unassigned shipment for dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setAssignShipmentDriver(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {shipments.filter(s => s.status !== 'Delivered' && s.status !== 'Completed').length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-6">No active shipments available.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {shipments
                    .filter(s => s.status !== 'Delivered' && s.status !== 'Completed')
                    .map((s) => {
                      const isThisDriver = s.driverId === assignShipmentDriver.id;
                      return (
                        <div
                          key={s.id}
                          className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-slate-900">{s.id}</span>
                            <p className="text-[11px] text-slate-600 font-medium">
                              {s.customer || s.customerName || 'Corporate Shipper'} • {s.origin} → {s.destination}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Currently: {s.driverName ? `Assigned to ${s.driverName}` : 'Unassigned'}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              if (onOpenAssignShipment) {
                                onOpenAssignShipment(s, assignShipmentDriver);
                              }
                              setAssignShipmentDriver(null);
                            }}
                            className="px-3 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer shrink-0"
                          >
                            {isThisDriver ? 'Re-assign' : 'Assign'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setAssignShipmentDriver(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
