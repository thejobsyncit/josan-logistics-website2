import { supabase, isSupabaseConfigured } from './supabase';

export const authService = {
  /**
   * Sign up user via Supabase Auth.
   * Public sign-up always creates a CUSTOMER role via the database trigger.
   * The database trigger on auth.users automatically creates the profile row.
   */
  signUp: async ({ email, password, fullName, phone, company }) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured' };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          company,
        },
      },
    });

    if (error) return { error: error.message };

    return { data };
  },

  /**
   * Sign in user with email & password.
   * Read the role from profiles after login, only for UI display.
   * Permissions are strictly enforced by Supabase database rules (RLS).
   */
  signIn: async ({ email, password }) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured' };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };

    // Read profile role for display only. Do not trust client-side role for permissions.
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

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
