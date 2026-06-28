const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const logFile = path.join(dataDir, 'app.log');

exports.log = (message) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, entry, 'utf-8');
};
