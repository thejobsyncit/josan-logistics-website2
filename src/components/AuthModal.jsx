import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { X, Lock, Mail, ArrowRight, User, AlertCircle } from 'lucide-react';

export const AuthModal = ({ setActiveTab }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalHideClose, loginUser } = useLogistics();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer');
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+65');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Driver Registration Profile Picture & Hub
  const defaultDriverPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const [driverPhoto, setDriverPhoto] = useState(defaultDriverPhoto);
  const [assignedHub, setAssignedHub] = useState('Changi Air Cargo Logistics Hub');

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDriverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthModalOpen) return null;

  const validateEmail = (emailStr) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email && !validateEmail(email)) {
      setError('Please enter a valid email format (e.g. user@company.com)');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    loginUser(
      email || (role === 'admin' ? 'admin@josanlogistics.com' : role === 'driver' ? 'gurpreet@josanlogistics.com' : 'customer@techcorp.com'),
      role,
      setActiveTab,
      {
        fullName,
        phone: `${countryCode} ${phoneDigits.replace(/[^0-9]/g, '')}`
      }
    );
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget && !authModalHideClose) {
          setIsAuthModalOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Header Banner */}
        <div className="bg-orange-gradient p-5 text-white sticky top-0 z-10 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <img src="/assets/josan_logo.jpg" alt="Josan Logistics" className="h-9 w-auto object-contain rounded-lg bg-white p-1" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight font-sans">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="text-[11px] text-orange-100 font-medium">Josan Logistics Portal</p>
            </div>
          </div>

          {!authModalHideClose && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Access Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError('');
              }}
              className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus-orange cursor-pointer"
            >
              <option value="customer">Customer</option>
              <option value="driver">Driver (Admin Provisioned)</option>
              <option value="admin">Admin Portal</option>
            </select>
          </div>

          {/* DRIVER REGISTER RESTRICTION NOTICE */}
          {!isLogin && role === 'driver' ? (
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-slate-800 text-xs space-y-3">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-orange-900 text-sm mb-1">Driver Provisioning Required</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Driver accounts cannot be self-registered online. All driver profiles, vehicle assignments, and credentials must be created directly by an Administrator in the <strong>Admin Control Portal</strong>.
                  </p>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between border-t border-orange-200">
                <span className="text-[11px] font-bold text-slate-500">Already registered by Admin?</span>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Switch to Driver Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* REGISTRATION FORM (CUSTOMERS ONLY) */}
              {!isLogin && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                          setFullName(lettersOnly);
                        }}
                        placeholder="e.g. John Doe"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Letters only (no numbers)</span>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        title="Please enter a valid email address (e.g. user@company.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@company.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Phone Number with Country Code Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Phone Contact *</span>
                      <span className="text-[10px] text-orange-600 font-bold uppercase">Digits Only</span>
                    </label>
                    <div className="flex items-center">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="p-2.5 bg-slate-100 border border-slate-300 rounded-l-xl text-slate-900 font-extrabold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none"
                      >
                        {countryCodesList.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={getPhoneLength(countryCode)}
                        value={phoneDigits}
                        onChange={(e) => {
                          const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(countryCode));
                          setPhoneDigits(numericOnly);
                        }}
                        placeholder={`e.g. ${'9'.repeat(getPhoneLength(countryCode))}`}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-r-xl text-slate-900 font-mono font-bold focus-orange text-xs"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* SIGN IN FORM */}
              {isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'driver' ? 'Driver Email or Phone Contact' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'driver' ? 'e.g. gurpreet@josanlogistics.com or +65 9123 4567' : 'user@company.com'}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {role === 'driver' && (
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Use the email or phone number created by Admin in the Fleet Control Portal
                    </span>
                  )}
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Confirm Password (only for Customer Sign Up) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-orange-sm transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                <span>{isLogin ? 'Sign In' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="pt-2 text-center text-xs text-slate-500 font-medium">
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-extrabold text-orange-600 hover:underline cursor-pointer"
            >
              {isLogin ? 'Register now' : 'Sign In'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
