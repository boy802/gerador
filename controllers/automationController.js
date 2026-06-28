const fs = require('fs');
const path = require('path');
const codeModel = require('../models/codeModel');
const historyModel = require('../models/historyModel');
const { runAutomation, toBool, toNumber } = require('../utils/automationRunner');

const CONFIG_PATH = path.join(__dirname, '..', 'data', 'automation-config.json');

function ensureDataDir() {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return {
      targetUrl: '',
      codeSelector: '',
      submitSelector: '',
      delayMs: 1500,
      navigationTimeoutMs: 30000,
      headless: true,
      continueOnError: true,
      returnToTarget: false,
      markUsed: true,
      codesSource: 'available',
      limit: 10
    };
  }
}

function saveConfig(config) {
  ensureDataDir();
  const safeConfig = { ...config };
  delete safeConfig.loginPassword;
  delete safeConfig.manualCodes;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(safeConfig, null, 2));
}

function getSubmittedConfig(body) {
  return {
    targetUrl: String(body.targetUrl || '').trim(),
    codeSelector: String(body.codeSelector || '').trim(),
    submitSelector: String(body.submitSelector || '').trim(),
    successSelector: String(body.successSelector || '').trim(),
    resetSelector: String(body.resetSelector || '').trim(),
    loginUrl: String(body.loginUrl || '').trim(),
    loginUserSelector: String(body.loginUserSelector || '').trim(),
    loginPasswordSelector: String(body.loginPasswordSelector || '').trim(),
    loginSubmitSelector: String(body.loginSubmitSelector || '').trim(),
    loginUsername: String(body.loginUsername || '').trim(),
    loginPassword: String(body.loginPassword || '').trim(),
    delayMs: toNumber(body.delayMs, 1500, 200, 60000),
    navigationTimeoutMs: toNumber(body.navigationTimeoutMs, 30000, 5000, 120000),
    limit: toNumber(body.limit, 10, 1, 500),
    headless: toBool(body.headless, false),
    continueOnError: toBool(body.continueOnError, false),
    returnToTarget: toBool(body.returnToTarget, false),
    markUsed: toBool(body.markUsed, false),
    codesSource: body.codesSource === 'manual' ? 'manual' : 'available',
    manualCodes: String(body.manualCodes || '')
  };
}

function parseManualCodes(text) {
  return String(text || '')
    .split(/\r?\n|,|;/)
    .map(code => code.trim())
    .filter(Boolean);
}

function validateConfig(config) {
  const errors = [];

  if (!config.targetUrl) errors.push('Informe a URL da página onde os códigos serão colados.');
  if (!config.codeSelector) errors.push('Informe o seletor do campo do código.');
  if (!config.submitSelector) errors.push('Informe o seletor do botão de enviar/salvar.');

  if (config.loginUrl || config.loginUserSelector || config.loginPasswordSelector || config.loginSubmitSelector) {
    if (!config.loginUrl || !config.loginUserSelector || !config.loginPasswordSelector || !config.loginSubmitSelector) {
      errors.push('Para login automático, preencha URL de login, campo de usuário, campo de senha e botão de login.');
    }
  }

  return errors;
}

exports.getAutomation = (req, res) => {
  const config = readConfig();
  res.render('automation', {
    config,
    result: null,
    error: null,
    message: req.query.message || null,
    availableCount: codeModel.countAvailable()
  });
};

exports.runAutomation = async (req, res, next) => {
  const config = getSubmittedConfig(req.body);
  const errors = validateConfig(config);

  try {
    saveConfig(config);

    let codes = [];

    if (config.codesSource === 'manual') {
      codes = parseManualCodes(config.manualCodes);
    } else {
      codes = codeModel.getAvailable(config.limit).map(item => ({ id: item.id, code: item.code }));
    }

    if (!codes.length) {
      errors.push(config.codesSource === 'manual' ? 'Cole pelo menos um código manual.' : 'Não há códigos disponíveis no sistema.');
    }

    if (errors.length) {
      return res.status(400).render('automation', {
        config,
        result: null,
        error: errors.join(' '),
        message: null,
        availableCount: codeModel.countAvailable()
      });
    }

    const sentResults = await runAutomation({
      config,
      codes,
      onSent: async ({ id }) => {
        if (config.codesSource === 'available' && config.markUsed && id) {
          const updated = codeModel.markUsed(id);
          if (updated.changes > 0) {
            historyModel.create({
              code_id: id,
              user_id: req.session.user.id,
              origin: 'automacao'
            });
          }
        }
      }
    });

    const ok = sentResults.filter(item => item.status === 'ok').length;
    const failed = sentResults.filter(item => item.status !== 'ok').length;

    res.render('automation', {
      config: { ...config, loginPassword: '', manualCodes: config.manualCodes },
      result: { ok, failed, total: sentResults.length, items: sentResults },
      error: null,
      message: `Automação finalizada: ${ok} enviado(s), ${failed} erro(s).`,
      availableCount: codeModel.countAvailable()
    });
  } catch (error) {
    res.status(500).render('automation', {
      config: { ...config, loginPassword: '' },
      result: null,
      error: error.message,
      message: null,
      availableCount: codeModel.countAvailable()
    });
  }
};
