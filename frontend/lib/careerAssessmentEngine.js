// 12-Question Career Switch Assessment Engine
// Connects user assessment responses (reason for switching, skills, interests, readiness)
// to calculate Skill Match %, recommended Pivot Target, and 9 transferable skill scores.

export const ASSESSMENT_QUESTIONS = [
  // SECTION 1: REASON FOR SWITCHING & MOTIVATION (Q1 - Q3)
  {
    id: 1,
    category: 'reason',
    categoryLabel: 'Reason for Switching',
    question: 'What is your primary motivation for making a career pivot?',
    options: [
      {
        id: 'growth_pay',
        label: 'Higher Salary & Industry Growth',
        desc: 'Seeking higher compensation and entering high-growth tech sectors',
        skillModifiers: { python: 5, ml: 5, mlops: 5 },
        pivotWeights: { 'Data & Business Intelligence Analyst': 3, 'AI Application Developer': 3 }
      },
      {
        id: 'passion_tech',
        label: 'Passion for AI, ML & Emerging Technologies',
        desc: 'Fascinated by generative AI, deep learning models, and automated logic',
        skillModifiers: { pytorch: 10, ml: 10, math: 5 },
        pivotWeights: { 'AI Application Developer': 4, 'Data & Business Intelligence Analyst': 2 }
      },
      {
        id: 'stagnation',
        label: 'Career Stagnation & Automation Risk',
        desc: 'Current domain is plateauing or vulnerable to AI replacement',
        skillModifiers: { git: 5, eda: 5 },
        pivotWeights: { 'Business Analyst': 3, 'Project / Program Manager': 2 }
      },
      {
        id: 'work_life',
        label: 'Better Work-Life Balance & Remote Flexibility',
        desc: 'Desire modern tech culture, hybrid flexibility, and creative autonomy',
        skillModifiers: { sql: 5, eda: 5 },
        pivotWeights: { 'UX / Product Designer': 3, 'Learning & Development / Instructional Designer': 3 }
      }
    ]
  },
  {
    id: 2,
    category: 'reason',
    categoryLabel: 'Reason for Switching',
    question: 'What is your intended timeframe to complete your career switch?',
    options: [
      {
        id: 'fast_3m',
        label: 'Immersive / Fast Track (3–4 Months)',
        desc: 'Dedicated full-time or intense study (>15 hrs/week)',
        readinessScore: 95,
        skillModifiers: { dsa: 5, python: 5, git: 5 }
      },
      {
        id: 'standard_6m',
        label: 'Balanced Part-Time (6 Months)',
        desc: 'Steady part-time upskilling alongside current employment (8–10 hrs/week)',
        readinessScore: 85,
        skillModifiers: { sql: 5, eda: 5 }
      },
      {
        id: 'flexible_12m',
        label: 'Gradual Transition (9–12 Months)',
        desc: 'Low-pressure pace (4–6 hrs/week)',
        readinessScore: 70,
        skillModifiers: { math: 5 }
      }
    ]
  },
  {
    id: 3,
    category: 'reason',
    categoryLabel: 'Reason for Switching',
    question: 'How aligned is your current domain experience with modern technology?',
    options: [
      {
        id: 'direct_tech',
        label: 'Software / IT / Engineering Background',
        desc: 'Write code, use databases, or manage software development',
        skillModifiers: { dsa: 18, python: 18, git: 16, sql: 10 },
        pivotWeights: { 'AI Application Developer': 4, 'Data & Business Intelligence Analyst': 3 }
      },
      {
        id: 'data_analyst',
        label: 'Analytics / Business Intelligence / Finance',
        desc: 'Excel, SQL queries, dashboards, or statistical reports',
        skillModifiers: { sql: 18, eda: 18, math: 12, python: 10 },
        pivotWeights: { 'Data & Business Intelligence Analyst': 4, 'Financial Analyst (FP&A and Risk)': 4 }
      },
      {
        id: 'core_engineering',
        label: 'Core Engineering / STEM / Operations',
        desc: 'Mechanical, Electrical, Civil, QA testing, or CAD design',
        skillModifiers: { math: 14, dsa: 10, git: 8 },
        pivotWeights: { 'Project / Program Manager': 4, 'Business Analyst': 3 }
      },
      {
        id: 'non_tech',
        label: 'Non-Technical / Business / Marketing / Sales',
        desc: 'Project management, client communication, or operations',
        skillModifiers: { eda: 10, git: 5 },
        pivotWeights: { 'UX / Product Designer': 3, 'Learning & Development / Instructional Designer': 3, 'Digital Marketing & Growth Analyst': 3 }
      }
    ]
  },

  // SECTION 2: SKILLS & TECHNICAL BASELINE (Q4 - Q6)
  {
    id: 4,
    category: 'skills',
    categoryLabel: 'Technical Competencies',
    question: 'What is your current level of programming experience?',
    options: [
      {
        id: 'prog_proficient',
        label: 'Fluent in Python / JavaScript / Java / C++',
        desc: 'Comfortable with OOP, APIs, debugging, and data structures',
        skillModifiers: { python: 20, dsa: 16, git: 14 },
        pivotWeights: { 'AI Application Developer': 4, 'Data & Business Intelligence Analyst': 2 }
      },
      {
        id: 'prog_basic',
        label: 'Basic Scripting & Syntax (Python / R / SQL)',
        desc: 'Can write simple scripts, loops, and data manipulation functions',
        skillModifiers: { python: 12, sql: 12, eda: 10 },
        pivotWeights: { 'Data & Business Intelligence Analyst': 3, 'Financial Analyst (FP&A and Risk)': 3 }
      },
      {
        id: 'prog_beginner',
        label: 'Beginner / Currently Learning',
        desc: 'Familiar with basic logic concepts; eager to learn Python',
        skillModifiers: { python: 6, dsa: 4 },
        pivotWeights: { 'Business Analyst': 3, 'Project / Program Manager': 3, 'UX / Product Designer': 2 }
      }
    ]
  },
  {
    id: 5,
    category: 'skills',
    categoryLabel: 'Technical Competencies',
    question: 'How comfortable are you with Data Wrangling & Databases?',
    options: [
      {
        id: 'sql_advanced',
        label: 'Advanced SQL & Data Pipelines',
        desc: 'JOINs, window functions, relational database schema design, and ETL',
        skillModifiers: { sql: 20, eda: 16, mlops: 10 },
        pivotWeights: { 'Data & Business Intelligence Analyst': 4, 'Financial Analyst (FP&A and Risk)': 3 }
      },
      {
        id: 'sql_basic',
        label: 'Intermediate SQL & Spreadsheets',
        desc: 'SELECT queries, GROUP BY, aggregations, and VLOOKUP / Pandas',
        skillModifiers: { sql: 14, eda: 12 },
        pivotWeights: { 'Business Analyst': 3, 'Digital Marketing & Growth Analyst': 3 }
      },
      {
        id: 'sql_none',
        label: 'Novice / Spreadsheet Only',
        desc: 'Primary experience is Excel tables and basic reporting',
        skillModifiers: { sql: 5, eda: 5 },
        pivotWeights: { 'UX / Product Designer': 3, 'Learning & Development / Instructional Designer': 3 }
      }
    ]
  },
  {
    id: 6,
    category: 'skills',
    categoryLabel: 'Technical Competencies',
    question: 'What is your background in Mathematics & Statistics?',
    options: [
      {
        id: 'math_strong',
        label: 'Strong Linear Algebra & Probability Calculus',
        desc: 'Engineering math background (vectors, matrices, derivatives, distributions)',
        skillModifiers: { math: 22, ml: 16, pytorch: 12 },
        pivotWeights: { 'Financial Analyst (FP&A and Risk)': 4, 'Data & Business Intelligence Analyst': 3 }
      },
      {
        id: 'math_moderate',
        label: 'Moderate Math Confidence (High School / Basic College)',
        desc: 'Understand basic statistics, averages, standard deviation, and algebra',
        skillModifiers: { math: 12, ml: 8 },
        pivotWeights: { 'Data & Business Intelligence Analyst': 3, 'Digital Marketing & Growth Analyst': 2 }
      },
      {
        id: 'math_refresher',
        label: 'Need Refresher / Practical Learner',
        desc: 'Prefer intuitive, code-first machine learning over deep equations',
        skillModifiers: { math: 5, ml: 4 },
        pivotWeights: { 'UX / Product Designer': 3, 'Project / Program Manager': 3 }
      }
    ]
  },

  // SECTION 3: INTERESTS & CAREER DIRECTION (Q7 - Q9)
  {
    id: 7,
    category: 'interests',
    categoryLabel: 'Interests & Focus',
    question: 'Which daily technical activity sounds most exciting to you?',
    options: [
      {
        id: 'focus_models',
        label: 'Building Intelligent AI & LLM Applications',
        desc: 'Developing RAG pipelines, API microservices, and AI-powered apps',
        skillModifiers: { python: 14, git: 12, mlops: 12 },
        pivotWeights: { 'AI Application Developer': 5 }
      },
      {
        id: 'focus_data_eng',
        label: 'Data Analytics & Business Intelligence',
        desc: 'Designing dashboards, SQL queries, KPI models, and business reporting',
        skillModifiers: { sql: 16, eda: 16, math: 8 },
        pivotWeights: { 'Data & Business Intelligence Analyst': 5, 'Financial Analyst (FP&A and Risk)': 3 }
      },
      {
        id: 'focus_fullstack',
        label: 'Digital Marketing & Growth Optimization',
        desc: 'Analyzing user funnels, running campaigns, SEO, and paid performance marketing',
        skillModifiers: { eda: 14, sql: 10, git: 8 },
        pivotWeights: { 'Digital Marketing & Growth Analyst': 5, 'UX / Product Designer': 3 }
      },
      {
        id: 'focus_product',
        label: 'Project Leadership & Business Analysis',
        desc: 'Gathering requirements, managing timelines, Jira workflows, and team deliverables',
        skillModifiers: { eda: 12, git: 10 },
        pivotWeights: { 'Project / Program Manager': 4, 'Business Analyst': 4 }
      }
    ]
  },
  {
    id: 8,
    category: 'interests',
    categoryLabel: 'Interests & Focus',
    question: 'What type of company environment do you target after switching?',
    options: [
      {
        id: 'target_product',
        label: 'Tech Product Unicorns & AI Startups',
        desc: 'Fast-paced, cutting-edge AI features, high compensation growth',
        pivotWeights: { 'AI Application Developer': 3, 'UX / Product Designer': 3 }
      },
      {
        id: 'target_enterprise',
        label: 'Enterprise Tech & Multinational GCCs',
        desc: 'Structured career ladders, robust MLOps infrastructure, stable teams',
        pivotWeights: { 'Data & Business Intelligence Analyst': 3, 'Financial Analyst (FP&A and Risk)': 3 }
      },
      {
        id: 'target_consulting',
        label: 'Tech Consulting & Digital Agencies',
        desc: 'Diverse domain exposure, client solutions, rapid project rotation',
        pivotWeights: { 'Business Analyst': 3, 'Project / Program Manager': 3 }
      }
    ]
  },
  {
    id: 9,
    category: 'interests',
    categoryLabel: 'Interests & Focus',
    question: 'How do you prefer to demonstrate your skills to recruiters?',
    options: [
      {
        id: 'demo_github',
        label: 'Live GitHub Repositories & Deployed Platforms',
        desc: 'Working Dockerized AI web systems and clean Jupyter notebooks',
        skillModifiers: { git: 12, mlops: 12 },
        pivotWeights: { 'AI Application Developer': 4, 'Data & Business Intelligence Analyst': 3 }
      },
      {
        id: 'demo_kaggle',
        label: 'Kaggle Competitions & Benchmark Datasets',
        desc: 'Demonstrated model accuracy scores and data science reports',
        skillModifiers: { ml: 12, eda: 12 },
        pivotWeights: { 'Data & Business Intelligence Analyst': 4, 'Financial Analyst (FP&A and Risk)': 3 }
      },
      {
        id: 'demo_certs',
        label: 'Verified Industry Certifications & Case Studies',
        desc: 'Recognized specialization certificates and end-to-end system design diagrams',
        skillModifiers: { sql: 8, git: 8 },
        pivotWeights: { 'Project / Program Manager': 3, 'Learning & Development / Instructional Designer': 3, 'Business Analyst': 3 }
      }
    ]
  },

  // SECTION 4: READINESS & COMMITMENT (Q10 - Q12)
  {
    id: 10,
    category: 'readiness',
    categoryLabel: 'Readiness & Commitment',
    question: 'How many hours per week can you consistently commit to upskilling?',
    options: [
      {
        id: 'hrs_high',
        label: '12–15+ Hours / Week',
        desc: 'Dedicated nights & full weekends',
        skillModifiers: { python: 8, ml: 8, pytorch: 8, mlops: 8 }
      },
      {
        id: 'hrs_mid',
        label: '8–11 Hours / Week',
        desc: 'Sustainable pace (1–2 hrs daily + weekend project work)',
        skillModifiers: { python: 5, ml: 5, pytorch: 5 }
      },
      {
        id: 'hrs_low',
        label: '4–7 Hours / Week',
        desc: 'Light weekend study pace',
        skillModifiers: { python: 2, ml: 2 }
      }
    ]
  },
  {
    id: 11,
    category: 'readiness',
    categoryLabel: 'Readiness & Commitment',
    question: 'How do you rate your readiness to work on hands-on practical projects?',
    options: [
      {
        id: 'ready_immediate',
        label: 'Ready to build real projects immediately',
        desc: 'Thrive on learning by doing and building portfolio projects',
        skillModifiers: { git: 8, mlops: 8, pytorch: 8 }
      },
      {
        id: 'ready_guided',
        label: 'Prefer structured guided tutorials first',
        desc: 'Like step-by-step code walkthroughs before building independently',
        skillModifiers: { eda: 6, sql: 6 }
      },
      {
        id: 'ready_conceptual',
        label: 'Prefer deep theoretical understanding first',
        desc: 'Desire solid foundational lectures before coding',
        skillModifiers: { math: 8, ml: 6 }
      }
    ]
  },
  {
    id: 12,
    category: 'readiness',
    categoryLabel: 'Readiness & Commitment',
    question: 'What is your primary constraint during this career switch?',
    options: [
      {
        id: 'const_time',
        label: 'Limited Time / Busy Current Job',
        desc: 'Need high-efficiency, targeted learning with zero fluff',
        skillModifiers: { python: 4, git: 4 }
      },
      {
        id: 'const_guidance',
        label: 'Lack of Industry Mentorship',
        desc: 'Need feedback from senior AI engineers to validate project quality',
        skillModifiers: { mlops: 4, pytorch: 4 }
      },
      {
        id: 'const_interview',
        label: 'Interview Readiness & Portfolio Presentation',
        desc: 'Need help translating past experience into AI domain resume language',
        skillModifiers: { eda: 4, sql: 4 }
      }
    ]
  }
];

