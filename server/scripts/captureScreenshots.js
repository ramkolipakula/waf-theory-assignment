import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.join(__dirname, '../../docs/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// System Chrome executable
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log(`Launching Google Chrome at: ${chromePath}`);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  try {
    // 1. Home - Desktop
    console.log('1. Capturing Home Desktop...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await delay(1500);
    await page.screenshot({
      path: path.join(screenshotsDir, 'home-desktop.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/home-desktop.png');

    // 2. Home - Mobile
    console.log('2. Capturing Home Mobile...');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await delay(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'home-mobile.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/home-mobile.png');

    // Reset to Desktop Viewport
    await page.setViewport({ width: 1280, height: 800, isMobile: false });

    // 3. Login Page
    console.log('3. Capturing Login Page...');
    await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'networkidle0' });
    await delay(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'login.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/login.png');

    // 4. Citizen Dashboard (Login as citizen)
    console.log('4. Logging in as Demo Citizen & capturing Citizen Dashboard...');
    // Click Demo Citizen quick fill button
    const demoCitizenBtn = await page.waitForSelector('button ::-p-text(Demo Citizen)');
    if (demoCitizenBtn) {
      await demoCitizenBtn.click();
      await delay(500);
    }
    // Click Sign In
    const signInBtn = await page.waitForSelector('button[type="submit"]');
    await signInBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await delay(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'citizen-dashboard.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/citizen-dashboard.png');

    // 5. Report Issue Form
    console.log('5. Capturing Report Issue Form...');
    await page.goto('http://127.0.0.1:5173/report', { waitUntil: 'networkidle0' });
    await delay(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'report-issue.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/report-issue.png');

    // 6. Explore Issues
    console.log('6. Capturing Explore Issues...');
    await page.goto('http://127.0.0.1:5173/explore', { waitUntil: 'networkidle0' });
    await delay(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'explore-issues.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/explore-issues.png');

    // 7. Issue Details (First issue)
    console.log('7. Capturing Issue Details Page with Status Timeline...');
    const firstIssueLink = await page.waitForSelector('.issue-card a[href^="/issues/"]');
    if (firstIssueLink) {
      await firstIssueLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      await delay(2500);
    } else {
      await page.goto('http://127.0.0.1:5173/issues/CC-849102', { waitUntil: 'networkidle0' });
      await delay(2500);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, 'issue-details.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/issue-details.png');

    // 8. My Reports
    console.log('8. Capturing My Reports...');
    await page.goto('http://127.0.0.1:5173/my-reports', { waitUntil: 'networkidle0' });
    await delay(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'my-reports.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/my-reports.png');

    // 9. Admin Dashboard (Login as Municipal Admin)
    console.log('9. Logging in as Municipal Admin & capturing Admin Dashboard...');
    // Clear localStorage to log out
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'networkidle0' });
    await delay(1000);
    const demoAdminBtn = await page.waitForSelector('button ::-p-text(Demo Admin)');
    if (demoAdminBtn) {
      await demoAdminBtn.click();
      await delay(500);
    }
    const adminSignInBtn = await page.waitForSelector('button[type="submit"]');
    await adminSignInBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await delay(2500);
    await page.screenshot({
      path: path.join(screenshotsDir, 'admin-dashboard.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/admin-dashboard.png');

    // 10. Admin Issue Management
    console.log('10. Capturing Admin Issue Management Page...');
    await page.goto('http://127.0.0.1:5173/admin/issues', { waitUntil: 'networkidle0' });
    await delay(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'admin-issue-management.png'),
      fullPage: false,
    });
    console.log('Saved: docs/screenshots/admin-issue-management.png');

    console.log('==================================================');
    console.log(' ALL 10 REAL SCREENSHOTS SUCCESSFULLY CAPTURED! ');
    console.log('==================================================');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();
