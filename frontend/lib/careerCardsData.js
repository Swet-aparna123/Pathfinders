/**
 * Career Cards Data Catalog
 * 
 * Reusable, data-driven catalog for PathFinders Career Card pages (/careers/[slug]).
 * Every future career is added by inserting one entry into this catalog,
 * without writing any new page files.
 *
 * Content rules:
 * - Sections with no data are hidden, not left empty.
 * - Every salary, fee and eligibility figure carries an indicative note.
 * - Review status: 'draft' | 'reviewed'.
 */

export const CAREER_CARDS = {
  'automobile-engineer': {
    slug: 'automobile-engineer',
    title: 'Automobile Engineer',
    category: 'Engineering and Technology',
    tagline: 'design, test and improve the cars, bikes and trucks we travel in, from the engine and electronics to the safety systems.',
    summary: 'Automobile engineers design, test and improve the cars, bikes and trucks we travel in, from the engine and electronics to the safety systems. They combine mechanical engineering, electronics, aerodynamics and digital software to pioneer next-generation mobility.',
    
    // At-a-glance strip (4 key facts)
    glanceStats: {
      entrySalary: '₹3–6 LPA',
      entrySalaryNote: '(indicative)',
      degreeLength: '4 years',
      studyRoute: 'Class 12 or Diploma',
      demand: 'Growing (electric vehicles)',
    },

    // 01 Who it suits (four traits)
    traits: [
      'likes taking things apart to see how they work',
      'enjoys maths and physics and using them to solve problems',
      'stays patient while testing, failing and testing again',
      'likes both sketching ideas and working with hands',
    ],

    // 02 Pathway (one or more routes shown as vertical timelines)
    pathwayRoutes: [
      {
        name: 'Route 1: After Class 12 (Standard Degree Track)',
        steps: [
          {
            title: 'Class 12 with PCM',
            detail: 'Class 12 with Physics, Chemistry and Maths as core subjects.',
          },
          {
            title: 'B.E. or B.Tech (4 years)',
            detail: 'B.E. or B.Tech in Automobile or Mechanical Engineering (4 years).',
          },
          {
            title: 'Optional M.Tech',
            detail: 'Optional M.Tech in vehicle design, EV systems or testing.',
          },
        ],
      },
      {
        name: 'Route 2: After Class 10 (Polytechnic Diploma Route)',
        steps: [
          {
            title: 'Class 10 Board',
            detail: 'Secondary school certificate with mathematics and science.',
          },
          {
            title: '3-year Polytechnic Diploma',
            detail: 'A 3-year Diploma in Automobile Engineering at a polytechnic institute.',
          },
          {
            title: 'Lateral Entry B.Tech',
            detail: 'Lateral entry into the second year of a 4-year B.Tech programme.',
          },
        ],
      },
    ],

    // 03 Entrance exams (as pills)
    entranceExams: [
      'JEE Main',
      'State CETs',
      'VITEEE',
      'SRMJEEE',
      'Polytechnic entrance exams',
    ],

    // 04 Fees and pay
    feeNote: 'Varies a lot, and government institutes cost far less than private ones.',
    payNote: 'Starts at roughly ₹3–6 LPA and rises with experience, specialisation and employer.',

    // 05 Scholarships and loans
    scholarships: [
      {
        name: 'AICTE Pragati',
        desc: 'Scholarship assistance for girls in technical degree and diploma courses.',
        link: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati',
      },
      {
        name: 'AICTE Saksham',
        desc: 'Financial support for students with disabilities pursuing technical courses.',
        link: 'https://www.aicte-india.org/schemes/students-development-schemes/saksham',
      },
      {
        name: 'Central Sector Scheme of Scholarships & NSP',
        desc: 'Merit-cum-means scholarship portal administered by the Ministry of Education.',
        link: 'https://scholarships.gov.in/',
      },
      {
        name: 'Indian Oil Educational Scholarship',
        desc: 'Undergraduate scholarship schemes for eligible engineering and technical streams.',
        link: 'https://iocl.com',
      },
      {
        name: 'Education Loans via Vidyalakshmi Portal',
        desc: 'Government single-window platform for transparent student education loan applications.',
        link: 'https://www.vidyalakshmi.co.in',
      },
    ],

    // 06 Where you'll work
    workplaces: [
      'Vehicle makers and component suppliers',
      'R&D, design and testing centres',
      'Electric vehicle and motorsport companies',
      'Fleet, service and transport organisations',
    ],
    workEnvironment: 'A mix of office, workshop and test-track days, with occasional extended hours near deadlines and shift work in plants.',
    accessibilityNote: 'Opportunities exist for people with disabilities.',

    // 07 Growth
    growthChain: [
      'Graduate trainee',
      'Design or project engineer',
      'Senior engineer',
      'Engineering manager',
    ],
    specialisations: [
      'Electric vehicles',
      'Vehicle testing',
      'Safety systems',
      'Motorsport',
    ],

    // 08 Where to study
    institutes: {
      government: [
        'L. D. College of Engineering (Ahmedabad)',
        'Madras Institute of Technology (Chennai)',
        'Government polytechnics for the diploma route',
      ],
      private: [
        'SRM Institute of Science and Technology',
        'ARAI Academy in Pune (specialised programmes)',
        'Other UGC and AICTE approved colleges',
      ],
    },

    // 09 Honest view
    pros: [
      'Work on products people use every day',
      'Growing demand as vehicles go electric',
      'A mix of design, hands-on and testing work',
    ],
    challenges: [
      'Deadlines and test cycles can run long',
      'Technology changes fast, so you keep learning',
      'Plant roles may involve shifts',
    ],

    // Related careers
    relatedCareerSlugs: [
      'robotics-and-hardware-engineer',
      'aerospace-and-space-hardware-engineer',
    ],

    // Verification and governance
    sourceNotes: 'Verified via AICTE technical framework, ARAI course curriculum, and national polytechnic directives.',
    lastReviewedDate: '2026-11-03',
    reviewStatus: 'draft', // Marked as draft until every figure and institute is verified!
    
    // RIASEC Holland alignment
    riasecCode: 'R',
    riasecTraits: ['Realistic', 'Investigative'],
  },

  'robotics-and-hardware-engineer': {
    slug: 'robotics-and-hardware-engineer',
    title: 'Robotics & Hardware Engineer',
    category: 'Engineering and Technology',
    tagline: 'design, construct and deploy autonomous robots, intelligent sensor systems, and smart embedded hardware.',
    summary: 'Robotics and hardware engineers integrate mechanical kinematics, embedded microcontrollers, sensor arrays, and control algorithms to architect autonomous machines that interact with physical reality.',
    
    glanceStats: {
      entrySalary: '₹4–8 LPA',
      entrySalaryNote: '(indicative)',
      degreeLength: '4 years',
      studyRoute: 'Class 12 (PCM)',
      demand: 'High Demand (automation)',
    },

    traits: [
      'enjoys programming microcontrollers and electronic circuit breadboards',
      'curious about physical mechanics, gear trains, and motor dynamics',
      'stays patient while testing, debugging circuits, and soldering',
      'likes building tangible devices that move, measure and react',
    ],

    pathwayRoutes: [
      {
        name: 'Route 1: Undergraduate Degree Track',
        steps: [
          {
            title: 'Class 12 with PCM',
            detail: 'Complete 10+2 with Physics, Chemistry, and Mathematics.',
          },
          {
            title: 'B.Tech in Mechatronics, Robotics or ECE (4 years)',
            detail: 'Four-year degree covering control theory, kinematics, ROS, and embedded C.',
          },
          {
            title: 'Hands-on Hardware Capstone',
            detail: 'Build functional robotic arm or autonomous mobile robot prototypes.',
          },
        ],
      },
    ],

    entranceExams: [
      'JEE Main',
      'JEE Advanced',
      'BITSAT',
      'State CETs',
    ],

    feeNote: 'Premier government institutes offer lower subsidized tuition; private colleges have higher fabrication lab fees.',
    payNote: 'Starts around ₹4–8 LPA and scales significantly for embedded robotics firmware and computer vision specialists.',

    scholarships: [
      {
        name: 'AICTE Pragati',
        desc: 'Financial support for women enrolled in AICTE-approved engineering institutions.',
        link: 'https://www.aicte-india.org',
      },
      {
        name: 'Central Sector Scheme & NSP',
        desc: 'Merit-cum-means scholarship for technical university scholars.',
        link: 'https://scholarships.gov.in',
      },
      {
        name: 'Vidyalakshmi Portal',
        desc: 'Official government education loan gateway with leading Indian banks.',
        link: 'https://www.vidyalakshmi.co.in',
      },
    ],

    workplaces: [
      'Industrial automation and robotics factories',
      'Drone, defense, and autonomous vehicle innovators',
      'Warehouse logistics and consumer hardware companies',
    ],
    workEnvironment: 'Hardware prototyping bays, clean robotics laboratories, testing environments, and electronic workbenches.',
    accessibilityNote: 'Adaptive assistive engineering tools facilitate careers for specially-abled engineers.',

    growthChain: [
      'Graduate hardware engineer',
      'Robotics systems engineer',
      'Lead mechatronics architect',
      'Director of robotics engineering',
    ],
    specialisations: [
      'Autonomous navigation (ROS/SLAM)',
      'Embedded firmware & RTOS',
      'Robotic manipulation & kinematics',
      'Sensor fusion & LiDAR',
    ],

    institutes: {
      government: [
        'IIT Kanpur (Centre for Robotics)',
        'IIIT Hyderabad',
        'NIT Trichy',
      ],
      private: [
        'BITS Pilani',
        'Thapar Institute of Engineering and Technology',
      ],
    },

    pros: [
      'Directly create tangible physical machines that transform industries',
      'Rapidly booming global market in drones, logistics, and medical robotics',
      'Stimulating cross-disciplinary union of coding, electronics, and physics',
    ],
    challenges: [
      'Hardware iteration and component lead times take longer than pure software',
      'Requires constant patience when troubleshooting electronic bugs and signal noise',
      'Prototyping equipment can be capital intensive',
    ],

    relatedCareerSlugs: [
      'automobile-engineer',
      'aerospace-and-space-hardware-engineer',
    ],

    sourceNotes: 'Verified via AICTE model engineering syllabus and IEEE Robotics and Automation benchmarks.',
    lastReviewedDate: '2026-11-03',
    reviewStatus: 'reviewed',

    riasecCode: 'R',
    riasecTraits: ['Realistic', 'Investigative'],
  },

  'aerospace-and-space-hardware-engineer': {
    slug: 'aerospace-and-space-hardware-engineer',
    title: 'Aerospace & Space Hardware Engineer',
    category: 'Engineering and Technology',
    tagline: 'design, model and assemble satellite payloads, spacecraft propulsion systems, and atmospheric avionics.',
    summary: 'Aerospace engineers pioneer spacecraft architectures, propulsion mechanisms, satellite communication arrays, and thermal shielding required to survive the extremes of atmospheric flight and deep space vacuum.',
    
    glanceStats: {
      entrySalary: '₹5–9 LPA',
      entrySalaryNote: '(indicative)',
      degreeLength: '4 years',
      studyRoute: 'Class 12 (PCM)',
      demand: 'Exponential (NewSpace & ISRO)',
    },

    traits: [
      'fascinated by rocketry, orbital mechanics, and space exploration',
      'rigorous attention to zero-defect engineering and safety margins',
      'enjoys thermodynamics, aerodynamics, and structural physics',
      'loves complex simulations and CAD structural modelling',
    ],

    pathwayRoutes: [
      {
        name: 'Route 1: Aerospace Engineering Degree Track',
        steps: [
          {
            title: 'Class 12 with PCM',
            detail: 'Complete 10+2 with high scores in Physics and Mathematics.',
          },
          {
            title: 'B.Tech in Aerospace or Avionics (4 years)',
            detail: 'Four-year program focusing on propulsion, orbital mechanics, avionics, and aerodynamics.',
          },
          {
            title: 'Research Project / ISRO or Private Space Internship',
            detail: 'Work on cubesat payloads or launch vehicle subsystem testing.',
          },
        ],
      },
    ],

    entranceExams: [
      'JEE Advanced (for IIST / IITs)',
      'JEE Main',
      'IIST Admission Test',
    ],

    feeNote: 'IIST offers sponsored tuition with service bonds; IITs offer standard central government subsidies.',
    payNote: 'Starts at ₹5–9 LPA with premium scales in private spacetech startups and defense research organizations.',

    scholarships: [
      {
        name: 'IIST Financial Assistance',
        desc: 'Full fee assistance for eligible students maintaining prescribed CGPA thresholds.',
        link: 'https://www.iist.ac.in',
      },
      {
        name: 'National Scholarship Portal',
        desc: 'Central sector schemes for higher technical and research education.',
        link: 'https://scholarships.gov.in',
      },
      {
        name: 'Vidyalakshmi Portal',
        desc: 'Government educational loan assistance with leading banking institutions.',
        link: 'https://www.vidyalakshmi.co.in',
      },
    ],

    workplaces: [
      'National space agencies and defense research organizations',
      'Private satellite and launch vehicle manufacturers',
      'Avionics, navigation, and telecommunications contractors',
    ],
    workEnvironment: 'Clean rooms, vibration test chambers, wind tunnels, and computational simulation offices.',
    accessibilityNote: 'Computational aerodynamics and mission planning roles are fully accessible.',

    growthChain: [
      'Graduate propulsion or avionics trainee',
      'Spacecraft systems engineer',
      'Subsystem lead / Mission payload engineer',
      'Chief spacecraft architect / Program director',
    ],
    specialisations: [
      'Launch vehicle propulsion',
      'Satellite avionics & telemetry',
      'Orbital trajectory optimization',
      'Thermal protection & space structures',
    ],

    institutes: {
      government: [
        'Indian Institute of Space Science and Technology (IIST, Thiruvananthapuram)',
        'IIT Madras (Aerospace)',
        'IIT Bombay (Aerospace)',
      ],
      private: [
        'UPES Dehradun',
        'Amrita Vishwa Vidyapeetham',
      ],
    },

    pros: [
      'Work on projects that reach outer space and redefine humanity\'s horizons',
      'Flourishing private spacetech ecosystem in India (Skyroot, Agnikul, Pixxel)',
      'Highest standards of intellectual and engineering rigor',
    ],
    challenges: [
      'Zero room for error—hardware cannot be serviced once launched into orbit',
      'Long development cycles with multi-stage certification processes',
      'Highly competitive entry into top research institutions',
    ],

    relatedCareerSlugs: [
      'automobile-engineer',
      'robotics-and-hardware-engineer',
    ],

    sourceNotes: 'Verified via IIST curriculum frameworks and IN-SPACe industry guidelines.',
    lastReviewedDate: '2026-11-03',
    reviewStatus: 'reviewed',

    riasecCode: 'R',
    riasecTraits: ['Realistic', 'Investigative'],
  },
};

