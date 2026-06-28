function generateCode(options) {
  const chars = [];
  if (options.alpha) chars.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (options.numeric) chars.push(...'0123456789');

  let code = options.prefix || '';
  for (let i = 0; i < options.length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  code += options.suffix || '';
  return code;
}

module.exports = { generateCode };
