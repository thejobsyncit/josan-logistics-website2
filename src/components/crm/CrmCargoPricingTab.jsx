import React, { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  DollarSign,
  Scale,
  Sliders,
  Calculator,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  X,
  Check,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { calculateCargoPricingHelper } from '../../data/adminCrmData';

export const CrmCargoPricingTab = ({
  cargoPricing = [],
  onAddCargoPricing,
  onUpdateCargoPricing,
  onDeleteCargoPricing,
  onToggleStatus
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Active' | 'Inactive'
  
  // Interactive Simulator State
  const [simCargoId, setSimCargoId] = useState(cargoPricing[0]?.id || '');
  const [simWeight, setSimWeight] = useState(250);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'General',
    description: '',
    basePricePerKg: '',
    minimumCharge: '',
    active: true,
    weightSlabs: []
  });

  const [formError, setFormError] = useState('');

  // Categories list
  const categoryOptions = [
    'General',
    'Fragile',
    'Perishable',
    'Electronics',
    'Documents',
    'Dangerous Goods',
    'Pharmaceutical',
    'Other'
  ];

  // Filtered List
  const filteredList = useMemo(() => {
    return cargoPricing.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'All' ? true :
        filterStatus === 'Active' ? item.active :
        !item.active;

      return matchesSearch && matchesStatus;
    });
  }, [cargoPricing, search, filterStatus]);

  // Selected item for simulation
  const selectedSimItem = useMemo(() => {
    return cargoPricing.find(c => c.id === simCargoId) || cargoPricing[0];
  }, [cargoPricing, simCargoId]);

  const simResult = useMemo(() => {
    return calculateCargoPricingHelper(selectedSimItem, simWeight);
  }, [selectedSimItem, simWeight]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      code: '',
      category: 'General',
      description: '',
      basePricePerKg: '3.50',
      minimumCharge: '50.00',
      active: true,
      weightSlabs: [
        { minWeight: 0, maxWeight: 100, pricePerKg: 3.80 },
        { minWeight: 101, maxWeight: 500, pricePerKg: 3.50 },
        { minWeight: 501, maxWeight: 999999, pricePerKg: 3.00 }
      ]
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      code: item.code || '',
      category: item.category || 'General',
      description: item.description || '',
      basePricePerKg: item.basePricePerKg !== undefined ? String(item.basePricePerKg) : '',
      minimumCharge: item.minimumCharge !== undefined ? String(item.minimumCharge) : '',
      active: item.active,
      weightSlabs: item.weightSlabs ? JSON.parse(JSON.stringify(item.weightSlabs)) : []
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Add slab in modal form
  const handleAddSlab = () => {
    setFormData(prev => ({
      ...prev,
      weightSlabs: [
        ...prev.weightSlabs,
        { minWeight: 0, maxWeight: 1000, pricePerKg: Number(prev.basePricePerKg) || 3.50 }
      ]
    }));
  };

  // Remove slab in modal form
  const handleRemoveSlab = (index) => {
    setFormData(prev => ({
      ...prev,
      weightSlabs: prev.weightSlabs.filter((_, idx) => idx !== index)
    }));
  };

  // Update slab field
  const handleUpdateSlab = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      weightSlabs: prev.weightSlabs.map((slab, idx) => {
        if (idx === index) {
          return { ...slab, [field]: Number(value) || 0 };
        }
        return slab;
      })
    }));
  };

  // Handle Save (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Please enter a cargo / product type name.');
      return;
    }
    const baseRate = parseFloat(formData.basePricePerKg);
    if (isNaN(baseRate) || baseRate < 0) {
      setFormError('Please provide a valid price per KG (number >= 0).');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase() || formData.name.slice(0, 3).toUpperCase(),
      category: formData.category,
      description: formData.description.trim(),
      basePricePerKg: baseRate,
      minimumCharge: Math.max(0, parseFloat(formData.minimumCharge) || 0),
      active: formData.active,
      weightSlabs: formData.weightSlabs.map(s => ({
        minWeight: Number(s.minWeight) || 0,
        maxWeight: Number(s.maxWeight) || 0,
        pricePerKg: Number(s.pricePerKg) || 0
      }))
    };

    if (editingItem) {
      onUpdateCargoPricing(editingItem.id, payload);
    } else {
      onAddCargoPricing(payload);
    }

    setIsModalOpen(false);
  };

  // Metrics
  const totalTypes = cargoPricing.length;
  const activeTypes = cargoPricing.filter(c => c.active).length;
  const totalSlabsConfigured = cargoPricing.reduce((sum, c) => sum + (c.weightSlabs?.length || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0B1F5B] via-[#16223F] to-[#0B1F5B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2463EB]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#2463EB]/20 text-[#2463EB] border border-[#2463EB]/30 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3 h-3" />
                <span>Cargo & Pricing Engine</span>
              </span>
              <span className="text-white/60 text-xs font-mono font-medium">
                Live Customer Website Connection
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Cargo Classification & Pricing Rates
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Configure product types, price per KG, minimum consignment charges, and tiered weight slabs. Updates immediately synchronize with public website rate calculations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-5 py-3 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cargo Type</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Configured Types</p>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalTypes}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Commercial classifications</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Active Website Rates</p>
            <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">{activeTypes} / {totalTypes}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Available for customer quoting</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">Weight Slabs Active</p>
            <p className="text-2xl font-black text-blue-600 mt-1 font-mono">{totalSlabsConfigured}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tiered volume discount rules</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sliders className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Live Price Calculation Simulator */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B1F5B] to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2463EB]/20 text-[#2463EB] flex items-center justify-center border border-[#2463EB]/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Interactive Rate Engine Simulator</h3>
              <p className="text-[11px] text-slate-400">
                Formula: <span className="font-mono text-[#2463EB]-300">Weight (KG) × Applicable Price/KG = Estimated Cargo Charge</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300">
            Real-Time Evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Select Cargo */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Select Cargo Type
            </label>
            <select
              value={simCargoId}
              onChange={(e) => setSimCargoId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#2463EB] cursor-pointer"
            >
              {cargoPricing.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.active ? '(Active)' : '(Inactive)'} - S$ {Number(c.basePricePerKg).toFixed(2)}/kg
                </option>
              ))}
            </select>
          </div>

          {/* Test Weight */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Test Cargo Weight (KG)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={simWeight}
                onChange={(e) => setSimWeight(Math.max(1, Number(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#2463EB]"
                placeholder="Weight in kg"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">KG</span>
            </div>
          </div>

          {/* Computed Rate Output Card */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Applicable Rate:</span>
              <span className="font-mono font-bold text-[#2463EB]">
                S$ {simResult.pricePerKg.toFixed(2)} / kg
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-slate-400 font-semibold">Tier Slab Used:</span>
              <span className="text-slate-300 text-[11px] font-mono">
                {simResult.appliedSlab 
                  ? `${simResult.appliedSlab.minWeight} - ${simResult.appliedSlab.maxWeight} kg` 
                  : 'Standard Base Rate'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-700/80 mt-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Charge:</span>
                {simResult.isMinChargeApplied && (
                  <span className="text-[9px] text-amber-400 font-medium">Min. charge applied</span>
                )}
              </div>
              <span className="text-lg font-black font-mono text-emerald-400">
                S$ {simResult.estimatedCargoCharge.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cargo types by name, code, description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          {(search || filterStatus !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setFilterStatus('All'); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 5. Cargo Types Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Cargo / Product Type</th>
                <th className="p-4">Category & Code</th>
                <th className="p-4">Base Rate (per KG)</th>
                <th className="p-4">Minimum Charge</th>
                <th className="p-4">Tiered Weight Slabs</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400 font-medium">
                    No cargo types found matching your query.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Description */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                          {item.description || 'Standard commercial classification'}
                        </div>
                      </td>

                      {/* Category & Code */}
                      <td className="p-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 rounded font-mono font-black text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                            {item.code || 'GEN'}
                          </span>
                          <span className="text-xs text-slate-600 font-bold">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      {/* Base Price / KG */}
                      <td className="p-4">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          S$ {Number(item.basePricePerKg || 0).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">per kg</span>
                      </td>

                      {/* Minimum Charge */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-700 text-xs">
                          {item.minimumCharge ? `S$ ${Number(item.minimumCharge).toFixed(2)}` : 'None (S$ 0)'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">min trip charge</span>
                      </td>

                      {/* Weight Slabs */}
                      <td className="p-4">
                        {item.weightSlabs && item.weightSlabs.length > 0 ? (
                          <div className="space-y-1">
                            {item.weightSlabs.map((slab, sIdx) => (
                              <div
                                key={sIdx}
                                className="inline-flex items-center space-x-1 text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 mr-1.5 mb-1"
                              >
                                <span>{slab.minWeight}-{slab.maxWeight > 50000 ? '500+' : slab.maxWeight}kg:</span>
                                <span className="font-black text-[#2463EB]">S${Number(slab.pricePerKg).toFixed(2)}/kg</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No slabs (flat base rate)</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(item.id)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            item.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to toggle Active / Inactive"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {item.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#2463EB] hover:bg-[#EAF2FF] transition-colors cursor-pointer"
                            title="Edit Cargo Configuration"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                onDeleteCargoPricing(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Cargo Type"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* 6. Add / Edit Cargo Pricing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-heading">
                  {editingItem ? 'Edit Cargo Classification' : 'Add New Cargo / Product Type'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure pricing per KG and weight tiers for automated website quotes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Cargo / Product Type Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Perishable Cargo"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
                  />
                </div>

                {/* Code */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Classification Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. PER"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Industry Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB] cursor-pointer"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Active Toggle */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Availability Status
                  </label>
                  <div className="flex items-center space-x-3 pt-1.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, active: !formData.active })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.active ? 'bg-[#2463EB]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-bold text-slate-700">
                      {formData.active ? 'Active on Website' : 'Inactive / Hidden'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Description / Handling Guidelines
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details regarding cargo handling, specifications, or packaging requirements..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
                />
              </div>

              {/* Base Rate & Minimum Charge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#EAF2FF]/60 rounded-2xl border border-[#DCE5F0]">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#2463EB]-950 uppercase">
                    Base Price per KG (S$) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={formData.basePricePerKg}
                    onChange={(e) => setFormData({ ...formData, basePricePerKg: e.target.value })}
                    placeholder="3.50"
                    className="w-full px-3.5 py-2 bg-white border border-[#DCE5F0] rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2463EB]"
                  />
                  <p className="text-[10px] text-[#0B1F5B]/80">Default rate if weight slabs don't apply.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#2463EB]-950 uppercase">
                    Minimum Charge (S$)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.minimumCharge}
                    onChange={(e) => setFormData({ ...formData, minimumCharge: e.target.value })}
                    placeholder="50.00"
                    className="w-full px-3.5 py-2 bg-white border border-[#DCE5F0] rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2463EB]"
                  />
                  <p className="text-[10px] text-[#0B1F5B]/80">Minimum booking charge threshold.</p>
                </div>
              </div>

              {/* Tiered Weight Slabs Configuration */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-black text-slate-800 uppercase">
                      Optional Tiered Weight Slabs
                    </label>
                    <p className="text-[10px] text-slate-500">
                      If configured, the system automatically uses the matching weight slab rate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSlab}
                    className="px-2.5 py-1 text-[11px] font-extrabold text-[#2463EB] bg-[#EAF2FF] hover:bg-[#EAF2FF] rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slab</span>
                  </button>
                </div>

                {formData.weightSlabs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl text-center">
                    No tiered slabs configured. Base rate will be used for all weights.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.weightSlabs.map((slab, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-slate-500 block uppercase">Min KG</span>
                          <input
                            type="number"
                            min="0"
                            value={slab.minWeight}
                            onChange={(e) => handleUpdateSlab(idx, 'minWeight', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                        <span className="text-slate-400 font-bold self-end pb-1.5">to</span>
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-slate-500 block uppercase">Max KG</span>
                          <input
                            type="number"
                            min="0"
                            value={slab.maxWeight}
                            onChange={(e) => handleUpdateSlab(idx, 'maxWeight', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-slate-500 block uppercase">Rate/KG (S$)</span>
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            value={slab.pricePerKg}
                            onChange={(e) => handleUpdateSlab(idx, 'pricePerKg', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-[#2463EB]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlab(idx)}
                          className="self-end pb-1.5 p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Remove Slab"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Cargo Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
