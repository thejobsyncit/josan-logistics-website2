import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Cell,
  AreaChart,
  Area 
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
  TrendingDown,
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
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Settings,
  ChevronDown,
  Globe,
  LogOut
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { safeDownloadPdf } from '../utils/pdfDownload';

export const AdminDashboardPage = ({ setActiveTab: setParentActiveTab }) => {
  const { 
    shipments, 
    drivers, 
    warehouses, 
    analyticsData, 
    isSocketConnected,
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
    showToast,
    logoutUser,
    currentUser
  } = useLogistics();

  const [adminTab, setAdminTab] = useState('overview');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [orderFilterTab, setOrderFilterTab] = useState('all');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminProfileDropdownOpen, setAdminProfileDropdownOpen] = useState(false);
  const [selectedFleetTruckId, setSelectedFleetTruckId] = useState('JL-102');

  const fleetVehiclesList = [
    {
      id: 'JL-102',
      name: 'Truck #JL-102',
      type: 'Refrigerated 24ft Hauler',
      driver: 'Raj Kumar',
      currentLocation: 'AYE Expressway (near Jurong East)',
      destination: 'Tuas Megaport Hub #4',
      eta: 'Today, 2:15 PM',
      status: 'On Route',
      speed: '58 km/h',
      cargo: 'Pharmaceuticals & Chilled Goods',
      truckX: 105,
      truckY: 50
    },
    {
      id: 'SG-8819',
      name: 'Truck #SG-8819',
      type: 'Heavy 40ft Flatbed Hauler',
      driver: 'Muhammad Fazli',
      currentLocation: 'SLE Expressway (Woodlands Corridor)',
      destination: 'Changi Air Cargo Logistics Hub',
      eta: 'Today, 3:45 PM',
      status: 'On Route',
      speed: '62 km/h',
      cargo: 'Industrial Heavy Machinery',
      truckX: 140,
      truckY: 38
    },
    {
      id: 'JL-204',
      name: 'Truck #JL-204',
      type: 'Express Box Van (14ft)',
      driver: 'David Tan',
      currentLocation: 'Pasir Panjang Terminal Depot',
      destination: 'Standby / Staging Hub',
      eta: 'Standby',
      status: 'Idle',
      speed: '0 km/h',
      cargo: 'Available for Immediate Dispatch',
      truckX: 75,
      truckY: 82
    }
  ];

  const activeFleetVehicle = fleetVehiclesList.find(v => v.id === selectedFleetTruckId) || fleetVehiclesList[0];

  // PHASE: Dedicated Fleet Road Asset Management State
  const [fleetVehicles, setFleetVehicles] = useState([
    {
      id: 'SG-8819',
      plateNumber: 'SG-8819',
      model: 'Scania R500 (Heavy 40ft Flatbed)',
      category: 'Heavy Haulage',
      driver: 'Muhammad Fazli',
      driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'On Route',
      speed: '62 km/h',
      fuel: 78,
      fuelType: 'Diesel',
      capacity: '28,000 kg',
      currentLoad: '22,400 kg (80%)',
      currentLocation: 'SLE Expressway (Woodlands Corridor)',
      destination: 'Changi Air Cargo Logistics Hub',
      eta: 'Today, 3:45 PM',
      hub: 'Woodlands Depot',
      lastService: '12 Aug 2026',
      nextInspection: '15 Dec 2026',
      tirePressure: '115 PSI (Optimal)',
      engineHealth: '98% (Good)',
      telematicsStatus: 'Active'
    },
    {
      id: 'JL-102',
      plateNumber: 'JL-102',
      model: 'Isuzu Forward 24ft Reefer Box',
      category: 'Cold Chain Haulage',
      driver: 'Raj Kumar',
      driverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'On Route',
      speed: '58 km/h',
      fuel: 84,
      fuelType: 'Diesel',
      capacity: '12,000 kg',
      currentLoad: '9,600 kg (80%)',
      currentLocation: 'AYE Expressway (near Jurong East)',
      destination: 'Tuas Megaport Hub #4',
      eta: 'Today, 2:15 PM',
      hub: 'Jurong Hub',
      lastService: '02 Sep 2026',
      nextInspection: '08 Jan 2027',
      cabinTemp: '-18.4°C (Target: -20°C)',
      tirePressure: '110 PSI (Optimal)',
      engineHealth: '99% (Good)',
      telematicsStatus: 'Active'
    },
    {
      id: 'SG-477',
      plateNumber: 'SG-477',
      model: 'BYD T3 Electric Express Cargo Van',
      category: 'EV Express Delivery',
      driver: 'Robert Martinez',
      driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'On Route',
      speed: '45 km/h',
      fuel: 92,
      fuelType: 'Electric (EV)',
      capacity: '1,700 kg',
      currentLoad: '1,150 kg (68%)',
      currentLocation: 'PIE Expressway (Paya Lebar Exit)',
      destination: 'Orchard Logistics Drop #2',
      eta: 'Today, 1:30 PM',
      hub: 'Changi Hub',
      lastService: '25 Aug 2026',
      nextInspection: '20 Nov 2026',
      tirePressure: '36 PSI (Optimal)',
      engineHealth: '100% (Optimal)',
      telematicsStatus: 'Active'
    },
    {
      id: 'SG-6630',
      plateNumber: 'SG-6630',
      model: 'Volvo FH16 Multi-Axle Prime Mover',
      category: 'Container Haulage',
      driver: 'Chen Wei',
      driverPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      status: 'On Route',
      speed: '54 km/h',
      fuel: 62,
      fuelType: 'Diesel',
      capacity: '35,000 kg',
      currentLoad: '31,000 kg (88%)',
      currentLocation: 'KPE Expressway (Marina South Tunnel)',
      destination: 'Sembawang Shipyard Depot',
      eta: 'Today, 4:10 PM',
      hub: 'Tuas Megaport',
      lastService: '18 Jul 2026',
      nextInspection: '12 Oct 2026',
      tirePressure: '118 PSI (Optimal)',
      engineHealth: '96% (Good)',
      telematicsStatus: 'Active'
    },
    {
      id: 'FL-989',
      plateNumber: 'FL-989',
      model: 'Toyota HiAce Chilled Refrigerated Van',
      category: 'Chilled Cargo Van',
      driver: 'Tom',
      driverPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      speed: '0 km/h',
      fuel: 95,
      fuelType: 'Diesel',
      capacity: '2,200 kg',
      currentLoad: '0 kg (Empty / Standby)',
      currentLocation: 'Changi Hub Staging Bay 3',
      destination: 'Ready for Immediate Dispatch',
      eta: 'Immediate',
      hub: 'Changi Air Cargo Logistics Hub',
      lastService: '05 Sep 2026',
      nextInspection: '15 Feb 2027',
      cabinTemp: '2.5°C (Chilled)',
      tirePressure: '38 PSI (Optimal)',
      engineHealth: '100% (Optimal)',
      telematicsStatus: 'Standby'
    },
    {
      id: 'FL-108',
      plateNumber: 'FL-108',
      model: 'Mercedes-Benz Actros 18-Wheeler',
      category: 'Heavy Prime Mover',
      driver: 'Robert Martinez',
      driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      speed: '0 km/h',
      fuel: 68,
      fuelType: 'Diesel',
      capacity: '32,000 kg',
      currentLoad: '0 kg (Empty / Staging)',
      currentLocation: 'Tuas Megaport Staging Yard',
      destination: 'Ready for Heavy Haulage Dispatch',
      eta: 'Immediate',
      hub: 'Tuas Megaport',
      lastService: '14 Aug 2026',
      nextInspection: '30 Nov 2026',
      tirePressure: '112 PSI (Optimal)',
      engineHealth: '97% (Good)',
      telematicsStatus: 'Standby'
    },
    {
      id: 'JL-204',
      plateNumber: 'JL-204',
      model: 'Mitsubishi Fuso Canter (14ft Box)',
      category: 'Medium Cargo Hauler',
      driver: 'David Tan',
      driverPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      speed: '0 km/h',
      fuel: 88,
      fuelType: 'Diesel',
      capacity: '3,500 kg',
      currentLoad: '0 kg (Empty / Staged)',
      currentLocation: 'Pasir Panjang Terminal Depot',
      destination: 'Ready for Dispatch',
      eta: 'Immediate',
      hub: 'Pasir Panjang Depot',
      lastService: '29 Aug 2026',
      nextInspection: '25 Dec 2026',
      tirePressure: '75 PSI (Optimal)',
      engineHealth: '98% (Good)',
      telematicsStatus: 'Standby'
    },
    {
      id: 'SG-1920',
      plateNumber: 'SG-1920',
      model: 'MAN TGM 24ft Curtainsider',
      category: 'Curtainsider Hauler',
      driver: 'Depot Fleet Maintenance Crew',
      driverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      status: 'Maintenance',
      speed: '0 km/h',
      fuel: 42,
      fuelType: 'Diesel',
      capacity: '14,000 kg',
      currentLoad: '0 kg (Under Service)',
      currentLocation: 'Jurong Workshop Service Bay 2',
      destination: 'Scheduled 50,000 km Service',
      eta: 'Tomorrow, 10:00 AM',
      hub: 'Jurong Workshop',
      lastService: 'Today (In Progress)',
      nextInspection: 'Today (Annual LTA Inspection)',
      tirePressure: 'Service in progress',
      engineHealth: '89% (Servicing)',
      telematicsStatus: 'Offline / Workshop'
    }
  ]);

  const [fleetFilterTab, setFleetFilterTab] = useState('All');
  const [fleetSearchQuery, setFleetSearchQuery] = useState('');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [newVehicleData, setNewVehicleData] = useState({
    plateNumber: '',
    model: '',
    category: 'Heavy Haulage',
    driver: '',
    capacity: '',
    fuelType: 'Diesel',
    hub: 'Changi Air Cargo Logistics Hub'
  });

  const toggleVehicleStatus = (vehicleId) => {
    setFleetVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        let nextStatus = 'On Route';
        if (v.status === 'On Route') nextStatus = 'Available';
        else if (v.status === 'Available') nextStatus = 'Maintenance';
        else nextStatus = 'On Route';
        
        showToast(`Vehicle ${v.plateNumber} status updated to "${nextStatus}".`, 'success');
        return { 
          ...v, 
          status: nextStatus,
          speed: nextStatus === 'On Route' ? '52 km/h' : '0 km/h',
          telematicsStatus: nextStatus === 'On Route' ? 'Active' : nextStatus === 'Available' ? 'Standby' : 'Offline / Workshop'
        };
      }
      return v;
    }));
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicleData.plateNumber.trim() || !newVehicleData.model.trim()) {
      showToast('Please enter plate number and vehicle model', 'error');
      return;
    }
    const cleanPlate = newVehicleData.plateNumber.trim().toUpperCase();
    const newVeh = {
      id: cleanPlate,
      plateNumber: cleanPlate,
      model: newVehicleData.model.trim(),
      category: newVehicleData.category,
      driver: newVehicleData.driver.trim() || 'Unassigned (Depot Staged)',
      driverPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      speed: '0 km/h',
      fuel: 100,
      fuelType: newVehicleData.fuelType,
      capacity: newVehicleData.capacity ? `${newVehicleData.capacity} kg` : '8,000 kg',
      currentLoad: '0 kg (Empty / Standby)',
      currentLocation: `${newVehicleData.hub} Depot`,
      destination: 'Ready for Immediate Dispatch',
      eta: 'Immediate',
      hub: newVehicleData.hub,
      lastService: 'Just registered',
      nextInspection: '6 months',
      tirePressure: '110 PSI (Optimal)',
      engineHealth: '100% (Optimal)',
      telematicsStatus: 'Standby'
    };
    setFleetVehicles(prev => [newVeh, ...prev]);
    setIsAddVehicleModalOpen(false);
    setNewVehicleData({
      plateNumber: '',
      model: '',
      category: 'Heavy Haulage',
      driver: '',
      capacity: '',
      fuelType: 'Diesel',
      hub: 'Changi Air Cargo Logistics Hub'
    });
    showToast(`Vehicle ${newVeh.plateNumber} added to fleet roster successfully!`, 'success');
  };

  // ==========================================
  // SETTINGS MODULE STATE & HANDLERS
  // ==========================================
  const [settingsActiveTab, setSettingsActiveTab] = useState('general');
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Josan Logistics Pte. Ltd.',
    uen: '201829481K',
    gstReg: 'M90382910X',
    contactEmail: 'operations@josanlogistics.com',
    supportPhone: '+65 6789 1234',
    address: '7 Changi South Street 2, #03-01 Changi Logistics Centre, Singapore 486415',
    currency: 'SGD ($)',
    timezone: 'Asia/Singapore (UTC+8)',
    operatingRegion: 'Singapore Domestic & Port Corridors',
  });

  const [telematicsSettings, setTelematicsSettings] = useState({
    gpsRefreshInterval: '10',
    speedThreshold: '70',
    autoAssignDriver: true,
    geofenceRadius: '500',
    reeferTempThreshold: '-16.0',
    expresswayMonitoring: true,
    nightHaulageAlert: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '60',
    loginAlerts: true,
    ipWhitelisting: false,
    requireDriverSignoff: true,
    auditLogging: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    delayedShipments: true,
    expresswayCongestion: true,
    driverDutyStatus: true,
    newOrderInbound: true,
    podSignatureUploaded: true,
    dailyOperationsSummary: true,
  });

  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveSettings = () => {
    showToast('Platform settings saved and applied successfully!', 'success');
  };

  const handleUpdateAdminPassword = (e) => {
    e.preventDefault();
    if (!adminPasswordForm.newPassword) {
      showToast('Please enter a new password', 'warning');
      return;
    }
    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      showToast('New password and confirm password do not match', 'error');
      return;
    }
    showToast('Admin password updated successfully!', 'success');
    setAdminPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Real-time live date and time state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveDate = currentDateTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const liveTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // PHASE 3: Multi-Parameter Filter & Pagination State for Shipments
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDriverFilter, setOrderDriverFilter] = useState('All');
  const [orderVehicleFilter, setOrderVehicleFilter] = useState('All');
  const [orderCargoFilter, setOrderCargoFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All');
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(5);

  // Top Header Global Search: Live computation across shipments, drivers, and customers
  const searchResults = useMemo(() => {
    const q = (adminSearchQuery || '').trim().toLowerCase();
    if (!q) return { shipments: [], drivers: [], customers: [], count: 0 };

    const matchingShipments = (shipments || []).filter(s => 
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.trackingNumber && s.trackingNumber.toLowerCase().includes(q)) ||
      (s.sender && s.sender.toLowerCase().includes(q)) ||
      (s.receiver && s.receiver.toLowerCase().includes(q)) ||
      (s.driverName && s.driverName.toLowerCase().includes(q)) ||
      (s.vehiclePlate && s.vehiclePlate.toLowerCase().includes(q)) ||
      (s.origin && s.origin.toLowerCase().includes(q)) ||
      (s.destination && s.destination.toLowerCase().includes(q)) ||
      (s.cargoType && s.cargoType.toLowerCase().includes(q))
    ).slice(0, 8);

    const matchingDrivers = (drivers || []).filter(d =>
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.id && d.id.toLowerCase().includes(q)) ||
      (d.phone && d.phone.toLowerCase().includes(q)) ||
      (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchingCustomers = (customers || []).filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.id && c.id.toLowerCase().includes(q))
    ).slice(0, 3);

    return {
      shipments: matchingShipments,
      drivers: matchingDrivers,
      customers: matchingCustomers,
      count: matchingShipments.length + matchingDrivers.length + matchingCustomers.length
    };
  }, [adminSearchQuery, shipments, drivers, customers]);

  const openConsignmentDetails = (queryId) => {
    const cleanId = (queryId || '').trim().toUpperCase();
    if (!cleanId) return;

    // Check if it already exists in shipments
    const existing = (shipments || []).find(s => 
      s.id?.toUpperCase() === cleanId || 
      s.trackingNumber?.toUpperCase() === cleanId ||
      s.id?.toUpperCase().includes(cleanId)
    );

    if (existing) {
      setSelectedDetailShipment(existing);
      setIsSearchOpen(false);
      if (showToast) showToast(`Loaded shipment #${existing.id}`, 'success');
      return;
    }

    // Build realistic active consignment record for requested Tracking ID (e.g. JOS-78589-18)
    const activeConsignment = {
      id: cleanId,
      trackingNumber: cleanId,
      sender: 'Jurong Commercial Logistics Depot Gate 4',
      senderPhone: '+65 6789 0123',
      senderAddress: '10 Jurong Port Road, Singapore 619114',
      receiver: 'Tuas Logistics Mega Terminal Bay 12',
      receiverPhone: '+65 9123 4567',
      receiverAddress: '20 Tuas South Avenue 14, Singapore 637312',
      origin: 'Jurong Central Highway Freight Hub',
      destination: 'Tuas Megaport Warehouse #4',
      currentLocation: 'PIE Expressway Corridors (Telematics Gate 19)',
      status: 'In Transit',
      statusType: 'active',
      paymentStatus: 'Paid',
      serviceLevel: 'Express Road Freight & Highway Linehaul (FTL)',
      cargoType: 'Industrial Electronics & High-Value Freight',
      weight: '1,850 kg',
      pieces: 6,
      declaredValue: 'S$ 52,000',
      price: 'S$ 620.00',
      driverId: 'DRV-101',
      driverName: 'Tan Wei Ming',
      driverPhone: '+65 9123 4567',
      vehicle: 'Josan 14-Ton Highway Linehaul Truck #SG-8819',
      vehiclePlate: 'SG-8819',
      vehicleType: '14-Ton Highway Box Truck',
      estimatedDelivery: 'Today, 4:30 PM (SGT)',
      lastUpdatedTime: 'Just now (GPS Telematics Sync)',
      createdDate: '2026-09-21 08:30 AM',
      timeline: [
        { step: 1, title: 'Consignment Registered & Tagged', location: 'Jurong Central Depot', timestamp: 'Today, 08:30 AM', completed: true },
        { step: 2, title: 'Security Clearance & FTL Loaded', location: 'Josan Highway Bay 3', timestamp: 'Today, 09:15 AM', completed: true },
        { step: 3, title: 'Dispatched on Roadway Corridors', location: 'PIE Expressway Corridor', timestamp: 'Today, 11:20 AM', completed: true, current: true },
        { step: 4, title: 'Approaching Destination Terminal', location: 'Tuas Mega Terminal Corridor', timestamp: 'Expected 03:45 PM', completed: false },
        { step: 5, title: 'Delivered & Electronic POD Signed', location: 'Tuas Megaport Warehouse #4', timestamp: 'Expected 04:30 PM', completed: false }
      ],
      coordinates: { origin: [1.3400, 103.7100], current: [1.3521, 103.8200], destination: [1.3200, 103.6500] }
    };

    setSelectedDetailShipment(activeConsignment);
    setIsSearchOpen(false);
    if (showToast) showToast(`Loaded tracking telematics for #${cleanId}`, 'success');
  };

  const handleGlobalSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = (adminSearchQuery || '').trim();
    if (!q) return;

    // 1. Direct or partial match in shipments
    const matched = (shipments || []).find(s => 
      s.id?.toLowerCase() === q.toLowerCase() || 
      s.trackingNumber?.toLowerCase() === q.toLowerCase()
    );

    if (matched) {
      setSelectedDetailShipment(matched);
      setIsSearchOpen(false);
      if (showToast) showToast(`Found shipment #${matched.id}`, 'success');
      return;
    }

    // 2. If searchResults has matching shipments, pick the first
    if (searchResults.shipments.length > 0) {
      setSelectedDetailShipment(searchResults.shipments[0]);
      setIsSearchOpen(false);
      if (showToast) showToast(`Opened matching shipment #${searchResults.shipments[0].id}`, 'success');
      return;
    }

    // 3. If user typed an ID / code (e.g. JOS-78589-18, JL..., etc.)
    if (q.length >= 3) {
      openConsignmentDetails(q);
      return;
    }

    // 4. Fallback: filter orders tab
    setOrderSearch(q);
    setAdminTab('orders');
    setIsSearchOpen(false);
    if (showToast) showToast(`Searching "${q}" in Shipments & Orders`, 'info');
  };

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row w-full font-sans text-slate-800 pb-16">
      {/* Dark Navigation Left Sidebar */}
      <aside className="w-full lg:w-[280px] xl:w-[290px] bg-[#0B132B] text-slate-300 shrink-0 flex flex-col justify-between p-5 pt-4 border-r border-slate-800 z-30 self-stretch lg:min-h-screen">
        <div className="space-y-4">
          {/* Official Brand Logo Header */}
          <div 
            onClick={() => {
              setAdminTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 px-2 pt-2 pb-3 mb-1 border-b border-slate-800/60 cursor-pointer group"
            title="Josan Logistics Admin Operations"
          >
            <img 
              src="/assets/josan_logo.png" 
              alt="Josan Logistics Official Brand Logo" 
              className="h-10 sm:h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-wider leading-none">
                JOSAN
              </span>
              <span className="text-[#FF6B00] font-black text-[9px] tracking-widest uppercase mt-0.5">
                LOGISTICS PTE. LTD.
              </span>
            </div>
          </div>

          {/* Live Socket.IO Status Badge */}
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px] shadow-inner">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSocketConnected ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-500'}`} />
              <span className="font-bold text-slate-200">
                {isSocketConnected ? 'Live Telematics Active' : 'Backend Connecting...'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">:3000</span>
          </div>

          {/* Navigation Links Group */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Shipments', icon: Package, count: shipments.length },
              { id: 'orders_dispatch', label: 'Orders', icon: FileText, onClick: () => setAdminTab('orders') },
              { id: 'drivers', label: 'Drivers', icon: Users, count: drivers.length },
              { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
              { id: 'fleet', label: 'Fleet', icon: Truck, count: fleetVehicles.length },
              { id: 'analytics', label: 'Reports', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.onClick) {
                      tab.onClick();
                    } else {
                      setAdminTab(tab.id);
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between font-bold text-xs cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20 font-extrabold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count !== null && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold shrink-0 ml-1.5 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Operational Hubs Menu Divider */}
          <div className="pt-2.5 border-t border-slate-800/80">
            <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Operations & Management
            </div>
            <nav className="space-y-0.5">
              {[
                { id: 'invoices', label: 'Invoices & Billing', icon: CreditCard, count: invoices.length },
                { id: 'documents', label: 'Document Vault', icon: FileCheck, count: documents.length },
                { id: 'quotes', label: 'Quotations', icon: DollarSign, count: quotes.length },
                { id: 'warehouses', label: 'Warehouses', icon: Warehouse, count: warehouses.length },
                { id: 'support', label: 'Support Tickets', icon: MessageSquare, count: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length },
              ].map((subTab) => {
                const SubIcon = subTab.icon;
                const isSubSelected = adminTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => {
                      setAdminTab(subTab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs font-semibold cursor-pointer text-left ${
                      isSubSelected
                        ? 'bg-[#FF6B00] text-white font-extrabold shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <SubIcon className={`w-4 h-4 shrink-0 ${isSubSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{subTab.label}</span>
                    </div>
                    {subTab.count > 0 && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                        isSubSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {subTab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Quick Link to Public Website */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (setParentActiveTab) {
                setParentActiveTab('home');
              } else {
                window.location.hash = '#home';
              }
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs font-semibold cursor-pointer group shadow-2xs"
            title="Return to Public Website"
          >
            <div className="flex items-center space-x-2">
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Public Website</span>
            </div>
            <Globe className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </button>
        </div>

        {/* Bottom Card: Efficient Logistics for a Better Tomorrow */}
        <div className="pt-3 pb-2">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
            <img 
              src="/assets/roadway_truck_highway.jpg" 
              alt="Highway Linehaul" 
              className="w-full h-24 object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/60 to-transparent p-4 flex flex-col justify-end">
              <p className="text-xs font-black text-white leading-tight">
                Efficient Logistics
              </p>
              <p className="text-[10px] font-medium text-slate-300">
                for a Better Tomorrow
              </p>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Workspace Area (Right side) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">

        {/* 1. TOP HEADER (FIXED) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          {/* Global Search Form with Live Results Dropdown */}
          <form 
            onSubmit={handleGlobalSearchSubmit} 
            ref={searchContainerRef}
            className="relative max-w-lg w-full"
          >
            <div className="relative flex items-center">
              <button 
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 p-0.5 rounded cursor-pointer transition-colors"
                title="Search (or press Enter)"
              >
                <Search className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                value={adminSearchQuery}
                onChange={(e) => {
                  setAdminSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGlobalSearchSubmit(e);
                  } else if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                  }
                }}
                placeholder="Search Tracking ID (e.g. JOS-78589-18), Customer, Order..." 
                className="w-full pl-9 pr-24 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                {adminSearchQuery && (
                  <button 
                    type="button"
                    onClick={() => {
                      setAdminSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#FF6B00] hover:bg-orange-600 active:scale-95 text-white rounded-lg text-[11px] font-black shadow-xs cursor-pointer transition-all flex items-center space-x-1 shrink-0"
                  title="Search Tracking ID"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Live Search Dropdown Panel */}
            {isSearchOpen && adminSearchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fade-in max-h-[460px] overflow-y-auto">
                {/* Header info */}
                <div className="px-3.5 py-2 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-slate-700">
                    Search Results for <span className="font-mono text-orange-600">"{adminSearchQuery}"</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Press Enter to Trace</span>
                </div>

                {/* Instant Trace Consignment Action */}
                <div 
                  onClick={() => openConsignmentDetails(adminSearchQuery)}
                  className="p-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 hover:to-amber-100 border-b border-orange-100/80 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-black shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="truncate text-left">
                      <p className="text-xs font-black text-slate-900 flex items-center space-x-1.5 truncate">
                        <span>Trace Consignment:</span>
                        <span className="font-mono text-orange-600 underline decoration-orange-300 font-extrabold">
                          #{adminSearchQuery.trim().toUpperCase()}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Live GPS tracking, road transit progression & e-POD verification
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-white bg-[#FF6B00] hover:bg-orange-600 px-2.5 py-1 rounded-lg shrink-0 ml-2 shadow-xs transition-colors flex items-center space-x-1">
                    <span>Trace</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Matching Shipments List */}
                {searchResults.shipments.length > 0 && (
                  <div className="p-2 space-y-1 border-b border-slate-100">
                    <p className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Matching Shipments ({searchResults.shipments.length})
                    </p>
                    {searchResults.shipments.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedDetailShipment(s);
                          setIsSearchOpen(false);
                          if (showToast) showToast(`Opened shipment #${s.id}`, 'info');
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors text-left group"
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold text-xs shrink-0">
                            <Package className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <p className="font-mono font-black text-xs text-slate-900 group-hover:text-orange-600 transition-colors">
                              #{s.id}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {s.sender || 'Consignor'} → {s.receiver || s.destination}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            s.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            s.status === 'Delayed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {s.status}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Matching Drivers */}
                {searchResults.drivers.length > 0 && (
                  <div className="p-2 space-y-1 border-b border-slate-100">
                    <p className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Fleet Drivers ({searchResults.drivers.length})
                    </p>
                    {searchResults.drivers.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setAdminTab('drivers');
                          setIsSearchOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors text-left"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-800">{d.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({d.vehiclePlate || d.id})</span>
                        </div>
                        <span className="text-[10px] text-blue-600 font-bold">View Driver →</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Switch to Shipments Module */}
                <div className="p-2 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderSearch(adminSearchQuery);
                      setAdminTab('orders');
                      setIsSearchOpen(false);
                    }}
                    className="w-full py-2 text-center text-xs font-extrabold text-[#FF6B00] hover:text-white hover:bg-[#FF6B00] rounded-xl transition-all cursor-pointer border border-orange-200 shadow-2xs"
                  >
                    View All in Shipments & Orders Tab →
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Right Controls: Notifications & Admin Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Operations Indicator */}
            <span className="hidden sm:flex items-center text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2"></span>
              Live Operations
            </span>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setAdminProfileDropdownOpen(false);
                }}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {notifications.filter(n => (n.role === 'admin' || !n.role) && !n.read).length || 3}
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-3 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                    <span className="text-xs font-black text-slate-900">Operational Alerts</span>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      {notifications.filter(n => !n.read).length || 3} Unread
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 text-xs">
                    {[
                      { id: 'n1', title: 'Pending order #ORD1001 awaiting driver allocation', time: '10 mins ago' },
                      { id: 'n2', title: 'Shipment #JL47839162 delay reported at Tuas Checkpoint', time: '45 mins ago' },
                      { id: 'n3', title: 'Driver Raj Kumar completed delivery at Jurong East', time: '2 hours ago' },
                    ].map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          setAdminTab('orders');
                          setNotificationsOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer text-left"
                      >
                        <p className="font-semibold text-slate-800 leading-snug">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{item.time}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setAdminTab('notifications');
                      setNotificationsOpen(false);
                    }}
                    className="w-full py-1.5 text-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setAdminProfileDropdownOpen(!adminProfileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-2.5 pl-2 sm:pl-3 py-1 pr-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B132B] to-slate-800 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  A
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-xs font-black text-slate-900">Admin</p>
                  <p className="text-[10px] font-semibold text-slate-400">Super Admin</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${adminProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {adminProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-2 space-y-1 animate-fade-in text-xs font-medium">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">Josan Operations Admin</p>
                    <p className="text-[10px] text-slate-400 font-mono">admin@josanlogistics.com</p>
                  </div>
                  <button 
                    onClick={() => { setAdminTab('overview'); setAdminProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Operations Overview
                  </button>
                  <button 
                    onClick={() => { setAdminTab('orders'); setAdminProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Shipments & Orders
                  </button>
                  <button 
                    onClick={() => { setAdminTab('drivers'); setAdminProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Fleet Telematics
                  </button>
                  <button 
                    onClick={() => { setAdminTab('customers'); setAdminProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Customer Directory
                  </button>
                  <div className="border-t border-slate-100 my-1 pt-1 space-y-0.5">
                    <button 
                      onClick={() => { setAdminTab('analytics'); setAdminProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                    >
                      Audit & Reports
                    </button>
                    <button 
                      onClick={() => { setAdminTab('settings'); setAdminProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-orange-50 text-orange-600 font-bold cursor-pointer flex items-center justify-between"
                    >
                      <span>Platform Settings</span>
                      <Settings className="w-3.5 h-3.5 text-orange-500" />
                    </button>
                  </div>

                  <div className="border-t border-slate-100 my-1 pt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setAdminProfileDropdownOpen(false);
                        if (setParentActiveTab) {
                          setParentActiveTab('home');
                        } else {
                          window.location.hash = '#home';
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer flex items-center justify-between"
                    >
                      <span>Public Website</span>
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setAdminProfileDropdownOpen(false);
                        if (logoutUser) logoutUser();
                        window.location.hash = '#home';
                        window.location.reload();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold cursor-pointer flex items-center justify-between"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">

      {/* MODULE 1: DASHBOARD OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Hero Header: Welcome Back Admin + Live Real-Time Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans">Welcome Back, Admin</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Singapore Road Logistics Operations Control Center</p>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-600 self-start sm:self-auto pt-1">
              <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="text-right leading-tight">
                <div className="font-bold text-slate-700 text-xs">{liveDate}</div>
                <div className="text-[11px] font-semibold text-slate-400 font-mono">{liveTime}</div>
              </div>
            </div>
          </div>

          {/* 2. KPI CARDS (ACTION-FOCUSED) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Pending Orders (Highlight – Requires Action) */}
            <div 
              onClick={() => {
                setOrderFilterTab('pending');
                const el = document.getElementById('orders-management-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 border-l-4 border-l-[#FF6B00] shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/70">
                  Action Required
                </span>
                <span className="text-xs font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                  Review &rarr;
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-black text-slate-900 font-sans tracking-tight">
                  {shipments.filter(s => s.status === 'Pending').length || 24}
                </h3>
                <span className="text-xs font-semibold text-slate-400">orders</span>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1">Pending Orders</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                Awaiting driver allocation & immediate dispatch clearance
              </p>
            </div>

            {/* Card 2: Cancelled Orders (Alert Style) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 border-l-4 border-l-rose-500 shadow-2xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/70">
                  Operational Alert
                </span>
                <span className="text-[11px] font-bold text-rose-600">
                  Audit needed
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-black text-slate-900 font-sans tracking-tight">
                  {shipments.filter(s => s.status === 'Cancelled').length || 4}
                </h3>
                <span className="text-xs font-semibold text-slate-400">cancelled</span>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1">Cancelled Orders</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                Consignments aborted or refund processing required
              </p>
            </div>

            {/* Card 3: Today’s Shipments (Current Workload) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 border-l-4 border-l-[#0B132B] shadow-2xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  Current Workload
                </span>
                <span className="flex items-center text-[11px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Active Runs
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-black text-slate-900 font-sans tracking-tight">
                  {shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery' || s.status === 'Delivered').length || 38}
                </h3>
                <span className="text-xs font-semibold text-slate-400">scheduled</span>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1">Today's Shipments</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                Active road freight routes across Singapore logistics corridors
              </p>
            </div>
          </div>

          {/* 3. ANALYTICS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Shipment Overview (Line/Area Chart - Shipments Trend) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Shipment Overview</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Daily road haulage volume trends</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-bold">
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Delivered</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>In Transit</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>Delayed</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={[
                      { date: 'Sep 15', delivered: 42, inTransit: 28, delayed: 4 },
                      { date: 'Sep 16', delivered: 55, inTransit: 32, delayed: 6 },
                      { date: 'Sep 17', delivered: 68, inTransit: 30, delayed: 5 },
                      { date: 'Sep 18', delivered: 64, inTransit: 38, delayed: 7 },
                      { date: 'Sep 19', delivered: 76, inTransit: 42, delayed: 8 },
                      { date: 'Sep 20', delivered: 79, inTransit: 40, delayed: 9 },
                      { date: 'Sep 21', delivered: 88, inTransit: 46, delayed: 11 },
                    ]} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTransit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} dy={5} />
                    <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDelivered)" dot={{ r: 3, fill: '#10B981' }} />
                    <Area type="monotone" dataKey="inTransit" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTransit)" dot={{ r: 3, fill: '#3B82F6' }} />
                    <Area type="monotone" dataKey="delayed" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDelayed)" dot={{ r: 3, fill: '#EF4444' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shipment Status (Donut Chart) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Shipment Status</h3>
                <p className="text-[11px] text-slate-400 font-medium">Consignment delivery resolution ratio</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                <div className="h-48 w-48 shrink-0 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Delivered', value: 201, color: '#10B981', percentage: 81 },
                          { name: 'In Transit', value: 36, color: '#3B82F6', percentage: 15 },
                          { name: 'Delayed', value: 11, color: '#EF4444', percentage: 4 },
                        ]}
                        innerRadius={62}
                        outerRadius={86}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Centered Total */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-2xl font-black text-slate-900 font-sans">248</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Shipments</span>
                  </div>
                </div>

                {/* Status Breakdown Legend */}
                <div className="space-y-3.5 flex-1 w-full text-xs">
                  {[
                    { name: 'Delivered', value: 201, percentage: 81, color: '#10B981' },
                    { name: 'In Transit', value: 36, percentage: 15, color: '#3B82F6' },
                    { name: 'Delayed', value: 11, percentage: 4, color: '#EF4444' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="font-bold text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-mono font-extrabold text-slate-900">
                        {item.value} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. OPERATIONS SECTION (MAIN FOCUS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* A. Recent Shipments Table */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Recent Shipments</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Live road consignments across Singapore sectors</p>
                </div>
                <button 
                  onClick={() => setAdminTab('orders')} 
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100">
                      <th className="pb-2.5 font-bold">Tracking ID</th>
                      <th className="pb-2.5 font-bold">Type</th>
                      <th className="pb-2.5 font-bold">Status</th>
                      <th className="pb-2.5 font-bold">Location</th>
                      <th className="pb-2.5 font-bold text-right">ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { id: 'JL47839201', customer: 'ABC Trading Co.', type: 'Parcel', status: 'Delivered', location: 'Changi Cargo Terminal', eta: 'Sep 21, 2026' },
                      { id: 'JL47839187', customer: 'Global Exports', type: 'Document', status: 'In Transit', location: 'Jurong East Industrial', eta: 'Sep 21, 2026' },
                      { id: 'JL47839176', customer: 'Sunrise Pte Ltd', type: 'Parcel', status: 'In Transit', location: 'Woodlands Checkpoint', eta: 'Sep 21, 2026' },
                      { id: 'JL47839162', customer: 'Bright Logistics', type: 'Cargo', status: 'Delayed', location: 'Tuas Megaport Warehouse', eta: 'Sep 22, 2026' },
                      { id: 'JL47839145', customer: 'Tech Solutions', type: 'Parcel', status: 'Delivered', location: 'Pasir Panjang Terminal', eta: 'Sep 20, 2026' },
                    ]
                      .filter(item => {
                        if (!adminSearchQuery.trim()) return true;
                        const q = adminSearchQuery.toLowerCase();
                        return item.id.toLowerCase().includes(q) || item.customer.toLowerCase().includes(q) || item.type.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
                      })
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                              <Package className="w-3.5 h-3.5" />
                            </div>
                            <button 
                              onClick={() => {
                                const found = shipments.find(s => s.id === item.id);
                                if (found) {
                                  setSelectedDetailShipment(found);
                                } else {
                                  setSelectedDetailShipment({
                                    id: item.id,
                                    trackingNumber: item.id,
                                    origin: 'Changi Air Cargo Logistics Hub, Singapore',
                                    destination: item.location + ', Singapore',
                                    status: item.status,
                                    carrier: 'Josan Logistics Roadways Express',
                                    driverName: 'Raj Kumar',
                                    vehicleNumber: 'SG-8819',
                                    cargoType: item.type,
                                    estimatedDelivery: item.eta
                                  });
                                }
                              }}
                              className="font-mono font-bold text-blue-600 hover:underline cursor-pointer"
                              title="Click to view shipment details"
                            >
                              {item.id}
                            </button>
                          </td>
                          <td className="py-3 text-slate-700">{item.type}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.status === 'In Transit'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600">{item.location}</td>
                          <td className="py-3 text-right font-medium text-slate-500 font-mono">{item.eta}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* B. Live Fleet Tracking (Operations Control Center) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Live Fleet Tracking</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Singapore Highway Telematics Radar</p>
                  </div>
                  <button 
                    onClick={() => setAdminTab('drivers')} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    All Fleet &rarr;
                  </button>
                </div>

                {/* Truck Selector Tabs */}
                <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
                  {fleetVehiclesList.map((truck) => (
                    <button
                      key={truck.id}
                      onClick={() => setSelectedFleetTruckId(truck.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        selectedFleetTruckId === truck.id
                          ? 'bg-[#0B132B] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {truck.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telematics Map & Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                {/* Singapore Route Map Canvas */}
                <div className="sm:col-span-6 bg-[#0B132B] rounded-2xl border border-slate-800 p-3 relative h-48 overflow-hidden flex items-center justify-center shadow-inner">
                  {/* Grid background effect */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  
                  <svg viewBox="0 0 200 120" className="w-full h-full relative z-10">
                    {/* Singapore Mainland Silhouette */}
                    <path d="M 20 60 Q 60 20 140 30 Q 180 40 190 70 Q 170 100 110 95 Q 40 100 20 60 Z" fill="#1E293B" opacity="0.8" stroke="#334155" strokeWidth="1" />
                    
                    {/* Expressway Corridor Line */}
                    <path d="M 35 65 Q 85 45 125 55 T 165 75" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="4 2" />
                    
                    {/* Origin Hub Marker */}
                    <circle cx="35" cy="65" r="4" fill="#10B981" />
                    <text x="35" y="80" fontSize="7" textAnchor="middle" fill="#94A3B8" fontWeight="bold">Jurong</text>

                    {/* Destination Hub Marker */}
                    <circle cx="165" cy="75" r="4" fill="#FF6B00" />
                    <text x="165" y="90" fontSize="7" textAnchor="middle" fill="#94A3B8" fontWeight="bold">Changi</text>

                    {/* Active Moving Truck Pulse */}
                    <circle cx={activeFleetVehicle.truckX} cy={activeFleetVehicle.truckY} r="7" fill="#FF6B00" opacity="0.35" className="animate-ping" />
                    <g transform={`translate(${activeFleetVehicle.truckX}, ${activeFleetVehicle.truckY})`}>
                      <rect x="-9" y="-7" width="18" height="14" rx="3" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="1" />
                      <text x="0" y="3" fontSize="8" textAnchor="middle" fill="#FFFFFF">🚚</text>
                    </g>
                    
                    <text x="100" y="112" fontSize="8" textAnchor="middle" fill="#64748B" fontWeight="bold" letterSpacing="1">SINGAPORE ROADWAYS</text>
                  </svg>
                </div>

                {/* Telematics Details Panel */}
                <div className="sm:col-span-6 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">{activeFleetVehicle.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{activeFleetVehicle.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                      activeFleetVehicle.status === 'On Route' ? 'bg-emerald-100 text-emerald-700' :
                      activeFleetVehicle.status === 'Idle' ? 'bg-slate-100 text-slate-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {activeFleetVehicle.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver</span>
                      <span className="font-bold text-slate-800">{activeFleetVehicle.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Location</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px]" title={activeFleetVehicle.currentLocation}>
                        {activeFleetVehicle.currentLocation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Destination</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px]" title={activeFleetVehicle.destination}>
                        {activeFleetVehicle.destination}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ETA</span>
                      <span className="font-bold text-slate-800 font-mono">{activeFleetVehicle.eta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed / Cargo</span>
                      <span className="font-bold text-emerald-600 font-mono">{activeFleetVehicle.speed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. MANAGEMENT SECTION */}
          <div id="orders-management-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* A. Orders Management (col-span-4) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Orders Management</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Consignment dispatch queues</p>
                  </div>
                  <button 
                    onClick={() => setAdminTab('orders')} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'assigned', label: 'Assigned' },
                    { id: 'completed', label: 'Completed' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderFilterTab(tab.id)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        orderFilterTab === tab.id
                          ? 'bg-[#FF6B00] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-slate-400 font-bold border-b border-slate-100">
                        <th className="pb-2">Order ID</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { id: 'ORD1001', customer: 'ABC Trading Co.', type: 'Parcel', status: 'Pending' },
                        { id: 'ORD1002', customer: 'Global Exports', type: 'Cargo', status: 'Assigned' },
                        { id: 'ORD1003', customer: 'Sunrise Pte Ltd', type: 'Document', status: 'In Transit' },
                        { id: 'ORD1004', customer: 'Tech Solutions', type: 'Parcel', status: 'Delivered' },
                        { id: 'ORD1005', customer: 'Bright Logistics', type: 'Cargo', status: 'Delayed' },
                      ]
                        .filter(o => {
                          if (orderFilterTab === 'pending') return o.status === 'Pending';
                          if (orderFilterTab === 'assigned') return o.status === 'Assigned' || o.status === 'In Transit';
                          if (orderFilterTab === 'completed') return o.status === 'Delivered';
                          return true;
                        })
                        .filter(o => {
                          if (!adminSearchQuery.trim()) return true;
                          const q = adminSearchQuery.toLowerCase();
                          return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.type.toLowerCase().includes(q);
                        })
                        .map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 font-mono font-bold text-blue-600">
                              <button 
                                onClick={() => {
                                  setSelectedDetailShipment({
                                    id: ord.id,
                                    trackingNumber: ord.id,
                                    origin: 'Singapore Central Sorting Hub',
                                    destination: 'Jurong Distribution Warehouse',
                                    status: ord.status,
                                    carrier: 'Josan Logistics Roadways',
                                    driverName: 'Raj Kumar',
                                    vehicleNumber: 'SG-8819',
                                    cargoType: ord.type,
                                    customerName: ord.customer
                                  });
                                }}
                                className="hover:underline cursor-pointer"
                              >
                                #{ord.id}
                              </button>
                            </td>
                            <td className="py-2 text-slate-800 font-medium truncate max-w-[85px]" title={ord.customer}>
                              {ord.customer}
                            </td>
                            <td className="py-2 text-slate-500">{ord.type}</td>
                            <td className="py-2">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                ord.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                ord.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                                ord.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-rose-100 text-rose-700'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-2 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedDetailShipment({
                                    id: ord.id,
                                    trackingNumber: ord.id,
                                    origin: 'Singapore Central Sorting Hub',
                                    destination: 'Jurong Distribution Warehouse',
                                    status: ord.status,
                                    carrier: 'Josan Logistics Roadways',
                                    driverName: 'Raj Kumar',
                                    vehicleNumber: 'SG-8819',
                                    cargoType: ord.type,
                                    customerName: ord.customer
                                  });
                                }}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] cursor-pointer transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* B. Top Customers (col-span-4) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Top Customers</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Singapore enterprise road accounts</p>
                </div>
                <button 
                  onClick={() => setAdminTab('customers')} 
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { rank: 1, initial: 'G', name: 'Global Exports', count: 42, color: 'bg-blue-600' },
                  { rank: 2, initial: 'A', name: 'ABC Trading Co.', count: 31, color: 'bg-indigo-600' },
                  { rank: 3, initial: 'S', name: 'Sunrise Pte Ltd', count: 26, color: 'bg-sky-600' },
                  { rank: 4, initial: 'T', name: 'Tech Solutions', count: 19, color: 'bg-teal-600' },
                  { rank: 5, initial: 'B', name: 'Bright Logistics', count: 15, color: 'bg-emerald-600' },
                ].map((c) => (
                  <div key={c.rank} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 font-mono text-[11px] font-bold">{c.rank}</span>
                      <div className={`w-7 h-7 rounded-full ${c.color} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
                        {c.initial}
                      </div>
                      <span className="font-bold text-slate-800">{c.name}</span>
                    </div>
                    <span className="font-semibold text-slate-600 text-[11px] font-mono">{c.count} shipments</span>
                  </div>
                ))}
              </div>
            </div>

            {/* C. Recent Activity (IMPORTANT UX) (col-span-4) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Live operational dispatch audit log</p>
                </div>
                <button 
                  onClick={() => setAdminTab('orders')} 
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
                {[
                  {
                    id: 1,
                    prefix: 'Order',
                    entityId: 'ORD1023',
                    suffix: 'assigned to Driver Raj Kumar',
                    time: 'Sep 21, 2026, 10:32 AM',
                    color: 'bg-indigo-500'
                  },
                  {
                    id: 2,
                    prefix: 'Shipment',
                    entityId: 'JL47839187',
                    suffix: 'departed Changi Air Cargo Hub (in transit to Jurong)',
                    time: 'Sep 21, 2026, 09:15 AM',
                    color: 'bg-blue-500'
                  },
                  {
                    id: 3,
                    prefix: 'Shipment',
                    entityId: 'JL47839176',
                    suffix: 'delivered successfully to Tuas Industrial Complex',
                    time: 'Sep 21, 2026, 08:45 AM',
                    color: 'bg-emerald-500'
                  },
                  {
                    id: 4,
                    prefix: 'New order',
                    entityId: 'ORD1025',
                    suffix: 'received from Bright Logistics (awaiting dispatch)',
                    time: 'Sep 21, 2026, 08:12 AM',
                    color: 'bg-[#FF6B00]'
                  },
                  {
                    id: 5,
                    prefix: 'Shipment',
                    entityId: 'JL47839162',
                    suffix: 'flagged weather delay on PIE Expressway',
                    time: 'Sep 21, 2026, 07:30 AM',
                    color: 'bg-rose-500'
                  },
                ].map((item) => (
                  <div key={item.id} className="relative">
                    <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ${item.color} ring-4 ring-white`}></span>
                    <div>
                      <p className="font-medium text-slate-800 leading-snug">
                        {item.prefix}{' '}
                        <button
                          onClick={() => {
                            const found = shipments.find(s => s.id === item.entityId);
                            if (found) {
                              setSelectedDetailShipment(found);
                            } else {
                              setSelectedDetailShipment({
                                id: item.entityId,
                                trackingNumber: item.entityId,
                                origin: 'Changi Air Cargo Logistics Hub, Singapore',
                                destination: 'Jurong East Industrial Park, Singapore',
                                status: item.color.includes('emerald') ? 'Delivered' : item.color.includes('rose') ? 'Delayed' : 'In Transit',
                                carrier: 'Josan Logistics Express Haulage',
                                driverName: 'Raj Kumar',
                                vehicleNumber: 'SG-8819',
                                cargoType: 'Express Consignment',
                                estimatedDelivery: 'Sep 21, 2026'
                              });
                            }
                          }}
                          className="font-mono font-bold text-blue-600 hover:underline cursor-pointer inline-flex items-center"
                          title="Click to view details"
                        >
                          #{item.entityId}
                        </button>{' '}
                        {item.suffix}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 font-mono">{item.time}</p>
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
      {/* FLEET MODULE: FLEET VEHICLES & ROAD ASSETS (adminTab === 'fleet') */}
      {/* ========================================== */}
      {adminTab === 'fleet' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Fleet Telematics & Road Assets
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {fleetVehicles.length} Registered Commercial Vehicles
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Fleet Vehicles & Road Asset Management</h2>
              <p className="text-xs text-slate-500">
                Live expressway telematics, assigned drivers, duty status, payload capacity load, and LTA preventive maintenance across Singapore road logistics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast('Syncing real-time telematics from Singapore road sensors...', 'info');
                  setTimeout(() => {
                    showToast('All 8 vehicle GPS feeds & OBD-II sensors synchronized.', 'success');
                  }, 600);
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>Sync Telematics</span>
              </button>
              <button
                onClick={() => setIsAddVehicleModalOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>

          {/* Operational Fleet KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Commercial Fleet</span>
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900 font-sans">{fleetVehicles.length}</span>
                <span className="text-[11px] font-bold text-slate-400">Assets</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">
                ✓ 100% LTA Road Tax & Inspection Active
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active On Route</span>
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-emerald-600 font-sans">
                  {fleetVehicles.filter(v => v.status === 'On Route').length}
                </span>
                <span className="text-[11px] font-bold text-slate-400">Delivering</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 flex items-center mt-1">
                In Transit on SG Expressways (AYE, PIE, SLE, KPE)
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Available / Standby</span>
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-blue-600 font-sans">
                  {fleetVehicles.filter(v => v.status === 'Available').length}
                </span>
                <span className="text-[11px] font-bold text-slate-400">Ready</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 flex items-center mt-1">
                Staged at Changi, Tuas & Pasir Panjang Hubs
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Workshop Service</span>
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-amber-600 font-sans">
                  {fleetVehicles.filter(v => v.status === 'Maintenance').length}
                </span>
                <span className="text-[11px] font-bold text-slate-400">In Bay</span>
              </div>
              <span className="text-[10px] font-bold text-amber-600 flex items-center mt-1">
                Scheduled 50,000 km Maintenance
              </span>
            </div>
          </div>

          {/* Search and Status Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {/* Status Filter Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'On Route', 'Available', 'Maintenance'].map((tab) => {
                const count = tab === 'All' 
                  ? fleetVehicles.length 
                  : fleetVehicles.filter(v => v.status === tab).length;
                const isTabActive = fleetFilterTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setFleetFilterTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                      isTabActive
                        ? 'bg-[#FF6B00] text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                    }`}
                  >
                    <span>{tab}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isTabActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={fleetSearchQuery}
                onChange={(e) => setFleetSearchQuery(e.target.value)}
                placeholder="Search plate, model, driver, hub..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-2xs"
              />
              {fleetSearchQuery && (
                <button
                  onClick={() => setFleetSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
            {fleetVehicles
              .filter(veh => {
                const matchesStatus = fleetFilterTab === 'All' || veh.status === fleetFilterTab;
                const q = fleetSearchQuery.toLowerCase().trim();
                const matchesSearch = !q ||
                  veh.plateNumber.toLowerCase().includes(q) ||
                  veh.model.toLowerCase().includes(q) ||
                  veh.driver.toLowerCase().includes(q) ||
                  veh.category.toLowerCase().includes(q) ||
                  veh.currentLocation.toLowerCase().includes(q) ||
                  veh.hub.toLowerCase().includes(q);
                return matchesStatus && matchesSearch;
              })
              .map((veh) => {
                const isOnline = veh.status === 'On Route';
                const isAvailable = veh.status === 'Available';
                const isMaintenance = veh.status === 'Maintenance';

                return (
                  <div 
                    key={veh.id} 
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow relative"
                  >
                    {/* Card Header: Plate Badge, Category & Live Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-slate-900 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg border-l-4 border-orange-500 shadow-2xs tracking-wider">
                            {veh.plateNumber}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wide bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                            {veh.category}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-1.5 font-sans">
                          {veh.model}
                        </h4>
                      </div>

                      {/* Status Badge */}
                      <button
                        onClick={() => toggleVehicleStatus(veh.id)}
                        title="Click to toggle status"
                        className={`px-3 py-1 rounded-full text-xs font-extrabold transition-colors cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                          isOnline 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : isAvailable 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {isOnline && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        {isAvailable && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                        {isMaintenance && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                        <span>{veh.status}</span>
                      </button>
                    </div>

                    {/* Driver & Assignment Details */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img
                          src={veh.driverPhoto}
                          alt={veh.driver}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Driver</span>
                          <span className="font-extrabold text-slate-900">{veh.driver}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Depot Hub</span>
                        <span className="font-bold text-slate-700 truncate max-w-[140px] block">{veh.hub}</span>
                      </div>
                    </div>

                    {/* Real-time Location & Route Info */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="text-slate-500 font-semibold truncate">
                          <strong className="text-slate-800">Current:</strong> {veh.currentLocation}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 pl-5">
                        <span className="text-[11px] text-slate-400 font-mono">&rarr;</span>
                        <span className="text-slate-500 font-semibold truncate text-[11px]">
                          <strong className="text-slate-800">Heading to:</strong> {veh.destination}
                        </span>
                      </div>
                    </div>

                    {/* Telematics Bar & Indicators */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs">
                      <div className="bg-white p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Speed</span>
                        <span className="font-mono font-extrabold text-slate-900">{veh.speed}</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          {veh.fuelType.includes('EV') ? 'Battery' : 'Fuel'}
                        </span>
                        <span className={`font-mono font-extrabold ${
                          veh.fuel > 50 ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {veh.fuel}%
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Capacity</span>
                        <span className="font-mono font-extrabold text-slate-900">{veh.capacity}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Load Capacity */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-semibold">Load Utilization:</span>
                        <span className="font-mono font-extrabold text-slate-800">{veh.currentLoad}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isOnline ? 'bg-orange-500' : isAvailable ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ 
                            width: veh.currentLoad.includes('80%') 
                              ? '80%' 
                              : veh.currentLoad.includes('88%') 
                              ? '88%' 
                              : veh.currentLoad.includes('68%') 
                              ? '68%' 
                              : '5%' 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedVehicleForModal(veh)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Live Telematics & Diagnostic</span>
                      </button>

                      <button
                        onClick={() => toggleVehicleStatus(veh.id)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
                      >
                        Change Status &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Diagnostic Telematics Modal */}
          {selectedVehicleForModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-scale-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-900 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg border-l-4 border-orange-500">
                        {selectedVehicleForModal.plateNumber}
                      </span>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                        {selectedVehicleForModal.category}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {selectedVehicleForModal.model}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedVehicleForModal(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Engine Status</span>
                      <span className="font-extrabold text-emerald-600">{selectedVehicleForModal.engineHealth}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Tyre Pressure</span>
                      <span className="font-extrabold text-slate-900">{selectedVehicleForModal.tirePressure}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Fuel / Battery Type</span>
                      <span className="font-extrabold text-slate-900">{selectedVehicleForModal.fuelType} ({selectedVehicleForModal.fuel}%)</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">LTA Inspection Due</span>
                      <span className="font-extrabold text-slate-900">{selectedVehicleForModal.nextInspection}</span>
                    </div>
                  </div>

                  {selectedVehicleForModal.cabinTemp && (
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <span className="text-blue-600 font-bold block text-[10px] uppercase">Cold Chain Cargo Temp</span>
                      <span className="font-mono font-extrabold text-blue-900 text-sm">{selectedVehicleForModal.cabinTemp}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Live Road Coordinates</span>
                    <p className="font-semibold text-slate-800">{selectedVehicleForModal.currentLocation}</p>
                    <p className="text-[11px] text-slate-500">Destination: {selectedVehicleForModal.destination} (ETA: {selectedVehicleForModal.eta})</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Roster Driver</span>
                      <span className="font-extrabold text-slate-900">{selectedVehicleForModal.driver}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">{selectedVehicleForModal.speed}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      toggleVehicleStatus(selectedVehicleForModal.id);
                      setSelectedVehicleForModal(null);
                    }}
                    className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer text-xs"
                  >
                    Toggle Duty Status
                  </button>
                  <button
                    onClick={() => setSelectedVehicleForModal(null)}
                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer text-xs"
                  >
                    Close Telematics
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Commercial Vehicle Modal */}
          {isAddVehicleModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Add Commercial Vehicle</h3>
                    <p className="text-xs text-slate-500">Register road haulage asset to Singapore fleet</p>
                  </div>
                  <button
                    onClick={() => setIsAddVehicleModalOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Singapore License Plate *</label>
                    <input
                      type="text"
                      value={newVehicleData.plateNumber}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, plateNumber: e.target.value })}
                      placeholder="e.g. SG-9120 or FL-450"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-xs focus-orange"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Make & Model *</label>
                    <input
                      type="text"
                      value={newVehicleData.model}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, model: e.target.value })}
                      placeholder="e.g. Scania R500 / Isuzu 24ft / BYD T3"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category</label>
                      <select
                        value={newVehicleData.category}
                        onChange={(e) => setNewVehicleData({ ...newVehicleData, category: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
                      >
                        <option value="Heavy Haulage">Heavy Haulage</option>
                        <option value="Cold Chain Haulage">Cold Chain Haulage</option>
                        <option value="EV Express Delivery">EV Express Delivery</option>
                        <option value="Container Haulage">Container Haulage</option>
                        <option value="Medium Cargo Hauler">Medium Cargo Hauler</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Fuel / Power</label>
                      <select
                        value={newVehicleData.fuelType}
                        onChange={(e) => setNewVehicleData({ ...newVehicleData, fuelType: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
                      >
                        <option value="Diesel">Diesel</option>
                        <option value="Electric (EV)">Electric (EV)</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Max Payload (kg)</label>
                      <input
                        type="text"
                        value={newVehicleData.capacity}
                        onChange={(e) => setNewVehicleData({ ...newVehicleData, capacity: e.target.value })}
                        placeholder="e.g. 15,000"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Assigned Driver</label>
                      <input
                        type="text"
                        value={newVehicleData.driver}
                        onChange={(e) => setNewVehicleData({ ...newVehicleData, driver: e.target.value })}
                        placeholder="e.g. David Tan"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Assigned Home Hub</label>
                    <select
                      value={newVehicleData.hub}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, hub: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange"
                    >
                      <option value="Changi Air Cargo Logistics Hub">Changi Air Cargo Logistics Hub</option>
                      <option value="Tuas Megaport">Tuas Megaport</option>
                      <option value="Jurong Hub">Jurong Hub</option>
                      <option value="Pasir Panjang Depot">Pasir Panjang Depot</option>
                      <option value="Woodlands Depot">Woodlands Depot</option>
                    </select>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddVehicleModalOpen(false)}
                      className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
                    >
                      Add to Fleet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                      itemStyle={{ color: '#F8FAFC' }}
                      labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
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
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          return (
                            <div className="bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl shadow-2xl text-xs flex items-center gap-2 pointer-events-none">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: data.payload?.fill || data.color || '#FF6B00' }} />
                              <span className="text-slate-200 font-semibold">{data.name}:</span>
                              <span className="font-bold text-white font-mono">{data.value}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
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
                  Client Directory & Accounts
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
                    <Tooltip 
                      formatter={(value) => [`S$ ${Number(value).toLocaleString()}`, 'Revenue']} 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                      itemStyle={{ color: '#F8FAFC' }}
                      labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
                    />
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
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                        itemStyle={{ color: '#F8FAFC' }}
                        labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
                      />
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

      {/* ========================================== */}
      {/* SETTINGS MODULE: PLATFORM & SYSTEM CONFIGURATION (adminTab === 'settings') */}
      {/* ========================================== */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  System Configuration & Governance
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  Singapore Regional Ops
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Admin Portal & Operations Settings</h2>
              <p className="text-xs text-slate-500">
                Configure Singapore dispatch rules, fleet telematics polling rates, company legal profile, security credentials, and system alerts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCompanySettings({
                    companyName: 'Josan Logistics Pte. Ltd.',
                    uen: '201829481K',
                    gstReg: 'M90382910X',
                    contactEmail: 'operations@josanlogistics.com',
                    supportPhone: '+65 6789 1234',
                    address: '7 Changi South Street 2, #03-01 Changi Logistics Centre, Singapore 486415',
                    currency: 'SGD ($)',
                    timezone: 'Asia/Singapore (UTC+8)',
                    operatingRegion: 'Singapore Domestic & Port Corridors',
                  });
                  showToast('Settings reset to default operational values.', 'info');
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* Settings Section Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
            {[
              { id: 'general', label: 'Company & Profile', icon: Building2 },
              { id: 'telematics', label: 'Fleet & Road Dispatch', icon: Truck },
              { id: 'security', label: 'Security & Access', icon: Shield },
              { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = settingsActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSettingsActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-2xs font-extrabold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: COMPANY & PROFILE SETTINGS */}
          {settingsActiveTab === 'general' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Legal Entity & Singapore Registration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Company Legal Name</label>
                    <input
                      type="text"
                      value={companySettings.companyName}
                      onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Singapore UEN (ACRA)</label>
                    <input
                      type="text"
                      value={companySettings.uen}
                      onChange={(e) => setCompanySettings({ ...companySettings, uen: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">IRAS GST Registration</label>
                    <input
                      type="text"
                      value={companySettings.gstReg}
                      onChange={(e) => setCompanySettings({ ...companySettings, gstReg: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Operations Contact Email</label>
                    <input
                      type="email"
                      value={companySettings.contactEmail}
                      onChange={(e) => setCompanySettings({ ...companySettings, contactEmail: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Dispatch Hotline Phone</label>
                    <input
                      type="text"
                      value={companySettings.supportPhone}
                      onChange={(e) => setCompanySettings({ ...companySettings, supportPhone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Operating Region</label>
                    <input
                      type="text"
                      value={companySettings.operatingRegion}
                      onChange={(e) => setCompanySettings({ ...companySettings, operatingRegion: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange shadow-2xs"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1">HQ Operating Depot Address</label>
                    <input
                      type="text"
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                  <Globe className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Regional Localization & Currency</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Operational Base Currency</label>
                    <select
                      value={companySettings.currency}
                      onChange={(e) => setCompanySettings({ ...companySettings, currency: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange cursor-pointer shadow-2xs"
                    >
                      <option value="SGD ($)">Singapore Dollar (SGD - $)</option>
                      <option value="USD ($)">US Dollar (USD - $)</option>
                      <option value="MYR (RM)">Malaysian Ringgit (MYR - RM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Platform Timezone</label>
                    <select
                      value={companySettings.timezone}
                      onChange={(e) => setCompanySettings({ ...companySettings, timezone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange cursor-pointer shadow-2xs"
                    >
                      <option value="Asia/Singapore (UTC+8)">Singapore Time (SGT, UTC+8)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save General Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FLEET & ROAD DISPATCH SETTINGS */}
          {settingsActiveTab === 'telematics' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Telematics & GPS Tracking Thresholds</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">GPS Telematics Polling</label>
                    <select
                      value={telematicsSettings.gpsRefreshInterval}
                      onChange={(e) => setTelematicsSettings({ ...telematicsSettings, gpsRefreshInterval: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange cursor-pointer shadow-2xs"
                    >
                      <option value="5">Every 5 Seconds (High Precision)</option>
                      <option value="10">Every 10 Seconds (Recommended)</option>
                      <option value="30">Every 30 Seconds</option>
                      <option value="60">Every 60 Seconds</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Speed Limit Flag (Expressway)</label>
                    <select
                      value={telematicsSettings.speedThreshold}
                      onChange={(e) => setTelematicsSettings({ ...telematicsSettings, speedThreshold: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange cursor-pointer shadow-2xs"
                    >
                      <option value="60">60 km/h (Industrial Zones)</option>
                      <option value="70">70 km/h (Heavy Haulage Default)</option>
                      <option value="80">80 km/h (Light Goods Commercial)</option>
                      <option value="90">90 km/h (Strict Max)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Geofence Arrival Radius</label>
                    <select
                      value={telematicsSettings.geofenceRadius}
                      onChange={(e) => setTelematicsSettings({ ...telematicsSettings, geofenceRadius: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange cursor-pointer shadow-2xs"
                    >
                      <option value="200">200 meters (Precise Depot Bay)</option>
                      <option value="500">500 meters (Standard Hub Staging)</option>
                      <option value="1000">1000 meters (Early Pre-Alert)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Cold-Chain Temp Breach Alert</label>
                    <select
                      value={telematicsSettings.reeferTempThreshold}
                      onChange={(e) => setTelematicsSettings({ ...telematicsSettings, reeferTempThreshold: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange cursor-pointer shadow-2xs"
                    >
                      <option value="-14.0">Above -14.0°C (Frozen Goods Alert)</option>
                      <option value="-16.0">Above -16.0°C (Recommended)</option>
                      <option value="-18.0">Above -18.0°C (Deep Freeze)</option>
                      <option value="4.0">Above 4.0°C (Chilled Reefer)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Operational Dispatch Toggles */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-3">
                  Automated Road Dispatch Rules
                </h3>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="font-extrabold text-slate-900">Auto-Assign Nearby Available Drivers</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Automatically match new confirmed shipments to available drivers stationed at the originating Singapore hub.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTelematicsSettings({ ...telematicsSettings, autoAssignDriver: !telematicsSettings.autoAssignDriver })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        telematicsSettings.autoAssignDriver ? 'bg-[#FF6B00] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="font-extrabold text-slate-900">Live Expressway Incident & Weather Monitoring</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Feed real-time traffic slowdowns along AYE, PIE, SLE, and KPE corridors into driver ETA forecasts.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTelematicsSettings({ ...telematicsSettings, expresswayMonitoring: !telematicsSettings.expresswayMonitoring })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        telematicsSettings.expresswayMonitoring ? 'bg-[#FF6B00] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="font-extrabold text-slate-900">Night Haulage Dispatch & Driver Rest Alerts</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Flag heavy prime movers operating between 10:00 PM and 06:00 AM to ensure MOM Singapore rest compliance.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTelematicsSettings({ ...telematicsSettings, nightHaulageAlert: !telematicsSettings.nightHaulageAlert })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        telematicsSettings.nightHaulageAlert ? 'bg-[#FF6B00] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Telematics Rules</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & ACCESS SETTINGS */}
          {settingsActiveTab === 'security' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Admin Profile Details */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">Authenticated Admin Session</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged In Admin</span>
                        <span className="font-extrabold text-slate-900 text-sm">Darren Josan</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase">
                        Super Admin
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security ID & Contact</span>
                      <span className="font-mono font-bold text-slate-800">admin@josanlogistics.com</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Last login verified via 2FA from Singapore Regional IP</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">Two-Factor Authentication (2FA)</span>
                        <button
                          type="button"
                          onClick={() => setSecuritySettings({ ...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth })}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            securitySettings.twoFactorAuth ? 'bg-[#FF6B00] justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Requires authenticator app code on login for all admin accounts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleUpdateAdminPassword} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                    <Key className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">Update Super Admin Password</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Current Password</label>
                      <input
                        type="password"
                        value={adminPasswordForm.currentPassword}
                        onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, currentPassword: e.target.value })}
                        placeholder="Enter current password..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">New Password</label>
                      <input
                        type="password"
                        value={adminPasswordForm.newPassword}
                        onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, newPassword: e.target.value })}
                        placeholder="Minimum 8 characters with numbers..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={adminPasswordForm.confirmPassword}
                        onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, confirmPassword: e.target.value })}
                        placeholder="Re-type new password..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus-orange shadow-2xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold transition-all shadow-2xs cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Governance Toggles */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-3">
                  Security Governance & Session Policies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="font-extrabold text-slate-900">Enforce Digital POD Signatures</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Drivers cannot complete a delivery without client digital sign-off and photo proof.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecuritySettings({ ...securitySettings, requireDriverSignoff: !securitySettings.requireDriverSignoff })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        securitySettings.requireDriverSignoff ? 'bg-[#FF6B00] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="font-extrabold text-slate-900">Detailed Audit Trail Logging</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Record timestamped operator logs for any pricing or consignment status modification.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecuritySettings({ ...securitySettings, auditLogging: !securitySettings.auditLogging })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        securitySettings.auditLogging ? 'bg-[#FF6B00] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALERTS & NOTIFICATIONS SETTINGS */}
          {settingsActiveTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                  <Bell className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Real-Time Operational Dispatch Alerts</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      key: 'delayedShipments',
                      title: 'Consignment Delay & SLA Flags',
                      desc: 'Trigger instantaneous admin alert when vehicle telemetry projects a delivery delay exceeding 15 minutes.'
                    },
                    {
                      key: 'expresswayCongestion',
                      title: 'Expressway Traffic & Incident Alerts',
                      desc: 'Notify dispatchers of severe congestion or road closures across PIE, AYE, CTE, or SLE expressways.'
                    },
                    {
                      key: 'driverDutyStatus',
                      title: 'Driver Duty Status & Check-ins',
                      desc: 'Receive alerts when rostered drivers start shift, go offline, or report unscheduled maintenance.'
                    },
                    {
                      key: 'newOrderInbound',
                      title: 'New Online Consignment Orders',
                      desc: 'Sound dashboard notification when customers book a consignment or request a priority freight quote.'
                    },
                    {
                      key: 'podSignatureUploaded',
                      title: 'Proof of Delivery (POD) Receipts',
                      desc: 'Notify operations when a driver successfully uploads a signed delivery note or handover photo.'
                    },
                    {
                      key: 'dailyOperationsSummary',
                      title: 'Daily 08:00 AM Dispatch Digest',
                      desc: 'Generate automated daily roster, capacity utilization, and pending deliveries overview.'
                    },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                      <div className="pr-3">
                        <p className="font-extrabold text-slate-900">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{notif.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [notif.key]: !notificationSettings[notif.key]
                        })}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                          notificationSettings[notif.key] ? 'bg-[#FF6B00] justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

        </div>
      </div>

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
