const { chromium } = require('playwright');
const readline = require('readline');

async function loginToAppleMusic(username, password) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://music.apple.com/');
  await page.waitForLoadState('load');
  await page.waitForSelector('[data-testid="sign-in-button"]');
  await page.click('[data-testid="sign-in-button"]');

  await page.waitForSelector('#auth-container');
  
  await page.fill('input[name="account_name"]', username);
  await page.click('button[type="submit"]');
  
  await page.waitForSelector('input[name="password"]');
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForNavigation();
  return { browser, page };
}

(async () => {
	const username = process.env.APPLE_MUSIC_USERNAME;
	const password = process.env.APPLE_MUSIC_PASSWORD;

  try {
    const { browser, page } = await loginToAppleMusic(username, password);
    console.log('ログインに成功しました。');
    await browser.close();
  } catch (error) {
    console.error('ログインに失敗しました。', error);
  }
})();
