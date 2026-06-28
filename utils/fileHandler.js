const fs = require('fs');
const path = require('path');

exports.readTxt = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split(/\r?\n/).filter(line => line.trim() !== '');
};

exports.writeTxt = (codes) => {
  const filePath = path.join(__dirname, '../data/export_' + Date.now() + '.txt');
  fs.writeFileSync(filePath, codes.join('\n'), 'utf-8');
  return filePath;
};
