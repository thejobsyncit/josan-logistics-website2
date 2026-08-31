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
    assignDriver, 
    addDriver, 
    removeDriver, 
    toggleDriverStatus,
    setSelectedInvoiceShipment,
    showToast 
  } = useLogistics();

  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'orders' | 'drivers' | 'warehouses' | 'analytics'
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');

  // Driver modal state
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [newDriverData, setNewDriverData] = useState({ name: '', phone: '', vehicleType: 'Refrigerated Van', vehicleId: 'FL-900', licenseNumber: 'DL-99102' });

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

  const handleAddDriverSubmit = (e) => {
    e.preventDefault();
    if (newDriverData.name && newDriverData.phone) {
      addDriver({
        ...newDriverData,
        status: 'Available'
      });
      setIsAddDriverOpen(false);
      setNewDriverData({ name: '', phone: '', vehicleType: 'Refrigerated Van', vehicleId: 'FL-900', licenseNumber: 'DL-99102' });
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
                  onClick={() => setAdminTab('analytics')}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-left flex items-center justify-between"
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
                    <td className="p-3 text-right space-x-2">
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
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                  {warehouses.length} Active Global Hubs
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {warehouses.map((wh) => (
                <div key={wh.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{wh.name}</h4>
                      <p className="text-xs text-slate-500">{wh.location} • Mgr: {wh.manager}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                      {wh.capacityPercentage}% Occupied
                    </span>
                  </div>

                  {/* Storage Capacity Gauge Progress Bar */}
                  <div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-orange-gradient h-full rounded-full transition-all duration-500"
                        style={{ width: `${wh.capacityPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
                      <span>Capacity: {wh.capacitySqFt}</span>
                      <span>{wh.activeParcels} Active Parcels</span>
                    </div>
                  </div>

                  {/* Dispatch Control Stats */}
                  <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Incoming Today</span>
                      <span className="font-extrabold text-emerald-600 flex items-center">
                        ↓ {wh.incomingToday} Parcels
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Outgoing Dispatch</span>
                      <span className="font-extrabold text-orange-600 flex items-center">
                        ↑ {wh.outgoingToday} Parcels
                      </span>
                    </div>
                  </div>

                  {/* Bin Parcel Storage Logs */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700 uppercase">Storage Bin Parcel Logs</p>
                      <button
                        onClick={() => showToast(`Triggered auto bin-sorting for ${wh.name}`)}
                        className="text-[10px] font-bold text-orange-600 hover:underline"
                      >
                        Sort Bins
                      </button>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      {wh.bins.map((bin, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                          <span className="font-mono font-bold text-orange-600">{bin.binId}</span>
                          <span className="text-slate-800 font-semibold truncate max-w-[110px]">{bin.item}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] rounded font-extrabold ${
                            bin.priority === 'High' || bin.priority === 'Critical' || bin.priority === 'Urgent'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {bin.status}
                          </span>
                        </div>
                      ))}
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
                onClick={() => showToast('Financial & Operations report exported in PDF format')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md"
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
                  <h3 className="text-2xl font-extrabold text-emerald-900 mt-1">{analyticsData.kpis.onTimeDeliveryRate}</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">SLA Guaranteed Delivery</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-orange-800 uppercase">Monthly Revenue Trend</p>
                  <h3 className="text-2xl font-extrabold text-orange-900 mt-1">{analyticsData.kpis.monthlyRevenue}</h3>
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

            {/* Revenue Trend Line Chart in Lalamove Orange Theme */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-700">Monthly Freight Revenue Growth ($)</h3>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.monthlyRevenueChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#F26722" strokeWidth={3} dot={{ fill: '#F26722', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Delays Breakdown Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-700">Delay Factor Analysis (%)</h3>
                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.delaysBreakdown}>
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
                  {analyticsData.serviceBreakdown.map((item, idx) => (
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
            <form onSubmit={handleAddDriverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  value={newDriverData.name}
                  onChange={(e) => setNewDriverData({ ...newDriverData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Contact</label>
                <input
                  type="text"
                  value={newDriverData.phone}
                  onChange={(e) => setNewDriverData({ ...newDriverData, phone: e.target.value })}
                  placeholder="+1 (555) 0192"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
                <select
                  value={newDriverData.vehicleType}
                  onChange={(e) => setNewDriverData({ ...newDriverData, vehicleType: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus-orange font-semibold"
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