// Baseline skills template with realistic initial scores
const BASELINE_SKILLS = [
  {
    id: 1,
    key: 'dsa',
    name: 'Data Structures & Algorithmic Logic',
    baseScore: 68,
    category: 'strong',
    categoryLabel: 'Strong Match',
    description: 'Core logic, data structures, and algorithmic thinking for scalable computing.'
  },
  {
    id: 2,
    key: 'python',
    name: 'Python & Object-Oriented Programming',
    baseScore: 64,
    category: 'strong',
    categoryLabel: 'Strong Match',
    description: 'Object-oriented programming, data structures, and Python library ecosystem.'
  },
  {
    id: 3,
    key: 'git',
    name: 'Git Version Control & CI/CD Pipelines',
    baseScore: 60,
    category: 'strong',
    categoryLabel: 'Strong Match',
    description: 'Collaborative code management, branch workflows, and deployment automation.'
  },
  {
    id: 4,
    key: 'sql',
    name: 'SQL Data Wrangling & Relational Schema Design',
    baseScore: 54,
    category: 'moderate',
    categoryLabel: 'Needs Work',
    description: 'Database queries, relational schema design, and analytical data transformation.',
    action: '📘 Course: Advanced SQL & Data Pipeline Engineering (2 Wks)'
  },
  {
    id: 5,
    key: 'math',
    name: 'Applied Linear Algebra & Matrix Calculus',
    baseScore: 48,
    category: 'moderate',
    categoryLabel: 'Needs Work',
    description: 'Vector spaces, matrix operations, and calculus optimization for machine learning.',
    action: '📐 Refresher: Applied Mathematics for AI & Machine Learning'
  },
  {
    id: 6,
    key: 'eda',
    name: 'Exploratory Data Analysis & Visualization',
    baseScore: 44,
    category: 'moderate',
    categoryLabel: 'Needs Work',
    description: 'Data profiling, statistical visualization, Pandas, and Seaborn techniques.',
    action: '📊 Lab: EDA & Feature Engineering on 5 Industry Datasets'
  },
  {
    id: 7,
    key: 'ml',
    name: 'Statistical Inference & ML Modeling',
    baseScore: 38,
    category: 'gap',
    categoryLabel: 'Skill Gap',
    description: 'Hypothesis testing, regression, classification, and Scikit-Learn algorithms.',
    action: '⚡ Module: Applied Machine Learning & Statistical Modeling (4 Wks)'
  },
  {
    id: 8,
    key: 'pytorch',
    name: 'Deep Learning & PyTorch Frameworks',
    baseScore: 32,
    category: 'gap',
    categoryLabel: 'Skill Gap',
    description: 'Neural network architectures, backpropagation, and PyTorch deep learning models.',
    action: '🛠️ Hands-on Project: Train & Fine-Tune PyTorch Vision/LLM Models'
  },
  {
    id: 9,
    key: 'mlops',
    name: 'MLOps & Model Deployment Pipelines',
    baseScore: 26,
    category: 'gap',
    categoryLabel: 'Skill Gap',
    description: 'Containerizing models with FastAPI, Docker, and cloud inference infrastructure.',
    action: '🚀 Practice Task: Deploy FastAPI ML Microservice on Cloud/Docker'
  }
];

