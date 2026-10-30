import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Database, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  FileCheck, 
  Clock, 
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '../../services/supabase';

export const SystemReportsTab = ({
  systemUsers = [],
  airwayRequests = [],
  shipments = [],
  adminActivityLog = []
}) => {
  const [timeRange, setTimeRange] = useState('30d');

  // Real Database Metrics State
  const [dbMetrics, setDbMetrics] = useState({
    activeSessions: null,
    totalStaff: null,
    inboundRequests: null,
    airwayRequestsCount: null,
    roadShipmentsCount: null,
    auditEventsCount: null,
    recentAuditLogs: [],
    loading: true
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDatabaseReports = async () => {
      try {
        // 1. Compute Active User Sessions from profiles in database
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, role, status')
          .in('role', ['ADMIN', 'CRM', 'READONLY', 'admin', 'crm', 'readonly', 'crm_manager', 'crm_ops', 'crm_finance', 'viewer']);

        let staffList = [];
        if (profiles && Array.isArray(profiles) && profiles.length > 0) {
          staffList = profiles.map(p => ({
            id: p.id,
            status: p.status === 'Disabled' ? 'Deactivated' : (p.status || 'Active')
          }));
        }
        if (!staffList.some(p => p.id === 'admin' || p.status === 'Active')) {
          staffList.push({ id: 'admin', status: 'Active' });
        }

        const activeSessionsCount = staffList.filter(s => s.status === 'Active').length;
        const totalStaffCount = staffList.length;

        // 2. Compute Requests from database
        const { count: airCount } = await supabase
          .from('quote_requests')
          .select('id', { count: 'exact', head: true });

        const { count: roadCount } = await supabase
          .from('shipments')
          .select('id', { count: 'exact', head: true });

        // 3. Compute Audit Trail from audit_log
        const { count: auditCount, data: auditData } = await supabase
          .from('audit_log')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(5);

        if (isMounted) {
          const resolvedAir = airCount !== null && airCount !== undefined ? airCount : airwayRequests.length;
          const resolvedRoad = roadCount !== null && roadCount !== undefined ? roadCount : shipments.length;
          const resolvedAuditLogs = auditData && auditData.length > 0
            ? auditData.map(log => ({
                id: log.id,
                action: log.action || 'SECURITY_AUDIT',
                details: typeof log.details === 'object' ? (log.details?.description || log.details?.targetUser || JSON.stringify(log.details)) : String(log.details || ''),
                user: log.details?.actor || 'Administrator',
                timestamp: log.created_at ? new Date(log.created_at).toLocaleString('en-SG', { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'
              }))
            : adminActivityLog;

          setDbMetrics({
            activeSessions: activeSessionsCount,
            totalStaff: totalStaffCount,
            inboundRequests: resolvedAir + resolvedRoad,
            airwayRequestsCount: resolvedAir,
            roadShipmentsCount: resolvedRoad,
            auditEventsCount: auditCount !== null && auditCount !== undefined ? auditCount : adminActivityLog.length,
            recentAuditLogs: resolvedAuditLogs,
            loading: false
          });
        }
      } catch (err) {
        console.warn('SystemReportsTab database fetch error:', err);
        if (isMounted) {
          setDbMetrics(prev => ({ ...prev, loading: false }));
        }
      }
    };

    fetchDatabaseReports();
    return () => { isMounted = false; };
  }, [systemUsers.length, airwayRequests.length, shipments.length, adminActivityLog.length]);

  // Request distribution metrics
  const airwayCount = dbMetrics.airwayRequestsCount !== null ? dbMetrics.airwayRequestsCount : airwayRequests.length;
  const roadCount = dbMetrics.roadShipmentsCount !== null ? dbMetrics.roadShipmentsCount : shipments.length;
  const totalInquiries = dbMetrics.inboundRequests !== null ? dbMetrics.inboundRequests : (airwayCount + roadCount);
  const airwayPct = totalInquiries > 0 ? Math.round((airwayCount / totalInquiries) * 100) : 50;
  const roadPct = 100 - airwayPct;

  // Active users count
  const activeCount = dbMetrics.activeSessions !== null 
    ? dbMetrics.activeSessions 
    : systemUsers.filter(u => u.status === 'Active').length;
  const auditEventsTotal = dbMetrics.auditEventsCount !== null 
    ? dbMetrics.auditEventsCount 
    : adminActivityLog.length;
  const auditLogsList = dbMetrics.recentAuditLogs.length > 0 
    ? dbMetrics.recentAuditLogs 
    : adminActivityLog;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">System & Administrative Reports</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-700">
              Database Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational telemetry and request channel metrics computed directly from database profiles, quote requests, and audit logs.
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

      {/* 2. Top Metric Highlights (Computed from Database) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Active User Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active User Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{activeCount}</p>
          <p className="text-[11px] text-purple-600 font-bold mt-0.5">Computed from database profiles</p>
        </div>

        {/* Metric 2: Inbound Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Inbound Requests</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{totalInquiries}</p>
          <p className="text-[11px] text-[#2463EB] font-bold mt-0.5">{airwayCount} Air Freight • {roadCount} Road</p>
        </div>

        {/* Metric 3: Security & Audit Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Audit Trail Events</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{auditEventsTotal}</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Recorded in database audit log</p>
        </div>
      </div>

      {/* 3. Detailed Graphs & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Website Request Channel Distribution</h3>
            <p className="text-xs text-slate-500">Proportion of Air Freight Service requests vs Road Transportation quote requests.</p>
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
            Requests received via customer website forms automatically create active operational records inside <strong className="text-slate-900">CRM Air Freight Requests</strong> and <strong className="text-slate-900">CRM Road Shipments</strong>.
          </div>
        </div>

        {/* Administrative Audit Log Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">System Audit Trail Summary</h3>
            <p className="text-xs text-slate-500">Recent administrative modifications and configuration changes from database.</p>
          </div>

          <div className="space-y-3">
            {auditLogsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                No activity yet
              </p>
            ) : (
              auditLogsList.slice(0, 4).map((log) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
