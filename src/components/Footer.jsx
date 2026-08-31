import React, { useState } from 'react';
import { Truck, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Globe, Clock, CheckCircle2 } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

export const Footer = ({ setActiveTab }) => {
  const { showToast } = useLogistics();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      showToast('Thank you for subscribing to Josan Logistics newsletter!');
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t-4 border-orange-500 relative overflow-hidden">
      {/* Background Accent SVG Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <img 
                src="/assets/josan_logo.jpg" 
                alt="Josan Logistics Logo" 
                className="h-14 w-auto object-contain rounded-xl bg-white p-1" 
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Josan Logistics is a global leader in intelligent supply chain management, offering express freight, air cargo, ocean shipping, and smart automated warehousing.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>ISO 9001 Certified</span>
              </span>
              <span className="flex items-center space-x-1">
                <Globe className="w-4 h-4 text-orange-400" />
                <span>120+ Hubs Worldwide</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 font-sans border-b border-slate-800 pb-2">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              {['Home', 'About Us', 'Services', 'Track Shipment', 'Book Shipment', 'Contact'].map((item) => {
                const tabId = item.toLowerCase().replace(' ', '').replace('us', '');
                return (
                  <li key={item}>
                    <button
                      onClick={() => setActiveTab(tabId === 'trackshipment' ? 'track' : tabId === 'bookshipment' ? 'book' : tabId)}
                      className="hover:text-orange-400 transition-colors flex items-center space-x-1.5"
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
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('services')}>Express Air Cargo</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('services')}>Heavy Freight Trucking</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('services')}>Ocean Shipping & Containers</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('services')}>Smart Cold-Chain Logistics</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('services')}>Automated Warehousing</li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 font-sans border-b border-slate-800 pb-2">Dispatch Hotline</h4>
            <div className="space-y-3 text-xs text-slate-400 mb-4">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Global HQ: 450 Logistics Parkway, Suite 100, Chicago, IL 60607</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-white font-semibold">+1 (800) 555-JOSAN</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@josanlogistics.com</span>
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
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
