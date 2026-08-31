import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Package, 
  Search, 
  MapPin, 
  Plus, 
  LifeBuoy, 
  CheckCircle2, 
  FileText,
  User
} from 'lucide-react';

export const CustomerDashboardPage = ({ setActiveTab }) => {
  const { 
    shipments, 
    currentUser, 
    setActiveTrackingId, 
    setSelectedInvoiceShipment, 
    showToast,
    customerSubTab: activeSubTab,
    setCustomerSubTab: setActiveSubTab
  } = useLogistics();

  const [addressList, setAddressList] = useState([
    { id: 1, label: 'Primary HQ Warehouse', address: '100 Silicon Way, San Jose, CA 95110', contact: 'TechCorp Shipping Manager', type: 'pickup' },
    { id: 2, label: 'East Coast Distribution Center', address: '450 Fifth Ave, Suite 1200, New York, NY 10018', contact: 'Marcus Vance', type: 'pickup' },
    { id: 3, label: 'Downtown Retail Outlet', address: '89 Orchard Road, Singapore 238854', contact: 'Store Manager', type: 'drop' },
    { id: 4, label: 'West Coast Hub Terminal', address: '12 Pioneer Sector 3, Singapore 628349', contact: 'Receiving Dock', type: 'drop' }
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newAddressType, setNewAddressType] = useState('pickup');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newLabel && newAddress) {
      setAddressList([...addressList, { 
        id: Date.now(), 
        label: newLabel, 
        address: newAddress, 
        contact: currentUser?.name || 'Customer',
        type: newAddressType
      }]);
      setNewLabel('');
      setNewAddress('');
      showToast(`New saved ${newAddressType} address added!`);
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
      <div className="flex border-b border-slate-200 space-x-8 text-sm font-bold text-slate-500">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 ${
            activeSubTab === 'orders' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Freight Orders ({shipments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('addresses')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 ${
            activeSubTab === 'addresses' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Pickup & Drop Addresses</span>
        </button>

        <button
          onClick={() => setActiveSubTab('support')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 ${
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
            <span className="text-xs text-slate-500 font-semibold">Total Orders: {shipments.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {shipments.map((s) => (
              <div key={s.id} className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 p-4 rounded-2xl transition-colors">
                
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

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setActiveTrackingId(s.id);
                      setActiveTab('track');
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-orange-sm transition-all flex items-center space-x-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </button>

                  <button
                    onClick={() => setSelectedInvoiceShipment(s)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange-600" />
                    <span>Download Invoice</span>
                  </button>
                </div>

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
                    <div key={addr.id} className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 space-y-1">
                      <p className="font-extrabold text-slate-900 text-sm">{addr.label}</p>
                      <p className="text-xs text-slate-600">{addr.address}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Contact: {addr.contact}</p>
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
                    <div key={addr.id} className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-1">
                      <p className="font-extrabold text-slate-900 text-sm">{addr.label}</p>
                      <p className="text-xs text-slate-600">{addr.address}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Contact: {addr.contact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Add New Address Location</h3>
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
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-bold shadow-orange-sm hover:bg-orange-600 transition-colors cursor-pointer"
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
