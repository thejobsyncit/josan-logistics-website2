import React, { useState } from 'react';
import josanLogo from '../assets/josan_logo.png';
import { useLogistics } from '../context/LogisticsContext';
import { supabase } from '../services/supabase';
import { normalizeRole } from '../utils/roles';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft
} from 'lucide-react';

export const AdminLoginPage = ({ setActiveTab }) => {
  const { setCurrentUser, setCurrentRole, loginUser, showToast } = useLogistics();

  const [email, setEmail] = useState('josanlogisticss@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const performFullSignOutCleanup = async () => {
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut().catch(() => {});
      }
    } catch (e) {}
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('josan_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch (e) {}
  };

  const handleAdminSignIn = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const formData = (e && e.currentTarget instanceof HTMLFormElement) ? new FormData(e.currentTarget) : null;
    const cleanEmail = ((formData?.get('email') || email || '') + '').trim().toLowerCase();
    const cleanPassword = ((formData?.get('password') || password || '') + '').trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your admin email and password.');
      return;
    }

    setLoading(true);

    try {
      // Clear any pre-existing sessions first
      await performFullSignOutCleanup();

      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error || !data?.user) {
        await performFullSignOutCleanup();
        if (error?.message?.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please verify your credentials.');
        } else {
          setErrorMessage(error?.message || 'Authentication failed.');
        }
        setLoading(false);
        return;
      }

      // 2. Read role and status from public.profiles
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('id, role, status, name, email, company')
        .eq('id', data.user.id)
        .maybeSingle();

      if (pError || !profile) {
        await performFullSignOutCleanup();
        setErrorMessage('Access denied. Administrator credentials required.');
        setLoading(false);
        return;
      }

      // Check status: must be Active
      if ((profile.status || '').toLowerCase() !== 'active') {
        await performFullSignOutCleanup();
        setErrorMessage('Access denied. Administrator credentials required.');
        setLoading(false);
        return;
      }

      // Check role: must be ADMIN only
      const normRole = normalizeRole(profile.role);
      if (normRole !== 'ADMIN') {
        await performFullSignOutCleanup();
        setErrorMessage('Access denied. Administrator credentials required.');
        setLoading(false);
        return;
      }

      // Successful Admin Authentication
      setSuccessMessage('Authentication successful! Opening Admin Portal...');
      loginAsAdminSession(data.user, data.session?.access_token, profile);
    } catch (err) {
      await performFullSignOutCleanup();
      setErrorMessage('Access denied. Administrator credentials required.');
      setLoading(false);
    }
  };

  const loginAsAdminSession = (supabaseUser, token, profile) => {
    const adminUser = {
      id: supabaseUser?.id || profile?.id || `ADM-${Date.now()}`,
      name: profile?.name || supabaseUser?.user_metadata?.full_name || 'System Administrator',
      email: supabaseUser?.email || email,
      role: 'ADMIN',
      displayRole: 'Admin',
      company: profile?.company || 'Josan Logistics Operations',
      phone: supabaseUser?.user_metadata?.phone || '+65 6789 0123'
    };

    try {
      localStorage.setItem('josan_user', JSON.stringify(adminUser));
      localStorage.setItem('josan_role', 'ADMIN');
      localStorage.setItem('josan_staff_user', JSON.stringify(adminUser));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    if (typeof setCurrentUser === 'function') {
      setCurrentUser(adminUser);
    }
    if (typeof setCurrentRole === 'function') {
      setCurrentRole('ADMIN');
    }

    if (showToast) {
      showToast(`Welcome back, ${adminUser.name}! (Admin Portal)`, 'success');
    }

    setLoading(false);

    if (typeof setActiveTab === 'function') {
      setActiveTab('admin-dashboard', true, adminUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#071324] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center space-x-3 pt-2">
            <img 
              src={josanLogo} 
              alt="Josan Logistics" 
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col text-left">
              <span className="text-white font-black text-2xl tracking-wider leading-none">
                JOSAN
              </span>
              <span className="text-[#B6C2D1] font-bold text-[10px] tracking-widest uppercase mt-0.5">
                LOGISTICS PTE. LTD.
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight pt-2">
            Admin Portal Sign In
          </h1>
          <p className="text-xs text-slate-400">
            Restricted administrative control portal for Josan Logistics operations
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1 font-semibold">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  autoComplete="username email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@josan.sg"
                  className="w-full pl-10 pr-4 py-3 bg-[#132A4A] border border-[#1E3A5F] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#F26B21] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Admin Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#132A4A] border border-[#1E3A5F] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#F26B21] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#F26B21] hover:bg-[#D95A13] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-orange-500/20 disabled:opacity-75 active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              if (typeof window !== 'undefined') window.location.hash = '#home';
            }}
            className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('staff-login');
              if (typeof window !== 'undefined') window.location.hash = '#staff-login';
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Staff Portal (CRM) &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
