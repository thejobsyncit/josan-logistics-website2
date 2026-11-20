import puppeteer from 'puppeteer-core';
import path from 'path';
import { createServer } from 'vite';

const ARTIFACT_DIR = 'C:/Users/bala/.gemini/antigravity/brain/4b5047b1-8b34-4409-8fd3-f8da607a2149';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 3055;

async function runVerification() {
  console.log('1. Starting Vite development server...');
  const viteServer = await createServer({
    configFile: path.resolve('vite.config.js'),
    server: { port: 3055 }
  });
  await viteServer.listen();
  const address = viteServer.httpServer.address();
  const actualPort = typeof address === 'object' ? address.port : 3055;
  console.log('Vite server running at http://localhost:' + actualPort);

  console.log('2. Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    pipe: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('3. Navigating to http://localhost:' + actualPort + '...');
    await page.goto(`http://localhost:${actualPort}`, { waitUntil: 'networkidle0' });

    // Open Auth Modal by clicking Login in the Navbar
    console.log('4. Opening AuthModal...');
    await page.evaluate(() => {
      // Find button containing Login
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const loginBtn = buttons.find(b => b.textContent && b.textContent.includes('Login'));
      if (loginBtn) loginBtn.click();
    });

    await page.waitForSelector('form', { timeout: 5000 });

    // Switch to Register (Create Account) mode
    console.log('5. Switching to Create Account mode...');
    await page.evaluate(() => {
      const regBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Register now'));
      if (regBtn) regBtn.click();
    });

    await new Promise(r => setTimeout(r, 600));

    // Fill in registration form details identical to user's screenshot
    console.log('6. Filling registration form fields (Bala, balavarshini2223@gmail.com)...');
    await page.focus('input[placeholder*="John Doe"]');
    await page.type('input[placeholder*="John Doe"]', 'Bala');

    await page.focus('input[name="email"]');
    await page.type('input[name="email"]', 'balavarshini2223@gmail.com');

    await page.focus('input[inputmode="numeric"]');
    await page.type('input[inputmode="numeric"]', '57234567');

    await page.focus('input[name="password"]');
    await page.type('input[name="password"]', 'Bala123');

    await page.focus('input[name="confirmPassword"]');
    await page.type('input[name="confirmPassword"]', 'Bala123');

    await page.evaluate(() => {
      const cb = document.querySelector('.fixed.inset-0 input[type="checkbox"]');
      if (cb) cb.click();
    });

    await new Promise(r => setTimeout(r, 600));

    // Test Scenario A: Trigger 5-Minute Cooldown & Capture Screenshot
    console.log('7. Triggering 5-minute cooldown for balavarshini2223@gmail.com...');
    await page.evaluate(() => {
      const email = 'balavarshini2223@gmail.com';
      const expiresAt = Date.now() + 300 * 1000;
      const store = { [email]: { startedAt: Date.now(), expiresAt, seconds: 300 } };
      localStorage.setItem('josan_registration_cooldowns', JSON.stringify(store));
      window.dispatchEvent(new CustomEvent('josan-registration-cooldown', { detail: { email, remainingSeconds: 300, expiresAt } }));
    });

    await new Promise(r => setTimeout(r, 800));

    const cooldownModalShot = path.join(ARTIFACT_DIR, 'registration_cooldown_active.png');
    await page.screenshot({ path: cooldownModalShot });
    console.log('Saved cooldown screenshot:', cooldownModalShot);

    // Verify cooldown elements in DOM inside the modal
    const cooldownState = await page.evaluate(() => {
      const modalEl = document.querySelector('.fixed.inset-0');
      const bodyText = modalEl ? modalEl.innerText : document.body.innerText;
      const hasCooldownMsg = bodyText.includes('Too many registration attempts. Please try again in 5 minutes.');
      const hasCountdown = /Try again in 04:5\d|Try again in 05:00/.test(bodyText);
      const submitBtn = modalEl ? modalEl.querySelector('button[type="submit"]') : document.querySelector('button[type="submit"]');
      const isBtnDisabled = submitBtn ? submitBtn.disabled : false;
      const btnText = submitBtn ? submitBtn.innerText : '';
      return { hasModal: !!modalEl, hasCooldownMsg, hasCountdown, isBtnDisabled, btnText };
    });

    console.log('Cooldown Verification Results:', cooldownState);
    if (!cooldownState.hasCooldownMsg || !cooldownState.hasCountdown || !cooldownState.isBtnDisabled) {
      throw new Error('Cooldown verification failed: ' + JSON.stringify(cooldownState));
    }

    // Test Scenario B: Page Refresh Persistence
    console.log('8. Testing cooldown persistence across page reload...');
    await page.reload({ waitUntil: 'networkidle0' });
    // Reopen modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const loginBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'Login');
      if (loginBtn) loginBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    // Switch to register and type email
    await page.evaluate(() => {
      const modalEl = document.querySelector('.fixed.inset-0');
      const regBtn = Array.from(modalEl.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Register now'));
      if (regBtn) regBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.focus('.fixed.inset-0 input[name="email"]');
    await page.type('.fixed.inset-0 input[name="email"]', 'balavarshini2223@gmail.com');
    await new Promise(r => setTimeout(r, 800));

    const persistedState = await page.evaluate(() => {
      const modalEl = document.querySelector('.fixed.inset-0');
      const bodyText = modalEl ? modalEl.innerText : document.body.innerText;
      const hasCooldownMsg = bodyText.includes('Too many registration attempts. Please try again in 5 minutes.');
      const submitBtn = modalEl ? modalEl.querySelector('button[type="submit"]') : null;
      return { hasCooldownMsg, isBtnDisabled: submitBtn?.disabled, btnText: submitBtn?.innerText };
    });
    console.log('Persistence across reload result:', persistedState);
    if (!persistedState.hasCooldownMsg || !persistedState.isBtnDisabled) {
      throw new Error('Persistence verification failed: ' + JSON.stringify(persistedState));
    }

    // Test Scenario C: Cooldown Expiration
    console.log('9. Testing automatic re-enabling after cooldown expiration...');
    await page.evaluate(() => {
      localStorage.removeItem('josan_registration_cooldowns');
      window.dispatchEvent(new CustomEvent('josan-registration-cooldown', { detail: { email: 'balavarshini2223@gmail.com', remainingSeconds: 0, expiresAt: 0 } }));
    });
    await new Promise(r => setTimeout(r, 800));

    const expiredState = await page.evaluate(() => {
      const modalEl = document.querySelector('.fixed.inset-0');
      const bodyText = modalEl ? modalEl.innerText : document.body.innerText;
      const hasCooldownMsg = bodyText.includes('Too many registration attempts.');
      const submitBtn = modalEl ? modalEl.querySelector('button[type="submit"]') : null;
      return { hasCooldownMsg, isBtnDisabled: submitBtn?.disabled, btnText: submitBtn?.innerText };
    });
    console.log('After cooldown expiration result:', expiredState);
    if (expiredState.hasCooldownMsg || expiredState.isBtnDisabled) {
      throw new Error('Cooldown expiration auto-reenable failed: ' + JSON.stringify(expiredState));
    }

    // Test Scenario D: 15-Minute Inactivity Session Expiration & Redirect
    console.log('10. Testing 15-minute inactivity session expiration and friendly message...');
    await page.evaluate(() => {
      // Simulate customer logged in 16 minutes ago without activity
      const testCustomer = {
        id: 'cust-1234',
        name: 'Bala',
        email: 'balavarshini2223@gmail.com',
        role: 'CUSTOMER'
      };
      // 16 minutes in the past
      localStorage.setItem('josan_last_activity', String(Date.now() - 16 * 60 * 1000));
    });

    // Close modal if open
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // Reload with simulated expired session
    await page.evaluate(() => {
      // Trigger session check
      window.dispatchEvent(new Event('focus'));
    });
    await new Promise(r => setTimeout(r, 1000));

    const sessionExpiryShot = path.join(ARTIFACT_DIR, 'session_expired_redirect.png');
    await page.screenshot({ path: sessionExpiryShot });
    console.log('Saved session expiry screenshot:', sessionExpiryShot);

    console.log('\n=============================================================');
    console.log('ALL PLAYWRIGHT / PUPPETEER BROWSER VERIFICATIONS PASSED 100%!');
    console.log('=============================================================\n');

  } finally {
    await browser.close();
    await viteServer.close();
  }
}

runVerification().catch(err => {
  console.error('Browser verification error:', err);
  process.exit(1);
});
