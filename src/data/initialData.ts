import type { Project, Skill, Education, Experience, SiteSettings, GalleryItem, ResumeMetadata } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Ultracapacitor-Based EV Charging Prototype',
    slug: 'ultracapacitor-based-ev-charging-prototype',
    summary: 'A wireless EV charging prototype using solar power and ultracapacitors for fast, efficient energy transfer with Arduino control.',
    description: 'Designed a wireless EV charging system concept that leverages solar power and ultracapacitor banks for rapid and efficient charging cycles. The system integrates an Arduino microcontroller to govern power regulation, supervise charge states, and present real-time charging status while simulated motion is tracked.',
    category: 'Engineering',
    technologies: ['Arduino', 'Ultracapacitors', 'Solar Energy', 'Wireless Charging', 'Sensors'],
    thumbnail: '/assets/projects/ev_charging_prototype.jpg',
    gallery: [
      '/assets/projects/ev_charging_prototype.jpg',
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: null,
    sourceCodeUrl: null,
    featured: true,
    published: true,
    sortOrder: 1,
    startDate: '2024',
    completionDate: '2024'
  },
  {
    id: 'proj-2',
    title: 'LED Distance Indicator Using Arduino',
    slug: 'led-distance-indicator-arduino',
    summary: 'An Arduino-based proximity indicator measuring distance with an ultrasonic sensor and displaying stepped visual LED feedback.',
    description: 'Engineered an embedded distance indicator featuring an ultrasonic HC-SR04 sensor paired with an Arduino microcontroller. Employs acoustic echo timing calculations to map obstacle proximity onto a multi-tier LED graduated bar display for intuitive, instant visual warnings.',
    category: 'Engineering',
    technologies: ['Arduino', 'Ultrasonic Sensor (HC-SR04)', 'LED Array', 'Embedded C'],
    thumbnail: '/assets/projects/arduino_distance.jpg',
    gallery: [
      '/assets/projects/arduino_distance.jpg',
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: null,
    sourceCodeUrl: null,
    featured: true,
    published: true,
    sortOrder: 2,
    startDate: '2023',
    completionDate: '2023'
  },
  {
    id: 'proj-3',
    title: 'Solar Tracker',
    slug: 'solar-tracker',
    summary: 'An automated solar tracking system that dynamically repositions PV panels perpendicular to incident sunlight.',
    description: 'Conceptualized and designed an automated solar tracking mechanism utilizing light-sensitive sensors and directional servos. By tracking the diurnal path of the sun to maintain perpendicular incidence, the system maximizes total daily kilowatt-hour yield compared to stationary photovoltaic installations.',
    category: 'Engineering',
    technologies: ['Photovoltaic (PV)', 'LDR Sensors', 'Servo Actuators', 'Renewable Energy'],
    thumbnail: '/assets/projects/solar_tracker.jpg',
    gallery: [
      '/assets/projects/solar_tracker.jpg',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: null,
    sourceCodeUrl: null,
    featured: true,
    published: true,
    sortOrder: 3,
    startDate: '2023',
    completionDate: '2024'
  }
];

export const initialSkills: Skill[] = [
  // Programming
  { id: 'skill-1', name: 'Python', category: 'Programming', proficiency: 85, published: true, sortOrder: 1 },
  { id: 'skill-2', name: 'C', category: 'Programming', proficiency: 80, published: true, sortOrder: 2 },
  
  // Web Development
  { id: 'skill-3', name: 'HTML5', category: 'Web Development', proficiency: 90, published: true, sortOrder: 3 },
  { id: 'skill-4', name: 'CSS3', category: 'Web Development', proficiency: 85, published: true, sortOrder: 4 },
  { id: 'skill-5', name: 'JavaScript', category: 'Web Development', proficiency: 78, published: true, sortOrder: 5 },

  // Digital Marketing
  { id: 'skill-6', name: 'Social Media Marketing', category: 'Digital Marketing', proficiency: 90, published: true, sortOrder: 6 },
  { id: 'skill-7', name: 'Digital Marketing Management', category: 'Digital Marketing', proficiency: 88, published: true, sortOrder: 7 },
  { id: 'skill-8', name: 'Campaign Planning & Strategy', category: 'Digital Marketing', proficiency: 85, published: true, sortOrder: 8 },

  // Creative & Productivity
  { id: 'skill-9', name: 'Canva', category: 'Creative & Productivity', proficiency: 92, published: true, sortOrder: 9 },
  { id: 'skill-10', name: 'Microsoft PowerPoint', category: 'Creative & Productivity', proficiency: 90, published: true, sortOrder: 10 },
  { id: 'skill-11', name: 'Microsoft Excel', category: 'Creative & Productivity', proficiency: 82, published: true, sortOrder: 11 },
  { id: 'skill-12', name: 'AI Tools for Content Creation', category: 'Creative & Productivity', proficiency: 92, published: true, sortOrder: 12 },

  // Technical Tools
  { id: 'skill-13', name: 'MATLAB', category: 'Technical Tools', proficiency: 80, published: true, sortOrder: 13 },
  { id: 'skill-14', name: 'Basic Machine Learning', category: 'Technical Tools', proficiency: 75, published: true, sortOrder: 14 },
  { id: 'skill-15', name: 'ProgeCAD', category: 'Technical Tools', proficiency: 78, published: true, sortOrder: 15 }
];

export const initialEducation: Education[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Technology — Electrical and Electronics Engineering (EEE)',
    institution: 'Seshadri Rao Gudlavalleru Engineering College (SRGEC)',
    location: 'Gudlavalleru, Andhra Pradesh',
    period: '2021 – 2025',
    grade: 'CGPA: 7.8',
    description: 'Comprehensive study of circuit theory, electrical machines, power systems, control engineering, renewable energy, and embedded microcontrollers.',
    sortOrder: 1,
    published: true
  },
  {
    id: 'edu-2',
    degree: 'Intermediate — MPC (Mathematics, Physics, Chemistry)',
    institution: 'Narayana Junior College, Gudivada',
    location: 'Gudivada, Andhra Pradesh',
    period: '2019 – 2021',
    grade: 'CGPA: 8.0',
    description: 'Strong foundation in analytical mathematics, physical sciences, and computational logic.',
    sortOrder: 2,
    published: true
  },
  {
    id: 'edu-3',
    degree: 'Secondary School Certificate (SSC / 10th Standard)',
    institution: 'Board of Secondary Education',
    location: 'Andhra Pradesh',
    period: '2019',
    grade: 'CGPA: 9.3',
    description: 'Completed secondary education with top honors and academic excellence.',
    sortOrder: 3,
    published: true
  }
];

