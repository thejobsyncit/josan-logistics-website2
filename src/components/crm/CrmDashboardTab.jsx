import React from 'react';
import {
  Users,
  Plane,
  Truck,
  FileText,
  FileSpreadsheet,
  Receipt,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
  ArrowRight,
  Building2,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Handshake,
  DollarSign
} from 'lucide-react';

export const CrmDashboardTab = ({
  customers = [],
  airwayRequests = [],
  shipments = [],
  documents = [],
  quotes = [],
  invoices = [],
  transportationPartners = [],
  onNavigateTab,
  onOpenAirwayDetails,
  onOpenRoadDetails,
  onOpenCustomerDetails,
  onOpenInvoiceDetails
}) => {
  // Computed metrics according to CRM specification:
  const totalCustomers = customers.length;
  const newAirwayRequests = airwayRequests.filter(r => r.status === 'New' || r.status == 'Under review').length;
  const activeRoadShipments = shipments.filter(s => !['Delivered', 'Completed', 'Cancelled'].includes(s.status)).length;
  const pendingDocuments = documents.filter(d => d.status === 'Pending' || d.status === 'Pending Review' || d.status === 'Draft').length;
  const pendingQuotations = quotes.filter(q => q.status === 'New').length;
  const pendingBilling = invoices.filter(i => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Pending').length;

  // Completed requests: airway completed + road delivered
  const completedAirway = airwayRequests.filter(r => r.status === 'Completed').length;
  const completedRoad = shipments.filter(
    s => s.status === 'Delivered' || s.status === 'Completed'
  ).length;
  const completedRequests = completedAirway + completedRoad;

  // Billing revenue metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.total) || Number(inv.subtotal) || 0), 0);
  const totalCollected = invoices
    .filter(inv => inv.paymentStatus === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || Number(inv.subtotal) || 0), 0);

  // Helper to parse dates safely for timeline ordering
  const parseActivityTimestamp = (val) => {
    if (!val) return 0;
    const t = new Date(val).getTime();
    return isNaN(t) ? 0 : t;
  };

  const formatActivityDate = (val) => {
    if (!val) return 'Recent';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val).split(' ')[0] || 'Recent';
    return d.toLocaleDateString();
  };

  // Compile unified recent activity timeline from all modules, chronologically sorted:
  const recentActivities = [
    ...quotes.map(q => {
      const isQuoted = String(q.status || '').toLowerCase().includes('quoted');
      const isDeclined = String(q.status || '').toLowerCase().includes('declined') || String(q.status || '').toLowerCase().includes('reject');
      const badgeColor = isQuoted
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : isDeclined
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-blue-50 text-blue-700 border-blue-200';

      return {
        id: `act-quote-${q.id || q.reference}`,
        type: 'quote',
        title: `Quotation #${q.reference || q.id}`,
        subtitle: `${q.company_name || q.contact_name || q.company || q.customerName || 'Commercial Client'} • ${q.quoted_amount ? `S$ ${Number(q.quoted_amount).toLocaleString()}` : 'Not quoted yet'}`,
        date: formatActivityDate(q.created_at),
        timestamp: parseActivityTimestamp(q.created_at),
        status: q.status || 'New',
        badgeColor,
        icon: <FileSpreadsheet className="w-4 h-4 text-amber-600" />,
        iconBg: 'bg-amber-50',
        raw: q
      };
    }),
    ...airwayRequests.map(r => {
      const s = String(r.status || '').toLowerCase();
      const badgeColor = s.includes('completed')
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : s.includes('review')
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : s.includes('doc')
        ? 'bg-purple-50 text-purple-700 border-purple-200'
        : s.includes('bill')
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-slate-100 text-slate-700 border-slate-200';

      return {
        id: `act-air-${r.id}`,
        type: 'airway',
        title: `Air Freight #${r.id}`,
        subtitle: `${r.customerName || 'Customer'} • ${r.origin?.split(',')[0] || 'Origin'} → ${r.destination?.split(',')[0] || 'Destination'}`,
        date: formatActivityDate(r.date || r.created_at),
        timestamp: parseActivityTimestamp(r.created_at || r.date),
        status: r.status || 'New',
        badgeColor,
        icon: <Plane className="w-4 h-4 text-blue-600" />,
        iconBg: 'bg-blue-50',
        raw: r
      };
    }),
    ...shipments.map(s => {
      const st = String(s.status || '').toLowerCase();
      const badgeColor = st.includes('delivered') || st.includes('completed')
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : st.includes('transit') || st.includes('active')
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : st.includes('cancel')
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200';

      return {
        id: `act-road-${s.id}`,
        type: 'road',
        title: `Road Shipment #${s.id}`,
        subtitle: `${s.sender || s.customerName || 'Customer'} • ${s.origin || 'Origin'} → ${s.destination || 'Destination'}`,
        date: formatActivityDate(s.createdDate),
        timestamp: parseActivityTimestamp(s.createdDate),
        status: s.status || 'Active',
        badgeColor,
        icon: <Truck className="w-4 h-4 text-emerald-600" />,
        iconBg: 'bg-emerald-50',
        raw: s
      };
    }),
    ...invoices.map(i => {
      const isPaid = String(i.paymentStatus || '').toLowerCase().includes('paid');
      const badgeColor = isPaid
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200';

      return {
        id: `act-inv-${i.id}`,
        type: 'billing',
        title: `Invoice #${i.invoiceNumber}`,
        subtitle: `${i.customerName || 'Customer'} • S$ ${Number(i.total || i.subtotal || 0).toLocaleString()}`,
        date: formatActivityDate(i.issueDate),
        timestamp: parseActivityTimestamp(i.issueDate),
        status: i.paymentStatus || 'Unpaid',
        badgeColor,
        icon: <Receipt className="w-4 h-4 text-indigo-600" />,
        iconBg: 'bg-indigo-50',
        raw: i
      };
    })
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 8);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-[#0B1F5B] via-[#16223F] to-[#0B1F5B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2463EB]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div>
              <span className="text-lg sm:text-xl font-medium font-sans text-slate-300 tracking-normal">
                Josan Logistics
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans text-white leading-[1.15] tracking-normal">
              Operations & Customer Relationship Hub
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Air freight documents, road jobs with partner carriers, quotes and billing in one place.
            </p>
          </div>

          {/* Quick Metrics Badge Strip */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 shrink-0">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-300">Total Billed</p>
              <p className="text-lg font-black font-mono text-white mt-0.5">S$ {totalInvoiced.toLocaleString()}</p>
            </div>
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Revenue Settled</p>
              <p className="text-lg font-black font-mono text-emerald-400 mt-0.5">S$ {totalCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid (Directly matching Dashboard requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {/* 1. Total Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">Customers</span>
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{totalCustomers}</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5 truncate">Customers / Shippers</span>
          </div>
        </div>

        {/* 2. New Airway Requests */}
        <div
          onClick={() => onNavigateTab('airway-requests')}
          className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">Air Freight Requests</span>
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Plane className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-blue-600 font-mono tracking-tight">{newAirwayRequests}</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5 truncate">New / Under Review</span>
          </div>
        </div>

        {/* 3. Active Road Shipments */}
        <div
          onClick={() => onNavigateTab('road-shipments')}
          className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">Road Jobs</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600 font-mono tracking-tight">{activeRoadShipments}</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5 truncate">Active Transportation</span>
          </div>
        </div>

        {/* 4. Pending Documents */}
        <div
          onClick={() => onNavigateTab('documents')}
          className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">Shipment Documents</span>
            <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-600 font-mono tracking-tight">{pendingDocuments || documents.length}</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5 truncate">Verified / In Review</span>
          </div>
        </div>

        {/* 5. Pending Quotations */}
        <div
          onClick={() => onNavigateTab('quotations')}
          className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">Quotations</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600 font-mono tracking-tight">{pendingQuotations}</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5 truncate">Open & Sent Quotes</span>
          </div>
        </div>

        {/* 6. Pending Billing */}
        <div
          onClick={() => onNavigateTab('billing')}
          className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">Pending Billing</span>
            <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-600 font-mono tracking-tight">{pendingBilling}</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5 truncate">Awaiting Payment</span>
          </div>
        </div>

        {/* 7. Completed Requests */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">Completed</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{completedRequests}</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5 truncate">Fulfilled & Archived</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Two Columns - Active Pipelines & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 spans): Air Waybill Service Workflow Status */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Air Waybill Service Workflow Status</h3>
                  <p className="text-[11px] text-slate-500">AWB preparation, billing and shipment documentation.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('airway-requests')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>View All ({airwayRequests.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
              {[
                { label: 'New', count: airwayRequests.filter(r => r.status === 'New').length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'Under Review', count: airwayRequests.filter(r => r.status === 'Under Review').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: 'Documentation', count: airwayRequests.filter(r => r.status === 'Documentation').length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { label: 'Billing', count: airwayRequests.filter(r => r.status === 'Billing').length, color: 'bg-slate-50 text-slate-700 border-slate-200' },
                { label: 'Completed', count: airwayRequests.filter(r => r.status === 'Completed').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              ].map((st, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-center ${st.color}`}>
                  <p className="text-xl font-bold font-mono">{st.count}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Recent Activity Feed (Human-Made, Slight Curve, No Gradients) */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-sm text-slate-900">Recent CRM Activity</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Latest updates
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {recentActivities.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-medium">
                  No recent activities recorded.
                </div>
              ) : (
                recentActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => {
                      if (act.type === 'airway' && onOpenAirwayDetails) onOpenAirwayDetails(act.raw);
                      if (act.type === 'road' && onOpenRoadDetails) onOpenRoadDetails(act.raw);
                      if (act.type === 'billing' && onOpenInvoiceDetails) onOpenInvoiceDetails(act.raw);
                      if (act.type === 'quote') onNavigateTab('quotations');
                    }}
                    className="p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer group flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${act.iconBg}`}>
                      {act.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {act.title}
                        </p>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 border ${act.badgeColor}`}>
                          {act.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {act.subtitle}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {act.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5 font-medium text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Josan Logistics Operations</span>
            </span>

            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] cursor-pointer hover:underline"
            >
              System Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
