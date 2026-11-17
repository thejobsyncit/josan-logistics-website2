import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { CUSTOMER_DEMO_TABS, isDisplayablePhone } from '../config/siteConfig';
import { formatSingaporeDateTime } from '../utils/dateTime';
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
  Paperclip,
  Building2,
  Layers,
  ArrowRight
} from 'lucide-react';

/**
 * Shared Customer Portal Design Tokens & Structural Components
 * Used by CustomerDashboardPage and available for subtab components.
 */
export const PortalCard = ({ children, className = '', ...props }) => (
  <div
    className={`bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 shadow-none text-left ${className}`}
    style={{ borderTopColor: 'var(--color-kraft)', ...(props.style || {}) }}
    {...props}
  >
    {children}
  </div>
);

export const PortalHeader = ({ title, subtext, action, className = '' }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 ${className}`}>
    <div>
      <h2 className="text-xl font-bold font-heading text-[var(--color-navy)] leading-tight">
        {title}
      </h2>
      {subtext && (
        <p className="text-sm text-[var(--color-text-muted)] font-normal mt-1">
          {subtext}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const PortalEmptyState = ({ message, actionLabel, onAction }) => (
  <div
    className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-8 text-center space-y-3 shadow-none"
    style={{ borderTopColor: 'var(--color-kraft)' }}
  >
    <p className="text-sm text-[var(--color-text-muted)] font-normal">
      {message}
    </p>
    {actionLabel && onAction && (
      <div>
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-normal text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)] cursor-pointer link-inline"
        >
          {actionLabel}
        </button>
      </div>
    )}
  </div>
);

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
    showToast(`Cancellation / Inquiry message regarding Order #${messageTargetOrder?.id || ''} successfully sent to Josan Logistics support!`, 'success');
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
  const userNameQuery = (currentUser?.name || '').trim().toLowerCase();
  const userCompanyQuery = (currentUser?.company || '').trim().toLowerCase();
  const customerDocuments = (documents || []).filter(d => 
    customerShipmentIds.has(d.shipmentId) || 
    (userNameQuery && d.customerName && d.customerName.toLowerCase().includes(userNameQuery)) ||
    (userCompanyQuery && d.customerName && d.customerName.toLowerCase().includes(userCompanyQuery))
  );
  const customerTickets = (tickets || []).filter(t => 
    customerShipmentIds.has(t.shipmentId) || 
    (currentUser?.email && t.customerEmail === currentUser.email) || 
    (userNameQuery && t.customerName && t.customerName.toLowerCase().includes(userNameQuery))
  );


  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileCompany, setProfileCompany] = useState(currentUser?.company || '');
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

  const [expandedMapId, setExpandedMapId] = useState(null);

  const displayUser = currentUser || {
    name: '',
    email: '',
    company: '',
    phone: '',
    role: 'CUSTOMER'
  };

  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newAddressType, setNewAddressType] = useState('pickup');
  const [newContact, setNewContact] = useState('');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [supportSubmittedSuccess, setSupportSubmittedSuccess] = useState(false);

  const isAddressFormValid = Boolean(newLabel.trim() && newAddress.trim());
  const isSupportFormValid = Boolean(ticketSubject.trim() && ticketMessage.trim());

  // Dev-only test data for customer.test@example.com
  const isDevTestCustomer = Boolean(
    import.meta.env.DEV &&
    currentUser?.email?.toLowerCase() === 'customer.test@example.com'
  );

  const DEV_TEST_SHIPMENTS = [
    {
      id: 'TEST-0001',
      trackingNumber: 'TEST-0001',
      service: 'Road transport',
      status: 'Delivered',
      lastUpdated: '12 Nov 2026, 14:30 SGT',
      createdDate: '2026-11-12 14:30',
      origin: '10 Jalan Besar, #15-02 Sim Lim Tower, Singapore 208787',
      destination: 'Changi Airport Cargo Complex, Singapore 819642',
      price: 'S$ 350.00',
      date: '12 Nov 2026',
      paymentStatus: 'Paid',
      isTest: true
    },
    {
      id: 'TEST-0002',
      trackingNumber: 'TEST-0002',
      service: 'Road transport',
      status: 'In transit',
      lastUpdated: '13 Nov 2026, 09:15 SGT',
      createdDate: '2026-11-13 09:15',
      origin: '20 Orchard Road, Singapore 238864',
      destination: 'Pioneer Sector 1, Jurong, Singapore 628437',
      price: 'S$ 280.00',
      date: '13 Nov 2026',
      paymentStatus: 'Pending payment',
      isTest: true
    }
  ];

  const DEV_TEST_QUOTES = [
    {
      id: 'Q-TEST-001',
      date: '13 Nov 2026',
      service: 'Road transport',
      status: 'Sent',
      price: 'S$ 280.00',
      origin: '20 Orchard Road, Singapore 238864',
      destination: 'Pioneer Sector 1, Jurong, Singapore 628437',
      isTest: true
    },
    {
      id: 'Q-TEST-002',
      date: '11 Nov 2026',
      service: 'Air freight documentation',
      status: 'Accepted',
      price: 'S$ 150.00',
      origin: 'Changi Airport, Singapore',
      destination: 'London Heathrow (LHR)',
      isTest: true
    }
  ];

  const displayShipments = (shipments && shipments.length > 0)
    ? shipments
    : (isDevTestCustomer ? DEV_TEST_SHIPMENTS : []);

  const displayQuotes = (quotes && quotes.length > 0)
    ? quotes
    : (isDevTestCustomer ? DEV_TEST_QUOTES : []);

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
    if (!newLabel.trim() || !newAddress.trim()) return;

    if (editingAddressId) {
      updateSavedAddress(editingAddressId, {
        label: newLabel.trim(),
        type: newAddressType,
        address: newAddress.trim(),
        contact: newContact.trim() || currentUser?.name || 'Customer Manager'
      });
      showToast('Saved address updated successfully!');
      handleCancelEdit();
    } else {
      addSavedAddress({ 
        id: Date.now(), 
        label: newLabel.trim(), 
        address: newAddress.trim(), 
        contact: newContact.trim() || currentUser?.name || 'Customer Manager',
        type: newAddressType
      });
      setNewLabel('');
      setNewAddress('');
      setNewContact('');
      showToast('Address saved successfully.');
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    if (createSupportTicket) {
      createSupportTicket({
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
        shipmentId: 'General Inquiry',
        customerName: displayUser.name || 'Customer Account',
        customerEmail: displayUser.email,
        customerPhone: displayUser.phone
      });
    }

    setTicketSubject('');
    setTicketMessage('');
    setSupportSubmittedSuccess(true);
  };

  const menuItems = [
    {
      id: 'orders',
      label: 'My shipments',
      count: displayShipments.length,
      countLabel: 'shipments',
      icon: Package,
      action: () => setActiveSubTab('orders')
    },
    ...(CUSTOMER_DEMO_TABS ? [{
      id: 'quotes',
      label: 'Quotations',
      count: displayQuotes.length,
      countLabel: 'quotations',
      icon: DollarSign,
      action: () => setActiveSubTab('quotes')
    }] : []),
    {
      id: 'notifications',
      label: 'Notifications',
      count: notifications.filter(n => (n.role === 'customer' || !n.role) && !n.read).length,
      countLabel: 'unread notifications',
      icon: Bell,
      action: () => setActiveSubTab('notifications')
    },
    {
      id: 'track',
      label: 'Track road shipment',
      icon: Search,
      action: () => {
        if (setActiveTab) setActiveTab('track');
      }
    },
    ...(CUSTOMER_DEMO_TABS ? [{
      id: 'billing',
      label: 'Invoices',
      count: displayShipments.length,
      countLabel: 'invoices',
      icon: CreditCard,
      action: () => setActiveSubTab('billing')
    }] : []),
    {
      id: 'documents',
      label: 'Documents vault',
      count: customerDocuments.length,
      countLabel: 'documents',
      icon: FileText,
      action: () => setActiveSubTab('documents')
    },
    ...(CUSTOMER_DEMO_TABS ? [{
      id: 'addresses',
      label: 'Saved addresses',
      count: (addressList || []).length,
      countLabel: 'saved addresses',
      icon: MapPin,
      action: () => setActiveSubTab('addresses')
    }] : [])
  ];

  const secondaryMenuItems = CUSTOMER_DEMO_TABS ? [
    {
      id: 'manage',
      label: 'Manage orders',
      icon: Pencil,
      action: () => setActiveSubTab('manage')
    },
    {
      id: 'support',
      // Label was 'Support and claims'; claims are not offered.
      label: 'Support',
      count: customerTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
      countLabel: 'active messages',
      icon: LifeBuoy,
      action: () => setActiveSubTab('support')
    }
  ] : [];

  if (!currentUser) return null;

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-8 text-[var(--color-text)] animate-fade-in">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Customer Header Block */}
        <div
          className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          style={{ borderTopColor: 'var(--color-kraft)' }}
        >
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            aria-label="View and edit your profile"
            className="flex items-center gap-4 text-left group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)] rounded-[var(--radius)]"
          >
            {/* 56px square avatar with 4px corners */}
            <div
              className="w-14 h-14 rounded-[var(--radius)] bg-[var(--color-navy)] text-[var(--color-on-navy)] font-bold text-xl flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : (displayUser.email ? displayUser.email.charAt(0).toUpperCase() : 'C')}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-[var(--color-navy)] leading-tight group-hover:underline">
                {displayUser.name || displayUser.email || 'Customer Account'}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] font-normal mt-0.5">
                {displayUser.email || '—'}
              </p>
            </div>
          </button>

          <div>
            <button
              type="button"
              onClick={() => setActiveTab('quote')}
              className="w-full sm:w-auto px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-white font-semibold text-sm rounded-[var(--radius)] shadow-none transition-colors text-center cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
            >
              Get a Quote
            </button>
          </div>
        </div>

        {/* 2-Column Dashboard Layout: Left Navigation + Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Side: Navigation Sidebar (240px on desktop, horizontally scrollable row on mobile/tablet) */}
          <nav
            aria-label="Account"
            className="w-full lg:w-[240px] shrink-0 bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] shadow-none p-2 lg:sticky lg:top-24"
            style={{ borderTopColor: 'var(--color-kraft)' }}
          >
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible flex-nowrap items-center lg:items-stretch gap-1 pb-1 lg:pb-0 scrollbar-none">
              {/* Primary Menu Items */}
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius)] flex items-center gap-2.5 text-sm transition-colors text-left cursor-pointer shrink-0 lg:shrink lg:w-full whitespace-nowrap lg:whitespace-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)] ${
                      isActive
                        ? 'bg-transparent lg:bg-[var(--color-bg-alt)] border-b-[3px] lg:border-b-0 lg:border-l-[3px] font-bold text-[var(--color-navy)]'
                        : 'bg-transparent text-[var(--color-text)] hover:underline font-normal border-b-[3px] border-b-transparent lg:border-b-0 lg:border-l-[3px] lg:border-l-transparent'
                    }`}
                    style={isActive ? { borderBottomColor: 'var(--color-kraft)', borderLeftColor: 'var(--color-kraft)' } : undefined}
                  >
                    <IconComponent className="w-5 h-5 shrink-0 text-[var(--color-navy)]" aria-hidden="true" />
                    <span className="truncate lg:whitespace-normal lg:break-words leading-tight">{item.label}</span>
                    {item.count !== undefined && item.count !== null && (
                      <span
                        className="text-sm tabular-nums text-[var(--color-text-muted)] font-normal ml-auto shrink-0 pl-2"
                        aria-label={`${item.count} ${item.countLabel || item.label}`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Secondary Menu Items: Manage orders & Support */}
              {secondaryMenuItems.length > 0 && (
                <>
                  <hr className="hidden lg:block my-2 border-[var(--color-border)]" />
                  <div className="lg:hidden w-[1px] h-6 bg-[var(--color-border)] shrink-0 mx-1" aria-hidden="true" />
                  {secondaryMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSubTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.action}
                        aria-current={isActive ? 'page' : undefined}
                        className={`min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius)] flex items-center gap-2.5 text-sm transition-colors text-left cursor-pointer shrink-0 lg:shrink lg:w-full whitespace-nowrap lg:whitespace-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)] ${
                          isActive
                            ? 'bg-transparent lg:bg-[var(--color-bg-alt)] border-b-[3px] lg:border-b-0 lg:border-l-[3px] font-bold text-[var(--color-navy)]'
                            : 'bg-transparent text-[var(--color-text)] hover:underline font-normal border-b-[3px] border-b-transparent lg:border-b-0 lg:border-l-[3px] lg:border-l-transparent'
                        }`}
                        style={isActive ? { borderBottomColor: 'var(--color-kraft)', borderLeftColor: 'var(--color-kraft)' } : undefined}
                      >
                        <IconComponent className="w-5 h-5 shrink-0 text-[var(--color-navy)]" aria-hidden="true" />
                        <span className="truncate lg:whitespace-normal lg:break-words leading-tight">{item.label}</span>
                        {item.count !== undefined && item.count !== null && (
                          <span
                            className="text-sm tabular-nums text-[var(--color-text-muted)] font-normal ml-auto shrink-0 pl-2"
                            aria-label={`${item.count} ${item.countLabel || item.label}`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </>
              )}

              {/* Divider and Log out */}
              <hr className="hidden lg:block my-2 border-[var(--color-border)]" />
              <div className="lg:hidden w-[1px] h-6 bg-[var(--color-border)] shrink-0 mx-1" aria-hidden="true" />

              <button
                type="button"
                onClick={handleDashboardLogout}
                className="min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius)] flex items-center gap-2.5 text-sm text-[var(--color-text)] hover:underline font-normal transition-colors text-left cursor-pointer shrink-0 lg:shrink lg:w-full whitespace-nowrap lg:whitespace-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              >
                <LogOut className="w-5 h-5 shrink-0 text-[var(--color-navy)]" aria-hidden="true" />
                <span>Log out</span>
              </button>
            </div>
          </nav>

          {/* Center / Main Content Area */}
          <div className="flex-1 min-w-0 space-y-6">

      {/* SUB-TAB 1: MY SHIPMENTS */}
      {activeSubTab === 'orders' && (
        <PortalCard>
          <PortalHeader
            title="My shipments"
            subtext="Your road shipments and their latest status."
            count={`${displayShipments.length} ${displayShipments.length === 1 ? 'shipment' : 'shipments'}`}
          />

          {displayShipments.length === 0 ? (
            <PortalEmptyState
              message="No shipments yet."
              actionLabel="Get a Quote"
              onAction={() => {
                if (setActiveTab) setActiveTab('quote');
              }}
            />
          ) : (
            <div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold">
                      <th scope="col" className="pb-3 pr-4 font-semibold">Tracking number</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Service</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Status</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Last updated</th>
                      <th scope="col" className="pb-3 pl-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                    {displayShipments.map((s) => {
                      const trackingNum = s.trackingNumber || s.id;
                      const rawLastUpdated = s.last_updated || s.lastUpdated || s.lastUpdatedTime;
                      const lastUpdated = rawLastUpdated
                        ? (formatSingaporeDateTime(rawLastUpdated) || formatSingaporeDateTime(String(rawLastUpdated).replace(/SGT/i, '+08:00')) || rawLastUpdated)
                        : '—';
                      return (
                        <tr key={s.id} className="hover:bg-[var(--color-bg-alt)] transition-colors">
                          <td className="py-3.5 pr-4 font-bold tabular-nums text-[var(--color-navy)]">
                            {trackingNum}
                          </td>
                          <td className="py-3.5 px-4 font-normal">
                            Road transport
                          </td>
                          <td className="py-3.5 px-4 font-normal">
                            {s.status}
                          </td>
                          <td className="py-3.5 px-4 tabular-nums text-[var(--color-text-muted)]">
                            {lastUpdated}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (setActiveTrackingId) setActiveTrackingId(trackingNum);
                                if (setActiveTab) setActiveTab('track');
                              }}
                              className="underline text-[var(--color-navy)] hover:text-[var(--color-kraft-dark)] font-medium cursor-pointer"
                              aria-label={`View road shipment ${trackingNum}`}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked List */}
              <div className="md:hidden divide-y divide-[var(--color-border)]">
                {displayShipments.map((s) => {
                  const trackingNum = s.trackingNumber || s.id;
                  const rawLastUpdated = s.last_updated || s.lastUpdated || s.lastUpdatedTime;
                  const lastUpdated = rawLastUpdated
                    ? (formatSingaporeDateTime(rawLastUpdated) || formatSingaporeDateTime(String(rawLastUpdated).replace(/SGT/i, '+08:00')) || rawLastUpdated)
                    : '—';
                  return (
                    <div key={s.id} className="py-4 space-y-2.5 text-sm">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[var(--color-text-muted)]">Tracking number</span>
                        <span className="font-bold tabular-nums text-[var(--color-navy)]">{trackingNum}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Service</span>
                        <span className="text-[var(--color-text)]">Road transport</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Status</span>
                        <span className="text-[var(--color-text)]">{s.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Last updated</span>
                        <span className="tabular-nums text-[var(--color-text-muted)]">{lastUpdated}</span>
                      </div>
                      <div className="pt-1 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (setActiveTrackingId) setActiveTrackingId(trackingNum);
                            if (setActiveTab) setActiveTab('track');
                          }}
                          className="underline text-[var(--color-navy)] hover:text-[var(--color-kraft-dark)] font-medium cursor-pointer"
                          aria-label={`View road shipment ${trackingNum}`}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PortalCard>
      )}

      {/* SUB-TAB: MANAGE ORDERS (Legacy Management) */}
      {activeSubTab === 'manage' && (
        !CUSTOMER_DEMO_TABS ? (
          <PortalCard>
            <p className="text-sm text-[var(--color-text-muted)] font-normal">This section is coming in the next phase.</p>
          </PortalCard>
        ) : (
        <div className="bg-white rounded-[var(--radius)] p-6 sm:p-8 border border-[var(--color-border)] border-t-[3px] shadow-none space-y-6" style={{ borderTopColor: 'var(--color-kraft)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Manage Freight Orders & Cancellations
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Review and delete active order bookings if needed.
              </p>
            </div>
            <span className="text-xs text-slate-800 font-extrabold">Total Orders: {(shipments || []).length}</span>
          </div>

          <div className="space-y-4">
            {(shipments || []).map((s) => (
              <div 
                key={s.id} 
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#2463EB]/40/80 transition-all p-5 sm:p-6 space-y-4"
              >
                {/* 1. Header Bar: ID, Status, Service Tag, Ref & Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm sm:text-base font-extrabold text-[#0B1F5B] tracking-tight bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
                      {s.id}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                      s.status === 'Delivered' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
                        : s.status === 'Near Destination'
                        ? 'bg-amber-50 text-amber-900 border border-amber-300'
                        : 'bg-[#EAF2FF] text-[#0B1F5B] border border-[#DCE5F0]'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${s.status === 'Delivered' ? 'bg-emerald-500' : 'bg-[#EAF2FF]0 animate-ping'}`}></span>
                      <span>{s.status}</span>
                    </span>
                    <span className="text-xs font-bold text-[#2463EB] bg-[#EAF2FF]/80 px-3 py-1 rounded-full border border-[#DCE5F0]/60">
                      {s.serviceLevel || 'Commercial Road Transport'}
                    </span>
                    {s.referenceNumber && (
                      <span className="text-xs text-slate-500 font-mono hidden md:inline-block">
                        Ref: <strong className="text-slate-700">{s.referenceNumber}</strong>
                      </span>
                    )}
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Contract Total</span>
                    <span className="font-mono text-base font-black text-[#0B1F5B]">{s.price || 'S$ 350.00'}</span>
                  </div>
                </div>

                {/* 2. Visual Route & Consignment Info Box */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#F8FAFC] rounded-xl p-4 border border-slate-200/80">
                  {/* Visual Route Corridor */}
                  <div className="lg:col-span-7 flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Origin Depot</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={s.origin}>{s.origin}</p>
                    </div>

                    <div className="flex flex-col items-center px-1 sm:px-2 shrink-0">
                      <div className="flex items-center text-slate-300 space-x-1">
                        <div className="w-8 sm:w-14 border-t-2 border-dashed border-slate-300"></div>
                        <Truck className="w-4 h-4 text-[#2463EB]" />
                        <div className="w-8 sm:w-14 border-t-2 border-dashed border-slate-300"></div>
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">Express Corridors</span>
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center justify-end space-x-1.5 mb-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Destination Hub</span>
                        <span className="w-2 h-2 rounded-full bg-[#2463EB] shrink-0"></span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={s.destination}>{s.destination}</p>
                    </div>
                  </div>

                  {/* Consignee, Cargo & Weight Chips */}
                  <div className="lg:col-span-5 flex flex-wrap lg:justify-end items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-4 text-xs">
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/90 text-slate-700 flex items-center space-x-1.5 shadow-2xs">
                      <Building2 className="w-3.5 h-3.5 text-[#2463EB] shrink-0" />
                      <span className="truncate max-w-[150px]" title={s.receiver}>
                        <span className="text-slate-400 font-medium">Consignee:</span> <strong className="text-slate-800 font-bold">{s.receiver}</strong>
                      </span>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/90 text-slate-700 flex items-center space-x-1.5 shadow-2xs">
                      <Package className="w-3.5 h-3.5 text-[#2463EB] shrink-0" />
                      <span className="truncate max-w-[140px]" title={s.cargoType || 'General Freight'}>
                        <span className="text-slate-400 font-medium">Cargo:</span> <strong className="text-slate-800 font-bold">{s.cargoType || 'General Freight'}</strong>
                      </span>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/90 text-slate-700 flex items-center space-x-1.5 shadow-2xs">
                      <Layers className="w-3.5 h-3.5 text-[#2463EB] shrink-0" />
                      <span>
                        <span className="text-slate-400 font-medium">Weight:</span> <strong className="text-slate-800 font-bold font-mono">{s.weight}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Operational Details: Driver & Vehicle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Driver Tile */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF2FF]/90 text-[#2463EB] flex items-center justify-center shrink-0 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Assigned Driver</span>
                      <p className="text-xs font-bold text-slate-900 truncate">{s.driverName || s.driver || 'Tan Wei Ming'}</p>
                      {isDisplayablePhone(s.driverPhone) && (
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{s.driverPhone}</p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Tile */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100/90 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Vehicle Plate & Class</span>
                      <p className="text-xs font-mono font-bold text-slate-900 truncate">{s.vehiclePlate || 'SG-8819'}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5" title={s.vehicle || 'Commercial Transport Truck'}>
                        {s.vehicle || 'Commercial Transport Truck'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Near Destination Delivery 2FA OTP Banner */}
                {(s.status === 'Near Destination' || s.otpActive) && (
                  <div className="bg-gradient-to-r from-amber-50 to-[#EAF2FF] border border-amber-300/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-3 text-amber-950 font-bold">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-900 font-extrabold">Driver Approaching Destination Receiving Dock!</span>
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-black rounded-full uppercase">Security 2FA</span>
                        </div>
                        <p className="text-[11px] font-normal text-amber-800 mt-0.5">
                          Present this 6-digit verification code to the driver upon vehicle arrival to authorize handover and sign the electronic POD.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:self-center shrink-0 bg-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Handover OTP:</span>
                      <span className="px-2.5 py-0.5 bg-amber-600 text-white font-mono font-black text-sm rounded-md tracking-widest">
                        {s.otpActive || '749201'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 5. Delivered e-POD Notice */}
                {s.status === 'Delivered' && (
                  <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 px-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-emerald-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Proof of Delivery (e-POD) signed and certified by recipient.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailShipment(s)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Certified POD</span>
                    </button>
                  </div>
                )}

                {/* 6. Clean Action Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400 text-[11px] font-medium hidden sm:block">
                    Order logged
                  </div>

                  <div className="flex flex-wrap items-center gap-2 ml-auto">
                    <button
                      onClick={() => setExpandedMapId(expandedMapId === s.id ? null : s.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-xs active:scale-95 ${
                        expandedMapId === s.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-[#2463EB] hover:bg-[#1D4ED8] text-white shadow-sm'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{expandedMapId === s.id ? 'Close Timeline' : 'Track Timeline'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedDetailShipment(s)}
                      className="px-3.5 py-2 bg-[#0B1F5B] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#2463EB]" />
                      <span>Full Dossier & POD</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTrackingId(s.id);
                        setActiveTab('track');
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer border border-slate-200/60"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Public Tracking</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoiceShipment(s)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer border border-slate-200/60"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Invoice</span>
                    </button>

                    {/* Show Delete Order button ONLY in Manage Orders subtab */}
                    {activeSubTab === 'manage' && (
                      <button
                        onClick={() => handleDeleteOrder(s.id)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-2xs"
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
                          <span className="w-2 h-2 rounded-full bg-[#EAF2FF]0 animate-ping"></span>
                          <span>DELIVERY TIMELINE STEPPER</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          Order Tracking Reference: <strong className="font-mono text-[#2463EB]">#{s.id}</strong>
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
                              title: 'Order Booked & Documentation Verified',
                              location: s.origin ? `${s.origin} (SIN)` : 'Changi Air Cargo Complex (SIN)',
                              timestamp: s.createdDate || 'Aug 31, 08:15 AM',
                              completed: true,
                              current: false
                            },
                            {
                              title: 'Picked up by partner carrier',
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
                              location: s.destination ? `${s.destination}` : 'Destination Distribution Hub',
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
                                ? 'bg-[#EAF2FF]0 text-white ring-4 ring-[#EAF2FF] shadow-sm'
                                : isCompleted
                                ? 'bg-[#EAF2FF]0 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-300 font-mono text-[11px]'
                            }`}>
                              {isCompleted || isCurrent ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                            </div>

                            <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                              isCurrent
                                ? 'bg-[#EAF2FF]/80 border-[#DCE5F0] shadow-xs'
                                : isCompleted
                                ? 'bg-white border-slate-200'
                                : 'bg-slate-50/60 border-slate-100'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h4 className={`text-xs sm:text-sm font-extrabold ${isCurrent ? 'text-[#2463EB]' : 'text-slate-900'}`}>
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
        )
      )}

      {/* SUB-TAB 2: QUOTATIONS */}
      {activeSubTab === 'quotes' && (
        !CUSTOMER_DEMO_TABS ? (
          <PortalCard>
            <p className="text-sm text-[var(--color-text-muted)] font-normal">This section is coming in the next phase.</p>
          </PortalCard>
        ) : (
        <PortalCard>
          <PortalHeader
            title="Your quotes"
            subtext="Your quote requests and the quotes we have sent you."
            action={
              <button
                type="button"
                onClick={() => {
                  if (setActiveTab) setActiveTab('quote');
                }}
                className="bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              >
                New quote request
              </button>
            }
          />

          {displayQuotes.length === 0 ? (
            <PortalEmptyState
              message="No quote requests yet."
              actionLabel="Get a Quote"
              onAction={() => {
                if (setActiveTab) setActiveTab('quote');
              }}
            />
          ) : (
            <div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold">
                      <th scope="col" className="pb-3 pr-4 font-semibold">Date</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Service</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Status</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Quote</th>
                      <th scope="col" className="pb-3 pl-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                    {displayQuotes.map((q) => {
                      const dateStr = q.date || q.createdDate || '—';
                      const serviceName = q.service || (q.freightMode === 'air' ? 'Air freight documentation' : 'Road transport');
                      const displayPrice = q.price || (q.total !== undefined && q.total !== null ? `S$ ${Number(q.total).toFixed(2)}` : (q.lineItems?.finalAmount ? `S$ ${Number(q.lineItems.finalAmount).toFixed(2)}` : 'Pending review'));
                      const isSent = q.status === 'Sent';
                      const isAccepted = q.status === 'Accepted';
                      const isConverted = q.status === 'Converted';
                      const isRejected = q.status === 'Rejected';

                      return (
                        <tr key={q.id} className="hover:bg-[var(--color-bg-alt)] transition-colors">
                          <td className="py-3.5 pr-4 tabular-nums text-[var(--color-text-muted)]">
                            {dateStr}
                          </td>
                          <td className="py-3.5 px-4 font-normal">
                            {serviceName}
                          </td>
                          <td className="py-3.5 px-4 font-normal">
                            {q.status}
                          </td>
                          <td className="py-3.5 px-4 tabular-nums font-semibold text-[var(--color-text)]">
                            {displayPrice}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            {isSent && (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => customerRespondQuote(q.id, 'Accepted')}
                                  className="bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Accept quote
                                </button>
                                <button
                                  type="button"
                                  onClick={() => customerRespondQuote(q.id, 'Rejected')}
                                  className="bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Decline quote
                                </button>
                              </div>
                            )}
                            {isAccepted && !isConverted && (
                              <button
                                type="button"
                                onClick={() => {
                                  const created = convertQuoteToShipment(q.id);
                                  if (created) setActiveSubTab('orders');
                                }}
                                className="bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Book shipment
                              </button>
                            )}
                            {isConverted && (
                              <span className="text-xs text-[var(--color-text-muted)] tabular-nums">
                                Booked as shipment {q.convertedShipmentId || ''}
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-xs text-[var(--color-text-muted)]">
                                Declined
                              </span>
                            )}
                            {!isSent && !isAccepted && !isConverted && !isRejected && (
                              <span className="text-xs text-[var(--color-text-muted)]">
                                Under review
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked List */}
              <div className="md:hidden divide-y divide-[var(--color-border)]">
                {displayQuotes.map((q) => {
                  const dateStr = q.date || q.createdDate || '—';
                  const serviceName = q.service || (q.freightMode === 'air' ? 'Air freight documentation' : 'Road transport');
                  const displayPrice = q.price || (q.total !== undefined && q.total !== null ? `S$ ${Number(q.total).toFixed(2)}` : (q.lineItems?.finalAmount ? `S$ ${Number(q.lineItems.finalAmount).toFixed(2)}` : 'Pending review'));
                  const isSent = q.status === 'Sent';
                  const isAccepted = q.status === 'Accepted';
                  const isConverted = q.status === 'Converted';
                  const isRejected = q.status === 'Rejected';

                  return (
                    <div key={q.id} className="py-4 space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Date</span>
                        <span className="tabular-nums text-[var(--color-text-muted)]">{dateStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Service</span>
                        <span className="text-[var(--color-text)]">{serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Status</span>
                        <span className="text-[var(--color-text)]">{q.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Quote</span>
                        <span className="tabular-nums font-semibold text-[var(--color-text)]">{displayPrice}</span>
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        {isSent && (
                          <>
                            <button
                              type="button"
                              onClick={() => customerRespondQuote(q.id, 'Accepted')}
                              className="bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Accept quote
                            </button>
                            <button
                              type="button"
                              onClick={() => customerRespondQuote(q.id, 'Rejected')}
                              className="bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Decline quote
                            </button>
                          </>
                        )}
                        {isAccepted && !isConverted && (
                          <button
                            type="button"
                            onClick={() => {
                              const created = convertQuoteToShipment(q.id);
                              if (created) setActiveSubTab('orders');
                            }}
                            className="bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Book shipment
                          </button>
                        )}
                        {isConverted && (
                          <span className="text-xs text-[var(--color-text-muted)] tabular-nums">
                            Booked as shipment {q.convertedShipmentId || ''}
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            Declined
                          </span>
                        )}
                        {!isSent && !isAccepted && !isConverted && !isRejected && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            Under review
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PortalCard>
        )
      )}

      {/* SUB-TAB: NOTIFICATIONS PANEL (Requirement 3) */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#2463EB]" />
                <span>Customer Notifications Center</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Alerts about quote requests, contact messages and account activity.
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
                      ? 'bg-[#EAF2FF] border-[#2463EB]/30 shadow-xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${!n.read ? 'text-[#0B1F5B]' : 'text-slate-700'}`}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#2463EB] animate-pulse"></span>
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
                      className="px-3 py-1 bg-white hover:bg-[#2463EB]/10 text-[#2463EB] border border-[#2463EB]/30 rounded-lg text-xs font-bold shrink-0 transition-colors"
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
                      className="px-3 py-1 bg-white hover:bg-[#2463EB]/10 text-[#2463EB] border border-[#2463EB]/30 rounded-lg text-xs font-bold shrink-0 transition-colors"
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

      {/* SUB-TAB 3: INVOICES */}
      {activeSubTab === 'billing' && (
        !CUSTOMER_DEMO_TABS ? (
          <PortalCard>
            <p className="text-sm text-[var(--color-text-muted)] font-normal">This section is coming in the next phase.</p>
          </PortalCard>
        ) : (
        <PortalCard>
          <PortalHeader
            title="Your invoices"
            subtext="Your invoices and their payment status."
            count={`${displayShipments.length} ${displayShipments.length === 1 ? 'invoice' : 'invoices'}`}
          />

          {displayShipments.length === 0 ? (
            <PortalEmptyState message="No invoices yet." />
          ) : (
            <div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold">
                      <th scope="col" className="pb-3 pr-4 font-semibold">Date</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Shipment</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Amount</th>
                      <th scope="col" className="pb-3 px-4 font-semibold">Payment status</th>
                      <th scope="col" className="pb-3 pl-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                    {displayShipments.map((s) => {
                      const dateStr = s.createdDate ? s.createdDate.split(' ')[0] : (s.date || '—');
                      const isPaid = s.paymentStatus === 'Paid' || (s.paymentStatus !== 'Unpaid' && !s.isUnpaid);
                      const amountStr = s.price || '—';

                      return (
                        <tr key={s.id} className="hover:bg-[var(--color-bg-alt)] transition-colors">
                          <td className="py-3.5 pr-4 tabular-nums text-[var(--color-text-muted)]">
                            {dateStr}
                          </td>
                          <td className="py-3.5 px-4 font-bold tabular-nums text-[var(--color-navy)]">
                            {s.id}
                          </td>
                          <td className="py-3.5 px-4 tabular-nums font-semibold text-[var(--color-text)]">
                            {amountStr}
                          </td>
                          <td className="py-3.5 px-4 font-normal">
                            {isPaid ? 'Paid' : 'Pending payment'}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            {isPaid ? (
                              <button
                                type="button"
                                onClick={() => setSelectedInvoiceShipment(s)}
                                className="bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                                aria-label={`View invoice for shipment ${s.id}`}
                              >
                                View invoice
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedInvoiceShipment(s)}
                                className="bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] rounded-[var(--radius)] px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                                aria-label={`Pay now for shipment ${s.id}`}
                              >
                                Pay now
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked List */}
              <div className="md:hidden divide-y divide-[var(--color-border)]">
                {displayShipments.map((s) => {
                  const dateStr = s.createdDate ? s.createdDate.split(' ')[0] : (s.date || '—');
                  const isPaid = s.paymentStatus === 'Paid' || (s.paymentStatus !== 'Unpaid' && !s.isUnpaid);
                  const amountStr = s.price || '—';

                  return (
                    <div key={s.id} className="py-4 space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Date</span>
                        <span className="tabular-nums text-[var(--color-text-muted)]">{dateStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Shipment</span>
                        <span className="font-bold tabular-nums text-[var(--color-navy)]">{s.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Amount</span>
                        <span className="tabular-nums font-semibold text-[var(--color-text)]">{amountStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Payment status</span>
                        <span className="text-[var(--color-text)]">{isPaid ? 'Paid' : 'Pending payment'}</span>
                      </div>
                      <div className="pt-1 text-right">
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceShipment(s)}
                            className="bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                            aria-label={`View invoice for shipment ${s.id}`}
                          >
                            View invoice
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceShipment(s)}
                            className="bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] rounded-[var(--radius)] px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                            aria-label={`Pay now for shipment ${s.id}`}
                          >
                            Pay now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PortalCard>
        )
      )}

      {/* SUB-TAB: YOUR PROFILE */}
      {activeSubTab === 'profile' && (
        <PortalCard className="space-y-6">
          <PortalHeader
            title="Your profile"
            subtext="Your name and contact details."
            action={
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              >
                {isEditingProfile ? 'Cancel' : 'Edit profile'}
              </button>
            }
          />

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl text-left">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Contact name *
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full h-12 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:border-[var(--color-navy)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  className="w-full h-12 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:border-[var(--color-navy)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Phone *
                </label>
                <input
                  type="text"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:border-[var(--color-navy)] transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="h-12 px-6 bg-[var(--color-navy)] hover:bg-[var(--color-navy-hover)] text-white font-medium rounded-[var(--radius)] transition-colors text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                >
                  Save profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="h-12 px-6 bg-[var(--color-surface)] hover:bg-[var(--color-bg-alt)] text-[var(--color-navy)] border border-[var(--color-navy)] font-medium rounded-[var(--radius)] transition-colors text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="divide-y divide-[var(--color-border)]">
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-2">
                <dt className="w-full sm:w-[140px] shrink-0 text-sm text-[var(--color-text-muted)] font-normal">
                  Contact name
                </dt>
                <dd className={`text-sm sm:text-base font-semibold ${profileName ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                  {profileName || 'Not added'}
                </dd>
              </div>

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-2">
                <dt className="w-full sm:w-[140px] shrink-0 text-sm text-[var(--color-text-muted)] font-normal">
                  Email
                </dt>
                <dd className={`text-sm sm:text-base font-semibold ${currentUser?.email ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                  {currentUser?.email || 'Not added'}
                </dd>
              </div>

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-2">
                <dt className="w-full sm:w-[140px] shrink-0 text-sm text-[var(--color-text-muted)] font-normal">
                  Company
                </dt>
                <dd className={`text-sm sm:text-base font-semibold ${profileCompany ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                  {profileCompany || 'Not added'}
                </dd>
              </div>

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-2">
                <dt className="w-full sm:w-[140px] shrink-0 text-sm text-[var(--color-text-muted)] font-normal">
                  Phone
                </dt>
                <dd className={`text-sm sm:text-base font-semibold ${profilePhone ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                  {profilePhone || 'Not added'}
                </dd>
              </div>
            </dl>
          )}
        </PortalCard>
      )}

      {/* SUB-TAB 4: SAVED ADDRESSES */}
      {activeSubTab === 'addresses' && (
        !CUSTOMER_DEMO_TABS ? (
          <PortalCard>
            <p className="text-sm text-[var(--color-text-muted)] font-normal">This section is coming in the next phase.</p>
          </PortalCard>
        ) : (
        <PortalCard className="space-y-8">
          <PortalHeader
            title="Saved addresses"
            subtext="Addresses you use often for pickup and delivery."
            count={`${(addressList || []).length} ${(addressList || []).length === 1 ? 'address' : 'addresses'}`}
          />

          {/* Add / Edit Address Form */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-5">
            <h3 className="text-base font-bold text-[var(--color-navy)] mb-4">
              {editingAddressId ? 'Edit address' : 'Add an address'}
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="address-name" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Name for this address (required)
                  </label>
                  <input
                    id="address-name"
                    type="text"
                    required
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Main warehouse"
                    className="w-full h-12 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                  />
                </div>

                <div>
                  <label htmlFor="address-type" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Address type (required)
                  </label>
                  <select
                    id="address-type"
                    value={newAddressType}
                    onChange={(e) => setNewAddressType(e.target.value)}
                    className="w-full h-12 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] cursor-pointer"
                  >
                    <option value="pickup">Pickup</option>
                    <option value="drop">Delivery</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="address-contact" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Contact person
                  </label>
                  <input
                    id="address-contact"
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="e.g. Store manager"
                    className="w-full h-12 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address-street" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Street address (required)
                </label>
                <input
                  id="address-street"
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. 10 Example Road, Singapore 000000"
                  className="w-full h-12 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!isAddressFormValid}
                  className={`rounded-[var(--radius)] px-5 py-2.5 text-sm font-semibold transition-colors ${
                    isAddressFormValid
                      ? 'bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]'
                      : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-border)]'
                  }`}
                >
                  Save address
                </button>
                {editingAddressId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Saved Address Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(addressList || []).map((addr) => (
              <div
                key={addr.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-5 shadow-none flex flex-col justify-between"
                style={{ borderTopColor: 'var(--color-kraft)' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">
                      {addr.type === 'pickup' ? 'Pickup' : 'Delivery'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(addr)}
                        aria-label={`Edit ${addr.label}`}
                        className="underline text-sm text-[var(--color-navy)] hover:text-[var(--color-kraft-dark)] cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-[var(--color-border)]" aria-hidden="true">|</span>
                      {deletingAddressId === addr.id ? (
                        <span className="text-xs text-[var(--color-text)]">
                          Delete this address?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              deleteSavedAddress(addr.id);
                              setDeletingAddressId(null);
                              showToast(`Address "${addr.label}" deleted.`);
                            }}
                            className="underline font-bold text-rose-700 cursor-pointer"
                          >
                            Yes, delete
                          </button>
                          {' / '}
                          <button
                            type="button"
                            onClick={() => setDeletingAddressId(null)}
                            className="underline text-[var(--color-text-muted)] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingAddressId(addr.id)}
                          aria-label={`Delete ${addr.label}`}
                          className="underline text-sm text-rose-700 hover:text-rose-900 cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-base text-[var(--color-navy)] leading-snug">
                    {addr.label}
                  </h4>
                  <p className="text-sm text-[var(--color-text)] mt-1.5 leading-relaxed">
                    {addr.address}
                  </p>
                  {addr.contact && (
                    <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
                      Contact: {addr.contact}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (setActiveTab) setActiveTab('quote');
                    }}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)] rounded-[var(--radius)] py-2 text-sm font-medium transition-colors cursor-pointer text-center"
                  >
                    Use for a quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </PortalCard>
        )
      )}

      {/* SUB-TAB 7: CONSIGNMENT DOCUMENT VAULT (Requirement 3) */}
      {activeSubTab === 'documents' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {customerDocuments.length} files
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Documents</h2>
              <p className="text-xs text-slate-500 font-semibold">
                Access invoices, packing lists, delivery notes and proof-of-delivery (POD) shared by Josan Logistics.
              </p>
            </div>
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
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customerDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No documents currently attached to your account or consignments.
                    </td>
                  </tr>
                ) : (
                  customerDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] border border-[#DCE5F0] text-[#2463EB] flex items-center justify-center shrink-0">
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
                      <td className="p-3 font-mono font-extrabold text-[#2463EB]">
                        {doc.shipmentId}
                      </td>
                      <td className="p-3 text-slate-500">
                        <div>{doc.fileSize}</div>
                        <div className="text-[10px] text-slate-400">{doc.uploadDate}</div>
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
                          className="px-2.5 py-1 bg-[#EAF2FF] hover:bg-[#EAF2FF] text-[#0B1F5B] border border-[#DCE5F0] font-bold rounded-lg text-xs transition-colors inline-flex items-center space-x-1 cursor-pointer"
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

      {/* SUB-TAB 5: SUPPORT */}
      {activeSubTab === 'support' && (
        !CUSTOMER_DEMO_TABS ? (
          <PortalCard>
            <p className="text-sm text-[var(--color-text-muted)] font-normal">This section is coming in the next phase.</p>
          </PortalCard>
        ) : (
        <PortalCard className="space-y-8">
          <PortalHeader
            title="Support"
            subtext="Send us a message about a quote, an invoice or a shipment. Our team replies by email."
          />

          {supportSubmittedSuccess && (
            <div
              role="status"
              aria-live="polite"
              className="p-4 bg-[var(--color-bg-alt)] border-l-[3px] text-sm text-[var(--color-text)]"
              style={{ borderLeftColor: 'var(--color-kraft-dark)' }}
            >
              We have received your message. Our team will reply by email.
            </div>
          )}

          {/* Support Message Submission Form */}
          <form onSubmit={handleSupportSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label htmlFor="support-subject" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                Subject (required)
              </label>
              <input
                id="support-subject"
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Question about my quote"
                className="w-full h-12 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
              />
            </div>

            <div>
              <label htmlFor="support-message" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                Message (required)
              </label>
              <textarea
                id="support-message"
                required
                rows={4}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="If your question is about a road shipment, include its tracking number."
                className="w-full min-h-[120px] p-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={!isSupportFormValid}
              className={`rounded-[var(--radius)] px-5 py-2.5 text-sm font-semibold transition-colors ${
                isSupportFormValid
                  ? 'bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]'
                  : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-border)]'
              }`}
            >
              Send message
            </button>
          </form>

          {/* Block below: Your messages */}
          <div className="border-t border-[var(--color-border)] pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-[var(--color-navy)]">
                Your messages
              </h3>
              <span className="text-sm tabular-nums text-[var(--color-text-muted)] font-normal">
                {`${customerTickets.length} ${customerTickets.length === 1 ? 'message' : 'messages'}`}
              </span>
            </div>

            {customerTickets.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] py-2">
                No messages yet.
              </p>
            ) : (
              <div>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold">
                        <th scope="col" className="pb-3 pr-4 font-semibold">Date</th>
                        <th scope="col" className="pb-3 px-4 font-semibold">Subject</th>
                        <th scope="col" className="pb-3 px-4 font-semibold">Status</th>
                        <th scope="col" className="pb-3 pl-4 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                      {customerTickets.map((t) => (
                        <tr key={t.id} className="hover:bg-[var(--color-bg-alt)] transition-colors">
                          <td className="py-3.5 pr-4 tabular-nums text-[var(--color-text-muted)]">
                            {t.createdAt ? t.createdAt.split(',')[0] : '—'}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[var(--color-navy)]">
                            {t.subject}
                          </td>
                          <td className="py-3.5 px-4 font-normal">
                            {t.status || 'Open'}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            <button
                              type="button"
                              onClick={() => setActiveCustomerTicket(t)}
                              className="underline text-[var(--color-navy)] hover:text-[var(--color-kraft-dark)] font-medium cursor-pointer"
                              aria-label={`View conversation for ${t.subject}`}
                            >
                              View conversation
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked List */}
                <div className="md:hidden divide-y divide-[var(--color-border)]">
                  {customerTickets.map((t) => (
                    <div key={t.id} className="py-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Date</span>
                        <span className="tabular-nums text-[var(--color-text-muted)]">
                          {t.createdAt ? t.createdAt.split(',')[0] : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Subject</span>
                        <span className="font-semibold text-[var(--color-navy)] text-right">{t.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-muted)]">Status</span>
                        <span className="text-[var(--color-text)]">{t.status || 'Open'}</span>
                      </div>
                      <div className="pt-1 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveCustomerTicket(t)}
                          className="underline text-[var(--color-navy)] hover:text-[var(--color-kraft-dark)] font-medium cursor-pointer"
                          aria-label={`View conversation for ${t.subject}`}
                        >
                          View conversation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PortalCard>
        )
      )}


          </div>
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
                  <p className="text-[11px] text-slate-500 font-medium">Order Reference: <span className="font-mono font-bold text-[#2463EB]">#{messageTargetOrder.id}</span></p>
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
                  <span>Shipment Order: <strong className="font-mono text-[#2463EB]">#{messageTargetOrder.id}</strong></span>
                  <span className="text-[10px] bg-[#EAF2FF] text-[#0B1F5B] px-2 py-0.5 rounded font-mono font-extrabold">{messageTargetOrder.status}</span>
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-blue text-xs"
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
                  className="w-full p-3 border border-slate-300 rounded-xl focus-blue text-xs leading-relaxed text-slate-900 resize-none"
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

      {/* MODAL: CUSTOMER TICKET CONVERSATION THREAD */}
      {activeCustomerTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] max-w-2xl w-full max-h-[90vh] flex flex-col justify-between p-6 shadow-none"
            style={{ borderTopColor: 'var(--color-kraft)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-navy)]">{activeCustomerTicket.subject}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Status: {activeCustomerTicket.status || 'Open'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCustomerTicket(null)}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-navy)] rounded-[var(--radius)] transition-colors cursor-pointer"
                aria-label="Close conversation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-[var(--color-bg-alt)] rounded-[var(--radius)] border border-[var(--color-border)] max-h-72 my-4">
              {(activeCustomerTicket.messages || []).map((msg, i) => {
                const isCust = msg.role === 'customer';
                return (
                  <div
                    key={msg.id || i}
                    className={`flex flex-col ${isCust ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                      <span className="font-semibold text-[var(--color-text)]">
                        {isCust ? 'You' : 'Our team'}
                      </span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-[var(--radius)] max-w-md text-sm leading-relaxed border ${
                        isCust
                          ? 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]'
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
                replySupportTicket(activeCustomerTicket.id, customerReplyText.trim(), 'customer', displayUser.name || 'Customer');
                const newMsg = {
                  id: `MSG-${Date.now()}`,
                  senderName: displayUser.name || 'Customer',
                  role: 'customer',
                  text: customerReplyText.trim(),
                  timestamp: 'Just now'
                };
                setActiveCustomerTicket({
                  ...activeCustomerTicket,
                  messages: [...(activeCustomerTicket.messages || []), newMsg],
                  status: 'Waiting for Customer'
                });
                setCustomerReplyText('');
                showToast('Reply sent to our team.');
              }}
              className="space-y-3 pt-3 border-t border-[var(--color-border)]"
            >
              <label htmlFor="customer-reply-input" className="block text-sm font-medium text-[var(--color-text)]">
                Write a reply to our team
              </label>
              <div className="flex gap-2">
                <input
                  id="customer-reply-input"
                  type="text"
                  value={customerReplyText}
                  onChange={(e) => setCustomerReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 h-12 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                />
                <button
                  type="submit"
                  disabled={!customerReplyText.trim()}
                  className={`rounded-[var(--radius)] px-5 py-2.5 text-sm font-semibold transition-colors shrink-0 ${
                    customerReplyText.trim()
                      ? 'bg-[var(--color-navy)] text-white hover:bg-[var(--color-kraft-dark)] cursor-pointer'
                      : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-border)]'
                  }`}
                >
                  Send reply
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
                <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] text-[#2463EB] border border-[#DCE5F0] flex items-center justify-center font-bold">
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-blue font-mono font-bold text-xs"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-blue font-bold text-xs"
                >
                  <option value="Commercial Invoice">Commercial Invoice</option>
                  <option value="Packing List">Packing List</option>
                  <option value="Delivery Note / LR">Delivery Note / LR</option>
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-blue font-semibold text-xs"
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
                  className="w-1/2 py-2.5 bg-[#EAF2FF]0 hover:bg-[#1D4ED8] text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
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
                <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] text-[#2463EB] border border-[#DCE5F0] flex items-center justify-center font-bold">
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
                <span className="font-mono font-extrabold text-[#2463EB]">{viewingCustDoc.shipmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">File Size:</span>
                <span className="text-slate-700 font-semibold">{viewingCustDoc.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Uploaded Date:</span>
                <span className="text-slate-700 font-semibold">{viewingCustDoc.uploadDate}</span>
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
                className="w-1/2 py-2.5 bg-[#EAF2FF]0 hover:bg-[#1D4ED8] text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
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