// Target Pivot Catalog for calculating Top 3 Career Matches (8 Career Switcher Roles)
export const PIVOT_TARGETS_CATALOG = [
  {
    role: 'Data & Business Intelligence Analyst',
    tag: 'High Data Synergy',
    desc: 'Turn raw operational and business data into actionable dashboards, KPIs, and executive reporting models.',
    whyThisMatches: 'Suits operations, sales, finance, marketing, teaching, or admin. Strong synergy with Excel, SQL, and business reporting.',
    primaryGaps: ['SQL Data Wrangling & Relational Schema Design', 'Exploratory Data Analysis & Visualization'],
    weights: { sql: 1.5, eda: 1.5, python: 1.0, math: 0.9, git: 0.8, dsa: 0.7, ml: 0.6, mlops: 0.5, pytorch: 0.4 },
    roleOffset: 0
  },
  {
    role: 'Business Analyst',
    tag: 'Strategy & Process Mapping',
    desc: 'Bridge business operations and technology by gathering requirements, mapping workflows, and guiding Agile teams.',
    whyThisMatches: 'Suits operations, QA, customer support, finance, and IT support pivoting into requirement gathering and process optimization.',
    primaryGaps: ['Exploratory Data Analysis & Visualization', 'SQL Data Wrangling & Relational Schema Design'],
    weights: { sql: 1.3, eda: 1.3, git: 1.0, python: 0.8, dsa: 0.8, math: 0.7, ml: 0.6, mlops: 0.5, pytorch: 0.4 },
    roleOffset: -2
  },
  {
    role: 'UX / Product Designer',
    tag: 'User Experience & Visual Design',
    desc: 'Design empathetic user interfaces, wireframes, prototypes, and user research workflows in modern tools like Figma.',
    whyThisMatches: 'Suits graphic design, teaching, marketing, front-end development, and content pivoting into user-centered product design.',
    primaryGaps: ['Exploratory Data Analysis & Visualization', 'Git Version Control & CI/CD Pipelines'],
    weights: { eda: 1.4, git: 1.1, python: 0.7, dsa: 0.7, sql: 0.6, math: 0.5, ml: 0.5, mlops: 0.4, pytorch: 0.4 },
    roleOffset: -4
  },
  {
    role: 'Digital Marketing & Growth Analyst',
    tag: 'Performance & Growth Marketing',
    desc: 'Execute data-driven user acquisition, conversion rate optimization, SEO, and paid performance marketing campaigns.',
    whyThisMatches: 'Suits sales, media, content, traditional marketing, and event management pivoting into analytics and performance marketing.',
    primaryGaps: ['Exploratory Data Analysis & Visualization', 'SQL Data Wrangling & Relational Schema Design'],
    weights: { eda: 1.5, sql: 1.2, math: 0.9, python: 0.8, git: 0.7, ml: 0.6, dsa: 0.5, mlops: 0.4, pytorch: 0.3 },
    roleOffset: -6
  },
  {
    role: 'Project / Program Manager',
    tag: 'Execution & Stakeholder Delivery',
    desc: 'Coordinate multi-disciplinary teams, track deliverables, manage budgets and timelines using Agile/Scrum and Jira.',
    whyThisMatches: 'Suits engineering, construction, operations, teaching, defence, and event management pivoting into project leadership.',
    primaryGaps: ['Exploratory Data Analysis & Visualization', 'Git Version Control & CI/CD Pipelines'],
    weights: { git: 1.3, eda: 1.2, sql: 1.0, python: 0.8, dsa: 0.8, math: 0.7, mlops: 0.6, ml: 0.5, pytorch: 0.4 },
    roleOffset: -8
  },
  {
    role: 'Learning & Development / Instructional Designer',
    tag: 'Pedagogy & Talent Architecture',
    desc: 'Architect corporate training curricula, instructional learning modules, and interactive e-learning experiences.',
    whyThisMatches: 'Suits teachers, trainers, HR, and subject experts pivoting into corporate L&D, ADDIE framework, and EdTech platforms.',
    primaryGaps: ['Exploratory Data Analysis & Visualization', 'Applied Linear Algebra & Matrix Calculus'],
    weights: { eda: 1.3, math: 0.8, git: 0.8, sql: 0.7, python: 0.7, dsa: 0.6, ml: 0.5, mlops: 0.4, pytorch: 0.3 },
    roleOffset: -10
  },
  {
    role: 'Financial Analyst (FP&A and Risk)',
    tag: 'Financial Modeling & Forecasting',
    desc: 'Construct financial forecasts, FP&A variance models, risk assessments, and executive capital allocation plans.',
    whyThisMatches: 'Suits accountants, CAs, bankers, auditors, and credit analysts pivoting into financial modelling and risk analysis.',
    primaryGaps: ['Exploratory Data Analysis & Visualization', 'SQL Data Wrangling & Relational Schema Design'],
    weights: { math: 1.5, sql: 1.4, eda: 1.3, python: 1.1, dsa: 0.8, git: 0.7, ml: 0.6, mlops: 0.5, pytorch: 0.4 },
    roleOffset: -12
  },
  {
    role: 'AI Application Developer',
    tag: 'LLMs & Generative AI Systems',
    desc: 'Build production generative AI software, vector retrieval RAG pipelines, LLM agents, and FastAPI microservices.',
    whyThisMatches: 'Suits web, backend, and software developers pivoting into LLM APIs, vector databases, and AI application development.',
    primaryGaps: ['Deep Learning & PyTorch Frameworks', 'MLOps & Model Deployment Pipelines'],
    weights: { python: 1.5, git: 1.4, dsa: 1.3, mlops: 1.3, sql: 1.1, pytorch: 1.1, eda: 0.9, ml: 0.8, math: 0.7 },
    roleOffset: 0
  }
];

