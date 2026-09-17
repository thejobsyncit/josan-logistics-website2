import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Package, 
  Truck, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  Warehouse, 
  BarChart3, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  Edit3, 
  Trash2,
  Filter, 
  Download, 
  Printer, 
  ChevronRight,
  TrendingUp,
  MapPin,
  FileCheck,
  Phone,
  Mail,
  X,
  Camera,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Lock,
  Shield,
  MessageSquare,
  Bell,
  FileText,
  CreditCard,
  Upload,
  ChevronLeft,
  Calendar,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export const AdminDashboardPage = () => {
  const { 
    shipments, 
    drivers, 
    warehouses, 
    analyticsData, 
    quotes = [],
    notifications = [],
    customers = [],
    documents = [],
    invoices = [],
    tickets = [],
    updateShipmentStatus, 
    flagWeatherDelay,
    assignDriver, 
    addDriver, 
    updateDriverPassword,
    removeDriver, 
    toggleDriverStatus,
    addWarehouse, 
    updateWarehouse, 
    removeWarehouse, 
    updateWarehouseBinStatus,
    setSelectedInvoiceShipment,
    setSelectedDetailShipment,
    deleteShipment,
    updateAdminQuote,
    sendQuoteToCustomer,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createSupportTicket,
    replySupportTicket,
    updateTicketStatus,
    updateInvoicePaymentStatus,
    uploadShipmentDocument,
    deleteShipmentDocument,
    showToast 
  } = useLogistics();

  const [adminTab, setAdminTab] = useState('overview');

  // PHASE 3: Multi-Parameter Filter & Pagination State for Shipments
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDriverFilter, setOrderDriverFilter] = useState('All');
  const [orderVehicleFilter, setOrderVehicleFilter] = useState('All');
  const [orderCargoFilter, setOrderCargoFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All');
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(5);

  // PHASE 3: Document Management State
  const [docTypeFilter, setDocTypeFilter] = useState('All');
  const [docSearch, setDocSearch] = useState('');
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [uploadDocData, setUploadDocData] = useState({
    shipmentId: '',
    type: 'Commercial Invoice',
    name: '',
    fileSize: '185 KB',
    docCategory: 'invoice'
  });
  const [viewingDoc, setViewingDoc] = useState(null);

  // PHASE 3: Invoices & Payment Ledger State
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');
  const [invoiceSearch, setInvoiceSearch] = useState('');

  // PHASE 3: Customer Management State
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);

  // PHASE 3: Support Ticket Desk State
  const [ticketStatusFilter, setTicketStatusFilter] = useState('All');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('All');
  const [ticketSearch, setTicketSearch] = useState('');
  const [activeThreadTicket, setActiveThreadTicket] = useState(null);
  const [replyMessageText, setReplyMessageText] = useState('');

  // Message modal & order deletion state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetOrder, setMessageTargetOrder] = useState(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageText, setMessageText] = useState('');

  // Quotation Management State (Requirement 6)
  const [editingQuote, setEditingQuote] = useState(null);
  const [quoteLineItems, setQuoteLineItems] = useState({
    baseTransportationCharge: 320,
    distanceCharge: 85,
    cargoCharge: 60,
    vehicleCharge: 110,
    additionalServices: 35,
    adminNotes: ''
  });

  const handleOpenEditQuote = (q) => {
    setEditingQuote(q);
    setQuoteLineItems({
      baseTransportationCharge: q.lineItems?.baseTransportationCharge || q.lineItems?.baseCharge || 320,
      distanceCharge: q.lineItems?.distanceCharge || 85,
      cargoCharge: q.lineItems?.cargoCharge || 60,
      vehicleCharge: q.lineItems?.vehicleCharge || 110,
      additionalServices: q.lineItems?.additionalServices || 35,
      adminNotes: q.adminNotes || ''
    });
  };

  const handleSaveQuoteLineItems = (e) => {
    e.preventDefault();
    if (editingQuote) {
      updateAdminQuote(editingQuote.id, quoteLineItems, quoteLineItems.adminNotes);
      setEditingQuote(null);
    }
  };

  const handleOpenMessageModal = (order) => {
    setMessageTargetOrder(order);
    setMessageSubject(`Inquiry / Cancellation request regarding Order #${order.id}`);
    setMessageText('');
    setIsMessageModalOpen(true);
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      showToast('Please enter a message before sending.', 'warning');
      return;
    }
    showToast(`Message regarding Order #${messageTargetOrder?.id || ''} successfully sent to company support!`, 'success');
    setIsMessageModalOpen(false);
    setMessageTargetOrder(null);
    setMessageSubject('');
    setMessageText('');
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}? This action cannot be undone.`)) {
      deleteShipment(orderId);
      showToast(`Order #${orderId} deleted successfully.`, 'info');
    }
  };

  const defaultDriverPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  // Driver modal & password state
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [showNewDriverPassword, setShowNewDriverPassword] = useState(false);
  const [visibleDriverPasswords, setVisibleDriverPasswords] = useState({});
  const [editingDriverPassword, setEditingDriverPassword] = useState(null);

  const [newDriverData, setNewDriverData] = useState({ 
    name: '', 
    email: '',
    password: '',
    countryCode: '+65',
    phone: '', 
    vehicleType: 'Refrigerated Van', 
    vehicleId: 'FL-900', 
    licenseNumber: 'SG-CLASS4-881',
    dob: '1992-06-15',
    assignedHub: 'Changi Air Cargo Logistics Hub',
    photo: defaultDriverPhoto
  });

  const handleDriverPhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDriverData(prev => ({ ...prev, photo: reader.result }));
        showToast('Driver profile photo attached!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Warehouse modal state
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [newWarehouseData, setNewWarehouseData] = useState({
    name: '',
    location: '',
    manager: '',
    capacitySqFt: '250,000 sq ft',
    capacityPercentage: 65,
    activeParcels: 3200,
    incomingToday: 450,
    outgoingToday: 410
  });

  const handleAddWarehouseSubmit = (e) => {
    e.preventDefault();
    if (newWarehouseData.name && newWarehouseData.location && newWarehouseData.manager) {
      addWarehouse(newWarehouseData);
      setIsAddWarehouseOpen(false);
      setNewWarehouseData({
        name: '',
        location: '',
        manager: '',
        capacitySqFt: '250,000 sq ft',
        capacityPercentage: 65,
        activeParcels: 3200,
        incomingToday: 450,
        outgoingToday: 410
      });
    }
  };

  const handleOpenEditWarehouse = (wh) => {
    setEditingWarehouse({
      ...wh,
      name: (wh.name || '').replace(/[^a-zA-Z\s]/g, ''),
      manager: (wh.manager || '').replace(/[^a-zA-Z\s]/g, ''),
      location: wh.location || '',
      capacitySqFt: wh.capacitySqFt || '250,000 sq ft',
      capacityPercentage: wh.capacityPercentage !== undefined ? wh.capacityPercentage : 75,
      activeParcels: wh.activeParcels !== undefined ? wh.activeParcels : 3200
    });
  };

  const handleEditWarehouseSubmit = (e) => {
    e.preventDefault();
    if (editingWarehouse && editingWarehouse.id) {
      const cleanName = (editingWarehouse.name || '').replace(/[^a-zA-Z\s]/g, '').trim() || 'Logistics Depot';
      const cleanManager = (editingWarehouse.manager || '').replace(/[^a-zA-Z\s]/g, '').trim() || 'Operations Lead';
      
      const payload = {
        ...editingWarehouse,
        name: cleanName,
        manager: cleanManager
      };

      updateWarehouse(editingWarehouse.id, payload);
      setEditingWarehouse(null);
    }
  };

  // Driver Assignment modal state
  const [assignModalShipment, setAssignModalShipment] = useState(null);

  // Filtered orders list with advanced multi-parameter search
  const filteredShipments = shipments.filter(s => {
    const term = (orderSearch || '').trim().toLowerCase();
    const matchesSearch = !term || 
      (s.id && s.id.toLowerCase().includes(term)) || 
      (s.sender && s.sender.toLowerCase().includes(term)) ||
      (s.receiver && s.receiver.toLowerCase().includes(term)) ||
      (s.driverName && s.driverName.toLowerCase().includes(term)) ||
      (s.vehiclePlate && s.vehiclePlate.toLowerCase().includes(term)) ||
      (s.cargoType && s.cargoType.toLowerCase().includes(term));

    const matchesStatus = orderStatusFilter === 'All' || s.status === orderStatusFilter;
    const matchesDriver = orderDriverFilter === 'All' || s.driverId === orderDriverFilter || s.driverName === orderDriverFilter;
    const matchesVehicle = orderVehicleFilter === 'All' || s.vehiclePlate === orderVehicleFilter || (s.vehicle && s.vehicle.includes(orderVehicleFilter));
    const matchesCargo = orderCargoFilter === 'All' || s.cargoType === orderCargoFilter;

    let matchesDate = true;
    if (orderDateFilter === 'Today') {
      matchesDate = s.createdDate?.includes('Today') || s.lastUpdatedTime?.includes('now') || s.lastUpdatedTime?.includes('min');
    }

    return matchesSearch && matchesStatus && matchesDriver && matchesVehicle && matchesCargo && matchesDate;
  });

  // Pagination for filteredShipments
  const totalOrderPages = Math.max(1, Math.ceil(filteredShipments.length / orderPageSize));
  const paginatedShipments = filteredShipments.slice((orderPage - 1) * orderPageSize, orderPage * orderPageSize);

  // Filtered Documents list
  const filteredDocuments = documents.filter(doc => {
    const term = (docSearch || '').trim().toLowerCase();
    const matchesSearch = !term || 
      (doc.name && doc.name.toLowerCase().includes(term)) ||
      (doc.shipmentId && doc.shipmentId.toLowerCase().includes(term)) ||
      (doc.customerName && doc.customerName.toLowerCase().includes(term));
    const matchesType = docTypeFilter === 'All' || doc.type === docTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered Invoices list
  const filteredInvoices = invoices.filter(inv => {
    const term = (invoiceSearch || '').trim().toLowerCase();
    const matchesSearch = !term ||
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(term)) ||
      (inv.shipmentId && inv.shipmentId.toLowerCase().includes(term)) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(term));
    const matchesStatus = invoiceStatusFilter === 'All' || inv.paymentStatus === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Support Tickets list
  const filteredTickets = tickets.filter(t => {
    const term = (ticketSearch || '').trim().toLowerCase();
    const matchesSearch = !term ||
      (t.id && t.id.toLowerCase().includes(term)) ||
      (t.shipmentId && t.shipmentId.toLowerCase().includes(term)) ||
      (t.subject && t.subject.toLowerCase().includes(term)) ||
      (t.customerName && t.customerName.toLowerCase().includes(term));
    const matchesStatus = ticketStatusFilter === 'All' || t.status === ticketStatusFilter;
    const matchesPriority = ticketPriorityFilter === 'All' || t.priority === ticketPriorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Filtered Customers list
  const filteredCustomers = customers.filter(c => {
    const term = (customerSearch || '').trim().toLowerCase();
    return !term ||
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.company && c.company.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(term));
  });

  // Vector PDF invoice generation
  const handleDownloadInvoicePDF = (inv) => {
    const doc = new jsPDF();
    doc.setFillColor(16, 24, 45); // #10182D Dark Navy
    doc.rect(0, 0, 210, 36, 'F');
    
    doc.setTextColor(255, 107, 0); // #FF6B00 Orange
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('JOSAN LOGISTICS PTE LTD', 15, 18);

    doc.setFontSize(9);
    doc.setTextColor(226, 232, 240);
    doc.text('Singapore Highway Linehaul & Inland Freight • Tax Reg / UEN: 202418829K', 15, 26);
    doc.text('10 Pasir Panjang Road, Mapletree Business City, Singapore 117438', 15, 31);

    doc.setTextColor(16, 24, 45);
    doc.setFontSize(14);
    doc.text(`TAX INVOICE: ${inv.invoiceNumber}`, 15, 48);

    doc.setFontSize(10);
    doc.text(`Shipment ID: ${inv.shipmentId}`, 15, 56);
    doc.text(`Customer: ${inv.customerName}`, 15, 62);
    doc.text(`Contact: ${inv.customerEmail || inv.customerPhone || 'N/A'}`, 15, 68);
    doc.text(`Issue Date: ${inv.issueDate}`, 130, 56);
    doc.text(`Due Date: ${inv.dueDate}`, 130, 62);
    doc.text(`Payment Status: ${inv.paymentStatus.toUpperCase()}`, 130, 68);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 74, 195, 74);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item Description', 15, 82);
    doc.text('Amount (SGD)', 160, 82);
    doc.line(15, 85, 195, 85);

    doc.setFont('helvetica', 'normal');
    doc.text(`Commercial Overland Roadway Transportation (${inv.shipmentId})`, 15, 93);
    doc.text(`S$ ${Number(inv.subtotal).toFixed(2)}`, 160, 93);

    doc.text('Singapore Goods and Services Tax (GST 9%)', 15, 101);
    doc.text(`S$ ${Number(inv.taxAmount || inv.subtotal * 0.09).toFixed(2)}`, 160, 101);

    doc.line(15, 107, 195, 107);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Invoice Amount Payable:', 15, 115);
    doc.setTextColor(255, 107, 0);
    doc.text(`S$ ${Number(inv.total).toFixed(2)}`, 160, 115);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Notes: ${inv.notes || 'Payable via FAST Transfer / Corporate GIRO to Josan Logistics Account #881-99201-3.'}`, 15, 130);
    doc.text('Thank you for choosing Josan Logistics. ISO 9001 certified fleet operations.', 15, 136);

    doc.save(`${inv.invoiceNumber}_JosanLogistics.pdf`);
    showToast(`Downloaded official invoice PDF: ${inv.invoiceNumber}`, 'success');
  };

  const handleUploadDocSubmit = (e) => {
    e.preventDefault();
    if (!uploadDocData.shipmentId || !uploadDocData.name) {
      showToast('Please specify target Shipment ID and document title.', 'warning');
      return;
    }
    const matchingShipment = shipments.find(s => s.id === uploadDocData.shipmentId);
    uploadShipmentDocument(uploadDocData.shipmentId, {
      type: uploadDocData.type,
      name: uploadDocData.name,
      fileSize: uploadDocData.fileSize || '185 KB',
      customerName: matchingShipment?.sender || 'Consignment Shipper',
      docCategory: uploadDocData.docCategory
    });
    setIsUploadDocModalOpen(false);
    setUploadDocData({
      shipmentId: '',
      type: 'Commercial Invoice',
      name: '',
      fileSize: '185 KB',
      docCategory: 'invoice'
    });
  };

  const handleDownloadPDFReport = () => {
    const reportDate = new Date().toLocaleDateString();
    const reportTime = new Date().toLocaleTimeString();
    const fileName = `Josan_Financial_Operations_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

    const reportContent = `%PDF-1.4
================================================================================
                    JOSAN LOGISTICS ENTERPRISE REPORT
               Financial & Operations Audit Report (PDF Format)
               Generated Date: ${reportDate} ${reportTime}
================================================================================

1. EXECUTIVE KEY PERFORMANCE INDICATORS (KPIs)
--------------------------------------------------------------------------------
- Total Shipments Handled      : ${analyticsData?.kpis?.totalShipments || 1248}
- Active Deliveries in Transit  : ${analyticsData?.kpis?.activeDeliveries || 42}
- Monthly Revenue (SGD)        : ${analyticsData?.kpis?.monthlyRevenue || 'S$ 1,480,000'}
- Delivery Success Rate (SLA)  : ${analyticsData?.kpis?.onTimeDeliveryRate || '99.4%'}
- Flagged Delay Rate          : 1.4% (Weather & Traffic Factors)

2. MONTHLY FREIGHT REVENUE BREAKDOWN
--------------------------------------------------------------------------------
- Jan 2026 : S$ 1,120,000
- Feb 2026 : S$ 1,280,000
- Mar 2026 : S$ 1,350,000
- Apr 2026 : S$ 1,410,000
- May 2026 : S$ 1,480,000

3. FREIGHT VOLUME BY SERVICE MODE
--------------------------------------------------------------------------------
- Express Air Cargo            : 45% Volume Share
- Heavy Freight Trucking       : 30% Volume Share
- Ocean Shipping Containers     : 15% Volume Share
- Cold-Chain Logistics         : 10% Volume Share

4. REGIONAL WAREHOUSE INVENTORY AUDIT
--------------------------------------------------------------------------------
- Singapore Regional HQ Hub     : 88% Capacity (12,400 Sq Ft)
- Pasir Panjang Port Terminal   : 92% Capacity (18,500 Sq Ft)
- Changi Air Cargo Complex     : 76% Capacity (9,800 Sq Ft)

================================================================================
Approved by: Josan Logistics Fleet Operations & Compliance Management
Document Security Code: JOS-PDF-AUTH-2026-SG
================================================================================
`;

    const blob = new Blob([reportContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`PDF File Downloaded: ${fileName} (Saved to your browser Downloads folder)`);
  };

  const handleAddDriverSubmit = (e) => {
    e.preventDefault();
    const cleanDigits = newDriverData.phone.replace(/[^0-9]/g, '');
    const code = newDriverData.countryCode || '+65';
    const minDigits = getPhoneLength(code);
    if (cleanDigits.length < minDigits) {
      showToast(`Driver contact number must contain at least ${minDigits} digits for ${code}`, 'warning');
      return;
    }

    const driverPassword = newDriverData.password.trim() || `driver${Math.floor(100 + Math.random() * 900)}`;

    if (newDriverData.name && cleanDigits) {
      const cleanName = newDriverData.name.trim();
      const defaultEmail = `${cleanName.toLowerCase().replace(/\s+/g, '.')}@josanlogistics.com`;
      addDriver({
        ...newDriverData,
        name: cleanName,
        email: newDriverData.email.trim() || defaultEmail,
        password: driverPassword,
        phone: `${code} ${cleanDigits}`,
        licenseNumber: newDriverData.licenseNumber || 'SG-CLASS4-881',
        dob: newDriverData.dob || '1992-06-15',
        assignedHub: newDriverData.assignedHub || 'Changi Air Cargo Logistics Hub',
        workingLocation: newDriverData.assignedHub || 'Changi Air Cargo Logistics Hub',
        status: 'Available',
        photo: newDriverData.photo || defaultDriverPhoto
      });
      setIsAddDriverOpen(false);
      setNewDriverData({ 
        name: '', 
        email: '',
        password: '',
        countryCode: '+65',
        phone: '', 
        licenseNumber: '',
        dob: '1992-06-15',
        vehicleType: 'Refrigerated Van', 
        vehicleId: 'SG-8819', 
        assignedHub: 'Changi Air Cargo Logistics Hub',
        photo: defaultDriverPhoto
      });
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Admin Top Header Card (Clean Light Theme) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 border-l-8 border-l-orange-500 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden bg-gradient-to-r from-orange-50/40 via-white to-slate-50/50">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Fleet Control Center & Operations Hub
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              Live Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight">Josan Fleet Admin Portal</h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium">
            Manage global dispatch, driver allocations, warehouse inventory, and financial audit analytics.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 shrink-0">
          <span className="flex items-center text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping mr-2"></span>
            Telemetry Stream Live
          </span>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap gap-2 text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
          { id: 'orders', label: `Shipment Management (${shipments.length})`, icon: Package },
          { id: 'documents', label: `Document Vault (${documents.length})`, icon: FileText },
          { id: 'invoices', label: `Invoices & Billing (${invoices.length})`, icon: CreditCard },
          { id: 'drivers', label: `Driver & Fleet (${drivers.length})`, icon: Truck },
          { id: 'customers', label: `Customer Accounts (${customers.length})`, icon: Users },
          { id: 'support', label: `Support Tickets (${tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length})`, icon: MessageSquare },
          { id: 'quotes', label: `Quotations (${quotes.length})`, icon: DollarSign },
          { id: 'warehouses', label: `Warehouses (${warehouses.length})`, icon: Warehouse },
          { id: 'notifications', label: `Notifications (${notifications.filter(n => (n.role === 'admin' || !n.role) && !n.read).length})`, icon: Bell },
          { id: 'analytics', label: 'Reports & Audit', icon: TrendingUp },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isSelected = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 font-bold cursor-pointer ${
                isSelected
                  ? 'bg-[#FF6B00] text-white shadow-sm font-extrabold ring-1 ring-[#FF6B00]'
                  : 'text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#FF6B00]'}`} />
              <span className={isSelected ? 'text-white font-extrabold' : 'text-slate-800'}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: DASHBOARD OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          
          {/* KPI Summary Cards: 6 Core Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            
            {/* Card 1: Shipments */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total Shipments</span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">{shipments.length}</h3>
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{shipments.filter(s => s.status !== 'Delivered').length} En Route</span>
              </p>
            </div>

            {/* Card 2: Customers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Customers</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">{customers.length}</h3>
              <p className="text-[11px] font-semibold text-blue-600">
                <span>{customers.filter(c => c.status === 'Active').length} Active Accounts</span>
              </p>
            </div>

            {/* Card 3: Drivers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Driver Roster</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">{drivers.length}</h3>
              <p className="text-[11px] font-semibold text-emerald-600">
                <span>{drivers.filter(d => d.status === 'Available').length} Ready for Dispatch</span>
              </p>
            </div>

            {/* Card 4: Registered Vehicles */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Fleet Vehicles</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">7 Units</h3>
              <p className="text-[11px] font-semibold text-purple-600">
                <span>FTL, Reefer, Box Lorry</span>
              </p>
            </div>

            {/* Card 5: Quotations */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Quotations</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">{quotes.length}</h3>
              <p className="text-[11px] font-semibold text-amber-600">
                <span>{quotes.filter(q => q.status === 'Converted' || q.status === 'Accepted').length} Converted</span>
              </p>
            </div>

            {/* Card 6: Deliveries & SLA */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Deliveries</span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">{shipments.filter(s => s.status === 'Delivered').length}</h3>
              <p className="text-[11px] font-semibold text-teal-600">
                <span>99.4% On-Time SLA</span>
              </p>
            </div>

          </div>

          {/* Real-time Factual Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: Shipment Volume by 7-Stage Pipeline */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-sans">Shipment Pipeline by Status</h3>
                  <p className="text-xs text-slate-500 font-medium">Real-time counts across the 7-stage fulfillment lifecycle</p>
                </div>
                <span className="text-xs font-mono font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {shipments.length} Total
                </span>
              </div>
              
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Booked', count: shipments.filter(s => s.status === 'Booked').length },
                      { name: 'Confirmed', count: shipments.filter(s => s.status === 'Confirmed').length },
                      { name: 'Scheduled', count: shipments.filter(s => s.status === 'Pickup Scheduled').length },
                      { name: 'Picked Up', count: shipments.filter(s => s.status === 'Picked Up').length },
                      { name: 'In Transit', count: shipments.filter(s => s.status === 'In Transit').length },
                      { name: 'Near Dest', count: shipments.filter(s => s.status === 'Near Destination').length },
                      { name: 'Delivered', count: shipments.filter(s => s.status === 'Delivered').length },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} angle={-20} textAnchor="end" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#10182D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                    <Bar dataKey="count" fill="#FF6B00" radius={[6, 6, 0, 0]} name="Shipments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Revenue Breakdown by Payment Status */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-sans">Revenue by Payment Status</h3>
                  <p className="text-xs text-slate-500 font-medium">Computed from live commercial invoices</p>
                </div>
                <button onClick={() => setAdminTab('invoices')} className="text-xs font-bold text-orange-600 hover:underline">
                  Invoices →
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="h-48 w-48 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Paid', value: invoices.filter(i => i.paymentStatus === 'Paid').reduce((sum, i) => sum + Number(i.total || 0), 0) || 1, color: '#16A34A' },
                          { name: 'Unpaid', value: invoices.filter(i => i.paymentStatus === 'Unpaid').reduce((sum, i) => sum + Number(i.total || 0), 0) || 1, color: '#DC2626' },
                          { name: 'Pending', value: invoices.filter(i => i.paymentStatus === 'Pending').reduce((sum, i) => sum + Number(i.total || 0), 0) || 1, color: '#F59E0B' },
                          { name: 'Refunded', value: invoices.filter(i => i.paymentStatus === 'Refunded').reduce((sum, i) => sum + Number(i.total || 0), 0) || 1, color: '#64748B' }
                        ]}
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        <Cell fill="#16A34A" />
                        <Cell fill="#DC2626" />
                        <Cell fill="#F59E0B" />
                        <Cell fill="#64748B" />
                      </Pie>
                      <Tooltip formatter={(val) => `S$ ${Number(val).toFixed(2)}`} contentStyle={{ backgroundColor: '#10182D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs flex-1 w-full">
                  {[
                    { label: 'Paid', amount: invoices.filter(i => i.paymentStatus === 'Paid').reduce((sum, i) => sum + Number(i.total || 0), 0), color: 'bg-emerald-500', text: 'text-emerald-700' },
                    { label: 'Unpaid', amount: invoices.filter(i => i.paymentStatus === 'Unpaid').reduce((sum, i) => sum + Number(i.total || 0), 0), color: 'bg-rose-500', text: 'text-rose-700' },
                    { label: 'Pending', amount: invoices.filter(i => i.paymentStatus === 'Pending').reduce((sum, i) => sum + Number(i.total || 0), 0), color: 'bg-amber-500', text: 'text-amber-700' },
                    { label: 'Refunded', amount: invoices.filter(i => i.paymentStatus === 'Refunded').reduce((sum, i) => sum + Number(i.total || 0), 0), color: 'bg-slate-400', text: 'text-slate-600' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                        <span className="font-bold text-slate-700">{item.label}</span>
                      </div>
                      <span className={`font-mono font-extrabold ${item.text}`}>
                        S$ {item.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Activity Feed & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-slate-900">Recent Dispatch Activity Feed</h2>
                <button onClick={() => setAdminTab('orders')} className="text-xs font-bold text-orange-600 hover:underline">
                  View All Orders →
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {shipments.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.status === 'Delivered' ? 'bg-emerald-500' : 'bg-orange-500 pulse-badge'}`}></div>
                      <div>
                        <p className="font-extrabold text-slate-900 font-mono">{item.id} - {item.sender}</p>
                        <p className="text-slate-500 text-[11px]">{item.origin} → {item.destination} ({item.serviceLevel})</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      item.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operations Actions Card (Light Theme) */}
            <div className="lg:col-span-4 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6 border-t-4 border-t-orange-500">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-extrabold text-slate-900 font-sans">Operations Control Actions</h2>
                <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Quick Tasks
                </span>
              </div>
              <div className="space-y-3 text-xs font-sans">
                <button
                  onClick={() => setAdminTab('orders')}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold transition-all text-left flex items-center justify-between shadow-orange-sm cursor-pointer active:scale-95"
                >
                  <span className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Dispatch New Order</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setAdminTab('drivers'); setIsAddDriverOpen(true); }}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-extrabold border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer active:scale-95"
                >
                  <span className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Register New Fleet Driver</span>
                  </span>
                  <Plus className="w-4 h-4 text-orange-600" />
                </button>
                <button
                  onClick={handleDownloadPDFReport}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-extrabold border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer active:scale-95"
                >
                  <span className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-orange-600" />
                    <span>Generate Financial Audit Report</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => { setAdminTab('warehouses'); setIsAddWarehouseOpen(true); }}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-extrabold border border-slate-200 transition-all text-left flex items-center justify-between cursor-pointer active:scale-95"
                >
                  <span className="flex items-center space-x-2">
                    <Warehouse className="w-4 h-4 text-orange-600" />
                    <span>Add Warehouse Depot</span>
                  </span>
                  <Plus className="w-4 h-4 text-orange-600" />
                </button>
              </div>
            </div>

          </div>

          {/* Feature Widgets Row 2: Fleet Driver Roster Status & Warehouse Hub Storage Gauges */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Live Driver Readiness & Telemetry Panel */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-sans">Active Driver Readiness</h3>
                    <p className="text-xs text-slate-500 font-medium">Real-time driver roster telemetry & duty assignments</p>
                  </div>
                </div>
                <button onClick={() => setAdminTab('drivers')} className="text-xs font-bold text-orange-600 hover:underline">
                  Manage Drivers ({drivers.length}) →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider block">Available Roster</span>
                    <span className="text-xl font-extrabold text-emerald-900 font-sans">{drivers.filter(d => d.status === 'Available').length} Drivers</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-orange-800 text-[10px] font-extrabold uppercase tracking-wider block">On Active Delivery</span>
                    <span className="text-xl font-extrabold text-orange-900 font-sans">{drivers.filter(d => d.status !== 'Available').length} Drivers</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {drivers.slice(0, 3).map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-orange-300 transition-colors text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={driver.photo} alt={driver.name} className="w-10 h-10 rounded-full object-cover border border-orange-400 shrink-0" />
                      <div>
                        <span className="font-extrabold text-slate-900 block font-sans">{driver.name}</span>
                        <span className="text-slate-500 text-[11px] font-medium">{driver.vehicleType}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      driver.status === 'Available' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}>
                      ● {driver.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warehouse Capacity & Dispatch Throughput Gauge Panel */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                    <Warehouse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-sans">Regional Warehouse Storage</h3>
                    <p className="text-xs text-slate-500 font-medium">Storage capacity utilization & parcel throughput</p>
                  </div>
                </div>
                <button onClick={() => setAdminTab('warehouses')} className="text-xs font-bold text-orange-600 hover:underline">
                  View Hubs ({warehouses.length}) →
                </button>
              </div>

              <div className="space-y-4">
                {warehouses.slice(0, 3).map((wh) => (
                  <div key={wh.id} className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-900 truncate font-sans">{wh.name}</span>
                      <span className="font-mono text-orange-600 font-extrabold text-xs">{wh.capacityPercentage}% Capacity</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-orange-gradient h-full rounded-full transition-all duration-500" style={{ width: `${wh.capacityPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                      <span>Manager: <strong className="text-slate-700 font-bold">{wh.manager}</strong></span>
                      <span className="text-slate-700 font-semibold">{wh.activeParcels} Active Parcels</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODULE 2: SHIPMENT MANAGEMENT MODULE (Requirement 2) */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Consignment Dispatch
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {filteredShipments.length} Total Matches
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Shipment Management & Telematics</h2>
              <p className="text-xs text-slate-500">
                Advanced search, driver allocation, 7-stage pipeline updating, and consignment telematics auditing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOrderSearch('');
                  setOrderStatusFilter('All');
                  setOrderDriverFilter('All');
                  setOrderVehicleFilter('All');
                  setOrderCargoFilter('All');
                  setOrderDateFilter('All');
                  setOrderPage(1);
                  showToast('Search & filter criteria reset.', 'info');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Advanced Multi-Parameter Filter Toolbar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              
              {/* 1. Search Bar */}
              <div className="relative">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Shipment / Customer
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => {
                      setOrderSearch(e.target.value);
                      setOrderPage(1);
                    }}
                    placeholder="ID, shipper, driver..."
                    className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange shadow-2xs"
                  />
                </div>
              </div>

              {/* 2. Pipeline Status Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Pipeline Status
                </label>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => {
                    setOrderStatusFilter(e.target.value);
                    setOrderPage(1);
                  }}
                  className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer shadow-2xs"
                >
                  <option value="All">All Pipeline Stages</option>
                  <option value="Booked">1. Booked</option>
                  <option value="Confirmed">2. Confirmed</option>
                  <option value="Pickup Scheduled">3. Pickup Scheduled</option>
                  <option value="Picked Up">4. Picked Up</option>
                  <option value="In Transit">5. In Transit</option>
                  <option value="Near Destination">6. Near Destination</option>
                  <option value="Delivered">7. Delivered</option>
                  <option value="Delayed">⚠️ Delayed</option>
                </select>
              </div>

              {/* 3. Driver Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Assigned Driver
                </label>
                <select
                  value={orderDriverFilter}
                  onChange={(e) => {
                    setOrderDriverFilter(e.target.value);
                    setOrderPage(1);
                  }}
                  className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer shadow-2xs"
                >
                  <option value="All">All Drivers</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* 4. Vehicle Type Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Fleet Vehicle
                </label>
                <select
                  value={orderVehicleFilter}
                  onChange={(e) => {
                    setOrderVehicleFilter(e.target.value);
                    setOrderPage(1);
                  }}
                  className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer shadow-2xs"
                >
                  <option value="All">All Vehicles</option>
                  <option value="Refrigerated Van">Refrigerated Van</option>
                  <option value="14ft Box Truck">14ft Box Truck</option>
                  <option value="24ft Heavy Lorry">24ft Heavy Lorry</option>
                  <option value="Prime Mover / Container Chassis">Prime Mover / Chassis</option>
                </select>
              </div>

              {/* 5. Cargo Type Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Cargo Classification
                </label>
                <select
                  value={orderCargoFilter}
                  onChange={(e) => {
                    setOrderCargoFilter(e.target.value);
                    setOrderPage(1);
                  }}
                  className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer shadow-2xs"
                >
                  <option value="All">All Cargo Types</option>
                  <option value="High-Tech Electronics">High-Tech Electronics</option>
                  <option value="Pharmaceuticals & Vaccines">Pharmaceuticals</option>
                  <option value="Industrial Aviation Spare Parts">Aviation Parts</option>
                  <option value="Perishable Cold Chain">Cold Chain</option>
                  <option value="Commercial Palletized Freight">Palletized Freight</option>
                </select>
              </div>

              {/* 6. Date Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Booking Date
                </label>
                <select
                  value={orderDateFilter}
                  onChange={(e) => {
                    setOrderDateFilter(e.target.value);
                    setOrderPage(1);
                  }}
                  className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer shadow-2xs"
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today / Recent</option>
                </select>
              </div>

            </div>
          </div>

          {/* Orders Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Client / Sender</th>
                  <th className="p-3">Transit Route</th>
                  <th className="p-3">Driver & Vehicle</th>
                  <th className="p-3">Pipeline Status (Admin Control)</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Rate</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedShipments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No shipments matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedShipments.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-black text-orange-600 block">{order.id}</span>
                        <span className="text-[10px] text-slate-400">{order.createdDate || '17 Sep 2026'}</span>
                      </td>
                      <td className="p-3">
                        <strong className="font-extrabold text-slate-900 block">{order.sender}</strong>
                        <span className="text-[11px] text-slate-500 truncate block max-w-[140px]">
                          To: {order.receiver || 'Consignee'}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">
                        <div className="font-semibold text-slate-900 truncate max-w-[180px]">{order.origin}</div>
                        <div className="text-slate-400 text-[10px]">↓ en route to</div>
                        <div className="font-semibold text-slate-900 truncate max-w-[180px]">{order.destination}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{order.driverName || 'Unassigned'}</span>
                          <button
                            onClick={() => setAssignModalShipment(order)}
                            className="px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] rounded font-bold border border-orange-200 transition-colors"
                            title="Assign driver and vehicle"
                          >
                            Assign
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          {order.vehiclePlate || 'SG-900'} • {order.cargoType || 'General Freight'}
                        </span>
                      </td>
                      <td className="p-3">
                        {/* Interactive 7-Stage Status Update Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => updateShipmentStatus(order.id, e.target.value)}
                          className={`p-1.5 rounded-lg text-[11px] font-extrabold border cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : order.status === 'Delayed'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-orange-50 text-orange-800 border-orange-300 font-extrabold'
                          }`}
                        >
                          <option value="Booked">1. Booked</option>
                          <option value="Confirmed">2. Confirmed</option>
                          <option value="Pickup Scheduled">3. Pickup Scheduled</option>
                          <option value="Picked Up">4. Picked Up</option>
                          <option value="In Transit">5. In Transit</option>
                          <option value="Near Destination">6. Near Destination</option>
                          <option value="Delivered">7. Delivered</option>
                          <option value="Delayed">⚠️ Delayed</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : order.paymentStatus === 'Failed'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          ● {order.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">{order.price}</td>
                      <td className="p-3 text-right space-x-1 flex items-center justify-end">
                        <button
                          onClick={() => setSelectedDetailShipment(order)}
                          title="Inspect full consignment dossier, live waypoint, and digital POD"
                          className="px-2 py-1 bg-[#10182D] hover:bg-navy/90 text-white rounded text-[11px] font-extrabold transition-all flex items-center space-x-1 shadow-2xs"
                        >
                          <ShieldCheck className="w-3 h-3 text-orange" />
                          <span>Dossier</span>
                        </button>
                        <button
                          onClick={() => setSelectedInvoiceShipment(order)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-bold"
                        >
                          Invoice
                        </button>
                        <button
                          onClick={() => handleOpenMessageModal(order)}
                          title="Send message to client regarding this order"
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-extrabold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-blue-600" />
                          <span>Msg</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Delete order permanently"
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-extrabold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{filteredShipments.length > 0 ? (orderPage - 1) * orderPageSize + 1 : 0}</strong> to{' '}
              <strong className="text-slate-800">{Math.min(orderPage * orderPageSize, filteredShipments.length)}</strong> of{' '}
              <strong className="text-slate-800">{filteredShipments.length}</strong> consignments
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 font-bold">Rows per page:</span>
                <select
                  value={orderPageSize}
                  onChange={(e) => {
                    setOrderPageSize(Number(e.target.value));
                    setOrderPage(1);
                  }}
                  className="py-1 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus-orange cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setOrderPage(prev => Math.max(prev - 1, 1))}
                  disabled={orderPage <= 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-2.5 py-1 text-slate-800 font-black font-mono">
                  {orderPage} / {totalOrderPages}
                </span>
                <button
                  onClick={() => setOrderPage(prev => Math.min(prev + 1, totalOrderPages))}
                  disabled={orderPage >= totalOrderPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODULE 3: DOCUMENT MANAGEMENT VAULT (Requirement 3) */}
      {adminTab === 'documents' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Compliance & Regulatory
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {documents.length} Authorized Documents
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Consignment Document Management Vault</h2>
              <p className="text-xs text-slate-500">
                Official invoices, packing lists, delivery notes (LR), customs permits, marine insurance policies, and signed PODs.
              </p>
            </div>

            <button
              onClick={() => setIsUploadDocModalOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Document Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 flex-1 sm:max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Search by file name, shipment ID, or customer..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-bold">Document Type:</span>
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Types ({documents.length})</option>
                <option value="Commercial Invoice">Commercial Invoice</option>
                <option value="Packing List">Packing List</option>
                <option value="Delivery Note / LR">Delivery Note / LR</option>
                <option value="Customs Clearance Permit">Customs Permit</option>
                <option value="Cargo Insurance Policy">Insurance Policy</option>
                <option value="Proof of Delivery (POD)">Proof of Delivery (POD)</option>
              </select>
            </div>
          </div>

          {/* Document Vault Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Document Title & File</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Linked Shipment ID</th>
                  <th className="p-3">Customer Entity</th>
                  <th className="p-3">Size & Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No documents found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{doc.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-extrabold text-orange-600">
                        {doc.shipmentId}
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        {doc.customerName}
                      </td>
                      <td className="p-3 text-slate-500">
                        <div>{doc.fileSize}</div>
                        <div className="text-[10px] text-slate-400">{doc.uploadDate}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ {doc.status || 'Verified'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 flex items-center justify-end">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([`Josan Logistics Official Document: ${doc.name}\nType: ${doc.type}\nShipment: ${doc.shipmentId}\nCustomer: ${doc.customerName}\nSecurity Hash: JOS-DOC-AUTH-2026`], { type: 'application/pdf' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = doc.name;
                            link.click();
                            URL.revokeObjectURL(url);
                            showToast(`Downloaded verified document: ${doc.name}`, 'success');
                          }}
                          className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold rounded-lg text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete document "${doc.name}"?`)) {
                              deleteShipmentDocument(doc.id);
                              showToast(`Document ${doc.name} deleted.`);
                            }
                          }}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs transition-colors cursor-pointer"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* MODULE 4: INVOICE & PAYMENT STATUS (Requirement 4) */}
      {adminTab === 'invoices' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Financial Ledger & GST Billing
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {invoices.length} Official Invoices
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Invoices & Payment Status Ledger</h2>
              <p className="text-xs text-slate-500">
                Manage commercial billing, Singapore GST 9% breakdown, payment statuses (Unpaid, Pending, Paid, Failed, Refunded), and export official vector PDF invoices.
              </p>
            </div>

            <button
              onClick={handleDownloadPDFReport}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-orange" />
              <span>Export Audit Ledger PDF</span>
            </button>
          </div>

          {/* Revenue KPI Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Invoiced</span>
              <p className="text-xl font-extrabold text-slate-900 font-mono">
                S$ {invoices.reduce((sum, i) => sum + Number(i.total || 0), 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-400 font-medium">Gross Freight Billings</span>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Paid Total</span>
              <p className="text-xl font-extrabold text-emerald-900 font-mono">
                S$ {invoices.filter(i => i.paymentStatus === 'Paid').reduce((sum, i) => sum + Number(i.total || 0), 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">Cleared & Settled</span>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase">Pending & Unpaid</span>
              <p className="text-xl font-extrabold text-amber-900 font-mono">
                S$ {invoices.filter(i => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Pending').reduce((sum, i) => sum + Number(i.total || 0), 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-amber-700 font-medium">Awaiting Corporate Settlement</span>
            </div>

            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1">
              <span className="text-[11px] font-bold text-rose-800 uppercase">Failed / Refunded</span>
              <p className="text-xl font-extrabold text-rose-900 font-mono">
                S$ {invoices.filter(i => i.paymentStatus === 'Failed' || i.paymentStatus === 'Refunded').reduce((sum, i) => sum + Number(i.total || 0), 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-rose-700 font-medium">Disputes & Credit Reversals</span>
            </div>
          </div>

          {/* Invoice Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 flex-1 sm:max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  placeholder="Search invoice number, shipment ID, or customer..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-bold">Payment Status:</span>
              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Invoices ({invoices.length})</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Customer Entity</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Tax (9% GST)</th>
                  <th className="p-3">Total (SGD)</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Payment Status (Update)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No invoices found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-black text-orange-600">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {inv.shipmentId}
                      </td>
                      <td className="p-3">
                        <strong className="text-slate-900 block">{inv.customerName}</strong>
                        <span className="text-[10px] text-slate-400">{inv.customerEmail}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        S$ {Number(inv.subtotal).toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-slate-500">
                        S$ {Number(inv.taxAmount).toFixed(2)}
                      </td>
                      <td className="p-3 font-mono font-black text-slate-900 text-sm">
                        S$ {Number(inv.total).toFixed(2)}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">
                        {inv.dueDate}
                      </td>
                      <td className="p-3">
                        {/* Interactive Status Update Selector supporting 5 statuses */}
                        <select
                          value={inv.paymentStatus}
                          onChange={(e) => {
                            updateInvoicePaymentStatus(inv.id, e.target.value);
                          }}
                          className={`p-1.5 rounded-lg text-[11px] font-extrabold border cursor-pointer ${
                            inv.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : inv.paymentStatus === 'Pending'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : inv.paymentStatus === 'Unpaid'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : inv.paymentStatus === 'Failed'
                              ? 'bg-red-200 text-red-900 border-red-400'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDownloadInvoicePDF(inv)}
                          className="px-3 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-[11px] font-extrabold transition-all shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                          title="Generate official vector PDF invoice"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF Invoice</span>
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


      {/* MODULE: QUOTATION MANAGEMENT (Requirement 6) */}
      {adminTab === 'quotes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange" />
                <span>Quotation Management & Rate Calculator</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review rate requests, configure itemized line charges, send official proposals to clients, and monitor conversions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 font-mono">
                Total Proposals: {quotes.length}
              </span>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Quote ID</th>
                  <th className="p-3">Customer / Enterprise</th>
                  <th className="p-3">Route (Origin → Dest)</th>
                  <th className="p-3">Freight Mode</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Subtotal & Tax</th>
                  <th className="p-3">Final Total</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {quotes.map((q) => {
                  const lineItems = q.lineItems || {
                    baseCharge: 320,
                    distanceCharge: 85,
                    cargoCharge: 60,
                    vehicleCharge: 110,
                    additionalServices: 35,
                    taxAmount: 54.90,
                    finalAmount: 664.90
                  };
                  const isDraft = q.status === 'Draft';
                  const isSent = q.status === 'Sent';
                  const isAccepted = q.status === 'Accepted';
                  const isConverted = q.status === 'Converted';
                  const isRejected = q.status === 'Rejected';

                  return (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-extrabold text-orange">{q.id}</td>
                      <td className="p-3">
                        <strong className="text-slate-900 block">{q.customerName || 'Enterprise Client'}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">{q.customerPhone || '+65 9123 4567'}</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        <span className="font-semibold text-slate-900">{q.origin}</span>
                        <span className="text-slate-400 mx-1">→</span>
                        <span className="font-semibold text-slate-900">{q.destination}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800 block capitalize">{q.freightMode || 'FTL Linehaul'}</span>
                        <span className="text-[11px] text-slate-500">{q.cargoWeight || 500} kg</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isConverted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isAccepted
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : isSent
                            ? 'bg-orange-100 text-orange-800 border border-orange-200 animate-pulse'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          ● {q.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono">
                        <div>Sub: S$ {(lineItems.finalAmount - lineItems.taxAmount).toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">GST: S$ {lineItems.taxAmount?.toFixed(2)}</div>
                      </td>
                      <td className="p-3 font-mono font-extrabold text-slate-900 text-sm">
                        S$ {lineItems.finalAmount?.toFixed(2)}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditQuote(q)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Edit Line Items
                        </button>

                        {isDraft && (
                          <button
                            onClick={() => sendQuoteToCustomer(q.id)}
                            className="px-3 py-1 bg-orange hover:bg-orange/90 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            Send to Customer
                          </button>
                        )}

                        {isConverted && (
                          <span className="text-[11px] font-bold text-emerald-700 font-mono">
                            Order #{q.convertedShipmentId}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE: DISPATCH NOTIFICATIONS (Requirement 3) */}
      {adminTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange" />
                <span>Central Dispatch Notification Feed</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time operational alerts for consignment bookings, driver assignments, weather delays, and signed digital PODs.
              </p>
            </div>
            <button
              onClick={() => markAllNotificationsAsRead('admin')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Mark All Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.filter(n => n.role === 'admin' || !n.role).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No operational alerts</p>
                <p className="text-xs text-slate-500 mt-1">All fleet telemetry and booking queues are normal.</p>
              </div>
            ) : (
              notifications.filter(n => n.role === 'admin' || !n.role).map((n) => (
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
                        setAdminTab('orders');
                        setOrderSearch(n.shipmentId);
                      }}
                      className="px-3 py-1 bg-white hover:bg-orange/10 text-orange border border-orange/30 rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      Inspect Order
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODULE 5: DRIVER & VEHICLE MANAGEMENT MODULE (Requirement 5) */}
      {adminTab === 'drivers' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    Fleet Telematics & Crew
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {drivers.length} Active Roster Drivers
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Driver & Fleet Vehicle Management</h2>
                <p className="text-xs text-slate-500">
                  Track driver assignments, vehicles, duty status, and factual delivery history. Driver photos are managed directly by drivers via their Driver Portal.
                </p>
              </div>
              <button
                onClick={() => setIsAddDriverOpen(true)}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Driver</span>
              </button>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => {
                const driverShipments = shipments.filter(s => s.driverId === driver.id || s.driverName === driver.name);
                const completedDeliveries = driverShipments.filter(s => s.status === 'Delivered').length;
                const activeShipments = driverShipments.filter(s => s.status !== 'Delivered');

                return (
                  <div key={driver.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 relative shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Header: Driver Photo (Automatic from Driver Portal, Admin Read-Only) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative shrink-0">
                          <img
                            src={driver.photo}
                            alt={driver.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                          />
                          <span
                            className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow"
                            title="Profile photo automatically updated by driver in Driver Portal"
                          >
                            ✓ Synced
                          </span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm font-sans">{driver.name}</h4>
                          <p className="text-xs text-orange-600 font-semibold">{driver.vehicleType}</p>
                          <span className="text-[10px] text-slate-500 font-mono">Plate: {driver.vehicleId || 'SG-900'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeDriver(driver.id)}
                        className="text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                        title="Remove Driver from Fleet"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Factual Assignment & Delivery History (Requirement 5) */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                          Factual Delivery History
                        </span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {driver.onTimeRate || '99.4%'} On-Time
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-bold">Total</span>
                          <span className="text-sm font-extrabold text-slate-900">{driverShipments.length}</span>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <span className="text-[10px] text-emerald-700 block font-bold">Delivered</span>
                          <span className="text-sm font-extrabold text-emerald-900">{completedDeliveries}</span>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <span className="text-[10px] text-orange-700 block font-bold">Active</span>
                          <span className="text-sm font-extrabold text-orange-900">{activeShipments.length}</span>
                        </div>
                      </div>

                      {activeShipments.length > 0 && (
                        <div className="p-2 bg-orange-50/60 rounded-lg border border-orange-200/80 text-[11px] text-orange-900 space-y-0.5">
                          <span className="font-extrabold block">En Route: #{activeShipments[0].id}</span>
                          <span className="text-[10px] text-orange-700 truncate block">
                            {activeShipments[0].origin} → {activeShipments[0].destination}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Driver Auth Credentials & Password Card */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-bold flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>Driver Password:</span>
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setVisibleDriverPasswords(prev => ({ ...prev, [driver.id]: !prev[driver.id] }))}
                            className="text-[10px] text-slate-600 hover:text-slate-900 font-extrabold flex items-center space-x-1 cursor-pointer px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 transition-colors"
                          >
                            {visibleDriverPasswords[driver.id] ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3 text-slate-500" />}
                            <span>{visibleDriverPasswords[driver.id] ? 'Hide' : 'Show'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingDriverPassword({ driverId: driver.id, driverName: driver.name, password: driver.password || 'driver123' })}
                            className="text-[10px] text-orange-700 hover:text-orange-900 font-extrabold flex items-center space-x-1 cursor-pointer px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 transition-colors"
                          >
                            <Key className="w-3 h-3 text-orange-600" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>

                      <div className="font-mono text-xs font-extrabold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                        <span className="tracking-wide">
                          {visibleDriverPasswords[driver.id] ? (driver.password || 'driver123') : '••••••••••••'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-sans font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Admin Provisioned
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 pt-1 space-y-0.5 font-medium border-t border-slate-100">
                        <div className="truncate"><strong className="text-slate-700 font-bold">Email:</strong> {driver.email || `${driver.name.toLowerCase().replace(/\s+/g, '.')}@josanlogistics.com`}</div>
                        <div><strong className="text-slate-700 font-bold">Phone:</strong> {driver.phone}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 block font-bold">Rating & SLA</span>
                        <span className="font-extrabold text-slate-900">⭐ {driver.rating || '4.95'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold font-sans">Hub Depot</span>
                        <span className="font-extrabold text-slate-900 truncate block">{driver.assignedHub || 'Changi Hub'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 font-semibold">Duty Status:</span>
                      <button
                        onClick={() => toggleDriverStatus(driver.id, driver.status === 'Available' ? 'On Delivery' : 'Available')}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer ${
                          driver.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        ● {driver.status}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 6: CUSTOMER MANAGEMENT (Requirement 6) */}
      {adminTab === 'customers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Client Directory & Protected CRM
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {customers.length} Enterprise Accounts
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Customer Management & Account Profiles</h2>
              <p className="text-xs text-slate-500">
                Authorized overview of customer profiles, linked shipments, quotations, compliance documents, and support tickets with strict enterprise data segregation.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-extrabold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Enterprise Data Protected</span>
              </span>
            </div>
          </div>

          {/* Customer Search Bar */}
          <div className="flex items-center gap-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search by customer name, company, email, or contact person..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
              />
            </div>
            <span className="text-slate-500 font-bold text-xs ml-auto">
              Showing {filteredCustomers.length} of {customers.length} Customers
            </span>
          </div>

          {/* Customers Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Customer / Enterprise</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Corporate Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Account Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Consignments</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No customer accounts found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => {
                    const custShipments = shipments.filter(s => s.sender?.toLowerCase().includes(c.name.toLowerCase()) || s.sender?.toLowerCase().includes(c.company.toLowerCase()));
                    return (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-orange-gradient text-white flex items-center justify-center font-black text-xs shrink-0">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <strong className="text-slate-900 block">{c.name}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">{c.company}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {c.contactPerson}
                        </td>
                        <td className="p-3 font-mono text-slate-600">
                          {c.email}
                        </td>
                        <td className="p-3 font-mono text-slate-600">
                          {c.phone}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            {c.tier || 'Corporate Enterprise'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ● {c.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-extrabold text-orange-600">
                          {custShipments.length} Orders
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedCustomerProfile(c)}
                            className="px-3 py-1.5 bg-[#10182D] hover:bg-slate-800 text-white rounded-xl text-[11px] font-extrabold transition-all shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <Users className="w-3 h-3 text-orange" />
                            <span>View Dossier</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MODULE 7: SUPPORT SYSTEM (Requirement 7) */}
      {adminTab === 'support' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Customer Assistance & Incident Desk
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length} Active Tickets
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Consignment Support & Incident Desk</h2>
              <p className="text-xs text-slate-500">
                Manage customer support tickets linked to live shipments. Statuses: Open, In Progress, Waiting for Customer, Resolved, Closed. Reply, reassign, and track message history.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">
                Total Tickets: <strong className="text-slate-800 font-mono">{tickets.length}</strong>
              </span>
            </div>
          </div>

          {/* Support Ticket Filters */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div className="relative">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Search Inquiries
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    placeholder="Ticket ID, shipment ID, customer..."
                    className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Ticket Status
                </label>
                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                  className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer shadow-2xs"
                >
                  <option value="All">All Statuses ({tickets.length})</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Customer">Waiting for Customer</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Priority
                </label>
                <select
                  value={ticketPriorityFilter}
                  onChange={(e) => setTicketPriorityFilter(e.target.value)}
                  className="w-full py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer shadow-2xs"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

            </div>
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Linked Shipment ID</th>
                  <th className="p-3">Customer Entity</th>
                  <th className="p-3">Subject & Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status (Quick Update)</th>
                  <th className="p-3">Assigned To</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No support tickets found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-black text-orange-600">
                        {t.id}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {t.shipmentId}
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        {t.customerName}
                      </td>
                      <td className="p-3">
                        <strong className="text-slate-900 block truncate max-w-[200px]">{t.subject}</strong>
                        <span className="text-[10px] text-slate-400">{t.category || 'Support'}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          t.priority === 'High'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : t.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        {/* Status Updater with 5 statuses */}
                        <select
                          value={t.status}
                          onChange={(e) => updateTicketStatus(t.id, e.target.value)}
                          className={`p-1.5 rounded-lg text-[11px] font-extrabold border cursor-pointer ${
                            t.status === 'Open'
                              ? 'bg-orange-50 text-orange-800 border-orange-300 font-black'
                              : t.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : t.status === 'Waiting for Customer'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : t.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Waiting for Customer">Waiting for Customer</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">
                        {t.assignedTo || 'Unassigned'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setActiveThreadTicket(t)}
                          className="px-3 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-[11px] font-extrabold transition-all shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Reply ({t.messages ? t.messages.length : 1})</span>
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


      {/* MODULE 4: WAREHOUSE MANAGEMENT MODULE */}
      {adminTab === 'warehouses' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Warehouse Inventory & Dispatch Control</h2>
                <p className="text-xs text-slate-500">Monitor storage capacity, bin parcel logs, and daily incoming/outgoing dispatch flow.</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                  {warehouses.length} Active Global Hubs
                </span>
                <button
                  onClick={() => setIsAddWarehouseOpen(true)}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Warehouse</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {warehouses.map((wh) => (
                <div key={wh.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-lg leading-snug font-sans truncate">{wh.name}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                            {wh.location} <br />
                            <span className="text-slate-400 font-normal">Manager:</span> <strong className="text-slate-700 font-bold">{wh.manager}</strong>
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2 shrink-0">
                          <span className="text-xs font-mono font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                            {wh.capacityPercentage}% Occupied
                          </span>
                          <div className="flex items-center space-x-1.5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditWarehouse(wh);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-extrabold transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Edit Warehouse Hub"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-orange-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeWarehouse(wh.id);
                              }}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-extrabold transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Delete Warehouse Hub"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Storage Capacity Gauge Progress Bar */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs text-slate-600 font-bold">
                        <span>Storage Meter</span>
                        <span className="text-orange-600 font-extrabold">{wh.activeParcels} Active Parcels</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-orange-gradient h-full rounded-full transition-all duration-500"
                          style={{ width: `${wh.capacityPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium text-right">Total Hub Area: {wh.capacitySqFt}</p>
                    </div>

                    {/* Dispatch Control Stats */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">Incoming Today</span>
                        <span className="font-extrabold text-emerald-600 text-sm flex items-center">
                          ↓ {wh.incomingToday} <span className="text-xs font-normal text-slate-500 ml-1">Parcels</span>
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">Outgoing Dispatch</span>
                        <span className="font-extrabold text-orange-600 text-sm flex items-center">
                          ↑ {wh.outgoingToday} <span className="text-xs font-normal text-slate-500 ml-1">Parcels</span>
                        </span>
                      </div>
                    </div>

                    {/* Bin Parcel Storage Logs */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Storage Bin Logs</p>
                        <button
                          onClick={() => showToast(`Triggered auto bin-sorting for ${wh.name}`)}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          Sort Bins →
                        </button>
                      </div>
                      <div className="space-y-2 text-xs">
                        {(wh.bins || []).map((bin, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 gap-2 hover:border-orange-300 transition-colors">
                            <span className="font-mono font-extrabold text-orange-600 text-xs shrink-0">{bin.binId}</span>
                            <span className="text-slate-800 font-bold text-xs flex-1 truncate">{bin.item}</span>
                            
                            {/* Interactive Status Selector Dropdown */}
                            <select
                              value={bin.status}
                              onChange={(e) => updateWarehouseBinStatus(wh.id, bin.binId, e.target.value)}
                              className="px-2.5 py-1 text-[11px] font-extrabold rounded-full border cursor-pointer focus:outline-none transition-all shadow-sm bg-white border-orange-300 text-orange-700 hover:border-orange-500 shrink-0 font-sans"
                            >
                              <option value="In Storage">📦 In Storage</option>
                              <option value="Staged for Load">🚛 Staged for Load</option>
                              <option value="Cleared Dispatch">✅ Cleared Dispatch</option>
                              <option value="In Inspection">🔍 In Inspection</option>
                              <option value="Ready for Trucking">🚚 Ready for Trucking</option>
                              <option value="Customs Hold">🛡️ Customs Hold</option>
                              <option value="Hazmat Verified">⚠️ Hazmat Verified</option>
                              <option value="Dispatched">🚀 Dispatched</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: REPORTS & ANALYTICS MODULE */}
      {adminTab === 'analytics' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Reports & Logistics Analytics</h2>
                <p className="text-xs text-slate-500">Comprehensive audit of delivery success rate, revenue trends, and SLA delay factors.</p>
              </div>
              <button
                onClick={handleDownloadPDFReport}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Export Report</span>
              </button>
            </div>

            {/* Performance KPI Cards (Delivery Success Rate, On-Time, Delay Flag) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800 uppercase">Delivery Success Rate</p>
                  <h3 className="text-2xl font-extrabold text-emerald-900 mt-1">{analyticsData?.kpis?.onTimeDeliveryRate || analyticsData?.kpis?.onTimeRate || '99.4%'}</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">SLA Guaranteed Delivery</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-orange-800 uppercase">Monthly Revenue Trend</p>
                  <h3 className="text-2xl font-extrabold text-orange-900 mt-1">{analyticsData?.kpis?.monthlyRevenue || 'S$ 1,480,000'}</h3>
                  <p className="text-[11px] text-orange-700 font-semibold mt-0.5">+18.2% Year-Over-Year</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase">Total Flagged Delays</p>
                  <h3 className="text-2xl font-extrabold text-amber-900 mt-1">1.4% Rate</h3>
                  <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Weather & Highway Traffic</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Revenue Trend Line Chart in Orange Theme */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-700">Monthly Freight Revenue Growth (SGD S$)</h3>
              <div className="h-72 w-full pt-4 min-h-[280px]">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={analyticsData?.monthlyRevenueChart || analyticsData?.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip formatter={(value) => [`S$ ${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#F26722" strokeWidth={3} dot={{ fill: '#F26722', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Delays Breakdown Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700">Delay Factor Analysis (%)</h3>
                <div className="h-60 w-full pt-2 min-h-[230px]">
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={analyticsData?.delaysBreakdown || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="reason" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#F26722" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Service Level Breakdown */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700">Freight Volume by Service Mode</h3>
                <div className="space-y-3 pt-4 text-xs">
                  {(analyticsData?.serviceBreakdown || []).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{item.service}</span>
                        <span className="font-mono text-orange-600 font-bold">{item.share}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${item.share}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ADD DRIVER MODAL */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Add New Fleet Driver</h3>
                <p className="text-xs text-slate-500">Enter complete driver profile & credential records.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDriverOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriverSubmit} className="space-y-3.5 text-xs">
              {/* Driver Profile Photo Info (Requirement 5: Driver uploads photo via Driver Portal) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3.5">
                <div className="relative shrink-0">
                  <img
                    src={defaultDriverPhoto}
                    alt="Driver Avatar Default"
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-0.5 rounded-full text-[9px] shadow">
                    ✓
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Driver Profile Picture Policy</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Driver profile image is automatically uploaded and managed by the driver directly in their Driver Portal. Admin cannot manually upload driver photos.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  value={newDriverData.name}
                  onChange={(e) => {
                    const alphaOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setNewDriverData({ ...newDriverData, name: alphaOnly });
                  }}
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold"
                  required
                />
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">Strictly letters only (Numbers & symbols blocked)</span>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Driver Email Address *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Valid Email</span>
                </label>
                <input
                  type="email"
                  value={newDriverData.email}
                  onChange={(e) => setNewDriverData({ ...newDriverData, email: e.target.value })}
                  placeholder="e.g. alex.morgan@josanlogistics.com"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold"
                  required
                />
              </div>

              {/* Set Driver Password (Admin Provisioned) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>Set Driver Password *</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = `driver${Math.floor(100 + Math.random() * 900)}`;
                      setNewDriverData(prev => ({ ...prev, password: generated }));
                      showToast(`Auto-generated driver password: ${generated}`, 'info');
                    }}
                    className="text-[10px] text-orange-600 hover:text-orange-700 font-extrabold flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showNewDriverPassword ? "text" : "password"}
                    value={newDriverData.password}
                    onChange={(e) => setNewDriverData({ ...newDriverData, password: e.target.value })}
                    placeholder="e.g. driver123"
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg focus-orange font-mono font-bold text-xs"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowNewDriverPassword(!showNewDriverPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewDriverPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-orange-600 font-semibold block mt-1">
                  🔒 Admin-Set Password: The driver will use this password to sign in to the Driver Portal.
                </span>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Phone Contact *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Digits Only</span>
                </label>
                <div className="flex items-center">
                  <select
                    value={newDriverData.countryCode || '+65'}
                    onChange={(e) => setNewDriverData({ ...newDriverData, countryCode: e.target.value })}
                    className="p-2.5 bg-slate-100 border border-slate-300 rounded-l-lg text-slate-900 font-extrabold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none"
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
                    maxLength={getPhoneLength(newDriverData.countryCode || '+65')}
                    value={newDriverData.phone}
                    onChange={(e) => {
                      const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(newDriverData.countryCode || '+65'));
                      setNewDriverData({ ...newDriverData, phone: numericOnly });
                    }}
                    placeholder={`e.g. ${'9'.repeat(getPhoneLength(newDriverData.countryCode || '+65'))}`}
                    className="w-full p-2.5 border border-slate-300 rounded-r-lg focus-orange font-mono font-bold text-xs"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  Accepts numbers only (max {getPhoneLength(newDriverData.countryCode || '+65')} digits for {newDriverData.countryCode || '+65'})
                </span>
              </div>

              {/* License Number & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driver License Number *</label>
                  <input
                    type="text"
                    value={newDriverData.licenseNumber}
                    onChange={(e) => setNewDriverData({ ...newDriverData, licenseNumber: e.target.value })}
                    placeholder="e.g. SG-CLASS4-881"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={newDriverData.dob}
                    onChange={(e) => setNewDriverData({ ...newDriverData, dob: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold text-xs"
                    required
                  />
                </div>
              </div>

              {/* Vehicle Type & Vehicle Plate ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={newDriverData.vehicleType}
                    onChange={(e) => setNewDriverData({ ...newDriverData, vehicleType: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold cursor-pointer text-xs"
                  >
                    <option value="Refrigerated Van">Refrigerated Van</option>
                    <option value="Heavy 18-Wheeler Truck">Heavy 18-Wheeler Truck</option>
                    <option value="Sprinter Express Cargo">Sprinter Express Cargo</option>
                    <option value="EV Express Cargo Van">EV Express Cargo Van</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Plate / ID *</label>
                  <input
                    type="text"
                    value={newDriverData.vehicleId}
                    onChange={(e) => setNewDriverData({ ...newDriverData, vehicleId: e.target.value })}
                    placeholder="e.g. SG-8819-EV"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold text-xs"
                    required
                  />
                </div>
              </div>

              {/* Assigned Warehouse Hub Dropdown */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Assigned Warehouse Hub *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Select Depot</span>
                </label>
                <select
                  value={newDriverData.assignedHub || (warehouses && warehouses[0]?.name) || 'Changi Air Cargo Logistics Hub'}
                  onChange={(e) => setNewDriverData({ ...newDriverData, assignedHub: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus-orange font-semibold text-xs cursor-pointer shadow-sm"
                  required
                >
                  {warehouses && warehouses.length > 0 ? (
                    warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>
                        🏬 {wh.name} ({wh.location ? wh.location.split(',')[0] : 'Singapore Hub'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Changi Air Cargo Logistics Hub">🏬 Changi Air Cargo Logistics Hub</option>
                      <option value="Tuas Mega Port Terminal">🏬 Tuas Mega Port Terminal</option>
                      <option value="Pasir Panjang Terminal Hub">🏬 Pasir Panjang Terminal Hub</option>
                      <option value="Woodlands Industrial Park Hub">🏬 Woodlands Industrial Park Hub</option>
                      <option value="Jurong Logistics Terminal Gate 4">🏬 Jurong Logistics Terminal Gate 4</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddDriverOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-orange-sm cursor-pointer"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD WAREHOUSE MODAL */}
      {isAddWarehouseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900">Add New Warehouse Hub</h3>
            <form onSubmit={handleAddWarehouseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Warehouse Hub Name *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Alphabets Only</span>
                </label>
                <input
                  type="text"
                  value={newWarehouseData.name}
                  onChange={(e) => {
                    const alphaOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setNewWarehouseData({ ...newWarehouseData, name: alphaOnly });
                  }}
                  placeholder="e.g. Woodlands Mega Logistics Depot"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hub City & Address *</label>
                <input
                  type="text"
                  value={newWarehouseData.location}
                  onChange={(e) => setNewWarehouseData({ ...newWarehouseData, location: e.target.value })}
                  placeholder="e.g. Woodlands Industrial Park E5, Singapore"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Hub Manager Name *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Alphabets Only</span>
                </label>
                <input
                  type="text"
                  value={newWarehouseData.manager}
                  onChange={(e) => {
                    const alphaOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setNewWarehouseData({ ...newWarehouseData, manager: alphaOnly });
                  }}
                  placeholder="e.g. David Vance"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Hub Area</label>
                  <input
                    type="text"
                    value={newWarehouseData.capacitySqFt}
                    onChange={(e) => setNewWarehouseData({ ...newWarehouseData, capacitySqFt: e.target.value })}
                    placeholder="e.g. 250,000 sq ft"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity Used (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newWarehouseData.capacityPercentage}
                    onChange={(e) => setNewWarehouseData({ ...newWarehouseData, capacityPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWarehouseOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-orange-sm transition-colors cursor-pointer"
                >
                  Add Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT WAREHOUSE MODAL */}
      {editingWarehouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Warehouse Hub</h3>
              <button onClick={() => setEditingWarehouse(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditWarehouseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Warehouse Hub Name *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Alphabets Only</span>
                </label>
                <input
                  type="text"
                  value={editingWarehouse.name}
                  onChange={(e) => {
                    const alphaOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setEditingWarehouse({ ...editingWarehouse, name: alphaOnly });
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hub City & Address *</label>
                <input
                  type="text"
                  value={editingWarehouse.location}
                  onChange={(e) => setEditingWarehouse({ ...editingWarehouse, location: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Hub Manager Name *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Alphabets Only</span>
                </label>
                <input
                  type="text"
                  value={editingWarehouse.manager}
                  onChange={(e) => {
                    const alphaOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setEditingWarehouse({ ...editingWarehouse, manager: alphaOnly });
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Hub Area</label>
                  <input
                    type="text"
                    value={editingWarehouse.capacitySqFt}
                    onChange={(e) => setEditingWarehouse({ ...editingWarehouse, capacitySqFt: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity Used (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingWarehouse.capacityPercentage}
                    onChange={(e) => setEditingWarehouse({ ...editingWarehouse, capacityPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWarehouse(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-orange-sm transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN DRIVER MODAL WITH DRIVER CREDENTIALS (LOCATION, LICENSE, PHONE, EMAIL) */}
      {assignModalShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-2xl w-full space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Dispatch Allocation
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Assign Driver to Shipment #{assignModalShipment.id}
                </h3>
                <p className="text-xs text-slate-500">Review driver working location, license, phone & email before assignment.</p>
              </div>
              <button
                onClick={() => setAssignModalShipment(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drivers List with Verified Credentials Grid */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {drivers.map((d) => (
                <div
                  key={d.id}
                  className="p-4 bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 rounded-2xl transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Photo + Name + Vehicle */}
                    <div className="flex items-center space-x-3">
                      <img 
                        src={d.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                        alt={d.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shrink-0" 
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{d.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            d.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            ● {d.status}
                          </span>
                        </div>
                        <p className="text-xs text-orange-600 font-semibold">{d.vehicleType} ({d.vehicleId || 'SG-8819'})</p>
                      </div>
                    </div>

                    {/* Assign Action Button */}
                    <button
                      onClick={() => {
                        assignDriver(assignModalShipment.id, d.id);
                        setAssignModalShipment(null);
                      }}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center justify-center space-x-1 cursor-pointer shrink-0 active:scale-95"
                    >
                      <span>Assign Driver →</span>
                    </button>
                  </div>

                  {/* 4 Detailed Credential Badges: Working Location, License, Phone, Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80 text-slate-700">
                    <div className="flex items-center space-x-1.5 bg-white p-2 rounded-xl border border-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="font-semibold text-slate-500">Location:</span>
                      <span className="font-bold text-slate-900 truncate">{d.assignedHub || d.workingLocation || 'Singapore Regional Hub'}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-white p-2 rounded-xl border border-slate-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-500">License:</span>
                      <span className="font-mono font-bold text-slate-900">{d.licenseNumber || 'SG-CLASS4-9910'}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-white p-2 rounded-xl border border-slate-200">
                      <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-500">Phone:</span>
                      <span className="font-mono font-bold text-slate-900">{d.phone}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-white p-2 rounded-xl border border-slate-200">
                      <Mail className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="font-semibold text-slate-500">Mail:</span>
                      <span className="font-bold text-slate-900 truncate">{d.email || `${d.name.toLowerCase().replace(/ /g, '.')}@josanlogistics.com`}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setAssignModalShipment(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DRIVER PASSWORD MODAL DIALOG */}
      {editingDriverPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Security Credential Reset
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Edit Password for {editingDriverPassword.driverName}
                </h3>
              </div>
              <button
                onClick={() => setEditingDriverPassword(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingDriverPassword.password.trim()) {
                  updateDriverPassword(editingDriverPassword.driverId, editingDriverPassword.password.trim());
                  setEditingDriverPassword(null);
                } else {
                  showToast('Password cannot be empty', 'warning');
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 space-y-1">
                <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <Key className="w-4 h-4 text-orange-500" />
                  <span>Admin Authentication Control</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                  Updating this password will immediately change the login credentials for driver <strong className="text-slate-800 font-bold">{editingDriverPassword.driverName}</strong>.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>New Driver Password *</span>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = `driver${Math.floor(100 + Math.random() * 900)}`;
                      setEditingDriverPassword(prev => ({ ...prev, password: generated }));
                    }}
                    className="text-[10px] text-orange-600 hover:text-orange-700 font-extrabold flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </label>
                <input
                  type="text"
                  value={editingDriverPassword.password}
                  onChange={(e) => setEditingDriverPassword({ ...editingDriverPassword, password: e.target.value })}
                  placeholder="Enter new driver password..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-mono font-bold text-xs"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDriverPassword(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-orange-sm transition-colors cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND MESSAGE TO COMPANY / CLIENT MODAL */}
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
                    Send Message regarding Order #{messageTargetOrder.id}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Direct dispatch note to company support / sender</p>
                </div>
              </div>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessageSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Order Reference: <strong className="font-mono text-orange-600">#{messageTargetOrder.id}</strong></span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">{messageTargetOrder.status}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Route: {messageTargetOrder.origin} → {messageTargetOrder.destination}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Message / Cancellation Reason *</label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Explain why you wish to cancel this order or send an inquiry to Josan Logistics..."
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
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: UPLOAD CONSIGNMENT DOCUMENT MODAL (Requirement 3) */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Upload Consignment Document</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Link document to live shipment ID and customer record</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadDocModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Shipment ID *</label>
                <select
                  value={uploadDocData.shipmentId}
                  onChange={(e) => setUploadDocData({ ...uploadDocData, shipmentId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-mono font-bold text-xs"
                  required
                >
                  <option value="">Select Consignment Shipment...</option>
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>{s.id} — {s.sender} ({s.origin} → {s.destination})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Classification *</label>
                <select
                  value={uploadDocData.type}
                  onChange={(e) => setUploadDocData({ 
                    ...uploadDocData, 
                    type: e.target.value,
                    docCategory: e.target.value.toLowerCase().includes('invoice') ? 'invoice' :
                                 e.target.value.toLowerCase().includes('customs') ? 'customs' :
                                 e.target.value.toLowerCase().includes('insurance') ? 'insurance' :
                                 e.target.value.toLowerCase().includes('pod') ? 'pod' : 'shipping'
                  })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-bold text-xs"
                  required
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
                <label className="block font-bold text-slate-700 mb-1">Document File Name *</label>
                <input
                  type="text"
                  value={uploadDocData.name}
                  onChange={(e) => setUploadDocData({ ...uploadDocData, name: e.target.value })}
                  placeholder="e.g. Customs_Permit_JOS8821.pdf"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus-orange font-semibold text-xs"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Document will be encrypted with SHA-256 compliance hash and made accessible to authorized shippers.</span>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
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

      {/* MODAL 2: VIEW DOCUMENT PREVIEW (Requirement 3) */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{viewingDoc.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {viewingDoc.id} • {viewingDoc.type}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Linked Shipment ID</span>
                  <span className="font-mono font-extrabold text-orange-600 text-sm">{viewingDoc.shipmentId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Authorized Shipper</span>
                  <span className="font-extrabold text-slate-900 text-sm truncate block">{viewingDoc.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">File Size & Upload Date</span>
                  <span className="font-semibold text-slate-700">{viewingDoc.fileSize} • {viewingDoc.uploadDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Compliance Verification</span>
                  <span className="text-emerald-700 font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified & Cryptographically Signed
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] leading-relaxed space-y-1">
                <p className="text-orange-400 font-bold">// OFFICIAL JOSAN LOGISTICS DOCUMENT VAULT RECORD</p>
                <p>Permit Authority: Singapore Customs & TradeNet SG</p>
                <p>Consignment Hash: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</p>
                <p>Audit Status: Passed Regulatory Highway Transport Compliance</p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([`Josan Logistics Official Document: ${viewingDoc.name}\nType: ${viewingDoc.type}\nShipment: ${viewingDoc.shipmentId}\nCustomer: ${viewingDoc.customerName}`], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = viewingDoc.name;
                  link.click();
                  URL.revokeObjectURL(url);
                  showToast(`Downloaded: ${viewingDoc.name}`, 'success');
                }}
                className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-orange-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PROTECTED CUSTOMER PROFILE DOSSIER (Requirement 6) */}
      {selectedCustomerProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-gradient text-white flex items-center justify-center font-black text-lg shadow-orange-sm">
                  {selectedCustomerProfile.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-extrabold text-slate-900">{selectedCustomerProfile.name}</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase border border-emerald-200">
                      ● Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{selectedCustomerProfile.company} • {selectedCustomerProfile.tier || 'Corporate Enterprise'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerProfile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Credentials & Protection Notice */}
            <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-blue-900 font-bold">Enterprise Data Protection (Strict Confidentiality Enforced)</span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 font-bold">UEN: 202109881K</span>
            </div>

            {/* Customer Contact Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Contact</span>
                <span className="font-extrabold text-slate-900">{selectedCustomerProfile.contactPerson}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Email</span>
                <span className="font-mono text-slate-700 truncate block">{selectedCustomerProfile.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Phone</span>
                <span className="font-mono text-slate-700">{selectedCustomerProfile.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Payment Terms</span>
                <span className="font-bold text-slate-800">{selectedCustomerProfile.paymentTerms || 'Net-30 Days'}</span>
              </div>
            </div>

            {/* Linked Shipments for Customer */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 flex items-center justify-between">
                <span>Linked Consignment Shipments</span>
                <span className="text-[10px] text-orange-600 font-mono">
                  {shipments.filter(s => s.sender?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase()) || s.sender?.toLowerCase().includes(selectedCustomerProfile.company.toLowerCase())).length} Found
                </span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {shipments.filter(s => s.sender?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase()) || s.sender?.toLowerCase().includes(selectedCustomerProfile.company.toLowerCase())).map(s => (
                  <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-extrabold text-orange-600 mr-2">{s.id}</span>
                      <span className="text-slate-700">{s.origin} → {s.destination}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Documents for Customer */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 flex items-center justify-between">
                <span>Linked Consignment Documents</span>
                <span className="text-[10px] text-orange-600 font-mono">
                  {documents.filter(d => d.customerName?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase())).length} Files
                </span>
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {documents.filter(d => d.customerName?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase())).map(d => (
                  <div key={d.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-bold text-slate-800">{d.name}</span>
                    </div>
                    <button
                      onClick={() => setViewingDoc(d)}
                      className="text-[11px] text-orange-600 font-extrabold hover:underline"
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Support Requests for Customer */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 flex items-center justify-between">
                <span>Support Incidents & Tickets</span>
                <span className="text-[10px] text-orange-600 font-mono">
                  {tickets.filter(t => t.customerName?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase())).length} Tickets
                </span>
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {tickets.filter(t => t.customerName?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase())).map(t => (
                  <div key={t.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-extrabold text-orange-600 mr-2">{t.id}</span>
                      <span className="text-slate-700">{t.subject}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-bold">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustomerProfile(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Close Customer Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SUPPORT TICKET CONVERSATION THREAD (Requirement 7) */}
      {activeThreadTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col justify-between shadow-2xl">
            
            {/* Thread Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-orange-600 text-sm">{activeThreadTicket.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    activeThreadTicket.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {activeThreadTicket.priority} Priority
                  </span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-extrabold rounded-full">
                    {activeThreadTicket.status}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeThreadTicket.subject}</h3>
                <p className="text-xs text-slate-500">
                  Consignment: <strong className="font-mono text-slate-700">#{activeThreadTicket.shipmentId}</strong> • Shipper: <strong className="text-slate-700">{activeThreadTicket.customerName}</strong>
                </p>
              </div>

              <button
                onClick={() => setActiveThreadTicket(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status & Assignee Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs my-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-500">Update Status:</span>
                <select
                  value={activeThreadTicket.status}
                  onChange={(e) => {
                    updateTicketStatus(activeThreadTicket.id, e.target.value);
                    setActiveThreadTicket({ ...activeThreadTicket, status: e.target.value });
                  }}
                  className="py-1 px-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 text-xs cursor-pointer focus-orange"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Customer">Waiting for Customer</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    updateTicketStatus(activeThreadTicket.id, 'Closed');
                    setActiveThreadTicket({ ...activeThreadTicket, status: 'Closed' });
                    showToast(`Support Ticket ${activeThreadTicket.id} marked as Closed.`, 'info');
                  }}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-lg transition-colors cursor-pointer"
                >
                  Close Ticket
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 max-h-72 my-1">
              {(activeThreadTicket.messages || []).map((msg, i) => {
                const isAdmin = msg.role === 'admin';
                return (
                  <div
                    key={msg.id || i}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-600">{msg.senderName}</span>
                      <span className={`px-1.5 py-0.2 rounded font-black uppercase text-[9px] ${
                        isAdmin ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isAdmin ? 'Admin Support' : 'Customer'}
                      </span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        isAdmin
                          ? 'bg-[#10182D] text-white rounded-tr-xs shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Reply Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!replyMessageText.trim()) return;
                replySupportTicket(activeThreadTicket.id, replyMessageText, 'admin', 'Josan Operations Control');
                const newMsg = {
                  id: `MSG-${Date.now()}`,
                  senderName: 'Josan Operations Control',
                  role: 'admin',
                  text: replyMessageText,
                  timestamp: 'Just now'
                };
                setActiveThreadTicket({
                  ...activeThreadTicket,
                  messages: [...(activeThreadTicket.messages || []), newMsg],
                  status: 'In Progress'
                });
                setReplyMessageText('');
                showToast('Reply dispatched to customer ticket successfully!', 'success');
              }}
              className="space-y-2 pt-3 border-t border-slate-100"
            >
              <label className="block text-xs font-bold text-slate-700">Reply to Customer</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={replyMessageText}
                  onChange={(e) => setReplyMessageText(e.target.value)}
                  placeholder="Type official dispatch response to customer..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-orange-sm transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
