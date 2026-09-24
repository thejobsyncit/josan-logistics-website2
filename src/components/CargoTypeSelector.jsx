import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Wine,
  FlaskConical,
  Armchair,
  Factory,
  Shirt,
  Grid,
  Car,
  Cpu,
  Trophy,
  FileText,
  Files,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Search,
  Check,
  X,
  Package,
  PlusCircle,
  Pencil,
  Sparkles
} from 'lucide-react';

export const cargoCategories = [
  {
    id: 'beverages-food-plants',
    name: 'Beverages, Foods & Plants',
    icon: Wine,
    subcategories: [
      'Non-perishable Foods',
      'Water, Soft Drinks',
      'Still and Sparkling Wines',
      'Spirits, Liquors',
      'Fresh & Frozen Products',
      'Tobacco',
      'Plants, Flowers & Seeds'
    ]
  },
  {
    id: 'chemicals-healthcare',
    name: 'Chemicals & Healthcare',
    icon: FlaskConical,
    subcategories: [
      'Pharmaceutical Goods',
      'Cosmetics, Well-being Products',
      'Perfumes',
      'Chemicals, Cleaning Products & Drugstore Products'
    ]
  },
  {
    id: 'furnitures-accessories',
    name: 'Furnitures & Accessories',
    icon: Armchair,
    subcategories: [
      'Decor Articles',
      'Lights',
      'Carpets',
      'Curtains, Sheets',
      'Un-disassembled Furniture (Home-office)',
      'Ceramics, Porcelain & Chinaware'
    ]
  },
  {
    id: 'industrial-products',
    name: 'Industrial Products',
    icon: Factory,
    subcategories: [
      'Machinery & Industrial Equipment',
      'Electronic Components & Hardware',
      'Tools, Bearings & Fasteners',
      'Metal Pipes, Sheets & Raw Materials',
      'Industrial Packaging & Drums'
    ]
  },
  {
    id: 'apparels-accessories',
    name: 'Apparels and Accessories',
    icon: Shirt,
    subcategories: [
      'Garments & Ready-to-Wear',
      'Footwear & Shoes',
      'Fashion Accessories & Bags',
      'Textiles & Fabrics',
      'Luxury Watches & Jewelry'
    ]
  },
  {
    id: 'building-materials',
    name: 'Building Materials',
    icon: Grid,
    subcategories: [
      'Tiles, Marble & Flooring',
      'Glass Panes & Windows',
      'Timber, Wood & Boards',
      'Cement, Plaster & Paints',
      'Plumbing & Electrical Fixtures'
    ]
  },
  {
    id: 'vehicles-engines-spares',
    name: 'Vehicles, Engines & Spare Parts',
    icon: Car,
    subcategories: [
      'Automotive Spare Parts',
      'Motor Engines & Transmission',
      'Tires, Rims & Wheels',
      'Motorbike & Bicycle Parts',
      'Batteries & Automotive Fluids'
    ]
  },
  {
    id: 'appliances-material',
    name: 'Appliances and Material',
    icon: Cpu,
    subcategories: [
      'Consumer Electronics & Phones',
      'Kitchen Appliances (Fridges, Ovens)',
      'Home Audio & TVs',
      'Air Conditioners & Compressors',
      'Office Equipment & Printers'
    ]
  },
  {
    id: 'leisure-items',
    name: 'Leisure Items',
    icon: Trophy,
    subcategories: [
      'Sports Equipment & Bicycles',
      'Musical Instruments',
      'Camping & Outdoor Gear',
      'Toys & Games',
      'Gym & Fitness Machinery'
    ]
  },
  {
    id: 'paperboard-prints',
    name: 'Paperboard & Prints',
    icon: FileText,
    subcategories: [
      'Books & Magazines',
      'Paperboard & Cartons',
      'Commercial Printing & Posters',
      'Office Stationery & Paper Rolls',
      'Packaging Materials & Labels'
    ]
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: Files,
    subcategories: [
      'Legal & Corporate Contracts',
      'Confidential Business Documents',
      'Financial & Accounting Records',
      'Passports, Visas & Identification',
      'Commercial Invoices & Shipping Permits',
      'Tenders & Architectural Blueprints',
      'Certificates & Official Correspondence'
    ]
  },
  {
    id: 'other-custom',
    name: 'Other / Custom Cargo',
    icon: PlusCircle,
    subcategories: [
      'General Mixed Goods',
      'Personal Effects & Relocation',
      'Art, Antiques & Collectibles',
      'Exhibition & Event Materials',
      'Custom / Specialized Freight'
    ]
  }
];