// Default answers start EMPTY so nothing is pre-selected
export const DEFAULT_ASSESSMENT_ANSWERS = {};

/**
 * Calculates weighted match score for a given target role based on skill evaluation
 */

export function calculateRoleMatchScore(roleName, calculatedSkillsMap, pivotWeightBoost = 0) {
  const targetObj = PIVOT_TARGETS_CATALOG.find((t) => t.role === roleName) || PIVOT_TARGETS_CATALOG[0];
  const weights = targetObj.weights;

  let totalWeightedScore = 0;
  let totalWeightSum = 0;

  Object.entries(weights).forEach(([key, weight]) => {
    const skillScore = calculatedSkillsMap[key] || 50;
    totalWeightedScore += skillScore * weight;
    totalWeightSum += weight;
  });

  const baseWeightedAvg = totalWeightedScore / totalWeightSum;
  const roleOffset = targetObj.roleOffset || 0;
  const finalScore = Math.min(94, Math.round(baseWeightedAvg + pivotWeightBoost + roleOffset));
  return Math.max(45, finalScore);
}

/**
 * Calculates deterministic Skill Match %, recommended Pivot Target, Top 3 Career Matches,
 * and 9 transferable skill scores based on selected option IDs.
 */
export function calculateAssessmentResults(answersMap = {}, targetPivotRole = null) {
  // 1. Accumulate skill boosts and pivot target weights
  const skillBoosts = {
    dsa: 0,
    python: 0,
    git: 0,
    sql: 0,
    math: 0,
    eda: 0,
    ml: 0,
    pytorch: 0,
    mlops: 0
  };

  const pivotWeights = {
    'Data & Business Intelligence Analyst': 0,
    'Business Analyst': 0,
    'UX / Product Designer': 0,
    'Digital Marketing & Growth Analyst': 0,
    'Project / Program Manager': 0,
    'Learning & Development / Instructional Designer': 0,
    'Financial Analyst (FP&A and Risk)': 0,
    'AI Application Developer': 0
  };

  let answeredCount = 0;

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const selectedOptionId = answersMap[q.id];
    if (selectedOptionId) {
      answeredCount++;
      const option = q.options.find((opt) => opt.id === selectedOptionId);
      if (option) {
        // Accumulate skill modifiers
        if (option.skillModifiers) {
          Object.entries(option.skillModifiers).forEach(([key, val]) => {
            if (skillBoosts[key] !== undefined) {
              skillBoosts[key] += val;
            }
          });
        }
        // Accumulate pivot weights
        if (option.pivotWeights) {
          Object.entries(option.pivotWeights).forEach(([tgt, weight]) => {
            if (pivotWeights[tgt] !== undefined) {
              pivotWeights[tgt] += weight;
            } else {
              pivotWeights[tgt] = weight;
            }
          });
        }
      }
    }
  });

  // 2. Compute final scores for 9 skills
  const calculatedSkillsMap = {};
  const calculatedSkills = BASELINE_SKILLS.map((base) => {
    const rawScore = base.baseScore + (skillBoosts[base.key] || 0);
    const finalScore = Math.min(92, Math.max(25, rawScore));
    calculatedSkillsMap[base.key] = finalScore;

    let category = 'gap';
    let categoryLabel = 'Skill Gap';
    if (finalScore >= 75) {
      category = 'strong';
      categoryLabel = 'Strong Match';
    } else if (finalScore >= 55) {
      category = 'moderate';
      categoryLabel = 'Needs Work';
    }

    return {
      ...base,
      score: finalScore,
      category,
      categoryLabel
    };
  });

  // 3. Compute exact single match score for each target role
  const topCareerMatches = PIVOT_TARGETS_CATALOG.map((item) => {
    const pivotBoost = (pivotWeights[item.role] || 0) * 2;
    const computedScore = calculateRoleMatchScore(item.role, calculatedSkillsMap, pivotBoost);
    return {
      ...item,
      score: computedScore
    };
  }).sort((a, b) => b.score - a.score);

  const recommendedPivotTarget = topCareerMatches[0]?.role || 'Data & Business Intelligence Analyst';
  const activeRole = targetPivotRole || recommendedPivotTarget;
  
  // Single Unified Match Score for the Active Target Role!
  const activeRoleObj = topCareerMatches.find((m) => m.role === activeRole) || topCareerMatches[0];
  const matchScore = activeRoleObj.score;

  // 4. Compute exact group averages for tooltip transparency
  const strongSkills = calculatedSkills.filter((s) => s.category === 'strong');
  const moderateSkills = calculatedSkills.filter((s) => s.category === 'moderate');
  const gapSkills = calculatedSkills.filter((s) => s.category === 'gap');

  const strongAvg = strongSkills.length > 0
    ? Math.round(strongSkills.reduce((a, b) => a + b.score, 0) / strongSkills.length)
    : 0;

  const moderateAvg = moderateSkills.length > 0
    ? Math.round(moderateSkills.reduce((a, b) => a + b.score, 0) / moderateSkills.length)
    : 0;

  const gapAvg = gapSkills.length > 0
    ? Math.round(gapSkills.reduce((a, b) => a + b.score, 0) / gapSkills.length)
    : 0;

  const isCompleted = answeredCount === 12;
  const isPreliminary = answeredCount < 12;

  return {
    matchScore,
    pivotTarget: recommendedPivotTarget,
    topCareerMatches,
    skillsList: calculatedSkills,
    answeredCount,
    totalQuestions: 12,
    isCompleted,
    isPreliminary,
    groupAverages: {
      strongAvg,
      strongCount: strongSkills.length,
      moderateAvg,
      moderateCount: moderateSkills.length,
      gapAvg,
      gapCount: gapSkills.length
    },
    answersMap
  };
}


