import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { SingaporeGoogleMapBackground } from '../components/SingaporeGoogleMapBackground';
import { 
  Package, 
  Search, 
  MapPin, 
  Plus, 
  LifeBuoy, 
  FileText,
  ExternalLink,
  Pencil,
  Trash2
} from 'lucide-react';

export const CustomerDashboardPage = ({ setActiveTab }) => {
  const { 
    shipments = [], 
    currentUser, 
    currentRole,
    setActiveTrackingId, 
    setSelectedInvoiceShipment, 
    showToast,
    customerSubTab,
    setCustomerSubTab,
    addressList = [],
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress
  } = useLogistics();

  const [localSubTab, setLocalSubTab] = useState('orders');
  const activeSubTab = (customerSubTab === 'profile' ? 'orders' : customerSubTab) || localSubTab || 'orders';
  const setActiveSubTab = (tab) => {
    setLocalSubTab(tab);
    if (setCustomerSubTab) setCustomerSubTab(tab);
  };
  const [expandedMapId, setExpandedMapId] = useState('JOS-88190-SG');

  // Live Truck GPS animation loop for Customer Portal
  const [customerTruckProgress, setCustomerTruckProgress] = useState(35);
  const [customerSpeed, setCustomerSpeed] = useState(64);

  useEffect(() => {
    const timer = setInterval(() => {
      setCustomerTruckProgress(prev => (prev >= 85 ? 15 : prev + 0.35));
      setCustomerSpeed(62 + Math.floor(Math.random() * 8));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const displayUser = currentUser || {
    name: 'Razer Asia-Pacific HQ',
    email: 'shipping@razer.com',
    company: 'Razer (Asia-Pacific) Pte Ltd',
    phone: '67890123',
    role: 'customer'
  };

  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newAddressType, setNewAddressType] = useState('pickup');
  const [newContact, setNewContact] = useState('');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleStartEdit = (addr) => {
    setEditingAddressId(addr.id);
    setNewLabel(addr.label);
    setNewAddressType(addr.type);
    setNewAddress(addr.address);
    setNewContact(addr.contact || '');
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setNewLabel('');
    setNewAddress('');
    setNewAddressType('pickup');
    setNewContact('');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newLabel || !newAddress) return;

    if (editingAddressId) {
      updateSavedAddress(editingAddressId, {
        label: newLabel,
        type: newAddressType,
        address: newAddress,
        contact: newContact || currentUser?.name || 'Customer Manager'
      });
      showToast('Saved address location updated successfully!');
      handleCancelEdit();
    } else {
      addSavedAddress({ 
        id: Date.now(), 
        label: newLabel, 
        address: newAddress, 
        contact: newContact || currentUser?.name || 'Customer Manager',
        type: newAddressType
      });
      setNewLabel('');
      setNewAddress('');
      setNewContact('');
      showToast(`New saved ${newAddressType} address added! Available in booking dropdown.`);
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    showToast('Support ticket logged with Priority Flag. Agent will contact you.');
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Driver Role Alert Banner */}
      {currentRole === 'driver' && (
        <div className="bg-amber-50 border-2 border-amber-300 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 font-extrabold shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <span className="text-lg">🚛</span>
            <span>You are currently logged in with a <strong>Driver Account ({currentUser?.name})</strong>. Switch to your Driver Portal for live GPS telematics navigation & dispatch.</span>
          </div>
          <button
            onClick={() => setActiveTab('driver-dashboard')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all whitespace-nowrap"
          >
            Open Driver Portal →
          </button>
        </div>
      )}

      {/* Customer Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-gradient text-white flex items-center justify-center font-extrabold text-2xl shadow-orange-sm">
            {displayUser.name ? displayUser.name.charAt(0) : 'R'}
          </div>
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Customer Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{displayUser.name || 'Razer Asia-Pacific HQ'}</h1>
            <p className="text-xs text-slate-500">{displayUser.email || 'shipping@razer.com'} | Company: {displayUser.company || 'Razer (Asia-Pacific) Pte Ltd'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('book')}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Shipment</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 sm:space-x-8 text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'orders' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Freight Orders ({(shipments || []).length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('addresses')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'addresses' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Pickup & Drop Addresses</span>
        </button>

        <button
          onClick={() => setActiveSubTab('support')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'support' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Support & Claims</span>
        </button>
      </div>



      {/* SUB-TAB 1: MY SHIPMENT ORDERS */}
      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Shipment History & Live Trackers</h2>
            <span className="text-xs text-slate-500 font-semibold">Total Orders: {(shipments || []).length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {(shipments || []).map((s) => (
              <div key={s.id} className="py-5 hover:bg-slate-50 p-4 rounded-2xl transition-colors space-y-4">
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-extrabold text-slate-900 text-base">{s.id}</span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        s.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      <span className="font-bold text-slate-800">{s.origin}</span> → <span className="font-bold text-slate-800">{s.destination}</span> | <span className="text-orange-600 font-semibold">{s.serviceLevel}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Recipient: {s.receiver} | Weight: {s.weight}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setExpandedMapId(expandedMapId === s.id ? null : s.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        expandedMapId === s.id
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-sm'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{expandedMapId === s.id ? 'Close Live GPS Map' : '🌐 Toggle Live GPS Map'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTrackingId(s.id);
                        setActiveTab('track');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                      <span>Full Telematics Page</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoiceShipment(s)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Inline Live GPS Telematics Map Drawer */}
                {expandedMapId === s.id && (
                  <div className="mt-3 rounded-2xl border border-slate-300 overflow-hidden h-72 shadow-xl animate-fade-in relative">
                    <SingaporeGoogleMapBackground
                      origin={s.origin}
                      destination={s.destination}
                      vehicle={s.vehicle || 'Josan EV Express Semi-Truck #SG-8819'}
                      truckProgress={customerTruckProgress}
                      currentSpeed={customerSpeed}
                      showTruck={true}
                    />
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SAVED ADDRESSES */}
      {activeSubTab === 'addresses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Saved Addresses</h2>
              <p className="text-xs text-slate-500">Manage your saved pickup and drop-off address locations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Locations */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  <span>Pickup Locations ({addressList.filter(a => a.type === 'pickup').length})</span>
                </h3>
                <div className="space-y-3">
                  {addressList.filter(a => a.type === 'pickup').map((addr) => (
                    <div key={addr.id} className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 space-y-2 group hover:border-orange-300 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-900 text-sm">{addr.label}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{addr.address}</p>
                          <p className="text-[10px] text-slate-400 font-semibold pt-0.5">Contact: {addr.contact}</p>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(addr)}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 text-[10px] font-extrabold rounded-lg flex items-center space-x-1 cursor-pointer transition-all shadow-2xs"
                            title="Edit this saved address"
                          >
                            <Pencil className="w-3 h-3 text-orange-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteSavedAddress(addr.id);
                              showToast('Saved address removed from your list.', 'info');
                            }}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drop-off Locations */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Drop-off Locations ({addressList.filter(a => a.type === 'drop').length})</span>
                </h3>
                <div className="space-y-3">
                  {addressList.filter(a => a.type === 'drop').map((addr) => (
                    <div key={addr.id} className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-2 group hover:border-blue-300 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-900 text-sm">{addr.label}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{addr.address}</p>
                          <p className="text-[10px] text-slate-400 font-semibold pt-0.5">Contact: {addr.contact}</p>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(addr)}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-[10px] font-extrabold rounded-lg flex items-center space-x-1 cursor-pointer transition-all shadow-2xs"
                            title="Edit this saved address"
                          >
                            <Pencil className="w-3 h-3 text-blue-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteSavedAddress(addr.id);
                              showToast('Saved address removed from your list.', 'info');
                            }}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel: Add or Edit Saved Address */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                {editingAddressId ? <Pencil className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-orange-500" />}
                <span>{editingAddressId ? 'Edit Saved Address Location' : 'Add New Address Location'}</span>
              </h3>
              {editingAddressId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. West Dock Facility"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-bold text-slate-900"
                  required
                />
              </div>
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address Type</label>
                <select
                  value={newAddressType}
                  onChange={(e) => setNewAddressType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus-orange font-bold cursor-pointer"
                >
                  <option value="pickup">Pickup Location</option>
                  <option value="drop">Drop-off Location</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Street & Suite Address</label>
                <textarea
                  rows="3"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter full address details..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-medium text-slate-800"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Person / Manager</label>
                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="e.g. Tan Wei Ming (Warehouse Manager)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-extrabold shadow-orange-sm hover:bg-orange-600 transition-all cursor-pointer text-xs"
                >
                  {editingAddressId ? 'Update Address Location ✓' : 'Save Location'}
                </button>
                {editingAddressId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SUPPORT & CLAIMS */}
      {activeSubTab === 'support' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Submit Priority Ticket</h2>
            <p className="text-xs text-slate-500">Log a query or insurance claim directly with dispatch managers.</p>
          </div>

          <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Expedite Customs Clearance"
                className="w-full p-3 border border-slate-300 rounded-xl focus-orange"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ticket Details</label>
              <textarea
                rows="4"
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Provide tracking ID or issue details..."
                className="w-full p-3 border border-slate-300 rounded-xl focus-orange"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
