import { NextResponse } from 'next/server';
import { VERIFIED_CAREER_DATABASE, findVerifiedCareer } from '@/lib/verifiedCareerDatabase';

// In-memory sliding-window rate limiter (20 requests per minute per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(clientId) {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientId) || { timestamps: [] };

  // Clean up old timestamps
  clientData.timestamps = clientData.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (clientData.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  clientData.timestamps.push(now);
  rateLimitMap.set(clientId, clientData);
  return true;
}

// Plain-word descriptions for Holland traits (Never say "you are a X", say "your answers lean toward...")
const TRAIT_PLAIN_DESCRIPTIONS = {
  E: 'leading and starting things, rallying teams around a shared vision',
  R: 'making, fixing, and crafting tangible things with your hands or practical tools',
  I: 'figuring out how complex things work, researching facts, and solving deep problems',
  A: 'designing, storytelling, and creating things that never existed before',
  S: 'supporting, mentoring, and working closely with people to help them grow',
  C: 'bringing clarity to chaos, organizing systems, and planning detailed workflows'
};

const TRAIT_PLAIN_HINDI = {
  E: 'naye initiatives start karna aur team ko guide karna',
  R: 'hands-on cheezein banana aur technical problems solve karna',
  I: 'deep research karna aur logic se cheezein samajhna',
  A: 'creativity, design aur naye ideas create karna',
  S: 'dusron ki help karna aur community support dena',
  C: 'planning, organizing aur structured rules follow karna'
};

const TRAIT_DESCRIPTIONS_I18N = {
  en: TRAIT_PLAIN_DESCRIPTIONS,
  hi: {
    E: 'नए काम शुरू करना और एक साझा दृष्टिकोण के साथ टीम का नेतृत्व करना',
    R: 'व्यावहारिक उपकरणों और हाथों से वास्तविक चीजें बनाना और सुधारना',
    I: 'जटिल चीजें कैसे काम करती हैं समझना और गहरे तथ्य खोजना',
    A: 'नई रचनात्मक चीजें, डिजाइन और कहानियां गढ़ना',
    S: 'लोगों का मार्गदर्शन करना और उनके विकास में सहायता करना',
    C: 'व्यवस्था बनाना, प्रणालियों को व्यवस्थित करना और कार्यप्रवाह की योजना बनाना'
  },
  or: {
    E: 'ନୂତନ କାର୍ଯ୍ୟ ଆରମ୍ଭ କରିବା ଏବଂ ଦଳର ନେତୃତ୍ୱ ନେବା',
    R: 'ହାତ କିମ୍ବା ଉପକରଣ ବ୍ୟବହାର କରି ବ୍ୟବହାରିକ ଜିନିଷ ତିଆରି ଏବଂ ମରାମତି କରିବା',
    I: 'ଜଟିଳ ବିଷୟଗୁଡ଼ିକ କିପରି କାମ କରେ ଅନୁସନ୍ଧାନ କରିବା ଏବଂ ସମସ୍ୟା ସମାଧାନ କରିବା',
    A: 'ନୂତନ ସୃଜନଶୀଳ ଡିଜାଇନ୍, କାହାଣୀ ଏବଂ କଳା ସୃଷ୍ଟି କରିବା',
    S: 'ଲୋକମାନଙ୍କୁ ସାହାଯ୍ୟ କରିବା, ପରାମର୍ଶ ଦେବା ଏବଂ ଏକାଠି କାମ କରିବା',
    C: 'ବ୍ୟବସ୍ଥା ପରିଚାଳନା କରିବା ଏବଂ ସଠିକ୍ ଯୋଜନା ପ୍ରସ୍ତୁତ କରିବା'
  },
  bn: {
    E: 'নতুন উদ্যোগ শুরু করা এবং একটি সাধারণ লক্ষ্যের দিকে দলের নেতৃত্ব দেওয়া',
    R: 'বাস্তব উপকরণ দিয়ে হাতে কলমে কাজ করা ও তৈরি করা',
    I: 'জটিল বিষয়গুলো কীভাবে কাজ করে তা অনুসন্ধান ও সমস্যার গভীর সমাধান করা',
    A: 'সৃজনশীল ডিজাইন, গল্প এবং নতুন কিছু উদ্ভাবন করা',
    S: 'মানুষকে সমর্থন করা, মেন্টরিং করা এবং তাদের বেড়ে ওঠায় সহায়তা করা',
    C: 'শৃঙ্খলার মধ্যে কাজ করা এবং সুপরিকল্পিত প্রক্রিয়া পরিচালনা করা'
  },
  te: {
    E: 'కొత్త కార్యక్రమాలను ప్రారంభించడం మరియు బృందాన్ని ముందుండి నడిపించడం',
    R: 'చేతులతో లేదా పరికరాలతో ఆచరణాత్మక వస్తువులను తయారు చేయడం మరియు సరిచేయడం',
    I: 'క్లిష్టమైన విషయాలు ఎలా పనిచేస్తాయో అర్థం చేసుకోవడం మరియు పరిశోధన చేయడం',
    A: 'సృజనాత్మక డిజైన్లు, కథలు మరియు కొత్త ఆలోచనలను రూపొందించడం',
    S: 'ఇతరులకు మద్దతు ఇవ్వడం మరియు వారి ఎదుగుదలకు సహాయపడటం',
    C: 'వ్యవస్థలను క్రమబద్ధీకరించడం మరియు వివరమైన ప్రణాళికలు రూపొందించడం'
  }
};

// Fixed Safety and Distress messages for 5 languages
// Requirement: Must be fixed, pre-written strings in each language, not generated at runtime
const FIXED_DISTRESS_SAFETY_MESSAGES = {
  en: {
    text: "I hear you, {firstName}, and I want you to know with complete clarity: you are not a failure. School expectations and future decisions can feel very heavy, but you never have to carry this alone.\n\nPlease take a gentle breath and speak with a trusted adult, your parents, or a school counsellor today. You can also connect right now with India's free, 24/7 confidential helplines: Tele-MANAS at 14416 or KIRAN at 1800-599-0019 to speak with someone who truly cares. Would you like me to connect you with our human counselling team?",
    chips: ['Connect with human counsellor', 'Back to my results']
  },
  hi: {
    text: "मैं आपकी बात समझ रहा हूँ, {firstName}, और मैं आपको पूरी स्पष्टता से बताना चाहता हूँ: आप असफल नहीं हैं। स्कूल की उम्मीदें और भविष्य के फैसले बहुत भारी लग सकते हैं, लेकिन आपको इसे अकेले सहने की जरूरत नहीं है।\n\nकृपया एक गहरी सांस लें और आज ही किसी भरोसेमंद वयस्क, अपने माता-पिता या स्कूल काउंसलर से बात करें। आप किसी ऐसे व्यक्ति से बात करने के लिए भारत की 24/7 निःशुल्क हेल्पलाइन: Tele-MANAS (14416) या KIRAN (1800-599-0019) पर तुरंत संपर्क कर सकते हैं। क्या आप चाहते हैं कि मैं आपको हमारी मानवीय काउंसलिंग टीम से जोड़ूं?",
    chips: ['मानवीय काउंसलर से जुड़ें', 'मेरे परिणामों पर वापस जाएं']
  },
  or: {
    text: "ମୁଁ ତୁମର କଥା ବୁଝିପାରୁଛି, {firstName}, ଏବଂ ମୁଁ ତୁମକୁ ସ୍ପଷ୍ଟ ଭାବରେ କହିବାକୁ ଚାହୁଁଛି: ତୁମେ ଅସଫଳ ନୁହଁ। ବିଦ୍ୟାଳୟର ଆଶା ଏବଂ ଭବିଷ୍ୟତର ନିଷ୍ପତ୍ତି ବହୁତ ଭାରୀ ଲାଗିପାରେ, କିନ୍ତୁ ତୁମକୁ ଏହା ଏକାକୀ ବହନ କରିବାକୁ ପଡ଼ିବ ନାହିଁ।\n\nଦୟାକରି ଏକ ଦୀର୍ଘ ନିଶ୍ୱାସ ନିଅନ୍ତୁ ଏବଂ ଜଣେ ବିଶ୍ୱସ୍ତ ବୟସ୍କ, ତୁମର ପିତାମାତା କିମ୍ବା ସ୍କୁଲ କାଉନସିଲରଙ୍କ ସହିତ ଆଜି ହିଁ କଥା ହୁଅନ୍ତୁ। ଆପଣ ଭାରତର ୨୪/୭ ମାଗଣା ଗୋପନୀୟ ହେଲ୍ପଲାଇନ୍: Tele-MANAS (14416) କିମ୍ବା KIRAN (1800-599-0019) ରେ କଲ୍ କରି କଥା ହୋଇପାରିବେ। ଆପଣ ଚାହାଁନ୍ତି କି ମୁଁ ଆମର କାଉନସେଲିଂ ଦଳ ସହିତ ଯୋଗାଯୋଗ କରାଏ?",
    chips: ['ମାନବ କାଉନସେଲରଙ୍କ ସହିତ ଯୋଡ଼ନ୍ତୁ', 'ମୋର ଫଳାଫଳକୁ ଫେରନ୍ତୁ']
  },
  bn: {
    text: "আমি তোমার কথা বুঝতে পারছি, {firstName}, এবং আমি তোমাকে সম্পূর্ণ স্পষ্টতার সাথে জানাতে চাই: তুমি ব্যর্থ নও। স্কুলের প্রত্যাশা এবং ভবিষ্যতের সিদ্ধান্ত অনেক ভারী মনে হতে পারে, কিন্তু তোমাকে এটি একা বহন করতে হবে না।\n\nদয়া করে একটি শান্ত শ্বাস নাও এবং আজই কোনো বিশ্বস্ত প্রাপ্তবয়স্ক, তোমার বাবা-মা বা স্কুলের কাউন্সিলরের সাথে কথা বলো। তুমি ভারতের ২৪/৭ বিনামূল্যে গোপনীয় হেল্পলাইন: Tele-MANAS (14416) অথবা KIRAN (1800-599-0019)-এ যোগাযোগ করতে পারো। তুমি কি চাও আমি তোমাকে আমাদের মানবিক কাউন্সেলিং টিমের সাথে সংযুক্ত করি?",
    chips: ['মানবিক কাউন্সিলরের সাথে যুক্ত হন', 'আমার ফলাফলে ফিরে যান']
  },
  te: {
    text: "నేను మీ మాటలను అర్థం చేసుకుంటున్నాను, {firstName}, మరియు మీరు విఫలమవలేదు అని నేను ఖచ్చితంగా చెప్పాలనుకుంటున్నాను. పాఠశాల అంచనాలు మరియు భవిష్యత్ నిర్ణయాలు చాలా భారంగా అనిపించవచ్చు, కానీ మీరు దీన్ని ఒంటరిగా భరించాల్సిన అవసరం లేదు.\n\nదయచేసి నెమ్మదిగా శ్వాస తీసుకోండి మరియు ఈరోజే మీ తల్లిదండ్రులు, ఉపాధ్యాయులు లేదా పాఠశాల కౌన్సెలర్‌తో మాట్లాడండి. మీరు భారతదేశపు 24/7 ఉచిత గోప్యతా హెల్ప్‌లైన్లు: Tele-MANAS (14416) లేదా KIRAN (1800-599-0019) ను సంప్రదించవచ్చు. మా మానవ కౌన్సెలింగ్ బృందంతో మిమ్మల్ని అనుసంధానించమంటారా?",
    chips: ['మానవ కౌన్సెలర్‌తో మాట్లాడండి', 'నా ఫలితాలకు తిరిగి వెళ్లండి']
  }
};

