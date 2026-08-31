import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { X, Lock, Mail, User, Building, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal = ({ setActiveTab }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser } = useLogistics();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email || (role === 'admin' ? 'admin@josanlogistics.com' : 'customer@techcorp.com'), role, setActiveTab);
  };

  const handleQuickLogin = (selectedRole) => {
    const demoEmail = selectedRole === 'admin' ? 'alexander@josanlogistics.com' : 'shipping@techcorp.com';
    loginUser(demoEmail, selectedRole, setActiveTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden relative">
        
        {/* Header Banner */}
        <div className="bg-orange-gradient p-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 mb-2">
            <img src="/assets/josan_logo.jpg" alt="Josan Logistics" className="h-10 w-auto object-contain rounded-lg bg-white p-1" />
          </div>
          <h3 className="text-lg font-bold">
            {isLogin ? 'Access Your Freight Portal' : 'Create Enterprise Account'}
          </h3>
          <p className="text-xs text-orange-100 mt-1">
            Real-time tracking, automated dispatch, & invoice management.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Demo Login Preset Buttons */}
          <div className="bg-orange-50/70 border border-orange-200/60 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-orange-900 mb-2">⚡ Quick 1-Click Portal Login:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer Portal</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('driver')}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Fleet Driver Login</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Role Access</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    role === 'customer'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Customer User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    role === 'driver'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Fleet Driver
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@josanlogistics.com' : 'user@company.com'}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus-orange"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus-orange"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm shadow-orange-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'Sign In to Portal' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-orange-600 hover:underline"
            >
              {isLogin ? 'Register now' : 'Sign In'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
