const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function normalizeLines(content) {
  return String(content || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

exports.readTxt = (filePath) => {
  if (!filePath) return [];
  const resolvedPath = path.resolve(filePath);
  const content = fs.readFileSync(resolvedPath, 'utf-8');
  return normalizeLines(content);
};

exports.readLines = normalizeLines;

exports.writeTxt = (codes) => {
  ensureDataDir();
  const filePath = path.join(dataDir, `export_${Date.now()}.txt`);
  fs.writeFileSync(filePath, codes.join('\n'), 'utf-8');
  return filePath;
};
