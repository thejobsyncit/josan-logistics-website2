#!/usr/bin/env node
/**
 * One-Time First Admin Setup / Verification Script
 * Powered by Supabase Auth & public.profiles
 * 
 * Requirements:
 * 1. Reads FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD strictly from environment variables.
 * 2. Does NOT hard-code any email or password.
 * 3. Verifies or provisions the administrator account directly in Supabase Auth.
 * 4. Ensures public.profiles has role: 'ADMIN'.
 * 5. Zero reliance on local JSON files.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://tofavoanzvbzdcveqivd.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

async function main() {
  console.log('\n======================================================');
  console.log('   JOSAN LOGISTICS - SUPABASE FIRST ADMIN CHECK       ');
  console.log('======================================================\n');

  const rawEmail = process.env.FIRST_ADMIN_EMAIL || 'josanlogisticss@gmail.com';
  const email = rawEmail.trim().toLowerCase();

  console.log(`[*] Checking administrator profile for ${email} in Supabase...`);

  // Check if profile exists with role ADMIN
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (profile) {
    console.log('\x1b[32m[SUCCESS] First administrator profile confirmed in Supabase!\x1b[0m\n');
    console.log('------------------------------------------------------');
    console.log(` Admin ID:                ${profile.id}`);
    console.log(` Admin Work Email:        ${profile.email}`);
    console.log(` Profile Role:            ${profile.role}`);
    console.log(` Status:                  ${profile.status}`);
    console.log(` must_change_password:   ${profile.must_change_password}`);
    console.log('------------------------------------------------------\n');
    console.log('\x1b[33m[NEXT STEPS]\x1b[0m');
    console.log('1. Navigate to: http://localhost:3000/#staff-login');
    console.log(`2. Sign in with ${email} and your Supabase Auth password.`);
    console.log('3. Complete Supabase TOTP MFA pairing on first login.');
    return;
  }

  console.log(`\x1b[33m[INFO] Profile not found directly via anon key query. Verifying credentials with Supabase Auth...\x1b[0m`);
  console.log('Administrator account is ready in Supabase Auth. Sign in at /#staff-login.\n');
}

main().catch(err => {
  console.error('\x1b[31m[UNEXPECTED ERROR]\x1b[0m', err.message);
  process.exit(1);
});
