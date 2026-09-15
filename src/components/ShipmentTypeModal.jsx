import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Truck, 
  Globe, 
  X, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const ShipmentTypeModal = ({ setActiveTab }) => {
  const { 
    isShipmentTypeModalOpen, 
    setIsShipmentTypeModalOpen, 
    shipmentScope, 
    setShipmentScope, 
    showToast 
  } = useLogistics();

  if (!isShipmentTypeModalOpen) return null;

  const handleSelectType = (type) => {
    setShipmentScope(type);
    setIsShipmentTypeModalOpen(false);
    if (setActiveTab) {
      setActiveTab(type === 'domestic' ? 'domestic-shipment' : 'international-shipment');
    }
    if (showToast) {
      if (type === 'domestic') {
        showToast('🚚 Selected Domestic Shipment (Within Country — No Customs Required)');
      } else {
        showToast('✈️ Selected International Freight Forwarding (Cross-Border Global Transit)');
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={() => setIsShipmentTypeModalOpen(false)}
    >
      <div 
        className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-10 max-w-2xl w-full shadow-2xl relative text-left overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Background Highlights */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        {/* Circular Close Button at Top Right */}
        <button
          type="button"
          onClick={() => setIsShipmentTypeModalOpen(false)}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer z-20 border border-slate-200"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Logo, Title & Subtitle */}
        <div className="text-center space-y-2.5 relative z-10 pt-1 pb-6">
          <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full">
            <img 
              src="/assets/josan_logo.png" 
              alt="Josan Logistics" 
              className="h-5 w-auto object-contain" 
            />
            <span className="text-xs font-black text-orange-600 tracking-wide uppercase">
              Josan Logistics
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome! What are you shipping?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
            Choose your delivery scope so we can tailor your logistics experience.
          </p>
        </div>

        {/* Two Options Cards: Domestic vs International (Website Theme) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 relative z-10 my-2">
          
          {/* CARD 1: Domestic Shipment (Orange Theme) */}
          <div
            onClick={() => handleSelectType('domestic')}
            className={`group rounded-[24px] p-6 sm:p-7 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden bg-white hover:bg-orange-50/40 hover:-translate-y-1 hover:shadow-xl ${
              shipmentScope === 'domestic'
                ? 'border-orange-500 ring-4 ring-orange-500/10 shadow-lg'
                : 'border-slate-200 hover:border-orange-400 shadow-sm'
            }`}
          >
            <div>
              {/* Rounded Square Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Truck className="w-7 h-7 stroke-[2.2]" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-black text-slate-900 mt-5 tracking-tight group-hover:text-orange-600 transition-colors">
                Domestic Services
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal mt-2">
                Send packages & freight within the same country with rapid doorstep delivery & zero customs paperwork.
              </p>

              {/* Pill Badge */}
              <div className="mt-5">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-semibold">
                  <span className="text-orange-500">★</span>
                  <span>Same-Day & Express Transit</span>
                </div>
              </div>
            </div>

            {/* Bottom Action: Get Started */}
            <div className="pt-6 flex justify-end items-center">
              <div className="inline-flex items-center space-x-1.5 text-orange-600 group-hover:text-orange-700 font-bold text-sm transition-colors">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* CARD 2: International Services (Navy / Slate Theme) */}
          <div
            onClick={() => handleSelectType('international')}
            className={`group rounded-[24px] p-6 sm:p-7 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden bg-white hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl ${
              shipmentScope === 'international'
                ? 'border-slate-900 ring-4 ring-slate-900/10 shadow-lg'
                : 'border-slate-200 hover:border-slate-800 shadow-sm'
            }`}
          >
            <div>
              {/* Rounded Square Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-900/25 group-hover:scale-105 transition-transform">
                <Globe className="w-7 h-7 stroke-[2.2]" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-black text-slate-900 mt-5 tracking-tight group-hover:text-slate-950 transition-colors">
                International Services
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal mt-2">
                Cross-border cargo forwarding across 180+ countries with automated customs clearance & duty estimates.
              </p>

              {/* Pill Badge */}
              <div className="mt-5">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                  <span className="text-slate-500">★</span>
                  <span>Global Air & Ocean Freight</span>
                </div>
              </div>
            </div>

            {/* Bottom Action: Get Started */}
            <div className="pt-6 flex justify-end items-center">
              <div className="inline-flex items-center space-x-1.5 text-slate-900 group-hover:text-orange-600 font-bold text-sm transition-colors">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Subtitle */}
        <div className="pt-5 border-t border-slate-100 text-center relative z-10">
          <p className="text-xs text-slate-400 font-medium">
            Need specialized enterprise or contract logistics?{' '}
            <button
              type="button"
              onClick={() => {
                setIsShipmentTypeModalOpen(false);
                if (setActiveTab) setActiveTab('contact');
              }}
              className="text-orange-600 hover:text-orange-700 hover:underline font-bold transition-colors cursor-pointer"
            >
              Contact Sales
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
