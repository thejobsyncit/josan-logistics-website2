import { supabase, isSupabaseConfigured } from './supabase';

export const customersService = {
  /**
   * Fetch corporate customers directory.
   */
  getCustomers: async () => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[CustomersService] Fetch customers error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Create or update corporate customer record.
   */
  createCustomer: async (customerData) => {
    if (!isSupabaseConfigured) return null;

    const dbRecord = {
      id: customerData.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: customerData.name || 'Customer',
      company_name: customerData.company_name || customerData.companyName || customerData.company || customerData.name || 'Global Client Corp',
      email: customerData.email,
      phone: customerData.phone || '+65 6789 0123',
      address: customerData.address || 'Singapore',
      postal_code: customerData.postal_code || customerData.postalCode || '048616',
      company: customerData.company || customerData.company_name || customerData.name || 'Global Client Corp',
      tier: customerData.tier || 'Standard Corporate',
      total_spent: customerData.total_spent || customerData.totalSpent || 'S$ 0.00',
      total_shipments: customerData.total_shipments ?? customerData.totalShipments ?? 0,
      status: customerData.status || 'Active',
      tags: customerData.tags || ['Corporate'],
      credit_limit: customerData.credit_limit || customerData.creditLimit || 'S$ 50,000',
      payment_terms: customerData.payment_terms || customerData.paymentTerms || 'Net 30 Days',
      password: customerData.password || null
    };

    try {
      // Check if a customer record with this email already exists to reuse its ID
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerData.email)
        .maybeSingle();

      if (existing?.id) {
        dbRecord.id = existing.id;
      }

      const { data, error } = await supabase
        .from('customers')
        .upsert([dbRecord], { onConflict: 'id' })
        .select();

      if (error) {
        console.warn('[CustomersService] Primary upsert by id failed, retrying by email:', error.message);
        const { data: altData, error: altError } = await supabase
          .from('customers')
          .upsert([dbRecord], { onConflict: 'email' })
          .select();

        if (altError) {
          console.error('[CustomersService] Create customer error:', altError.message);
          return null;
        }
        return altData?.[0];
      }
      return data?.[0];
    } catch (err) {
      console.error('[CustomersService] Exception creating customer:', err);
      return null;
    }
  },
};
