const crypto = require('crypto');

function toPositiveInteger(value, fallback, min = 1, max = 10000) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min) return fallback;
  return Math.min(parsed, max);
}

function generateCode(options = {}) {
  const chars = [];
  const useAlpha = options.alpha === true || options.alpha === 'on' || options.alpha === 'true' || options.alpha === undefined;
  const useNumeric = options.numeric === true || options.numeric === 'on' || options.numeric === 'true' || options.numeric === undefined;

  if (useAlpha) chars.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (useNumeric) chars.push(...'0123456789');

  if (chars.length === 0) {
    chars.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  }

  const length = toPositiveInteger(options.length, 8, 1, 64);
  let code = (options.prefix || '').trim();

  for (let i = 0; i < length; i++) {
    code += chars[crypto.randomInt(chars.length)];
  }

  code += (options.suffix || '').trim();
  return code;
}

module.exports = { generateCode, toPositiveInteger };
