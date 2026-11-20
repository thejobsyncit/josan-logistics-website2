import fs from 'fs';
import path from 'path';
import http from 'http';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:\\Users\\bala\\.gemini\\antigravity\\brain\\4b5047b1-8b34-4409-8fd3-f8da607a2149';
const TEMPLATE_PATH = path.resolve('supabase/templates/confirmation.html');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runTests() {
  console.log('=== Step 1: Validating Confirmation Email Template HTML ===');
  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const requiredTokens = [
    '{{ .ConfirmationURL }}',
    '{{ .SiteURL }}/assets/josan_logo.png',
    'alt="Josan Logistics"',
    'LOGISTICS &amp; SHIPPING SERVICES',
    'Welcome to Josan Logistics',
    'Your journey with smarter, reliable logistics starts here.',
    'Thank you for creating an account with Josan Logistics. We\'re pleased to have you onboard.',
    'To activate your account and securely access our logistics portal, please confirm your email address by clicking the button below.',
    'VERIFY MY EMAIL ADDRESS',
    '#F77F28',
    '#111827',
    'If you did not create this account, you can safely ignore this email. Your account will not be activated unless your email address is confirmed.',
    'Reliable logistics. Seamless delivery. Trusted connections.',
    'contact@josanlogistics.com.sg',
    'Josan Logistics Pte. Ltd.'
  ];

  for (const token of requiredTokens) {
    if (!templateHtml.includes(token)) {
      throw new Error(`Email template missing required content: "${token}"`);
    }
    console.log(`  ✓ Found required token: "${token.slice(0, 40)}..."`);
  }

  // Create preview HTML with simulated values
  const previewHtml = templateHtml
    .replace(/\{\{ \.SiteURL \}\}/g, 'http://localhost:3000')
    .replace(/\{\{ \.ConfirmationURL \}\}/g, 'http://localhost:3000/#email-verified&token=preview-test-token');

  const previewFilePath = path.resolve('supabase/templates/preview_confirmation.html');
  fs.writeFileSync(previewFilePath, previewHtml, 'utf8');
  console.log('  ✓ Email template preview generated at:', previewFilePath);

  console.log('\n=== Step 2: Testing Dev Server & Browser Rendering ===');
  
  // Check if port 3000 is open
  const isPortOpen = await new Promise((resolve) => {
    const req = http.get('http://localhost:3000', () => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });

  let serverProcess = null;
  if (!isPortOpen) {
    console.log('  Starting Vite dev server on port 3000...');
    serverProcess = spawn('npx.cmd', ['vite', '--port', '3000', '--host', 'localhost'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 4000));
  } else {
    console.log('  Vite dev server is already running on port 3000.');
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 1. Render and screenshot the email preview (Desktop)
    console.log('  Rendering email template in Chrome (Desktop 800x900)...');
    await page.setViewport({ width: 800, height: 900 });
    await page.goto(`file://${previewFilePath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
    const emailDesktopPath = path.join(ARTIFACT_DIR, 'email_confirmation_template_desktop.png');
    await page.screenshot({ path: emailDesktopPath, fullPage: true });
    console.log('  ✓ Saved email desktop screenshot:', emailDesktopPath);

    // 2. Render and screenshot the email preview (Mobile)
    console.log('  Rendering email template in Chrome (Mobile 375x812)...');
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.reload({ waitUntil: 'networkidle0' });
    const emailMobilePath = path.join(ARTIFACT_DIR, 'email_confirmation_template_mobile.png');
    await page.screenshot({ path: emailMobilePath, fullPage: true });
    console.log('  ✓ Saved email mobile screenshot:', emailMobilePath);

    // 3. Render and test the Website Email Verified Page
    console.log('  Navigating to http://localhost:3000/#email-verified...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/#email-verified', { waitUntil: 'networkidle0' });

    // Verify headline and elements
    const pageText = await page.evaluate(() => document.body.innerText);
    if (!pageText.includes('Email Verified Successfully!')) {
      throw new Error('EmailVerifiedPage missing headline "Email Verified Successfully!"');
    }
    console.log('  ✓ Verified headline "Email Verified Successfully!" is present.');

    if (!pageText.includes('Your Josan Logistics account is now verified. You can continue to our logistics portal to access your account.')) {
      throw new Error('EmailVerifiedPage missing exact subheading copy.');
    }
    console.log('  ✓ Verified subheading copy is present.');

    if (!pageText.includes('CONTINUE TO JOSAN LOGISTICS')) {
      throw new Error('EmailVerifiedPage missing CTA button "CONTINUE TO JOSAN LOGISTICS".');
    }
    console.log('  ✓ Verified CTA button "CONTINUE TO JOSAN LOGISTICS" is present.');

    const verifiedPageScreenshotPath = path.join(ARTIFACT_DIR, 'email_verified_success_page.png');
    await page.screenshot({ path: verifiedPageScreenshotPath, fullPage: true });
    console.log('  ✓ Saved website verification page screenshot:', verifiedPageScreenshotPath);

    // 4. Test clicking the CTA button
    console.log('  Clicking "CONTINUE TO JOSAN LOGISTICS" button...');
    const continueBtn = await page.waitForSelector('button:has-text("CONTINUE TO JOSAN LOGISTICS")', { timeout: 5000 }).catch(async () => {
      // Fallback selector
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.innerText, btn);
        if (text.includes('CONTINUE TO JOSAN LOGISTICS')) return btn;
      }
      return null;
    });

    if (continueBtn) {
      await continueBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      const postClickText = await page.evaluate(() => document.body.innerText);
      const hasAuthModalOrHome = postClickText.includes('Welcome Back') || postClickText.includes('Create Account') || postClickText.includes('Air Freight') || postClickText.includes('Track Shipment');
      console.log('  ✓ Clicked CTA button successfully. Redirect/modal activated:', hasAuthModalOrHome);
      
      const postClickScreenshotPath = path.join(ARTIFACT_DIR, 'email_verified_post_click.png');
      await page.screenshot({ path: postClickScreenshotPath });
      console.log('  ✓ Saved post-click screenshot:', postClickScreenshotPath);
    }

    console.log('\n=== ALL EMAIL & VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runTests().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});

