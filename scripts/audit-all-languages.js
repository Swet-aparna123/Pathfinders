const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('./pathfinders-next/lib/i18n/translations/en.json', 'utf8'));

function getVal(obj, p) {
  const parts = p.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in cur) cur = cur[part];
    else return undefined;
  }
  return cur;
}

function getLeaves(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    if (k === '_meta') continue;
    const full = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys.push(...getLeaves(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const enLeaves = getLeaves(en);
console.log('Total leaf keys in en.json:', enLeaves.length);

const allLangs = ['en', 'hi', 'bn', 'or', 'te', 'mr', 'gu', 'ur', 'kn', 'ml'];

for (const lang of allLangs) {
  const filePath = `./pathfinders-next/lib/i18n/translations/${lang}.json`;
  const dict = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const missing = enLeaves.filter(k => getVal(dict, k) === undefined || getVal(dict, k) === '');
  const identical = enLeaves.filter(k => {
    const vEn = getVal(en, k);
    const vLang = getVal(dict, k);
    return vEn === vLang && typeof vEn === 'string' && vEn.length > 3 && !vEn.includes('{');
  });

  console.log(`${lang}: missing = ${missing.length}, identical to en = ${identical.length}`);
  if (missing.length > 0) {
    console.log(`  missing in ${lang}:`, missing);
  }
}