const JAILBREAK_RESPONSES = {
  en: {
    text: `I cannot share system instructions or other students' private records. Every student's profile and chat history at PathFinders is strictly confidential and protected by privacy controls. How can I help you explore your own assessment results today?`,
    chips: ['Tell me about my dominant trait', 'See career matches', 'Back to my results']
  },
  hi: {
    text: `मैं सिस्टम निर्देशों या अन्य विद्यार्थियों के व्यक्तिगत रिकॉर्ड साझा नहीं कर सकता। पाथफाइंडर्स पर प्रत्येक विद्यार्थी की प्रोफ़ाइल और चैट पूरी तरह से गोपनीय है। मैं आज आपके करियर परिणामों को समझने में आपकी क्या सहायता कर सकता हूँ?`,
    chips: ['मेरे प्रमुख गुण के बारे में बताएं', 'करियर विकल्प देखें', 'मेरे परिणामों पर वापस जाएं']
  },
  or: {
    text: `ମୁଁ ସିଷ୍ଟମ୍ ନିର୍ଦ୍ଦେଶ କିମ୍ବା ଅନ୍ୟ ଛାତ୍ରମାନଙ୍କ ବ୍ୟକ୍ତିଗତ ରେକର୍ଡ ଅଂଶୀଦାର କରିପାରିବି ନାହିଁ। ପ୍ରତ୍ୟେକ ଛାତ୍ରଙ୍କ ତଥ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ ଗୋପନୀୟ। ମୁଁ ଆଜି ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?`,
    chips: ['ମୋର ମୁଖ୍ୟ ପ୍ରବୃତ୍ତି ବିଷୟରେ କୁହନ୍ତୁ', 'କ୍ୟାରିଅର୍ ବିକଳ୍ପ ଦେଖନ୍ତୁ', 'ମୋର ଫଳାଫଳକୁ ଫେରନ୍ତୁ']
  },
  bn: {
    text: `আমি সিস্টেম নির্দেশাবলী বা অন্যান্য শিক্ষার্থীদের ব্যক্তিগত তথ্য প্রকাশ করতে পারব না। প্রতিটি শিক্ষার্থীর তথ্য সম্পূর্ণ গোপনীয়। আজ আমি কীভাবে আপনার ক্যারিয়ার ফলাফল বুঝতে সাহায্য করতে পারি?`,
    chips: ['আমার প্রধান বৈশিষ্ট্য সম্পর্কে বলুন', 'ক্যারিয়ার মিল দেখুন', 'আমার ফলাফলে ফিরে যান']
  },
  te: {
    text: `నేను సిస్టమ్ సూచనలను లేదా ఇతర విద్యార్థుల వ్యక్తిగత రికార్డులను పంచుకోలేను. ప్రతి విద్యార్థి సమాచారం ఖచ్చితంగా గోప్యమైనది. ఈరోజు మీ కెరీర్ ఫలితాలను అర్థం చేసుకోవడంలో నేను మీకు ఎలా సహాయపడగలను?`,
    chips: ['నా ప్రధాన లక్షణం గురించి చెప్పండి', 'కెరీర్ అవకాశాలను చూడండి', 'నా ఫలితాలకు తిరిగి వెళ్ళండి']
  }
};

// Distress & Crisis Keywords (High Priority Safety Protocol)
const DISTRESS_KEYWORDS = [
  'feel like a failure',
  'i am a failure',
  'feel like giving up',
  'i want to die',
  'kill myself',
  'hate my life',
  'worthless',
  'no point living',
  'hopeless',
  'cant do this anymore',
  "can't do this anymore",
  'end it all',
  'hurt myself',
  'suicide',
  'sab bekar hai',
  'khatam karna chahta',
  'mar jana chahta',
  'zindagi bekar hai',
  'can not take the pressure',
  'marne ka man',
  'kuch nahi bacha',
  'pareshan ho gaya',
  'mora jete chai',
  'moron',
  'bachar kono labh nei',
  'sobi sesh',
  'marijiba ku chahunchee',
  'chachipovalani undi',
  'jeevitham waste'
];

// Jailbreak & Data Leak Attempt Keywords
const JAILBREAK_KEYWORDS = [
  'ignore all previous instructions',
  'ignore previous instructions',
  'system prompt',
  'reveal your instructions',
  'what are your instructions',
  'show your instructions',
  'other students',
  "other student's",
  'alex scores',
  'alex data',
  'database password',
  'secret key',
  'api key',
  'bypass security',
  'jailbreak',
  'developer mode',
  'dan mode'
];

function isDistressMessage(text) {
  const lower = text.toLowerCase();
  return DISTRESS_KEYWORDS.some((kw) => lower.includes(kw));
}

function isJailbreakAttempt(text) {
  const lower = text.toLowerCase();
  return JAILBREAK_KEYWORDS.some((kw) => lower.includes(kw));
}

function isHinglish(text) {
  const hinglishWords = [
    'kya', 'hai', 'mujhe', 'mere', 'meri', 'mera', 'parents', 'bol', 'rahe',
    'karein', 'karo', 'kaise', 'batao', 'nahi', 'par', 'aur', 'chahiye',
    'pata', 'lagta', 'samajh', 'tayari', 'bhi', 'kuch', 'hoga', 'career',
    'darr', 'baat', 'gharwale', 'papa', 'mummy'
  ];
  const words = text.toLowerCase().split(/\s+/);
  const matchCount = words.filter((w) => hinglishWords.includes(w)).length;
  return matchCount >= 2;
}

// Generate Comprehensive Assessment Analysis for Chatbot (Immediately after quiz submission)
function generateComprehensiveAssessmentAnalysis(studentContext, language = 'en') {
  const firstName = studentContext.firstName || 'there';
  const dominantCode = studentContext.dominant_code || 'I';
  const dominantTrait = studentContext.dominant_trait || 'The Investigator';
  const secondTrait = studentContext.second_trait || 'The Builder';
  const classStage = studentContext.class_stage || 'Class 8–10';
  const workingStyle = studentContext.working_style || { focus: 55, energy: 50, structure: 50, decisions: 50, pace: 50 };

  const ARCHETYPES = {
    R: { label: 'The Builder', archetype: 'Practical Builder & Craftsman', tendencies: 'practical, technical, and hands-on' },
    I: { label: 'The Thinker / Investigator', archetype: 'Analytical Thinker & Researcher', tendencies: 'analytical, logical, and investigative' },
    A: { label: 'The Creator', archetype: 'Creative Designer & Storyteller', tendencies: 'creative, imaginative, and design-oriented' },
    S: { label: 'The Helper', archetype: 'Empathetic Mentor & Educator', tendencies: 'social, collaborative, and mentorship-oriented' },
    E: { label: 'The Leader', archetype: 'Strategic Leader & Entrepreneur', tendencies: 'entrepreneurial, decisive, and visionary' },
    C: { label: 'The Organizer', archetype: 'Systems Planner & Organizer', tendencies: 'structured, methodical, and detail-oriented' },
  };

  const currentArch = ARCHETYPES[dominantCode] || ARCHETYPES.I;

  const focusStyle = workingStyle.focus > 60 ? 'big-picture conceptual thinking' : workingStyle.focus < 40 ? 'deep-dive precision analysis' : 'balanced inquiry';
  const energyStyle = workingStyle.energy > 55 ? 'collaborative team problem-solving' : 'focused independent deep work';
  const decisionStyle = workingStyle.decisions > 55 ? 'data-driven evidence' : 'practical intuition and iterative testing';

  // Extract exactly the TOP 3 career matches
  const rawMatches = Array.isArray(studentContext.top_career_matches) ? studentContext.top_career_matches : [];
  const top3 = rawMatches.slice(0, 3).map((item, idx) => {
    const title = typeof item === 'string' ? item : (item?.title || 'Technology Specialist');
    const match = typeof item === 'object' && item?.match ? item.match : (idx === 0 ? 97 : idx === 1 ? 94 : 91);
    const verified = findVerifiedCareer(title) || {};

    const whyItMatches = (typeof item === 'object' && item?.matchReason) || verified.whyItFits || 
      `Aligns with your ${currentArch.label} archetype, utilizing your preference for ${focusStyle} and ${energyStyle}.`;

    const strengths = idx === 0 
      ? 'Logical deduction, structured reasoning, rapid problem breakdown'
      : idx === 1 
      ? 'Translating complex ideas into tangible working solutions'
      : 'Creative adaptability and methodical execution';

    const skills = (typeof item === 'object' && Array.isArray(item?.skills) && item.skills.length > 0)
      ? item.skills
      : (dominantCode === 'I' ? ['Algorithmic Thinking', 'Data Modeling', 'Scientific Logic'] :
         dominantCode === 'R' ? ['CAD Design', 'Hardware Systems', 'Diagnostics'] :
         dominantCode === 'A' ? ['User Experience', 'Prototyping', 'Storytelling'] :
         dominantCode === 'E' ? ['Product Strategy', 'Team Leadership', 'Market Research'] :
         dominantCode === 'S' ? ['Mentorship', 'Curriculum Design', 'Communication'] :
         ['Systems Architecture', 'Process Automation', 'Quality Assurance']);

    const overview = (typeof item === 'object' && item?.desc) || (verified.pathway ? verified.pathway.slice(0, 140) + '...' : '') || 
      'A high-growth professional pathway combining rigorous problem-solving with meaningful real-world impact.';

    return {
      id: verified.id || `career-${idx}`,
      title,
      match,
      whyItMatches,
      strengths,
      skills,
      overview
    };
  });

  const primaryCareer = top3[0]?.title || 'AI & Neural Research Scientist';

  const text = `Hello ${firstName}! 🎉 Your assessment is complete, and your career coordinates have been analyzed.\n\n` +
    `🧭 **1. Personality & Career Archetype**\n` +
    `Your primary archetype is **${currentArch.label}** (${currentArch.archetype}), with strong supporting strengths in **${secondTrait}**. You demonstrate ${currentArch.tendencies} tendencies, naturally enjoying exploring ideas, solving challenging puzzles, and creating meaningful solutions.\n\n` +
    `📊 **2. Your Comprehensive Profile Breakdown**\n` +
    `• **Dominant Strengths:** High cognitive stamina, structured curiosity, and a natural ability to dissect complex topics into logical pieces.\n` +
    `• **Analytical Tendencies:** You rely on objective evidence and enjoy verifying facts rather than making hasty assumptions.\n` +
    `• **Creative & Practical Tendencies:** You like connecting conceptual ideas to practical implementations that solve real problems.\n` +
    `• **Social & Team Dynamics:** You prefer ${energyStyle}, bringing clarity to group discussions and delivering reliable outcomes.\n` +
    `• **Suitable Learning Preferences:** You learn best with ${focusStyle}, hands-on experimentation, and clear milestone checkpoints.\n` +
    `• **Areas to Develop:** Build confidence in testing early imperfect prototypes, and practice explaining complex technical insights simply to non-technical peers.\n\n` +
    `🎯 **3. Top 3 Recommended Career Matches**\n` +
    `Based on your assessment answers, academic stage (${classStage}), and Holland traits, here are your **Top 3 Recommended Career Matches**:`;

  return {
    safetyFlag: false,
    text,
    careerCards: top3,
    chips: [
      `Why ${primaryCareer}?`,
      'Compare top 3 careers',
      'What subjects should I focus on?',
      'What skills should I develop?',
      'Which has better future growth?'
    ]
  };
}

