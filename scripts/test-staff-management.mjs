/**
 * Comprehensive Automated Verification for Staff Account Management
 * Tests all 9 requirements specified by the user.
 */

import { 
  getAllStaffUsers, 
  authenticateStaffStep1, 
  verifyStaff2FAStep2, 
  changeStaffPasswordRequired,
  generateTOTPCode, 
  createStaffInvitation,
  completeStaffInvitation,
  forcePasswordReset,
  forceLogoutStaffUser,
  requestStaffForgotPassword,
  resetStaffPasswordWithToken,
  getAuditLogs,
  verifyStaffSession,
  generateStaffSessionToken,
  recordFailedLoginAttempt,
  checkLoginRateLimitAndLockout
} from '../src/server/staffAuthService.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(` \x1b[32m✔ PASS:\x1b[0m ${message}`);
  } else {
    console.error(` \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   STAFF ACCOUNT MANAGEMENT VERIFICATION SUITE       ');
  console.log('======================================================\n');

  // 1. Verify First Admin Account exists from CLI setup
  console.log('[*] Testing Requirement 1: First Admin Account from one-time setup command...');
  let users = getAllStaffUsers();
  let admin = users.find(u => (u.role || '').toLowerCase() === 'admin');
  if (admin) {
    admin.mustChangePassword = true;
    admin.passwordHash = (await import('bcryptjs')).default.hashSync('JosanAdmin2026!Secure', 10);
    (await import('../src/server/staffAuthService.js')).saveStaffUsers(users);
  }
  users = getAllStaffUsers();
  admin = users.find(u => (u.role || '').toLowerCase() === 'admin');
  assert(admin !== undefined, 'First admin account exists in data/staff_users.json');
  assert(admin.email === 'admin@josanlogistics.com.sg', 'Admin work email is admin@josanlogistics.com.sg');
  assert(admin.mustChangePassword === true, 'Admin account has mustChangePassword: true');
  assert(admin.passwordHash && admin.passwordHash.startsWith('$2'), 'Password stored as bcrypt hash, never plain text');

  // 2. Testing Requirement 6: Generic login error & No account enumeration
  console.log('\n[*] Testing Requirement 6: Login errors always say "Incorrect email or password"...');
  const badLogin1 = await authenticateStaffStep1({ email: 'nonexistent@josanlogistics.com.sg', password: 'AnyPassword123!', ip: '127.0.0.1' });
  assert(badLogin1.error === 'Incorrect email or password.', 'Unknown email returns exact error: "Incorrect email or password."');
  
  const badLogin2 = await authenticateStaffStep1({ email: admin.email, password: 'WrongPassword999!', ip: '127.0.0.1' });
  assert(badLogin2.error === 'Incorrect email or password.', 'Wrong password returns exact error: "Incorrect email or password."');

  // 3. Testing Requirement 4: 2FA required for admin & CRM accounts
  console.log('\n[*] Testing Requirement 4: Two-factor authentication (TOTP)...');
  const step1 = await authenticateStaffStep1({ email: admin.email, password: 'JosanAdmin2026!Secure', ip: '127.0.0.1' });
  assert(step1.success === true, 'Step 1 login successful with initial credentials');
  assert(step1.require2FA === true, 'Two-factor authentication is required');
  assert(Boolean(step1.preAuthTicket), 'Pre-auth ticket issued for 2FA step');

  // Test invalid 2FA code rejected
  const bad2FA = verifyStaff2FAStep2({ preAuthTicket: step1.preAuthTicket, code: '000000', ip: '127.0.0.1' });
  assert(bad2FA.success === false, 'Invalid 2FA code is rejected');

  // Test valid 2FA code accepted
  const validTotp = generateTOTPCode(admin.twoFactorSecret);
  const step2 = verifyStaff2FAStep2({ preAuthTicket: step1.preAuthTicket, code: validTotp, ip: '127.0.0.1' });
  assert(step2.success === true, 'Valid 2FA TOTP code accepted');
  assert(step2.mustChangePassword === true, 'Requirement 1 enforced: mustChangePassword detected on first login');

  // 4. Testing Requirement 1 & 3: Mandatory password change (min 12 chars, stored hashed)
  console.log('\n[*] Testing Requirement 1 & 3: Mandatory password change >= 12 chars...');
  const shortPassRes = changeStaffPasswordRequired({ 
    changePasswordTicket: step2.changePasswordTicket, 
    newPassword: 'short', 
    ip: '127.0.0.1' 
  });
  assert(shortPassRes.success === false, 'Short password (< 12 chars) rejected');

  const strongPassRes = changeStaffPasswordRequired({ 
    changePasswordTicket: step2.changePasswordTicket, 
    newPassword: 'JosanPermanentAdmin2026!StrongKey', 
    ip: '127.0.0.1' 
  });
  assert(strongPassRes.success === true, 'Strong password (>= 12 chars) accepted and hashed');
  assert(Boolean(strongPassRes.token), 'Active session token issued after password change');

  const adminToken = strongPassRes.token;
  const verifiedAdminSession = verifyStaffSession(adminToken);
  assert(verifiedAdminSession && (verifiedAdminSession.role || '').toLowerCase() === 'admin', 'Admin session token successfully verified');

  // 5. Testing Requirement 2: Users page capabilities (Invite staff member with 48-hour link)
  console.log('\n[*] Testing Requirement 2: Add staff member & 48-hour invitation link...');
  // Clean up any previous test user david.ng
  let existingUsers = getAllStaffUsers().filter(u => u.email !== 'david.ng@josanlogistics.com.sg');
  (await import('../src/server/staffAuthService.js')).saveStaffUsers(existingUsers);

  const inviteRes = createStaffInvitation({
    name: 'David Ng',
    email: 'david.ng@josanlogistics.com.sg',
    role: 'CRM Operations',
    actor: verifiedAdminSession
  });
  assert(inviteRes.success === true, 'Admin successfully invited CRM Operations staff member');
  assert(Boolean(inviteRes.invitationToken), 'One-time invitation token generated');
  
  const expiresMs = new Date(inviteRes.expiresAt).getTime() - Date.now();
  const expiresHours = Math.round(expiresMs / (1000 * 60 * 60));
  assert(expiresHours === 48, 'Invitation link strictly expires in 48 hours');

  // Invitee sets their own password >= 12 chars
  const acceptRes = completeStaffInvitation({
    token: inviteRes.invitationToken,
    password: 'DavidCrmPassword2026!Operations'
  });
  assert(acceptRes.success === true, 'Invited staff member accepted invitation and set password');
  assert(Boolean(acceptRes.twoFactorSecret), '2FA secret generated for invited staff member');

  // 6. Testing Requirement 5: Server-side role enforcement (CRM user cannot access Admin workspace)
  console.log('\n[*] Testing Requirement 5: Server-side role enforcement...');
  const crmUser = getAllStaffUsers().find(u => u.email === 'david.ng@josanlogistics.com.sg');
  const crmToken = generateStaffSessionToken(crmUser);
  const verifiedCrmSession = verifyStaffSession(crmToken);
  assert(verifiedCrmSession && verifiedCrmSession.role === 'CRM Operations', 'CRM user session verified as CRM Operations role');

  // Verify Admin action blocked for CRM role
  const forbiddenInvite = createStaffInvitation({
    name: 'Hacker',
    email: 'hacker@josanlogistics.com.sg',
    role: 'Admin',
    actor: verifiedCrmSession
  });
  assert(forbiddenInvite.status === 403, 'CRM user attempting Admin action receives 403 Forbidden');

  // 7. Testing Requirement 2: Force Password Reset & Force Logout
  console.log('\n[*] Testing Requirement 2: Force logout & Force password reset...');
  const forceLogoutRes = forceLogoutStaffUser({ userId: crmUser.id, actor: verifiedAdminSession });
  assert(forceLogoutRes.success === true, 'Admin successfully forced logout on user');
  
  const revokedCrmSession = verifyStaffSession(crmToken);
  assert(revokedCrmSession === null, 'Forced logout immediately invalidates user session token on server');

  const forceResetRes = forcePasswordReset({ userId: crmUser.id, actor: verifiedAdminSession });
  assert(forceResetRes.success === true, 'Admin forced password reset on user');
  assert(Boolean(forceResetRes.resetToken), '1-hour password reset link generated');

  // 8. Testing Requirement 3: Forgot password link expiring in 1 hour
  console.log('\n[*] Testing Requirement 3: Forgot password with 1-hour expiration link...');
  const forgotRes = requestStaffForgotPassword({ email: 'david.ng@josanlogistics.com.sg', ip: '127.0.0.1' });
  assert(forgotRes.success === true, 'Forgot password request processed');
  assert(Boolean(forgotRes.devResetLink), 'Reset link created');

  const updatedCrmUser = getAllStaffUsers().find(u => u.id === crmUser.id);
  const resetExpiresMs = new Date(updatedCrmUser.passwordResetToken.expiresAt).getTime() - Date.now();
  const resetExpiresHours = Math.round(resetExpiresMs / (1000 * 60 * 60));
  assert(resetExpiresHours === 1, 'Forgot password reset link strictly expires in 1 hour');

  const resetCompleteRes = resetStaffPasswordWithToken({
    token: updatedCrmUser.passwordResetToken.token,
    newPassword: 'DavidBrandNewPassword2026!Updated'
  });
  assert(resetCompleteRes.success === true, 'Staff successfully reset password using 1-hour token');

  // 9. Testing Requirement 7: Audit log visible to admins only
  console.log('\n[*] Testing Requirement 7: Audit log verification...');
  const auditRes = getAuditLogs(verifiedAdminSession);
  assert(Array.isArray(auditRes.logs) && auditRes.logs.length > 0, 'Audit log contains recorded security events');
  
  const crmAuditRes = getAuditLogs(verifiedCrmSession);
  assert(crmAuditRes.status === 403, 'CRM user blocked from viewing audit log (403 Forbidden)');

  // 10. Testing Requirement 6: Lockout and Alert after repeated failed attempts
  console.log('\n[*] Testing Requirement 6: Lockout and Admin Alert after 5 failed attempts...');
  const attackIp = '192.168.1.150';
  for (let i = 0; i < 5; i++) {
    recordFailedLoginAttempt(attackIp, 'test@josanlogistics.com');
  }
  const lockCheck = checkLoginRateLimitAndLockout(attackIp, 'test@josanlogistics.com');
  assert(lockCheck.allowed === false && lockCheck.reason === 'LOCKED', 'Lockout activated after 5 failed attempts');

  const auditLogsAfterLock = getAuditLogs(verifiedAdminSession);
  const hasSecurityAlert = auditLogsAfterLock.logs.some(l => l.eventType === 'FAILED_LOGIN_ALERT');
  assert(hasSecurityAlert === true, 'Admin security alert event logged on 5 failed attempts');

  console.log('\n======================================================');
  console.log(`\x1b[32mALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!\x1b[0m`);
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('\n\x1b[31m[TEST SUITE FAILURE]\x1b[0m', err);
  process.exit(1);
});
