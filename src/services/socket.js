// Disabled module - Realtime Socket.IO replaced by Supabase & Edge Functions.
export function connectAdminSocket() { return null; }
export function disconnectAdminSocket() {}
export function onAdminSocketStatus() { return () => {}; }
export function onLocationUpdate() { return () => {}; }
export function onDriverStatusChange() { return () => {}; }
export function onTripEvent() { return () => {}; }
export function onCustomerActivity() { return () => {}; }
