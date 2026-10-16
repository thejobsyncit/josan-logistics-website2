import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Plane, 
  Receipt 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

/**
 * Calculates Subtotal, GST (9%), and Total consistently for any invoice object
 */
const calculateInvoiceAmounts = (inv) => {
  if (!inv) return { subtotal: 0, gst: 0, total: 0 };
  
  let subtotal = 0;
  let gst = 0;
  let total = 0;

  if (typeof inv.total === 'number' || (inv.total !== undefined && inv.total !== null && !isNaN(Number(inv.total)))) {
    total = Number(inv.total);
    if (inv.taxAmount !== undefined && inv.taxAmount !== null && !isNaN(Number(inv.taxAmount))) {
      gst = Number(inv.taxAmount);
      subtotal = Number((total - gst).toFixed(2));
    } else if (inv.subtotal !== undefined && inv.subtotal !== null && !isNaN(Number(inv.subtotal))) {
      subtotal = Number(inv.subtotal);
      gst = Number((total - subtotal).toFixed(2));
    } else {
      subtotal = Number((total / 1.09).toFixed(2));
      gst = Number((total - subtotal).toFixed(2));
    }
  } else if (typeof inv.subtotal === 'number' || (inv.subtotal !== undefined && inv.subtotal !== null && !isNaN(Number(inv.subtotal)))) {
    subtotal = Number(inv.subtotal);
    gst = inv.taxAmount !== undefined && inv.taxAmount !== null && !isNaN(Number(inv.taxAmount))
      ? Number(inv.taxAmount)
      : Number((subtotal * 0.09).toFixed(2));
    total = Number((subtotal + gst).toFixed(2));
  } else if (inv.amount !== undefined && inv.amount !== null && !isNaN(Number(inv.amount))) {
    subtotal = Number(inv.amount);
    gst = Number((subtotal * 0.09).toFixed(2));
    total = Number((subtotal + gst).toFixed(2));
  }

  return { subtotal, gst, total };
};

/**
 * Safely parses date from diverse record structures
 */
const parseItemDate = (item) => {
  if (!item) return null;
  const raw = item.issueDate || item.date || item.createdDate || item.createdAt || item.joinedDate || item.timestamp;
  if (!raw) return null;
  if (raw instanceof Date && !isNaN(raw.getTime())) return raw;
  if (typeof raw === 'number') {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
    // Fallback: parse date component if timestamp has whitespace
    const datePart = trimmed.split(' ')[0];
    const d2 = new Date(datePart);
    if (!isNaN(d2.getTime())) return d2;
  }
  return null;
};

/**
 * Evaluates whether a date matches the selected reporting time range
 */
