import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { SingaporeGoogleMapBackground } from '../components/SingaporeGoogleMapBackground';
import { 
  Package, 
  Search, 
  MapPin, 
  Clock, 
  Printer, 
  User, 
  Building, 
  Plus, 
  LifeBuoy, 
  ExternalLink, 
  CheckCircle2, 
  FileText
} from 'lucide-react';

export const CustomerDashboardPage = ({ setActiveTab }) => {
  const { 
    shipments, 
    currentUser, 
    currentRole,
    setActiveTrackingId, 
    setSelectedInvoiceShipment, 
    updateUserProfile,
    showToast 
  } = useLogistics();

  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders' | 'profile' | 'addresses' | 'support'
  const [expandedMapId, setExpandedMapId] = useState(null);
  const [addressList, setAddressList] = useState([
    { id: 1, label: 'Primary Pasir Panjang HQ Warehouse', address: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438', contact: 'Tan Wei Ming (Warehouse Manager)' },
    { id: 2, label: 'Changi Air Cargo Logistics Hub', address: 'Air Cargo Road, Complex Bay #4, Singapore 819830', contact: 'Gurpreet Singh (Dispatch Spec)' }
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || 'Razer Asia-Pacific HQ');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'shipping@razer.com');
  const [profileCompany, setProfileCompany] = useState(currentUser?.company || 'Razer (Asia-Pacific) Pte Ltd');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '67890123');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profilePhone.length > 0 && profilePhone.length < 8) {
      showToast('Singapore contact number must be exactly 8 digits!', 'warning');
      return;
    }
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      company: profileCompany,
      phone: profilePhone,
      address: profileAddress
    });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newLabel && newAddress) {
      setAddressList([...addressList, { id: Date.now(), label: newLabel, address: newAddress, contact: currentUser?.name || 'Customer' }]);
      setNewLabel('');
      setNewAddress('');
      showToast('New saved address added to profile!');
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
            {currentUser?.name ? currentUser.name.charAt(0) : 'C'}
          </div>
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Customer Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{currentUser?.name || 'TechCorp Solutions'}</h1>
            <p className="text-xs text-slate-500">{currentUser?.email || 'shipping@techcorp.com'} | Company: {currentUser?.company || 'TechCorp Corp'}</p>
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
          <span>My Freight Orders ({shipments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'profile' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile & Settings</span>
        </button>

        <button
          onClick={() => setActiveSubTab('addresses')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'addresses' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Pickup Addresses</span>
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

      {/* SUB-TAB: EDIT MY PROFILE & SETTINGS */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Account Details Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Customer Profile & Account Info</h2>
                <p className="text-xs text-slate-500">Update your company details, primary contact number, and billing preferences.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
                Active Verified Account
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">Full Contact Name *</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus-orange font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus-orange font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">Company / Entity Name *</label>
                  <input
                    type="text"
                    value={profileCompany}
                    onChange={(e) => setProfileCompany(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus-orange font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">Singapore Contact Phone (8 Digits) *</label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl px-3 py-3 font-bold text-slate-700 flex items-center space-x-1">
                      <span>🇸🇬</span>
                      <span>+65</span>
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={8}
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                      placeholder="81234567"
                      className="w-full p-3 border border-slate-300 rounded-r-xl focus-orange font-mono font-bold text-slate-900"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Strict numeric digits [0-9], max 8 digits for SG hotline.</p>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">Default Singapore HQ Billing Address</label>
                <textarea
                  rows="3"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus-orange font-medium"
                  placeholder="Enter full Singapore street address, unit number and postal code..."
                ></textarea>
              </div>

              {/* Notification Preferences */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Telematics & Notification Alerts</h3>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs text-slate-700 font-semibold">SMS Telematics Dispatch Alerts for Live Shipments (+65 Hotline)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailInvoices}
                    onChange={(e) => setEmailInvoices(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs text-slate-700 font-semibold">Automated PDF Invoices & Delivery Proof Receipts</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-orange-sm transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Account Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-gradient text-white flex items-center justify-center font-extrabold text-2xl shadow-orange-glow">
                  {profileName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{profileName}</h3>
                  <p className="text-xs text-slate-400">{profileCompany}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Account Role</span>
                  <span className="font-bold text-orange-400">Corporate Shipper</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Primary Contact</span>
                  <span className="font-mono font-bold text-slate-200">+65 {profilePhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Default Currency</span>
                  <span className="font-bold text-emerald-400">SGD (S$)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Freight SLA Tier</span>
                  <span className="font-bold text-amber-400">VIP Express SLA</span>
                </div>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-[11px] text-slate-300">
                🔒 Your customer profile is synchronized with Josan 24/7 Satellite Telematics for automated Singapore shipping invoicing.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 1: MY SHIPMENT ORDERS */}
      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Shipment History & Live Trackers</h2>
            <span className="text-xs text-slate-500 font-semibold">Total Orders: {shipments.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {shipments.map((s) => (
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
                      vehicle={s.vehicle || 'Josan EV Semi-Truck'}
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
            <h2 className="text-lg font-extrabold text-slate-900">Saved Profile Addresses</h2>

            <div className="space-y-4">
              {addressList.map((addr) => (
                <div key={addr.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <p className="font-extrabold text-slate-900 text-sm">{addr.label}</p>
                  <p className="text-xs text-slate-600">{addr.address}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Contact: {addr.contact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Add New Pickup Location</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. West Dock Facility"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Street & Suite Address</label>
                <textarea
                  rows="3"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter address..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-bold shadow-orange-sm hover:bg-orange-600 transition-colors"
              >
                Save Location
              </button>
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
