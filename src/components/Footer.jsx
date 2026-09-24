import React, { useState } from 'react';
import { Truck, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Globe, Clock, CheckCircle2 } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

export const Footer = ({ setActiveTab }) => {
  const { showToast, currentUser, resetShipmentScope, setIsAuthModalOpen, setAuthRedirectTab } = useLogistics();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      showToast('Thank you for subscribing to Josan Logistics newsletter!');
      setEmailInput('');
    }
  };

  const quickLinks = currentUser 
    ? ['Home', 'About Us', 'Services', 'Track Shipment', 'Book Shipment', 'Contact Us']
    : ['Home', 'About Us', 'Services', 'Track Shipment', 'Book Shipment', 'Contact Us'];

  return (
    <footer className="bg-[#10182D] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Company Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <img 
                src="/assets/josan_logo.png" 
                alt="Josan Logistics Logo" 
                className="h-10 w-auto object-contain" 
              />
              <div className="flex flex-col">
                <span className="text-white font-black text-lg tracking-wider leading-none">
                  JOSAN
                </span>
                <span className="text-[#FF6B00] font-black text-[9px] tracking-widest uppercase mt-0.5">
                  LOGISTICS PTE. LTD.
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Singapore's premier express road haulage network and interstate highway linehaul. Dedicated fleet telematics, tamper-evident transit security, and guaranteed SLA freight handling.
            </p>
            <div className="flex items-center space-x-2 text-xs text-orange-400 font-semibold bg-orange-950/30 border border-orange-800/40 px-3 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Certified Inland Roadway Carrier &bull; ISO-9001 Fleet Operations</span>
            </div>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>24/7 Road Dispatch & Telematics Monitoring</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 font-sans border-b border-slate-800 pb-2">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => {
                const tabId = item.toLowerCase().replace(' ', '').replace('us', '');
                return (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (tabId === 'bookshipment') {
                          if (!currentUser) {
                            if (setAuthRedirectTab) setAuthRedirectTab('book');
                            setIsAuthModalOpen(true);
                            if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
                            return;
                          }
                          resetShipmentScope();
                          setActiveTab('book');
                        } else if (tabId === 'trackshipment') {
                          if (!currentUser) {
                            if (setAuthRedirectTab) setAuthRedirectTab('track');
                            setIsAuthModalOpen(true);
                            if (showToast) showToast('Please sign in to track road shipments.', 'warning');
                            return;
                          }
                          setActiveTab('track');
                        } else {
                          setActiveTab(tabId);
                        }
                      }}
                      className="hover:text-orange-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3 text-orange-500" />
                      <span>{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 font-sans border-b border-slate-800 pb-2">Our Solutions</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => setActiveTab('road-freight')}>Road Freight & Transportation</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => setActiveTab('air-freight')}>Air Freight Forwarding</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => setActiveTab('fleet')}>Commercial Fleet & Trucks</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => setActiveTab('customs-clearance')}>Customs Clearance & Brokerage</li>
            </ul>
          </div>

          {/* 24/7 Global Dispatch & Contact Info */}
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-white text-base font-extrabold font-sans">Singapore HQ & Dispatch</h4>
                <span className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 shrink-0 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute"></span>
                  <span className="ml-3 font-mono">24/7 LIVE</span>
                </span>
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-300 mb-4">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Singapore Dispatch Hotline</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <a href="tel:+6567890123" className="text-white font-extrabold text-sm hover:text-orange-400 transition-colors">+65 6789 0123</a>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-slate-200 font-medium">Regional HQ: 10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:contact@josanlogistics.com.sg" className="text-slate-300 hover:text-white transition-colors font-medium">contact@josanlogistics.com.sg</a>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Subscribe for Freight Updates</label>
              <div className="flex">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter corporate email..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-lg text-xs text-white focus-orange placeholder:text-slate-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg font-bold text-xs transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Josan Logistics Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security SLAs</span>
            <span className="hover:text-slate-400 cursor-pointer">Carrier Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
