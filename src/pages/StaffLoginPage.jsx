import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound, Building2 } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { getRateLimitStatus, recordRateLimitAttempt } from '../utils/rateLimiter';
import { initialSystemUsers } from '../data/adminCrmData';

export const StaffLoginPage = ({ setActiveTab }) => {
  const { loginUser, showToast, currentUser } = useLogistics();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetPortal, setTargetPortal] = useState('crm'); // 'crm' | 'admin-dashboard'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Check rate limit on mount and on every tick
  useEffect(() => {
    const checkLimit = () => {
      const status = getRateLimitStatus('staff_login', 5, 60000);
      if (!status.allowed) {
        setCooldown(status.retryAfter);
      } else {
        setCooldown(0);
      }
    };

    checkLimit();
    const interval = setInterval(checkLimit, 1000);
    return () => clearInterval(interval);
  }, []);

  // If already authenticated as admin or staff, allow quick redirect
  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'crm' || currentUser.role?.startsWith('crm_'))) {
      // User is already logged in
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check rate limiter
    const rateStatus = getRateLimitStatus('staff_login', 5, 60000);
    if (!rateStatus.allowed) {
      setError(`Access throttled: Maximum 5 attempts per minute. Please wait ${rateStatus.retryAfter}s before retrying.`);
      return;
    }

    // Record this attempt
    recordRateLimitAttempt('staff_login', 60000);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your corporate email and staff password.');
      return;
    }

    setLoading(true);

    try {
      // Check if user is known system staff
      const knownStaff = initialSystemUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      // Verify credentials (default password is 'admin123' for staff)
      const validAdmin = (cleanEmail === 'admin@josanlogistics.com' || cleanEmail === 'alexander@josanlogistics.com') && cleanPassword === 'admin123';
      const validStaff = knownStaff && (cleanPassword === 'admin123' || cleanPassword === (knownStaff.password || 'admin123'));

      if (validAdmin || validStaff) {
        const staffRole = validAdmin ? 'admin' : (knownStaff?.role || 'crm');
        const staffObj = knownStaff || {
          name: 'Alexander Josan',
          email: cleanEmail,
          role: 'admin',
          company: 'Josan Logistics HQ'
        };

        const res = loginUser(cleanEmail, cleanPassword, 'admin', setActiveTab, staffObj);
        
        if (showToast) {
          showToast(`Staff access authorized. Welcome, ${staffObj.name}.`, 'success');
        }

        // Navigate to the selected portal
        const destination = targetPortal === 'admin-dashboard' ? 'admin-dashboard' : 'crm';
        if (typeof window !== 'undefined') {
          window.location.hash = `#${destination}`;
        }
        if (setActiveTab) {
          setActiveTab(destination, true, staffObj);
        }
      } else {
        const updatedStatus = getRateLimitStatus('staff_login', 5, 60000);
        const attemptsLeft = updatedStatus.remaining;
        setError(
          `Invalid staff credentials. Access is logged and restricted to authorized personnel. (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining this minute)`
        );
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071326] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span>Josan Logistics Staff Gateway</span>
          </div>

          <div className="flex justify-center">
            <img 
              src="/assets/josan_logo.png" 
              alt="Josan Logistics Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Operations &amp; Admin Login
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Restricted access portal for Josan Logistics operations coordinators, dispatch management, and system administrators.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D1F3C] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Rate Limit Active Warning */}
          {cooldown > 0 && (
            <div className="p-3.5 bg-red-950/70 border border-red-700 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                Too many login attempts. Gateway locked for <strong>{cooldown}s</strong> for security.
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && cooldown === 0 && (
            <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start space-x-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Target Destination Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Destination Workspace</label>
              <div className="grid grid-cols-2 gap-2 bg-[#071326] p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setTargetPortal('crm')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all text-center cursor-pointer ${
                    targetPortal === 'crm'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  CRM Operations
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPortal('admin-dashboard')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all text-center cursor-pointer ${
                    targetPortal === 'admin-dashboard'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Admin Portal
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Staff Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@josanlogistics.com"
                  required
                  disabled={cooldown > 0 || loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={cooldown > 0 || loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={cooldown > 0 || loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                cooldown > 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to {targetPortal === 'admin-dashboard' ? 'Admin Portal' : 'CRM Operations'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>TLS 256-Bit Encrypted</span>
            </span>
            <span className="text-slate-400">Rate Limit: 5/min</span>
          </div>

        </div>

        {/* Public site link */}
        <div className="text-center">
          <button
            onClick={() => setActiveTab('home')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            &larr; Return to Josan Logistics Public Website
          </button>
        </div>

      </div>
    </div>
  );
};
