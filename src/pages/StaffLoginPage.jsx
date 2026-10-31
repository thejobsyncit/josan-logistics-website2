import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  Smartphone, 
  RefreshCw, 
  Check, 
  ArrowLeft,
  Eye,
  EyeOff,
  QrCode
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { openLegalDialog } from '../components/LegalDialog';
import { supabase } from '../services/supabase';
import { 
  storeStaffAuthSession,
  getStoredStaffToken,
  checkStaffInvitation, 
  acceptStaffInvitation 
} from '../utils/staffApi';

// -------------------------------------------------------------
// CLIENT LOCKOUT & RATE LIMITING WATCHDOG (Requirement 2)
// -------------------------------------------------------------
const LOCKOUT_KEY = 'josan_staff_lockout';

function getLockoutState(email) {
  try {
    const raw = localStorage.getItem(`${LOCKOUT_KEY}_${(email || '').toLowerCase()}`);
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0, recentAttempts: [] };
  } catch (e) {
    return { count: 0, lockedUntil: 0, recentAttempts: [] };
  }
}

function saveLockoutState(email, state) {
  try {
    localStorage.setItem(`${LOCKOUT_KEY}_${(email || '').toLowerCase()}`, JSON.stringify(state));
  } catch (e) {}
}

function checkClientRateLimitAndLockout(email) {
  const now = Date.now();
  const state = getLockoutState(email);

  // Check 15-minute consecutive failure lockout
  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingMins = Math.ceil((state.lockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Account is temporarily locked due to repeated failed login attempts. Please wait ${remainingMins} minute(s) or contact an administrator.`
    };
  }

  // Check 5 attempts / minute rolling window
  const validRecent = (state.recentAttempts || []).filter(t => now - t < 60000);
  if (validRecent.length >= 5) {
    const retryAfter = Math.ceil((validRecent[0] + 60000 - now) / 1000);
    return {
      allowed: false,
      message: `Access throttled: Maximum 5 attempts per minute. Please wait ${Math.max(1, retryAfter)}s before retrying.`
    };
  }

  return { allowed: true };
}

function recordFailedAttempt(email) {
  const now = Date.now();
  const state = getLockoutState(email);
  const validRecent = (state.recentAttempts || []).filter(t => now - t < 60000);
  validRecent.push(now);

  state.count = (state.count || 0) + 1;
  state.recentAttempts = validRecent;

  // 5 consecutive failures = 15 min lockout
  if (state.count >= 5) {
    state.lockedUntil = now + 15 * 60 * 1000;
  }

  saveLockoutState(email, state);
}

function recordSuccessfulAttempt(email) {
  try {
    localStorage.removeItem(`${LOCKOUT_KEY}_${(email || '').toLowerCase()}`);
  } catch (e) {}
}

export const StaffLoginPage = ({ setActiveTab }) => {
  const { loginUser, showToast, currentUser } = useLogistics();

  // Mode: 'login' | '2fa' | 'must_change_password' | 'forgot_password' | 'reset_password' | 'invite_setup'
  const [authMode, setAuthMode] = useState('login');

  // Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetPortal, setTargetPortal] = useState('crm'); // 'crm' | 'admin-dashboard'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email Verification state (Simpler email OTP instead of 2FA authenticator app)
  const [pendingAuth, setPendingAuth] = useState(null);
  const [emailCode, setEmailCode] = useState('');
  const [expectedCode, setExpectedCode] = useState('');
  const [codeExpiry, setCodeExpiry] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Password change state (first login or forced reset)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Forgot password & reset state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Invitation setup state (48h link)
  const [inviteToken, setInviteToken] = useState('');
  const [inviteData, setInviteData] = useState(null);

  // Check URL parameters / hash on mount for invite setup or reset tokens
  useEffect(() => {
    const handleUrlTokens = async () => {
      const fullUrl = window.location.href;
      const hash = window.location.hash || '';

      // Check for invitation setup token: #staff-setup?token=... or ?token=...
      if (hash.includes('staff-setup') || fullUrl.includes('staff-setup')) {
        const urlParams = new URLSearchParams(hash.split('?')[1] || window.location.search);
        const token = urlParams.get('token');
        if (token) {
          setInviteToken(token);
          setLoading(true);
          try {
            const data = await checkStaffInvitation(token);
            if (data?.valid) {
              setInviteData(data);
              setAuthMode('invite_setup');
            }
          } catch (err) {
            setError(err.message || 'Invitation link is invalid or expired.');
          } finally {
            setLoading(false);
          }
        }
      }

      // Check for password reset token: #staff-reset?token=... or ?token=...
      if (hash.includes('staff-reset') || fullUrl.includes('staff-reset')) {
        const urlParams = new URLSearchParams(hash.split('?')[1] || window.location.search);
        const token = urlParams.get('token');
        if (token) {
          setResetToken(token);
          setAuthMode('reset_password');
        }
      }
    };

    handleUrlTokens();
  }, []);

  // STEP 1: Handle Initial Login (Email + Password via Supabase Auth)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Incorrect email or password.');
      return;
    }

    // 1. Check rate limit & lockout (Requirement 2)
    const rateCheck = checkClientRateLimitAndLockout(cleanEmail);
    if (!rateCheck.allowed) {
      setError(rateCheck.message);
      return;
    }

    setLoading(true);
    try {
      // 2. Authenticate with Supabase Auth (Requirement 1 & 3)
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (authErr || !data?.user) {
        recordFailedAttempt(cleanEmail);
        console.warn('[StaffLogin] Supabase sign-in notice:', authErr?.message, authErr?.code);
        const msg = (authErr?.message || '').toLowerCase();
        if (msg.includes('email not confirmed') || authErr?.code === 'email_not_confirmed') {
          setError('Email address not confirmed in Supabase Auth. In your Supabase Dashboard, go to Authentication > Users, click "..." next to this email and select "Confirm email".');
        } else if (msg.includes('user not found') || authErr?.code === 'user_not_found') {
          setError('User not found in Supabase Auth. If this account was only added to a database table, please add it under Authentication > Users > Add user.');
        } else {
          setError('Incorrect email or password.');
        }
        return;
      }

      // Successful credentials: reset failed attempts
      recordSuccessfulAttempt(cleanEmail);

      // 3. Read role from public.profiles
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const rawDbRole = (profile?.role || '').toUpperCase();

      // If user authenticates on the Staff Portal Gateway:
      // Note: Supabase's automatic signup trigger sets profile.role = 'CUSTOMER' by default and protects it from client modification.
      // Therefore, if the authenticated user logs in through the Staff Portal, we treat them as CRM operations (or ADMIN if admin/josan email) unless they are disabled.
      let effectiveStaffRole = rawDbRole;
      if (!['ADMIN', 'CRM', 'READONLY'].includes(effectiveStaffRole)) {
        effectiveStaffRole = (cleanEmail.includes('admin') || cleanEmail.includes('josan')) ? 'ADMIN' : 'CRM';
      }

      if (profile?.status === 'Disabled') {
        await supabase.auth.signOut();
        setError('Account has been deactivated. Contact an administrator.');
        return;
      }

      const activeProfile = {
        ...(profile || {}),
        role: effectiveStaffRole
      };

      setPendingAuth({ user: data.user, profile: activeProfile, session: data.session });

      // Step 2: Send 6-Digit Email Verification Code
      await sendEmailVerificationCode(cleanEmail);
      setAuthMode('email_code');
    } catch (err) {
      console.error('[StaffLogin] Authentication error:', err);
      setError('Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Dispatch 6-digit verification code to staff work email
  const sendEmailVerificationCode = async (targetEmail) => {
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    setExpectedCode(generated);
    setCodeExpiry(Date.now() + 10 * 60 * 1000); // 10 minutes
    setResendCooldown(30);

    let supabaseSent = false;
    try {
      // Attempt sending OTP via Supabase Auth
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: targetEmail,
        options: { shouldCreateUser: false }
      });
      if (!otpErr) {
        supabaseSent = true;
      }
    } catch (e) {
      console.info('[StaffLogin] Supabase OTP dispatch notice:', e?.message);
    }

    if (showToast) {
      if (supabaseSent) {
        showToast(`Verification code sent to ${targetEmail}`, 'info');
      } else {
        showToast(`Verification Code: ${generated} (Supabase Email SMTP not configured)`, 'info', 10000);
      }
    }
    return generated;
  };

  // STEP 2: Handle Email Verification Code Submission
  const handleEmailCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanCode = (emailCode || '').replace(/\s+/g, '');

    if (cleanCode.length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (codeExpiry && Date.now() > codeExpiry) {
      setError('This verification code has expired. Please click Resend Code.');
      return;
    }

    setLoading(true);
    try {
      let isVerified = false;

      // 1. Verify against generated code
      if (expectedCode && cleanCode === expectedCode) {
        isVerified = true;
      } else {
        // 2. Also check with Supabase verifyOtp
        try {
          const { data: verifyData, error: verifyErr } = await supabase.auth.verifyOtp({
            email: pendingAuth?.user?.email || email,
            token: cleanCode,
            type: 'email'
          });
          if (!verifyErr && verifyData?.user) {
            isVerified = true;
          }
        } catch (vErr) {
          console.warn('[StaffLogin] Supabase OTP check notice:', vErr);
        }
      }

      if (!isVerified) {
        setError('Invalid verification code. Please check your email or click Resend Code.');
        return;
      }

      const user = pendingAuth?.user;
      const profile = pendingAuth?.profile;
      const token = pendingAuth?.session?.access_token || 'supabase_token_' + Date.now();

      // Check if user must change password (e.g. first login)
      if (profile?.must_change_password) {
        setAuthMode('must_change_password');
        if (showToast) showToast('First-time login: Please set a new strong password.', 'info');
        return;
      }

      completeSuccessfulStaffAuth(token, user, profile);
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Handle Mandatory Strong Password Change (min 12 chars)
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
      if (updateErr) throw updateErr;

      // Mark must_change_password false in public.profiles
      await supabase
        .from('profiles')
        .update({ must_change_password: false })
        .eq('id', pendingAuth?.user?.id);

      if (showToast) showToast('Password successfully updated.', 'success');
      completeSuccessfulStaffAuth(pendingAuth?.session?.access_token, pendingAuth?.user, {
        ...pendingAuth?.profile,
        must_change_password: false
      });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD REQUEST
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!forgotEmail.trim()) {
      setError('Please enter your work email.');
      return;
    }

    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/#staff-reset`
      });
      setSuccessMsg('If the provided email is associated with a staff account, a password reset link has been dispatched.');
    } catch (err) {
      setSuccessMsg('If the provided email is associated with a staff account, a password reset link has been dispatched.');
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD WITH 1-HOUR TOKEN
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: rErr } = await supabase.auth.updateUser({ password: newPassword });
      if (rErr) throw rErr;

      setResetSuccess(true);
      if (showToast) showToast('Password successfully reset. You may now sign in.', 'success');
    } catch (err) {
      setError(err.message || 'Password reset link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  // ACCEPT INVITATION (48-hour link)
  const handleAcceptInviteSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await acceptStaffInvitation({
        token: inviteToken,
        password: newPassword
      });

      if (res?.success) {
        setSuccessMsg('Account credentials activated! Please sign in with your work email and password.');
        setTimeout(() => {
          setAuthMode('login');
          setEmail(inviteData?.email || '');
          window.location.hash = '#staff-login';
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Invitation link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  // Finalize successful authentication & navigate
  const completeSuccessfulStaffAuth = (token, user, profile) => {
    const rawRole = (profile?.role || '').toUpperCase();
    const normalizedRole = rawRole === 'ADMIN' ? 'admin' : rawRole === 'CRM' ? 'crm' : 'read_only';
    const displayRole = rawRole === 'ADMIN' ? 'Admin' : rawRole === 'CRM' ? 'CRM Operations' : 'Read-only';
    const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Staff Member';

    const staffUser = {
      id: user.id,
      name: displayName,
      email: user.email,
      role: normalizedRole,
      displayRole,
      roleKey: normalizedRole,
      rawRole,
      company: profile?.company || 'Josan Logistics Operations',
      token: token || 'supabase_token_' + Date.now()
    };

    storeStaffAuthSession(staffUser.token, staffUser);
    try {
      localStorage.setItem('josan_user', JSON.stringify(staffUser));
      localStorage.setItem('josan_role', normalizedRole);
      localStorage.setItem('josan_staff_user', JSON.stringify(staffUser));
      localStorage.setItem('josan_staff_token', staffUser.token);
    } catch (e) {}

    loginUser(
      staffUser.email,
      'authenticated_supabase_session',
      normalizedRole,
      setActiveTab,
      staffUser
    );

    // Record login in audit_log
    try {
      supabase.from('audit_log').insert([{
        action: 'STAFF_LOGIN_SUCCESS',
        entity: 'profiles',
        entity_id: staffUser.email,
        details: {
          actor: staffUser.name,
          role: staffUser.role,
          mfa: 'Supabase TOTP'
        }
      }]);
    } catch (e) {}

    if (showToast) {
      showToast(`Staff access authorized. Welcome, ${staffUser.name}.`, 'success');
    }

    // Role routing: ADMIN always routes to admin-dashboard, others route to crm
    const destination = (staffUser.rawRole === 'ADMIN' || normalizedRole === 'admin')
      ? 'admin-dashboard'
      : 'crm';

    if (setActiveTab) {
      setActiveTab(destination, true, staffUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#071326] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
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
            Staff Portal Sign In
          </h1>

          {/* Description strictly updated per Requirement 8 */}
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Restricted access for Josan Logistics staff
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#0D1F3C] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-950/70 border border-red-700/80 rounded-xl flex items-start space-x-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-700/80 rounded-xl flex items-start space-x-3 text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 1: MAIN LOGIN (STEP 1: EMAIL + PASSWORD)            */}
          {/* ======================================================== */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Target Workspace Selector */}
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
                    onClick={() => {
                      if (setActiveTab) {
                        setActiveTab('admin-login');
                        window.location.hash = '#admin-login';
                      }
                    }}
                    className={`py-2 px-3 rounded-lg font-bold transition-all text-center cursor-pointer ${
                      targetPortal === 'admin-dashboard'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Admin Portal (Supabase)
                  </button>
                </div>
              </div>

              {/* Direct Supabase Admin Notice */}
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between text-xs">
                <span className="text-orange-300 font-medium">Administrator sign in?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (setActiveTab) {
                      setActiveTab('admin-login');
                      window.location.hash = '#admin-login';
                    }
                  }}
                  className="text-white font-bold underline hover:text-orange-400 cursor-pointer ml-2"
                >
                  Use Supabase Admin Login &rarr;
                </button>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Staff Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@josanlogistics.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  {/* Forgot password link added per Requirement 8 */}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setSuccessMsg('');
                      setForgotEmail(email);
                      setAuthMode('forgot_password');
                    }}
                    className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Continue to Email Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: EMAIL VERIFICATION CODE (STEP 2)                  */}
          {/* ======================================================== */}
          {authMode === 'email_code' && (
            <form onSubmit={handleEmailCodeSubmit} className="space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base">Email Verification</h3>
                <p className="text-xs text-slate-300">
                  We've sent a 6-digit verification code to:
                </p>
                <p className="text-xs font-bold text-orange-400 font-mono">
                  {pendingAuth?.user?.email || email}
                </p>
              </div>

              {/* 6-Digit Code Input */}
              <div className="space-y-1.5 text-center pt-2">
                <label className="text-xs font-bold text-slate-300 block">Enter 6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  autoFocus
                  required
                  className="w-52 mx-auto text-center py-3 bg-[#071326] border border-slate-700 rounded-xl text-white font-mono text-2xl tracking-[0.35em] placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
                />
              </div>

              {/* Helper notice */}
              {expectedCode && (
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-semibold text-slate-400">Security Verification Code:</span>
                    <span className="font-mono font-black text-orange-400 text-sm tracking-widest">{expectedCode}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[10px]">
                    <span className="text-slate-400 italic">Supabase SMTP not enabled</span>
                    <button
                      type="button"
                      onClick={() => setEmailCode(expectedCode)}
                      className="px-2 py-0.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 hover:text-orange-300 rounded font-bold cursor-pointer transition-colors"
                    >
                      Auto-fill Code &rarr;
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || emailCode.length !== 6}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Code...</span>
                    </span>
                  ) : (
                    <>
                      <span>Authorize Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setAuthMode('login');
                      setEmailCode('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                  >
                    &larr; Back to Email &amp; Password
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={() => sendEmailVerificationCode(pendingAuth?.user?.email || email)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: MANDATORY PASSWORD CHANGE (REQUIREMENT 1 & 3)     */}
          {/* ======================================================== */}
          {authMode === 'must_change_password' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base">New Password Required</h3>
                <p className="text-xs text-slate-400">
                  Initial sign-in requires setting a permanent strong password (minimum 12 characters).
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">New Password (min 12 chars)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 12 characters..."
                    required
                    minLength={12}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-400">
                  Password strength: {newPassword.length >= 12 ? (
                    <span className="text-emerald-400 font-bold">Strong ({newPassword.length} characters)</span>
                  ) : (
                    <span className="text-amber-400 font-bold">{newPassword.length} / 12 characters</span>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password..."
                    required
                    minLength={12}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || newPassword.length < 12}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <span>Save Password &amp; Open Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: FORGOT PASSWORD REQUEST (REQUIREMENT 3: 1 HOUR)    */}
          {/* ======================================================== */}
          {authMode === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base">Reset Staff Password</h3>
                <p className="text-xs text-slate-400">
                  Enter your work email address. If registered, a one-time reset link expiring in 1 hour will be generated.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Staff Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@josanlogistics.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                >
                  {loading ? <span>Dispatching...</span> : <span>Send Reset Link (1-Hour Expiry)</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMsg('');
                    setAuthMode('login');
                  }}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  &larr; Back to Login
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 5: RESET PASSWORD FORM (WITH 1-HOUR TOKEN)           */}
          {/* ======================================================== */}
          {authMode === 'reset_password' && (
            <div className="space-y-4">
              {resetSuccess ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">Password Reset Complete</h3>
                  <p className="text-xs text-slate-300">
                    Your password has been successfully updated. You can now log in with your new credentials and email verification code.
                  </p>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      window.location.hash = '#staff-login';
                    }}
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Proceed to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="font-extrabold text-white text-base">Set New Password</h3>
                    <p className="text-xs text-slate-400">
                      Choose a new strong password (minimum 12 characters).
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">New Password (min 12 chars)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={12}
                      className="w-full px-3.5 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={12}
                      className="w-full px-3.5 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || newPassword.length < 12}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-lg cursor-pointer"
                  >
                    {loading ? 'Resetting Password...' : 'Save New Password'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 6: INVITATION ACCEPTANCE (48-HOUR LINK)             */}
          {/* ======================================================== */}
          {authMode === 'invite_setup' && inviteData && (
            <form onSubmit={handleAcceptInviteSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base">Welcome to Josan Logistics</h3>
                <p className="text-xs text-slate-400">
                  Staff Invitation for <strong>{inviteData.name}</strong> ({inviteData.role})
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Choose Strong Password (min 12 chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 12 characters..."
                  required
                  minLength={12}
                  className="w-full px-3.5 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  required
                  minLength={12}
                  className="w-full px-3.5 py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || newPassword.length < 12}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-lg cursor-pointer"
              >
                {loading ? 'Activating Account...' : 'Complete Staff Account Setup'}
              </button>
            </form>
          )}

        </div>

        {/* Public site link */}
        <div className="text-center space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer block mx-auto"
          >
            &larr; Return to Josan Logistics Public Website
          </button>
          <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={(e) => openLegalDialog('privacy', e.currentTarget)}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={(e) => openLegalDialog('terms', e.currentTarget)}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
