import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Server, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  FileCheck, 
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const SystemReportsTab = ({
  systemUsers = [],
  airwayRequests = [],
  shipments = [],
  adminActivityLog = []
}) => {
  const [timeRange, setTimeRange] = useState('30d');

  // Request distribution metrics
  const airwayCount = airwayRequests.length;
  const roadCount = shipments.length;
  const totalInquiries = airwayCount + roadCount;
  const airwayPct = totalInquiries > 0 ? Math.round((airwayCount / totalInquiries) * 100) : 50;
  const roadPct = 100 - airwayPct;

  // Active users count
  const activeCount = systemUsers.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">System & Administrative Reports</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-700">
              System Level
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            System performance telemetry, user access metrics, and request channel distributions. Detailed customer operations and billing reports are managed in /crm.
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="year">Current Year</option>
        </select>
      </div>

      {/* 2. Top Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">System Uptime</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">99.98%</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Zero unplanned downtime</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Avg API Latency</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">24 ms</p>
          <p className="text-[11px] text-blue-600 font-bold mt-0.5">Fast Singapore Edge response</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active User Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{activeCount}</p>
          <p className="text-[11px] text-purple-600 font-bold mt-0.5">Authenticated platform users</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Inbound Requests</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{totalInquiries}</p>
          <p className="text-[11px] text-[#2463EB] font-bold mt-0.5">Airway & Road combined</p>
        </div>
      </div>

      {/* 3. Detailed Graphs & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Website Request Channel Distribution</h3>
            <p className="text-xs text-slate-500">Proportion of Air Freight Service requests vs Road Transportation bookings.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Air Freight Services (AWB Coordination)</span>
                <span className="font-mono text-blue-600">{airwayCount} ({airwayPct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${airwayPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Commercial Road Transportation</span>
                <span className="font-mono text-[#2463EB]">{roadCount} ({roadPct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2463EB] rounded-full transition-all duration-500"
                  style={{ width: `${roadPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 mt-4 leading-relaxed">
            Requests received via customer website forms automatically create active operational records inside <strong className="text-slate-900">CRM Airway Requests</strong> and <strong className="text-slate-900">CRM Road Shipments</strong>.
          </div>
        </div>

        {/* Administrative Audit Log Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">System Audit Trail Summary</h3>
            <p className="text-xs text-slate-500">Recent administrative modifications and configuration changes.</p>
          </div>

          <div className="space-y-3">
            {adminActivityLog.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between text-xs gap-3">
                <div>
                  <span className="font-extrabold text-slate-900 block">{log.action}</span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">{log.details}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Executed by {log.user}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
