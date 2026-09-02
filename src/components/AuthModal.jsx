import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { X, Lock, Mail, ArrowRight, User, Phone, Calendar, FileText, AlertCircle, Camera, MapPin } from 'lucide-react';

export const AuthModal = ({ setActiveTab }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalHideClose, loginUser } = useLogistics();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer');
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [dob, setDob] = useState('');
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
        phone,
        licenseNumber,
        dob,
        photo: driverPhoto,
        assignedHub
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

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+65 9123 4567"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* DRIVER-ONLY FIELDS */}
              {role === 'driver' && (
                <>
                  {/* Profile Picture Upload Field */}
                  <div className="bg-orange-50/80 p-3.5 rounded-2xl border border-orange-200 space-y-2.5">
                    <label className="block text-xs font-extrabold text-orange-950">
                      Driver Registration Profile Picture *
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="relative shrink-0">
                        <img
                          src={driverPhoto}
                          alt="Driver Registration Profile"
                          className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-extrabold shadow-orange-sm cursor-pointer transition-all inline-flex items-center space-x-1.5">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Browse & Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                          This uploaded image will be automatically saved to your profile and displayed in the Admin Portal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Work Location / Hub */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Work Location / Hub</label>
                    <div className="relative">
                      <select
                        value={assignedHub}
                        onChange={(e) => setAssignedHub(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium cursor-pointer"
                        required
                      >
                        <option value="Changi Air Cargo Logistics Hub">Changi Air Cargo Logistics Hub</option>
                        <option value="Tuas Mega Port Terminal">Tuas Mega Port Terminal</option>
                        <option value="Jurong Port Logistics Hub">Jurong Port Logistics Hub</option>
                        <option value="Woodlands Logistics Depot">Woodlands Logistics Depot</option>
                        <option value="Pasir Panjang Container Hub">Pasir Panjang Container Hub</option>
                      </select>
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

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
