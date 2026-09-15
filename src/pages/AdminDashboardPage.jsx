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
  MessageSquare
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { 
    shipments, 
    drivers, 
    warehouses, 
    analyticsData, 
    updateShipmentStatus, 
    flagWeatherDelay,
    assignDriver, 
    addDriver, 
    updateDriverPassword,
    updateDriverPhoto,
    removeDriver, 
    toggleDriverStatus,
    addWarehouse,
    updateWarehouse,
    removeWarehouse,
    updateWarehouseBinStatus,
    setSelectedInvoiceShipment,
    deleteShipment,
    showToast 
  } = useLogistics();

  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'overview' | 'orders' | 'drivers' | 'warehouses' | 'analytics'
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');

  // Message modal & order deletion state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetOrder, setMessageTargetOrder] = useState(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageText, setMessageText] = useState('');

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

  // Filtered orders list
  const filteredShipments = shipments.filter(s => {
    const matchesFilter = orderFilter === 'All' || s.status === orderFilter;
    const matchesSearch = !orderSearch || 
      s.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
      s.sender.toLowerCase().includes(orderSearch.toLowerCase()) ||
      s.receiver.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          { id: 'orders', label: `Order Management (${shipments.length})`, icon: Package },
          { id: 'drivers', label: `Driver Roster (${drivers.length})`, icon: Truck },
          { id: 'warehouses', label: `Warehouses (${warehouses.length})`, icon: Warehouse },
          { id: 'analytics', label: 'Reports & Analytics', icon: TrendingUp },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                adminTab === tab.id
                  ? 'bg-orange-gradient text-white shadow-orange-sm font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: DASHBOARD OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Shipments</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{analyticsData.kpis.totalShipments}</h3>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12.4% vs last month
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Active Deliveries</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{analyticsData.kpis.activeDeliveries}</h3>
                <span className="text-[11px] font-bold text-orange-600 flex items-center mt-1">
                  <Truck className="w-3.5 h-3.5 mr-1 animate-pulse" /> Live in transit
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-orange-sm">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Monthly Revenue</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{analyticsData.kpis.monthlyRevenue}</h3>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.2% YoY Growth
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Fleet SLA Alerts</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-1">2 Flagged</h3>
                <span className="text-[11px] font-bold text-amber-700 flex items-center mt-1">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Weather & Traffic delay
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
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

      {/* MODULE 2: ORDER MANAGEMENT MODULE */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Order Management Module</h2>
              <p className="text-xs text-slate-500">View orders in table format, assign drivers, and update live status.</p>
            </div>

            {/* Filter & Search controls */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order ID or client..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus-orange"
                />
              </div>

              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="py-1.5 px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus-orange"
              >
                <option value="All">All Statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          {/* Orders Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Client / Sender</th>
                  <th className="p-3">Route (Origin → Dest)</th>
                  <th className="p-3">Assigned Driver</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-extrabold text-orange-600">{order.id}</td>
                    <td className="p-3 font-bold text-slate-900">{order.sender}</td>
                    <td className="p-3 font-semibold text-slate-700">{order.origin} → {order.destination}</td>
                    <td className="p-3 font-semibold text-slate-800">
                      {order.driverName || 'Unassigned'}
                      <button
                        onClick={() => setAssignModalShipment(order)}
                        className="ml-2 text-[10px] text-orange-600 underline font-bold"
                      >
                        Change
                      </button>
                    </td>
                    <td className="p-3">
                      {/* Interactive Status Update Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => updateShipmentStatus(order.id, e.target.value)}
                        className={`p-1 rounded text-[11px] font-extrabold border cursor-pointer ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : order.status === 'Delayed'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-orange-100 text-orange-800 border-orange-300 font-extrabold'
                        }`}
                      >
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {/* Colored Payment Status Pill */}
                      {order.paymentStatus === 'Failed' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                          <span>Failed</span>
                        </span>
                      ) : order.paymentStatus === 'Pending' || order.paymentStatus === 'Unpaid' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>Pending</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Paid</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">{order.price}</td>
                    <td className="p-3 text-right space-x-1.5 flex items-center justify-end">
                      <button
                        onClick={() => flagWeatherDelay(order.id, 'Heavy Thunderstorm & Flash Flood Alert')}
                        title="Flag automated weather telematics delay & dispatch SMS/Email notifications"
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-extrabold transition-all flex items-center space-x-1"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>⛈️ Weather Delay</span>
                      </button>
                      <button
                        onClick={() => setSelectedInvoiceShipment(order)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-bold"
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() => handleOpenMessageModal(order)}
                        title="Send message to company/client regarding this order"
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-extrabold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                        <span>Message</span>
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Delete order permanently"
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-extrabold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MODULE 3: DRIVER MANAGEMENT MODULE */}
      {adminTab === 'drivers' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Driver & Fleet Roster</h2>
                <p className="text-xs text-slate-500">Track driver availability, safety scores, and performance telemetry.</p>
              </div>
              <button
                onClick={() => setIsAddDriverOpen(true)}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Driver</span>
              </button>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => (
                <div key={driver.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 relative shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative group shrink-0">
                        <img src={driver.photo} alt={driver.name} className="w-12 h-12 rounded-full object-cover border-2 border-orange-500" />
                        <label
                          htmlFor={`driver-card-photo-${driver.id}`}
                          className="absolute inset-0 bg-slate-900/65 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Click to Upload / Change Driver Photo"
                        >
                          <Camera className="w-4 h-4" />
                        </label>
                        <input
                          id={`driver-card-photo-${driver.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateDriverPhoto(driver.id, reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm font-sans">{driver.name}</h4>
                        <p className="text-xs text-orange-600 font-semibold">{driver.vehicleType} ({driver.vehicleId || 'SG-900'})</p>
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
                      <span className="font-extrabold text-slate-900">⭐ {driver.rating} ({driver.onTimeRate})</span>
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
                      {driver.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              {/* Driver Profile Photo Upload */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="relative shrink-0">
                    <img
                      src={newDriverData.photo || defaultDriverPhoto}
                      alt="Driver Avatar Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                    />
                    <span className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full text-[10px] shadow">
                      <Camera className="w-3 h-3" />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Driver Profile Photo</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Upload custom profile image file (JPG, PNG).</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <label
                    htmlFor="adminDriverPhotoInput"
                    className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold transition-all shadow-orange-sm cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{newDriverData.photo && newDriverData.photo !== defaultDriverPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                  </label>
                  <input
                    id="adminDriverPhotoInput"
                    type="file"
                    accept="image/*"
                    onChange={handleDriverPhotoUpload}
                    className="hidden"
                  />
                  {newDriverData.photo && newDriverData.photo !== defaultDriverPhoto && (
                    <button
                      type="button"
                      onClick={() => setNewDriverData(prev => ({ ...prev, photo: defaultDriverPhoto }))}
                      className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
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

    </div>
  );
};
