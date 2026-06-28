require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Configure ${name} no arquivo .env`);
  }
  return value.trim();
}

function loadCodes() {
  const filePath = path.join(__dirname, 'codigos.txt');

  if (!fs.existsSync(filePath)) {
    throw new Error('Arquivo codigos.txt não encontrado. Crie um código por linha.');
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((codigo) => codigo.trim())
    .filter(Boolean);
}

async function doLoginIfNeeded(page) {
  const loginUrl = getEnv('LOGIN_URL');
  const email = getEnv('LOGIN_EMAIL');
  const password = getEnv('LOGIN_PASSWORD');

  if (!loginUrl || !email || !password) {
    return;
  }

  const emailSelector = getEnv('LOGIN_EMAIL_SELECTOR', 'input[type="email"]');
  const passwordSelector = getEnv('LOGIN_PASSWORD_SELECTOR', 'input[type="password"]');
  const submitSelector = getEnv('LOGIN_SUBMIT_SELECTOR', 'button[type="submit"]');

  console.log('Abrindo tela de login...');
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

  console.log('Preenchendo login...');
  await page.fill(emailSelector, email);
  await page.fill(passwordSelector, password);

  await Promise.allSettled([
    page.waitForLoadState('networkidle', { timeout: 10000 }),
    page.click(submitSelector),
  ]);

  await sleep(1500);
  console.log('Login finalizado ou enviado. Continuando...');
}

async function sendCode(page, codigo, index, total) {
  const codeSelector = requireEnv('CODE_SELECTOR');
  const submitSelector = requireEnv('SUBMIT_SELECTOR');
  const successSelector = getEnv('SUCCESS_SELECTOR');
  const errorSelector = getEnv('ERROR_SELECTOR');
  const delayMs = Number(getEnv('DELAY_MS', '1500'));

  console.log(`[${index}/${total}] Enviando: ${codigo}`);

  await page.waitForSelector(codeSelector, { state: 'visible', timeout: 20000 });
  await page.fill(codeSelector, '');
  await page.fill(codeSelector, codigo);

  await page.waitForSelector(submitSelector, { state: 'visible', timeout: 20000 });
  await page.click(submitSelector);

  if (successSelector) {
    try {
      await page.waitForSelector(successSelector, { state: 'visible', timeout: 10000 });
      console.log(`[${index}/${total}] Sucesso confirmado.`);
    } catch {
      console.log(`[${index}/${total}] Não encontrei confirmação de sucesso, seguindo pelo tempo de espera.`);
    }
  }

  if (errorSelector) {
    const errorElement = await page.$(errorSelector);
    if (errorElement) {
      const errorText = await errorElement.textContent();
      console.log(`[${index}/${total}] Aviso/erro na página: ${errorText?.trim() || 'sem texto'}`);
    }
  }

  await sleep(delayMs);
}

async function main() {
  const targetUrl = requireEnv('TARGET_URL');
  const headless = getEnv('HEADLESS', 'false').toLowerCase() === 'true';
  const codigos = loadCodes();

  if (!codigos.length) {
    throw new Error('Nenhum código encontrado no arquivo codigos.txt');
  }

  console.log(`Total de códigos carregados: ${codigos.length}`);

  const browser = await chromium.launch({
    headless,
    slowMo: headless ? 0 : 120,
  });

  const page = await browser.newPage();

  try {
    await doLoginIfNeeded(page);

    console.log('Abrindo página dos códigos...');
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    for (let i = 0; i < codigos.length; i += 1) {
      await sendCode(page, codigos[i], i + 1, codigos.length);
    }

    console.log('Todos os códigos foram processados 😼');

    if (!headless) {
      console.log('Navegador deixado aberto por 10 segundos para conferência...');
      await sleep(10000);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('Erro na automação:');
  console.error(error.message || error);
  process.exit(1);
});