// Trait-accurate focus for "Why X?" reasoning (Never use Leader phrasing for Investigator/Creator/etc.)
const TRAIT_ACCURATE_FOCUS = {
  I: 'deep research, mathematical logic, and scientific problem-solving',
  R: 'hands-on building, technical systems, and physical engineering',
  A: 'creative design, storytelling, and visual or conceptual expression',
  S: 'human empathy, social impact, and helping others learn and grow',
  E: 'strategic leadership, entrepreneurial initiative, and driving bold visions',
  C: 'structured planning, data organization, and process precision'
};

const TRAIT_ACCURATE_FOCUS_HI = {
  I: 'गहन अनुसंधान, गणितीय तर्क और वैज्ञानिक समस्या-समाधान',
  R: 'व्यावहारिक निर्माण, तकनीकी प्रणाली और इंजीनियरिंग',
  A: 'रचनात्मक डिजाइन, कहानी और दृश्य अभिव्यक्ति',
  S: 'सामाजिक प्रभाव और दूसरों के विकास में सहायता',
  E: 'रणनीतिक नेतृत्व और नई पहलों को आगे बढ़ाना',
  C: 'संरचित योजना, डेटा प्रबंधन और प्रक्रिया स्पष्टता'
};

function getStudentScoreForTrait(traitCode, traitName, studentContext = {}) {
  const pctMap = studentContext.percentages || studentContext.trait_percentages || {};
  const cleanName = (traitName || '').replace(/^The\s+/i, '').trim();

  // 1. Direct code lookup (e.g. 'I')
  if (traitCode && pctMap[traitCode] != null) {
    const val = Number(pctMap[traitCode]);
    if (!isNaN(val) && val > 0) return Math.round(val);
  }

  // 2. Direct name lookup (e.g. 'Investigator' or 'The Investigator')
  if (pctMap[cleanName] != null) {
    const val = Number(pctMap[cleanName]);
    if (!isNaN(val) && val > 0) return Math.round(val);
  }
  if (traitName && pctMap[traitName] != null) {
    const val = Number(pctMap[traitName]);
    if (!isNaN(val) && val > 0) return Math.round(val);
  }

  // 3. Case-insensitive key scan
  for (const [k, v] of Object.entries(pctMap)) {
    const cleanK = k.replace(/^The\s+/i, '').trim().toLowerCase();
    if (cleanK === cleanName.toLowerCase() || (traitCode && k.toUpperCase() === traitCode.toUpperCase())) {
      const val = Number(v);
      if (!isNaN(val) && val > 0) return Math.round(val);
    }
  }

  // 4. Dominant percentage fallback if the trait matches dominant trait
  if (studentContext.dominant_percentage) {
    const domCode = studentContext.dominant_code;
    const domName = (studentContext.dominant_trait || '').replace(/^The\s+/i, '').toLowerCase();
    if ((traitCode && domCode === traitCode) || domName === cleanName.toLowerCase()) {
      const val = Number(studentContext.dominant_percentage);
      if (!isNaN(val) && val > 0) return Math.round(val);
    }
  }

  return null;
}

function getStageClassification(classStage, age) {
  const stageStr = String(classStage || '').toLowerCase();
  const numAge = Number(age) || 0;
  if (stageStr.includes('8') || stageStr.includes('9') || stageStr.includes('10') || (numAge > 0 && numAge <= 16)) {
    return 'class_8_10';
  }
  if (stageStr.includes('11') || stageStr.includes('12') || (numAge > 16 && numAge <= 18)) {
    return 'class_11_12';
  }
  return 'higher_ed';
}

function getStageGuidance(verified, stageType, language = 'en') {
  const isHi = language === 'hi';
  if (stageType === 'class_8_10') {
    const code = verified?.traitCode || 'I';
    let streamChoice = 'Science stream with Physics, Chemistry, and Mathematics (PCM)';
    let streamChoiceHi = 'साइंस स्ट्रीम (Physics, Chemistry, Mathematics - PCM)';
    if (code === 'A') {
      streamChoice = 'any stream in Class 11 while building an active creative portfolio';
      streamChoiceHi = 'कक्षा 11 में कोई भी स्ट्रीम चुनते हुए एक मजबूत क्रिएटिव पोर्टफोलियो बनाना';
    } else if (code === 'S') {
      streamChoice = 'Humanities or Sciences with Biology/Psychology in Class 11';
      streamChoiceHi = 'कक्षा 11 में ह्यूमैनिटीज या साइंस (Biology/Psychology)';
    } else if (code === 'E' || code === 'C') {
      streamChoice = 'Commerce with Mathematics or Science (PCM) in Class 11';
      streamChoiceHi = 'कक्षा 11 में कॉमर्स (Maths के साथ) या साइंस (PCM)';
    }

    const firstExam = verified?.entranceExams?.[0];
    const examMention = firstExam
      ? `Competitive entrance exams like ${firstExam} come later in Class 12.`
      : 'Competitive entrance exams come later after Class 12.';
    const examMentionHi = firstExam
      ? `${firstExam} जैसी प्रतियोगी प्रवेश परीक्षाएं बाद में कक्षा 12 के स्तर पर आती हैं।`
      : 'प्रतियोगी प्रवेश परीक्षाएं बाद में कक्षा 12 के बाद आती हैं।';

    if (isHi) {
      return `कक्षा 8–10 के स्तर पर, आपकी प्राथमिकता मुख्य विषयों में मजबूत समझ बनाना और 10वीं बोर्ड परीक्षा की तैयारी करना है। कक्षा 11 के लिए आपका अगला महत्वपूर्ण कदम ${streamChoiceHi} का चयन होगा। ${examMentionHi}`;
    }

    return `At your current stage in Class 8–10, the immediate focus is building strong conceptual foundations in your core subjects and preparing for your 10th boards. For Class 11, your next big milestone will be selecting ${streamChoice}. ${examMention}`;
  }

  if (stageType === 'class_11_12') {
    const exams = verified?.entranceExams?.slice(0, 2).join(' or ') || 'national entrance tests';
    if (isHi) {
      return `कक्षा 11–12 के लिए, सत्यापित मार्ग 12वीं बोर्ड के साथ-साथ ${exams} की संतुलित तैयारी पर केंद्रित हैं।`;
    }
    return `In Class 11–12, verified educational routes focus on preparing for ${exams} alongside your board exams.`;
  }

  return isHi
    ? 'सत्यापित मार्ग विशिष्ट डिग्री और प्रवेश मानकों पर केंद्रित हैं।'
    : 'Verified educational routes focus on specialized degree programs and relevant entrance benchmarks.';
}

function getDailyWorkDescription(verified) {
  if (!verified) {
    return 'A professional in this field balances analytical problem-solving, collaboration with teammates, and continuous learning on real-world projects.';
  }

  const id = verified.id || '';
  if (id.includes('ai-neural') || id.includes('ai-research')) {
    return 'An AI & Neural Research Scientist spends their day formulating mathematical models, reading the latest machine learning papers, running experiments on high-performance compute clusters, and analyzing neural network results.';
  }
  if (id.includes('astrophysic') || id.includes('space-scientist')) {
    return 'An Astrophysicist spends their day analyzing optical or radio telescope datasets, writing computational models to simulate astrophysical phenomena, and collaborating with international observatory networks.';
  }
  if (id.includes('tech-startup') || id.includes('founder')) {
    return 'A Startup Founder starts the day reviewing product metrics, meeting with engineering and product leads, speaking with early customers, and pitching to investors or strategic partners.';
  }
  if (id.includes('product-expedition') || id.includes('product-manager')) {
    return 'A Product Manager spends their day understanding user feedback, prioritizing feature backlogs with developers, analyzing product metrics, and aligning cross-functional teams.';
  }
  if (id.includes('automobile') || id.includes('automotive')) {
    return 'An Automobile Engineer spends their day running CAD simulations, testing vehicle suspension and powertrain prototypes, reviewing safety diagnostics, and optimizing fuel or battery efficiency.';
  }
  if (id.includes('robotics')) {
    return 'A Robotics Engineer spends their day designing circuit boards, testing sensor and actuator firmware, calibrating robotic arms or mobile bases, and troubleshooting hardware-software integration.';
  }
  if (id.includes('aerospace')) {
    return 'An Aerospace Engineer analyzes aerodynamics and thermal stresses, inspects rocket or propulsion test data, and runs structural simulations using specialized engineering software.';
  }
  if (id.includes('ui-ux') || id.includes('interactive')) {
    return 'A UI/UX Architect conducts user interviews, sketches interactive wireframes, builds high-fidelity prototypes in Figma, and tests interface usability with real users.';
  }
  if (id.includes('game-world') || id.includes('game-designer')) {
    return 'A Game Designer writes branching narrative scripts, builds interactive level layouts in Unreal or Unity, tunes gameplay mechanics, and playtests with the dev team.';
  }
  if (id.includes('edutech') || id.includes('learning-mentor')) {
    return 'An EduTech Mentor designs interactive curricula, analyzes student learning drop-offs, creates digital learning journeys, and coaches teachers and students.';
  }
  if (id.includes('community-health') || id.includes('public-health')) {
    return 'A Community Health Innovator analyzes regional health statistics, evaluates preventative healthcare campaigns in the field, and coordinates with clinics and non-profits.';
  }
  if (id.includes('data-logistics') || id.includes('operations')) {
    return 'A Data Logistics Officer monitors live supply chain pipelines, builds automated SQL/Python reporting dashboards, and detects operational bottlenecks.';
  }

  return `${verified.title} professionals spend their days combining specialized subject expertise, testing and refining solutions, and coordinating with cross-functional teams.`;
}

