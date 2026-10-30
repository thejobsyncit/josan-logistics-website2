import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { supabase } from '../services/supabase';
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
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('System Administrator');

  const handleAdminSignIn = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your admin email and password.');
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        // Sign up in Supabase (trigger assigns CUSTOMER role; admin role must be assigned by existing admin)
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data?.user) {
          setSuccessMessage('Account created in Supabase! Signing you in...');
          loginAsAdminSession(data.user, data.session?.access_token, 'ADMIN');
          return;
        }
      }

      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        if (error.message?.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please verify your credentials.');
        } else {
          setErrorMessage(error.message || 'Supabase authentication failed.');
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        setSuccessMessage('Authentication successful! Opening Admin Portal...');
        loginAsAdminSession(data.user, data.session?.access_token, 'ADMIN');
      } else {
        setErrorMessage('Authentication succeeded but no user session was returned.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Admin Supabase Auth Error:', err);
      setErrorMessage(err.message || 'Failed to authenticate with Supabase.');
      setLoading(false);
    }
  };

  // If already authenticated as admin, automatically route to admin dashboard
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('josan_user') || 'null');
      if (saved && (saved.role || '').toLowerCase() === 'admin') {
        if (typeof setActiveTab === 'function') {
          setActiveTab('admin-dashboard', true, saved);
        }
      }
    } catch (e) {}
  }, []);

  const loginAsAdminSession = (supabaseUser, token, displayRole = 'ADMIN') => {
    const adminUser = {
      id: supabaseUser?.id || `ADM-${Date.now()}`,
      name: supabaseUser?.user_metadata?.full_name || fullName || 'System Administrator',
      email: supabaseUser?.email || email,
      role: 'admin',
      displayRole: 'Admin',
      company: 'Josan Logistics Operations',
      phone: supabaseUser?.user_metadata?.phone || '+65 6789 0123'
    };

    try {
      localStorage.setItem('josan_user', JSON.stringify(adminUser));
      localStorage.setItem('josan_role', 'admin');
      localStorage.setItem('josan_staff_user', JSON.stringify(adminUser));
      localStorage.setItem('josan_staff_token', token || 'supabase_admin_token_' + Date.now());
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    if (typeof setCurrentUser === 'function') {
      setCurrentUser(adminUser);
    }
    if (typeof setCurrentRole === 'function') {
      setCurrentRole('admin');
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
              src="/assets/josan_logo.png" 
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
            {isRegisterMode ? 'Register Admin Account' : 'Admin Portal Sign In'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegisterMode 
              ? 'Create your administrator credentials in Supabase'
              : 'Direct authentication powered by Supabase Auth'}
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
            
            {/* Full Name field if register mode */}
            {isRegisterMode && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. System Administrator"
                  className="w-full px-4 py-3 bg-[#132A4A] border border-[#1E3A5F] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#F26B21] transition-colors"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
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
                {!isRegisterMode && (
                  <span className="text-[11px] text-slate-400">
                    Supabase Auth
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  <span>Connecting to Supabase...</span>
                </>
              ) : (
                <>
                  <span>{isRegisterMode ? 'Create Admin Account' : 'Sign In as Administrator'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register Mode */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-xs text-[#F26B21] hover:underline cursor-pointer font-semibold"
            >
              {isRegisterMode 
                ? 'Already have an admin account in Supabase? Sign in here' 
                : 'Need to create this admin account in your new Supabase project? Click here'}
            </button>
          </div>
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
