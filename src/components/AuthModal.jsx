import React, { useState, useEffect } from 'react';
import josanLogo from '../assets/josan_logo.png';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { X, Lock, Mail, ArrowRight, User, AlertCircle, Eye, EyeOff, Clock, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { openLegalDialog } from './LegalDialog';
import { normalizeRole, isStaffRole } from '../utils/roles';
import {
  getRegistrationCooldown,
  setRegistrationCooldown,
  clearRegistrationCooldown,
  formatCountdownTimer,
  subscribeToRegistrationCooldown,
  normalizeEmail
} from '../utils/registrationCooldown';

export const AuthModal = ({ setActiveTab }) => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalHideClose, 
    setAuthModalHideClose, 
    authRedirectTab, 
    setAuthRedirectTab, 
    setCurrentUser, 
    setCurrentRole,
    sessionExpiredMessage,
    setSessionExpiredMessage
  } = useLogistics();
  const [isLogin, setIsLogin] = useState(true);
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+65');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setCountryCode('+65');
    setPhoneDigits('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setConsentAgreed(false);
    setError('');
    setInfoMessage('');
    setCooldownSeconds(0);
  };

  useEffect(() => {
    if (isAuthModalOpen) {
      if (sessionExpiredMessage) {
        setIsLogin(true);
        setError(sessionExpiredMessage);
      } else {
        resetForm();
      }
    }
  }, [isAuthModalOpen, sessionExpiredMessage]);

  // Sync cooldown state whenever email or mode changes
  useEffect(() => {
    if (!isLogin && email) {
      const cd = getRegistrationCooldown(email);
      setCooldownSeconds(cd.active ? cd.remainingSeconds : 0);
    } else {
      setCooldownSeconds(0);
    }
  }, [isLogin, email]);

  // Cross-tab cooldown subscription
  useEffect(() => {
    if (!isLogin && email) {
      const unsubscribe = subscribeToRegistrationCooldown(email, (cd) => {
        setCooldownSeconds(cd.active ? cd.remainingSeconds : 0);
      });
      return unsubscribe;
    }
  }, [isLogin, email]);

  // Live countdown timer (ticks every second)
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          clearRegistrationCooldown(email);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds, email]);

  const handleClose = () => {
    setIsAuthModalOpen(false);
    if (setAuthRedirectTab) setAuthRedirectTab(null);
    if (setSessionExpiredMessage) setSessionExpiredMessage('');
    resetForm();
  };

  if (!isAuthModalOpen) return null;

  const validateEmail = (emailStr) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setInfoMessage('');

    const formData = e.currentTarget instanceof HTMLFormElement ? new FormData(e.currentTarget) : null;
    const cleanEmail = ((formData?.get('email') || email || '') + '').trim().toLowerCase();
    const cleanPassword = ((formData?.get('password') || password || '') + '');
    const cleanConfirm = ((formData?.get('confirmPassword') || confirmPassword || '') + '');

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email format (e.g. user@company.com)');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    if (!isLogin && cleanPassword !== cleanConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (!isLogin && !consentAgreed) {
      setError('Please agree to the Privacy Policy and Terms of Service to create an account.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Authentication service is currently unavailable.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (authError || !authData?.user) {
          const authMsg = (authError?.message || '').toLowerCase();
          if (authMsg.includes('email not confirmed')) {
            setError('Please verify your email address before signing in.');
          } else {
            setError('Incorrect email or password.');
          }
          return;
        }

        // Read role and status from public.profiles (id = session user id)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, status, name, email, company, phone')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          await supabase.auth.signOut().catch(() => {});
          setError(
            profileError
              ? 'Unable to verify your account profile. Please try again.'
              : 'Account profile not found. Please contact support.'
          );
          return;
        }

        const userRole = normalizeRole(profile.role);
        const userStatus = (profile.status || '').trim().toLowerCase();

        // Refuse staff roles (ADMIN, CRM, READONLY) on customer login
        if (isStaffRole(userRole)) {
          await supabase.auth.signOut().catch(() => {});
          setError('Staff accounts cannot sign in here. Please use the staff login.');
          return;
        }

        // Refuse unknown / non-CUSTOMER roles
        if (userRole !== 'CUSTOMER') {
          await supabase.auth.signOut().catch(() => {});
          setError('Access denied. A valid customer account is required to sign in here.');
          return;
        }

        // Require status Active
        if (userStatus !== 'active') {
          await supabase.auth.signOut().catch(() => {});
          setError('Your customer account is not active. Please contact support for assistance.');
          return;
        }

        // Customer login successful: in-memory state only, never write to localStorage
        try {
          localStorage.setItem('josan_last_activity', String(Date.now()));
        } catch (e) {}
        if (setSessionExpiredMessage) setSessionExpiredMessage('');

        const customerUser = {
          id: authData.user.id,
          name: profile.name || authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Customer',
          email: profile.email || authData.user.email,
          role: 'CUSTOMER',
          displayRole: 'Customer',
          company: profile.company || '',
          phone: profile.phone || ''
        };

        const destination = authRedirectTab || 'customer-dashboard';
        if (setCurrentUser) setCurrentUser(customerUser);
        if (setCurrentRole) setCurrentRole('CUSTOMER');

        setIsAuthModalOpen(false);
        setAuthModalHideClose(false);
        if (setAuthRedirectTab) setAuthRedirectTab(null);
        resetForm();

        if (setActiveTab) {
          setActiveTab(destination, true, customerUser);
        }
        return;
      }

      // Customer Registration Cooldown Pre-checks
      const activeCooldown = getRegistrationCooldown(cleanEmail);
      if (activeCooldown.active) {
        setCooldownSeconds(activeCooldown.remainingSeconds);
        setError('');
        setIsSubmitting(false);
        return;
      }

      // Backend security: Server-side registration rate limit pre-check
      try {
        const rateRes = await fetch('/api/auth/register-rate-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check', email: cleanEmail }),
          signal: AbortSignal.timeout(3000)
        });
        if (rateRes.status === 429) {
          const rateData = await rateRes.json().catch(() => ({}));
          const retryAfter = rateData.retryAfter || 300;
          setRegistrationCooldown(cleanEmail, retryAfter);
          setCooldownSeconds(retryAfter);
          setError('');
          setIsSubmitting(false);
          return;
        }
      } catch (e) {
        // Continue cleanly if offline or serverless cold-start
      }

      // Customer Registration with Supabase
      const cleanPhone = `${countryCode} ${phoneDigits.replace(/[^0-9]/g, '')}`.trim();
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/#email-verified`
        : 'https://josanlogistics.com.sg/#email-verified';

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(),
            phone: cleanPhone
          }
        }
      });

      if (signUpError) {
        const errorMsg = (signUpError.message || '').toLowerCase();
        const isRateLimit = 
          signUpError.status === 429 || 
          signUpError.code === '429' ||
          errorMsg.includes('rate limit') || 
          errorMsg.includes('rate_limit') || 
          errorMsg.includes('over_email_send_rate_limit') ||
          errorMsg.includes('too many requests') ||
          errorMsg.includes('email rate limit exceeded');

        if (isRateLimit) {
          // Activate 5-minute (300-second) cooldown
          setRegistrationCooldown(cleanEmail, 300);
          setCooldownSeconds(300);
          setError('');
          return;
        }

        // Do not expose whether an email address is already registered
        const isAlreadyRegistered = 
          errorMsg.includes('already registered') || 
          errorMsg.includes('already exists') || 
          signUpError.code === 'user_already_exists';

        if (isAlreadyRegistered) {
          setRegistrationCooldown(cleanEmail, 300);
          resetForm();
          setIsLogin(true);
          setInfoMessage('Account created. Please check your email to verify your account before signing in.');
          return;
        }

        if (errorMsg.includes('failed to fetch') || errorMsg.includes('network') || errorMsg.includes('networkerror')) {
          setError('Network connection error. Please check your internet connection and try again.');
          return;
        }

        setError(signUpError.message || 'Registration failed.');
        return;
      }

      if (signUpData?.user && signUpData?.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role, status, name, email, company, phone')
          .eq('id', signUpData.user.id)
          .maybeSingle();

        if (profile) {
          const profileRole = normalizeRole(profile.role);
          const profileStatus = (profile.status || '').trim().toLowerCase();
          if (isStaffRole(profileRole) || (profileRole !== 'CUSTOMER')) {
            await supabase.auth.signOut().catch(() => {});
            setError('Access denied. This portal is only available to customer accounts.');
            return;
          }
          if (profileStatus && profileStatus !== 'active') {
            await supabase.auth.signOut().catch(() => {});
            setError('Your customer account is not active. Please contact support for assistance.');
            return;
          }
        }

        try {
          localStorage.setItem('josan_last_activity', String(Date.now()));
        } catch (e) {}
        if (setSessionExpiredMessage) setSessionExpiredMessage('');

        const customerUser = {
          id: signUpData.user.id,
          name: profile?.name || fullName.trim() || signUpData.user.email?.split('@')[0] || 'Customer',
          email: profile?.email || signUpData.user.email || cleanEmail,
          role: 'CUSTOMER',
          displayRole: 'Customer',
          company: profile?.company || '',
          phone: profile?.phone || cleanPhone
        };

        const destination = authRedirectTab || 'customer-dashboard';
        if (setCurrentUser) setCurrentUser(customerUser);
        if (setCurrentRole) setCurrentRole('CUSTOMER');

        setIsAuthModalOpen(false);
        setAuthModalHideClose(false);
        if (setAuthRedirectTab) setAuthRedirectTab(null);
        resetForm();

        if (setActiveTab) {
          setActiveTab(destination, true, customerUser);
        }
        return;
      }

      // Email confirmation required before session is active
      // Set 5-minute cooldown to prevent repeated OTP / confirmation email spam
      setRegistrationCooldown(cleanEmail, 300);
      resetForm();
      setIsLogin(true);
      setInfoMessage('Account created. Please check your email to verify your account before signing in.');
    } catch (err) {
      await supabase.auth.signOut().catch(() => {});
      const errMsg = (err?.message || '').toLowerCase();
      if (
        err?.status === 429 ||
        errMsg.includes('rate limit') ||
        errMsg.includes('email rate limit exceeded') ||
        errMsg.includes('too many requests')
      ) {
        setRegistrationCooldown(cleanEmail, 300);
        setCooldownSeconds(300);
        setError('');
      } else {
        setError(err?.message || (isLogin ? 'Unable to sign in. Please try again.' : 'Registration failed.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget && !authModalHideClose) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Header Banner */}
        <div className="bg-[#10182D] p-5 text-white sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2.5">
            <img src={josanLogo} alt="Josan Logistics" className="h-10 w-auto object-contain" />
            <div>
              <h3 className="text-base font-bold tracking-tight font-heading text-white">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="text-[11px] text-[#FF6B00] font-semibold">Josan Logistics Portal</p>
            </div>
          </div>

          {!authModalHideClose && (
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Registration 5-Minute Cooldown Alert Banner */}
          {!isLogin && cooldownSeconds > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-sm space-y-1.5 animate-fade-in">
              <div className="flex items-center space-x-2 text-amber-800 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Too many registration attempts. Please try again in 5 minutes.</span>
              </div>
              <div className="pl-6 text-[11px] text-amber-700 font-semibold flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 inline shrink-0" />
                <span>Try again in <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">{formatCountdownTimer(cooldownSeconds)}</span></span>
              </div>
            </div>
          )}

          {error && (!cooldownSeconds || isLogin) && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

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
                        name="email"
                        type="email"
                        autoComplete="email"
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
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="text"
                      autoComplete="username email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@company.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only for Customer Sign Up) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Consent Checkbox on Registration */}
              {!isLogin && (
                <div className="pt-1">
                  <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#FF6B00] rounded border-slate-300 focus:ring-[#FF6B00] cursor-pointer"
                    />
                    <span className="leading-relaxed">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openLegalDialog('privacy', e.currentTarget);
                        }}
                        className="text-[#FF6B00] hover:underline font-bold inline cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openLegalDialog('terms', e.currentTarget);
                        }}
                        className="text-[#FF6B00] hover:underline font-bold inline cursor-pointer"
                      >
                        Terms of Service
                      </button>
                      .
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || (!isLogin && cooldownSeconds > 0)}
                className="w-full h-11 bg-[#FF6B00] hover:bg-[#E55C00] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (!isLogin && cooldownSeconds > 0) ? (
                  <>
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Try again in {formatCountdownTimer(cooldownSeconds)}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Register Account'}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>

              {/* Terms & Privacy Notice on Sign In */}
              {isLogin && (
                <p className="text-center text-[11px] text-slate-500 mt-2 leading-relaxed">
                  By signing in, you agree to our{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openLegalDialog('terms', e.currentTarget);
                    }}
                    className="text-[#FF6B00] hover:underline font-semibold inline cursor-pointer"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openLegalDialog('privacy', e.currentTarget);
                    }}
                    className="text-[#FF6B00] hover:underline font-semibold inline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              )}

          <div className="pt-2 text-center text-xs text-slate-500 font-medium">
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="font-semibold text-[#FF6B00] hover:underline cursor-pointer"
            >
              {isLogin ? 'Register now' : 'Sign In'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
