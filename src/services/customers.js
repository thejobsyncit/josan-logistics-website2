import { supabase, isSupabaseConfigured } from './supabase';

export const customersService = {
  /**
   * Fetch corporate customers directory from public.profiles table (role = 'CUSTOMER').
   */
  getCustomers: async () => {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'CUSTOMER')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[CustomersService] Fetch customers from profiles error:', error.message);
        return null;
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
        tier: 'Standard Corporate',
        total_spent: 'S$ 0.00',
        total_shipments: 0,
        address: 'Singapore',
        tags: ['Corporate']
      }));
    } catch (err) {
      console.warn('[CustomersService] Error querying profiles:', err);
      return null;
    }
  }
};
