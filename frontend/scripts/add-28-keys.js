const fs = require('fs');
const path = require('path');

const EXTRA_28 = {
  mr: {
    trailhead: {
      badge: "आजच तुमचा प्रवास सुरू करा",
      createProfile: "तुमचे मोफत प्रोफाइल तयार करा",
      loginAccount: "खात्यामध्ये लॉग इन करा"
    },
    footer: {
      colProduct: "उत्पादन",
      colCompany: "कंपनी",
      colLegal: "कायदेशीर",
      tagline: "सर्वत्र विद्यार्थ्यांसाठी आणि व्यावसायिकांसाठी समर्पित.",
      languageLabel: "भाषा निवडा"
    },
    auth: {
      rememberMe: "या ब्राउझरवर मला लक्षात ठेवा",
      loginButton: "खात्यात साइन इन करा",
      noAccount: "अद्याप खाते नाही का?",
      createOne: "मोफत प्रोफाइल तयार करा",
      orChooseRole: "किंवा चाचणी भूमिकेद्वारे तपासा:",
      studentRole: "विद्यार्थी",
      parentRole: "पालक",
      switcherRole: "करिअर बदल",
      roleLabel: "तुमची भूमिका निवडा",
      backBtn: "मागे जा",
      alreadyAccount: "आधीच खाते आहे का?",
      signInLink: "येथे साइन इन करा",
      consentRequired: "पुढे जाण्यासाठी डेटा प्रक्रियेची संमती आवश्यक आहे.",
      termsRequired: "प्रोफाइल तयार करण्यासाठी सेवा अटी स्वीकारणे अनिवार्य आहे."
    },
    switcher: {
      switchPrompt: "तुमची भाषा निवडा",
      current: "सध्याची"
    },
    careerCard: {
      availableEnglishOnly: "केवळ इंग्रजीमध्ये उपलब्ध",
      savedToList: "यादीत जतन केले",
      roadmapUnlocked: "रोडमॅप अनलॉक केला",
      topInterestsMatch: "तुमच्या प्रमुख आवडी: {traits} या करिअर मार्गाशी जुळतात"
    }
  },

  gu: {
    trailhead: {
      badge: "આજે જ તમારી યાત્રા શરૂ કરો",
      createProfile: "તમારી મફત પ્રોફાઇલ બનાવો",
      loginAccount: "ખાતામાં લૉગ ઇન કરો"
    },
    footer: {
      colProduct: "પ્રોડક્ટ",
      colCompany: "કંપની",
      colLegal: "કાનૂની",
      tagline: "દરેક જગ્યાએ વિદ્યાર્થીઓ અને વ્યાવસાયિકો માટે સમર્પિત.",
      languageLabel: "ભાષા પસંદ કરો"
    },
    auth: {
      rememberMe: "આ બ્રાઉઝર પર મને યાદ રાખો",
      loginButton: "ખાતામાં સાઇન ઇન કરો",
      noAccount: "હજી સુધી ખાતું નથી?",
      createOne: "મફત પ્રોફાઇલ બનાવો",
      orChooseRole: "અથવા ટેસ્ટ ભૂમિકા દ્વારા અજમાવો:",
      studentRole: "વિદ્યાર્થી",
      parentRole: "વાલી",
      switcherRole: "કારકિર્દી સ્વિચર",
      roleLabel: "તમારી ભૂમિકા પસંદ કરો",
      backBtn: "પાછા જાઓ",
      alreadyAccount: "પહેલેથી ખાતું છે?",
      signInLink: "અહીં સાઇન ઇન કરો",
      consentRequired: "આગળ વધવા માટે ડેટા પ્રક્રિયા સંમતિ જરૂરી છે.",
      termsRequired: "પ્રોફાઇલ બનાવવા માટે સેવાની શરતો સ્વીકારવી અનિવાર્ય છે."
    },
    switcher: {
      switchPrompt: "તમારી ભાષા પસંદ કરો",
      current: "વર્તમાન"
    },
    careerCard: {
      availableEnglishOnly: "માત્ર અંગ્રેજીમાં ઉપલબ્ધ",
      savedToList: "યાદીમાં સાચવેલ",
      roadmapUnlocked: "રોડમેપ અનલૉક કર્યો",
      topInterestsMatch: "તમારી મુખ્ય રુચિઓ: {traits} આ માર્ગ સાથે મેળ ખાય છે"
    }
  },

  ur: {
    trailhead: {
      badge: "آج ہی اپنا سفر شروع کریں",
      createProfile: "اپنا مفت پروفائل بنائیں",
      loginAccount: "اکاؤنٹ میں لاگ ان کریں"
    },
    footer: {
      colProduct: "پروڈکٹ",
      colCompany: "کمپنی",
      colLegal: "قانونی",
      tagline: "تمام طلباء اور کام کرنے والے پیشہ ور افراد کے لیے وقف۔",
      languageLabel: "زبان منتخب کریں"
    },
    auth: {
      rememberMe: "اس براؤزر پر مجھے یاد رکھیں",
      loginButton: "اکاؤنٹ میں سائن ان کریں",
      noAccount: "کیا ابھی تک اکاؤنٹ نہیں ہے؟",
      createOne: "مفت پروفائل بنائیں",
      orChooseRole: "یا ٹیسٹ کردار سے آزمائیں:",
      studentRole: "طالب علم",
      parentRole: "والدین",
      switcherRole: "کیریئر سوئچر",
      roleLabel: "اپنا کردار منتخب کریں",
      backBtn: "پیچھے جائیں",
      alreadyAccount: "کیا پہلے سے اکاؤنٹ ہے؟",
      signInLink: "یہاں سائن ان کریں",
      consentRequired: "آگے بڑھنے کے لیے ڈیٹا پروسیسنگ کی رضامندی ضروری ہے۔",
      termsRequired: "پروفائل بنانے کے لیے سروس کی شرائط قبول کرنا لازمی ہے۔"
    },
    switcher: {
      switchPrompt: "اپنی زبان منتخب کریں",
      current: "موجودہ"
    },
    careerCard: {
      availableEnglishOnly: "صرف انگریزی میں دستیاب ہے",
      savedToList: "فہرست میں محفوظ کیا گیا",
      roadmapUnlocked: "روڈ میپ ان لاک ہو گیا",
      topInterestsMatch: "آپ کے بنیادی رجحانات: {traits} اس راستے سے مطابقت رکھتے ہیں"
    }
  },

  kn: {
    trailhead: {
      badge: "ಇಂದೇ ನಿಮ್ಮ ಪಯಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ",
      createProfile: "ನಿಮ್ಮ ಉಚಿತ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ",
      loginAccount: "ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ"
    },
    footer: {
      colProduct: "ಉತ್ಪನ್ನ",
      colCompany: "ಸಂಸ್ಥೆ",
      colLegal: "ಕಾನೂನು ಮಾಹಿತಿ",
      tagline: "ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಉದ್ಯೋಗಿಗಳಿಗೆ ಸಮರ್ಪಿತ.",
      languageLabel: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ"
    },
    auth: {
      rememberMe: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ನನ್ನನ್ನು ನೆನಪಿನಲ್ಲಿಡಿ",
      loginButton: "ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
      noAccount: "ಇನ್ನೂ ಖಾತೆ ಇಲ್ಲವೇ?",
      createOne: "ಉಚಿತ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ",
      orChooseRole: "ಅಥವಾ ಪರೀಕ್ಷಾ ಪಾತ್ರವನ್ನು ಪ್ರಯತ್ನಿಸಿ:",
      studentRole: "ವಿದ್ಯಾರ್ಥಿ",
      parentRole: "ಪೋಷಕರು",
      switcherRole: "ವೃತ್ತಿ ಬದಲಾವಣೆ",
      roleLabel: "ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      backBtn: "ಹಿಂದಕ್ಕೆ",
      alreadyAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
      signInLink: "ಇಲ್ಲಿ ಸೈನ್ ಇನ್ ಮಾಡಿ",
      consentRequired: "ಮುಂದುವರಿಯಲು ಡೇಟಾ ಪ್ರಕ್ರಿಯೆ ಒಪ್ಪಿಗೆ ಅಗತ್ಯವಿದೆ.",
      termsRequired: "ಪ್ರೊಫೈಲ್ ರಚಿಸಲು ಸೇವಾ ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ."
    },
    switcher: {
      switchPrompt: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      current: "ಪ್ರಸ್ತುತ"
    },
    careerCard: {
      availableEnglishOnly: "ಕೇವಲ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ",
      savedToList: "ಪಟ್ಟಿಗೆ ಉಳಿಸಲಾಗಿದೆ",
      roadmapUnlocked: "ರೋಡ್‌ಮ್ಯಾಪ್ ಅನ್‌ಲಾಕ್ ಮಾಡಲಾಗಿದೆ",
      topInterestsMatch: "ನಿಮ್ಮ ಪ್ರಮುಖ ಆಸಕ್ತಿಗಳು: {traits} ಈ ಮಾರ್ಗಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ"
    }
  },

  ml: {
    trailhead: {
      badge: "ഇന്നുതന്നെ നിങ്ങളുടെ യാത്ര ആരംഭിക്കൂ",
      createProfile: "സൗജന്യ പ്രൊഫൈൽ സൃഷ്ടിക്കുക",
      loginAccount: "അക്കൗണ്ടിലേക്ക് ലോഗിൻ ചെയ്യുക"
    },
    footer: {
      colProduct: "ഉൽപ്പന്നം",
      colCompany: "സ്ഥാപനം",
      colLegal: "നിയമപരം",
      tagline: "വിദ്യാർത്ഥികൾക്കും പ്രൊഫഷണലുകൾക്കുമായി സമർപ്പിച്ചത്.",
      languageLabel: "ഭാഷ തിരഞ്ഞെടുക്കുക"
    },
    auth: {
      rememberMe: "ഈ ബ്രൗസറിൽ എന്നെ ഓർമ്മിക്കുക",
      loginButton: "അക്കൗണ്ടിലേക്ക് സൈൻ ഇൻ ചെയ്യുക",
      noAccount: "ഇതുവരെ അക്കൗണ്ട് ഇല്ലേ?",
      createOne: "സൗജന്യ പ്രൊഫൈൽ ഉണ്ടാക്കുക",
      orChooseRole: "അല്ലെങ്കിൽ ഡെമോ റോൾ പരീക്ഷിക്കുക:",
      studentRole: "വിദ്യാർത്ഥി",
      parentRole: "രക്ഷിതാവ്",
      switcherRole: "കരിയർ സ്വിച്ചർ",
      roleLabel: "നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക",
      backBtn: "പിന്നോട്ട്",
      alreadyAccount: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
      signInLink: "ഇവിടെ സൈൻ ഇൻ ചെയ്യുക",
      consentRequired: "തുടരുന്നതിന് ഡാറ്റ പ്രോസസ്സിംഗ് സമ്മതം ആവശ്യമാണ്.",
      termsRequired: "പ്രൊഫൈൽ നിർമ്മിക്കുന്നതിന് സേവന നിബന്ധനകൾ അംഗീകരിക്കേണ്ടത് നിർബന്ധമാണ്."
    },
    switcher: {
      switchPrompt: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
      current: "നിലവിലെ ഭാഷ"
    },
    careerCard: {
      availableEnglishOnly: "ഇംഗ്ലീഷിൽ മാത്രം ലഭ്യമാണ്",
      savedToList: "ലിസ്റ്റിൽ സേവ് ചെയ്തു",
      roadmapUnlocked: "റോഡ്മാപ്പ് അൺലോക്ക് ചെയ്തു",
      topInterestsMatch: "നിങ്ങളുടെ പ്രധാന താൽപ്പര്യങ്ങൾ: {traits} ഈ കരിയർ പാതയുമായി പൊരുത്തപ്പെടുന്നു"
    }
  }
};

for (const lang of ['mr', 'gu', 'ur', 'kn', 'ml']) {
  const filePath = path.join(__dirname, `../lib/i18n/translations/${lang}.json`);
  const dict = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const extras = EXTRA_28[lang];

  for (const [sec, keys] of Object.entries(extras)) {
    if (!dict[sec]) dict[sec] = {};
    for (const [k, val] of Object.entries(keys)) {
      dict[sec][k] = val;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`Updated ${lang}.json with 28 extra keys.`);
}

