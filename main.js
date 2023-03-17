const { chromium } = require('playwright');
const readline = require('readline');

async function loginToAppleMusic(username, password) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://music.apple.com/');
  await page.click('button[data-testid="signInHeaderButton"]');
  await page.waitForSelector('iframe[id="aid-auth-widget-iFrame"]');

  const signInFrame = await page.frame({ name: 'aid-auth-widget-iFrame' });

  await signInFrame.fill('input[id="account_name_text_field"]', username);
  await signInFrame.click('button[id="sign-in"]');
  await signInFrame.waitForSelector('input[id="password_text_field"]');
  await signInFrame.fill('input[id="password_text_field"]', password);
  await signInFrame.click('button[id="sign-in"]');

  await page.waitForNavigation();
  return { browser, page };
}

