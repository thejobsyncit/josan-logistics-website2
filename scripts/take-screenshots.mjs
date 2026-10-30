import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/dhara/.gemini/antigravity-ide/brain/98bddb81-9b24-4a59-b98b-ac5d1b45edaa';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const APP_URL = 'http://localhost:3000';

async function run() {
  console.log('Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();

    // -------------------------------------------------------------
    // 1. Logged-out Desktop Header (> 1100px, 1366x768)
    // -------------------------------------------------------------
    console.log('1. Capturing Logged-out Desktop Header...');
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.removeItem('josan_user');
      window.location.reload();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('header');

    const headerEl1 = await page.$('header');
    const shot1Path = path.join(ARTIFACT_DIR, 'header_logged_out.png');
    await headerEl1.screenshot({ path: shot1Path });
    console.log('Saved:', shot1Path);

    // -------------------------------------------------------------
    // 2. Logged-in Short Name Desktop Header with Profile Dropdown open
    // -------------------------------------------------------------
    console.log('2. Capturing Logged-in Short Name Header...');
    await page.evaluate(() => {
      const shortUser = {
        id: 'USR-SHORT-01',
        name: 'Marcus Tan',
        email: 'marcus.tan@singapore-freight.sg',
        company: 'Tan Freight Pte Ltd',
        role: 'customer'
      };
      localStorage.setItem('josan_user', JSON.stringify(shortUser));
      window.location.reload();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('header');

    const avatarBtn = await page.$('button[aria-label="User account menu"]');
    if (avatarBtn) {
      await avatarBtn.click();
      await page.waitForSelector('div[role="menu"]');
      await new Promise(r => setTimeout(r, 400));
    }

    const shot2Path = path.join(ARTIFACT_DIR, 'header_logged_in_short_name.png');
    await page.screenshot({
      path: shot2Path,
      clip: { x: 0, y: 0, width: 1366, height: 430 }
    });
    console.log('Saved:', shot2Path);

    // -------------------------------------------------------------
    // 3. Logged-in Very Long Name Desktop Header with Profile Dropdown open
    // -------------------------------------------------------------
    console.log('3. Capturing Logged-in Very Long Name Header...');
    await page.evaluate(() => {
      const longUser = {
        id: 'USR-LONG-99',
        name: 'Dr. Bartholomew Alexander Montgomery-Finch the Third',
        email: 'bartholomew.alexander.montgomery-finch@transpacific-global-logistics.com',
        company: 'International Trans-Pacific Intermodal Multimodal Logistics & Supply Chain Solutions Pte. Ltd.',
        role: 'customer'
      };
      localStorage.setItem('josan_user', JSON.stringify(longUser));
      window.location.reload();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('header');

    const avatarBtnLong = await page.$('button[aria-label="User account menu"]');
    if (avatarBtnLong) {
      await avatarBtnLong.click();
      await page.waitForSelector('div[role="menu"]');
      await new Promise(r => setTimeout(r, 400));
    }

    const shot3Path = path.join(ARTIFACT_DIR, 'header_logged_in_long_name.png');
    await page.screenshot({
      path: shot3Path,
      clip: { x: 0, y: 0, width: 1366, height: 440 }
    });
    console.log('Saved:', shot3Path);

    // -------------------------------------------------------------
    // 4. Mobile View (< 1100px, 390x844) with Hamburger Menu open
    // -------------------------------------------------------------
    console.log('4. Capturing Mobile View with Menu Open...');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('header');

    // Click hamburger button matching aria-label case-insensitively or via text
    const hamburgerBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.getAttribute('aria-label') === 'Toggle Navigation Menu') || null;
    });

    if (hamburgerBtn) {
      await hamburgerBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }

    const shot4Path = path.join(ARTIFACT_DIR, 'header_mobile_menu.png');
    // Take screenshot of the entire header component including the open mobile drawer
    const headerElMobile = await page.$('header');
    if (headerElMobile) {
      await headerElMobile.screenshot({ path: shot4Path });
    } else {
      await page.screenshot({
        path: shot4Path,
        clip: { x: 0, y: 0, width: 390, height: 680 }
      });
    }
    console.log('Saved:', shot4Path);

    console.log('All 4 screenshots re-captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