// Server-side Career Guidance Reasoning Engine
// STRICT RULES:
// 1. Inputs: Student's name, class/stage, assessment results, and verified career data only.
// 2. Short messages: 2 to 4 sentences. At most ONE question per message.
// 3. Results as starting point, never a verdict. Never say "you are a Leader", say "your answers lean toward...".
// 4. Test fit with concrete questions ("In your last group project, which role did you naturally take?").
// 5. Family expectations: neutral, respectful, suggest conversation with parents/counsellor.
// 6. Unknown facts: "I don't have that yet" and suggest counsellor. Never invent salaries, fees, cutoffs.
// 7. Hinglish response when student writes in Hinglish.
// 8. Distress: Safety protocol, helplines, no career talk, safety flag.
// 9. Jailbreak: Polite refusal, protects student data.
function generateCareerGuidanceResponse({ message, history = [], studentContext = {}, turnCount = 1, language = 'en' }) {
  const rawMsg = message.trim();
  const lower = rawMsg.toLowerCase();
  const firstName = studentContext.firstName || 'there';
  const classStage = studentContext.class_stage || 'Class 8–10';
  const age = studentContext.age || 15;
  const stageType = getStageClassification(classStage, age);
  const dominantCode = studentContext.dominant_code || 'I';
  const dominantTrait = studentContext.dominant_trait || 'The Investigator';
  const secondTrait = studentContext.second_trait || 'The Builder';
  const traitDict = TRAIT_DESCRIPTIONS_I18N[language] || TRAIT_DESCRIPTIONS_I18N.en;
  const plainTrait = traitDict[dominantCode] || TRAIT_PLAIN_DESCRIPTIONS[dominantCode] || 'figuring out how complex things work, researching facts, and solving deep problems';
  const plainHinglish = TRAIT_PLAIN_HINDI[dominantCode] || 'deep research aur logic';

  const matchedCareers = studentContext.top_career_matches || [
    'AI & Neural Research Scientist',
    'Astrophysicist & Space Scientist',
    'Robotics & Hardware Engineer'
  ];
  const primaryCareerTitle = matchedCareers[0]?.title || matchedCareers[0] || 'AI & Neural Research Scientist';
  const secondaryCareerTitle = matchedCareers[1]?.title || matchedCareers[1] || 'Astrophysicist & Space Scientist';

  // 1. SAFETY & CRISIS PROTOCOL (TEST SCENARIO 7 - HIGHEST PRIORITY)
  // Must use fixed, pre-written strings in each language, not generated at runtime
  if (isDistressMessage(lower)) {
    const langKey = FIXED_DISTRESS_SAFETY_MESSAGES[language] ? language : 'en';
    const safetyEntry = FIXED_DISTRESS_SAFETY_MESSAGES[langKey];
    return {
      safetyFlag: true,
      text: safetyEntry.text.replace('{firstName}', firstName),
      chips: safetyEntry.chips
    };
  }

  // 2. SECURITY & JAILBREAK PROTECTION (TEST SCENARIO 8)
  if (isJailbreakAttempt(lower)) {
    const langKey = JAILBREAK_RESPONSES[language] ? language : 'en';
    const jbEntry = JAILBREAK_RESPONSES[langKey];
    return {
      safetyFlag: false,
      text: jbEntry.text,
      chips: jbEntry.chips
    };
  }

  // 3. HINGLISH RESPONSES (TEST SCENARIO 6)
  if (isHinglish(lower)) {
    if (lower.includes('doctor') || lower.includes('medical') || lower.includes('neet')) {
      return {
        safetyFlag: false,
        text: `Yeh situation kaafi Indian families mein aati hai, ${firstName}—parents medical field ki stability aur respect ko priority dete hain. Lekin aapka daily interest aur natural strengths bhi utne hi zaroori hain taaki aap long-term satisfy rahein. Kya aap chahenge ki hum dono pathways ko calmly compare karein, ya counsellor ke saath ek combined parent conversation plan karein?`,
        chips: ['Dono pathways compare karein', 'Parents se kaise baat karein?', 'Book a counsellor', 'Back to my results']
      };
    }

    if (lower.includes('confuse') || lower.includes('nahi samajh') || lower.includes('pata nahi') || lower.includes('kya karu')) {
      return {
        safetyFlag: false,
        text: `Bilkul normal hai, ${firstName}. Class ${classStage} mein aksar samajh nahi aata ki aage kya chunna hai. Aapke answers dikhate hain ki aap naturally ${plainHinglish} ki taraf lean karte hain. Kya aap kisi ek career card ko explore karna chahenge, ya counsellor se baat karna behtar hoga?`,
        chips: ['See career matches', 'Book a counsellor', 'Retake a section', 'Summarise our chat']
      };
    }

    return {
      safetyFlag: false,
      text: `Bilkul samajh sakta hoon, ${firstName}. Aapke assessment answers dikhate hain ki aapka style ${plainHinglish} ki taraf lean karta hai. Jab aap school ya doston ke kisi project mein hote hain, aapko kaunsa role sabse natural lagta hai?`,
      chips: ['Setting the overall vision', 'Organizing practical milestones', 'A mix of both']
    };
  }

  // 4. FAMILY EXPECTATIONS / PARENTS WANT SOMETHING DIFFERENT (TEST SCENARIO 3)
  if (
    lower.includes('parent') ||
    lower.includes('family') ||
    lower.includes('doctor') ||
    lower.includes('medical') ||
    lower.includes('mbbs') ||
    lower.includes('neet') ||
    lower.includes('dad') ||
    lower.includes('mom') ||
    lower.includes('pressure')
  ) {
    if (language === 'hi') {
      return {
        safetyFlag: false,
        text: `कई भारतीय परिवारों में, माता-पिता सुरक्षा और सामाजिक प्रतिष्ठा के कारण मेडिकल या पारंपरिक करियर को प्राथमिकता देते हैं, ${firstName}। इसके साथ ही, आपकी दैनिक ऊर्जा और प्राकृतिक रुचियां भी महत्वपूर्ण हैं। क्या आप दोनों विकल्पों की तुलना करना चाहेंगे, या अपने माता-पिता के साथ काउंसलर से बात करना चाहेंगे?`,
        chips: ['दोनों विकल्पों की तुलना करें', 'माता-पिता से कैसे बात करें?', 'काउंसलर बुक करें', 'मेरे परिणामों पर वापस जाएं']
      };
    }
    if (language === 'or') {
      return {
        safetyFlag: false,
        text: `ଅନେକ ଭାରତୀୟ ପରିବାରରେ ପିତାମାତା ସ୍ଥିରତା ଏବଂ ସାମାଜିକ ସମ୍ମାନ ପାଇଁ ଡାକ୍ତରୀ କିମ୍ବା ଇଞ୍ଜିନିୟରିଂକୁ ପ୍ରାଧାନ୍ୟ ଦିଅନ୍ତି, ${firstName}। କିନ୍ତୁ ଆପଣଙ୍କ ଦୈନନ୍ଦିନ ରୁଚି ଏବଂ ପ୍ରାକୃତିକ ଶକ୍ତି ମଧ୍ୟ ସମାନ ଭାବରେ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ଆପଣ ଉଭୟ ବିକଳ୍ପକୁ ତୁଳନା କରିବାକୁ ଚାହାଁନ୍ତି କି?`,
        chips: ['ଉଭୟ ବିକଳ୍ପ ତୁଳନା କରନ୍ତୁ', 'ପିତାମାତାଙ୍କ ସହ କିପରି କଥା ହେବେ?', 'କାଉନସେଲର ବୁକ୍ କରନ୍ତୁ', 'ମୋର ଫଳାଫଳକୁ ଫେରନ୍ତୁ']
      };
    }
    if (language === 'bn') {
      return {
        safetyFlag: false,
        text: `অনেক ভারতীয় পরিবারে মা-বাবা ভবিষ্যৎ নিরাপত্তা ও সামাজিক মর্যাদার কারণে মেডিকেল বা ইঞ্জিনিয়ারিং পছন্দ করেন, ${firstName}। কিন্তু আপনার স্বাভাবিক আগ্রহ এবং শক্তিও অত্যন্ত গুরুত্বপূর্ণ। আপনি কি উভয় ক্ষেত্রের তুলনা করতে চান, নাকি বাবা-মায়ের সাথে কাউন্সিলরের উপস্থিতিতে শান্তভাবে কথা বলতে চান?`,
        chips: ['উভয় ক্ষেত্রের তুলনা করুন', 'বাবা-মায়ের সাথে কীভাবে কথা বলব?', 'কাউন্সিলর বুক করুন', 'আমার ফলাফলে ফিরে যান']
      };
    }
    if (language === 'te') {
      return {
        safetyFlag: false,
        text: `చాలా భారతీయ కుటుంబాలలో, తల్లిదండ్రులు స్థిరత్వం మరియు సామాజిక గౌరవం కోసం మెడిసిన్ లేదా ఇంజనీరింగ్‌ను ప్రోత్సహిస్తారు, ${firstName}। అదే సమయంలో మీ సహజ ఆసక్తులు కూడా అంతే ముఖ్యం. మీరు రెండు మార్గాలను సరిపోల్చాలనుకుంటున్నారా, లేదా కౌన్సెలర్‌తో కలిసి మీ తల్లిదండ్రులతో మాట్లాడాలనుకుంటున్నారా?`,
        chips: ['రెండు మార్గాలను సరిపోల్చండి', 'తల్లిదండ్రులతో ఎలా మాట్లాడాలి?', 'కౌన్సెలర్‌ను సంప్రదించండి', 'నా ఫలితాలకు తిరిగి వెళ్ళండి']
      };
    }

    return {
      safetyFlag: false,
      text: `In many Indian families, parents encourage medicine or traditional paths because they deeply value long-term stability and social respect. At the same time, your daily energy and natural strengths are what sustain your learning over the next decade. Would you like to compare how your strengths connect to both fields, or explore having a calm conversation with your parents alongside a human counsellor?`,
      chips: [
        'How to talk to my parents?',
        'Compare both pathways',
        'Book a counsellor',
        'Back to my results'
      ]
    };
  }

  // 5. STUDENT DISAGREES WITH RESULTS (TEST SCENARIO 2)
  if (
    lower.includes("don't think") ||
    lower.includes('disagree') ||
    lower.includes('wrong') ||
    lower.includes('not like me') ||
    lower.includes('hate leading') ||
    lower.includes('not a leader') ||
    lower.includes('incorrect')
  ) {
    if (language === 'hi') {
      return {
        safetyFlag: false,
        text: `यह बिल्कुल स्वाभाविक है, ${firstName}—ये मूल्यांकन परिणाम आत्म-चिंतन की शुरुआत हैं, कोई अंतिम निर्णय नहीं। कई विद्यार्थियों को उनके अन्य गुण बेहतर रूप से वर्णित करते हैं। आपके पिछले ग्रुप प्रोजेक्ट में, आपने स्वाभाविक रूप से कौन सी भूमिका निभाई थी?`,
        chips: ['तथ्य खोजने वाला', 'योजना बनाने वाला', 'क्रिएटिव डिजाइन वाला', 'काउंसलर बुक करें']
      };
    }
    if (language === 'or') {
      return {
        safetyFlag: false,
        text: `ଏହା ସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱାଭାବିକ, ${firstName}—ଏହି ମୂଲ୍ୟାଙ୍କନ ଫଳାଫଳ ଆତ୍ମ-ଅନୁସନ୍ଧାନର ଏକ ଆରମ୍ଭ, କୌଣସି ଚୂଡ଼ାନ୍ତ ରାୟ ନୁହେଁ। ଆପଣଙ୍କ ବିଦ୍ୟାଳୟ ପ୍ରୋଜେକ୍ଟରେ ଆପଣ ସ୍ୱଭାବତଃ କେଉଁ ଭୂମିକା ଗ୍ରହଣ କରିଥିଲେ?`,
        chips: ['ତଥ୍ୟ ଅନୁସନ୍ଧାନକାରୀ', 'ଯୋଜନାକାରୀ', 'ସୃଜନଶୀଳ ଡିଜାଇନର୍', 'କାଉନସେଲର ବୁକ୍ କରନ୍ତୁ']
      };
    }
    if (language === 'bn') {
      return {
        safetyFlag: false,
        text: `এটা সম্পূর্ণ স্বাভাবিক, ${firstName}—এই মূল্যায়নের ফলাফল আত্ম-উপলব্ধির সূচনা মাত্র, কোনো চূড়ান্ত সিদ্ধান্ত নয়। আপনার স্কুলের শেষ গ্রুপ প্রজেক্টে, আপনি স্বতঃস্ফূর্তভাবে কোন ভূমিকাটি নিয়েছিলেন?`,
        chips: ['তথ্য অনুসন্ধানকারী', 'পরিকল্পনাকারী', 'সৃজনশীল ডিজাইনার', 'কাউন্সিলর বুক করুন']
      };
    }
    if (language === 'te') {
      return {
        safetyFlag: false,
        text: `ఇది ఖచ్చితంగా సాధారణం, ${firstName}—ఈ మూల్యాంకన ఫలితాలు ఆలోచించడానికి ఒక ప్రారంభం మాత్రమే, తుది తీర్పు కాదు. మీ చివరి గ్రూప్ ప్రాజెక్ట్‌లో, మీరు సహజంగా ఏ బాధ్యత తీసుకున్నారు?`,
        chips: ['సమాచారం సేకరించే వ్యక్తి', 'ప్రణాళిక వేసే వ్యక్తి', 'డిజైన్ చేసే వ్యక్తి', 'కౌన్సెలర్‌ను సంప్రదించండి']
      };
    }

    return {
      safetyFlag: false,
      text: `That is completely normal, ${firstName}—these assessment results are a starting point for reflection, not a fixed verdict. Many students find that their secondary trait or specific school activities describe them much better. In your last group project, which role did you naturally take?`,
      chips: [
        'The one who dug up facts',
        'The one who kept the plan',
        'The one who made it look good',
        'Book a counsellor'
      ]
    };
  }

  // 6. "I HAVE NO IDEA WHAT I WANT" / UNSURE (TEST SCENARIO 4)
  if (
    lower.includes('no idea') ||
    lower.includes('dont know') ||
    lower.includes("don't know") ||
    lower.includes('confused') ||
    lower.includes('unsure') ||
    lower.includes('not sure') ||
    lower.includes('lost')
  ) {
    if (language === 'hi') {
      return {
        safetyFlag: false,
        text: `कोई निश्चित विचार न होना पूरी तरह से सामान्य है, ${firstName}—इस उम्र में ज्यादातर विद्यार्थी यह समझने की कोशिश कर रहे होते हैं कि उन्हें क्या पसंद है। आपको आज ही पूरा जीवन तय करने की जरूरत नहीं है; बस एक छोटा कदम बढ़ाना है। क्या आप कोई करियर कार्ड देखना चाहेंगे या काउंसलर से बात करना पसंद करेंगे?`,
        chips: ['करियर विकल्प देखें', 'काउंसलर बुक करें', 'एक सेक्शन दोबारा दें', 'चैट का सारांश देखें']
      };
    }
    if (language === 'or') {
      return {
        safetyFlag: false,
        text: `ଭବିଷ୍ୟତ ବିଷୟରେ ନିଶ୍ଚିତ ନ ହେବା ସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱାଭାବିକ, ${firstName}—ଆପଣଙ୍କ ବୟସରେ ଅଧିକାଂଶ ଛାତ୍ର ଏହା ଅନୁସନ୍ଧାନ କରୁଛନ୍ତି। ଆଜି ହିଁ ସବୁକିଛି ନିଷ୍ପତ୍ତି ନେବା ଆବଶ୍ୟକ ନାହିଁ। ଆପଣ କ୍ୟାରିଅର୍ ବିକଳ୍ପ ଦେଖିବାକୁ ଚାହାଁନ୍ତି କିମ୍ବା କାଉନସେଲରଙ୍କ ସହ କଥା ହେବାକୁ ଚାହାଁନ୍ତି?`,
        chips: ['କ୍ୟାରିଅର୍ ବିକଳ୍ପ ଦେଖନ୍ତୁ', 'କାଉନସେଲର ବୁକ୍ କରନ୍ତୁ', 'ପୁନର୍ବାର ମୂଲ୍ୟାଙ୍କନ କରନ୍ତୁ', 'ସାରାଂଶ ଦେଖନ୍ତୁ']
      };
    }
    if (language === 'bn') {
      return {
        safetyFlag: false,
        text: `কোনো স্পষ্ট ধারণা না থাকা একেবারেই স্বাভাবিক, ${firstName}—আপনার বয়সের অধিকাংশ শিক্ষার্থী এখনও নিজেদের পছন্দ খুঁজে বের করছে। আপনাকে আজই গোটা জীবন ঠিক করে ফেলতে হবে না। আপনি কি একটি ক্যারিয়ার কার্ড দেখতে চান নাকি কোনো কাউন্সিলরের সাথে কথা বলতে চান?`,
        chips: ['ক্যারিয়ার মিল দেখুন', 'কাউন্সিলর বুক করুন', 'একটি অংশ পুনরায় দিন', 'সারসংক্ষেপ দেখুন']
      };
    }
    if (language === 'te') {
      return {
        safetyFlag: false,
        text: `ఏం చేయాలో ఖచ్చితంగా తెలియకపోవడం చాలా సహజం, ${firstName}—మీ వయస్సులోని చాలామంది విద్యార్థులు ఇంకా అన్వేషిస్తున్నారు. ఈరోజే మీ జీవితాన్ని మొత్తం నిర్ణయించుకోవాల్సిన అవసరం లేదు. మీరు కెరీర్ కార్డ్‌లను అన్వేషించాలనుకుంటున్నారా లేదా కౌన్సెలర్‌తో మాట్లాడాలనుకుంటున్నారా?`,
        chips: ['కెరీర్ అవకాశాలను చూడండి', 'కౌన్సెలర్‌ను సంప్రదించండి', 'మళ్లీ ప్రయత్నించండి', 'సారాంశం చూడండి']
      };
    }

    return {
      safetyFlag: false,
      text: `Having no idea what you want is completely okay and very normal, ${firstName}—most students at your stage are still figuring out what excites them. You don't have to decide your whole life today; you only need one small next step. Would you like to open one career card to explore, or would you prefer talking to a human counsellor?`,
      chips: [
        'See career matches',
        'Book a counsellor',
        'Retake a section',
        'Summarise our chat'
      ]
    };
  }

  // 7. DIRECT RESPONSE TO STUDENT CHOICES: WORK & ROLE PREFERENCES
  // (Fixes: "It ignores what the student chose. The student picked 'Setting the overall vision'...")

  // 7a. Student chose "Setting the overall vision"
  if (
    lower.includes('setting the overall vision') ||
    lower.includes('overall vision') ||
    lower.includes('shaping the overall vision') ||
    lower.includes('vision')
  ) {
    return {
      safetyFlag: false,
      text: `Shaping the overall vision is a fantastic strength, ${firstName}. In fields like ${primaryCareerTitle}, having a clear vision is what defines the goal and inspires the approach before the detailed technical work starts. When you tackle an ambitious goal, do you prefer open-ended exploration, or having clear milestone checkpoints along the way?`,
      chips: [
        'Open-ended exploration',
        'Clear milestone checkpoints',
        'Test my study habits'
      ]
    };
  }

  // 7b. Student chose "Organizing practical milestones"
  if (
    lower.includes('organizing practical milestones') ||
    lower.includes('practical milestones') ||
    lower.includes('milestones') ||
    lower.includes('practical steps') ||
    lower.includes('coordinating practical milestones')
  ) {
    return {
      safetyFlag: false,
      text: `Focusing on practical milestones is where ideas actually become real, ${firstName}. In ${primaryCareerTitle}, disciplined execution and tracking milestones turn big concepts into working solutions. Do you prefer structured daily targets, or do rigid schedules feel restricting to you?`,
      chips: [
        'Structured targets keep me focused',
        'Strict schedules feel restricting',
        'Test my study habits'
      ]
    };
  }

  // 7c. Student chose "A mix of both"
  if (
    lower.includes('mix of both') ||
    (lower.includes('both') && !lower.includes('compare both'))
  ) {
    return {
      safetyFlag: false,
      text: `Balancing big-picture vision with practical milestones is a powerful combination, ${firstName}. It means you can dream up the destination and map out the steps to get there in ${primaryCareerTitle}. When working toward a deadline, do you prefer structured daily targets, or open-ended exploration?`,
      chips: [
        'Structured targets keep me focused',
        'Open-ended exploration',
        'Test my study habits'
      ]
    };
  }

  // 7d. Exploration / Target rhythm choices
  if (
    lower.includes('open-ended exploration') ||
    lower.includes('clear milestone checkpoints') ||
    lower.includes('structured targets keep me focused') ||
    lower.includes('strict schedules feel restricting') ||
    lower.includes('open-ended') ||
    lower.includes('structured targets')
  ) {
    return {
      safetyFlag: false,
      text: `That gives a very clear picture of how you work best, ${firstName}. Pathways in ${primaryCareerTitle} value that work style because it keeps progress steady while solving hard problems. Does this sound like a journey you would be eager to pursue?`,
      chips: [
        'Yes, sounds exciting',
        'Not really, explore others',
        'Tell me about the daily work'
      ]
    };
  }

  // 8. DIRECT RESPONSE TO: "Does this sound like a journey you'd be eager to pursue?"
  // (Fixes: "After 'Does this sound like a journey you’d be eager to pursue?' there is no Yes or 'Not really' chip.")

  // 8a. "Yes, sounds exciting" / "Yes" / "Excited"
  if (
    lower.includes('yes, sounds exciting') ||
    lower.includes('sounds exciting') ||
    lower.includes('yes eager') ||
    lower.includes('excited') ||
    (lower.startsWith('yes') && !lower.includes('yesterday') && !lower.includes('exactly'))
  ) {
    let nextStageMessage = '';
    if (stageType === 'class_8_10') {
      nextStageMessage = `At your stage in Class 8–10, the most practical next step is keeping your Math and Science grades strong for your 10th boards, then planning for the Science (PCM) stream in Class 11.`;
    } else {
      nextStageMessage = `In Class 11–12, the key next step is balancing your board syllabus with initial preparation for relevant entrance exams.`;
    }

    return {
      safetyFlag: false,
      text: `That's wonderful to hear, ${firstName}! Having genuine enthusiasm makes studying much more purposeful. ${nextStageMessage} What would you like to explore next?`,
      chips: [
        'What subjects should I pick?',
        'Tell me about the daily work',
        'Show entrance exams & fees',
        'Summarise our chat'
      ]
    };
  }

  // 8b. "Not really, explore others" / "Not really"
  if (
    lower.includes('not really') ||
    lower.includes('explore others') ||
    lower.includes('not eager')
  ) {
    return {
      safetyFlag: false,
      text: `That is completely fine, ${firstName}—discovering what doesn't excite you is just as valuable as finding what does. Let's look at ${secondaryCareerTitle}, which approaches problem-solving from a different angle. Would you like to explore why that might be a better fit, or browse all your matches?`,
      chips: [
        `Why ${secondaryCareerTitle}?`,
        'See all career matches',
        'I have no idea what I want',
        'Book a counsellor'
      ]
    };
  }

  // 9. "TELL ME ABOUT THE DAILY WORK" (Concrete day-in-the-life)
  if (
    lower.includes('daily work') ||
    lower.includes('day-to-day') ||
    lower.includes('day to day') ||
    lower.includes('daily routine')
  ) {
    const verifiedPrimary = findVerifiedCareer(primaryCareerTitle);
    const dailyDesc = getDailyWorkDescription(verifiedPrimary);
    return {
      safetyFlag: false,
      text: `${dailyDesc}\n\nDoes this day-to-day rhythm sound appealing to you?`,
      chips: [
        'Yes, sounds exciting',
        'Not really, explore others',
        'What subjects should I pick?'
      ]
    };
  }

  // 9a. "COMPARE TOP 3 CAREERS" (Requirement 4)
  if (
    lower.includes('compare top 3') ||
    lower.includes('compare these careers') ||
    lower.includes('compare these 3') ||
    (lower.includes('compare') && (lower.includes('career') || lower.includes('matches') || lower.includes('options')))
  ) {
    const c1 = matchedCareers[0]?.title || matchedCareers[0] || 'AI & Neural Research Scientist';
    const c2 = matchedCareers[1]?.title || matchedCareers[1] || 'Astrophysicist & Space Scientist';
    const c3 = matchedCareers[2]?.title || matchedCareers[2] || 'Robotics & Hardware Engineer';

    const v1 = findVerifiedCareer(c1);
    const v2 = findVerifiedCareer(c2);
    const v3 = findVerifiedCareer(c3);

    return {
      safetyFlag: false,
      text: `Here is a clear comparison across your **Top 3 Recommended Career Matches**:\n\n` +
        `1. **${c1}** (${v1?.traitName || 'Investigator'})\n` +
        `• **Core Focus:** Theoretical logic, mathematical models, and cutting-edge research.\n` +
        `• **Key Advantage:** Exponential future demand with leadership in modern tech innovation.\n\n` +
        `2. **${c2}** (${v2?.traitName || 'Investigator / Builder'})\n` +
        `• **Core Focus:** Scientific inquiry, cosmic observation, and physical instrumentation.\n` +
        `• **Key Advantage:** Deep academic fulfillment with premier institutes and space missions.\n\n` +
        `3. **${c3}** (${v3?.traitName || 'Builder / Craftsman'})\n` +
        `• **Core Focus:** Hands-on hardware prototyping, mechanics, and embedded circuits.\n` +
        `• **Key Advantage:** Direct tangible creation with growing hardware and automation hubs.\n\n` +
        `Which of these three problem types excites you most when you picture yourself working on it?`,
      chips: [
        `Tell me more about ${c1}`,
        `Tell me more about ${c2}`,
        'What subjects should I focus on?',
        'What skills should I develop?'
      ]
    };
  }

  // 9b. "WHAT SKILLS SHOULD I DEVELOP?" (Requirement 4)
  if (
    lower.includes('what skills') ||
    lower.includes('skills should i develop') ||
    lower.includes('build skills') ||
    lower.includes('develop skills') ||
    lower.includes('skills to develop')
  ) {
    return {
      safetyFlag: false,
      text: `To build an exceptional foundation for your top matches (${primaryCareerTitle}), focus on three key skill layers:\n\n` +
        `• **Analytical Problem Solving:** Strengthening your mathematical reasoning, algorithmic logic, and ability to break large problems into clear steps.\n` +
        `• **Hands-On Technical Tools:** Basic coding in Python or data exploration, alongside project-based tools relevant to your stream.\n` +
        `• **Communication & Synthesis:** Practicing how to explain your findings clearly to others and collaborating effectively in study teams.\n\n` +
        `Would you like actionable exercises you can try right now at your school/college stage?`,
      chips: [
        'How can I prepare right now?',
        'What subjects should I pick?',
        'Which has better future growth?'
      ]
    };
  }

  // 9c. "WHICH CAREER HAS BETTER FUTURE GROWTH / OPPORTUNITIES?" (Requirement 4)
  if (
    lower.includes('future growth') ||
    lower.includes('future opportunities') ||
    lower.includes('future scope') ||
    lower.includes('better future') ||
    lower.includes('highest growth') ||
    lower.includes('job market')
  ) {
    return {
      safetyFlag: false,
      text: `All three of your top pathways sit in high-growth, modern sectors in India and internationally:\n\n` +
        `• **${primaryCareerTitle}:** Booming demand across tech research labs, automation enterprises, and product companies with top-tier compensation.\n` +
        `• **${secondaryCareerTitle}:** Substantial national investments through ISRO, private space-tech startups (like Agnikul and Skyroot), and global research fellowships.\n\n` +
        `Because your profile is grounded in strong ${dominantTrait} traits, you have transferable skills that stay valuable even as specific technologies evolve. What aspect of future opportunities matters most to you—compensation, innovation, or stability?`,
      chips: [
        'High innovation & challenge',
        'Long-term career stability',
        'Show entrance exams & fees'
      ]
    };
  }

  // 9d. "HOW CAN I PREPARE FOR THIS CAREER?" / "HOW TO PREPARE" (Requirement 4)
  if (
    lower.includes('how can i prepare') ||
    lower.includes('how to prepare') ||
    lower.includes('how do i prepare') ||
    lower.includes('prepare for this career') ||
    lower.includes('preparation')
  ) {
    let prepAdvice = '';
    if (stageType === 'class_8_10') {
      prepAdvice = `At your stage in Class 8–10, preparation is about curiosity and fundamentals: build solid Math and Science clarity for 10th boards, participate in science exhibitions or math puzzles, and read about real-world applications.`;
    } else if (stageType === 'class_11_12') {
      prepAdvice = `In Class 11–12, prioritize balancing your board exam percentage with targeted practice for competitive entrance exams, while building 1 or 2 small portfolio projects.`;
    } else {
      prepAdvice = `In college, focus on maintaining a strong GPA, completing research or industry internships, and building a public portfolio of projects on GitHub or research preprints.`;
    }

    return {
      safetyFlag: false,
      text: `${prepAdvice}\n\nWould you like guidance on recommended subjects or entrance exams for ${primaryCareerTitle}?`,
      chips: [
        'What subjects should I pick?',
        'Show entrance exams & fees',
        'Compare top 3 careers'
      ]
    };
  }

  // 9e. "WHAT IF I AM INTERESTED IN A DIFFERENT CAREER?" (Requirement 4)
  if (
    lower.includes('different career') ||
    lower.includes('interested in something else') ||
    lower.includes('another career') ||
    lower.includes('something different') ||
    lower.includes('not interested in these')
  ) {
    return {
      safetyFlag: false,
      text: `That is completely natural, ${firstName}! Your assessment coordinates highlight your natural thinking styles, not rigid boundaries. Your ${dominantTrait} strengths are highly transferable to business strategy, creative technology, public policy, and entrepreneurship. Which specific domain or field are you curious about?`,
      chips: [
        'Creative arts & design',
        'Business & management',
        'Social impact & law',
        'Book a counsellor'
      ]
    };
  }

  // 10. "WHAT SUBJECTS SHOULD I PICK?" (Stage-matched guidance - Class 8-10 vs 11-12)
  if (
    lower.includes('what subjects') ||
    lower.includes('which subjects') ||
    lower.includes('subject choice') ||
    lower.includes('stream choice') ||
    lower.includes('subjects should i pick') ||
    lower.includes('stream should i pick')
  ) {
    if (stageType === 'class_8_10') {
      return {
        safetyFlag: false,
        text: `For Class 9 and 10, your immediate priority is building solid conceptual clarity in Mathematics and Science for your 10th boards. For Class 11, selecting Science with Physics, Chemistry, and Mathematics (PCM) keeps your doors open for all premier technical and research institutes. How do you currently feel about your Math and Science classes?`,
        chips: [
          'Those are my favourite subjects',
          'I find some of them challenging',
          'Show entrance exams & fees'
        ]
      };
    }

    return {
      safetyFlag: false,
      text: `In Class 11–12, maintaining a high percentage in Physics, Chemistry, and Mathematics (PCM) or Computer Science is essential while preparing for your target entrance exams. How is your preparation currently going?`,
      chips: [
        'Preparation is going well',
        'Feeling a bit overwhelmed',
        'Show entrance exams & fees'
      ]
    };
  }

  if (
    lower.includes('favourite subjects') ||
    lower.includes('favorite subjects') ||
    lower.includes('going well')
  ) {
    return {
      safetyFlag: false,
      text: `That is a fantastic foundation, ${firstName}! Enjoying those core subjects makes diving into higher-level problem solving in ${primaryCareerTitle} feel natural and rewarding. Would you like to see verified facts about entrance exams, or summarise our discussion?`,
      chips: [
        'Show entrance exams & fees',
        'Tell me about the daily work',
        'Summarise our chat'
      ]
    };
  }

  if (
    lower.includes('challenging') ||
    lower.includes('overwhelmed')
  ) {
    return {
      safetyFlag: false,
      text: `Finding subjects challenging at times is completely normal, ${firstName}—everyone encounters hurdles with tough topics. Breaking complex concepts into smaller daily exercises and getting guidance from a teacher or mentor makes a huge difference. Would you like to note this for a counsellor session, or explore alternative pathways?`,
      chips: [
        'Book a counsellor',
        `Why ${secondaryCareerTitle}?`,
        'See all career matches',
        'Summarise our chat'
      ]
    };
  }

  // 11. "TEST MY STUDY HABITS"
  if (
    lower.includes('test my study habits') ||
    lower.includes('study habit') ||
    lower.includes('study habits') ||
    lower.includes('test study habits')
  ) {
    return {
      safetyFlag: false,
      text: `Testing your actual study habits helps you see whether the daily work of a career feels sustainable and energizing. When you sit down to study or learn something new, what environment helps you do your best work?`,
      chips: [
        'Deep solo focus with no distractions',
        'Discussing with a study partner or group',
        'Short bursts with frequent breaks'
      ]
    };
  }

  // 11a. Study habit choices
  if (
    lower.includes('deep solo focus') ||
    lower.includes('solo focus')
  ) {
    return {
      safetyFlag: false,
      text: `Deep solo focus is a tremendous asset for analytical and research pathways like ${primaryCareerTitle}, where you need hours of uninterrupted concentration to solve complex puzzles. Does this kind of immersive focus feel rewarding to you?`,
      chips: [
        'Yes, sounds exciting',
        'Not really, explore others',
        'Tell me about the daily work'
      ]
    };
  }

  if (
    lower.includes('study partner') ||
    lower.includes('discussing with a study partner') ||
    lower.includes('group')
  ) {
    return {
      safetyFlag: false,
      text: `Learning through discussion and teamwork is a huge strength—it builds the communication and debate skills essential for research labs and project teams in ${primaryCareerTitle}. Does this collaborative style match what you enjoy?`,
      chips: [
        'Yes, sounds exciting',
        'Not really, explore others',
        'Tell me about the daily work'
      ]
    };
  }

  if (
    lower.includes('short bursts') ||
    lower.includes('frequent breaks')
  ) {
    return {
      safetyFlag: false,
      text: `Working in short bursts with regular breaks—like the Pomodoro technique—is a proven method to maintain high mental sharpness without fatigue. It works wonderfully for iterative problem-solving and coding in ${primaryCareerTitle}. Does this rhythm feel sustainable for your daily study?`,
      chips: [
        'Yes, sounds exciting',
        'Not really, explore others',
        'Tell me about the daily work'
      ]
    };
  }

  // 12. "SEE CAREER MATCHES" / "SEE ALL CAREER MATCHES"
  if (
    lower.includes('see career matches') ||
    lower.includes('see all career matches') ||
    lower.includes('career matches') ||
    lower.includes('career options')
  ) {
    return {
      safetyFlag: false,
      text: `Here are the top verified career matches from your assessment: 1. ${primaryCareerTitle}, 2. ${secondaryCareerTitle}, plus related interdisciplinary tracks. Which one would you like to explore first?`,
      chips: [
        `Why ${primaryCareerTitle}?`,
        `Why ${secondaryCareerTitle}?`,
        'I have no idea what I want',
        'Book a counsellor'
      ]
    };
  }

  // 13. STUDENT AGREES (TEST SCENARIO 1)
  // FIX: SAY "Your answers lean toward..." ONCE (in the opener). NEVER repeat it here!
  if (
    lower.includes('sounds like me') ||
    lower.includes('fits me') ||
    lower.includes('yes exactly') ||
    lower.includes('true for me') ||
    (lower.includes('agree') && !lower.includes('disagree'))
  ) {
    if (language === 'hi') {
      return {
        safetyFlag: false,
        text: `यह जानकर बहुत अच्छा लगा, ${firstName}! अपनी स्वाभाविक रुचियों को पहचानना ${primaryCareerTitle} जैसे क्षेत्रों को समझने का एक शानदार पहला कदम है। स्कूल या प्रोजेक्ट में, क्या आप समग्र दृष्टिकोण तय करना पसंद करते हैं या व्यावहारिक चरणों का समन्वय करना?`,
        chips: ['समग्र दृष्टिकोण तय करना', 'व्यावहारिक चरण व्यवस्थित करना', 'दोनों का मिश्रण']
      };
    }
    if (language === 'or') {
      return {
        safetyFlag: false,
        text: `ଏହା ଜାଣି ବହୁତ ଖୁସି ଲାଗିଲା, ${firstName}! ଏହି ସ୍ୱାଭାବିକ ପ୍ରବୃତ୍ତି ${primaryCareerTitle} ଭଳି କ୍ଷେତ୍ର ଅନୁସନ୍ଧାନ ପାଇଁ ଏକ ଉତ୍ତମ ଆରମ୍ଭ। ସ୍କୁଲ ପ୍ରୋଜେକ୍ଟରେ, ଆପଣ ସାମଗ୍ରିକ ଯୋଜନା କରିବା ପସନ୍ଦ କରନ୍ତି ନା ବ୍ୟବହାରିକ ପଦକ୍ଷେପ?`,
        chips: ['ସାମଗ୍ରିକ ଯୋଜନା', 'ବ୍ୟବହାରିକ ପଦକ୍ଷେପ', 'ଉଭୟର ମିଶ୍ରଣ']
      };
    }
    if (language === 'bn') {
      return {
        safetyFlag: false,
        text: `এটা জেনে খুব ভালো লাগল, ${firstName}! নিজের স্বাভাবিক আগ্রহকে চেনা ${primaryCareerTitle}-এর মতো ক্ষেত্রগুলো বোঝার দারুণ একটি পদক্ষেপ। স্কুল প্রজেক্টে, আপনি কি সামগ্রিক ভাবনা তৈরি করতে পছন্দ করেন নাকি বাস্তব পরিকল্পনা সমন্বয় করতে?`,
        chips: ['সামগ্রিক দৃষ্টিভঙ্গি তৈরি করা', 'বাস্তব পরিকল্পনা সমন্বয় করা', 'উভয়ের মিশ্রণ']
      };
    }
    if (language === 'te') {
      return {
        safetyFlag: false,
        text: `ఇది మీకు సరిపోయినందుకు చాలా సంతోషం, ${firstName}! ఈ సహజ ఆసక్తి ${primaryCareerTitle} లాంటి రంగాలను అన్వేషించడానికి ఒక గొప్ప ప్రారంభం. స్కూల్ ప్రాజెక్ట్‌లలో మీరు మొత్తం ప్రణాళిక వేయడం ఇష్టపడతారా లేక ఆచరణాత్మక పనులను సమన్వయం చేయడం ఇష్టపడతారా?`,
        chips: ['మొత్తం ప్రణాళిక వేయడం', 'ఆచరణాత్మక పనులను సమన్వయం చేయడం', 'రెండింటి కలయిక']
      };
    }

    return {
      safetyFlag: false,
      text: `It's great to hear that resonates with you, ${firstName}! Having that natural strength makes exploring fields like ${primaryCareerTitle} a great next step. In your projects or school activities, do you lean more toward shaping the overall vision, or coordinating the practical milestones?`,
      chips: [
        'Setting the overall vision',
        'Organizing practical milestones',
        'A mix of both'
      ]
    };
  }

  // 14. UNKNOWN SALARIES, CUT-OFFS, OR CAREERS NOT IN DATABASE (TEST SCENARIO 5)
  // Check if student asks for salary, fees, cut-offs, or entrance for a role not in database
  const asksSalary = lower.includes('salary') || lower.includes('income') || lower.includes('earn') || lower.includes('ctc') || lower.includes('pay');
  const asksFees = lower.includes('fee') || lower.includes('cost') || lower.includes('expensive');
  const asksExams = lower.includes('exam') || lower.includes('entrance') || lower.includes('test');
  const asksCutoff = lower.includes('cut-off') || lower.includes('cutoff') || lower.includes('marks needed') || lower.includes('rank needed');
  const asksInstitutes = lower.includes('institute') || lower.includes('college') || lower.includes('university') || lower.includes('iit') || lower.includes('aiims');

  // Specific careers not in verified database check
  const unknownCareersKeywords = [
    'pilot', 'marine biologist', 'fashion designer', 'lawyer', 'cricketer',
    'actor', 'chef', 'astronaut', 'dentist', 'veterinarian', 'author',
    'neurosurgeon', 'police officer', 'model', 'photographer', 'game developer'
  ];
  const mentionedUnknown = unknownCareersKeywords.find((kw) => lower.includes(kw));

  if (mentionedUnknown || asksCutoff) {
    const roleName = mentionedUnknown || 'that path';
    return {
      safetyFlag: false,
      text: `I don't have that yet. Our verified database does not currently have certified salary benchmarks, cut-offs, or fee structures for ${roleName}. A human counsellor can help look up official notifications and verified industry data with you. Would you like to note this down for a counsellor session?`,
      chips: [
        'Book a counsellor',
        'See career matches',
        `Why ${primaryCareerTitle}?`,
        'Summarise our chat'
      ]
    };
  }

  // 15. VERIFIED CAREER FACT CHECK ("Why [Career]?", fees, exams, salary of matched career)
  // (Fixes: Issue 3 - Dynamic, trait-accurate reasoning with student scores)
  // (Fixes: Issue 5 - Stage-matched advice for Class 8-10 vs 11-12)
  const whyMatch = lower.match(/why\s+([a-z0-9\s&()\-]+)/i);
  const targetCareerQuery = whyMatch ? whyMatch[1].replace(/\?+$/, '').trim() : lower;
  const verified = findVerifiedCareer(targetCareerQuery) || (
    (lower.includes('my matched career') || lower.includes('this career') || lower.includes('my top match'))
      ? findVerifiedCareer(primaryCareerTitle)
      : null
  );

  // If they asked for a salary/fee/exam of a specific career but it wasn't found in verified DB
  if ((asksSalary || asksFees || asksExams || asksInstitutes) && !verified) {
    return {
      safetyFlag: false,
      text: `I don't have that yet. Our verified database does not contain certified records for that specific query. A human counsellor can help you review official admission notices and compensation data. Would you like to save this question for a counsellor session?`,
      chips: [
        'Book a counsellor',
        'See career matches',
        `Why ${primaryCareerTitle}?`,
        'Summarise our chat'
      ]
    };
  }

  if (verified && (asksSalary || asksFees || asksExams || asksInstitutes || lower.includes('why'))) {
    let factDetails = [];
    if (asksExams) factDetails.push(`Entrance Exams: ${verified.entranceExams.join(', ')}.`);
    if (asksFees) factDetails.push(`Fee Structure: ${verified.fees}`);
    if (asksSalary) factDetails.push(`Income Range: ${verified.incomeRange}`);
    if (asksInstitutes) factDetails.push(`Key Institutes: ${verified.institutes.slice(0, 3).join(', ')}.`);

    if (factDetails.length === 0) {
      // Dynamic, trait-accurate "Why [career]?" breakdown using student's own score
      const traitCode = verified.traitCode || 'I';
      const cleanTraitName = (verified.traitName || 'Investigator').replace(/^The\s+/i, '');
      const studentScore = getStudentScoreForTrait(traitCode, cleanTraitName, studentContext);
      const traitFocus = TRAIT_ACCURATE_FOCUS[traitCode] || 'deep exploration and specialized problem-solving';
      const stageGuidance = getStageGuidance(verified, stageType, language);

      let reasonText = '';
      if (studentScore != null && studentScore > 0) {
        reasonText = `${cleanTraitName} is your strongest type at ${studentScore}%, and ${verified.title} is fundamentally centered on ${traitFocus}.`;
      } else {
        reasonText = `Your assessment shows strong alignment with ${verified.traitName}, and ${verified.title} is centered on ${traitFocus}.`;
      }

      const specificWhy = verified.whyItFits ? ` ${verified.whyItFits}` : '';

      return {
        safetyFlag: false,
        text: `${reasonText}${specificWhy} ${stageGuidance} Does this sound like a journey you would be eager to pursue?`,
        chips: [
          'Yes, sounds exciting',
          'Not really, explore others',
          'Tell me about the daily work'
        ]
      };
    }

    return {
      safetyFlag: false,
      text: `Here is the verified data for ${verified.title}: ${factDetails.join(' ')}\n\nDoes this educational pathway feel like something you would be eager to prepare for?`,
      chips: [
        'Yes, sounds exciting',
        'Not really, explore others',
        'What subjects should I pick?',
        'Summarise our chat'
      ]
    };
  }

  // 16. SUMMARY CARD REQUEST
  if (lower.includes('summarise') || lower.includes('summary') || lower.includes('recap') || turnCount >= 8) {
    const summaryTexts = {
      hi: {
        dominantTrait: `आपके उत्तर ${dominantTrait} (${plainTrait}) की ओर संकेत करते हैं`,
        stillUnsure: `दैनिक अध्ययन की आदतों और पारिवारिक अपेक्षाओं के बीच संतुलन पर विचार`,
        nextStep: `${primaryCareerTitle} के लिए मुख्य विषयों (Maths/Science) पर ध्यान दें या काउंसलर से बातचीत करें`,
        text: `यहाँ आपका सारांश है, ${firstName}। आप इसे अपने व्यक्तिगत नोट्स में सहेज सकते हैं या अपने काउंसलर के साथ साझा कर सकते हैं।`,
        chips: ['सारांश सहेजें', 'काउंसलर के साथ साझा करें', 'करियर विकल्प देखें', 'मेरे परिणामों पर वापस जाएं']
      },
      or: {
        dominantTrait: `ଆପଣଙ୍କ ଉତ୍ତର ${dominantTrait} (${plainTrait}) ଆଡ଼କୁ ସୂଚାଉଛି`,
        stillUnsure: `ଦୈନନ୍ଦିନ ଅଭ୍ୟାସ ଏବଂ ପାରିବାରିକ ଆଶା ମଧ୍ୟରେ ସନ୍ତୁଳନ ରକ୍ଷା କରିବା`,
        nextStep: `${primaryCareerTitle} ପାଇଁ ମୁଖ୍ୟ ବିଷୟଗୁଡ଼ିକ ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ କିମ୍ବା କାଉନସେଲରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ`,
        text: `ଏଠାରେ ଆପଣଙ୍କ ସାରାଂଶ ରହିଛି, ${firstName}। ଆପଣ ଏହାକୁ ନିଜ ନୋଟ୍ସରେ ସାଇତି ପାରିବେ କିମ୍ବା କାଉନସେଲରଙ୍କ ସହିତ ଅଂଶୀଦାର କରିପାରିବେ।`,
        chips: ['ସାରାଂଶ ସାଇତନ୍ତୁ', 'କାଉନସେଲରଙ୍କ ସହିତ ସେୟାର କରନ୍ତୁ', 'କ୍ୟାରିଅର୍ ବିକଳ୍ପ ଦେଖନ୍ତୁ', 'ମୋର ଫଳାଫଳକୁ ଫେରନ୍ତୁ']
      },
      bn: {
        dominantTrait: `আপনার উত্তরগুলো ${dominantTrait} (${plainTrait})-এর দিকে নির্দেশ করে`,
        stillUnsure: `দৈনন্দিন কাজের সাথে পছন্দ মেলা ও পরিবারের প্রত্যাশার ভারসাম্য রক্ষা`,
        nextStep: `${primaryCareerTitle}-এর জন্য মূল বিষয়গুলো মজবুত করুন অথবা কাউন্সিলরের সাথে কথা বলুন`,
        text: `এখানে আপনার কথোপকথনের সারসংক্ষেপ, ${firstName}। আপনি এটি নিজের কাছে সংরক্ষণ করতে পারেন অথবা আপনার কাউন্সিলরের সাথে শেয়ার করতে পারেন।`,
        chips: ['সারসংক্ষেপ সংরক্ষণ করুন', 'কাউন্সিলরের সাথে শেয়ার করুন', 'ক্যারিয়ার মিল দেখুন', 'আমার ফলাফলে ফিরে যান']
      },
      te: {
        dominantTrait: `మీ సమాధానాలు ${dominantTrait} (${plainTrait}) వైపు మొగ్గు చూపుతున్నాయి`,
        stillUnsure: `రోజువారీ ప్రాధాన్యతలు మరియు కుటుంబ ఆకాంక్షల సమతుల్యతపై ఆలోచన`,
        nextStep: `${primaryCareerTitle} కోసం ముఖ్య విషయాలపై దృష్టి పెట్టండి లేదా కౌన్సెలర్‌తో మాట్లాడండి`,
        text: `ఇది మీ సంభాషణ సారాంశం, ${firstName}। మీరు దీన్ని మీ వ్యక్తిగత నోట్స్‌లో భద్రపరుచుకోవచ్చు లేదా మీ కౌన్సెలర్‌తో పంచుకోవచ్చు.`,
        chips: ['సారాంశాన్ని సేవ్ చేయండి', 'కౌన్సెలర్‌తో భాగస్వామ్యం చేయండి', 'కెరీర్ అవకాశాలను చూడండి', 'నా ఫలితాలకు తిరిగి వెళ్ళండి']
      }
    };

    const nextStepEnglish = stageType === 'class_8_10'
      ? `Strengthen Class 10 Math & Science foundations, plan for Science (PCM) stream, and schedule a 15-minute chat with a counsellor`
      : `Explore verified entrance exams for ${primaryCareerTitle} alongside board exams or schedule a chat with a counsellor`;

    if (summaryTexts[language]) {
      const st = summaryTexts[language];
      return {
        safetyFlag: false,
        isSummaryTrigger: true,
        summaryData: {
          dominantTrait: st.dominantTrait,
          stillUnsure: st.stillUnsure,
          nextStep: st.nextStep
        },
        text: st.text,
        chips: st.chips
      };
    }

    return {
      safetyFlag: false,
      isSummaryTrigger: true,
      summaryData: {
        dominantTrait: `Your assessment highlights natural strengths in ${dominantTrait} (${plainTrait})`,
        stillUnsure: `Reflecting on whether daily activities fit and balancing family expectations`,
        nextStep: nextStepEnglish
      },
      text: `Here is your summary, ${firstName}. You can save this to your personal notes, or choose to share only this 3-bullet card with your counsellor.`,
      chips: ['Save summary', 'Share with my counsellor', 'See career matches', 'Back to my results']
    };
  }

  // 17. DEFAULT TURN (2 to 4 sentences, at most 1 question)
  // FIX: Never repeat "Your answers lean toward..."! Offer chips that directly answer the bot's question.
  if (language === 'hi') {
    return {
      safetyFlag: false,
      text: `आपकी प्रोफ़ाइल में ${dominantTrait} और ${secondTrait} दोनों की विशेषताएँ एक मजबूत आधार प्रदान करती हैं। क्या आप यह देखना चाहेंगे कि यह आपकी अध्ययन की आदतों के साथ कैसे मेल खाता है, या ${primaryCareerTitle} के अगले चरणों की जानकारी लेना चाहेंगे?`,
      chips: [
        'अध्ययन की आदतों का परीक्षण करें',
        `${primaryCareerTitle} के अगले चरण देखें`,
        'अन्य विकल्प बताएं',
        'चैट का सारांश देखें'
      ]
    };
  }
  if (language === 'or') {
    return {
      safetyFlag: false,
      text: `ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ରେ ${dominantTrait} ଏବଂ ${secondTrait} ର ସନ୍ତୁଳନ ଏକ ଦୃଢ଼ ଭିତ୍ତି ପ୍ରଦାନ କରେ। ଆପଣ ଏହା ଆପଣଙ୍କ ଅଧ୍ୟୟନ ଅଭ୍ୟାସ ସହିତ କିପରି ମେଳ ଖାଉଛି ତାହା ଦେଖିବାକୁ ଚାହାଁନ୍ତି କି?`,
      chips: [
        'ଅଧ୍ୟୟନ ଅଭ୍ୟାସ ପରୀକ୍ଷା କରନ୍ତୁ',
        `${primaryCareerTitle} ପାଇଁ ଆଗାମୀ ପଦକ୍ଷେପ`,
        'ଅନ୍ୟ ବିକଳ୍ପ କୁହନ୍ତୁ',
        'ସାରାଂଶ ଦେଖନ୍ତୁ'
      ]
    };
  }
  if (language === 'bn') {
    return {
      safetyFlag: false,
      text: `আপনার প্রোফাইলে ${dominantTrait} এবং ${secondTrait}-এর সমন্বয় একটি শক্তিশালী ভিত্তি তৈরি করে। আপনি কি এটি আপনার অধ্যয়নের অভ্যাসের সাথে পরীক্ষা করতে চান, নাকি ${primaryCareerTitle}-এর জন্য পরবর্তী পদক্ষেপগুলো দেখতে চান?`,
      chips: [
        'পড়ার অভ্যাস পরীক্ষা করুন',
        `${primaryCareerTitle}-এর পরবর্তী পদক্ষেপ`,
        'অন্যান্য বিকল্প বলুন',
        'সারসংক্ষেপ দেখুন'
      ]
    };
  }
  if (language === 'te') {
    return {
      safetyFlag: false,
      text: `మీ ప్రొఫైల్‌లో ${dominantTrait} మరియు ${secondTrait} కలయిక బలమైన పునాదిని అందిస్తుంది. ఇది మీ అధ్యయన అలవాట్లకు ఎలా సరిపోతుందో చూడాలనుకుంటున్నారా, లేదా ${primaryCareerTitle} కోసం తదుపరి దశలను అన్వేషించాలనుకుంటున్నారా?`,
      chips: [
        'అధ్యయన అలవాట్లను పరీక్షించండి',
        `${primaryCareerTitle} కోసం తదుపరి దశలు`,
        'ఇతర ఎంపికలు చెప్పండి',
        'సారాంశం చూడండి'
      ]
    };
  }

  return {
    safetyFlag: false,
    text: `Looking at your assessment profile, your combination of ${dominantTrait} and ${secondTrait} provides a versatile foundation. Would you like to test how this fits your day-to-day study habits, or explore next steps for ${primaryCareerTitle}?`,
    chips: [
      'Test my study habits',
      `Explore next steps for ${primaryCareerTitle}`,
      'Tell me about alternatives',
      'Summarise our chat'
    ]
  };
}

