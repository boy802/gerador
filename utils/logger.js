const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../data/app.log');

exports.log = (message) => {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, entry, 'utf-8');
};