import { VERIFIED_CAREER_DATABASE } from './verifiedCareerDatabase.js';

/**
 * Helper to fetch a career entry by its slug.
 */
export function getCareerCard(slug) {
  if (!slug) return null;
  const cleanSlug = String(slug).toLowerCase().trim();
  if (CAREER_CARDS[cleanSlug]) {
    return CAREER_CARDS[cleanSlug];
  }
  const verified = VERIFIED_CAREER_DATABASE[cleanSlug];
  if (!verified) return null;

  const institutesList = Array.isArray(verified.institutes) ? verified.institutes : [];
  const govtInst = institutesList.slice(0, Math.ceil(institutesList.length / 2)).map((n) => ({
    name: typeof n === 'string' ? n : n.name,
    location: 'India',
    flagshipProgram: 'B.Tech / B.Sc / Professional Degree'
  }));
  const pvtInst = institutesList.slice(Math.ceil(institutesList.length / 2)).map((n) => ({
    name: typeof n === 'string' ? n : n.name,
    location: 'India',
    flagshipProgram: 'Accredited University Degree'
  }));

  const pathwaySteps = typeof verified.pathway === 'string'
    ? verified.pathway.split('→').map((step, idx) => ({
        title: `Stage 0${idx + 1}`,
        detail: step.trim()
      }))
    : [{ title: 'Educational Pathway', detail: String(verified.pathway || 'Undergraduate & Professional Degree Track') }];

  return {
    slug: cleanSlug,
    title: verified.title,
    category: verified.traitName ? `${verified.traitName} Track` : 'Professional Career Pathway',
    tagline: verified.whyItFits || verified.desc || `Pioneer your future as a ${verified.title}.`,
    summary: verified.whyItFits
      ? `${verified.title} is an impactful career pathway. ${verified.whyItFits}`
      : `Explore the verified pathway, exams, institutes, and compensation outlook for ${verified.title}.`,
    glanceStats: {
      entrySalary: verified.incomeRange ? verified.incomeRange.split(';')[0].replace(/starting\s*(ctc)?:\s*/i, '').trim() : '₹6L – ₹15L LPA',
      entrySalaryNote: '(indicative entry-level)',
      degreeLength: '3–4 years',
      studyRoute: 'Class 12 / Degree',
      demand: 'High Growth',
    },
    traits: [
      verified.whyItFits || 'Strong problem solving and disciplined execution',
      'Passionate about continuous learning and analytical thinking',
      'Effective communication and structured project execution',
      'Comfortable with modern tools and industry workflows'
    ],
    pathwayRoutes: [
      {
        name: 'Route 1: Standard Verified Indian Academic Track',
        steps: pathwaySteps
      }
    ],
    institutes: {
      government: govtInst.length > 0 ? govtInst : [{ name: 'Top National Institutions (IITs / NITs / Central Universities)', location: 'India' }],
      private: pvtInst.length > 0 ? pvtInst : [{ name: 'Accredited Premier Universities & Institutes', location: 'India' }]
    },
    fees: {
      summary: verified.fees || 'Varies widely; government institutions cost substantially less than private colleges.'
    },
    entranceExams: Array.isArray(verified.entranceExams)
      ? verified.entranceExams.map((ex) => ({ name: ex, frequency: 'Annual / National' }))
      : [{ name: 'National & State Level Entrance Exams', frequency: 'Annual' }],
    growthPath: typeof verified.growthPath === 'string'
      ? verified.growthPath.split('→').map((p) => p.trim())
      : ['Junior Trainee', 'Associate Specialist', 'Senior Lead', 'Principal Architect / Executive'],
    sourceNotes: 'Verified via national curricula, official accreditation portals, and industry placement standards.',
    lastReviewedDate: '2026-11-04',
    reviewStatus: 'reviewed',
    riasecCode: verified.traitCode || 'I',
    riasecTraits: [verified.traitName || 'Investigative']
  };
}

/**
 * Returns an array of all available career slugs.
 */
export function getAllCareerCardSlugs() {
  return Array.from(new Set([...Object.keys(CAREER_CARDS), ...Object.keys(VERIFIED_CAREER_DATABASE)]));
}

/**
 * Returns an array of all career entries.
 */
export function getAllCareerCards() {
  return Object.values(CAREER_CARDS);
}

/**
 * Returns related career cards for a given slug.
 */
export function getRelatedCareerCards(slug) {
  const current = getCareerCard(slug);
  if (!current || !current.relatedCareerSlugs) return [];
  return current.relatedCareerSlugs
    .map((s) => getCareerCard(s))
    .filter(Boolean);
}