export const initialExperience: Experience[] = [
  {
    id: 'exp-1',
    role: 'Social Media Manager',
    organization: 'Digital Marketing & Content Specialist',
    type: 'work',
    period: 'Professional Experience',
    duration: 'Ongoing',
    responsibilities: [
      'Manage social media accounts and coordinate daily audience engagement activities.',
      'Plan and execute digital marketing and online promotional campaigns.',
      'Develop promotional visual and copy content to boost brand visibility.',
      'Curate social media content calendars and design marketing roadmaps.',
      'Support brand awareness initiatives and community outreach.',
      'Explore AI-powered tools for streamlined creative asset generation.',
      'Coordinate promotions targeted to specific demographic customer segments.',
      'Apply web development and online business promotion strategies.'
    ],
    technologies: ['Canva', 'Social Media Analytics', 'AI Content Tools', 'Marketing Funnels'],
    published: true,
    sortOrder: 1
  },
  {
    id: 'exp-2',
    role: 'Machine Learning Intern',
    organization: 'Smart Bridge Education Services Pvt. Ltd.',
    type: 'internship',
    duration: '2 Months',
    period: '2-Month Intensive Program',
    description: 'Completed short-term intensive internship in Machine Learning. Focused on hands-on data cleaning, algorithm modeling in Python, regression, classification, and applying algorithms to practical engineering datasets.',
    technologies: ['Python', 'Machine Learning', 'Data Analysis', 'Jupyter'],
    published: true,
    sortOrder: 2
  },
  {
    id: 'exp-3',
    role: 'Energy Audit & Management Intern',
    organization: 'BIGETA Energy Solutions LLP',
    type: 'internship',
    duration: 'Industrial Internship',
    period: 'Industrial Training',
    description: 'Successfully completed specialized internship in Energy Audit and Management. Analyzed electrical load balance, evaluated industrial energy conservation parameters, and studied commercial energy efficiency strategies.',
    technologies: ['Energy Audit', 'Power Factor Analysis', 'Load Management', 'Electrical Systems'],
    published: true,
    sortOrder: 3
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Professional Portrait',
    url: '/assets/bhausri_portrait.jpg',
    mediaType: 'image',
    altText: 'Portrait of Bhausri Bezawada',
    caption: 'Official professional portrait of Bhausri Bezawada.',
    category: 'Profile',
    featured: true,
    published: true,
    sortOrder: 1
  },
  {
    id: 'gal-2',
    title: 'Engineering Hardware & Prototyping',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    altText: 'Electronics and microcontroller testing environment',
    caption: 'Laboratory and development work with embedded circuits and testing.',
    category: 'Engineering',
    featured: true,
    published: true,
    sortOrder: 2
  },
  {
    id: 'gal-3',
    title: 'Digital Marketing & Content Strategy',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    altText: 'Digital marketing analytics and campaign metrics',
    caption: 'Campaign workflow and brand visibility optimization.',
    category: 'Digital Marketing',
    featured: true,
    published: true,
    sortOrder: 3
  },
  {
    id: 'gal-4',
    title: 'Renewable Solar Energy Systems',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    altText: 'Photovoltaic solar installation',
    caption: 'Clean energy transition research and tracking prototypes.',
    category: 'Engineering',
    featured: true,
    published: true,
    sortOrder: 4
  }
];

