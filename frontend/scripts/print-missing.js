const fs = require('fs');
const en = JSON.parse(fs.readFileSync('./pathfinders-next/lib/i18n/translations/en.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('./pathfinders-next/lib/i18n/translations/hi.json', 'utf8'));

function getVal(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return undefined;
  }
  return cur;
}

const missingKeys = [
  'trailhead.badge',
  'trailhead.createProfile',
  'trailhead.loginAccount',
  'footer.colProduct',
  'footer.colCompany',
  'footer.colLegal',
  'footer.tagline',
  'footer.languageLabel',
  'auth.rememberMe',
  'auth.loginButton',
  'auth.noAccount',
  'auth.createOne',
  'auth.orChooseRole',
  'auth.studentRole',
  'auth.parentRole',
  'auth.switcherRole',
  'auth.roleLabel',
  'auth.backBtn',
  'auth.alreadyAccount',
  'auth.signInLink',
  'auth.consentRequired',
  'auth.termsRequired',
  'switcher.switchPrompt',
  'switcher.current',
  'careerCard.availableEnglishOnly',
  'careerCard.savedToList',
  'careerCard.roadmapUnlocked',
  'careerCard.topInterestsMatch'
];

missingKeys.forEach(k => {
  console.log(k + ' => EN: ' + getVal(en, k) + ' | HI: ' + getVal(hi, k));
});

