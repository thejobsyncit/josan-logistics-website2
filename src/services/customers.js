import { supabase, isSupabaseConfigured } from './supabase';
import { isStaffRole } from '../utils/roles';

export const customersService = {
  /**
   * Fetch corporate customers directory from public.profiles table (role = 'CUSTOMER').
   * Permitted only when the signed-in user has an active staff role.
   */
  getCustomers: async () => {
    if (!isSupabaseConfigured) return [];

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        return [];
      }

      // Verify the user's role in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const userRole = String(profile?.role || user.user_metadata?.role || '').toUpperCase();
      if (!isStaffRole(userRole)) {
        return [];
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'CUSTOMER')
        .order('created_at', { ascending: false });

      if (error) {
        return [];
      }

      return (data || []).map(p => ({
        id: p.id,
        name: p.name || 'Corporate Customer',
        email: p.email,
        phone: p.phone || '',
        company: p.company || '',
        company_name: p.company || '',
        status: p.status || 'Active',
        created_at: p.created_at,
        role: p.role || 'CUSTOMER',
        tier: p.tier || '',
        paymentTerms: p.payment_terms || p.paymentTerms || '',
        total_spent: 'S$ 0.00',
        total_shipments: 0,
        address: p.address || 'Singapore',
        tags: ['Corporate']
      }));
    } catch (_err) {
      return [];
    }
  }
};
