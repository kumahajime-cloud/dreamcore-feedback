import puppeteer from 'puppeteer';

async function takeProgressScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. ホームページ（投稿一覧）
  console.log('Taking screenshot of home page with posts...');
  await page.goto('http://localhost:3003/', { waitUntil: 'networkidle0', timeout: 10000 });
  await page.screenshot({ path: 'progress-home-with-posts.png', fullPage: true });
  console.log('✓ Saved progress-home-with-posts.png');

  // 2. 新規投稿ページ
  console.log('Taking screenshot of new post page...');
  await page.goto('http://localhost:3003/new', { waitUntil: 'networkidle0', timeout: 10000 });
  await page.screenshot({ path: 'progress-new-post.png', fullPage: true });
  console.log('✓ Saved progress-new-post.png');

  // 3. トピック詳細ページ（最初のトピックをクリック）
  console.log('Taking screenshot of topic detail page...');
  await page.goto('http://localhost:3003/', { waitUntil: 'networkidle0', timeout: 10000 });

  // トピックカードのリンクを探す
  const topicLinks = await page.$$('a[href^="/topic/"]');

  if (topicLinks.length > 0) {
    // 最初のトピックのhrefを取得
    const topicHref = await topicLinks[0].evaluate(el => el.getAttribute('href'));
    console.log(`Found topic: ${topicHref}`);

    await page.goto(`http://localhost:3003${topicHref}`, { waitUntil: 'networkidle0', timeout: 10000 });
    await page.screenshot({ path: 'progress-topic-detail.png', fullPage: true });
    console.log('✓ Saved progress-topic-detail.png');
  } else {
    console.log('⚠ No topics found, skipping detail page screenshot');
  }

  await browser.close();
  console.log('All progress screenshots taken!');
}

takeProgressScreenshots().catch(console.error);
