function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'on', 'yes', 'sim'].includes(String(value).toLowerCase());
}

function toNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

async function safeFill(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 15000 });
  await page.fill(selector, '');
  await page.fill(selector, value);
}

async function runAutomation(options) {
  let chromium;

  try {
    ({ chromium } = require('playwright'));
  } catch (error) {
    throw new Error('Playwright não está instalado. Rode npm install e depois npx playwright install chromium.');
  }

  const config = options.config || {};
  const codes = options.codes || [];
  const onSent = options.onSent || (async () => {});

  const headless = toBool(config.headless, true);
  const delayMs = toNumber(config.delayMs, 1500, 200, 60000);
  const navigationTimeoutMs = toNumber(config.navigationTimeoutMs, 30000, 5000, 120000);
  const returnToTarget = toBool(config.returnToTarget, false);
  const continueOnError = toBool(config.continueOnError, true);

  const browser = await chromium.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(navigationTimeoutMs);
    page.setDefaultNavigationTimeout(navigationTimeoutMs);

    if (config.loginUrl && config.loginUserSelector && config.loginPasswordSelector && config.loginSubmitSelector) {
      await page.goto(config.loginUrl, { waitUntil: 'domcontentloaded' });
      await safeFill(page, config.loginUserSelector, config.loginUsername || '');
      await safeFill(page, config.loginPasswordSelector, config.loginPassword || '');
      await page.click(config.loginSubmitSelector);
      await page.waitForLoadState('networkidle', { timeout: navigationTimeoutMs }).catch(() => null);
      await wait(delayMs);
    }

    await page.goto(config.targetUrl, { waitUntil: 'domcontentloaded' });

    for (let index = 0; index < codes.length; index++) {
      const item = codes[index];
      const code = typeof item === 'string' ? item : item.code;
      const codeId = typeof item === 'object' ? item.id : null;

      try {
        await page.waitForSelector(config.codeSelector, { timeout: navigationTimeoutMs });
        await safeFill(page, config.codeSelector, code);

        await page.click(config.submitSelector);
        await page.waitForLoadState('networkidle', { timeout: navigationTimeoutMs }).catch(() => null);

        if (config.successSelector) {
          await page.waitForSelector(config.successSelector, { timeout: navigationTimeoutMs });
        }

        if (config.resetSelector) {
          await page.click(config.resetSelector).catch(() => null);
        }

        await onSent({ id: codeId, code, index });
        results.push({ code, status: 'ok', message: 'Enviado' });

        await wait(delayMs);

        if (returnToTarget) {
          await page.goto(config.targetUrl, { waitUntil: 'domcontentloaded' });
        }
      } catch (error) {
        results.push({ code, status: 'erro', message: error.message });
        if (!continueOnError) break;

        if (returnToTarget) {
          await page.goto(config.targetUrl, { waitUntil: 'domcontentloaded' }).catch(() => null);
        }
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

module.exports = { runAutomation, toBool, toNumber };
