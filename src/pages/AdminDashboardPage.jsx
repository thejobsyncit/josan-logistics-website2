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
  ExternalLink,
  Target,
  ListTodo,
  CheckSquare,
  Square,
  Tag,
  Briefcase,
  UserPlus,
  Kanban,
  LayoutGrid,
  List,
  Building2,
  Send,
  Check,
  ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { safeDownloadPdf } from '../utils/pdfDownload';

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
    leads = [],
    communications = [],
    tasks = [],
    addLead,
    updateLead,
    deleteLead,
    convertLeadToCustomer,
    addCommunication,
    deleteCommunication,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    updateCustomerTags,
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

  // ==========================================
  // CRM MODULE STATE (Leads, Comms, Tasks, 360)
  // ==========================================
  // 1. Leads & Pipeline State
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStageFilter, setLeadStageFilter] = useState('All');
  const [leadSourceFilter, setLeadSourceFilter] = useState('All');
  const [leadTagFilter, setLeadTagFilter] = useState('All');
  const [leadViewMode, setLeadViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [leadPage, setLeadPage] = useState(1);
  const [leadPageSize, setLeadPageSize] = useState(10);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website Inquiry',
    stage: 'New',
    estimatedValue: 10000,
    tags: ''
  });
  const [editingLead, setEditingLead] = useState(null);
  const [convertingLead, setConvertingLead] = useState(null);
  const [convertDetails, setConvertDetails] = useState({
    designation: 'Supply Chain Manager',
    address: 'Singapore Regional Logistics Park',
    tier: 'Standard Corporate',
    creditLimit: 'S$ 35,000',
    paymentTerms: 'Net 30 Days'
  });

  // 2. Communications Log State
  const [commSearch, setCommSearch] = useState('');
  const [commTypeFilter, setCommTypeFilter] = useState('All');
  const [commEntityFilter, setCommEntityFilter] = useState('All');
  const [isAddCommOpen, setIsAddCommOpen] = useState(false);
  const [newCommData, setNewCommData] = useState({
    targetType: 'lead',
    targetId: '',
    type: 'call',
    staffName: 'Darren Josan',
    summary: ''
  });

  // 3. Tasks & Follow-ups State
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('All');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    targetType: 'lead',
    targetId: '',
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    assignedTo: 'Darren Josan'
  });
  const [editingTask, setEditingTask] = useState(null);

  // 4. Customer 360 State
  const [customerDossierTab, setCustomerDossierTab] = useState('overview');
  const [newCustomerTagInput, setNewCustomerTagInput] = useState('');

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

  // ==========================================
  // CRM COMPUTED DATA & FILTERS
  // ==========================================
  const allLeadTags = Array.from(new Set(leads.flatMap(l => l.tags || [])));
  const filteredLeads = leads.filter(l => {
    const term = (leadSearch || '').trim().toLowerCase();
    const matchesSearch = !term ||
      (l.name && l.name.toLowerCase().includes(term)) ||
      (l.company && l.company.toLowerCase().includes(term)) ||
      (l.email && l.email.toLowerCase().includes(term)) ||
      (l.phone && l.phone.toLowerCase().includes(term));
    const matchesStage = leadStageFilter === 'All' || l.stage === leadStageFilter;
    const matchesSource = leadSourceFilter === 'All' || l.source === leadSourceFilter;
    const matchesTag = leadTagFilter === 'All' || (l.tags && l.tags.includes(leadTagFilter));
    return matchesSearch && matchesStage && matchesSource && matchesTag;
  });

  const totalLeadPages = Math.max(1, Math.ceil(filteredLeads.length / leadPageSize));
  const paginatedLeads = filteredLeads.slice((leadPage - 1) * leadPageSize, leadPage * leadPageSize);

  const filteredCommunications = communications.filter(c => {
    const term = (commSearch || '').trim().toLowerCase();
    const matchesSearch = !term ||
      (c.summary && c.summary.toLowerCase().includes(term)) ||
      (c.staffName && c.staffName.toLowerCase().includes(term));
    const matchesType = commTypeFilter === 'All' || c.type === commTypeFilter;
    let matchesEntity = true;
    if (commEntityFilter === 'Leads Only') matchesEntity = Boolean(c.leadId);
    if (commEntityFilter === 'Customers Only') matchesEntity = Boolean(c.customerId);
    return matchesSearch && matchesType && matchesEntity;
  });

  const filteredTasks = tasks.filter(t => {
    const term = (taskSearch || '').trim().toLowerCase();
    const matchesSearch = !term ||
      (t.title && t.title.toLowerCase().includes(term)) ||
      (t.assignedTo && t.assignedTo.toLowerCase().includes(term));
    const matchesStatus = taskStatusFilter === 'All' || t.status === taskStatusFilter;
    const matchesPriority = taskPriorityFilter === 'All' || t.priority === taskPriorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pipelineStages = ['New', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const totalPipelineValue = leads.filter(l => l.stage !== 'Lost').reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
  const activePipelineValue = leads.filter(l => ['New', 'Contacted', 'Proposal', 'Negotiation'].includes(l.stage)).reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
  const wonLeadsCount = leads.filter(l => l.stage === 'Won').length;
  const lostLeadsCount = leads.filter(l => l.stage === 'Lost').length;
  const winRate = (wonLeadsCount + lostLeadsCount) > 0 ? Math.round((wonLeadsCount / (wonLeadsCount + lostLeadsCount)) * 100) : 0;


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

    safeDownloadPdf(doc, `${inv.invoiceNumber}_JosanLogistics.pdf`);
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
          { id: 'crm_leads', label: `CRM Pipeline (${leads.length})`, icon: Target },
          { id: 'crm_communications', label: `CRM Comms (${communications.length})`, icon: Phone },
          { id: 'crm_tasks', label: `CRM Tasks (${tasks.filter(t => t.status === 'pending').length})`, icon: ListTodo },
          { id: 'customers', label: `Customer Accounts (${customers.length})`, icon: Users },
          { id: 'crm_analytics', label: 'CRM Analytics', icon: TrendingUp },
          { id: 'drivers', label: `Driver & Fleet (${drivers.length})`, icon: Truck },
          { id: 'support', label: `Support Tickets (${tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length})`, icon: MessageSquare },
          { id: 'quotes', label: `Quotations (${quotes.length})`, icon: DollarSign },
          { id: 'warehouses', label: `Warehouses (${warehouses.length})`, icon: Warehouse },
          { id: 'notifications', label: `Notifications (${notifications.filter(n => (n.role === 'admin' || !n.role) && !n.read).length})`, icon: Bell },
          { id: 'analytics', label: 'Reports & Audit', icon: BarChart3 },
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

      {/* ========================================== */}
      {/* CRM MODULE: LEADS & PIPELINE (adminTab === 'crm_leads') */}
      {/* ========================================== */}
      {adminTab === 'crm_leads' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  CRM Sales & Business Development
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {leads.length} Tracked Prospects
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Leads & Sales Pipeline Management</h2>
              <p className="text-xs text-slate-500">
                Track inbound inquiries, qualify freight opportunities across 6 pipeline stages, and convert won leads directly into corporate client accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Kanban / List Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLeadViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    leadViewMode === 'kanban'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5 text-orange-600" />
                  <span>Pipeline Board</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeadViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    leadViewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <List className="w-3.5 h-3.5 text-orange-600" />
                  <span>Table View</span>
                </button>
              </div>

              {/* Add Lead Button */}
              <button
                type="button"
                onClick={() => {
                  setNewLeadData({
                    name: '',
                    company: '',
                    email: '',
                    phone: '',
                    source: 'Website Inquiry',
                    stage: 'New',
                    estimatedValue: 12000,
                    tags: ''
                  });
                  setIsAddLeadOpen(true);
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Prospect Lead</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Pipeline Value</span>
              <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                S$ {totalPipelineValue.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-200/80">
              <span className="text-[10px] text-orange-700 font-bold uppercase tracking-wider block">In-Progress Value</span>
              <span className="text-base sm:text-lg font-black text-orange-600 font-mono">
                S$ {activePipelineValue.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Win / Conversion Rate</span>
              <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                {winRate}% ({wonLeadsCount} Won)
              </span>
            </div>
            <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80">
              <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">Active Leads</span>
              <span className="text-base sm:text-lg font-black text-blue-900 font-mono">
                {leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length} In Pipeline
              </span>
            </div>
          </div>

          {/* Multi-Parameter Filter Toolbar */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap gap-2.5 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search prospect, company, email, phone..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
              />
            </div>

            {/* Stage Filter */}
            <select
              value={leadStageFilter}
              onChange={(e) => setLeadStageFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
            >
              <option value="All">All Stages</option>
              {pipelineStages.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={leadSourceFilter}
              onChange={(e) => setLeadSourceFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
            >
              <option value="All">All Sources</option>
              <option value="Website Inquiry">Website Inquiry</option>
              <option value="Referral">Referral</option>
              <option value="Trade Show">Trade Show</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Inbound Tender">Inbound Tender</option>
            </select>

            {/* Tag Filter */}
            {allLeadTags.length > 0 && (
              <select
                value={leadTagFilter}
                onChange={(e) => setLeadTagFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
              >
                <option value="All">All Tags</option>
                {allLeadTags.map(tag => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
            )}

            {/* Reset */}
            {(leadSearch || leadStageFilter !== 'All' || leadSourceFilter !== 'All' || leadTagFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setLeadSearch('');
                  setLeadStageFilter('All');
                  setLeadSourceFilter('All');
                  setLeadTagFilter('All');
                }}
                className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 font-bold text-xs hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}

            <span className="text-slate-500 font-bold text-xs ml-auto">
              Showing {filteredLeads.length} of {leads.length} Leads
            </span>
          </div>

          {/* VIEW 1: KANBAN PIPELINE BOARD */}
          {leadViewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-2">
              {pipelineStages.map((stageName) => {
                const stageLeads = filteredLeads.filter(l => l.stage === stageName);
                const stageValue = stageLeads.reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);
                
                const stageTheme = 
                  stageName === 'New' ? { border: 'border-blue-200', bg: 'bg-blue-50/50', badge: 'bg-blue-100 text-blue-900' } :
                  stageName === 'Contacted' ? { border: 'border-purple-200', bg: 'bg-purple-50/50', badge: 'bg-purple-100 text-purple-900' } :
                  stageName === 'Proposal' ? { border: 'border-amber-200', bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-900' } :
                  stageName === 'Negotiation' ? { border: 'border-orange-200', bg: 'bg-orange-50/50', badge: 'bg-orange-100 text-orange-900' } :
                  stageName === 'Won' ? { border: 'border-emerald-200', bg: 'bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-900' } :
                  { border: 'border-slate-200', bg: 'bg-slate-50/50', badge: 'bg-slate-200 text-slate-700' };

                return (
                  <div 
                    key={stageName}
                    className={`rounded-2xl border ${stageTheme.border} ${stageTheme.bg} p-3 flex flex-col min-w-[240px] space-y-3`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${stageTheme.badge}`}>
                          {stageName}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 font-mono">
                          ({stageLeads.length})
                        </span>
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800 font-mono">
                        S$ {stageValue >= 1000 ? `${(stageValue / 1000).toFixed(0)}k` : stageValue}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="space-y-2.5 flex-1 min-h-[120px]">
                      {stageLeads.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-white/40">
                          No leads in {stageName}
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <div 
                            key={lead.id}
                            className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                          >
                            {/* Company & Name */}
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <h4 className="font-extrabold text-slate-900 text-xs leading-snug">
                                  {lead.company || lead.name}
                                </h4>
                                <span className="text-[11px] text-slate-500 font-medium block">
                                  {lead.name}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-orange-50 text-orange-700 border border-orange-200 shrink-0">
                                S$ {Number(lead.estimatedValue || 0).toLocaleString()}
                              </span>
                            </div>

                            {/* Source & Tags */}
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">
                                {lead.source}
                              </span>
                              {(lead.tags || []).slice(0, 2).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">
                                  #{tag}
                                </span>
                              ))}
                              {(lead.tags || []).length > 2 && (
                                <span className="text-[9px] text-slate-400 font-bold">
                                  +{lead.tags.length - 2}
                                </span>
                              )}
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-0.5 text-[10px] text-slate-500 font-mono">
                              {lead.phone && <div className="truncate">📞 {lead.phone}</div>}
                              {lead.email && <div className="truncate">✉️ {lead.email}</div>}
                            </div>

                            {/* Actions Toolbar */}
                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                              {/* Stage Mover Dropdown */}
                              <select
                                value={lead.stage}
                                onChange={(e) => updateLead(lead.id, { stage: e.target.value })}
                                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 text-[10px] focus-orange cursor-pointer"
                              >
                                {pipelineStages.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>

                              <div className="flex items-center space-x-1">
                                {/* Convert to Customer Button (if not already won/converted) */}
                                {lead.stage !== 'Won' && !lead.convertedCustomerId && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConvertingLead(lead);
                                      setConvertDetails({
                                        designation: 'Supply Chain Manager',
                                        address: 'Singapore Regional Logistics Park, SG',
                                        tier: 'Standard Corporate',
                                        creditLimit: 'S$ 35,000',
                                        paymentTerms: 'Net 30 Days'
                                      });
                                    }}
                                    title="Convert Lead to Corporate Customer"
                                    className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-md border border-emerald-200 cursor-pointer font-bold flex items-center space-x-0.5"
                                  >
                                    <UserPlus className="w-3 h-3 text-emerald-600" />
                                  </button>
                                )}

                                {/* Log Comm */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewCommData({
                                      targetType: 'lead',
                                      targetId: lead.id,
                                      type: 'call',
                                      staffName: 'Darren Josan',
                                      summary: `Call regarding freight proposal for ${lead.company}`
                                    });
                                    setIsAddCommOpen(true);
                                  }}
                                  title="Log Call / Note for this Lead"
                                  className="p-1 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
                                >
                                  <Phone className="w-3 h-3 text-slate-600" />
                                </button>

                                {/* Add Task */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewTaskData({
                                      targetType: 'lead',
                                      targetId: lead.id,
                                      title: `Follow up with ${lead.name} (${lead.company})`,
                                      dueDate: new Date().toISOString().split('T')[0],
                                      priority: 'Medium',
                                      assignedTo: 'Darren Josan'
                                    });
                                    setIsAddTaskOpen(true);
                                  }}
                                  title="Add Task for this Lead"
                                  className="p-1 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
                                >
                                  <ListTodo className="w-3 h-3 text-slate-600" />
                                </button>

                                {/* Edit Lead */}
                                <button
                                  type="button"
                                  onClick={() => setEditingLead(lead)}
                                  title="Edit Lead Details"
                                  className="p-1 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3 text-slate-600" />
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete lead "${lead.company || lead.name}"?`)) {
                                      deleteLead(lead.id);
                                    }
                                  }}
                                  title="Delete Lead"
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-md border border-rose-200 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3 text-rose-500" />
                                </button>
                              </div>
                            </div>

                            {/* Converted indicator */}
                            {lead.convertedCustomerId && (
                              <div className="pt-1 text-[9px] font-bold text-emerald-700 flex items-center space-x-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Converted → Account #{lead.convertedCustomerId}</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: LIST TABLE VIEW */}
          {leadViewMode === 'list' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Lead / Enterprise</th>
                      <th className="p-3">Contact Details</th>
                      <th className="p-3">Acquisition Source</th>
                      <th className="p-3">Pipeline Stage</th>
                      <th className="p-3">Est. Value</th>
                      <th className="p-3">Segmentation Tags</th>
                      <th className="p-3">Created</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paginatedLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          No leads found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedLeads.map((lead) => {
                        const stageBadge = 
                          lead.stage === 'New' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                          lead.stage === 'Contacted' ? 'bg-purple-100 text-purple-900 border-purple-200' :
                          lead.stage === 'Proposal' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                          lead.stage === 'Negotiation' ? 'bg-orange-100 text-orange-900 border-orange-200' :
                          lead.stage === 'Won' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
                          'bg-slate-100 text-slate-700 border-slate-200';

                        return (
                          <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-gradient text-white flex items-center justify-center font-black text-xs shrink-0">
                                  {(lead.company || lead.name).charAt(0)}
                                </div>
                                <div>
                                  <strong className="text-slate-900 block">{lead.company}</strong>
                                  <span className="text-[10px] text-slate-500">{lead.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-slate-600 font-mono">
                              <div>{lead.phone}</div>
                              <div className="text-[10px] text-slate-400">{lead.email}</div>
                            </td>
                            <td className="p-3 font-semibold text-slate-700">
                              <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">
                                {lead.source}
                              </span>
                            </td>
                            <td className="p-3">
                              <select
                                value={lead.stage}
                                onChange={(e) => updateLead(lead.id, { stage: e.target.value })}
                                className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border cursor-pointer ${stageBadge}`}
                              >
                                {pipelineStages.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-3 font-mono font-extrabold text-slate-900">
                              S$ {Number(lead.estimatedValue || 0).toLocaleString()}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {(lead.tags || []).map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 font-mono text-slate-500 text-[11px]">
                              {lead.createdDate}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                {lead.stage !== 'Won' && !lead.convertedCustomerId && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConvertingLead(lead);
                                      setConvertDetails({
                                        designation: 'Supply Chain Manager',
                                        address: 'Singapore Regional Logistics Park, SG',
                                        tier: 'Standard Corporate',
                                        creditLimit: 'S$ 35,000',
                                        paymentTerms: 'Net 30 Days'
                                      });
                                    }}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-extrabold cursor-pointer"
                                  >
                                    Convert
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setEditingLead(lead)}
                                  className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete lead "${lead.company}"?`)) {
                                      deleteLead(lead.id);
                                    }
                                  }}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
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

              {/* Table Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-bold">Rows per page:</span>
                  <select
                    value={leadPageSize}
                    onChange={(e) => {
                      setLeadPageSize(Number(e.target.value));
                      setLeadPage(1);
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus-orange cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-bold">
                    Page {leadPage} of {totalLeadPages}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      disabled={leadPage <= 1}
                      onClick={() => setLeadPage(prev => Math.max(1, prev - 1))}
                      className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={leadPage >= totalLeadPages}
                      onClick={() => setLeadPage(prev => Math.min(totalLeadPages, prev + 1))}
                      className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* CRM MODULE: COMMUNICATIONS LOG (adminTab === 'crm_communications') */}
      {/* ========================================== */}
      {adminTab === 'crm_communications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Client Engagement & History
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {communications.length} Total Logged Interactions
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Communications & Interaction Log</h2>
              <p className="text-xs text-slate-500">
                Audit trail of phone inquiries, meetings, rate emails, and internal notes logged for leads and active corporate accounts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setNewCommData({
                  targetType: 'lead',
                  targetId: leads[0]?.id || '',
                  type: 'call',
                  staffName: 'Darren Josan',
                  summary: ''
                });
                setIsAddCommOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Interaction</span>
            </button>
          </div>

          {/* Filter Toolbar */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap gap-2.5 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={commSearch}
                onChange={(e) => setCommSearch(e.target.value)}
                placeholder="Search notes, summary, staff member..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
              />
            </div>

            <select
              value={commTypeFilter}
              onChange={(e) => setCommTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
            >
              <option value="All">All Interaction Types</option>
              <option value="call">📞 Phone Call</option>
              <option value="email">✉️ Email</option>
              <option value="meeting">👥 Meeting</option>
              <option value="note">📝 Internal Note</option>
            </select>

            <select
              value={commEntityFilter}
              onChange={(e) => setCommEntityFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
            >
              <option value="All">All Targets (Leads & Clients)</option>
              <option value="Leads Only">Prospect Leads Only</option>
              <option value="Customers Only">Corporate Accounts Only</option>
            </select>

            <span className="text-slate-500 font-bold text-xs ml-auto">
              Showing {filteredCommunications.length} of {communications.length} Entries
            </span>
          </div>

          {/* Communications Feed */}
          <div className="space-y-3">
            {filteredCommunications.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No communications found matching the filters.
              </div>
            ) : (
              filteredCommunications.map((comm) => {
                const targetLead = comm.leadId ? leads.find(l => l.id === comm.leadId) : null;
                const targetCust = comm.customerId ? customers.find(c => c.id === comm.customerId) : null;
                const targetName = targetLead ? `${targetLead.company || targetLead.name} (Lead #${targetLead.id})` :
                                   targetCust ? `${targetCust.name} (Client #${targetCust.id})` :
                                   'General Engagement';

                const typeConfig = 
                  comm.type === 'call' ? { label: 'Phone Call', icon: Phone, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' } :
                  comm.type === 'email' ? { label: 'Email', icon: Mail, color: 'bg-blue-50 text-blue-800 border-blue-200' } :
                  comm.type === 'meeting' ? { label: 'Meeting', icon: Users, color: 'bg-purple-50 text-purple-800 border-purple-200' } :
                  { label: 'Internal Note', icon: FileText, color: 'bg-amber-50 text-amber-800 border-amber-200' };

                const TypeIcon = typeConfig.icon;

                return (
                  <div 
                    key={comm.id}
                    className="p-4 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 rounded-xl border ${typeConfig.color} shrink-0 mt-0.5`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${typeConfig.color}`}>
                            {typeConfig.label}
                          </span>
                          <strong className="text-slate-900 font-extrabold">
                            {targetName}
                          </strong>
                          <span className="text-slate-400 font-mono text-[11px]">
                            • By {comm.staffName}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium text-xs leading-relaxed">
                          {comm.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <span className="text-slate-400 font-mono text-[11px]">
                        {comm.timestamp}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this communication record?')) {
                            deleteCommunication(comm.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* CRM MODULE: TASKS & FOLLOW-UPS (adminTab === 'crm_tasks') */}
      {/* ========================================== */}
      {adminTab === 'crm_tasks' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Sales Execution & CRM Follow-ups
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {tasks.filter(t => t.status === 'pending').length} Pending Tasks
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Tasks & Follow-up Desk</h2>
              <p className="text-xs text-slate-500">
                Actionable sales tasks, scheduled client check-ins, contract reviews, and rate quote follow-ups.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setNewTaskData({
                  targetType: 'lead',
                  targetId: leads[0]?.id || '',
                  title: '',
                  dueDate: new Date().toISOString().split('T')[0],
                  priority: 'Medium',
                  assignedTo: 'Darren Josan'
                });
                setIsAddTaskOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create CRM Task</span>
            </button>
          </div>

          {/* Filter Toolbar */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap gap-2.5 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search task title, staff assignee..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
              />
            </div>

            <select
              value={taskStatusFilter}
              onChange={(e) => setTaskStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Only</option>
              <option value="done">Completed Only</option>
            </select>

            <select
              value={taskPriorityFilter}
              onChange={(e) => setTaskPriorityFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <span className="text-slate-500 font-bold text-xs ml-auto">
              Showing {filteredTasks.length} of {tasks.length} Tasks
            </span>
          </div>

          {/* Tasks Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-10">Status</th>
                  <th className="p-3">Task Title & Details</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Assigned Staff</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No follow-up tasks found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const targetLead = task.leadId ? leads.find(l => l.id === task.leadId) : null;
                    const targetCust = task.customerId ? customers.find(c => c.id === task.customerId) : null;
                    const targetLabel = targetLead ? `${targetLead.company || targetLead.name} (Lead)` :
                                        targetCust ? `${targetCust.name} (Customer)` : 'General Task';

                    const isDone = task.status === 'done';
                    const isOverdue = !isDone && task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString());

                    const priorityBadge = 
                      task.priority === 'High' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      'bg-slate-100 text-slate-700 border-slate-200';

                    return (
                      <tr key={task.id} className={`hover:bg-slate-50 transition-colors ${isDone ? 'bg-slate-50/50' : ''}`}>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleTaskStatus(task.id)}
                            className="text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                            title={isDone ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {isDone ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </td>
                        <td className="p-3">
                          <span className={`font-extrabold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                            {targetLabel}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${priorityBadge}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <div className="flex items-center space-x-1.5">
                            <span className={isOverdue ? 'text-rose-600 font-extrabold' : 'text-slate-700 font-semibold'}>
                              {task.dueDate}
                            </span>
                            {isOverdue && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase border border-rose-200">
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {task.assignedTo}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingTask(task)}
                              className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                              title="Edit Task"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete task "${task.title}"?`)) {
                                  deleteTask(task.id);
                                }
                              }}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                              title="Delete Task"
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
      )}

      {/* ========================================== */}
      {/* CRM MODULE: ANALYTICS & REPORTS (adminTab === 'crm_analytics') */}
      {/* ========================================== */}
      {adminTab === 'crm_analytics' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  CRM Business Intelligence
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  Live Sales Metrics
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">CRM Analytics & Pipeline Intelligence</h2>
              <p className="text-xs text-slate-500">
                Visual analysis of pipeline velocity, stage distribution, lead acquisition channels, and sales team task completion.
              </p>
            </div>
          </div>

          {/* Analytics KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Pipeline Value</span>
              <span className="text-lg font-black text-slate-900 font-mono block mt-1">
                S$ {totalPipelineValue.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">All active & won deals</span>
            </div>
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80">
              <span className="text-[10px] text-orange-700 font-bold uppercase block">Active Pipeline (In Progress)</span>
              <span className="text-lg font-black text-orange-600 font-mono block mt-1">
                S$ {activePipelineValue.toLocaleString()}
              </span>
              <span className="text-[10px] text-orange-600 font-medium">New, Contacted, Proposal, Neg.</span>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Win Rate %</span>
              <span className="text-lg font-black text-emerald-700 font-mono block mt-1">
                {winRate}%
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">{wonLeadsCount} Won vs {lostLeadsCount} Lost</span>
            </div>
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80">
              <span className="text-[10px] text-blue-800 font-bold uppercase block">Pending Tasks</span>
              <span className="text-lg font-black text-blue-900 font-mono block mt-1">
                {tasks.filter(t => t.status === 'pending').length} Action Items
              </span>
              <span className="text-[10px] text-blue-600 font-medium">{tasks.filter(t => t.status === 'done').length} Completed</span>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 col-span-2 lg:col-span-1">
              <span className="text-[10px] text-purple-800 font-bold uppercase block">Interactions Logged</span>
              <span className="text-lg font-black text-purple-900 font-mono block mt-1">
                {communications.length} Logs
              </span>
              <span className="text-[10px] text-purple-600 font-medium">Calls, emails & meetings</span>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: Pipeline Value by Stage */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Pipeline Value by Stage (SGD)</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Distribution of estimated freight deal value</p>
                </div>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                  Real-Time
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pipelineStages.map(stage => ({
                      stage,
                      value: leads.filter(l => l.stage === stage).reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0)
                    }))}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip 
                      formatter={(val) => [`S$ ${Number(val).toLocaleString()}`, 'Estimated Value']}
                      contentStyle={{ backgroundColor: '#10182D', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" fill="#FF6B00" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Lead Acquisition Sources */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Lead Inflow by Source</h3>
                <p className="text-[11px] text-slate-500 font-medium">Customer acquisition channels</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={['Website Inquiry', 'Referral', 'Trade Show', 'Cold Call', 'Inbound Tender'].map(src => ({
                        name: src,
                        value: leads.filter(l => l.source === src).length
                      })).filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {['Website Inquiry', 'Referral', 'Trade Show', 'Cold Call', 'Inbound Tender'].map((entry, index) => {
                        const colors = ['#FF6B00', '#2563EB', '#10B981', '#8B5CF6', '#F59E0B'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#10182D', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] justify-center">
                {[
                  { name: 'Website Inquiry', color: '#FF6B00' },
                  { name: 'Referral', color: '#2563EB' },
                  { name: 'Trade Show', color: '#10B981' },
                  { name: 'Cold Call', color: '#8B5CF6' },
                  { name: 'Inbound Tender', color: '#F59E0B' }
                ].map((item) => (
                  <span key={item.name} className="flex items-center space-x-1 font-bold text-slate-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* High-Value Opportunities Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">Top High-Value Deals in Pipeline</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Company / Lead</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Current Stage</th>
                    <th className="p-3">Estimated Value</th>
                    <th className="p-3">Tags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[...leads].sort((a, b) => (Number(b.estimatedValue) || 0) - (Number(a.estimatedValue) || 0)).slice(0, 5).map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <strong className="text-slate-900 block">{lead.company}</strong>
                        <span className="text-[10px] text-slate-500">{lead.name}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {lead.email}
                      </td>
                      <td className="p-3 text-slate-700 font-semibold">
                        {lead.source}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-900 border border-orange-200">
                          {lead.stage}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-extrabold text-orange-600">
                        S$ {Number(lead.estimatedValue || 0).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {(lead.tags || []).map(t => (
                            <span key={t} className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* MODAL 3: ENHANCED CUSTOMER 360° PROFILE DOSSIER */}
      {selectedCustomerProfile && (() => {
        const custComms = communications.filter(c => c.customerId === selectedCustomerProfile.id);
        const custTasks = tasks.filter(t => t.customerId === selectedCustomerProfile.id);
        const custShipments = shipments.filter(s => 
          s.sender?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase()) || 
          s.sender?.toLowerCase().includes(selectedCustomerProfile.company.toLowerCase())
        );
        const custDocs = documents.filter(d => 
          d.customerName?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase())
        );
        const custTickets = tickets.filter(t => 
          t.customerName?.toLowerCase().includes(selectedCustomerProfile.name.toLowerCase())
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
              
              {/* 360 Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-orange-gradient text-white flex items-center justify-center font-black text-xl shadow-orange-sm shrink-0">
                    {selectedCustomerProfile.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-slate-900">{selectedCustomerProfile.name}</h3>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase border border-emerald-200">
                        ● Active Client
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedCustomerProfile.company} • <span className="font-mono text-orange-600 font-bold">{selectedCustomerProfile.id}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomerProfile(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tags & Segmentation Management */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-orange-600" />
                    <span>Account Segmentation & Tags</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(selectedCustomerProfile.tags || []).length} Assigned
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  {(selectedCustomerProfile.tags || []).map(tag => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center space-x-1 shadow-2xs"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (selectedCustomerProfile.tags || []).filter(t => t !== tag);
                          updateCustomerTags(selectedCustomerProfile.id, updated);
                          setSelectedCustomerProfile({ ...selectedCustomerProfile, tags: updated });
                        }}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer ml-1"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Add Tag Inline Form */}
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={newCustomerTagInput}
                      onChange={(e) => setNewCustomerTagInput(e.target.value)}
                      placeholder="Add tag (e.g. Cold Chain)..."
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus-orange w-40"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = newCustomerTagInput.trim();
                          if (val && !(selectedCustomerProfile.tags || []).includes(val)) {
                            const updated = [...(selectedCustomerProfile.tags || []), val];
                            updateCustomerTags(selectedCustomerProfile.id, updated);
                            setSelectedCustomerProfile({ ...selectedCustomerProfile, tags: updated });
                            setNewCustomerTagInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newCustomerTagInput.trim();
                        if (val && !(selectedCustomerProfile.tags || []).includes(val)) {
                          const updated = [...(selectedCustomerProfile.tags || []), val];
                          updateCustomerTags(selectedCustomerProfile.id, updated);
                          setSelectedCustomerProfile({ ...selectedCustomerProfile, tags: updated });
                          setNewCustomerTagInput('');
                        }
                      }}
                      className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer 360 Sub-Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2 text-xs font-bold">
                {[
                  { id: 'overview', label: 'Overview & Profile', count: null },
                  { id: 'comms', label: 'Communications Timeline', count: custComms.length },
                  { id: 'tasks', label: 'Tasks & Actions', count: custTasks.filter(t => t.status === 'pending').length },
                  { id: 'shipments', label: 'Shipments History', count: custShipments.length },
                  { id: 'documents', label: 'Documents & Billing', count: custDocs.length },
                  { id: 'tickets', label: 'Support Tickets', count: custTickets.length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCustomerDossierTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      customerDossierTab === tab.id
                        ? 'bg-[#10182D] text-white font-extrabold shadow-sm'
                        : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                        customerDossierTab === tab.id ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {customerDossierTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Account Contact</span>
                      <span className="font-extrabold text-slate-900">{selectedCustomerProfile.contactPerson}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Corporate Email</span>
                      <span className="font-mono text-slate-700 truncate block">{selectedCustomerProfile.email}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Telephone</span>
                      <span className="font-mono text-slate-700">{selectedCustomerProfile.phone}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Credit Terms</span>
                      <span className="font-bold text-slate-800">{selectedCustomerProfile.paymentTerms || 'Net-30 Days'}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Registered Corporate Address</span>
                    <p className="font-medium text-slate-800 text-xs">
                      {selectedCustomerProfile.address || 'Singapore Regional Logistics Park, SG'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200/80">
                      <span className="text-[10px] text-orange-700 font-bold uppercase block">Total Freight Orders</span>
                      <span className="text-base font-black text-orange-600 font-mono">
                        {custShipments.length} Orders
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Credit Limit</span>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        {selectedCustomerProfile.creditLimit || 'S$ 50,000'}
                      </span>
                    </div>
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                      <span className="text-[10px] text-blue-800 font-bold uppercase block">Client Tier</span>
                      <span className="text-xs font-black text-blue-900 block mt-1">
                        {selectedCustomerProfile.tier || 'Enterprise Key Account'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMMUNICATIONS */}
              {customerDossierTab === 'comms' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900">Logged Interactions for {selectedCustomerProfile.name}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCommData({
                          targetType: 'customer',
                          targetId: selectedCustomerProfile.id,
                          type: 'call',
                          staffName: 'Darren Josan',
                          summary: `Account review call with ${selectedCustomerProfile.contactPerson}`
                        });
                        setIsAddCommOpen(true);
                      }}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Interaction</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {custComms.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No communications logged specifically for this customer yet.
                      </div>
                    ) : (
                      custComms.map(c => (
                        <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900 uppercase">
                              {c.type === 'call' ? '📞 Phone Call' : c.type === 'email' ? '✉️ Email' : c.type === 'meeting' ? '👥 Meeting' : '📝 Note'}
                            </span>
                            <span className="font-mono text-slate-400">{c.timestamp}</span>
                          </div>
                          <p className="text-slate-700 text-xs font-medium">{c.summary}</p>
                          <span className="text-[10px] text-slate-400 block font-mono">• Logged by {c.staffName}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TASKS */}
              {customerDossierTab === 'tasks' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900">Action Items & Scheduled Follow-ups</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTaskData({
                          targetType: 'customer',
                          targetId: selectedCustomerProfile.id,
                          title: `Follow up with ${selectedCustomerProfile.name}`,
                          dueDate: new Date().toISOString().split('T')[0],
                          priority: 'Medium',
                          assignedTo: 'Darren Josan'
                        });
                        setIsAddTaskOpen(true);
                      }}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {custTasks.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No tasks pending for this account.
                      </div>
                    ) : (
                      custTasks.map(t => (
                        <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-2.5">
                            <button
                              type="button"
                              onClick={() => toggleTaskStatus(t.id)}
                              className="text-slate-400 hover:text-orange-600 cursor-pointer"
                            >
                              {t.status === 'done' ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <div>
                              <span className={`font-bold block ${t.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                {t.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Due: {t.dueDate} • Assigned to: {t.assignedTo}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: SHIPMENTS */}
              {customerDossierTab === 'shipments' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-extrabold text-slate-900">Linked Consignments ({custShipments.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {custShipments.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No shipment records associated with this client.
                      </div>
                    ) : (
                      custShipments.map(s => (
                        <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-black text-orange-600 mr-2">{s.id}</span>
                            <span className="font-medium text-slate-800">{s.origin} → {s.destination}</span>
                          </div>
                          <span className="px-2.5 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-700">
                            {s.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: DOCUMENTS */}
              {customerDossierTab === 'documents' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-extrabold text-slate-900">Archived Documents ({custDocs.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {custDocs.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No documents stored for this account.
                      </div>
                    ) : (
                      custDocs.map(d => (
                        <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span className="font-bold text-slate-800">{d.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setViewingDoc(d)}
                            className="text-orange-600 font-extrabold text-xs hover:underline cursor-pointer"
                          >
                            View →
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: SUPPORT TICKETS */}
              {customerDossierTab === 'tickets' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-extrabold text-slate-900">Support Incidents ({custTickets.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {custTickets.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No support tickets opened by this client.
                      </div>
                    ) : (
                      custTickets.map(t => (
                        <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-black text-orange-600 mr-2">{t.id}</span>
                            <span className="font-medium text-slate-800">{t.subject}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-[10px] font-bold">
                            {t.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCustomerProfile(null)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer text-xs"
                >
                  Close Customer 360° Dossier
                </button>
              </div>

            </div>
          </div>
        );
      })()}

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

      {/* ========================================== */}
      {/* CRM MODAL 1: ADD PROSPECT LEAD */}
      {/* ========================================== */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-gradient text-white flex items-center justify-center font-black">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Add New Prospect Lead</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Capture freight lead into the CRM pipeline</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLeadOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLeadData.company.trim() || !newLeadData.name.trim()) {
                  showToast('Please enter both company name and contact person.', 'warning');
                  return;
                }
                addLead(newLeadData);
                setIsAddLeadOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company / Enterprise Name *</label>
                  <input
                    type="text"
                    value={newLeadData.company}
                    onChange={(e) => setNewLeadData({ ...newLeadData, company: e.target.value })}
                    placeholder="e.g. Apex Cold Chain Pte Ltd"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    placeholder="e.g. Tan Boon Kiat"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    placeholder="e.g. logistics@company.sg"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    placeholder="e.g. +65 6890 1234"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Acquisition Source</label>
                  <select
                    value={newLeadData.source}
                    onChange={(e) => setNewLeadData({ ...newLeadData, source: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus-orange text-xs cursor-pointer"
                  >
                    <option value="Website Inquiry">Website Inquiry</option>
                    <option value="Referral">Referral</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Inbound Tender">Inbound Tender</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Stage</label>
                  <select
                    value={newLeadData.stage}
                    onChange={(e) => setNewLeadData({ ...newLeadData, stage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus-orange text-xs cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Est. Deal Value (S$)</label>
                  <input
                    type="number"
                    value={newLeadData.estimatedValue}
                    onChange={(e) => setNewLeadData({ ...newLeadData, estimatedValue: Number(e.target.value) })}
                    placeholder="10000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tags / Segmentation (Comma Separated)</label>
                <input
                  type="text"
                  value={newLeadData.tags}
                  onChange={(e) => setNewLeadData({ ...newLeadData, tags: e.target.value })}
                  placeholder="e.g. Cold Chain, Reefer, High Value, Tuas"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
                >
                  Save Prospect Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* CRM MODAL 2: EDIT PROSPECT LEAD */}
      {/* ========================================== */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-gradient text-white flex items-center justify-center font-black">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Lead #{editingLead.id}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Update prospect qualification & stage</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateLead(editingLead.id, editingLead);
                setEditingLead(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingLead.name}
                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Stage</label>
                  <select
                    value={editingLead.stage}
                    onChange={(e) => setEditingLead({ ...editingLead, stage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus-orange text-xs cursor-pointer"
                  >
                    {pipelineStages.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Source</label>
                  <select
                    value={editingLead.source}
                    onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus-orange text-xs cursor-pointer"
                  >
                    <option value="Website Inquiry">Website Inquiry</option>
                    <option value="Referral">Referral</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Inbound Tender">Inbound Tender</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Est. Value (S$)</label>
                  <input
                    type="number"
                    value={editingLead.estimatedValue}
                    onChange={(e) => setEditingLead({ ...editingLead, estimatedValue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingLead.tags) ? editingLead.tags.join(', ') : editingLead.tags}
                  onChange={(e) => setEditingLead({ ...editingLead, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
                >
                  Update Lead Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* CRM MODAL 3: CONVERT LEAD TO CORPORATE CUSTOMER */}
      {/* ========================================== */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-gradient text-white flex items-center justify-center font-black bg-emerald-600">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Convert Lead to Corporate Customer</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Provision corporate client account & close deal as Won</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1 text-xs">
              <span className="font-extrabold text-emerald-900 block">Prospect Selected: {convertingLead.company}</span>
              <span className="text-emerald-700 block">Contact: {convertingLead.name} ({convertingLead.email} • {convertingLead.phone})</span>
              <span className="text-emerald-800 font-mono font-bold block">Deal Value: S$ {Number(convertingLead.estimatedValue || 0).toLocaleString()}</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                convertLeadToCustomer(convertingLead.id, convertDetails);
                setConvertingLead(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Person Designation</label>
                <input
                  type="text"
                  value={convertDetails.designation}
                  onChange={(e) => setConvertDetails({ ...convertDetails, designation: e.target.value })}
                  placeholder="e.g. Supply Chain & Logistics Director"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Corporate Billing / Delivery Address</label>
                <input
                  type="text"
                  value={convertDetails.address}
                  onChange={(e) => setConvertDetails({ ...convertDetails, address: e.target.value })}
                  placeholder="e.g. 10 Pasir Panjang Road, Mapletree Business City, Singapore"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Tier</label>
                  <select
                    value={convertDetails.tier}
                    onChange={(e) => setConvertDetails({ ...convertDetails, tier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus-orange text-xs cursor-pointer"
                  >
                    <option value="Enterprise Key Account">Enterprise Key Account</option>
                    <option value="GDP Certified Medical Shipper">GDP Medical Shipper</option>
                    <option value="Aviation Express Client">Aviation Express</option>
                    <option value="Standard Corporate">Standard Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Credit Limit</label>
                  <input
                    type="text"
                    value={convertDetails.creditLimit}
                    onChange={(e) => setConvertDetails({ ...convertDetails, creditLimit: e.target.value })}
                    placeholder="S$ 50,000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Terms</label>
                  <select
                    value={convertDetails.paymentTerms}
                    onChange={(e) => setConvertDetails({ ...convertDetails, paymentTerms: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus-orange text-xs cursor-pointer"
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Prepaid / Corporate Account">Prepaid</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Conversion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* CRM MODAL 4: LOG INTERACTION / COMMUNICATION */}
      {/* ========================================== */}
      {isAddCommOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-gradient text-white flex items-center justify-center font-black">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Log CRM Interaction</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Record a call, meeting, email, or internal note</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCommOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCommData.summary.trim()) {
                  showToast('Please enter an interaction summary.', 'warning');
                  return;
                }
                addCommunication({
                  leadId: newCommData.targetType === 'lead' ? newCommData.targetId : null,
                  customerId: newCommData.targetType === 'customer' ? newCommData.targetId : null,
                  type: newCommData.type,
                  staffName: newCommData.staffName,
                  summary: newCommData.summary
                });
                setIsAddCommOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Classification</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setNewCommData({ ...newCommData, targetType: 'lead', targetId: leads[0]?.id || '' })}
                      className={`w-1/2 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                        newCommData.targetType === 'lead' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Prospect Lead
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCommData({ ...newCommData, targetType: 'customer', targetId: customers[0]?.id || '' })}
                      className={`w-1/2 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                        newCommData.targetType === 'customer' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Client Account
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Select {newCommData.targetType === 'lead' ? 'Lead' : 'Customer'} *
                  </label>
                  <select
                    value={newCommData.targetId}
                    onChange={(e) => setNewCommData({ ...newCommData, targetId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
                    required
                  >
                    {newCommData.targetType === 'lead' ? (
                      leads.map(l => (
                        <option key={l.id} value={l.id}>{l.company || l.name} (#{l.id})</option>
                      ))
                    ) : (
                      customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (#{c.id})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Interaction Type</label>
                  <select
                    value={newCommData.type}
                    onChange={(e) => setNewCommData({ ...newCommData, type: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
                  >
                    <option value="call">📞 Phone Call</option>
                    <option value="email">✉️ Email</option>
                    <option value="meeting">👥 Meeting</option>
                    <option value="note">📝 Internal Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Staff Member</label>
                  <input
                    type="text"
                    value={newCommData.staffName}
                    onChange={(e) => setNewCommData({ ...newCommData, staffName: e.target.value })}
                    placeholder="e.g. Darren Josan"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Summary / Meeting Minutes / Notes *</label>
                <textarea
                  rows={4}
                  value={newCommData.summary}
                  onChange={(e) => setNewCommData({ ...newCommData, summary: e.target.value })}
                  placeholder="Summarize the conversation, commitments made, rate feedback, or operational instructions..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus-orange text-xs"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCommOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* CRM MODAL 5: CREATE / EDIT CRM TASK */}
      {/* ========================================== */}
      {(isAddTaskOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-gradient text-white flex items-center justify-center font-black">
                  <ListTodo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingTask ? `Edit Task #${editingTask.id}` : 'Create CRM Action Task'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Schedule follow-up, proposal deadline, or contract review</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddTaskOpen(false);
                  setEditingTask(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTask) {
                  updateTask(editingTask.id, editingTask);
                  setEditingTask(null);
                } else {
                  if (!newTaskData.title.trim()) {
                    showToast('Please enter a task title.', 'warning');
                    return;
                  }
                  addTask({
                    leadId: newTaskData.targetType === 'lead' ? newTaskData.targetId : null,
                    customerId: newTaskData.targetType === 'customer' ? newTaskData.targetId : null,
                    title: newTaskData.title,
                    dueDate: newTaskData.dueDate,
                    priority: newTaskData.priority,
                    assignedTo: newTaskData.assignedTo
                  });
                  setIsAddTaskOpen(false);
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  value={editingTask ? editingTask.title : newTaskData.title}
                  onChange={(e) => {
                    if (editingTask) setEditingTask({ ...editingTask, title: e.target.value });
                    else setNewTaskData({ ...newTaskData, title: e.target.value });
                  }}
                  placeholder="e.g. Dispatch customized reefer rate card for Q4 peak"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                  required
                />
              </div>

              {!editingTask && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Target Entity Type</label>
                    <select
                      value={newTaskData.targetType}
                      onChange={(e) => setNewTaskData({ ...newTaskData, targetType: e.target.value, targetId: e.target.value === 'lead' ? (leads[0]?.id || '') : (customers[0]?.id || '') })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus-orange text-xs cursor-pointer"
                    >
                      <option value="lead">Prospect Lead</option>
                      <option value="customer">Corporate Client</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Select Target *</label>
                    <select
                      value={newTaskData.targetId}
                      onChange={(e) => setNewTaskData({ ...newTaskData, targetId: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
                      required
                    >
                      {newTaskData.targetType === 'lead' ? (
                        leads.map(l => (
                          <option key={l.id} value={l.id}>{l.company || l.name} (#{l.id})</option>
                        ))
                      ) : (
                        customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} (#{c.id})</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={editingTask ? editingTask.dueDate : newTaskData.dueDate}
                    onChange={(e) => {
                      if (editingTask) setEditingTask({ ...editingTask, dueDate: e.target.value });
                      else setNewTaskData({ ...newTaskData, dueDate: e.target.value });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 text-xs focus-orange cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={editingTask ? editingTask.priority : newTaskData.priority}
                    onChange={(e) => {
                      if (editingTask) setEditingTask({ ...editingTask, priority: e.target.value });
                      else setNewTaskData({ ...newTaskData, priority: e.target.value });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={editingTask ? editingTask.assignedTo : newTaskData.assignedTo}
                    onChange={(e) => {
                      if (editingTask) setEditingTask({ ...editingTask, assignedTo: e.target.value });
                      else setNewTaskData({ ...newTaskData, assignedTo: e.target.value });
                    }}
                    placeholder="e.g. Darren Josan"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddTaskOpen(false);
                    setEditingTask(null);
                  }}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
