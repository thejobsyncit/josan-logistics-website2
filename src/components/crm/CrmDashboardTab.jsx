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
  Sparkles,
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
  const pendingQuotations = quotes.filter(q => q.status === 'Draft' || q.status === 'Sent' || q.status === 'Pending').length;
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

  // Compile unified recent activity timeline from all modules:
  const recentActivities = [
    ...airwayRequests.map(r => ({
      id: `act-air-${r.id}`,
      type: 'airway',
      title: `Airway Request #${r.id} (${r.status})`,
      subtitle: `${r.customerName} • ${r.origin?.split(',')[0]} → ${r.destination?.split(',')[0]}`,
      date: r.date || 'Recent',
      status: r.status,
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      raw: r
    })),
    ...shipments.map(s => ({
      id: `act-road-${s.id}`,
      type: 'road',
      title: `Road Shipment #${s.id} (${s.status})`,
      subtitle: `${s.sender || s.customerName} • ${s.origin} → ${s.destination}`,
      date: s.createdDate ? s.createdDate.split(' ')[0] : 'Recent',
      status: s.status,
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      raw: s
    })),
    ...quotes.map(q => ({
      id: `act-quote-${q.id}`,
      type: 'quote',
      title: `Quotation #${q.id} (${q.status})`,
      subtitle: `${q.customerName} • S$ ${Number(q.amount || q.lineItems?.finalAmount || 0).toLocaleString()}`,
      date: q.createdAt?.split(' ')[0] || 'Recent',
      status: q.status,
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      raw: q
    })),
    ...invoices.map(i => ({
      id: `act-inv-${i.id}`,
      type: 'billing',
      title: `Invoice #${i.invoiceNumber} (${i.paymentStatus})`,
      subtitle: `${i.customerName} • S$ ${Number(i.total || i.subtotal || 0).toLocaleString()}`,
      date: i.issueDate || 'Recent',
      status: i.paymentStatus,
      badgeColor: i.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200',
      raw: i
    }))
  ].slice(0, 8);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-[#0B1F5B] via-[#16223F] to-[#0B1F5B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2463EB]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#2463EB]/20 text-[#2463EB] border border-[#2463EB]/30 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Josan Logistics CRM</span>
              </span>
              <span className="text-white/60 text-xs font-mono font-medium">
                Josan Logistics Operations Suite
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">
              Operations & Customer Relationship Hub
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Consolidated command center managing airway documentation services, third-party transportation partners, quotations, customer billing.
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
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Customers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 font-mono">{totalCustomers}</span>
            <span className="text-[10px] font-bold text-slate-600 block mt-0.5">Customers / Shippers</span>
          </div>
        </div>

        {/* 2. New Airway Requests */}
        <div
          onClick={() => onNavigateTab('airway-requests')}
          className="bg-white p-4 rounded-2xl border border-[#DCE5F0]/90 shadow-2xs hover:shadow-md hover:border-[#2463EB]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0B1F5B]">Airway Requests</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#2463EB] font-mono">{newAirwayRequests}</span>
            <span className="text-[10px] font-bold text-[#0B1F5B] block mt-0.5">New / Under Review</span>
          </div>
        </div>

        {/* 3. Active Road Shipments */}
        <div
          onClick={() => onNavigateTab('road-shipments')}
          className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Road Shipments</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600 font-mono">{activeRoadShipments}</span>
            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Active Transportation</span>
          </div>
        </div>

        {/* 4. Pending Documents */}
        <div
          onClick={() => onNavigateTab('documents')}
          className="bg-white p-4 rounded-2xl border border-purple-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-800">Documents</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-purple-600 font-mono">{pendingDocuments || documents.length}</span>
            <span className="text-[10px] font-bold text-purple-700 block mt-0.5">Verified / In Review</span>
          </div>
        </div>

        {/* 5. Pending Quotations */}
        <div
          onClick={() => onNavigateTab('quotations')}
          className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Quotations</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600 font-mono">{pendingQuotations}</span>
            <span className="text-[10px] font-bold text-amber-700 block mt-0.5">Open & Sent Quotes</span>
          </div>
        </div>

        {/* 6. Pending Billing */}
        <div
          onClick={() => onNavigateTab('billing')}
          className="bg-white p-4 rounded-2xl border border-rose-200/90 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">Pending Billing</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-600 font-mono">{pendingBilling}</span>
            <span className="text-[10px] font-bold text-rose-700 block mt-0.5">Awaiting Payment</span>
          </div>
        </div>

        {/* 7. Completed Requests */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 font-mono">{completedRequests}</span>
            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Fulfilled & Archived</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Two Columns - Active Pipelines & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Operational Status & Service Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Airway Services Status Strip */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Airway Service Workflow Status</h3>
                  <p className="text-[11px] text-slate-500">AWB Preparation, Billing, Documentation & Transportation Support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('airway-requests')}
                className="text-xs font-bold text-[#2463EB] hover:text-[#1D4ED8] flex items-center space-x-1 cursor-pointer"
              >
                <span>View All ({airwayRequests.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
              {[
                { label: 'New', count: airwayRequests.filter(r => r.status === 'New').length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'Under Review', count: airwayRequests.filter(r => r.status === 'Under Review').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: 'Documentation', count: airwayRequests.filter(r => r.status === 'Documentation').length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { label: 'Billing', count: airwayRequests.filter(r => r.status === 'Billing').length, color: 'bg-[#EAF2FF] text-[#0B1F5B] border-[#DCE5F0]' },
                { label: 'Coordination', count: airwayRequests.filter(r => r.status === 'Transportation Coordination').length, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
                { label: 'Completed', count: airwayRequests.filter(r => r.status === 'Completed').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              ].map((st, idx) => (
                <div key={idx} className={`p-3 rounded-xl border text-center ${st.color}`}>
                  <p className="text-xl font-black font-mono">{st.count}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider mt-0.5">{st.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Road Transportation & Partners Strip */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Road Transportation Partners</h3>
                  <p className="text-[11px] text-slate-500">Transportation arrangements through third-party partners</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('transportation-partners')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>View Partners ({transportationPartners.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {transportationPartners.slice(0, 4).map((p) => (
                <div key={p.id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5 truncate pr-2">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{p.operatingZones || p.serviceArea}</p>
                    <span className="inline-block px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold">
                      {p.agreementStatus || 'Active Partner'}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold text-slate-500 block">{p.phone}</span>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('transportation-partners')}
                      className="text-[10px] font-bold text-[#2463EB] hover:underline mt-1 cursor-pointer"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Recent Activity Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="font-extrabold text-sm text-slate-900">Recent CRM Activity</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Activity
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
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
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-extrabold text-slate-900 group-hover:text-[#2463EB] transition-colors truncate">
                        {act.title}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase shrink-0 border ${act.badgeColor}`}>
                        {act.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {act.subtitle}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {act.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Josan Logistics Operations</span>
            </span>

            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="text-[#2463EB] hover:underline font-extrabold text-[11px] cursor-pointer"
            >
              System Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
