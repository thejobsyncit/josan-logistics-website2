import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Gauge, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Box, 
  Maximize2, 
  Compass, 
  Thermometer, 
  Zap, 
  FileText,
  Filter
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

export const FleetPage = ({ setActiveTab }) => {
  const { currentUser, setIsAuthModalOpen, resetShipmentScope, setAuthRedirectTab, showToast } = useLogistics();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fleetVehicles = [
    {
      id: 'van-1-7m',
      name: '1.7T Sprinter Delivery Van',
      category: 'van',
      categoryLabel: 'Light Commercial (LCV)',
      badge: 'City Express & Parcel Logistics',
      payload: '1,500 kg',
      volume: '12.5 m³',
      pallets: '2 Standard Pallets',
      dimensions: '3.2m (L) × 1.7m (W) × 1.8m (H)',
      access: 'Dual Rear 270° Barn Doors & Side Sliding Door',
      telematics: 'Live GPS Telemetry, Geo-fence Alerting',
      image: '/assets/van_1_7m.jpg',
      idealFor: [
        'High-value retail cartons',
        'Urgent biomedical supplies',
        'E-Commerce last-mile drops'
      ],
      features: ['Rear step bumper', 'Tie-down cargo anchor points', 'Fuel-efficient Euro-6 engine']
    },
    {
      id: 'van-2-4m',
      name: '2.4m High-Roof Cargo Van',
      category: 'van',
      categoryLabel: 'High-Cube LCV',
      badge: 'High-Volume Urban Freight',
      payload: '900 kg',
      volume: '15.2 m³',
      pallets: '3 Standard Pallets',
      dimensions: '4.2m (L) × 1.9m (W) × 2.1m (H)',
      access: 'High-Clearance Rear Cargo Doors & Dual Sliding Doors',
      telematics: 'Real-Time GPS Tracking & Speed Monitoring',
      image: '/assets/van_2_4m_highroof.jpg',
      idealFor: [
        'Bulky retail store distribution',
        'Electronic appliances & IT servers',
        'Department store replenishment'
      ],
      features: ['Standing interior height', 'Reinforced non-slip floor', 'Urban low-emission zone compliant']
    },
    {
      id: 'lorry-10ft',
      name: '10T Rigid Box Lorry',
      category: 'lorry',
      categoryLabel: 'Medium Commercial (MCV)',
      badge: 'Medium-Duty LTL Consolidation',
      payload: '8,500 kg',
      volume: '38.0 m³',
      pallets: '10 - 12 Standard Pallets',
      dimensions: '7.2m (L) × 2.4m (W) × 2.5m (H)',
      access: 'Hydraulic 1.5-Ton Cantilever Tail-Lift',
      telematics: 'Electronic Waybill, Fleet Speed Governors',
      image: '/assets/vehicle_10ft_lorry.jpg',
      idealFor: [
        'Consolidated pallet distribution',
        'FMCG supermarket stocks',
        'Wholesale manufacturing components'
      ],
      features: ['Hydraulic 1.5-ton tail lift', 'E-track cargo strapping', 'Pneumatic air suspension']
    },
    {
      id: 'lorry-14ft',
      name: '14ft Commercial Box Truck with Tailgate',
      category: 'lorry',
      categoryLabel: 'Medium Commercial (MCV)',
      badge: 'Commercial Distribution & Freight',
      payload: '3,500 kg',
      volume: '22.0 m³',
      pallets: '6 - 8 Standard Pallets',
      dimensions: '4.5m (L) × 2.1m (W) × 2.2m (H)',
      access: 'Full Hydraulic Tailgate with Remote Control',
      telematics: 'Live GPS Satellite Telemetry & Route Logging',
      image: '/assets/lorry_14ft_tailgate.jpg',
      idealFor: [
        'Industrial parts distribution',
        'Heavy warehouse cargo transfers',
        'Multi-point commercial drop-offs'
      ],
      features: ['Cantilever hydraulic tailgate', 'Weatherproof hardbox container', 'Dock-height compatible']
    },
    {
      id: 'truck-24ft',
      name: '24T Multi-Axle Heavy Prime Mover',
      category: 'heavy',
      categoryLabel: 'Heavy Articulated (FTL)',
      badge: 'Heavy-Duty FTL & Industrial Haulage',
      payload: '24,000 kg',
      volume: '76.0 m³',
      pallets: '24 - 26 Standard Pallets',
      dimensions: '13.6m (L) × 2.45m (W) × 2.7m (H)',
      access: 'Full Side Curtain-Slider & Rear Dock Loading',
      telematics: '24/7 Satellite Telemetry, Axle Weight Sensors',
      image: '/assets/lorry_24ft_heavy.jpg',
      idealFor: [
        'Full container load (FCL) haulage',
        'Heavy industrial machinery & steel',
        'Port-to-depot dedicated linehaul'
      ],
      features: ['Air-ride multi-axle suspension', 'Roll-stability control', 'Heavy tow coupling']
    },
    {
      id: 'reefer-van',
      name: 'Multi-Temp Cold Chain Reefer Van',
      category: 'specialized',
      categoryLabel: 'Temperature-Controlled',
      badge: 'Active Thermoregulation (-25°C to +25°C)',
      payload: '5,000 kg',
      volume: '26.0 m³',
      pallets: '6 - 8 Euro Pallets',
      dimensions: '5.8m (L) × 2.2m (W) × 2.2m (H)',
      access: 'Insulated Double Gasket Doors with Thermal Air Curtains',
      telematics: 'Dual-Probe IoT Datalogger, Real-Time Chilled Telemetry',
      image: '/assets/vehicle_cold_chain.jpg',
      idealFor: [
        'Vaccines & pharmaceutical vials',
        'Fresh produce & frozen seafood',
        'Temperature-critical specialty chemicals'
      ],
      features: ['Dual-zone climate partitions', 'Independent standby power unit', 'GDP pharmaceutical certified']
    },
    {
      id: 'motorbike',
      name: 'City Courier Dispatch Motorbike',
      category: 'express',
      categoryLabel: 'Express Courier',
      badge: 'Rapid Point-to-Point Delivery',
      payload: '8 kg',
      volume: '0.15 m³',
      pallets: 'Document Pouch / Top Box',
      dimensions: '0.5m (L) × 0.4m (W) × 0.4m (H)',
      access: 'Lockable Weatherproof Top Box',
      telematics: 'Real-Time Mobile GPS Dispatch',
      image: '/assets/vehicle_motorbike.jpg',
      idealFor: [
        'Urgent legal documents & customs paperwork',
        'Small electronic components & samples',
        'Same-hour CBD express deliveries'
      ],
      features: ['High-speed traffic agility', 'Lockable security box', 'Instant proof-of-delivery']
    },
    {
      id: 'mpv',
      name: 'Urban Commercial MPV / SUV',
      category: 'express',
      categoryLabel: 'Urban Commercial',
      badge: 'Same-Day Regional Dispatch',
      payload: '120 kg',
      volume: '1.8 m³',
      pallets: 'Cartons & Crates',
      dimensions: '1.8m (L) × 1.2m (W) × 1.1m (H)',
      access: 'Rear Liftgate & Passenger Doors',
      telematics: 'Live GPS Route Guidance',
      image: '/assets/vehicle_mpv.jpg',
      idealFor: [
        'Medium retail carton drop-offs',
        'Fragile laboratory samples',
        'Direct doorstep commercial courier'
      ],
      features: ['Flat loading floor', 'Climate-controlled cabin', 'Discreet transport']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Fleet Types', count: fleetVehicles.length },
    { id: 'van', label: 'Delivery Vans', count: fleetVehicles.filter(v => v.category === 'van').length },
    { id: 'lorry', label: 'Lorries & Box Trucks', count: fleetVehicles.filter(v => v.category === 'lorry').length },
    { id: 'heavy', label: 'Heavy Haulage (FTL)', count: fleetVehicles.filter(v => v.category === 'heavy').length },
    { id: 'specialized', label: 'Cold Chain & Reefer', count: fleetVehicles.filter(v => v.category === 'specialized').length },
    { id: 'express', label: 'Express Couriers', count: fleetVehicles.filter(v => v.category === 'express').length }
  ];

  const filteredVehicles = selectedCategory === 'all'
    ? fleetVehicles
    : fleetVehicles.filter(v => v.category === selectedCategory);

  const handleBookVehicle = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (resetShipmentScope) resetShipmentScope();
    setActiveTab('book');
  };

  const handleQuoteVehicle = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
      return;
    }
    setActiveTab('quote');
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Header Banner */}
      <section className="bg-[#10182D] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Modern Road Transport Fleet</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
            Our Vehicle & Transport Fleet
          </h1>
          <p className="text-white/90 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            From nimble express city couriers to heavy 24-ton articulated prime movers and active multi-temp reefer trucks, our modern roadway fleet is fully GPS telematic-equipped for precision logistics across Singapore and regional corridors.
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="block text-2xl font-black text-orange-400 font-mono">100%</span>
              <span className="text-xs text-slate-300 font-medium">GPS Telematics Active</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="block text-2xl font-black text-white font-mono">8+</span>
              <span className="text-xs text-slate-300 font-medium">Vehicle Classes</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="block text-2xl font-black text-white font-mono">24,000 kg</span>
              <span className="text-xs text-slate-300 font-medium">Max Payload Capacity</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="block text-2xl font-black text-emerald-400 font-mono">Euro-6</span>
              <span className="text-xs text-slate-300 font-medium">Clean Emission Fleet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-orange-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Fleet Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="card-premium overflow-hidden p-0 flex flex-col justify-between hover:border-[#FF6B00]/40 transition-all duration-200 group"
            >
              {/* Vehicle Image Container */}
              <div className="relative h-56 bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/clean_domestic_truck.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                    {vehicle.categoryLabel}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {vehicle.payload} Max
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs font-semibold text-orange-600 mt-0.5">
                      {vehicle.badge}
                    </p>
                  </div>

                  {/* Specification Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-700 uppercase">Max Payload</span>
                      <span className="font-extrabold font-mono text-slate-950">{vehicle.payload}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-700 uppercase">Cargo Volume</span>
                      <span className="font-extrabold font-mono text-slate-950">{vehicle.volume}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-700 uppercase">Capacity</span>
                      <span className="font-bold text-slate-950 text-[11px]">{vehicle.pallets}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-700 uppercase">Dimensions</span>
                      <span className="font-bold text-slate-950 text-[11px] leading-tight block">{vehicle.dimensions}</span>
                    </div>
                  </div>

                  {/* Access & Telematics Details */}
                  <div className="space-y-1.5 text-xs text-slate-800">
                    <p className="flex items-start space-x-2">
                      <Layers className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug"><strong>Loading:</strong> {vehicle.access}</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Compass className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug"><strong>Telematics:</strong> {vehicle.telematics}</span>
                    </p>
                  </div>

                  {/* Ideal For Tags */}
                  <div className="pt-1">
                    <span className="block text-[10px] font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                      Suitable Cargo & Use Cases
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vehicle.idealFor.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-[10px] font-bold border border-orange-100"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={handleQuoteVehicle}
                    className="flex-1 h-10 px-3 bg-[#10182D] hover:bg-[#1A243F] text-white rounded-lg sm:rounded-xl text-xs font-semibold transition-all text-center cursor-pointer flex items-center justify-center"
                  >
                    Get a Quote
                  </button>
                  <button
                    onClick={handleBookVehicle}
                    className="flex-1 h-10 px-3 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-lg sm:rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Book Vehicle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Network Coverage & Express Corridors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
            Strategic Coverage
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
            Singapore Service Areas & Corridors
          </h2>
          <p className="text-[#10182D] text-sm sm:text-base font-medium">
            Daily linehaul connections linking sea freight ports, air cargo facilities, and major industrial hubs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { hub: 'Changi Airfreight', tag: 'Aviation Cargo Hub', code: 'SIN-AIR', status: 'Active Linehaul' },
            { hub: 'Tuas Mega Port', tag: 'Maritime Gateway', code: 'TUA-SEA', status: '24/7 Container Runs' },
            { hub: 'Pasir Panjang', tag: 'Container Terminals', code: 'PSP-PORT', status: 'Port Shuttles' },
            { hub: 'Woodlands North', tag: 'Cross-Border Highway', code: 'WDL-BDR', status: 'Regional Corridor' },
            { hub: 'Jurong Island', tag: 'Petrochemical Depot', code: 'JUR-GATE', status: 'Specialized Tankers' },
            { hub: 'Tampines LogisPark', tag: 'Eastern Distribution', code: 'TMP-LOG', status: 'LTL Consolidation' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-4 text-center space-y-1.5 hover:border-[#FF6B00]/40 transition-all shadow-sm"
            >
              <span className="font-mono text-[11px] font-black text-[#FF6B00] bg-[#FFF8F2] px-2.5 py-0.5 rounded border border-[#FF6B00]/30 inline-block">
                {item.code}
              </span>
              <p className="text-sm font-extrabold text-[#10182D] pt-1">{item.hub}</p>
              <p className="text-xs font-semibold text-slate-500">{item.tag}</p>
              <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ● {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet Standards & Compliance Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700 inline-block">
              Fleet Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Rigorous Vehicle Maintenance & Compliance Standards
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Every vehicle in the Josan Logistics fleet operates under strict ISO 9001 quality management, undergoes scheduled bi-weekly mechanical safety audits, and utilizes encrypted real-time telematics linked to our Fleet Control Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <h4 className="font-extrabold text-sm text-white">LTA Inspection Certified</h4>
              <p className="text-xs text-slate-400">100% compliant with Singapore Land Transport Authority vehicle safety standards.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
              <Compass className="w-7 h-7 text-orange-400" />
              <h4 className="font-extrabold text-sm text-white">Live GPS Telematics</h4>
              <p className="text-xs text-slate-400">Minute-by-minute location updates, geo-fenced alerts, and route speed governors.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
              <Thermometer className="w-7 h-7 text-cyan-400" />
              <h4 className="font-extrabold text-sm text-white">Calibrated Dataloggers</h4>
              <p className="text-xs text-slate-400">NIST-traceable IoT sensors with continuous thermal logging for cold chain freight.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
              <Zap className="w-7 h-7 text-amber-400" />
              <h4 className="font-extrabold text-sm text-white">24/7 Roadside Assist</h4>
              <p className="text-xs text-slate-400">Rapid response standby recovery units ensuring minimum downtime for your cargo.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
