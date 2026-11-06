// Verified Career Database for Indian Students and Career Switchers (20 Total Careers)
// Student: 12 (2 per Holland RIASEC category)
// Career Switcher: 8 (Roles 13-20)
// STRICT RULE: Only facts present in this database may be shared with students.
// If a user asks for fees, salaries, exams, cut-offs or institutes not in this database,
// the bot must explicitly respond: "I don't have that yet" and suggest booking a human counsellor.

export const VERIFIED_CAREER_DATABASE = {
  // =============================================================
  // STUDENT CAREERS (12 TOTAL - 2 PER HOLLAND RIASEC CATEGORY)
  // =============================================================

  // -------------------------------------------------------------
  // E: THE LEADER (2 Pathways)
  // -------------------------------------------------------------
  'tech-startup-founder-ceo': {
    id: 'tech-startup-founder-ceo',
    aliases: ['tech startup founder & ceo', 'founder', 'ceo', 'entrepreneur', 'startup founder', 'tech startup founder'],
    title: 'Tech Startup Founder & CEO',
    traitCode: 'E',
    traitName: 'The Leader',
    pathway: 'Class 10+2 (Any stream, PCM/Commerce preferred) → B.Tech / B.Des / BBA / BA → Early incubator/accelerator or venture launch (Optional: MBA/MS after 2–3 yrs).',
    entranceExams: ['JEE Main / Advanced (for Tech foundations)', 'CAT / XAT / GMAT (for Top B-Schools)', 'Incubator & Venture Grants (Y Combinator, NSRCEL, T-Hub)'],
    fees: 'Govt Tech/Management Colleges: ₹2.5L – ₹8L total; Premier Private: ₹12L – ₹24L total; Incubator grants: Equity-based (₹15L – ₹1.5 Cr funding).',
    institutes: ['IIT Bombay (SINE Incubator)', 'IIT Delhi', 'BITS Pilani', 'IIM Ahmedabad (CIIE)', 'Ashoka University', 'Plaksha University'],
    incomeRange: 'Early stage: ₹0 – ₹12L LPA (survival stipend); Post-Seed / Series A: ₹24L – ₹60L+ LPA plus founder equity value.',
    growthPath: 'Solo/Co-Founder → Early MVP Lead → Scaling CEO (10-50 team) → Enterprise Board Director / Angel Investor.',
    whyItFits: 'Matches students who enjoy taking charge, rallying teams around a shared vision, and taking calculated risks.'
  },
  'product-expedition-lead': {
    id: 'product-expedition-lead',
    aliases: ['product expedition lead', 'product manager', 'pm', 'associate product manager', 'apm'],
    title: 'Product Expedition Lead (Product Manager)',
    traitCode: 'E',
    traitName: 'The Leader',
    pathway: 'Class 10+2 (Science or Commerce with Math) → B.Tech / B.Sc / BBA → 2 years in tech/analyst role → Associate Product Manager (APM) track → Product Lead.',
    entranceExams: ['JEE Main / BITSAT (for Tech)', 'IPMAT / CUET (for Integrated Management / BBA)', 'CAT (for MBA in Product/Operations)'],
    fees: 'Govt Colleges: ₹2L – ₹6L total; Top Private Tech/B-Schools: ₹10L – ₹25L total.',
    institutes: ['IIT Madras', 'IIT Kharagpur', 'IIM Bangalore', 'ISB Hyderabad', 'IIIT Bangalore', 'Delhi Technological University (DTU)'],
    incomeRange: 'Starting APM: ₹12L – ₹22L LPA; Mid-level PM (4–7 yrs): ₹28L – ₹50L LPA; Director of Product: ₹65L – ₹1.2 Cr LPA.',
    growthPath: 'Associate PM → Product Manager → Senior PM → Principal PM → VP / Chief Product Officer (CPO).',
    whyItFits: 'Fits students who love solving user pain-points, leading cross-functional teams without direct authority, and setting strategy.'
  },

  // -------------------------------------------------------------
  // R: THE BUILDER (Pathways)
  // -------------------------------------------------------------
  'automobile-engineer': {
    id: 'automobile-engineer',
    aliases: ['automobile engineer', 'automotive engineer', 'ev engineer', 'vehicle design engineer'],
    title: 'Automobile Engineer',
    traitCode: 'R',
    traitName: 'The Builder',
    pathway: 'Class 12 with PCM → B.E./B.Tech in Automobile or Mechanical Engineering (4 yrs) → Optional M.Tech in vehicle design, EV systems or testing.',
    entranceExams: ['JEE Main', 'State CETs', 'VITEEE', 'SRMJEEE', 'Polytechnic entrance exams'],
    fees: 'Varies a lot, and government institutes cost far less than private ones.',
    institutes: ['L. D. College of Engineering (Ahmedabad)', 'Madras Institute of Technology (Chennai)', 'SRM Institute of Science and Technology', 'ARAI Academy Pune'],
    incomeRange: 'Starting CTC: ₹3L – ₹6L LPA (indicative); scales with experience and EV specialisation.',
    growthPath: 'Graduate trainee → Design or project engineer → Senior engineer → Engineering manager.',
    whyItFits: 'Design, test and improve the cars, bikes and trucks we travel in, from the engine and electronics to the safety systems.'
  },
  'robotics-hardware-engineer': {
    id: 'robotics-hardware-engineer',
    aliases: ['robotics & hardware engineer', 'robotics engineer', 'hardware engineer', 'mechatronics engineer'],
    title: 'Robotics & Hardware Engineer',
    traitCode: 'R',
    traitName: 'The Builder',
    pathway: 'Class 10+2 with PCM → B.Tech in Mechatronics, Electrical, Mechanical, or Robotics Engineering → M.Tech or Robotics Lab Fellowship.',
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'MET (Manipal)', 'GATE (for M.Tech)'],
    fees: 'Govt Institutes (IITs/NITs): ₹1.8L – ₹2.5L/year; Premier Private (BITS, Manipal): ₹3.5L – ₹5.5L/year.',
    institutes: ['IIT Kanpur (Robotics Lab)', 'IIT Madras', 'BITS Pilani', 'IISc Bangalore', 'NIT Trichy', 'PSG Tech Coimbatore'],
    incomeRange: 'Starting CTC: ₹7.5L – ₹15L LPA; Mid-level (4–7 yrs): ₹18L – ₹32L LPA; Principal Robotics Architect: ₹40L – ₹65L LPA.',
    growthPath: 'Junior Embedded Engineer → Robotics Systems Specialist → Lead Hardware Architect → VP of Engineering.',
    whyItFits: 'Designed for learners who love taking apart physical things, building circuits, and controlling mechanical motion.'
  },
  'aerospace-space-hardware-engineer': {
    id: 'aerospace-space-hardware-engineer',
    aliases: ['aerospace & space hardware engineer', 'aerospace engineer', 'space hardware engineer', 'satellite engineer'],
    title: 'Aerospace & Space Hardware Engineer',
    traitCode: 'R',
    traitName: 'The Builder',
    pathway: 'Class 10+2 with PCM → B.Tech in Aerospace / Avionics / Mechanical Engineering → ISRO ICRB or Private Space Tech (Skyroot, Agnikul) internship.',
    entranceExams: ['JEE Advanced (for IIST Thiruvananthapuram & IITs)', 'JEE Main', 'ISRO Centralised Recruitment Board (ICRB) Exam'],
    fees: 'IIST (Subsidised by Govt with ISRO absorption): ~₹50,000/year; IITs: ₹2L/year; Private Universities: ₹3.5L – ₹4.5L/year.',
    institutes: ['IIST Thiruvananthapuram', 'IIT Bombay (Aerospace)', 'IIT Madras', 'IIT Kharagpur', 'MIT Manipal'],
    incomeRange: 'ISRO Scientist/Engineer-SC: ₹75,000/month basic + DA/HRA (~₹11L – ₹13L LPA CTC); Private Space-tech: ₹8L – ₹18L LPA starting.',
    growthPath: 'Scientist SC / Junior Propulsion Engineer → Scientist SD → Mission Lead / Flight Hardware Director.',
    whyItFits: 'Appeals to students excited by real-world physical craftsmanship applied to rockets, propulsion, and avionics.'
  },

  // -------------------------------------------------------------
  // I: THE INVESTIGATOR (2 Pathways)
  // -------------------------------------------------------------
  'ai-neural-research-scientist': {
    id: 'ai-neural-research-scientist',
    aliases: ['ai & neural research scientist', 'ai researcher', 'ai scientist', 'machine learning scientist', 'deep learning researcher'],
    title: 'AI & Neural Research Scientist',
    traitCode: 'I',
    traitName: 'The Investigator',
    pathway: 'Class 10+2 with PCM → B.Tech / B.S. in Computer Science or Math & Computing → Research Fellowship / M.S. → Ph.D. in AI / Machine Learning.',
    entranceExams: ['JEE Advanced (Top IITs CSE / Math & Computing)', 'GATE Computer Science', 'GRE / TOEFL (for Top Global AI Labs)'],
    fees: 'IITs/IISc (B.Tech/M.Tech): ₹2L/year; Ph.D. positions: Fully funded with monthly stipend (₹37,000 – ₹54,000/month).',
    institutes: ['IISc Bangalore', 'IIT Hyderabad (Department of AI)', 'IIT Madras (RBCDSAI)', 'IIT Delhi', 'IIIT Hyderabad (CVIT/LTRC)'],
    incomeRange: 'Starting Research Engineer: ₹18L – ₹35L LPA; Post-Doc / Senior AI Scientist: ₹45L – ₹95L LPA; Principal Research Director: ₹1.2 Cr+ LPA.',
    growthPath: 'Research Associate → Applied AI Scientist → Staff Research Scientist → Head of AI Research / Chief Scientist.',
    whyItFits: 'Created for students fascinated by the deep math of neural architectures, transformers, and theoretical machine learning.'
  },
  'astrophysicist-space-scientist': {
    id: 'astrophysicist-space-scientist',
    aliases: ['astrophysicist & space scientist', 'astrophysicist', 'space scientist', 'astronomer', 'planetary scientist'],
    title: 'Astrophysicist & Space Scientist',
    traitCode: 'I',
    traitName: 'The Investigator',
    pathway: 'Class 10+2 with PCM → B.Sc (Hons) Physics / B.S. in Physics or Astronomy (IISc/IISER) → M.Sc Physics → Ph.D. in Astrophysics.',
    entranceExams: ['IAT (IISER Aptitude Test)', 'JEE Advanced (for IISc BS Programme)', 'NEST (for NISER / UM-DAE CEBS)', 'JEST / CSIR-NET (for Ph.D. admissions)'],
    fees: 'Govt Research Institutes (IISERs/NISER): Highly subsidised (~₹30,000/semester) + INSPIRE fellowship of ₹5,000/month for eligible ranks.',
    institutes: ['Indian Institute of Astrophysics (IIA Bangalore)', 'IUCAA Pune', 'IISc Bangalore', 'Tata Institute of Fundamental Research (TIFR Mumbai)', 'Physical Research Laboratory (PRL Ahmedabad)'],
    incomeRange: 'Ph.D. Scholar: ₹37,000 – ₹42,000/month stipend; Scientist-C / Assistant Professor: ₹10L – ₹14L LPA CTC; Senior Professor / Lab Director: ₹22L – ₹32L LPA.',
    growthPath: 'Junior Research Fellow (JRF) → Senior Post-Doctoral Fellow → Assistant Astronomer / Scientist-C → Mission Principal Investigator.',
    whyItFits: 'Perfect for students who ask profound questions about black holes, cosmic origins, and the physical universe.'
  },

  // -------------------------------------------------------------
  // A: THE CREATOR (2 Pathways)
  // -------------------------------------------------------------
  'ui-ux-interactive-architect': {
    id: 'ui-ux-interactive-architect',
    aliases: ['ui/ux & interactive architect', 'ui designer', 'ux designer', 'product designer', 'interaction designer'],
    title: 'UI/UX & Interactive Architect',
    traitCode: 'A',
    traitName: 'The Creator',
    pathway: 'Class 10+2 (Any stream: Humanities, Commerce, Science) → B.Des in Interaction / Digital Design → Studio portfolio & UX internships.',
    entranceExams: ['UCEED (for IIT Bombay, Delhi, Guwahati, Jabalpur)', 'NID DAT (National Institute of Design)', 'SEED (Symbiosis Institute of Design)'],
    fees: 'IITs (B.Des): ₹2L – ₹2.5L/year; NID: ₹3.5L/year; Private Design Schools: ₹4L – ₹6.5L/year.',
    institutes: ['National Institute of Design (NID Ahmedabad / Bengaluru)', 'IDC School of Design (IIT Bombay)', 'IIT Guwahati (DoD)', 'Srishti Institute of Art & Design Bangalore'],
    incomeRange: 'Starting UX Designer: ₹7L – ₹14L LPA; Senior Product Designer (4–7 yrs): ₹20L – ₹38L LPA; Head of Design / VP Design: ₹50L – ₹90L LPA.',
    growthPath: 'Associate Designer → Product Designer → Lead Interaction Architect → VP / Head of Experience Design.',
    whyItFits: 'Tailored for visual thinkers who blend empathy, human emotion, typography, and functional digital aesthetics.'
  },
  'game-world-narrative-designer': {
    id: 'game-world-narrative-designer',
    aliases: ['game world & narrative designer', 'game designer', 'narrative designer', 'level designer', 'game writer'],
    title: 'Game World & Narrative Designer',
    traitCode: 'A',
    traitName: 'The Creator',
    pathway: 'Class 10+2 (Any stream) → B.Des / B.Sc in Game Design or Computer Animation → Unity/Unreal Engine project portfolio → Game Studio Track.',
    entranceExams: ['UCEED / NID DAT', 'FTII Entrance Examination', 'Direct Portfolio Review at Top Game Design Academies'],
    fees: 'Premier Animation & Game Academies: ₹2.5L – ₹5L/year; International Studio Colleges: ₹6L – ₹10L/year.',
    institutes: ['National Institute of Design (NID Gandhinagar - Animation & Game)', 'Rubika India (Pune)', 'ICAT Design & Media College (Chennai/Bangalore)', 'Whistling Woods International (Mumbai)'],
    incomeRange: 'Junior Level Designer: ₹5L – ₹10L LPA; Senior Narrative Architect: ₹16L – ₹30L LPA; Game Director / Creative Lead: ₹45L – ₹80L LPA.',
    growthPath: 'Junior World Builder → Game Systems Designer → Lead Narrative Designer → Creative Game Director.',
    whyItFits: 'Flourishes with students who love interactive storytelling, cinematic world-building, and immersive gaming experiences.'
  },

  // -------------------------------------------------------------
  // S: THE HELPER (2 Pathways)
  // -------------------------------------------------------------
  'edutech-learning-mentor': {
    id: 'edutech-learning-mentor',
    aliases: ['edutech & learning experience mentor', 'edtech mentor', 'learning designer', 'instructional designer', 'curriculum specialist'],
    title: 'EduTech & Learning Experience Mentor',
    traitCode: 'S',
    traitName: 'The Helper',
    pathway: 'Class 10+2 (Any stream) → B.A. / B.Sc in Education, Psychology, or Cognitive Science → M.Ed / M.Sc in Educational Technology.',
    entranceExams: ['CUET PG (for TISS Mumbai, Central Universities)', 'RIE CEE (Regional Institute of Education NCERT)'],
    fees: 'Govt Universities (TISS, Central Unis): ₹40,000 – ₹1.2L total; Private Tech/Ed Colleges: ₹3L – ₹6L total.',
    institutes: ['Tata Institute of Social Sciences (TISS Mumbai)', 'Azim Premji University (Bengaluru)', 'Delhi University (CIE)', 'Jamia Millia Islamia'],
    incomeRange: 'Starting Learning Mentor: ₹5L – ₹9L LPA; Senior Pedagogical Designer: ₹12L – ₹22L LPA; Head of Learning Design: ₹30L – ₹48L LPA.',
    growthPath: 'Instructional Designer → Learning Architect → Curriculum Director → Chief Learning Officer (CLO).',
    whyItFits: 'Rewards students with high empathy who find profound joy in helping others learn, grow, and overcome obstacles.'
  },
  'community-health-innovator': {
    id: 'community-health-innovator',
    aliases: ['community health & wellness innovator', 'public health specialist', 'healthcare consultant', 'wellness innovator'],
    title: 'Community Health & Wellness Innovator',
    traitCode: 'S',
    traitName: 'The Helper',
    pathway: 'Class 10+2 (Biology/Science preferred) → B.Sc Nursing / BDS / B.Pharma / B.Sc Life Sciences → Master of Public Health (MPH) or Health Administration.',
    entranceExams: ['NEET-UG (for Allied Health / BDS / MBBS)', 'CUET-PG (for Central Universities MPH)', 'TISS-NET / CUET (for TISS Hospital & Health Systems)'],
    fees: 'Govt Institutes (AIIMS/TISS/JIPMER): ₹15,000 – ₹1L total; Private Health Academies: ₹4L – ₹9L total.',
    institutes: ['AIIMS New Delhi (Public Health)', 'TISS Mumbai (School of Health Systems)', 'Public Health Foundation of India (PHFI Gurgaon)', 'JIPMER Puducherry'],
    incomeRange: 'Starting Health Program Officer: ₹5.5L – ₹10L LPA; Senior Public Health Epidemiologist: ₹14L – ₹26L LPA; Director of Global Health: ₹35L – ₹60L LPA.',
    growthPath: 'Field Health Officer → Program Specialist → Health Policy Director → Regional Country Director.',
    whyItFits: 'Appeals to students who want to build a compassionate society, advance preventative health, and protect vulnerable communities.'
  },

  // -------------------------------------------------------------
  // C: THE ORGANIZER (2 Pathways)
  // -------------------------------------------------------------
  'data-logistics-operations-officer': {
    id: 'data-logistics-operations-officer',
    aliases: ['data logistics & operations officer', 'data operations lead', 'data analyst', 'database administrator', 'operations analyst'],
    title: 'Data Logistics & Operations Officer',
    traitCode: 'C',
    traitName: 'The Organizer',
    pathway: 'Class 10+2 with Math/Commerce/Science → B.Sc Statistics / B.Tech / BCA / B.Com (Analytics) → Database Certifications (SQL, Cloud Pipelines) → Operations Lead.',
    entranceExams: ['CUET (Top Central Unis Statistics/Analytics)', 'JEE Main', 'NIMCET (for MCA top NITs)'],
    fees: 'Govt Central Universities: ₹20,000 – ₹80,000 total; Tech Institutions: ₹3L – ₹8L total.',
    institutes: ['Indian Statistical Institute (ISI Kolkata / Delhi)', 'St. Xavier’s College Kolkata', 'IIT Madras (BS Data Science)', 'NIT Tiruchirappalli (MCA)'],
    incomeRange: 'Starting Data Analyst: ₹6.5L – ₹12L LPA; Senior Data Logistics Lead (4–7 yrs): ₹16L – ₹28L LPA; Chief Data Officer: ₹45L – ₹80L LPA.',
    growthPath: 'Database Analyst → Data Operations Engineer → Head of Enterprise Data Architecture → Chief Data Officer.',
    whyItFits: 'Thrives on organizing structured systems, designing clean database schemas, and eliminating operational errors.'
  },
  'financial-tech-quant-analyst': {
    id: 'financial-tech-quant-analyst',
    aliases: ['financial tech & quant analyst', 'fintech analyst', 'quantitative analyst', 'quant trader', 'financial analyst'],
    title: 'Financial Tech & Quant Analyst',
    traitCode: 'C',
    traitName: 'The Organizer',
    pathway: 'Class 10+2 with Math → B.Tech / B.Sc Statistics or Math / B.Com (Hons) → M.S. Quantitative Finance / Financial Engineering or CFA Certification.',
    entranceExams: ['JEE Advanced (Math & Computing branches)', 'CUET (Top Central Universities B.Com/Economics)', 'CAT (IIMs Finance)', 'CFA Examinations'],
    fees: 'Govt Institutes (IITs/DU): ₹50,000 – ₹3L total; Top B-Schools: ₹18L – ₹28L total.',
    institutes: ['IIT Kharagpur (Math & Computing)', 'IIT Kanpur', 'SRCC Delhi', 'IIM Ahmedabad', 'Indian Statistical Institute (ISI Kolkata)'],
    incomeRange: 'Starting Quantitative Analyst: ₹12L – ₹25L LPA; Senior Quant Strategist (4–7 yrs): ₹35L – ₹70L LPA; Quant Portfolio Lead: ₹1 Cr+ LPA.',
    growthPath: 'Quant Researcher → Algorithmic Trading Strategist → Portfolio Risk Director → Partner / Fund Manager.',
    whyItFits: 'Suits students who find beauty in structured financial rules, numerical accuracy, risk calculations, and mathematical models.'
  },

  // =============================================================
  // CAREER SWITCHER ROLES (8 TOTAL - ROLES 13 TO 20)
  // =============================================================

  // 13. Data & Business Intelligence Analyst
  'data-bi-analyst': {
    id: 'data-bi-analyst',
    aliases: ['data & business intelligence analyst', 'data bi analyst', 'business intelligence analyst', 'bi analyst', 'data analyst'],
    title: 'Data & Business Intelligence Analyst',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Operations, sales, finance, marketing, teaching, admin or any role that already works with reports.',
    pathway: 'Background in any field that uses reports or numbers → Upskill in Excel, SQL, Power BI or Tableau, and data storytelling → Build 3 portfolio dashboards using real or public data → Move into an analyst role.',
    entranceExams: ['Microsoft Power BI Data Analyst (PL-300)', 'Google Data Analytics Professional Certificate'],
    fees: 'Certification & Course Fees: ₹10,000 – ₹25,000 total.',
    institutes: ['Microsoft Learn', 'Google Career Certificates', 'Coursera', 'PathFinders Analytics Lab'],
    incomeRange: 'Starting Analyst: ₹6L – ₹12L LPA; Senior Analyst: ₹14L – ₹22L LPA; Analytics Manager / Head: ₹28L – ₹45L LPA.',
    growthPath: 'Data Analyst → Senior Analyst → Analytics Manager → Head of Analytics.',
    whyItFits: 'Suits operations, sales, finance, marketing, teaching, admin or any role that already works with reports.'
  },

  // 14. Business Analyst
  'business-analyst': {
    id: 'business-analyst',
    aliases: ['business analyst', 'ba', 'lead business analyst', 'senior business analyst'],
    title: 'Business Analyst',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Operations, QA, customer support, finance, IT support.',
    pathway: 'Background in operations, support, QA or finance → Upskill in requirement gathering, process mapping, basic SQL, Agile and Scrum → Document one real business problem as a case study → Move into a Business Analyst role.',
    entranceExams: ['IIBA ECBA (Entry Certificate in Business Analysis) or CCBA', 'Scrum Product Owner certificate (optional)'],
    fees: 'IIBA Exam & Training: ₹15,000 – ₹35,000 total.',
    institutes: ['International Institute of Business Analysis (IIBA)', 'Scrum Alliance', 'PathFinders BA Academy'],
    incomeRange: 'Starting BA: ₹7L – ₹13L LPA; Senior BA: ₹15L – ₹24L LPA; Product Owner / Head of BA: ₹30L – ₹50L LPA.',
    growthPath: 'Business Analyst → Senior Business Analyst → Product Owner or Product Manager → Head of Product or Business Analysis.',
    whyItFits: 'Suits operations, QA, customer support, finance, IT support.'
  },

  // 15. UX / Product Designer
  'ux-product-designer': {
    id: 'ux-product-designer',
    aliases: ['ux / product designer', 'ux designer', 'product designer', 'ui/ux designer', 'ui designer'],
    title: 'UX / Product Designer',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Graphic design, teaching, marketing, front-end development, content.',
    pathway: 'Background in design, content, marketing or front-end work → Upskill in user research, wireframing, Figma and usability testing → Build 2 to 3 case studies showing your process → Move into a UX role.',
    entranceExams: ['Google UX Design Professional Certificate (Portfolio matters most)'],
    fees: 'Portfolio Courses & Tools: ₹12,000 – ₹30,000 total.',
    institutes: ['Google Career Certificates', 'Interaction Design Foundation (IxDF)', 'PathFinders Design Studio'],
    incomeRange: 'Starting UX Designer: ₹6.5L – ₹12L LPA; Senior UX Designer: ₹16L – ₹28L LPA; Head of Design: ₹35L – ₹65L LPA.',
    growthPath: 'UX Designer → Senior UX Designer → Lead or Principal Designer → Head of Design.',
    whyItFits: 'Suits graphic design, teaching, marketing, front-end development, content.'
  },

  // 16. Digital Marketing & Growth Analyst
  'digital-marketing-growth-analyst': {
    id: 'digital-marketing-growth-analyst',
    aliases: ['digital marketing & growth analyst', 'digital marketing analyst', 'growth analyst', 'performance marketer', 'growth marketer'],
    title: 'Digital Marketing & Growth Analyst',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Sales, media, content, traditional marketing, event management.',
    pathway: 'Background in sales, content or offline marketing → Upskill in SEO, paid ads, analytics (GA4), email and marketing automation → Run one live campaign (your own or a small business) and report results → Move into a digital marketing role.',
    entranceExams: ['Google Analytics (GA4) Certification', 'Google Ads Certifications', 'HubSpot Academy Certifications'],
    fees: 'Certifications are free; Ad campaign practice budget: ₹5,000 – ₹15,000.',
    institutes: ['Google Skillshop', 'HubSpot Academy', 'Meta Blueprint', 'PathFinders Growth Labs'],
    incomeRange: 'Marketing Executive: ₹5L – ₹9L LPA; Growth/Performance Marketer: ₹12L – ₹22L LPA; Head of Marketing: ₹25L – ₹50L LPA.',
    growthPath: 'Marketing Executive → Growth or Performance Marketer → Marketing Manager → Head of Marketing.',
    whyItFits: 'Suits sales, media, content, traditional marketing, event management.'
  },

  // 17. Project / Program Manager
  'project-program-manager': {
    id: 'project-program-manager',
    aliases: ['project / program manager', 'project manager', 'program manager', 'pmo lead', 'project coordinator'],
    title: 'Project / Program Manager',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Engineering, construction, operations, teaching, defence, event management.',
    pathway: 'Background in a role that coordinates people, deadlines or budgets → Upskill in planning, risk, budgeting, stakeholder communication and tools such as Jira or MS Project → Document one project you led → Move into a project coordinator or manager role.',
    entranceExams: ['CAPM (entry level)', 'PMP (needs experience)', 'PRINCE2'],
    fees: 'PMI Membership & Exam: ₹25,000 – ₹45,000 total.',
    institutes: ['Project Management Institute (PMI)', 'AXELOS (PRINCE2)', 'PathFinders PM Academy'],
    incomeRange: 'Project Coordinator: ₹7L – ₹12L LPA; Project Manager: ₹14L – ₹25L LPA; Head of PMO / Director: ₹30L – ₹60L LPA.',
    growthPath: 'Project Coordinator → Project Manager → Program Manager → Head of PMO or Director.',
    whyItFits: 'Suits engineering, construction, operations, teaching, defence, event management.'
  },

  // 18. Learning & Development / Instructional Designer
  'ld-instructional-designer': {
    id: 'ld-instructional-designer',
    aliases: ['learning & development / instructional designer', 'instructional designer', 'l&d specialist', 'learning & development manager'],
    title: 'Learning & Development / Instructional Designer',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Teachers, trainers, HR, subject experts.',
    pathway: 'Background in teaching, training or HR → Upskill in learning design (ADDIE), e-learning tools such as Articulate, assessment design and learning analytics → Build a short e-learning course as a portfolio piece → Move into corporate L&D or EdTech.',
    entranceExams: ['ATD APTD', 'ATD CPTD'],
    fees: 'Courseware & Authoring Tools: ₹15,000 – ₹40,000 total.',
    institutes: ['Association for Talent Development (ATD)', 'Articulate 360 Training', 'PathFinders EdTech Studio'],
    incomeRange: 'Instructional Designer: ₹6L – ₹11L LPA; Senior L&D Specialist: ₹12L – ₹20L LPA; Head of Learning: ₹25L – ₹45L LPA.',
    growthPath: 'Instructional Designer → Senior L&D Specialist → L&D Manager → Head of Learning.',
    whyItFits: 'Suits teachers, trainers, HR, subject experts.'
  },

  // 19. Financial Analyst (FP&A and Risk)
  'financial-analyst-fpa-risk': {
    id: 'financial-analyst-fpa-risk',
    aliases: ['financial analyst (fp&a and risk)', 'financial analyst', 'fp&a analyst', 'risk analyst', 'financial modeling analyst'],
    title: 'Financial Analyst (FP&A and Risk)',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Accountants, CAs, bankers, auditors, credit analysts.',
    pathway: 'Background in accounting, banking or audit → Upskill in financial modelling, budgeting and forecasting, Power BI and basic Python → Build a model for a real or public company → Move into FP&A or risk analysis.',
    entranceExams: ['CMA', 'FRM (for risk)', 'CFA (optional, long-term)'],
    fees: 'Certification & Modeling Courses: ₹30,000 – ₹80,000 total.',
    institutes: ['IMA (Institute of Management Accountants)', 'GARP (Global Association of Risk Professionals)', 'CFA Institute (Optional)', 'PathFinders Finance Lab'],
    incomeRange: 'Financial Analyst: ₹8L – ₹15L LPA; Senior Analyst / FP&A Manager: ₹18L – ₹30L LPA; Finance Controller / CFO Track: ₹40L – ₹80L+ LPA.',
    growthPath: 'Financial Analyst → Senior Analyst or FP&A Manager → Finance Controller or Head of FP&A → CFO track.',
    whyItFits: 'Suits accountants, CAs, bankers, auditors, credit analysts.'
  },

  // 20. AI Application Developer
  'ai-application-developer': {
    id: 'ai-application-developer',
    aliases: ['ai application developer', 'ai developer', 'generative ai engineer', 'llm developer', 'ai engineer'],
    title: 'AI Application Developer',
    traitCode: 'Switcher',
    traitName: 'Career Switcher',
    suits: 'Web, backend or software developers only.',
    pathway: 'Background in web or backend development → Upskill in Python, LLM APIs, vector databases, RAG and FastAPI → Build 2 working apps, for example a document question-and-answer tool → Move into an AI developer role.',
    entranceExams: ['AWS Certified Machine Learning Engineer – Associate or Generative AI Developer – Professional', 'LangChain Certified Agent Engineer', 'Hugging Face Generative AI Development Specialization'],
    fees: 'Cloud Labs & Specialized Training: ₹15,000 – ₹45,000 total.',
    institutes: ['DeepLearning.AI', 'Hugging Face', 'LangChain Academy', 'AWS Training', 'PathFinders AI Lab'],
    incomeRange: 'Starting AI Developer: ₹12L – ₹24L LPA; Senior/Lead AI Engineer: ₹28L – ₹55L LPA; AI Architect: ₹60L – ₹1 Cr+ LPA.',
    growthPath: 'Software Developer → AI Application Developer → Senior or Lead AI Engineer → AI Architect.',
    whyItFits: 'Suits web, backend or software developers only.'
  }
};

// Helper to look up career data by text or role title
export function findVerifiedCareer(query) {
  if (!query) return null;
  const clean = query.toString().toLowerCase().trim();
  
  // Direct id check
  if (VERIFIED_CAREER_DATABASE[clean]) {
    return VERIFIED_CAREER_DATABASE[clean];
  }
  
  // Search aliases and titles
  for (const item of Object.values(VERIFIED_CAREER_DATABASE)) {
    if (item.id === clean || item.title.toLowerCase() === clean) {
      return item;
    }
    if (item.aliases && item.aliases.some((alias) => clean.includes(alias) || alias.includes(clean))) {
      return item;
    }
  }

  // Substring match
  for (const item of Object.values(VERIFIED_CAREER_DATABASE)) {
    if (clean.includes(item.traitName.toLowerCase()) || clean.includes(item.title.toLowerCase().slice(0, 10))) {
      return item;
    }
  }
  
  return null;
}
