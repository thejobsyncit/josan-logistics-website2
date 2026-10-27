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
  EyeOff
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { openLegalDialog } from '../components/LegalDialog';
import { 
  staffLogin, 
  staffVerify2FA, 
  staffChangePassword, 
  staffForgotPassword, 
  staffResetPassword, 
  checkStaffInvitation, 
  acceptStaffInvitation,
  storeStaffAuthSession 
} from '../utils/staffApi';

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

  // 2FA state
  const [preAuthTicket, setPreAuthTicket] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [otpAuthUri, setOtpAuthUri] = useState('');
  const [isFirstTime2FA, setIsFirstTime2FA] = useState(false);

  // Password change state (first login or forced reset)
  const [changeTicket, setChangeTicket] = useState('');
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
            if (data.valid) {
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

  // STEP 1: Handle Initial Login (Email + Password)
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

    setLoading(true);
    try {
      const res = await staffLogin({ email: cleanEmail, password: cleanPassword });

      if (res.require2FA) {
        setPreAuthTicket(res.preAuthTicket);
        setIsFirstTime2FA(!res.twoFactorConfirmed);
        if (res.twoFactorSecret) {
          setTwoFactorSecret(res.twoFactorSecret);
          setOtpAuthUri(res.otpAuthUri || '');
        }
        setAuthMode('2fa');
      } else {
        // Fallback generic error
        setError('Incorrect email or password.');
      }
    } catch (err) {
      // Requirement 6: Login errors always say "Incorrect email or password"
      if (err.data && err.data.rateLimited) {
        setError(err.message);
      } else if (err.status === 429) {
        setError(err.message || 'Access throttled: Maximum 5 attempts per minute.');
      } else {
        setError('Incorrect email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Handle 2FA TOTP Code Submission
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanCode = (totpCode || '').replace(/\s+/g, '');

    if (cleanCode.length !== 6) {
      setError('Please enter the 6-digit code generated by your authenticator app.');
      return;
    }

    setLoading(true);
    try {
      const res = await staffVerify2FA({ preAuthTicket, code: cleanCode });

      // Check if user must change password (e.g. first login)
      if (res.mustChangePassword) {
        setChangeTicket(res.changePasswordTicket);
        setAuthMode('must_change_password');
        if (showToast) showToast('First-time login: Please set a new strong password.', 'info');
        return;
      }

      if (res.success && res.token && res.user) {
        completeSuccessfulStaffAuth(res.token, res.user);
      } else {
        setError('Invalid 6-digit authenticator code. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid 6-digit authenticator code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Handle Mandatory Strong Password Change (Requirement 1 & 3: minimum 12 characters)
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
      const res = await staffChangePassword({
        changePasswordTicket: changeTicket,
        newPassword
      });

      if (res.success && res.token && res.user) {
        if (showToast) showToast('Password successfully updated.', 'success');
        completeSuccessfulStaffAuth(res.token, res.user);
      } else {
        setError(res.error || 'Failed to update password.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD REQUEST (Requirement 3: 1 hour expiration link)
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
      const res = await staffForgotPassword({ email: forgotEmail.trim() });
      setSuccessMsg(res.message || 'If the provided email is associated with a staff account, a password reset link has been dispatched.');
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
      const res = await staffResetPassword({
        token: resetToken,
        newPassword
      });

      if (res.success) {
        setResetSuccess(true);
        if (showToast) showToast('Password successfully reset. You may now sign in.', 'success');
      } else {
        setError(res.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.message || 'Password reset link is invalid or expired (1-hour limit).');
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

      if (res.success) {
        setSuccessMsg('Account credentials activated! Please sign in with your new password to configure your 2FA authenticator app.');
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
  const completeSuccessfulStaffAuth = (token, staffUser) => {
    storeStaffAuthSession(token, staffUser);

    // Update client context
    const normalizedRole = staffUser.role === 'Admin' ? 'admin' : staffUser.role === 'CRM Operations' ? 'crm' : 'read_only';
    
    loginUser(
      staffUser.email,
      'authenticated_server_session',
      normalizedRole,
      setActiveTab,
      {
        id: staffUser.id,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
        roleKey: normalizedRole,
        company: 'Josan Logistics Operations',
        token
      }
    );

    if (showToast) {
      showToast(`Staff access authorized. Welcome, ${staffUser.name}.`, 'success');
    }

    // Role enforcement: CRM Operations or Read-only users cannot access admin workspace
    const destination = (staffUser.role === 'Admin' && targetPortal === 'admin-dashboard')
      ? 'admin-dashboard'
      : 'crm';

    if (typeof window !== 'undefined') {
      window.location.hash = `#${destination}`;
    }
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
                    <span>Continue to Two-Factor Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: 2FA AUTHENTICATOR APP VERIFICATION (STEP 2)       */}
          {/* ======================================================== */}
          {authMode === '2fa' && (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-400">
                  Open your Authenticator app (Google Authenticator, Microsoft Authenticator) and enter the 6-digit code.
                </p>
              </div>

              {/* First-time 2FA Setup helper */}
              {isFirstTime2FA && twoFactorSecret && (
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-2">
                  <div className="font-bold text-orange-400 flex items-center space-x-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Initial 2FA App Pairing</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Add Josan Logistics to your authenticator app using the secret key below:
                  </p>
                  <div className="p-2 bg-[#071326] rounded-lg border border-slate-700 font-mono text-center text-orange-300 font-bold tracking-widest text-xs select-all">
                    {twoFactorSecret}
                  </div>
                </div>
              )}

              {/* 6-Digit Code Input */}
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-bold text-slate-300">Enter 6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  autoFocus
                  required
                  className="w-48 mx-auto text-center py-2.5 bg-[#071326] border border-slate-700 rounded-xl text-white font-mono text-xl tracking-[0.3em] placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || totpCode.length !== 6}
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

                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthMode('login');
                  }}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  &larr; Back to Email &amp; Password
                </button>
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
                    Your password has been successfully updated. You can now log in with your new credentials and two-factor authenticator app.
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
