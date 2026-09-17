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
  X,
  User,
  LogOut,
  Navigation,
  Bell,
  DollarSign,
  Check,
  Truck,
  Phone,
  Clock,
  ChevronRight,
  Download,
  Upload,
  Send,
  Paperclip
} from 'lucide-react';

export const CustomerDashboardPage = ({ setActiveTab, initialSubTab = 'orders' }) => {
  const { 
    shipments = [], 
    quotes = [],
    notifications = [],
    documents = [],
    tickets = [],
    currentUser, 
    currentRole,
    setActiveTrackingId, 
    setSelectedInvoiceShipment, 
    setSelectedDetailShipment,
    deleteShipment,
    showToast,
    customerSubTab,
    setCustomerSubTab,
    addressList = [],
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    logoutUser,
    updateUserProfile,
    customerRespondQuote,
    convertQuoteToShipment,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createSupportTicket,
    replySupportTicket,
    uploadShipmentDocument,
    deleteShipmentDocument
  } = useLogistics();

  // Phase 3 Support Ticket & Document Management state
  const [activeCustomerTicket, setActiveCustomerTicket] = useState(null);
  const [customerReplyText, setCustomerReplyText] = useState('');
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    shipmentId: '',
    subject: '',
    category: 'Transit Status',
    priority: 'Medium',
    message: ''
  });

  const [isUploadCustDocOpen, setIsUploadCustDocOpen] = useState(false);
  const [newCustDocData, setNewCustDocData] = useState({
    shipmentId: '',
    type: 'Commercial Invoice',
    name: ''
  });
  const [viewingCustDoc, setViewingCustDoc] = useState(null);


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

  const [localSubTab, setLocalSubTab] = useState(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setLocalSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const normalizeSubTab = (tab) => {
    if (!tab) return 'orders';
    if (tab === 'my-shipments') return 'orders';
    if (tab === 'my-profile') return 'profile';
    if (tab === 'invoices') return 'billing';
    if (tab === 'saved-addresses') return 'addresses';
    if (tab === 'documents' || tab === 'my-documents') return 'documents';
    if (tab === 'support' || tab === 'help') return 'support';
    return tab;
  };

  const activeSubTab = normalizeSubTab(customerSubTab) || normalizeSubTab(localSubTab) || 'orders';
  const setActiveSubTab = (tab) => {
    setLocalSubTab(tab);
    if (setCustomerSubTab) setCustomerSubTab(tab);
  };

  const customerShipmentIds = new Set((shipments || []).map(s => s.id));
  const customerDocuments = (documents || []).filter(d => 
    customerShipmentIds.has(d.shipmentId) || 
    (d.customerName && d.customerName.toLowerCase().includes((currentUser?.name || 'Razer').toLowerCase())) ||
    (d.customerName && d.customerName.toLowerCase().includes((currentUser?.company || 'Razer').toLowerCase()))
  );
  const customerTickets = (tickets || []).filter(t => 
    customerShipmentIds.has(t.shipmentId) || 
    t.customerEmail === currentUser?.email || 
    (t.customerName && t.customerName.toLowerCase().includes((currentUser?.name || 'Razer').toLowerCase()))
  );


  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || 'Razer Asia-Pacific HQ');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '+65 6789 0123');
  const [profileCompany, setProfileCompany] = useState(currentUser?.company || 'Razer (Asia-Pacific) Pte Ltd');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileCompany(currentUser.company || '');
    }
  }, [currentUser]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      phone: profilePhone,
      company: profileCompany
    });
    setIsEditingProfile(false);
    showToast('Customer profile details updated successfully!');
  };

  const handleDashboardLogout = () => {
    logoutUser();
    if (setActiveTab) setActiveTab('home');
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
    <div className="space-y-6 pb-20 w-full px-3 sm:px-5 lg:px-6 pt-6 animate-fade-in">
      
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
            <p className="text-xs text-slate-700 font-semibold">{displayUser.email || 'shipping@razer.com'} | Company: {displayUser.company || 'Razer (Asia-Pacific) Pte Ltd'}</p>
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

      {/* 2-Column Dashboard Layout: Left Navigation + Center Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Navigation Tabs Panel (Red Marked Field) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-card space-y-2 sticky top-24">
          <p className="px-3 pt-1 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Customer Portal
          </p>

          {/* 1. My Profile */}
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full p-3 rounded-2xl flex items-center space-x-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>My Profile</span>
          </button>

          {/* 2. My Shipments */}
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'orders'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Package className="w-4 h-4 shrink-0" />
              <span>My Shipments</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeSubTab === 'orders' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
            }`}>
              {(shipments || []).length}
            </span>
          </button>

          {/* 2b. Quotations & Pricing */}
          <button
            onClick={() => setActiveSubTab('quotes')}
            className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'quotes'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <DollarSign className="w-4 h-4 shrink-0" />
              <span>Quotations</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeSubTab === 'quotes' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
            }`}>
              {(quotes || []).length}
            </span>
          </button>

          {/* 2c. Notifications Panel */}
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'notifications'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
            </div>
            {notifications.filter(n => (n.role === 'customer' || !n.role) && !n.read).length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                {notifications.filter(n => (n.role === 'customer' || !n.role) && !n.read).length}
              </span>
            )}
          </button>

          {/* 3. Track Shipment */}
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('track');
            }}
            className="w-full p-3 rounded-2xl flex items-center space-x-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 shrink-0 text-orange-500" />
            <span>Track Shipment</span>
          </button>

          {/* 4. Invoices */}
          <button
            onClick={() => setActiveSubTab('billing')}
            className={`w-full p-3 rounded-2xl flex items-center space-x-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'billing'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Invoices</span>
          </button>

          {/* 4b. Consignment Documents Vault */}
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'documents'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Documents Vault</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeSubTab === 'documents' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
            }`}>
              {customerDocuments.length}
            </span>
          </button>

          {/* 5. Saved Addresses */}
          <button
            onClick={() => setActiveSubTab('addresses')}
            className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'addresses'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Saved Addresses</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeSubTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {(addressList || []).length}
            </span>
          </button>

          {/* Secondary Subtabs: Manage Orders & Support */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => setActiveSubTab('manage')}
              className={`w-full p-2.5 rounded-xl flex items-center space-x-2 text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'manage'
                  ? 'bg-orange-100 text-orange-700 font-extrabold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" />
              <span>Manage Orders</span>
            </button>

            <button
              onClick={() => setActiveSubTab('support')}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'support'
                  ? 'bg-orange-100 text-orange-700 font-extrabold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <LifeBuoy className="w-3.5 h-3.5 shrink-0" />
                <span>Support & Claims</span>
              </div>
              {customerTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-orange-500 text-white">
                  {customerTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length}
                </span>
              )}
            </button>
          </div>

          {/* 6. Logout */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleDashboardLogout}
              className="w-full p-2.5 rounded-xl flex items-center space-x-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>

          {/* Quick Stats in Left Nav */}
          <div className="pt-4 mt-3 border-t border-slate-100 px-3 pb-1 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-semibold">In-Transit:</span>
              <span className="font-mono font-bold text-orange-600">
                {(shipments || []).filter(s => s.status !== 'Delivered').length}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-semibold">Delivered:</span>
              <span className="font-mono font-bold text-emerald-600">
                {(shipments || []).filter(s => s.status === 'Delivered').length}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Main Content Area (Green Marked Field) */}
        <div className="lg:col-span-9 space-y-6">

      {/* SUB-TAB 1 & 2: MY SHIPMENT ORDERS & MANAGE ORDERS */}
      {(activeSubTab === 'orders' || activeSubTab === 'manage') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {activeSubTab === 'manage' ? 'Manage Freight Orders & Cancellations' : 'Shipment History & Live Trackers'}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {activeSubTab === 'manage'
                  ? 'Review and delete active order bookings if needed.'
                  : 'View active freight orders and live delivery tracking status.'}
              </p>
            </div>
            <span className="text-xs text-slate-800 font-extrabold">Total Orders: {(shipments || []).length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {(shipments || []).map((s) => (
              <div key={s.id} className="py-5 hover:bg-slate-50 p-4 rounded-2xl transition-colors space-y-4">
                
                <div className="space-y-3">
                  {/* Order Details Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900 text-base">{s.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          s.status === 'Delivered' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : s.status === 'Near Destination'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200 animate-pulse'
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          ● {s.status}
                        </span>
                        {s.referenceNumber && (
                          <span className="text-[11px] text-slate-500 font-mono">Ref: {s.referenceNumber}</span>
                        )}
                      </div>

                      <p className="text-xs text-slate-800 font-semibold">
                        <span className="font-bold text-slate-900">{s.origin}</span> → <span className="font-bold text-slate-900">{s.destination}</span> | <span className="text-orange-600 font-extrabold">{s.serviceLevel || 'Express Linehaul'}</span>
                      </p>
                      <p className="text-[11px] text-slate-700 font-semibold">
                        Consignee: {s.receiver} &bull; Cargo: {s.cargoType || 'General Freight'} &bull; Weight: {s.weight}
                      </p>
                    </div>

                    <div className="text-left sm:text-right text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contract Amount</span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">{s.price || 'S$ 350.00'}</span>
                    </div>
                  </div>

                  {/* Telematics, Driver & Vehicle Row (Requirement 2) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F5F6F8] p-3 rounded-xl border border-slate-200/90 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-orange shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Driver</span>
                        <span className="font-bold text-[#10182D]">{s.driverName || s.driver || 'Tan Wei Ming'}</span>
                        <span className="text-slate-500 text-[10px] block">{s.driverPhone || '+65 9123 4567'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-orange shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Vehicle Plate & Class</span>
                        <span className="font-mono font-bold text-[#10182D]">{s.vehiclePlate || 'SG-8819'}</span>
                        <span className="text-slate-500 text-[10px] block truncate">{s.vehicle || 'Heavy Linehaul Truck'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-orange shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Current Location</span>
                        <span className="font-bold text-orange truncate block">{s.currentLocation || 'Expressway Corridor'}</span>
                        <span className="text-slate-500 text-[10px] block">Updated: {s.lastUpdatedTime || 'Just now'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery OTP Callout (Requirement 5: Driver reaches destination -> Customer receives OTP) */}
                  {(s.status === 'Near Destination' || s.otpActive) && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 text-amber-950 font-bold">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span>🚚 Driver approaching destination dock! Delivery 2FA Security Code:</span>
                          <p className="text-[11px] font-normal text-amber-800">
                            Present this 6-digit OTP to the driver to authorize handover and generate your certified e-POD.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] uppercase font-bold text-amber-700">Handover OTP:</span>
                        <span className="px-3 py-1 bg-amber-600 text-white font-mono font-black text-sm rounded-lg tracking-widest shadow-xs">
                          {s.otpActive || '749201'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* POD Badge for Delivered Orders (Requirement 4) */}
                  {s.status === 'Delivered' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 px-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Proof of Delivery (e-POD) signed and verified by consignee.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedDetailShipment(s)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>View / Download POD</span>
                      </button>
                    </div>
                  )}

                  {/* Clean Action Button Toolbar (Unified Horizontal Row) */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-start sm:justify-end gap-2 text-xs">
                    <button
                      onClick={() => setSelectedDetailShipment(s)}
                      className="px-3.5 py-1.5 bg-[#10182D] hover:bg-navy/90 text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange" />
                      <span>Full Dossier & POD</span>
                    </button>

                    <button
                      onClick={() => setExpandedMapId(expandedMapId === s.id ? null : s.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                        expandedMapId === s.id
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-sm active:scale-95'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{expandedMapId === s.id ? 'Close Timeline' : '📍 Track Timeline'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTrackingId(s.id);
                        setActiveTab('track');
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 whitespace-nowrap cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                      <span>Public Tracking</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoiceShipment(s)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 whitespace-nowrap cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>Invoice</span>
                    </button>

                    {/* Show Delete Order button ONLY in Manage Orders subtab */}
                    {activeSubTab === 'manage' && (
                      <button
                        onClick={() => handleDeleteOrder(s.id)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete Order</span>
                      </button>
                    )}
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
                              title: 'Final Delivery to Destination Warehouse',
                              location: s.destination ? `${s.destination}` : 'Jurong Port Logistics Hub',
                              timestamp: 'Estimated Tomorrow',
                              completed: false,
                              current: false
                            }
                          ]
                      ).map((step, idx) => {
                        const isCompleted = step.completed;
                        const isCurrent = step.current;
                        return (
                          <div key={idx} className="relative flex items-start space-x-4 group">
                            <div className={`absolute -left-6 sm:-left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                              isCurrent
                                ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-orange-sm'
                                : isCompleted
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-300 font-mono text-[11px]'
                            }`}>
                              {isCompleted || isCurrent ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                            </div>

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

      {/* SUB-TAB: QUOTATIONS & ESTIMATES (Requirement 6) */}
      {activeSubTab === 'quotes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange" />
                <span>Quotations & Freight Rate Proposals</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Review itemized pricing, accept/reject official quotes, and convert directly into live shipments.
              </p>
            </div>
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('quote');
              }}
              className="px-4 py-2 bg-orange hover:bg-orange/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Request New Quote</span>
            </button>
          </div>

          <div className="space-y-4">
            {(quotes || []).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No quotation requests on file</p>
                <p className="text-xs text-slate-500 mt-1">Submit a quick route and weight estimate to receive an itemized quote.</p>
              </div>
            ) : (
              (quotes || []).map((q) => {
                const isSent = q.status === 'Sent';
                const isAccepted = q.status === 'Accepted';
                const isRejected = q.status === 'Rejected';
                const isConverted = q.status === 'Converted';
                const lineItems = q.lineItems || {
                  baseCharge: 320,
                  distanceCharge: 85,
                  cargoCharge: 60,
                  vehicleCharge: 110,
                  additionalServices: 35,
                  taxAmount: 54.90,
                  finalAmount: 664.90
                };

                return (
                  <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-orange/30 transition-all shadow-xs space-y-4">
                    {/* Header & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 text-base">{q.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isConverted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isAccepted
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : isSent
                              ? 'bg-orange-100 text-orange-800 border border-orange-200 animate-pulse'
                              : isRejected
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            ● {q.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested: <span className="font-medium text-slate-700">{q.createdDate || 'Recently'}</span> &bull; Mode: <strong className="text-slate-800">{q.freightMode || 'Roadway Linehaul'}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Contract Amount</span>
                        <span className="text-xl font-bold font-mono text-orange">
                          S$ {lineItems.finalAmount ? lineItems.finalAmount.toFixed(2) : '664.90'}
                        </span>
                      </div>
                    </div>

                    {/* Origin & Destination */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FFF8F2] p-3.5 rounded-xl border border-orange/20">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Origin / Loading Point</span>
                        <strong className="text-[#10182D] text-sm">{q.origin}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination / Unloading Point</span>
                        <strong className="text-[#10182D] text-sm">{q.destination}</strong>
                      </div>
                    </div>

                    {/* Line Items Breakdown Table (Requirement 6) */}
                    <div className="bg-[#F5F6F8] rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                      <span className="font-bold text-[#10182D] uppercase text-[11px] block tracking-wide">
                        Itemized Pricing Breakdown
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-slate-600">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="block text-slate-400 text-[10px]">Base Transport Charge</span>
                          <strong className="text-[#10182D]">S$ {lineItems.baseCharge?.toFixed(2) || '0.00'}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="block text-slate-400 text-[10px]">Distance / Route Charge</span>
                          <strong className="text-[#10182D]">S$ {lineItems.distanceCharge?.toFixed(2) || '0.00'}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="block text-slate-400 text-[10px]">Cargo Handling & Security</span>
                          <strong className="text-[#10182D]">S$ {lineItems.cargoCharge?.toFixed(2) || '0.00'}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="block text-slate-400 text-[10px]">Vehicle Specification</span>
                          <strong className="text-[#10182D]">S$ {lineItems.vehicleCharge?.toFixed(2) || '0.00'}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="block text-slate-400 text-[10px]">Additional Services / Accessorials</span>
                          <strong className="text-[#10182D]">S$ {lineItems.additionalServices?.toFixed(2) || '0.00'}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="block text-slate-400 text-[10px]">Singapore GST (9%)</span>
                          <strong className="text-[#10182D]">S$ {lineItems.taxAmount?.toFixed(2) || '0.00'}</strong>
                        </div>
                      </div>

                      {q.adminNotes && (
                        <p className="text-[11px] text-slate-500 italic pt-1">
                          Operations Note: "{q.adminNotes}"
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-slate-500">
                        {isConverted && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Active as Order #{q.convertedShipmentId}
                          </span>
                        )}
                        {isAccepted && !isConverted && (
                          <span className="text-blue-700 font-bold flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Quotation accepted! Click "Proceed to Booking" to confirm dispatch.
                          </span>
                        )}
                        {isSent && (
                          <span className="text-orange font-semibold">
                            Please review the pricing and accept or reject this quote.
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isSent && (
                          <>
                            <button
                              onClick={() => customerRespondQuote(q.id, 'Rejected')}
                              className="px-4 py-2 border border-slate-300 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Reject Quote
                            </button>
                            <button
                              onClick={() => customerRespondQuote(q.id, 'Accepted')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept Quote</span>
                            </button>
                          </>
                        )}

                        {isAccepted && (
                          <button
                            onClick={() => {
                              const created = convertQuoteToShipment(q.id);
                              if (created) {
                                setActiveSubTab('orders');
                              }
                            }}
                            className="px-5 py-2.5 bg-orange hover:bg-orange/90 text-white rounded-xl text-xs font-black transition-all shadow-orange-sm cursor-pointer flex items-center gap-2 animate-bounce-subtle"
                          >
                            <span>Proceed to Booking →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: NOTIFICATIONS PANEL (Requirement 3) */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange" />
                <span>Customer Notifications Center</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Real-time dispatch alerts, booking updates, OTP verifications, and delivery receipts.
              </p>
            </div>
            <button
              onClick={() => markAllNotificationsAsRead('customer')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
            >
              Mark All as Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.filter(n => n.role === 'customer' || !n.role).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No new notifications</p>
                <p className="text-xs text-slate-500 mt-1">You are all caught up with your shipment tracking updates.</p>
              </div>
            ) : (
              notifications.filter(n => n.role === 'customer' || !n.role).map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    !n.read 
                      ? 'bg-[#FFF8F2] border-orange/30 shadow-xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${!n.read ? 'text-[#10182D]' : 'text-slate-700'}`}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-orange animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">{n.timestamp}</span>
                  </div>

                  {n.shipmentId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTrackingId(n.shipmentId);
                        setActiveTab('track');
                      }}
                      className="px-3 py-1 bg-white hover:bg-orange/10 text-orange border border-orange/30 rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      Track
                    </button>
                  )}
                  {n.quoteId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSubTab('quotes');
                      }}
                      className="px-3 py-1 bg-white hover:bg-orange/10 text-orange border border-orange/30 rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      View Quote
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SUPPORT & CLAIMS */}
      {activeSubTab === 'support' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Dispute Resolution & Cargo SLA Support</h2>
            <p className="text-xs text-slate-800 font-semibold">Log a query or insurance claim directly with dispatch managers.</p>
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
                <h2 className="text-lg font-extrabold text-slate-900">Corporate Payment Cards</h2>
                <p className="text-xs text-slate-800 font-semibold">Manage corporate credit cards and instant payment authorization.</p>
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
                      <span className="text-[10px] font-bold text-slate-900 uppercase bg-slate-100 px-2.5 py-0.5 rounded-full">
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
                            card.isPrimary ? 'hover:bg-slate-700 text-slate-400 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-900 hover:text-rose-600'
                          }`}
                          title="Remove card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className={`text-xs font-medium ${card.isPrimary ? 'text-slate-400' : 'text-slate-900'}`}>{card.name}</p>
                    <p className={`text-base font-mono font-extrabold tracking-widest mt-1 ${card.isPrimary ? 'text-white' : 'text-slate-900'}`}>{card.number}</p>
                  </div>

                  <div className={`flex justify-between items-center text-[10px] pt-1 ${card.isPrimary ? 'text-slate-400' : 'text-slate-900'}`}>
                    <span>Expires: {card.exp}</span>
                    <span className={`font-bold ${card.isPrimary ? 'text-slate-200' : 'text-slate-900'}`}>{card.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing & Invoice History Table */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Invoices & Payment Records</h2>
                <p className="text-xs text-slate-800 font-semibold">Track payment status per order and pay pending invoices.</p>
              </div>
              <span className="text-xs font-bold text-slate-900">Showing {(shipments || []).length} Records</span>
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

      {/* SUB-TAB 5: MY PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 max-w-3xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Customer Profile & Account Details</h2>
              <p className="text-xs text-slate-500 font-semibold">Manage your corporate credentials and contact information.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Profile Details Header Card */}
          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-orange-gradient text-white flex items-center justify-center font-extrabold text-2xl shadow-orange-sm shrink-0">
              {profileName ? profileName.charAt(0) : 'C'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-slate-900 text-base">{profileName}</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Active & Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">{currentUser?.email || 'shipping@razer.com'}</p>
              <p className="text-xs font-semibold text-slate-700">{profileCompany} • Customer Account</p>
            </div>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange font-mono"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Contact Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{profileName}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Corporate Email</span>
                <span className="font-extrabold text-slate-900 text-sm font-mono">{currentUser?.email || 'shipping@razer.com'}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Company Entity</span>
                <span className="font-extrabold text-slate-900 text-sm">{profileCompany}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Contact Phone</span>
                <span className="font-extrabold text-slate-900 text-sm font-mono">{profilePhone}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 6: SAVED ADDRESSES */}
      {activeSubTab === 'addresses' && (
        <div className="space-y-8 animate-fade-in">
          {/* Address Management Form & Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Saved Addresses & Hub Locations</h2>
                <p className="text-xs text-slate-500 font-semibold">Store frequently used shipping origin terminals and destination drop points.</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                {(addressList || []).length} Saved Locations
              </span>
            </div>

            {/* Add / Edit Address Form */}
            <form onSubmit={handleAddAddress} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <span className="block font-extrabold text-slate-900 text-xs">
                {editingAddressId ? 'Edit Address Location' : 'Add New Saved Address'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Location Label *</label>
                  <input
                    type="text"
                    required
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Jurong Hub Dock #4"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Address Type *</label>
                  <select
                    value={newAddressType}
                    onChange={(e) => setNewAddressType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus-orange cursor-pointer"
                  >
                    <option value="pickup">Pickup Origin Location</option>
                    <option value="drop">Delivery Destination</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Contact Person / Dept</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="e.g. Warehouse Supervisor"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Full Street Address *</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. 10 Woodlands Industrial Park E5, Singapore 738322"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                </button>
                {editingAddressId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Saved Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {(addressList || []).map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 shadow-sm transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        addr.type === 'pickup'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {addr.type === 'pickup' ? '📍 Pickup Point' : '🏁 Delivery Point'}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(addr)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit address"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete address "${addr.label}"?`)) {
                              deleteSavedAddress(addr.id);
                              showToast(`Saved address "${addr.label}" deleted.`);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm">{addr.label}</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{addr.address}</p>
                    {addr.contact && (
                      <p className="text-[11px] text-slate-400 font-semibold">Contact: {addr.contact}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (setActiveTab) setActiveTab('book');
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 rounded-xl text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Use in New Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: CONSIGNMENT DOCUMENT VAULT (Requirement 3) */}
      {activeSubTab === 'documents' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Regulatory & Shipping Dossiers
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {customerDocuments.length} Verified Files
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Consignment Document Management Vault</h2>
              <p className="text-xs text-slate-500 font-semibold">
                Access official commercial invoices, packing lists, delivery notes (LR), customs permits, marine cargo insurance, and signed proof-of-delivery (POD).
              </p>
            </div>

            <button
              onClick={() => setIsUploadCustDocOpen(true)}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Attach Consignment File</span>
            </button>
          </div>

          {/* Document Cards / Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">File Title</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Shipment Ref</th>
                  <th className="p-3">Size & Upload Date</th>
                  <th className="p-3">Compliance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customerDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No documents currently attached to your account or consignments.
                    </td>
                  </tr>
                ) : (
                  customerDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-slate-900 block">{doc.name}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{doc.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md border border-slate-200 text-[10px]">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-extrabold text-orange-600">
                        {doc.shipmentId}
                      </td>
                      <td className="p-3 text-slate-500">
                        <div>{doc.fileSize}</div>
                        <div className="text-[10px] text-slate-400">{doc.uploadDate}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Verified
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => setViewingCustDoc(doc)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([`Josan Logistics Official Document: ${doc.name}\nType: ${doc.type}\nShipment: ${doc.shipmentId}\nCustomer: ${doc.customerName}\nSecurity Hash: SHA256-JOSAN-VERIFIED`], { type: 'application/pdf' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = doc.name;
                            link.click();
                            URL.revokeObjectURL(url);
                            showToast(`Downloaded: ${doc.name}`, 'success');
                          }}
                          className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold rounded-lg text-xs transition-colors inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUB-TAB 8: SUPPORT & INCIDENT DESK (Requirement 7) */}
      {activeSubTab === 'support' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Shipper Assistance
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {customerTickets.length} Support Inquiries
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Consignment Support & Incident Desk</h2>
              <p className="text-xs text-slate-500 font-semibold">
                Submit claims or questions linked directly to your active shipments and communicate with Josan Logistics dispatch dispatchers in real time.
              </p>
            </div>

            <button
              onClick={() => setIsCreateTicketOpen(true)}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Ticket</span>
            </button>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {customerTickets.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <LifeBuoy className="w-10 h-10 text-orange-500 mx-auto" />
                <h3 className="font-extrabold text-slate-900 text-base">No Support Tickets Logged</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Need assistance with customs clearance, temperature-controlled transit, or invoice queries? Open a support ticket anytime.
                </p>
                <button
                  onClick={() => setIsCreateTicketOpen(true)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Open Inquiry Ticket</span>
                </button>
              </div>
            ) : (
              customerTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-orange-300 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono font-black text-orange-600 text-xs">{t.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-200 text-slate-700">
                        {t.category || 'General Support'}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] font-bold font-mono">
                        Consignment #{t.shipmentId}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        t.status === 'Open'
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : t.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : t.status === 'Waiting for Customer'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        ● {t.status}
                      </span>
                      <button
                        onClick={() => setActiveCustomerTicket(t)}
                        className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>View Conversation ({t.messages ? t.messages.length : 1})</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{t.subject}</h4>
                    {t.messages && t.messages.length > 0 && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        Last message: <span className="font-semibold text-slate-800">{t.messages[t.messages.length - 1].senderName}:</span> "{t.messages[t.messages.length - 1].text}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}


        </div>
      </div>

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

      {/* MODAL: CREATE SUPPORT TICKET (Requirement 7) */}
      {isCreateTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Open Customer Support Ticket</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Link inquiry directly to an active consignment</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateTicketOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTicketForm.shipmentId || !newTicketForm.subject || !newTicketForm.message) {
                  showToast('Please select a shipment and write your inquiry.', 'warning');
                  return;
                }
                const ticketId = createSupportTicket({
                  shipmentId: newTicketForm.shipmentId,
                  customerName: displayUser.name || 'Customer Shipper',
                  customerEmail: displayUser.email || 'customer@razer.com',
                  subject: newTicketForm.subject,
                  category: newTicketForm.category || 'Transit Status',
                  priority: newTicketForm.priority || 'Medium',
                  message: newTicketForm.message
                });
                setIsCreateTicketOpen(false);
                setNewTicketForm({ shipmentId: '', subject: '', category: 'Transit Status', priority: 'Medium', message: '' });
                showToast(`Support Ticket #${ticketId} created successfully! Dispatch team notified.`, 'success');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Related Consignment Shipment *</label>
                <select
                  value={newTicketForm.shipmentId}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, shipmentId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-mono font-bold text-xs"
                  required
                >
                  <option value="">Select your shipment...</option>
                  {(shipments || []).map((s) => (
                    <option key={s.id} value={s.id}>#{s.id} — {s.origin} to {s.destination} ({s.status})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-bold text-xs"
                  >
                    <option value="Transit Status">Transit Status & ETA</option>
                    <option value="Customs & Clearance">Customs & Clearance</option>
                    <option value="Cold Chain Monitoring">Cold Chain Telematics</option>
                    <option value="Billing & Invoicing">Billing & Tax Invoice</option>
                    <option value="Delivery Assistance">Delivery Address Change</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-bold text-xs"
                  >
                    <option value="Low">Low (Standard SLA)</option>
                    <option value="Medium">Medium (Priority)</option>
                    <option value="High">High (Urgent Dispatch Alert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inquiry Subject *</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  placeholder="e.g. Inquire about customs permit clearance timeline"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-semibold text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message / Description *</label>
                <textarea
                  rows={4}
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  placeholder="Please state details regarding your shipment so our operations team can resolve it promptly..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus-orange text-xs text-slate-900 resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTicketOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-orange-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOMER TICKET CONVERSATION THREAD (Requirement 7) */}
      {activeCustomerTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col justify-between shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-orange-600 text-sm">{activeCustomerTicket.id}</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-extrabold rounded-full">
                    {activeCustomerTicket.status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Consignment #{activeCustomerTicket.shipmentId}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeCustomerTicket.subject}</h3>
              </div>

              <button
                onClick={() => setActiveCustomerTicket(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50/60 rounded-2xl border border-slate-100 max-h-72 my-3">
              {(activeCustomerTicket.messages || []).map((msg, i) => {
                const isCust = msg.role === 'customer';
                return (
                  <div
                    key={msg.id || i}
                    className={`flex flex-col ${isCust ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-600">{msg.senderName}</span>
                      <span className={`px-1.5 py-0.2 rounded font-black uppercase text-[9px] ${
                        isCust ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isCust ? 'You (Customer)' : 'Josan Operations'}
                      </span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        isCust
                          ? 'bg-orange-500 text-white rounded-tr-xs shadow-2xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customer Reply Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customerReplyText.trim()) return;
                replySupportTicket(activeCustomerTicket.id, customerReplyText, 'customer', displayUser.name || 'Customer Shipper');
                const newMsg = {
                  id: `MSG-${Date.now()}`,
                  senderName: displayUser.name || 'Customer Shipper',
                  role: 'customer',
                  text: customerReplyText,
                  timestamp: 'Just now'
                };
                setActiveCustomerTicket({
                  ...activeCustomerTicket,
                  messages: [...(activeCustomerTicket.messages || []), newMsg],
                  status: 'Waiting for Customer'
                });
                setCustomerReplyText('');
                showToast('Reply dispatched to Josan Logistics support desk.', 'success');
              }}
              className="space-y-2 pt-2 border-t border-slate-100"
            >
              <label className="block text-xs font-bold text-slate-700">Write Response to Josan Dispatch</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customerReplyText}
                  onChange={(e) => setCustomerReplyText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-orange-sm transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ATTACH CONSIGNMENT DOCUMENT (Requirement 3) */}
      {isUploadCustDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Attach Consignment Document</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Link document to one of your active shipments</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadCustDocOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCustDocData.shipmentId || !newCustDocData.name) {
                  showToast('Please choose a shipment and document file name.', 'warning');
                  return;
                }
                uploadShipmentDocument(newCustDocData.shipmentId, {
                  type: newCustDocData.type,
                  name: newCustDocData.name,
                  fileSize: '165 KB',
                  customerName: displayUser.name || 'Customer Shipper',
                  docCategory: 'shipping'
                });
                setIsUploadCustDocOpen(false);
                setNewCustDocData({ shipmentId: '', type: 'Commercial Invoice', name: '' });
                showToast(`Document attached to shipment #${newCustDocData.shipmentId}.`, 'success');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Shipment *</label>
                <select
                  value={newCustDocData.shipmentId}
                  onChange={(e) => setNewCustDocData({ ...newCustDocData, shipmentId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-mono font-bold text-xs"
                  required
                >
                  <option value="">Select your shipment...</option>
                  {(shipments || []).map((s) => (
                    <option key={s.id} value={s.id}>#{s.id} — {s.origin} to {s.destination}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Classification *</label>
                <select
                  value={newCustDocData.type}
                  onChange={(e) => setNewCustDocData({ ...newCustDocData, type: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-bold text-xs"
                >
                  <option value="Commercial Invoice">Commercial Invoice</option>
                  <option value="Packing List">Packing List</option>
                  <option value="Delivery Note / LR">Delivery Note / LR</option>
                  <option value="Customs Clearance Permit">Customs Clearance Permit</option>
                  <option value="Cargo Insurance Policy">Cargo Insurance Policy</option>
                  <option value="Proof of Delivery (POD)">Proof of Delivery (POD)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={newCustDocData.name}
                  onChange={(e) => setNewCustDocData({ ...newCustDocData, name: e.target.value })}
                  placeholder="e.g. Packing_List_Export_JOS8821.pdf"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-semibold text-xs"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadCustDocOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-orange-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW CUSTOMER DOCUMENT (Requirement 3) */}
      {viewingCustDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{viewingCustDoc.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Consignment #{viewingCustDoc.shipmentId} • {viewingCustDoc.type}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingCustDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Classification:</span>
                <span className="font-extrabold text-slate-900">{viewingCustDoc.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Consignment ID:</span>
                <span className="font-mono font-extrabold text-orange-600">{viewingCustDoc.shipmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">File Size:</span>
                <span className="text-slate-700 font-semibold">{viewingCustDoc.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Uploaded Date:</span>
                <span className="text-slate-700 font-semibold">{viewingCustDoc.uploadDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Verification:</span>
                <span className="text-emerald-700 font-extrabold">✓ Verified by Josan Compliance</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setViewingCustDoc(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([`Josan Logistics Official Document: ${viewingCustDoc.name}\nType: ${viewingCustDoc.type}\nShipment: ${viewingCustDoc.shipmentId}`], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = viewingCustDoc.name;
                  link.click();
                  URL.revokeObjectURL(url);
                  showToast(`Downloaded: ${viewingCustDoc.name}`, 'success');
                }}
                className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-orange-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
