import puppeteer from 'puppeteer';

const pages = [
  { name: 'home', url: 'http://localhost:3003/', filename: 'screenshot-home.png' },
  { name: 'new-post', url: 'http://localhost:3003/new', filename: 'screenshot-new-post.png' },
  { name: 'signin', url: 'http://localhost:3003/auth/signin', filename: 'screenshot-signin.png' },
  { name: 'signup', url: 'http://localhost:3003/auth/signup', filename: 'screenshot-signup.png' },
];

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const pageInfo of pages) {
    console.log(`Taking screenshot of ${pageInfo.name}...`);
    await page.goto(pageInfo.url, { waitUntil: 'networkidle0', timeout: 10000 });
    await page.screenshot({ path: pageInfo.filename, fullPage: true });
    console.log(`✓ Saved ${pageInfo.filename}`);
  }

  await browser.close();
  console.log('All screenshots taken!');
}

takeScreenshots().catch(console.error);
