import React, { useEffect, useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { supabase } from '../services/supabase';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Plane, 
  Truck, 
  FileText, 
  Headphones, 
  Building2 
} from 'lucide-react';

export const EmailVerifiedPage = ({ setActiveTab }) => {
  const { currentUser, setCurrentUser, setCurrentRole, setIsAuthModalOpen, showToast } = useLogistics();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkVerificationSession = async () => {
      try {
        if (supabase && supabase.auth) {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user && mounted) {
            // Read profile to verify customer state
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, role, status, name, email, company, phone')
              .eq('id', data.session.user.id)
              .maybeSingle();

            if (profile && setCurrentUser) {
              const customerUser = {
                id: data.session.user.id,
                name: profile.name || data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'Customer',
                email: profile.email || data.session.user.email,
                role: 'CUSTOMER',
                displayRole: 'Customer',
                company: profile.company || '',
                phone: profile.phone || ''
              };
              setCurrentUser(customerUser);
              if (setCurrentRole) setCurrentRole('CUSTOMER');
            }
          }
        }
      } catch (err) {
        console.warn('Error reading verified session:', err);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    };

    checkVerificationSession();
    return () => {
      mounted = false;
    };
  }, [setCurrentUser, setCurrentRole]);

  const handleContinue = () => {
    // Clean up hash/URL fragments
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    if (currentUser) {
      if (showToast) {
        showToast('Welcome to Josan Logistics portal!', 'success');
      }
      if (setActiveTab) {
        setActiveTab('customer-dashboard');
      }
    } else {
      if (setActiveTab) {
        setActiveTab('home');
      }
      if (setIsAuthModalOpen) {
        setIsAuthModalOpen(true);
      }
      if (showToast) {
        showToast('Your email is verified! Please log in to access your portal.', 'success');
      }
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Top Decorative Orange Brand Line */}
          <div className="h-2 bg-[#F77F28] w-full" />

          <div className="p-8 sm:p-12 text-center">
            {/* Animated / Prominent Verification Icon */}
            <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-fade-in" />
            </div>

            {/* Verification Status Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Email Verification Completed</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
              Email Verified Successfully!
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-lg mx-auto leading-relaxed mb-8">
              Your Josan Logistics account is now verified. You can continue to our logistics portal to access your account.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto px-8 py-4 bg-[#F77F28] hover:bg-[#e06d1d] active:scale-[0.99] text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>CONTINUE TO JOSAN LOGISTICS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="border-t border-slate-100 pt-8 mt-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                Now available on your logistics portal
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-orange-100/70 text-[#F77F28] shrink-0 mt-0.5">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#111827]">Air Freight Docs</h2>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">AWB preparation, cargo clearance, and airline support.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100/70 text-blue-600 shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#111827]">Commercial Roadway</h2>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Domestic Singapore freight, bonded truck, and port haulage.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-600 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#111827]">Tracking &amp; Quotes</h2>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Real-time status tracking, fast quotation, and digital invoices.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="bg-slate-100/80 px-8 py-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Josan Logistics Pte. Ltd. (UEN: 202619465E)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Headphones className="w-3.5 h-3.5 text-[#F77F28]" />
              <span>Need help?</span>
              <a href="mailto:contact@josanlogistics.com.sg" className="text-[#F77F28] hover:underline font-semibold ml-0.5">
                contact@josanlogistics.com.sg
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

