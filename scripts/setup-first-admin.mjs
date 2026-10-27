#!/usr/bin/env node
/**
 * One-Time First Admin Setup Script
 * 
 * Requirements:
 * 1. Reads FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD strictly from environment variables.
 * 2. Does NOT hard-code any email or password.
 * 3. Rejects passwords under 12 characters.
 * 4. Stores only a bcrypt hash (salt rounds 10).
 * 5. Sets role "admin" and must_change_password: true.
 * 6. Refuses to run if an admin already exists.
 * 
 * Usage (PowerShell):
 *   $env:FIRST_ADMIN_EMAIL="admin@yourcompany.com"
 *   $env:FIRST_ADMIN_PASSWORD="YourStrongPassword123!"
 *   node ./scripts/setup-first-admin.mjs
 * 
 * Usage (Bash / Linux / macOS):
 *   FIRST_ADMIN_EMAIL="admin@yourcompany.com" FIRST_ADMIN_PASSWORD="YourStrongPassword123!" node ./scripts/setup-first-admin.mjs
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'staff_users.json');
const AUDIT_FILE = path.join(DATA_DIR, 'staff_audit_log.json');

// Base32 TOTP secret generator for 2FA
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function generateBase32Secret(length = 20) {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE32_ALPHABET[bytes[i] % 32];
  }
  return result;
}

function readJsonFile(filePath, defaultVal = []) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content ? JSON.parse(content) : defaultVal;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return defaultVal;
}

function writeJsonFile(filePath, data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function main() {
  console.log('\n======================================================');
  console.log('   JOSAN LOGISTICS - FIRST ADMIN PROVISIONING         ');
  console.log('======================================================\n');

  // 1. Read strictly from environment variables - NO HARD-CODED DEFAULTS
  const rawEmail = process.env.FIRST_ADMIN_EMAIL;
  const rawPassword = process.env.FIRST_ADMIN_PASSWORD;
  const rawName = process.env.FIRST_ADMIN_NAME || 'System Administrator';

  if (!rawEmail || !rawEmail.trim()) {
    console.error('\x1b[31m[ERROR] Missing environment variable: FIRST_ADMIN_EMAIL\x1b[0m');
    console.error('Please set FIRST_ADMIN_EMAIL before running this script.');
    console.error('Example: $env:FIRST_ADMIN_EMAIL="admin@yourdomain.com"\n');
    process.exit(1);
  }

  if (!rawPassword) {
    console.error('\x1b[31m[ERROR] Missing environment variable: FIRST_ADMIN_PASSWORD\x1b[0m');
    console.error('Please set FIRST_ADMIN_PASSWORD before running this script.');
    console.error('Example: $env:FIRST_ADMIN_PASSWORD="YourSecurePassword123!"\n');
    process.exit(1);
  }

  const email = rawEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('\x1b[31m[ERROR] Invalid email format in FIRST_ADMIN_EMAIL.\x1b[0m\n');
    process.exit(1);
  }

  // 2. Reject passwords under 12 characters
  if (rawPassword.length < 12) {
    console.error(`\x1b[31m[ERROR] Password must be at least 12 characters long. Provided length: ${rawPassword.length}.\x1b[0m\n`);
    process.exit(1);
  }

  // 3. Refuse to run if an admin already exists
  const users = readJsonFile(USERS_FILE, []);
  const existingAdmin = users.find(u => (u.role || '').toLowerCase() === 'admin' && u.status === 'Active');

  if (existingAdmin) {
    console.error(`\x1b[31m[ERROR] Setup refused: An active administrator account (${existingAdmin.email}) already exists.\x1b[0m`);
    console.error('To manage staff accounts, please log into the Admin Portal at /#staff-login.\n');
    process.exit(1);
  }

  // 4. Hash password with bcrypt (salt rounds 10) - Never store plain text
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(rawPassword, salt);
  const twoFactorSecret = generateBase32Secret(20);
  const otpAuthUri = `otpauth://totp/Josan%20Logistics:${encodeURIComponent(email)}?secret=${twoFactorSecret}&issuer=Josan%20Logistics&algorithm=SHA1&digits=6&period=30`;

  // 5. Construct admin user record
  const newAdmin = {
    id: `STAFF-ADM-${Date.now().toString().slice(-6)}`,
    name: rawName.trim(),
    email: email,
    role: 'admin',
    passwordHash: passwordHash,
    must_change_password: true,
    mustChangePassword: true,
    twoFactorSecret: twoFactorSecret,
    twoFactorConfirmed: false,
    status: 'Active',
    lastLoginAt: null,
    tokenVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Filter out any stale record with same email and save
  const updatedUsers = users.filter(u => u.email.toLowerCase() !== email);
  updatedUsers.unshift(newAdmin);
  writeJsonFile(USERS_FILE, updatedUsers);

  // 6. Record security audit log entry
  const logs = readJsonFile(AUDIT_FILE, []);
  logs.unshift({
    id: `AUD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    timestamp: new Date().toISOString(),
    eventType: 'ACCOUNT_CREATED',
    actor: { email: 'Environment CLI Script', role: 'System' },
    targetUser: email,
    ip: '127.0.0.1 (CLI)',
    details: 'Initial first administrator account provisioned via FIRST_ADMIN_EMAIL / FIRST_ADMIN_PASSWORD environment variables.'
  });
  writeJsonFile(AUDIT_FILE, logs);

  console.log('\x1b[32m[SUCCESS] First administrator account provisioned successfully!\x1b[0m\n');
  console.log('------------------------------------------------------');
  console.log(` Admin Name:              ${newAdmin.name}`);
  console.log(` Admin Work Email:        ${newAdmin.email}`);
  console.log(` Role:                    ${newAdmin.role}`);
  console.log(` Password Hash:           ${passwordHash.substring(0, 10)}... (bcrypt stored)`);
  console.log(` must_change_password:   \x1b[36mtrue (Required on first login)\x1b[0m`);
  console.log('------------------------------------------------------');
  console.log('\x1b[35m[2FA AUTHENTICATOR APP CREDENTIALS]\x1b[0m');
  console.log(` 2FA Secret Key:          \x1b[33m${twoFactorSecret}\x1b[0m`);
  console.log(` TOTP URI:                ${otpAuthUri}`);
  console.log('------------------------------------------------------\n');
  console.log('\x1b[33m[NEXT STEPS]\x1b[0m');
  console.log('1. Add the 2FA Secret Key to your Authenticator App (Google Authenticator, Microsoft Authenticator).');
  console.log('2. Navigate to: http://localhost:3000/#staff-login');
  console.log('3. Enter your FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD.');
  console.log('4. Enter the 6-digit code from your authenticator app.');
  console.log('5. You will be prompted to set your permanent password (min 12 chars).\n');
}

main().catch(err => {
  console.error('\x1b[31m[UNEXPECTED ERROR]\x1b[0m', err.message);
  process.exit(1);
});