const isDateInTimeRange = (date, range, refDate) => {
  if (!date) return true; // Keep items with no explicit date so user records aren't dropped
  
  const itemYear = date.getFullYear();
  const itemMonth = date.getMonth(); // 0-indexed: 8 is September
  
  if (range === 'This Month') {
    // Current operational month: September 2026
    const targetYear = refDate.getFullYear();
    const targetMonth = refDate.getMonth();
    return itemYear === targetYear && itemMonth === targetMonth;
  }
  
  if (range === 'Last 30 Days') {
    const thirtyDaysAgo = new Date(refDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    return date.getTime() >= thirtyDaysAgo.getTime() && date.getTime() <= refDate.getTime();
  }
  
  if (range === 'Q3 2026') {
    // Q3 2026 is July (6), August (7), September (8)
    return itemYear === 2026 && itemMonth >= 6 && itemMonth <= 8;
  }
  
  if (range === 'Year to Date') {
    // 2026 Year to Date
    return itemYear === 2026 && date.getTime() <= refDate.getTime();
  }
  
  return true;
};

/**
 * Safely matches and counts airway services
 */
const countAirwayService = (requests, targetService) => {
  if (!Array.isArray(requests)) return 0;
  return requests.filter(r => {
    if (!r) return false;
    const servicesList = [];
    if (Array.isArray(r.services)) {
      servicesList.push(...r.services);
    } else if (typeof r.services === 'string') {
      servicesList.push(...r.services.split(','));
    }
    if (typeof r.service === 'string') {
      servicesList.push(r.service);
    }

    const normalized = servicesList.map(s => String(s).trim().toLowerCase());

    if (targetService === 'AWB Preparation') {
      return normalized.some(s => s.includes('awb prep') || s === 'awb preparation');
    }
    if (targetService === 'Shipment Documentation') {
      return normalized.some(s => s.includes('documentation') || s.includes('docs') || s === 'shipment documentation');
    }
    if (targetService === 'AWB Billing') {
      return normalized.some(s => s.includes('awb billing') || s === 'awb billing');
    }
    if (targetService === 'Transportation Support') {
      return normalized.some(s => s.includes('transport') || s.includes('coordination') || s === 'transportation support');
    }
    return false;
  }).length;
};

export const CrmReportsTab = ({
  airwayRequests = [],
  shipments = [],
  invoices = [],
  customers = [],
  transportationPartners = []
}) => {
  const [timeRange, setTimeRange] = useState('This Month');

  // Determine operational reference date (September 30, 2026 or latest record timestamp)
  const referenceDate = useMemo(() => {
    let latest = new Date('2026-09-30T23:59:59');
    const allRecords = [...airwayRequests, ...shipments, ...invoices];
    for (const record of allRecords) {
      const d = parseItemDate(record);
      if (d && d.getFullYear() >= 2026 && d.getTime() > latest.getTime()) {
        latest = d;
      }
    }
    return latest;
  }, [airwayRequests, shipments, invoices]);

  // Filter datasets strictly according to the selected timeRange
  const filteredAirwayRequests = useMemo(() => {
    return airwayRequests.filter(r => isDateInTimeRange(parseItemDate(r), timeRange, referenceDate));
  }, [airwayRequests, timeRange, referenceDate]);

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => isDateInTimeRange(parseItemDate(s), timeRange, referenceDate));
  }, [shipments, timeRange, referenceDate]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(i => isDateInTimeRange(parseItemDate(i), timeRange, referenceDate));
  }, [invoices, timeRange, referenceDate]);

  // Active corporate shippers in the selected timeframe
  const activeShippersCount = useMemo(() => {
    if (!Array.isArray(customers) || customers.length === 0) return 0;
    return customers.filter(c => {
      const cName = (c.name || c.company || '').toLowerCase();
      if (!cName) return false;
      const hasShipment = filteredShipments.some(s => 
        (s.sender && s.sender.toLowerCase().includes(cName)) || 
        (s.customerName && s.customerName.toLowerCase().includes(cName))
      );
      const hasAirway = filteredAirwayRequests.some(a => 
        (a.customerName && a.customerName.toLowerCase().includes(cName)) || 
        (a.company && a.company.toLowerCase().includes(cName))
      );
      const hasInvoice = filteredInvoices.some(i => 
        (i.customerName && i.customerName.toLowerCase().includes(cName))
      );
      const joinedDate = parseItemDate(c);
      const joinedInPeriod = joinedDate ? isDateInTimeRange(joinedDate, timeRange, referenceDate) : false;

      return hasShipment || hasAirway || hasInvoice || joinedInPeriod;
    }).length;
  }, [customers, filteredShipments, filteredAirwayRequests, filteredInvoices, timeRange, referenceDate]);

  // Airway service breakdown based on actual filtered data
  const awbPrepCount = useMemo(() => countAirwayService(filteredAirwayRequests, 'AWB Preparation'), [filteredAirwayRequests]);
  const docsCount = useMemo(() => countAirwayService(filteredAirwayRequests, 'Shipment Documentation'), [filteredAirwayRequests]);
  const billingCount = useMemo(() => countAirwayService(filteredAirwayRequests, 'AWB Billing'), [filteredAirwayRequests]);
  const transportCount = useMemo(() => countAirwayService(filteredAirwayRequests, 'Transportation Support'), [filteredAirwayRequests]);

  const serviceChartData = useMemo(() => [
    { name: 'AWB Preparation', count: awbPrepCount, color: '#2463EB' },
    { name: 'Shipment Docs', count: docsCount, color: '#8B5CF6' },
    { name: 'AWB Billing', count: billingCount, color: '#3B82F6' },
    { name: 'Airport Transport', count: transportCount, color: '#10B981' }
  ], [awbPrepCount, docsCount, billingCount, transportCount]);

  const totalAirwayServicesCount = useMemo(() => {
    return awbPrepCount + docsCount + billingCount + transportCount;
  }, [awbPrepCount, docsCount, billingCount, transportCount]);

  // Consistent Revenue Calculations
  const totalBilled = useMemo(() => {
    return filteredInvoices.reduce((sum, i) => sum + calculateInvoiceAmounts(i).total, 0);
  }, [filteredInvoices]);

  const paidBilled = useMemo(() => {
    return filteredInvoices
      .filter(i => String(i.paymentStatus || '').trim().toLowerCase() === 'paid')
      .reduce((sum, i) => sum + calculateInvoiceAmounts(i).total, 0);
  }, [filteredInvoices]);

  const pendingBilled = useMemo(() => {
    return filteredInvoices
      .filter(i => {
        const s = String(i.paymentStatus || '').trim().toLowerCase();
        return s === 'pending' || s === 'unpaid' || s === 'overdue';
      })
      .reduce((sum, i) => sum + calculateInvoiceAmounts(i).total, 0);
  }, [filteredInvoices]);

  const collectionRate = useMemo(() => {
    return totalBilled > 0 ? Math.round((paidBilled / totalBilled) * 100) : 0;
  }, [totalBilled, paidBilled]);

  // Actual Monthly / Period Billing Realization Chart Data
  const monthlyBillingData = useMemo(() => {
    if (timeRange === 'This Month' || timeRange === 'Last 30 Days') {
      // Weekly breakdown within the month/period
      const weeks = [
        { month: 'W1 (1-7)', billed: 0, collected: 0 },
        { month: 'W2 (8-14)', billed: 0, collected: 0 },
        { month: 'W3 (15-21)', billed: 0, collected: 0 },
        { month: 'W4 (22-30)', billed: 0, collected: 0 }
      ];

      filteredInvoices.forEach(inv => {
        const d = parseItemDate(inv);
        const day = d ? d.getDate() : 15;
        const { total } = calculateInvoiceAmounts(inv);
        const isPaid = String(inv.paymentStatus || '').trim().toLowerCase() === 'paid';
        
        let targetWeekIndex = 3;
        if (day <= 7) targetWeekIndex = 0;
        else if (day <= 14) targetWeekIndex = 1;
        else if (day <= 21) targetWeekIndex = 2;

        weeks[targetWeekIndex].billed = Number((weeks[targetWeekIndex].billed + total).toFixed(2));
        if (isPaid) {
          weeks[targetWeekIndex].collected = Number((weeks[targetWeekIndex].collected + total).toFixed(2));
        }
      });

      return weeks;
    }

    if (timeRange === 'Q3 2026') {
      const q3Months = [
        { month: 'Jul', billed: 0, collected: 0 },
        { month: 'Aug', billed: 0, collected: 0 },
        { month: 'Sep', billed: 0, collected: 0 }
      ];

      filteredInvoices.forEach(inv => {
        const d = parseItemDate(inv);
        const month = d ? d.getMonth() : 8;
        const { total } = calculateInvoiceAmounts(inv);
        const isPaid = String(inv.paymentStatus || '').trim().toLowerCase() === 'paid';

        if (month === 6) {
          q3Months[0].billed = Number((q3Months[0].billed + total).toFixed(2));
          if (isPaid) q3Months[0].collected = Number((q3Months[0].collected + total).toFixed(2));
        } else if (month === 7) {
          q3Months[1].billed = Number((q3Months[1].billed + total).toFixed(2));
          if (isPaid) q3Months[1].collected = Number((q3Months[1].collected + total).toFixed(2));
        } else if (month === 8) {
          q3Months[2].billed = Number((q3Months[2].billed + total).toFixed(2));
          if (isPaid) q3Months[2].collected = Number((q3Months[2].collected + total).toFixed(2));
        }
      });

      return q3Months;
    }

    // Year to Date 2026: Jan - Sep
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const ytdData = monthsList.map(m => ({ month: m, billed: 0, collected: 0 }));

    filteredInvoices.forEach(inv => {
      const d = parseItemDate(inv);
      const mIdx = d ? d.getMonth() : 8;
      if (mIdx >= 0 && mIdx < ytdData.length) {
        const { total } = calculateInvoiceAmounts(inv);
        const isPaid = String(inv.paymentStatus || '').trim().toLowerCase() === 'paid';
        ytdData[mIdx].billed = Number((ytdData[mIdx].billed + total).toFixed(2));
        if (isPaid) {
          ytdData[mIdx].collected = Number((ytdData[mIdx].collected + total).toFixed(2));
        }
      }
    });

    return ytdData;
  }, [timeRange, filteredInvoices]);

  // Contracted Transportation Partner performance without artificial fallback numbers
  const partnerPerformanceData = useMemo(() => {
    if (!Array.isArray(transportationPartners)) return [];
    return transportationPartners.map(p => {
      if (!p) return null;
      const pName = (p.name || '').toLowerCase();
      const assignedCount = filteredShipments.filter(s => {
        if (!s) return false;
        if (s.transportationPartnerId && p.id && s.transportationPartnerId === p.id) return true;
        if (s.partnerId && p.id && s.partnerId === p.id) return true;
        if (s.transportationPartner && pName && s.transportationPartner.toLowerCase().includes(pName)) return true;
        if (s.partner && pName && s.partner.toLowerCase().includes(pName)) return true;
        return false;
      }).length;

      const registeredVehicles = Number(p.registeredVehicles ?? p.fleetCount ?? p.vehicleCount ?? 0) || 0;

      return {
        id: p.id,
        name: p.name ? p.name.split(' ')[0] : 'Partner',
        fullName: p.name || 'Contracted Partner',
        dispatches: assignedCount,
        registeredVehicles
      };
    }).filter(Boolean);
  }, [transportationPartners, filteredShipments]);

  // Reliable CSV Export with consistent single timestamp and safe character escaping
  const handleExportCSV = () => {
    const exportTimestamp = new Date().toISOString();
    const dateFormatted = exportTimestamp.split('T')[0];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['Report Category', 'Metric / Item', 'Value', 'Time Range', 'Generated At'];
    const rows = [
      ['Report Overview', 'Reporting Period', timeRange, timeRange, exportTimestamp],
      ['Financials', 'Total Billed (SGD)', totalBilled.toFixed(2), timeRange, exportTimestamp],
      ['Financials', 'Collected Revenue (SGD)', paidBilled.toFixed(2), timeRange, exportTimestamp],
      ['Financials', 'Pending Receivables (SGD)', pendingBilled.toFixed(2), timeRange, exportTimestamp],
      ['Financials', 'Collection Efficiency Rate', `${collectionRate}%`, timeRange, exportTimestamp],
      ['Airway Services', 'Total Inbound Requests', filteredAirwayRequests.length, timeRange, exportTimestamp],
      ['Airway Services', 'AWB Preparation', awbPrepCount, timeRange, exportTimestamp],
      ['Airway Services', 'Shipment Documentation', docsCount, timeRange, exportTimestamp],
      ['Airway Services', 'AWB Billing', billingCount, timeRange, exportTimestamp],
      ['Airway Services', 'Transportation Support', transportCount, timeRange, exportTimestamp],
      ['Road Haulage', 'Active Road Shipments', filteredShipments.length, timeRange, exportTimestamp],
      ['Corporate Customers', 'Active Corporate Accounts', activeShippersCount, timeRange, exportTimestamp],
      ['Partners', 'Active Transport Partners', transportationPartners.length, timeRange, exportTimestamp]
    ];

    // Partner dispatch performance entries
    partnerPerformanceData.forEach(p => {
      rows.push([
        'Partner Dispatch',
        p.fullName,
        `${p.dispatches} dispatches (${p.registeredVehicles} vehicles)`,
        timeRange,
        exportTimestamp
      ]);
    });

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedRange = timeRange.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    link.download = `Josan_CRM_Executive_Report_${sanitizedRange}_${dateFormatted}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-heading">Operations & Financial Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Logistics service volume analytics, contracted roadway partner utilization, and billing realization.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="This Month">This Month (September 2026)</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Q3 2026">Q3 2026 (Jul - Sep)</option>
            <option value="Year to Date">Year to Date 2026</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#0B1F5B] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Collection Efficiency</span>
          <p className="text-2xl font-black font-mono text-emerald-600 mt-1">{collectionRate}%</p>
          <span className="text-[10px] text-emerald-600 font-medium">S$ {paidBilled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} collected</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Airway Service Volume</span>
          <p className="text-2xl font-black font-mono text-[#2463EB] mt-1">{filteredAirwayRequests.length} Requests</p>
          <span className="text-[10px] text-slate-500 font-medium">AWB, Billing & Airport transfers</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Road Dispatches</span>
          <p className="text-2xl font-black font-mono text-blue-600 mt-1">{filteredShipments.length} Consignments</p>
          <span className="text-[10px] text-slate-500 font-medium">{transportationPartners.length} Contracted Partners</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Active Corporate Shippers</span>
          <p className="text-2xl font-black font-mono text-purple-600 mt-1">{activeShippersCount} Accounts</p>
          <span className="text-[10px] text-slate-500 font-medium">Enterprise & GDP certified</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Monthly Billing Realization</h3>
              <p className="text-[11px] text-slate-500">Invoiced SGD vs Settled Receipts</p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
              SGD Currency
            </span>
          </div>

          <div className="h-64 w-full">
            {monthlyBillingData.every(d => d.billed === 0 && d.collected === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Receipt className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-500">No billing activity recorded for {timeRange}</p>
                <p className="text-[11px] text-slate-400">Invoiced and settled amounts will display here</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBillingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE5F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    formatter={(val) => `S$ ${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    contentStyle={{ backgroundColor: '#0B1F5B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }}
                  />
                  <Bar dataKey="billed" name="Billed" fill="#DCE5F0" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="collected" name="Collected" fill="#2463EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Airway Services Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Airway Service Capabilities Mix</h3>
              <p className="text-[11px] text-slate-500">Demand across AWB, documentation and transfers</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {totalAirwayServicesCount === 0 ? (
              <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Plane className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-500">No airway service data for {timeRange}</p>
                <p className="text-[11px] text-slate-400">Service breakdown will appear when requests are recorded</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={serviceChartData.filter(d => d.count > 0).length > 1 ? 5 : 0}
                    dataKey="count"
                  >
                    {serviceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1F5B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {serviceChartData.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="font-bold text-slate-700 truncate">{item.name} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
