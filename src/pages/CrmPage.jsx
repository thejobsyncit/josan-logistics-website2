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
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Target, 
  Phone, 
  ListTodo, 
  TrendingUp, 
  Users, 
  Kanban, 
  List, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Building2, 
  Mail, 
  Tag, 
  ChevronRight, 
  ChevronDown, 
  DollarSign, 
  Activity, 
  Sparkles, 
  X, 
  MessageSquare, 
  Check, 
  Layers,
  ArrowUpRight,
  UserCheck,
  FileText
} from 'lucide-react';

import CrmDriverFleetTab from '../components/CrmDriverFleetTab';
import CrmCustomerPortalTab from '../components/CrmCustomerPortalTab';
import { Truck, Globe } from 'lucide-react';

export const CrmPage = ({ setActiveTab }) => {
  const { 
    leads, 
    communications, 
    tasks, 
    customers, 
    drivers = [],
    addLead, 
    updateLeadStage, 
    updateLead, 
    deleteLead, 
    convertLeadToCustomer, 
    addCommunication, 
    deleteCommunication, 
    addTask, 
    updateTask, 
    toggleTaskStatus, 
    deleteTask, 
    showToast,
    currentUser 
  } = useLogistics();

  // Active CRM Tab
  const [crmSubTab, setCrmSubTab] = useState('pipeline'); // 'pipeline' | 'communications' | 'tasks' | 'analytics' | 'customers' | 'drivers' | 'customer_portal'

  // Pipeline / Leads state
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStageFilter, setLeadStageFilter] = useState('All');
  const [leadSourceFilter, setLeadSourceFilter] = useState('All');
  const [leadTagFilter, setLeadTagFilter] = useState('All');
  const [leadViewMode, setLeadViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [leadPage, setLeadPage] = useState(1);
  const leadPageSize = 10;

  // Modals state
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website Quote Form',
    stage: 'New',
    estimatedValue: 12000,
    tags: ''
  });

  const [editingLead, setEditingLead] = useState(null);
  const [convertingLead, setConvertingLead] = useState(null);
  const [convertDetails, setConvertDetails] = useState({
    designation: 'Supply Chain Manager',
    address: '10 Pasir Panjang Road, Mapletree Business City, Singapore 117438',
    tier: 'Standard Corporate',
    creditLimit: 'S$ 50,000',
    paymentTerms: 'Net 30 Days'
  });

  // Communications state
  const [commSearch, setCommSearch] = useState('');
  const [commTypeFilter, setCommTypeFilter] = useState('All');
  const [commEntityFilter, setCommEntityFilter] = useState('All');
  const [isAddCommOpen, setIsAddCommOpen] = useState(false);
  const [newCommData, setNewCommData] = useState({
    targetType: 'lead',
    targetId: '',
    type: 'call',
    staffName: currentUser?.name || 'Darren Josan',
    summary: ''
  });

  // Tasks state
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('All');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    targetType: 'lead',
    targetId: '',
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    assignedTo: currentUser?.name || 'Darren Josan'
  });
  const [editingTask, setEditingTask] = useState(null);

  // Computed calculations
  const pipelineStages = ['New', 'Contacted', 'Quote Sent', 'Negotiating', 'Won', 'Lost'];

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
    const matchesPriority = taskPriorityFilter === 'All' || (t.priority && t.priority.toLowerCase() === taskPriorityFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPipelineValue = leads.filter(l => l.stage !== 'Lost').reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
  const activePipelineValue = leads.filter(l => ['New', 'Contacted', 'Quote Sent', 'Negotiating'].includes(l.stage)).reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
  const wonLeadsCount = leads.filter(l => l.stage === 'Won').length;
  const lostLeadsCount = leads.filter(l => l.stage === 'Lost').length;
  const winRate = (wonLeadsCount + lostLeadsCount) > 0 ? Math.round((wonLeadsCount / (wonLeadsCount + lostLeadsCount)) * 100) : 0;

  const stageColorMap = {
    'New': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    'Contacted': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    'Quote Sent': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    'Negotiating': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    'Won': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    'Lost': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' }
  };

  const commTypeIconMap = {
    call: Phone,
    email: Mail,
    meeting: Users,
    note: FileText
  };

  const COLORS = ['#FF6B00', '#10182D', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8 pb-24">
      {/* Header Banner */}
      <section className="bg-[#10182D] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[#FF6B00] font-black uppercase text-[11px] tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                <span>Enterprise CRM Suite</span>
              </span>
              <span className="text-white/60 text-xs font-mono font-medium">
                Direct /crm Hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
              Customer Relationship Management
            </h1>
            <p className="text-white/80 font-medium text-xs sm:text-sm leading-relaxed">
              Track freight inquiries, manage your 6-stage sales pipeline, log communication touchpoints, and seamlessly convert won deals to corporate accounts.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setNewLeadData({
                  name: '',
                  company: '',
                  email: '',
                  phone: '',
                  source: 'Website Quote Form',
                  stage: 'New',
                  estimatedValue: 12000,
                  tags: ''
                });
                setIsAddLeadOpen(true);
              }}
              className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prospect Lead</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setNewCommData({
                  targetType: 'lead',
                  targetId: leads[0]?.id || '',
                  type: 'call',
                  staffName: currentUser?.name || 'Darren Josan',
                  summary: ''
                });
                setIsAddCommOpen(true);
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-extrabold border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#FF6B00]" />
              <span>Log Interaction</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setNewTaskData({
                  targetType: 'lead',
                  targetId: leads[0]?.id || '',
                  title: '',
                  dueDate: new Date().toISOString().split('T')[0],
                  priority: 'medium',
                  assignedTo: currentUser?.name || 'Darren Josan'
                });
                setIsAddTaskOpen(true);
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-extrabold border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ListTodo className="w-4 h-4 text-emerald-400" />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main CRM Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Summary Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Pipeline Value</span>
            <span className="text-xl font-black text-slate-900 font-mono block mt-1">
              S$ {totalPipelineValue.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">{leads.length} Tracked Prospects</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-orange-200/80 shadow-xs">
            <span className="text-[10px] text-orange-700 font-bold uppercase tracking-wider block">Active Pipeline</span>
            <span className="text-xl font-black text-orange-600 font-mono block mt-1">
              S$ {activePipelineValue.toLocaleString()}
            </span>
            <span className="text-[10px] text-orange-600 font-medium">Under Negotiation / Quotes</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-xs">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Win / Conversion Rate</span>
            <span className="text-xl font-black text-emerald-700 font-mono block mt-1">
              {winRate}%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">{wonLeadsCount} Won / {lostLeadsCount} Lost</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-blue-200/80 shadow-xs">
            <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">Action Items</span>
            <span className="text-xl font-black text-blue-900 font-mono block mt-1">
              {tasks.filter(t => t.status === 'pending').length} Tasks
            </span>
            <span className="text-[10px] text-blue-600 font-medium">{tasks.filter(t => t.status === 'done').length} Completed</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-purple-200/80 shadow-xs col-span-2 lg:col-span-1">
            <span className="text-[10px] text-purple-800 font-bold uppercase tracking-wider block">Client Accounts</span>
            <span className="text-xl font-black text-purple-900 font-mono block mt-1">
              {customers.length} Accounts
            </span>
            <span className="text-[10px] text-purple-600 font-medium">Ready for Domestic Linehaul</span>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'pipeline', label: `Pipeline Board (${leads.length})`, icon: Target },
            { id: 'drivers', label: `Driver App Telematics (${drivers?.length || 0})`, icon: Truck },
            { id: 'customer_portal', label: `Customer Portal Hub (${customers.length})`, icon: Globe },
            { id: 'communications', label: `Communications (${communications.length})`, icon: Phone },
            { id: 'tasks', label: `Tasks (${tasks.filter(t => t.status === 'pending').length})`, icon: ListTodo },
            { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp },
            { id: 'customers', label: `Accounts (${customers.length})`, icon: Users }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = crmSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCrmSubTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#10182D] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================================= */}
        {/* SUBTAB 1: PIPELINE BOARD & LEADS TABLE                                 */}
        {/* ======================================================================= */}
        {crmSubTab === 'pipeline' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Prospect Pipeline & Lead Qualification</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Categorize inbound quote inquiries, update pipeline stages, and convert qualified leads to corporate shippers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* View Mode Toggle */}
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
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap gap-2.5 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search prospect name, company, email, phone..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
                />
              </div>

              <select
                value={leadStageFilter}
                onChange={(e) => setLeadStageFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Stages</option>
                {pipelineStages.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <select
                value={leadSourceFilter}
                onChange={(e) => setLeadSourceFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Sources</option>
                <option value="Website Quote Form">Website Quote Form</option>
                <option value="Website Contact Form">Website Contact Form</option>
                <option value="Referral">Referral</option>
                <option value="Cold Outreach">Cold Outreach</option>
              </select>

              {allLeadTags.length > 0 && (
                <select
                  value={leadTagFilter}
                  onChange={(e) => setLeadTagFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                >
                  <option value="All">All Tags</option>
                  {allLeadTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              )}

              {(leadSearch || leadStageFilter !== 'All' || leadSourceFilter !== 'All' || leadTagFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setLeadSearch('');
                    setLeadStageFilter('All');
                    setLeadSourceFilter('All');
                    setLeadTagFilter('All');
                  }}
                  className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-extrabold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* KANBAN BOARD VIEW */}
            {leadViewMode === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
                {pipelineStages.map((stage) => {
                  const stageLeads = filteredLeads.filter(l => l.stage === stage);
                  const stageTotalVal = stageLeads.reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);
                  const style = stageColorMap[stage] || stageColorMap['New'];

                  return (
                    <div
                      key={stage}
                      className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex flex-col space-y-2.5 min-h-[480px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                          <h3 className="font-extrabold text-xs text-slate-900">{stage}</h3>
                        </div>
                        <span className="px-1.5 py-0.2 bg-white text-slate-700 rounded-full font-black text-[10px] border border-slate-200">
                          {stageLeads.length}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono font-bold">
                        S$ {stageTotalVal.toLocaleString()}
                      </div>

                      {/* Lead Cards List */}
                      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                        {stageLeads.length === 0 ? (
                          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-[11px] text-slate-400 font-medium">
                            No deals in {stage}
                          </div>
                        ) : (
                          stageLeads.map((lead) => (
                            <div
                              key={lead.id}
                              className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-2 group"
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-mono text-[10px] font-bold text-slate-400">
                                  #{lead.id}
                                </span>
                                <span className="text-[10px] font-mono font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                                  S$ {Number(lead.estimatedValue || 0).toLocaleString()}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                                  {lead.company}
                                </h4>
                                <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                                  <span>{lead.name}</span>
                                </p>
                              </div>

                              <div className="space-y-0.5 text-[10px] text-slate-500 font-medium">
                                <p className="truncate">📧 {lead.email}</p>
                                {lead.phone && <p className="truncate">📞 {lead.phone}</p>}
                                <p className="text-[9px] text-slate-400">Source: {lead.source}</p>
                              </div>

                              {lead.tags && lead.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {lead.tags.slice(0, 2).map((t, idx) => (
                                    <span key={idx} className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">
                                      {t}
                                    </span>
                                  ))}
                                  {lead.tags.length > 2 && (
                                    <span className="text-[9px] text-slate-400 font-bold">+{lead.tags.length - 2}</span>
                                  )}
                                </div>
                              )}

                              {/* Stage Selector & Actions */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <select
                                  value={lead.stage}
                                  onChange={(e) => updateLeadStage(lead.id, e.target.value)}
                                  className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded p-1 text-slate-700 cursor-pointer max-w-[100px]"
                                >
                                  {pipelineStages.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>

                                <div className="flex items-center space-x-1">
                                  {lead.stage === 'Won' && !lead.convertedCustomerId && (
                                    <button
                                      type="button"
                                      onClick={() => setConvertingLead(lead)}
                                      title="Convert to Corporate Customer"
                                      className="p-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer transition-colors shadow-2xs"
                                    >
                                      <UserCheck className="w-3 h-3" />
                                    </button>
                                  )}
                                  {lead.convertedCustomerId && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                                      Converted
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setEditingLead(lead)}
                                    title="Edit Lead"
                                    className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded cursor-pointer transition-colors"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteLead(lead.id)}
                                    title="Delete Lead"
                                    className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Lead ID</th>
                      <th className="p-3.5">Company & Contact</th>
                      <th className="p-3.5">Source</th>
                      <th className="p-3.5">Pipeline Stage</th>
                      <th className="p-3.5">Est. Value</th>
                      <th className="p-3.5">Tags</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paginatedLeads.map((lead) => {
                      const style = stageColorMap[lead.stage] || stageColorMap['New'];
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-800">
                            #{lead.id}
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{lead.company}</p>
                            <p className="text-[11px] text-slate-500">{lead.name} • {lead.email}</p>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            {lead.source}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={lead.stage}
                              onChange={(e) => updateLeadStage(lead.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg font-extrabold text-xs border ${style.bg} ${style.text} ${style.border} cursor-pointer`}
                            >
                              {pipelineStages.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-900">
                            S$ {Number(lead.estimatedValue || 0).toLocaleString()}
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {(lead.tags || []).map((t, idx) => (
                                <span key={idx} className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            {lead.stage === 'Won' && !lead.convertedCustomerId && (
                              <button
                                type="button"
                                onClick={() => setConvertingLead(lead)}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                              >
                                Convert to Client
                              </button>
                            )}
                            {lead.convertedCustomerId && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                                Account #{lead.convertedCustomerId}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setEditingLead(lead)}
                              className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteLead(lead.id)}
                              className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SUBTAB 2: COMMUNICATIONS LOG                                            */}
        {/* ======================================================================= */}
        {crmSubTab === 'communications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Interaction & Communications Trail</h2>
                <p className="text-xs text-slate-500">
                  Chronological record of touchpoints, phone calls, quote negotiations, and account executive notes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddCommOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Interaction</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap gap-2.5 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={commSearch}
                  onChange={(e) => setCommSearch(e.target.value)}
                  placeholder="Search interaction summary, notes, or staff name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
                />
              </div>

              <select
                value={commTypeFilter}
                onChange={(e) => setCommTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="note">Internal Note</option>
              </select>

              <select
                value={commEntityFilter}
                onChange={(e) => setCommEntityFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Entities</option>
                <option value="Leads Only">Leads Only</option>
                <option value="Customers Only">Customers Only</option>
              </select>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-3">
              {filteredCommunications.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                  No communications logged yet. Use the "Log New Interaction" button to add your first touchpoint.
                </div>
              ) : (
                filteredCommunications.map((comm) => {
                  const IconComp = commTypeIconMap[comm.type] || FileText;
                  const associatedLead = leads.find(l => l.id === comm.leadId);
                  const associatedCust = customers.find(c => c.id === comm.customerId);

                  return (
                    <div
                      key={comm.id}
                      className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all flex items-start justify-between gap-4 group"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 uppercase">
                              {comm.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{comm.id}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {comm.timestamp}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[11px] font-bold text-slate-700">
                              By {comm.staffName}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {comm.summary}
                          </p>

                          <div className="flex items-center space-x-2 pt-1 text-[11px]">
                            {associatedLead && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-bold">
                                Lead: {associatedLead.company} (#{associatedLead.id})
                              </span>
                            )}
                            {associatedCust && (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md font-bold">
                                Account: {associatedCust.name} (#{associatedCust.id})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteCommunication(comm.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* SUBTAB 3: TASKS & FOLLOW-UPS                                           */}
        {/* ======================================================================= */}
        {crmSubTab === 'tasks' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Action Items & Scheduled Follow-ups</h2>
                <p className="text-xs text-slate-500">
                  Manage sales follow-up checklists, rate proposal dispatches, and key account audits.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddTaskOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap gap-2.5 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  placeholder="Search task title or assignee..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
                />
              </div>

              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="done">Completed</option>
              </select>

              <select
                value={taskPriorityFilter}
                onChange={(e) => setTaskPriorityFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Tasks List */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                  No tasks matching your filter criteria.
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isDone = task.status === 'done';
                  const priorityStr = (task.priority || 'medium').toLowerCase();
                  const priorityColors = {
                    high: 'bg-rose-100 text-rose-800 border-rose-200',
                    medium: 'bg-amber-100 text-amber-800 border-amber-200',
                    low: 'bg-slate-100 text-slate-700 border-slate-200'
                  }[priorityStr] || 'bg-slate-100 text-slate-700 border-slate-200';

                  const associatedLead = leads.find(l => l.id === task.leadId);
                  const associatedCust = customers.find(c => c.id === task.customerId);

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-slate-50/50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <button
                          type="button"
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-orange-500'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div className="space-y-1">
                          <h4 className={`text-xs font-bold text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                            <span className={`px-1.5 py-0.2 rounded font-extrabold uppercase text-[9px] border ${priorityColors}`}>
                              {priorityStr} Priority
                            </span>
                            <span>Due: <strong className="text-slate-700">{task.dueDate}</strong></span>
                            <span>•</span>
                            <span>Assigned: <strong className="text-slate-700">{task.assignedTo}</strong></span>

                            {associatedLead && (
                              <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-bold">
                                {associatedLead.company}
                              </span>
                            )}
                            {associatedCust && (
                              <span className="px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded font-bold">
                                {associatedCust.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTask(task);
                            setIsAddTaskOpen(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg cursor-pointer"
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

        {/* ======================================================================= */}
        {/* SUBTAB 4: PIPELINE ANALYTICS                                           */}
        {/* ======================================================================= */}
        {crmSubTab === 'analytics' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">CRM Intelligence & Pipeline Analytics</h2>
              <p className="text-xs text-slate-500">
                Visual pipeline velocity, channel conversion distribution, and estimated freight value breakdown.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Pipeline Value Bar Chart */}
              <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Pipeline Value by Stage (SGD)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Real-time distribution of freight deal value</p>
                  </div>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                    Live Data
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

              {/* Lead Sources Chart */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Lead Inflow by Source</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Channel breakdown of inbound enterprise inquiries</p>
                </div>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={['Website Quote Form', 'Website Contact Form', 'Referral', 'Cold Outreach'].map((source) => ({
                          name: source,
                          value: leads.filter(l => l.source === source).length || 1
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {['Website Quote Form', 'Website Contact Form', 'Referral', 'Cold Outreach'].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
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
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* SUBTAB 5: CORPORATE CUSTOMER DIRECTORY                                  */}
        {/* ======================================================================= */}
        {crmSubTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">Corporate Customer Directory</h2>
              <p className="text-xs text-slate-500">
                Accounts converted from CRM pipeline with assigned credit limits, payment terms, and active consignments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((cust) => (
                <div
                  key={cust.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        #{cust.id}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">
                        {cust.name}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                      {cust.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p>👤 <strong>Contact:</strong> {cust.contactPerson}</p>
                    <p>📧 {cust.email}</p>
                    <p>📞 {cust.phone}</p>
                    <p className="text-[11px] text-slate-500 truncate">📍 {cust.address}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Terms: <strong className="text-slate-800">{cust.paymentTerms}</strong></span>
                    <span className="text-orange-600">Limit: {cust.creditLimit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: DRIVER APP TELEMATICS & DISPATCH */}
        {crmSubTab === 'drivers' && (
          <div className="animate-fade-in">
            <CrmDriverFleetTab />
          </div>
        )}

        {/* SUBTAB: CUSTOMER APP PORTAL HUB */}
        {crmSubTab === 'customer_portal' && (
          <div className="animate-fade-in">
            <CrmCustomerPortalTab />
          </div>
        )}

      </div>

      {/* ======================================================================= */}
      {/* MODAL 1: ADD PROSPECT LEAD                                              */}
      {/* ======================================================================= */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Add Prospect Lead</h3>
                <p className="text-[11px] text-slate-500">Capture freight lead directly into CRM pipeline</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLeadOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
                  <label className="block text-slate-700 font-bold mb-1">Company Name *</label>
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
                  <label className="block text-slate-700 font-bold mb-1">Contact Person *</label>
                  <input
                    type="text"
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    placeholder="e.g. Tan Wei Ming"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    placeholder="logistics@company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    placeholder="+65 6789 0123"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-orange text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Source</label>
                  <select
                    value={newLeadData.source}
                    onChange={(e) => setNewLeadData({ ...newLeadData, source: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="Website Quote Form">Website Quote Form</option>
                    <option value="Website Contact Form">Website Contact Form</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Stage</label>
                  <select
                    value={newLeadData.stage}
                    onChange={(e) => setNewLeadData({ ...newLeadData, stage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    {pipelineStages.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Est. Value (SGD)</label>
                  <input
                    type="number"
                    value={newLeadData.estimatedValue}
                    onChange={(e) => setNewLeadData({ ...newLeadData, estimatedValue: Number(e.target.value) })}
                    placeholder="12000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-orange text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newLeadData.tags}
                  onChange={(e) => setNewLeadData({ ...newLeadData, tags: e.target.value })}
                  placeholder="Cold Chain, Pharma GDP, High Value"
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
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: EDIT LEAD                                                      */}
      {/* ======================================================================= */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Edit Lead #{editingLead.id}</h3>
                <p className="text-[11px] text-slate-500">Update opportunity parameters</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
                  <label className="block text-slate-700 font-bold mb-1">Company</label>
                  <input
                    type="text"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingLead.name}
                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Stage</label>
                  <select
                    value={editingLead.stage}
                    onChange={(e) => setEditingLead({ ...editingLead, stage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    {pipelineStages.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Est. Value (SGD)</label>
                  <input
                    type="number"
                    value={editingLead.estimatedValue}
                    onChange={(e) => setEditingLead({ ...editingLead, estimatedValue: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-xs focus-orange"
                  />
                </div>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: CONVERT LEAD TO CORPORATE CUSTOMER                            */}
      {/* ======================================================================= */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Convert Lead to Corporate Customer</h3>
                <p className="text-[11px] text-slate-500">Creates corporate account with credit limit & Net payment terms</p>
              </div>
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs space-y-1">
              <p className="font-extrabold">🎉 Converting: {convertingLead.company}</p>
              <p className="text-[11px]">Contact: {convertingLead.name} ({convertingLead.email})</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                convertLeadToCustomer(convertingLead.id, convertDetails);
                setConvertingLead(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Corporate Address</label>
                <input
                  type="text"
                  value={convertDetails.address}
                  onChange={(e) => setConvertDetails({ ...convertDetails, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Approved Credit Limit</label>
                  <select
                    value={convertDetails.creditLimit}
                    onChange={(e) => setConvertDetails({ ...convertDetails, creditLimit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="S$ 15,000">S$ 15,000</option>
                    <option value="S$ 35,000">S$ 35,000</option>
                    <option value="S$ 50,000">S$ 50,000</option>
                    <option value="S$ 100,000">S$ 100,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Terms</label>
                  <select
                    value={convertDetails.paymentTerms}
                    onChange={(e) => setConvertDetails({ ...convertDetails, paymentTerms: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="Prepaid / Corporate">Prepaid</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 60 Days">Net 60 Days</option>
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
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Conversion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 4: LOG COMMUNICATION                                              */}
      {/* ======================================================================= */}
      {isAddCommOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Log Interaction</h3>
                <p className="text-[11px] text-slate-500">Record a phone call, email, or meeting note</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCommOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCommData.summary.trim()) {
                  showToast('Please enter interaction notes.', 'warning');
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
                  <label className="block text-slate-700 font-bold mb-1">Target</label>
                  <select
                    value={newCommData.targetType}
                    onChange={(e) => setNewCommData({ ...newCommData, targetType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="lead">Prospect Lead</option>
                    <option value="customer">Corporate Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Entity</label>
                  <select
                    value={newCommData.targetId}
                    onChange={(e) => setNewCommData({ ...newCommData, targetId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="">-- None / General --</option>
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
                  <label className="block text-slate-700 font-bold mb-1">Channel Type</label>
                  <select
                    value={newCommData.type}
                    onChange={(e) => setNewCommData({ ...newCommData, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="call">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Video / On-site Meeting</option>
                    <option value="note">Internal Account Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Logged By</label>
                  <input
                    type="text"
                    value={newCommData.staffName}
                    onChange={(e) => setNewCommData({ ...newCommData, staffName: e.target.value })}
                    placeholder="Staff Member Name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Interaction Notes *</label>
                <textarea
                  rows="4"
                  value={newCommData.summary}
                  onChange={(e) => setNewCommData({ ...newCommData, summary: e.target.value })}
                  placeholder="Detail client conversation, rate negotiations, special cargo handling requirements..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus-orange"
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 5: CREATE / EDIT TASK                                             */}
      {/* ======================================================================= */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingTask ? `Edit Task #${editingTask.id}` : 'Create Follow-up Task'}
                </h3>
                <p className="text-[11px] text-slate-500">Action items, reminders, and customer deliverables</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddTaskOpen(false);
                  setEditingTask(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
                    showToast('Please enter task title.', 'warning');
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
                }
                setIsAddTaskOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Task Title / Action Item *</label>
                <input
                  type="text"
                  value={editingTask ? editingTask.title : newTaskData.title}
                  onChange={(e) => {
                    if (editingTask) setEditingTask({ ...editingTask, title: e.target.value });
                    else setNewTaskData({ ...newTaskData, title: e.target.value });
                  }}
                  placeholder="e.g. Send rate card for 14ft reefer truck fleet"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs focus-orange"
                  required
                />
              </div>

              {!editingTask && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Target Type</label>
                    <select
                      value={newTaskData.targetType}
                      onChange={(e) => setNewTaskData({ ...newTaskData, targetType: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                    >
                      <option value="lead">Prospect Lead</option>
                      <option value="customer">Corporate Customer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Link Target</label>
                    <select
                      value={newTaskData.targetId}
                      onChange={(e) => setNewTaskData({ ...newTaskData, targetId: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                    >
                      <option value="">-- None / General --</option>
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
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
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
                    value={editingTask ? (editingTask.priority || 'medium').toLowerCase() : newTaskData.priority}
                    onChange={(e) => {
                      if (editingTask) setEditingTask({ ...editingTask, priority: e.target.value });
                      else setNewTaskData({ ...newTaskData, priority: e.target.value });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus-orange cursor-pointer"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
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
                    placeholder="Staff Name"
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
