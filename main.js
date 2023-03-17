const { chromium } = require('playwright');
const readline = require('readline');

async function loginToAppleMusic(username, password) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    geolocation: {
      latitude: 35.6884295,
      longitude: 139.7555448
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    locale: 'en-US',
    permissions: ['geolocation'],
    timezoneId: 'Asia/Tokyo'
  });
  const page = await context.newPage();

  await page.goto('https://music.apple.com/us/browse');
  await page.getByTestId('dropdown-button').click();
  await page.getByTestId('list-item-0').click();
  await page.getByTestId('select-button').click();
  await page.getByRole('button', { name: 'サインイン' }).click();
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').locator('#modal-body div').filter({ hasText: 'Apple IDでサインインしてくださいApple TVおよびApple Musicにサインインします。Apple IDを新規作成 Apple IDまたはパスワ' }).first().click();
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByLabel('Apple IDを使ってサインイン').click();
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByLabel('Apple IDを使ってサインイン').fill(username);
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByLabel('Apple IDを使ってサインイン').press('Enter');
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByLabel('パスワード').click();
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByLabel('パスワード').fill(password);
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByLabel('パスワード').press('Enter');

  const verificationCode = await askForVerificationCode();
  const codeArray = verificationCode.split('');
  for (let i = 0; i < 6; i++) {
    await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByRole('textbox', { name: `桁 ${i+1}` }).fill(codeArray[i]);
  }
  await page.frameLocator('[data-testid="modal-content-wrapper"] iframe').frameLocator('iframe[name="aid-auth-widget"]').getByRole('button', { name: '信頼する' }).click();

  return { browser, page };
}

async function askForVerificationCode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Please enter the verification code: ', (code) => {
      rl.close();
      resolve(code);
    });
  });
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