export const initialResumeMetadata: ResumeMetadata = {
  id: 'resume-primary',
  title: 'Bhausri Bezawada — Curriculum Vitae',
  fileUrl: '/assets/bhanu_resume.pdf',
  fileName: 'Bhanu _ resume 1.pdf',
  fileType: 'application/pdf',
  fileSize: '218 KB',
  lastUpdated: 'October 2026',
  downloadLabel: 'Download Official Resume'
};

export const initialSiteSettings: SiteSettings = {
  siteTitle: 'Bhausri Bezawada | Professional Portfolio',
  ownerName: 'Bhausri Bezawada',
  primaryEmail: 'bhanubezawada1@gmail.com',
  phone: '9618624877',
  phoneVerified: true,
  location: 'Vijayawada, Andhra Pradesh, India',
  heroHeadline: 'Electrical & Electronics Engineering Graduate | Digital Marketing & Tech Enthusiast',
  heroBio: 'Passionate engineering graduate blending analytical rigor with modern web development, digital marketing, and AI-powered creative execution. Committed to continuous learning, innovation, and measurable impact.',
  heroPortrait: '/assets/bhausri_portrait.jpg',
  availabilityStatus: 'Open to Junior Technical & Digital Marketing Opportunities',
  defaultTheme: 'dark',
  whatsAppNumber: '919618624877',
  whatsAppPrefilledMessage: 'Hello Bhausri! I reviewed your portfolio and would like to connect with you.',
  resumeUrl: '/assets/bhanu_resume.pdf',
  aboutShortBio: 'A motivated engineering graduate from SRGEC (EEE) equipped with programming skills, digital marketing acumen, and real-world internship experience in machine learning and energy management.',
  aboutFullBio: 'Graduated in Electrical and Electronics Engineering from Seshadri Rao Gudlavalleru Engineering College. Through academic projects in EV charging and solar tracking, alongside practical roles in social media management and internships at Smart Bridge and BIGETA Energy Solutions, I have built a versatile foundation spanning technical engineering, software basics, and digital growth strategies.',
  careerObjective: 'An ambitious engineering graduate looking for an entry-level opportunity in a respected organization to apply my skills, gain hands-on experience, and grow professionally while supporting the success of the team and company.',
  strengths: [
    'Electrical & Electronics Engineering Foundation',
    'Python & C Programming Basics',
    'Modern Web Technologies (HTML5, CSS3, JS)',
    'Social Media Management & Digital Campaigns',
    'AI-Assisted Content Production & Productivity',
    'Collaborative Team Player & Quick Learner'
  ],
  sectionVisibility: {
    hero: true,
    about: true,
    skills: true,
    education: true,
    experience: true,
    projects: true,
    gallery: true,
    resume: true,
    contact: true
  },
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/bhanu-sri-bezawada', enabled: true },
    { platform: 'Email', url: 'mailto:bhanubezawada1@gmail.com', enabled: true },
    { platform: 'WhatsApp', url: 'https://wa.me/919618624877', enabled: true }
  ]
};
