import { supabase, isSupabaseConfigured } from './supabase';

export const notificationsService = {
  /**
   * Fetch system/user notifications from public.notifications.
   */
  getNotifications: async (role = 'all', userId = 'all') => {
    if (!isSupabaseConfigured) return null;

    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId && userId !== 'all' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('[NotificationsService] Fetch notifications error:', error.message);
        return null;
      }

      return (data || []).map(n => ({
        ...n,
        message: n.body || n.message,
        read: Boolean(n.read_at),
        timestamp: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'
      }));
    } catch (err) {
      console.warn('[NotificationsService] Error fetching notifications:', err);
      return null;
    }
  },

  /**
   * Create new notification alert in public.notifications.
   */
  createNotification: async ({ userId, title, message, body, link, shipmentId, quoteId }) => {
    if (!isSupabaseConfigured || !title) return null;

    try {
      let targetUserId = userId;
      // If no valid UUID provided, find the primary admin profile to attach
      if (!targetUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetUserId)) {
        const { data: adminProfiles } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['ADMIN', 'admin'])
          .limit(1);
        targetUserId = adminProfiles?.[0]?.id;
      }

      if (!targetUserId) {
        console.warn('[NotificationsService] Cannot create notification: No target user profile found.');
        return null;
      }

      const linkPath = link || (shipmentId ? `/track?ref=${shipmentId}` : (quoteId ? `/quote?ref=${quoteId}` : null));
      const notifObj = {
        user_id: targetUserId,
        title,
        body: body || message || title,
        link: linkPath,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert([notifObj])
        .select();

      if (error) {
        console.warn('[NotificationsService] Create notification error:', error.message);
        return null;
      }

      const row = data?.[0];
      return row ? {
        ...row,
        message: row.body,
        read: false,
        timestamp: 'Just now'
      } : null;
    } catch (err) {
      console.warn('[NotificationsService] Error creating notification:', err);
      return null;
    }
  },

  /**
   * Mark notification as read in public.notifications.
   */
  markAsRead: async (notificationId) => {
    if (!isSupabaseConfigured || !notificationId) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) {
        console.warn('[NotificationsService] Mark as read error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[NotificationsService] Error marking notification as read:', err);
      return false;
    }
  }
};
