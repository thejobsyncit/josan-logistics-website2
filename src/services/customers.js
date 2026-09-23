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
      name: customerData.name,
      company_name: customerData.company_name || customerData.companyName || customerData.company || customerData.name,
      email: customerData.email,
      phone: customerData.phone || '+65 6789 0123',
      address: customerData.address || 'Singapore',
      postal_code: customerData.postal_code || customerData.postalCode || '048616',
      company: customerData.company || customerData.company_name || customerData.name,
      tier: customerData.tier || 'Standard Corporate',
      total_spent: customerData.total_spent || customerData.totalSpent || 'S$ 0.00',
      total_shipments: customerData.total_shipments ?? customerData.totalShipments ?? 0,
      status: customerData.status || 'Active',
      tags: customerData.tags || ['Corporate'],
      credit_limit: customerData.credit_limit || customerData.creditLimit || 'S$ 50,000',
      payment_terms: customerData.payment_terms || customerData.paymentTerms || 'Net 30 Days'
    };

    const { data, error } = await supabase
      .from('customers')
      .upsert([dbRecord])
      .select();

    if (error) {
      console.warn('[CustomersService] Create customer error:', error.message);
      return null;
    }
    return data?.[0];
  },
};
