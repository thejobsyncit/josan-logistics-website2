import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { X, Lock, Mail, ArrowRight, User, Phone, Calendar, FileText, AlertCircle } from 'lucide-react';

export const AuthModal = ({ setActiveTab }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser } = useLogistics();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer');
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+65');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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
        phone: `${countryCode} ${phoneDigits.replace(/[^0-9]/g, '')}`,
        licenseNumber,
        dob
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
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

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
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
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* REGISTRATION MODE */}
          {!isLogin ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      const lettersOnly = e.target.value.replace(/[0-9]/g, '');
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
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Must be valid email format (e.g. name@company.com)</span>
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
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  Accepts numbers only (max {getPhoneLength(countryCode)} digits for {countryCode})
                </span>
              </div>

              {/* DRIVER-ONLY FIELDS */}
              {role === 'driver' && (
                <>
                  {/* License Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">License Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="e.g. S1234567A / Class 4 Driver License"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                        required
                      />
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                        required
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </>
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

              {/* Confirm Password */}
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
            </>
          ) : (
            /* SIGN IN MODE */
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@company.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-orange-sm transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
          >
            <span>{isLogin ? 'Sign In' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

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
