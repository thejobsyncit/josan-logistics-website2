import { supabase, isSupabaseConfigured } from './supabase';

export const notificationsService = {
  /**
   * Fetch system/user notifications.
   */
  getNotifications: async (role = 'all', userId = 'all') => {
    if (!isSupabaseConfigured) return null;

    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.warn('[NotificationsService] Fetch notifications error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Create new notification alert.
   */
  createNotification: async ({ role = 'customer', userId = 'all', type = 'general', title, message, shipmentId, quoteId }) => {
    if (!isSupabaseConfigured) return null;

    const notifObj = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      role,
      type,
      title,
      message,
      shipment_id: shipmentId || null,
      quote_id: quoteId || null,
      timestamp: 'Just now',
      read: false
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert([notifObj])
      .select();

    if (error) {
      console.warn('[NotificationsService] Create notification error:', error.message);
      return null;
    }
    return data?.[0];
  },

  /**
   * Mark notification as read.
   */
  markAsRead: async (notificationId) => {
    if (!isSupabaseConfigured || !notificationId) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.warn('[NotificationsService] Mark as read error:', error.message);
      return false;
    }
    return true;
  }
};
