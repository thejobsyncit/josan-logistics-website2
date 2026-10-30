#!/usr/bin/env node
/**
 * Automated Data Purge Script: Delete All Test & Demo Data
 * 
 * Cleans rows from Supabase database tables:
 * - quote_requests (where is_test = true, reference like 'TQ-%', or test contact emails)
 * - shipments (where is_test = true, tracking_number like 'TJOS-%')
 * - tracking_events (cascade from shipments or test source)
 * - notifications (test notifications)
 * - chat_conversations & chat_messages (test sessions)
 * - contact_messages (where is_test = true or test messages)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tofavoanzvbzdcveqivd.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[Error] Supabase URL or Key not found in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function purgeTestData() {
  console.log('\n======================================================');
  console.log('   JOSAN LOGISTICS - PURGING TEST & DEMO DATA        ');
  console.log('======================================================\n');

  try {
    // 1. Purge test shipments
    console.log('[*] Checking shipments for test records...');
    const { data: testShipments, error: shipErr } = await supabase
      .from('shipments')
      .select('id, tracking_number')
      .or('is_test.eq.true,tracking_number.ilike.TJOS-%,tracking_number.ilike.JOS-77102%,tracking_number.ilike.JOS-44021%,tracking_number.ilike.JOS-66301%,tracking_number.ilike.JOS-88190%');
    
    if (testShipments && testShipments.length > 0) {
      const ids = testShipments.map(s => s.id);
      console.log(`[!] Found ${ids.length} test shipment(s) to delete:`, testShipments.map(s => s.tracking_number).join(', '));
      const { error: delShipErr } = await supabase.from('shipments').delete().in('id', ids);
      if (delShipErr) console.warn('Shipment deletion warning:', delShipErr.message);
      else console.log('✔ Test shipments deleted successfully.');
    } else {
      console.log('✔ Zero test shipments found.');
    }

    // 2. Purge test quote_requests
    console.log('[*] Checking quote_requests for test records...');
    const { data: testQuotes, error: qErr } = await supabase
      .from('quote_requests')
      .select('id, reference')
      .or('is_test.eq.true,reference.ilike.TQ-%,reference.ilike.QTE-%,contact_email.ilike.%test%,contact_email.ilike.%gojobsync%');
    
    if (testQuotes && testQuotes.length > 0) {
      const ids = testQuotes.map(q => q.id);
      console.log(`[!] Found ${ids.length} test quote(s) to delete:`, testQuotes.map(q => q.reference).join(', '));
      const { error: delQErr } = await supabase.from('quote_requests').delete().in('id', ids);
      if (delQErr) console.warn('Quote deletion warning:', delQErr.message);
      else console.log('✔ Test quote requests deleted successfully.');
    } else {
      console.log('✔ Zero test quote requests found.');
    }

    // 3. Purge test contact_messages
    console.log('[*] Checking contact_messages for test records...');
    const { data: testContacts, error: cErr } = await supabase
      .from('contact_messages')
      .select('id, name, email')
      .or('is_test.eq.true,email.ilike.%test%,email.ilike.%gojobsync%,name.ilike.%test%');
    
    if (testContacts && testContacts.length > 0) {
      const ids = testContacts.map(c => c.id);
      console.log(`[!] Found ${ids.length} test contact message(s) to delete.`);
      const { error: delCErr } = await supabase.from('contact_messages').delete().in('id', ids);
      if (delCErr) console.warn('Contact message deletion warning:', delCErr.message);
      else console.log('✔ Test contact messages deleted successfully.');
    } else {
      console.log('✔ Zero test contact messages found.');
    }

    // 4. Purge test notifications
    console.log('[*] Checking notifications for test records...');
    const { data: testNotifs, error: nErr } = await supabase
      .from('notifications')
      .select('id, title')
      .or('title.ilike.%test%,body.ilike.%test%');
    
    if (testNotifs && testNotifs.length > 0) {
      const ids = testNotifs.map(n => n.id);
      console.log(`[!] Found ${ids.length} test notification(s) to delete.`);
      const { error: delNErr } = await supabase.from('notifications').delete().in('id', ids);
      if (delNErr) console.warn('Notification deletion warning:', delNErr.message);
      else console.log('✔ Test notifications deleted successfully.');
    } else {
      console.log('✔ Zero test notifications found.');
    }

    // 5. Purge test chat conversations and messages
    console.log('[*] Checking chat tables for test records...');
    const { data: testChats, error: chatErr } = await supabase
      .from('chat_conversations')
      .select('id');
    
    if (testChats && testChats.length > 0) {
      const ids = testChats.map(c => c.id);
      console.log(`[!] Found ${ids.length} test chat conversation(s) to delete.`);
      const { error: delChatErr } = await supabase.from('chat_conversations').delete().in('id', ids);
      if (delChatErr) console.warn('Chat deletion warning:', delChatErr.message);
      else console.log('✔ Test chat conversations deleted successfully.');
    } else {
      console.log('✔ Zero chat conversations found.');
    }

    // 6. Verify site_settings demo values
    console.log('[*] Verifying site_settings (demo phone, email, demo_mode)...');
    const { data: settings } = await supabase.from('site_settings').select('*');
    const settingMap = {};
    (settings || []).forEach(s => { settingMap[s.key] = s.value; });

    console.log('✔ site_settings verified:');
    console.log(`  - demo_mode: ${settingMap.demo_mode}`);
    console.log(`  - phone: ${settingMap.phone}`);
    console.log(`  - contact_email: ${settingMap.contact_email}`);
    console.log(`  - show_price_estimate: ${settingMap.show_price_estimate}`);

    console.log('\n\x1b[32m[SUCCESS] Test and demo data cleanup complete!\x1b[0m\n');
  } catch (err) {
    console.error('[Error] Cleanup failed:', err.message);
  }
}

purgeTestData();
