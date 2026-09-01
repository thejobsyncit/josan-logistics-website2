import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
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
  FileCheck
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
    removeDriver, 
    toggleDriverStatus,
    addWarehouse,
    updateWarehouse,
    removeWarehouse,
    updateWarehouseBinStatus,
    setSelectedInvoiceShipment,
    showToast 
  } = useLogistics();

  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'orders' | 'drivers' | 'warehouses' | 'analytics'
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');

  // Driver modal state
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [newDriverData, setNewDriverData] = useState({ 
    name: '', 
    phone: '', 
    vehicleType: 'Refrigerated Van', 
    vehicleId: 'FL-900', 
    licenseNumber: 'DL-99102',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  });

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
    if (cleanDigits.length < 8) {
      showToast('Singapore driver contact number must contain exactly 8 digits (e.g. 91234567)', 'warning');
      return;
    }

    if (newDriverData.name && cleanDigits) {
      addDriver({
        ...newDriverData,
        phone: `+65 ${cleanDigits}`,
        status: 'Available',
        photo: newDriverData.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
      });
      setIsAddDriverOpen(false);
      setNewDriverData({ 
        name: '', 
        phone: '', 
        vehicleType: 'Refrigerated Van', 
        vehicleId: 'SG-900', 
        licenseNumber: 'SG-CLASS4-991',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
      });
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Admin Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border-t-4 border-orange-500 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Control Center & Operations Hub
          </span>
          <h1 className="text-3xl font-extrabold font-sans">Josan Fleet Admin Portal</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Manage global dispatch, driver allocations, warehouse inventory & revenue analytics.</p>
        </div>

        <div className="relative z-10 flex items-center space-x-3">
          <span className="flex items-center text-xs font-bold text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
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

            <div className="lg:col-span-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border-t-4 border-orange-500">
              <h2 className="text-lg font-extrabold text-white">Operations Actions</h2>
              <div className="space-y-3 text-xs">
                <button
                  onClick={() => setAdminTab('orders')}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all text-left flex items-center justify-between"
                >
                  <span>Dispatch New Order</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setAdminTab('drivers'); setIsAddDriverOpen(true); }}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-left flex items-center justify-between"
                >
                  <span>Register New Fleet Driver</span>
                  <Plus className="w-4 h-4 text-orange-400" />
                </button>
                <button
                  onClick={handleDownloadPDFReport}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>Generate Financial Report</span>
                  <Download className="w-4 h-4 text-orange-400" />
                </button>
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
                <div key={driver.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={driver.photo} alt={driver.name} className="w-12 h-12 rounded-full object-cover border-2 border-orange-500" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{driver.name}</h4>
                        <p className="text-xs text-orange-600 font-semibold">{driver.vehicleType}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeDriver(driver.id)}
                      className="text-slate-400 hover:text-rose-500 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-bold">Rating & SLA</span>
                      <span className="font-extrabold text-slate-900">⭐ {driver.rating} ({driver.onTimeRate})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Completed</span>
                      <span className="font-extrabold text-slate-900">{driver.deliveriesCompleted} Freight</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-semibold">Status:</span>
                    <button
                      onClick={() => toggleDriverStatus(driver.id, driver.status === 'Available' ? 'On Delivery' : 'Available')}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-md w-full space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Add New Fleet Driver</h3>
            <form onSubmit={handleAddDriverSubmit} className="space-y-3.5 text-xs">
              {/* Driver Photo Upload & Presets */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Driver Profile Photo</label>
                <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <img 
                    src={newDriverData.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'} 
                    alt="Driver Preview" 
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-sm shrink-0" 
                  />
                  <div className="space-y-1 flex-1">
                    <label className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-extrabold transition-colors inline-flex items-center space-x-1.5 cursor-pointer shadow-orange-sm">
                      <span>📸 Upload Custom Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewDriverData({ ...newDriverData, photo: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">Choose an image file from your device, or click a preset avatar.</p>
                  </div>
                </div>

                {/* Quick Avatar Presets */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Preset Avatars:</span>
                  {[
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewDriverData({ ...newDriverData, photo: url })}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        newDriverData.photo === url ? 'border-orange-500 scale-110 ring-2 ring-orange-300' : 'border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Driver Full Name *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Alphabets Only</span>
                </label>
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
                  <span>Phone Contact (Singapore 8-Digit) *</span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">Digits Only</span>
                </label>
                <div className="flex items-center">
                  <span className="p-2.5 bg-slate-100 border border-slate-300 rounded-l-lg text-slate-900 font-extrabold text-xs shrink-0 border-r-0">
                    🇸🇬 +65
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    value={newDriverData.phone}
                    onChange={(e) => {
                      const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                      setNewDriverData({ ...newDriverData, phone: numericOnly });
                    }}
                    placeholder="e.g. 91234567"
                    className="w-full p-2.5 border border-slate-300 rounded-r-lg focus-orange font-mono font-bold"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">Strictly 8 numbers only (Alphabets & extra digits blocked)</span>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
                <select
                  value={newDriverData.vehicleType}
                  onChange={(e) => setNewDriverData({ ...newDriverData, vehicleType: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold cursor-pointer"
                >
                  <option value="Heavy 18-Wheeler Truck">Heavy 18-Wheeler Truck</option>
                  <option value="Refrigerated Van">Refrigerated Van</option>
                  <option value="Sprinter Express Cargo">Sprinter Express Cargo</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDriverOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 text-white rounded-lg font-bold shadow-orange-sm hover:bg-orange-600"
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

      {/* ASSIGN DRIVER MODAL */}
      {assignModalShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-md w-full space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Assign Driver to {assignModalShipment.id}</h3>
            <p className="text-xs text-slate-500">Select an available driver from roster:</p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {drivers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    assignDriver(assignModalShipment.id, d.id);
                    setAssignModalShipment(null);
                  }}
                  className="w-full p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-xl text-left flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <p className="font-extrabold text-slate-900">{d.name}</p>
                    <p className="text-[11px] text-slate-500">{d.vehicleType} ({d.status})</p>
                  </div>
                  <span className="text-xs font-bold text-orange-600">Assign →</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setAssignModalShipment(null)}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
