import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Package, 
  Search, 
  MapPin, 
  Plus, 
  LifeBuoy, 
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
  CreditCard,
  CheckCircle2,
  MessageSquare,
  Mail,
  AlertCircle,
  ShieldCheck,
  Lock,
  X
} from 'lucide-react';

export const CustomerDashboardPage = ({ setActiveTab }) => {
  const { 
    shipments = [], 
    currentUser, 
    currentRole,
    setActiveTrackingId, 
    setSelectedInvoiceShipment, 
    deleteShipment,
    showToast,
    customerSubTab,
    setCustomerSubTab,
    addressList = [],
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress
  } = useLogistics();

  // Message modal & order deletion state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetOrder, setMessageTargetOrder] = useState(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleOpenMessageModal = (order) => {
    setMessageTargetOrder(order);
    setMessageSubject(`Order Cancellation Request / Inquiry for Order #${order.id}`);
    setMessageText('');
    setIsMessageModalOpen(true);
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      showToast('Please type a message before sending.', 'warning');
      return;
    }
    showToast(`Cancellation / Inquiry message regarding Order #${messageTargetOrder?.id || ''} successfully dispatched to Josan Logistics support!`, 'success');
    setIsMessageModalOpen(false);
    setMessageTargetOrder(null);
    setMessageSubject('');
    setMessageText('');
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}? This will remove it permanently.`)) {
      deleteShipment(orderId);
      showToast(`Order #${orderId} deleted successfully.`, 'info');
    }
  };

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

  // Saved Payment Methods State (persisted in localStorage)
  const defaultSavedCards = [
    {
      id: 'card-1',
      name: 'Razer Corporate Visa',
      number: '•••• •••• •••• 4242',
      rawNumber: '4242',
      exp: '12/28',
      type: 'VISA',
      isPrimary: true
    },
    {
      id: 'card-2',
      name: 'Operations Mastercard',
      number: '•••• •••• •••• 8892',
      rawNumber: '8892',
      exp: '09/27',
      type: 'MASTERCARD',
      isPrimary: false
    },
    {
      id: 'card-3',
      name: 'Executive Travel AMEX',
      number: '•••• •••• •••• 1004',
      rawNumber: '1004',
      exp: '04/29',
      type: 'AMEX',
      isPrimary: false
    }
  ];

  const [savedCards, setSavedCards] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_saved_cards');
      return saved ? JSON.parse(saved) : defaultSavedCards;
    } catch (e) {
      return defaultSavedCards;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_saved_cards', JSON.stringify(savedCards));
    } catch (e) {}
  }, [savedCards]);

  // Add Payment Method Modal State
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardType, setNewCardType] = useState('VISA');
  const [newCardNickname, setNewCardNickname] = useState('');
  const [newCardIsPrimary, setNewCardIsPrimary] = useState(false);
  const [cardError, setCardError] = useState('');

  const formatCardNumber = (val) => {
    const digits = val.replace(/[^0-9]/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpDate = (val) => {
    const digits = val.replace(/[^0-9]/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    setCardError('');

    const cleanNumber = newCardNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 15) {
      setCardError('Please enter a valid 15 or 16 digit card number.');
      return;
    }

    if (!newCardExp || newCardExp.length < 5) {
      setCardError('Please enter a valid expiration date (MM/YY).');
      return;
    }

    if (!newCardCvv || newCardCvv.length < 3) {
      setCardError('Please enter a valid CVV security code (3 or 4 digits).');
      return;
    }

    const last4 = cleanNumber.slice(-4);
    const formattedMasked = `•••• •••• •••• ${last4}`;

    const newCardObj = {
      id: `card-${Date.now()}`,
      name: newCardNickname.trim() || newCardName.trim() || `${displayUser.name || 'Corporate'} ${newCardType}`,
      number: formattedMasked,
      rawNumber: last4,
      exp: newCardExp,
      type: newCardType,
      isPrimary: newCardIsPrimary
    };

    let updatedList = [...savedCards];
    if (newCardIsPrimary) {
      updatedList = updatedList.map(c => ({ ...c, isPrimary: false }));
    }
    updatedList.push(newCardObj);

    setSavedCards(updatedList);
    showToast(`New ${newCardType} card (•••• ${last4}) added successfully!`);

    // Reset Form
    setNewCardName('');
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvv('');
    setNewCardType('VISA');
    setNewCardNickname('');
    setNewCardIsPrimary(false);
    setCardError('');
    setIsAddCardModalOpen(false);
  };

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

        <button
          onClick={() => setActiveSubTab('billing')}
          className={`pb-3 flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'billing' ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Billing & Payments</span>
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
                
                <div className="space-y-3">
                  {/* Order Details Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-extrabold text-slate-900 text-base">{s.id}</span>
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          s.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          {s.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        <span className="font-bold text-slate-800">{s.origin}</span> → <span className="font-bold text-slate-800">{s.destination}</span> | <span className="text-orange-600 font-semibold">{s.serviceLevel}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">Recipient: {s.receiver} | Weight: {s.weight}</p>
                    </div>
                  </div>

                  {/* Clean Action Button Toolbar (Unified Horizontal Row) */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-start sm:justify-end gap-2 text-xs">
                    <button
                      onClick={() => setExpandedMapId(expandedMapId === s.id ? null : s.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                        expandedMapId === s.id
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-sm active:scale-95'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{expandedMapId === s.id ? 'Close Timeline' : '📍 Track Delivery Timeline'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTrackingId(s.id);
                        setActiveTab('track');
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 whitespace-nowrap cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                      <span>Full Telematics Page</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoiceShipment(s)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 whitespace-nowrap cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>Invoice</span>
                    </button>

                    <button
                      onClick={() => handleOpenMessageModal(s)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Message Company</span>
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(s.id)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete Order</span>
                    </button>
                  </div>
                </div>

                {/* Inline Delivery Timeline Stepper Drawer (Matches Tracking Stepper View) */}
                {expandedMapId === s.id && (
                  <div className="mt-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl animate-fade-in space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                          <span>DELIVERY TIMELINE STEPPER</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          Order Tracking Reference: <strong className="font-mono text-orange-600">#{s.id}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedMapId(null)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Close Timeline ✕
                      </button>
                    </div>

                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3.5 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                      {((s.timeline && Array.isArray(s.timeline) && s.timeline.length > 0)
                        ? s.timeline
                        : [
                            {
                              title: 'Order Booked & TradeNet Customs Cleared',
                              location: s.origin ? `${s.origin} (SIN)` : 'Changi Air Cargo Complex (SIN)',
                              timestamp: s.createdDate || 'Aug 31, 08:15 AM',
                              completed: true,
                              current: false
                            },
                            {
                              title: 'Picked Up by Josan Fleet Courier',
                              location: s.origin ? `${s.origin} Depot` : 'Changi Logistics Depot',
                              timestamp: 'Aug 31, 10:40 AM',
                              completed: true,
                              current: false
                            },
                            {
                              title: 'In Transit via TPE Expressway Hub',
                              location: s.currentLocation || 'Tampines Logistics Depot',
                              timestamp: 'Aug 31, 01:20 PM',
                              completed: true,
                              current: true
                            },
                            {
                              title: 'Out for Final Dispatch',
                              location: s.destination || 'Jurong Port Hub',
                              timestamp: 'Expected Today, 03:30 PM',
                              completed: false,
                              current: false
                            },
                            {
                              title: 'Delivered & Digital E-Signature Signed',
                              location: s.receiverAddress || s.destination || '10 Jurong Port Road',
                              timestamp: 'Expected Today, 04:30 PM',
                              completed: false,
                              current: false
                            }
                          ]
                      ).map((step, idx) => {
                        const isCompleted = step.completed || s.status === 'Delivered';
                        const isCurrent = step.current || (!isCompleted && idx === 2);

                        return (
                          <div key={idx} className="relative flex items-start space-x-4">
                            {/* Timeline Node Icon Circle */}
                            <div className={`absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all z-10 ${
                              isCurrent
                                ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-orange-sm'
                                : isCompleted
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-300 font-mono text-[11px]'
                            }`}>
                              {isCompleted || isCurrent ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                            </div>

                            {/* Step Details Box */}
                            <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                              isCurrent
                                ? 'bg-orange-50/80 border-orange-200 shadow-xs'
                                : isCompleted
                                ? 'bg-white border-slate-200'
                                : 'bg-slate-50/60 border-slate-100'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h4 className={`text-xs sm:text-sm font-extrabold ${isCurrent ? 'text-orange-600' : 'text-slate-900'}`}>
                                  {step.title}
                                </h4>
                                <span className="text-[11px] font-semibold text-slate-400 font-mono">{step.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1.5 flex items-center space-x-1 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{step.location}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

      {/* SUB-TAB 4: BILLING & PAYMENTS */}
      {activeSubTab === 'billing' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Saved Payment Methods Section */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Saved Payment Methods</h2>
                <p className="text-xs text-slate-500">Manage corporate credit cards and instant payment authorization.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(true)}
                className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Payment Method</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedCards.map((card) => (
                <div 
                  key={card.id} 
                  className={`p-5 rounded-2xl space-y-3 shadow-md border relative transition-all ${
                    card.isPrimary 
                      ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700' 
                      : 'bg-white text-slate-900 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {card.isPrimary ? (
                      <span className="text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
                        ★ Primary Default
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {card.type} Card
                      </span>
                    )}
                    <div className="flex items-center space-x-1.5">
                      <CreditCard className={`w-5 h-5 ${card.isPrimary ? 'text-slate-400' : 'text-orange-500'}`} />
                      {savedCards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = savedCards.filter(c => c.id !== card.id);
                            if (card.isPrimary && filtered.length > 0) {
                              filtered[0].isPrimary = true;
                            }
                            setSavedCards(filtered);
                            showToast(`Payment method (•••• ${card.rawNumber}) removed.`);
                          }}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            card.isPrimary ? 'hover:bg-slate-700 text-slate-400 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                          }`}
                          title="Remove card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className={`text-xs font-medium ${card.isPrimary ? 'text-slate-400' : 'text-slate-500'}`}>{card.name}</p>
                    <p className={`text-base font-mono font-extrabold tracking-widest mt-1 ${card.isPrimary ? 'text-white' : 'text-slate-900'}`}>{card.number}</p>
                  </div>

                  <div className={`flex justify-between items-center text-[10px] pt-1 ${card.isPrimary ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>Expires: {card.exp}</span>
                    <span className={`font-bold ${card.isPrimary ? 'text-slate-200' : 'text-slate-700'}`}>{card.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing & Invoice History Table */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Billing History & Statements</h2>
                <p className="text-xs text-slate-500">Track payment status per order and pay pending invoices.</p>
              </div>
              <span className="text-xs font-bold text-slate-500">Showing {(shipments || []).length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Shipment ID</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Payment Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {(shipments || []).map((s) => {
                    const isPaid = s.paymentStatus === 'Paid' || (s.paymentStatus !== 'Unpaid' && !s.isUnpaid);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono text-slate-600">{s.createdDate ? s.createdDate.split(' ')[0] : '2026-08-31'}</td>
                        <td className="p-3.5 font-mono font-extrabold text-slate-900">{s.id}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">{s.price || '$350.00'}</td>
                        <td className="p-3.5">
                          {isPaid ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>Paid</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              <span>Pending Payment</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          {isPaid ? (
                            <button
                              onClick={() => setSelectedInvoiceShipment(s)}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                              <span>View Invoice</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedInvoiceShipment(s)}
                              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all inline-flex items-center space-x-1 cursor-pointer active:scale-95"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Now</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SEND MESSAGE TO COMPANY MODAL */}
      {isMessageModalOpen && messageTargetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Send Message to Josan Logistics
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Order Reference: <span className="font-mono font-bold text-orange-600">#{messageTargetOrder.id}</span></p>
                </div>
              </div>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessageSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Shipment Order: <strong className="font-mono text-orange-600">#{messageTargetOrder.id}</strong></span>
                  <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono font-extrabold">{messageTargetOrder.status}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Route: {messageTargetOrder.origin} → {messageTargetOrder.destination}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Request Type</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message / Reason for Cancellation *</label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Please state why you want to cancel this order or send instructions to Josan Logistics support team..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus-orange text-xs leading-relaxed text-slate-900 resize-none"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-blue-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PAYMENT METHOD MODAL */}
      {isAddCardModalOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddCardModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold font-sans">Add New Payment Method</h3>
                  <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                    <span>256-Bit SSL Encrypted Card Vault</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCardSubmit} className="p-6 space-y-4 text-xs">
              
              {cardError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{cardError}</span>
                </div>
              )}

              {/* Cardholder Name */}
              <div>
                <label className="block font-extrabold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="e.g. Razer Corporate Operations"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange text-xs"
                  required
                />
              </div>

              {/* Card Brand & Label Nickname */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Card Network *
                  </label>
                  <select
                    value={newCardType}
                    onChange={(e) => setNewCardType(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange text-xs cursor-pointer"
                  >
                    <option value="VISA">Visa Card</option>
                    <option value="MASTERCARD">Mastercard</option>
                    <option value="AMEX">American Express</option>
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Card Nickname / Label
                  </label>
                  <input
                    type="text"
                    value={newCardNickname}
                    onChange={(e) => setNewCardNickname(e.target.value)}
                    placeholder="e.g. Singapore Dispatch"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange text-xs"
                  />
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block font-extrabold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center justify-between">
                  <span>Card Number *</span>
                  <span className="text-[10px] text-orange-600 font-mono">16 Digits</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    maxLength={19}
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4532 8920 1102 4242"
                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-300 rounded-xl font-mono font-extrabold text-slate-900 focus-orange text-xs tracking-wider"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5" />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Expiration Date *
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(formatExpDate(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-extrabold text-slate-900 focus-orange text-xs text-center"
                    required
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center justify-between">
                    <span>CVV / CVC Code *</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newCardCvv}
                    onChange={(e) => setNewCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="•••"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-extrabold text-slate-900 focus-orange text-xs text-center"
                    required
                  />
                </div>
              </div>

              {/* Set Primary Default Checkbox */}
              <div className="pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={newCardIsPrimary}
                    onChange={(e) => setNewCardIsPrimary(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 border-slate-300 cursor-pointer"
                  />
                  <span className="font-bold text-slate-800 text-xs">Set as primary default payment card for instant order billing</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Save Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
