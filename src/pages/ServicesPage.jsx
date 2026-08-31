import React, { useState } from 'react';
import { Plane, Truck, Ship, Thermometer, ArrowRight, CheckCircle2, Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export const ServicesPage = ({ setActiveTab }) => {
  const [calculatorWeight, setCalculatorWeight] = useState(25);
  const [calculatorService, setCalculatorService] = useState('express');
  const [calculatorInsurance, setCalculatorInsurance] = useState(true);

  // Dynamic Image State per Service (Service ID -> Active Image Index)
  const [activeImageIndices, setActiveImageIndices] = useState({
    'express-air': 0,
    'land-haulage': 0,
    'ocean-freight': 0,
    'cold-chain': 0
  });

  // Lightbox Modal State for Fullscreen View
  const [lightboxImage, setLightboxImage] = useState(null);

  // Rate calculator formula
  const baseRate = calculatorService === 'express' ? 12 : calculatorService === 'ground' ? 4 : calculatorService === 'sea' ? 2 : 15;
  const estimatedTotal = (calculatorWeight * baseRate + (calculatorInsurance ? 35 : 0)).toFixed(2);

  const servicesData = [
    {
      id: 'express-air',
      title: 'Express Air Cargo & Priority Charter',
      icon: Plane,
      badge: '24/7 Air Dispatch • Next-Day SLA',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', caption: 'Freighter Aircraft Loading' },
        { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80', caption: 'International Air Terminal' },
        { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80', caption: 'Jet Cargo Flight Dispatch' }
      ],
      desc: 'Dedicated priority air freight servicing major global hubs with guaranteed next-day delivery SLAs and real-time flight tracking.',
      features: ['Next-Day & Same-Day Priority Flights', 'Airport-to-Door Telematics Tracking', 'Hazmat & High-Value Secured Vaults', 'Customs Clearance Fast-Track']
    },
    {
      id: 'land-haulage',
      title: 'Freight Trucking & Land Haulage (FTL / LTL)',
      icon: Truck,
      badge: 'Satellite GPS • 18-Wheeler Fleet',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80', caption: 'Highway Heavy Haulage Semi-Truck' },
        { url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80', caption: 'Interstate Freight Transport Fleet' },
        { url: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?w=800&auto=format&fit=crop&q=80', caption: 'Automated Loading Bay Operations' }
      ],
      desc: 'Modern fleet of 18-wheeler semi-trucks and sprinter vans equipped with satellite GPS telematics for seamless highway freight.',
      features: ['Full Truckload (FTL) & Partial (LTL)', 'Automated Route Optimization', 'Hydraulic Lift-gate Vans Available', '24/7 Driver Telemetry Feed']
    },
    {
      id: 'ocean-freight',
      title: 'Ocean Cargo Shipping & Container Lines',
      icon: Ship,
      badge: 'Deep Sea Lines • Port Terminal Telemetry',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&auto=format&fit=crop&q=80', caption: 'Deep Sea Container Ship Crossing Ocean' },
        { url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80', caption: 'Port Terminal Crane Container Loading' },
        { url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80', caption: 'Ocean Container Vessel Intermodal Hub' }
      ],
      desc: 'Cost-effective global sea freight handling 20ft/40ft containers, oversized machinery, and consolidated ocean cargo.',
      features: ['FCL (Full Container) & LCL Shipping', 'Port Terminal Intermodal Transfer', 'Automated Ocean Bill of Lading', 'Global Customs Brokerage']
    },
    {
      id: 'cold-chain',
      title: 'Pharma Cold Chain & Refrigerated Transit',
      icon: Thermometer,
      badge: 'ISO Certified • -20°C to +8°C Monitored',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?w=800&auto=format&fit=crop&q=80', caption: 'Temperature Monitored Cold Chain Logistics' },
        { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80', caption: 'Sterile Vaccine & Pharma Storage Vault' },
        { url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&auto=format&fit=crop&q=80', caption: 'Refrigerated Transit Container Vehicle' }
      ],
      desc: 'Precision temperature-controlled transport ranging from -20°C to +8°C for pharmaceuticals, medical vaccines, and perishables.',
      features: ['Continuous Temperature Data-Logger', 'ISO 9001 & GDP Compliant', 'Emergency Backup Refrigeration', 'Sterile Sealed Packaging']
    }
  ];

  const handleSelectThumbnail = (serviceId, index) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [serviceId]: index
    }));
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Logistics & Freight Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans">
            End-To-End Global Multimodal Shipping
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            From express air cargo to heavy land haulage and automated storage hubs, Josan Logistics provides full supply chain execution with dynamic image inspection.
          </p>
        </div>
      </section>

      {/* Services Grid with Dynamic Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {servicesData.map((service, index) => {
            const IconComp = service.icon;
            const isEven = index % 2 === 0;
            const activeIndex = activeImageIndices[service.id] || 0;
            const currentImgObj = service.gallery[activeIndex];

            return (
              <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-card ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Left Content */}
                <div className={`lg:col-span-6 space-y-4 ${!isEven ? 'lg:order-2' : ''}`}>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      onClick={() => setActiveTab('book')}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Book This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Right Interactive Dynamic Image Gallery */}
                <div className={`lg:col-span-6 space-y-3 ${!isEven ? 'lg:order-1' : ''}`}>
                  
                  {/* Main Display Image with Hover Zoom & Fullscreen Trigger */}
                  <div className="relative group rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900">
                    <img 
                      src={currentImgObj.url} 
                      alt={currentImgObj.caption} 
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100" 
                    />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1.5 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{currentImgObj.caption}</span>
                    </div>

                    {/* View Fullscreen Button Overlay */}
                    <button
                      onClick={() => setLightboxImage(currentImgObj)}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center space-x-1 cursor-pointer group-hover:scale-110"
                      title="View Fullscreen Image"
                    >
                      <Maximize2 className="w-4 h-4 text-orange-600" />
                      <span className="hidden sm:inline">Inspect</span>
                    </button>
                  </div>

                  {/* Dynamic Interactive Thumbnails Bar */}
                  <div className="flex items-center space-x-3 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-orange-500" />
                      <span>Angles:</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      {service.gallery.map((imgObj, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => handleSelectThumbnail(service.id, tIdx)}
                          className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            activeIndex === tIdx
                              ? 'border-orange-500 scale-105 shadow-md'
                              : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                          }`}
                        >
                          <img 
                            src={imgObj.url} 
                            alt={imgObj.caption} 
                            className="w-14 h-10 object-cover" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Fullscreen Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl space-y-4 p-4 text-white">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm font-extrabold text-orange-400">{lightboxImage.caption}</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.caption} 
              className="w-full h-[60vh] object-cover rounded-2xl border border-slate-800" 
            />
          </div>
        </div>
      )}

      {/* Instant Shipping Rate Estimator Widget */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-subtle-gradient rounded-3xl p-8 sm:p-10 border-2 border-orange-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-white px-3 py-1 rounded-full border border-orange-200">
              Interactive Estimator
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">Calculate Instant Freight Rate</h3>
            <p className="text-slate-600 text-xs sm:text-sm">Adjust weight and service speed to get an instant estimate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Weight Slider */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Cargo Weight: <span className="text-orange-600 font-mono text-sm">{calculatorWeight} kg</span>
              </label>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={calculatorWeight}
                onChange={(e) => setCalculatorWeight(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 kg</span>
                <span>250 kg</span>
                <span>500 kg</span>
              </div>
            </div>

            {/* Service Speed */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Service Mode</label>
              <select
                value={calculatorService}
                onChange={(e) => setCalculatorService(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus-orange cursor-pointer"
              >
                <option value="express">Express Air Freight ($12/kg)</option>
                <option value="ground">Land Trucking ($4/kg)</option>
                <option value="sea">Ocean Shipping ($2/kg)</option>
                <option value="cold">Cold Chain Pharma ($15/kg)</option>
              </select>
            </div>

            {/* Total Estimated Box */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-center flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-orange-800">Estimated Total Rate</span>
              <span className="text-3xl font-extrabold text-orange-600 font-mono">${estimatedTotal}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Includes fuel surcharge & tax</span>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('book')}
              className="px-8 py-3.5 bg-orange-gradient hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-orange-glow transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Proceed To Book With This Rate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