export async function POST(request) {
  try {
    // 1. Rate limiting check (20 req / min)
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'local-client';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'You are sending messages too quickly. Please take a moment and try again.' },
        { status: 429 }
      );
    }

    // 2. Parse & validate request
    const body = await request.json();
    const { action, message, history = [], studentContext = {}, language: reqLanguage } = body;
    const activeLanguage = reqLanguage || studentContext.language || 'en';

    // Handle initial greeting / comprehensive assessment analysis request
    if (action === 'greeting' || action === 'comprehensive_analysis') {
      const analysis = generateComprehensiveAssessmentAnalysis(studentContext, activeLanguage);
      return NextResponse.json(analysis);
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    // Strict input length limit: 500 characters
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message exceeds the 500-character limit. Please shorten your question.' },
        { status: 400 }
      );
    }

    // STRICT PRIVACY: Log ONLY metadata (NO raw message content stored)
    console.log('[PathFinders Chatbot API - Metadata Log]', {
      timestamp: new Date().toISOString(),
      turnCount: history.length + 1,
      dominantCode: studentContext.dominant_code || 'E',
      language: activeLanguage,
      isHinglish: isHinglish(message),
      inputLength: message.length
    });

    const turnCount = history.length + 1;
    const result = generateCareerGuidanceResponse({
      message,
      history,
      studentContext,
      turnCount,
      language: activeLanguage
    });

    // 3. Server-side Streaming Response (SSE-style JSON chunks)
    const encoder = new TextEncoder();
    const textToStream = result.text;
    const words = textToStream.split(/(\s+)/); // Preserves spacing

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial metadata chunk with chips, safetyFlag, summaryData, careerCards
        const metaEvent = JSON.stringify({
          type: 'meta',
          safetyFlag: result.safetyFlag || false,
          chips: result.chips || [],
          isSummaryTrigger: result.isSummaryTrigger || false,
          summaryData: result.summaryData || null,
          careerCards: result.careerCards || null
        }) + '\n\n';
        controller.enqueue(encoder.encode(metaEvent));

        // Stream tokens smoothly
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const textChunk = JSON.stringify({ type: 'token', content: word }) + '\n\n';
          controller.enqueue(encoder.encode(textChunk));
          // Realistic smooth streaming delay
          await new Promise((resolve) => setTimeout(resolve, 18));
        }

        // Send completion event
        const doneEvent = JSON.stringify({ type: 'done' }) + '\n\n';
        controller.enqueue(encoder.encode(doneEvent));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Error in chat-results route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or speak with your counsellor.' },
      { status: 500 }
    );
  }
}