export const airFreightCargoTypes = [
  { id: 'general-cargo', name: 'General Cargo', desc: 'Standard consolidated or palletized dry cargo' },
  { id: 'fragile', name: 'Fragile Cargo', desc: 'Delicate glassware, precision instruments & sensitive equipment' },
  { id: 'perishable', name: 'Perishable Cargo', desc: 'Fresh seafood, produce, flowers & short shelf-life goods' },
  { id: 'temperature-controlled', name: 'Temperature-Controlled', desc: 'Active cold-chain (-20°C to +25°C) & reefer ULD containers' },
  { id: 'valuable', name: 'Valuable Cargo', desc: 'High-value jewelry, bullion, luxury goods & secured transit' },
  { id: 'dangerous-goods', name: 'Dangerous Goods', desc: 'IATA DGR compliant hazardous substances & chemicals' },
  { id: 'documents', name: 'Documents', desc: 'Urgent legal contracts, tenders & diplomatic mail' },
  { id: 'electronics', name: 'Electronics', desc: 'Semiconductors, high-tech components & consumer devices' },
  { id: 'healthcare-pharma', name: 'Healthcare & Pharmaceutical', desc: 'GDP-certified medicine, vaccines & medical devices' }
];

export const CargoTypeSelector = ({ 
  value, 
  onChange, 
  error, 
  className = '', 
  align = 'left', 
  placeholder = 'Select Cargo Type',
  categoriesOnly = false,
  hideSearch = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(cargoCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [customText, setCustomText] = useState('');
  const [showCustomBox, setShowCustomBox] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setMobileSubmenuOpen(false);
        setShowCustomBox(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // When dropdown opens, focus search input smoothly
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Active category object
  const currentCategory = useMemo(() => {
    return cargoCategories.find((c) => c.id === activeCategoryId) || cargoCategories[0];
  }, [activeCategoryId]);

  // Filtered subcategories based on search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    const results = [];
    for (const cat of cargoCategories) {
      for (const sub of cat.subcategories) {
        if (sub.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q)) {
          results.push({ category: cat, subcategory: sub });
        }
      }
    }
    return results;
  }, [searchQuery]);

  const handleSelect = (subcategory) => {
    onChange(subcategory);
    setIsOpen(false);
    setMobileSubmenuOpen(false);
    setSearchQuery('');
    setShowCustomBox(false);
  };

  const handleApplyCustom = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const textToApply = customText.trim() || searchQuery.trim();
    if (textToApply) {
      onChange(textToApply);
      setIsOpen(false);
      setMobileSubmenuOpen(false);
      setSearchQuery('');
      setCustomText('');
      setShowCustomBox(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Clean Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[48px] px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all cursor-pointer flex items-center justify-between text-left shadow-2xs hover:border-[#FF6B00] group ${
          error
            ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20'
            : isOpen
            ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/20 bg-orange-50/20'
            : value
            ? 'border-[#FF6B00] bg-orange-50/30'
            : 'border-slate-300 hover:border-[#FF6B00]/60'
        }`}
      >
        <div className="flex items-center space-x-2.5 truncate">
          {value ? (
            <>
              <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-slate-900 truncate text-sm">
                {value}
              </span>
            </>
          ) : (
            <span className="text-slate-400 font-medium truncate text-sm">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 text-slate-300 hover:text-slate-600 rounded-md transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#FF6B00]' : ''
            }`}
          />
        </div>
      </button>

      {/* Cascading Flyout Menu */}
      {isOpen && (
        <div 
          className={`absolute z-50 ${align === 'left' ? 'left-0' : 'right-0'} top-full mt-2 ${
            categoriesOnly
              ? 'w-[calc(100vw-2rem)] sm:w-[420px] max-w-[95vw]'
              : 'w-[calc(100vw-2rem)] sm:w-[560px] md:w-[620px] max-w-[95vw]'
          } bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-fade-in text-slate-800`}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Enhanced Search Header with Explicit Search Button */}
          {!hideSearch && !categoriesOnly && (
            <div className="p-3 border-b border-slate-100 bg-slate-50/90 flex items-center gap-2">
              <div className="flex-1 flex items-center bg-white border border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 rounded-xl px-3 py-1.5 transition-all shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      if (searchResults && searchResults.length > 0) {
                        handleSelect(searchResults[0].subcategory);
                      } else if (searchQuery.trim()) {
                        handleApplyCustom();
                      }
                    }
                  }}
                  placeholder="Search cargo (e.g. wine, chemicals, lights, electronics)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 border-none outline-none ring-0 focus:outline-hidden focus:ring-0 focus:border-none p-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Explicit Search / Filter Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (searchResults && searchResults.length > 0) {
                    // Keep search filtered
                  } else if (searchQuery.trim()) {
                    handleApplyCustom();
                  }
                }}
                className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 flex items-center space-x-1 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          )}

          {/* Quick Action: If searching, always provide button to set query as Custom Cargo */}
          {!categoriesOnly && searchQuery.trim() && (
            <div className="px-3 py-2 bg-orange-50 border-b border-orange-100 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-xs text-orange-950 font-medium truncate">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="truncate">Looking for something specific?</span>
              </div>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="px-2.5 py-1 bg-white hover:bg-orange-100 border border-orange-200 text-orange-700 font-extrabold text-[11px] rounded-lg transition-colors shrink-0 cursor-pointer shadow-2xs flex items-center space-x-1"
              >
                <span>Use "{searchQuery.trim()}" as Cargo</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Single-Column Mode: Categories Only (No Search & No Subcategories) */}
          {categoriesOnly ? (
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Cargo Categories
              </div>
              {cargoCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = value === cat.name;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.name)}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-orange-50 text-orange-600 font-extrabold border border-orange-200'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-orange-500 text-white shadow-xs' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
                      }`}>
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="truncate font-bold">{cat.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-orange-600 shrink-0 ml-2 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              {/* If Search Query is Active: show search results */}
              {searchResults !== null ? (
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Matching Cargo Items ({searchResults.length})</span>
                        <span>Click to select</span>
                      </div>
                      {searchResults.map((item, idx) => {
                        const Icon = item.category.icon;
                        const isSelected = value === item.subcategory;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelect(item.subcategory)}
                            className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-orange-500 text-white font-bold'
                                : 'hover:bg-orange-50/70 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                              <span className="font-semibold truncate">{item.subcategory}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm shrink-0 ${
                                isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {item.category.name}
                              </span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="py-6 px-4 text-center space-y-3">
                      <p className="text-xs text-slate-500 font-medium">
                        No predefined cargo items matched "<strong>{searchQuery}</strong>"
                      </p>
                      <button
                        type="button"
                        onClick={handleApplyCustom}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Set "{searchQuery}" as Custom Cargo Type</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Cascading Two-Column View (Categories on left, Subcategories alongside) */
                <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 max-h-96">
                  
                  {/* Categories Column */}
                  <div className={`sm:w-1/2 overflow-y-auto p-2 bg-slate-50/50 space-y-0.5 ${mobileSubmenuOpen ? 'hidden sm:block' : 'block'}`}>
                    <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Cargo Categories
                    </div>
                    {cargoCategories.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategoryId === cat.id;
                      const hasSelected = cat.subcategories.includes(value);

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => {
                            setActiveCategoryId(cat.id);
                            if (cat.id === 'other-custom') {
                              setShowCustomBox(true);
                            }
                          }}
                          onClick={() => {
                            setActiveCategoryId(cat.id);
                            setMobileSubmenuOpen(true);
                            if (cat.id === 'other-custom') {
                              setShowCustomBox(true);
                            }
                          }}
                          className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-white shadow-xs text-orange-600 font-extrabold border border-orange-200'
                              : 'hover:bg-slate-200/60 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-700'
                            }`} />
                            <span className="truncate">{cat.name}</span>
                            {hasSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                            )}
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isActive ? 'text-orange-500 translate-x-0.5' : 'text-slate-400'
                          }`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Subcategories Column (Flyout Content) */}
                  <div className={`sm:w-1/2 overflow-y-auto p-2.5 bg-white space-y-2 ${!mobileSubmenuOpen ? 'hidden sm:block' : 'block'}`}>
                    {/* Mobile Back button */}
                    <div className="sm:hidden pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setMobileSubmenuOpen(false)}
                        className="flex items-center space-x-1 text-xs font-bold text-orange-600 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Back to Categories</span>
                      </button>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {currentCategory.name}
                      </span>
                    </div>

                    {/* Subcategory Header */}
                    <div className="hidden sm:flex items-center space-x-2 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 mb-1">
                      {(() => {
                        const CatIcon = currentCategory.icon;
                        return <CatIcon className="w-3.5 h-3.5 text-orange-500" />;
                      })()}
                      <span className="truncate">{currentCategory.name}</span>
                    </div>

                    {/* Subcategory List Items */}
                    <div className="space-y-1">
                      {currentCategory.subcategories.map((sub, idx) => {
                        const isSelected = value === sub;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelect(sub)}
                            className={`w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-orange-500 text-white font-extrabold shadow-2xs'
                                : 'hover:bg-orange-50/80 hover:text-orange-700 text-slate-700'
                            }`}
                          >
                            <span className="truncate">{sub}</span>
                            {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Customizable Text Box integrated inside the active column when in Other or clicked */}
                    {activeCategoryId === 'other-custom' && (
                      <div className="mt-3 pt-3 border-t border-slate-100 bg-orange-50/40 p-2.5 rounded-xl border border-orange-200/80 space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-orange-800 flex items-center space-x-1">
                            <Pencil className="w-3 h-3 text-orange-600" />
                            <span>Specify Custom Cargo</span>
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                handleApplyCustom();
                              }
                            }}
                            placeholder="e.g. Vintage Teakwood Dining Set..."
                            className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCustom}
                            disabled={!customText.trim()}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}
            </>
          )}

          {/* Bottom Persistent Customizable Text Box ("Other Options") */}
          <div className="p-3 bg-slate-50 border-t border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                <Pencil className="w-3.5 h-3.5 text-orange-600" />
                <span>Other / Custom Cargo Option</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Can't find your item? Type below
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleApplyCustom();
                  }
                }}
                placeholder="Type custom cargo description (e.g. Art Frame, Solar Panels, CNC Lathe)..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!customText.trim()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center space-x-1"
              >
                <span>Apply</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
