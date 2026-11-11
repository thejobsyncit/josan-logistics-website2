import React, { useState, useEffect } from 'react';
import josanLogo from '../assets/josan_logo.png';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { X, Lock, Mail, ArrowRight, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { openLegalDialog } from './LegalDialog';

export const AuthModal = ({ setActiveTab }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalHideClose, setAuthModalHideClose, loginUser, authRedirectTab, setAuthRedirectTab, setCurrentUser, setCurrentRole } = useLogistics();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer');
  
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

  // Driver Registration Profile Picture & Hub
  const defaultDriverPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const [driverPhoto, setDriverPhoto] = useState(defaultDriverPhoto);
  const [assignedHub, setAssignedHub] = useState('Changi Air Cargo Logistics Hub');

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
  };

  useEffect(() => {
    if (isAuthModalOpen) {
      resetForm();
    }
  }, [isAuthModalOpen]);

  const handleClose = () => {
    setIsAuthModalOpen(false);
    if (setAuthRedirectTab) setAuthRedirectTab(null);
    resetForm();
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

    if (isLogin) {
      if (role === 'customer') {
        if (!isSupabaseConfigured) {
          setError('Authentication service is currently unavailable.');
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (authError || !authData?.user) {
          setError('Incorrect email or password.');
          return;
        }

        // Read role and status from the profiles table (id = session user id)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, status, name, email, company, phone')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          await supabase.auth.signOut().catch(() => {});
          setError('Incorrect email or password.');
          return;
        }

        const userRole = (profile.role || '').toUpperCase();
        const userStatus = (profile.status || '').toLowerCase();

        // If the role is ADMIN, CRM or READONLY, sign out and show "Please use the staff login."
        if (userRole === 'ADMIN' || userRole === 'CRM' || userRole === 'READONLY') {
          await supabase.auth.signOut().catch(() => {});
          setError('Please use the staff login.');
          return;
        }

        // Allow customer access only if the role is CUSTOMER and status is Active
        if (userRole !== 'CUSTOMER' || userStatus !== 'active') {
          await supabase.auth.signOut().catch(() => {});
          setError('Incorrect email or password.');
          return;
        }

        // Customer login successful: in-memory state only, never write to localStorage
        const customerUser = {
          id: authData.user.id,
          name: profile.name || authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Customer',
          email: profile.email || authData.user.email,
          role: 'CUSTOMER',
          displayRole: 'Customer',
          company: profile.company || '',
          phone: profile.phone || ''
        };

        if (setCurrentUser) setCurrentUser(customerUser);
        if (setCurrentRole) setCurrentRole('CUSTOMER');

        setIsAuthModalOpen(false);
        setAuthModalHideClose(false);
        resetForm();

        if (setActiveTab) {
          if (authRedirectTab) {
            setActiveTab(authRedirectTab, true, customerUser);
            if (setAuthRedirectTab) setAuthRedirectTab(null);
          } else {
            setActiveTab('customer-dashboard', true, customerUser);
          }
        }
        return;
      }

      // Driver login (Admin provisioned account)
      if (role === 'driver') {
        const res = loginUser(
          cleanEmail,
          cleanPassword,
          role,
          setActiveTab,
          {
            fullName,
            phone: `${countryCode} ${phoneDigits.replace(/[^0-9]/g, '')}`
          }
        );

        if (res && res.success === false) {
          setError(res.error || 'Login failed. Please check your credentials.');
        } else {
          setIsAuthModalOpen(false);
          setAuthModalHideClose(false);
          resetForm();
          if (setActiveTab) {
            setActiveTab('driver-dashboard', true, res?.user);
          }
        }
        return;
      }
    } else {
      // Customer Registration
      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: fullName,
              phone: `${countryCode} ${phoneDigits.replace(/[^0-9]/g, '')}`,
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (signUpData?.user && signUpData?.session) {
          const customerUser = {
            id: signUpData.user.id,
            name: fullName || signUpData.user.email?.split('@')[0] || 'Customer',
            email: cleanEmail,
            role: 'CUSTOMER',
            displayRole: 'Customer',
            phone: `${countryCode} ${phoneDigits.replace(/[^0-9]/g, '')}`
          };
          if (setCurrentUser) setCurrentUser(customerUser);
          if (setCurrentRole) setCurrentRole('CUSTOMER');
        }

        setIsAuthModalOpen(false);
        setAuthModalHideClose(false);
        resetForm();

        if (setActiveTab) {
          if (authRedirectTab) {
            setActiveTab(authRedirectTab, true);
            if (setAuthRedirectTab) setAuthRedirectTab(null);
          } else {
            setActiveTab('customer-dashboard', true);
          }
        }
        return;
      } catch (err) {
        setError(err.message || 'Registration failed.');
        return;
      }
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
                resetForm();
              }}
              className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus-orange cursor-pointer"
            >
              <option value="customer">Customer Portal</option>
              <option value="driver">Driver (Admin Provisioned Account)</option>
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
                  onClick={() => {
                    setIsLogin(true);
                    resetForm();
                  }}
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
                    {role === 'driver' ? 'Driver Email or Phone Contact' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="text"
                      autoComplete="username email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'driver' ? 'e.g. gurpreet@josanlogistics.com or +65 XXXX XXXX' : 'user@company.com'}
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
                className="w-full h-11 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                <span>{isLogin ? 'Sign In' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
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
            </>
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
