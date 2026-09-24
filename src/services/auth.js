import { supabase, isSupabaseConfigured } from './supabase';
import { customersService } from './customers';

export const authService = {
  /**
   * Sign up user via Supabase Auth and upsert user profile record.
   */
  signUp: async ({ email, password, fullName, phone, company, role = 'CUSTOMER' }) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured' };

    const formattedRole = role.toUpperCase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          company,
          role: formattedRole,
        },
      },
    });

    if (error) return { error: error.message };

    if (data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        user_id: data.user.id,
        name: fullName || email.split('@')[0],
        email,
        phone,
        company: company || 'Global Client Corp',
        role: formattedRole,
        status: 'Active',
      });

      // Also sync into customers table if customer role
      if (formattedRole.includes('CUSTOMER')) {
        await customersService.createCustomer({
          id: data.user.id,
          name: fullName || email.split('@')[0],
          email,
          phone: phone || '+65 6789 0123',
          company: company || 'Global Client Corp',
          password: password,
        });
      }
    }

    return { data };
  },

  /**
   * Sign in user with email & password.
   */
  signIn: async ({ email, password }) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured' };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };

    // Fetch profile role if user exists
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profile) {
        data.user.role = profile.role;
        data.user.profile = profile;
      }
    }

    return { data };
  },

  /**
   * Sign out current user session.
   */
  signOut: async () => {
    if (!isSupabaseConfigured) return;
    return await supabase.auth.signOut();
  },

  /**
   * Get active session.
   */
  getSession: async () => {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  },

  /**
   * Listen to Auth state changes.
   */
  onAuthStateChange: (callback) => {
    if (!isSupabaseConfigured) return () => {};
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return () => listener?.subscription?.unsubscribe();
  },
};
