/**
 * All site text lives in this file. Edit it to change what the site says;
 * you should not need to touch any layout code.
 *
 * Copy rules (enforced by `npm run build` via scripts/check-copy.mjs):
 *  - No em dashes, en dashes, or hyphens in visible text. Use commas, words,
 *    or "to" for ranges ("Aug 2024 to May 2026").
 *  - Only list tools and results that are true. Leave a field empty ('') and
 *    add a TODO comment instead of writing placeholder text; empty fields are
 *    hidden on the live page.
 *
 * `tone` picks a card color: 'teal' | 'blue' | 'green' | 'amber' | 'red' | 'violet'.
 */

export type Tone = 'teal' | 'blue' | 'green' | 'amber' | 'red' | 'violet';

export const site = {
  name: 'Masfiq Reza',
  role: 'Software Engineer',
  headline: 'Software Engineer | MS Computer Science, Colorado State University',
  summary:
    'Builds data heavy software in Python: REST APIs, ETL pipelines with automated validation, and web applications.',
  // Used for the browser tab, search results, and link previews.
  title: 'Masfiq Reza | Software Engineer',
  description:
    'Masfiq Reza builds data heavy software in Python: REST APIs, ETL pipelines with automated validation, and web applications. MS Computer Science, Colorado State University.',
  resume: '/resume.pdf',
  email: 'masfiq.reza@colostate.edu',
  linkedin: 'https://www.linkedin.com/in/masfiq-reza/',
  github: 'https://github.com/Masfiq',
  scholar: 'https://scholar.google.com/citations?user=U6CpooIAAAAJ&hl=en',
  medium: 'https://medium.com/@rezamasfiq',
  location: 'Fort Collins, Colorado',
};

export const nav = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export type ProjectIcon = 'database' | 'forest' | 'store' | 'cube' | 'flame';

export interface Project {
  title: string;
  label?: string;
  description: string;
  tech: string[];
  bullets: string[];
  /** Leave '' to hide the GitHub button until a repo is public. */
  github: string;
  icon: ProjectIcon;
  tone: Tone;
}

/** Main project grid, in display order. */
export const projects: Project[] = [
  {
    title: 'Colorado Inequality Data Harmonizer',
    label: 'Data engineering',
    description:
      'One validated, analysis ready table of Colorado census tract data built from five federal sources.',
    tech: ['Python', 'FastAPI', 'Streamlit', 'Pandas', 'GeoPandas', 'scikit-learn'],
    bullets: [
      'Built an ETL pipeline merging five federal sources (ACS, HMDA, USDA Food Access Atlas, CDC PLACES, Census Gazetteer) into one 130 column table covering all 1,447 Colorado census tracts.',
      'Wrote 23 automated validation checks and a generated data dictionary; reconciled 2010 and 2020 tract boundaries with documented fallbacks instead of dropping the 27% of redrawn tracts.',
      'Served the versioned feature set through a FastAPI backend to a Streamlit dashboard with a live tract level map.',
    ],
    github: 'https://github.com/Masfiq/colorado-inequality-harmonizer',
    icon: 'database',
    tone: 'blue',
  },
  {
    title: 'Aboveground Biomass Estimation',
    label: 'MS Thesis',
    description:
      'A deep learning regression pipeline that estimates forest biomass from sparse LiDAR labels and satellite data.',
    tech: ['Python', 'PyTorch', 'SLURM', 'Bash', 'GeoPandas'],
    bullets: [
      'Building a deep learning regression pipeline that fuses sparse NASA GEDI LiDAR footprints with Harmonized Landsat Sentinel imagery, Sentinel 1 radar, and gridMET climate data.',
      'Frames biomass as a regression problem, not classification, and trains on sparse labels drawn from scattered LiDAR footprints.',
      "Running data processing and model training jobs on CSU's Falcon HPC cluster with SLURM and Bash.",
    ],
    github: 'https://github.com/Masfiq/biomass_estimation_test',
    icon: 'forest',
    tone: 'green',
  },
  {
    title: 'Shop Management Web Application',
    label: 'Web app',
    description: 'Inventory and finance management for shops with multiple vendors, built with Django.',
    tech: ['Python', 'Django'],
    bullets: ['Built a web application for multivendor shop inventory and finance management.'],
    github: 'https://github.com/Masfiq/multi-vendor-shop-management-main',
    icon: 'store',
    tone: 'amber',
  },
  {
    title: "Alzheimer's Disease Classification from MRI",
    label: 'Deep learning',
    description: "A custom 3D CNN that classifies Alzheimer's disease from MRI volumes.",
    tech: ['Python', 'PyTorch'],
    bullets: [
      "Designed a custom 3D CNN to classify Alzheimer's disease from MRI volumes in the ADNI dataset.",
      'Published at IEEE TENCON 2021.',
    ],
    github:
      'https://github.com/Masfiq/Neural_Network_Model_for_Classification_of_Alzeihmer_from_MRI_Images',
    icon: 'cube',
    tone: 'violet',
  },
];

/** Smaller cards shown under the main grid. */
export const moreProjects: Project[] = [
  {
    title: 'Wildfire Risk Prediction',
    description: 'Feature engineering and model comparison under class imbalance.',
    tech: ['Python', 'scikit-learn', 'Pandas'],
    bullets: [],
    // TODO: https://github.com/Masfiq/wildfire-prediction (from the academic CV) returns 404,
    // so the repo is private or renamed. Make it public, then paste the URL here.
    github: '',
    icon: 'flame',
    tone: 'red',
  },
];

export interface Job {
  role: string;
  org: string;
  location: string;
  dates: string;
  details: string[];
  tone: Tone;
  /** Set true to keep an entry out of the live page. */
  hidden?: boolean;
}

/** Newest first. */
export const experience: Job[] = [
  {
    role: 'Graduate Research Assistant, AI Ready Inequality Data Hub',
    org: 'Colorado State University, Department of Economics',
    location: 'Fort Collins, CO',
    dates: 'Aug 2026 to Present',
    details: [
      'Building Python ETL pipelines that clean, join, and validate federal socioeconomic data (ACS, HMDA, CDC PLACES) at the census tract level for a research data hub.',
    ],
    tone: 'blue',
  },
  {
    role: 'Research Computing Support Technician',
    org: 'Colorado State University',
    location: 'Fort Collins, CO',
    dates: 'Aug 2026 to Present',
    // TODO: Masfiq to provide duties, then set hidden to false.
    details: [],
    tone: 'teal',
    hidden: true,
  },
  {
    role: 'Graduate Teaching Assistant',
    org: 'Colorado State University',
    location: 'Fort Collins, CO',
    dates: 'Aug 2024 to May 2026',
    details: [
      'Supported labs and recitations for Operating Systems, Modern Cybersecurity, and Modern Web Development.',
      'Wrote autograder scripts to test student code and gave detailed, rubric based feedback on assignments and exams.',
      'Held office hours debugging student programs in C, C++, and Python on Linux, and taught Git workflows.',
    ],
    tone: 'green',
  },
  {
    role: 'Lecturer, Computer Science',
    org: 'Uttara University',
    location: 'Dhaka, Bangladesh',
    dates: 'Feb 2023 to July 2024',
    details: ['Taught undergraduate CS courses, built course materials, and graded assignments and exams.'],
    tone: 'amber',
  },
  {
    role: 'Trainee Software Engineer (SQA Automation)',
    org: 'BJIT Limited',
    location: 'Dhaka, Bangladesh',
    dates: 'Nov 2022 to Feb 2023',
    details: [
      'Built automated UI test suites in Java with Selenium and TestNG for web applications.',
      'Designed and executed test scenarios for API testing (Postman) and load testing (Apache JMeter).',
    ],
    tone: 'violet',
  },
];

export const skills: { group: string; items: string[]; tone: Tone }[] = [
  {
    group: 'Languages',
    items: ['Python', 'Java', 'C++', 'C', 'JavaScript', 'SQL', 'Bash', 'HTML', 'CSS'],
    tone: 'blue',
  },
  {
    group: 'Frameworks and libraries',
    items: ['FastAPI', 'Django', 'Streamlit', 'Node.js', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'GeoPandas'],
    tone: 'green',
  },
  {
    group: 'Databases and data',
    items: ['MySQL', 'Parquet', 'ETL pipelines', 'Data validation'],
    tone: 'amber',
  },
  {
    group: 'Tools',
    items: ['Git', 'Linux', 'SLURM (HPC)', 'Selenium', 'TestNG', 'Postman', 'Apache JMeter'],
    tone: 'violet',
  },
];

export const education: {
  degree: string;
  school: string;
  location: string;
  dates: string;
  grade: string;
  coursework: string;
  notes: string[];
  tone: Tone;
}[] = [
  {
    degree: 'Master of Science in Computer Science',
    school: 'Colorado State University',
    location: 'Fort Collins, CO',
    dates: 'Expected May 2027',
    grade: 'GPA 3.92/4.00',
    coursework: 'Natural Language Processing, Artificial Intelligence',
    notes: [],
    tone: 'teal',
  },
  {
    degree: 'Bachelor of Science in Computer Science and Engineering',
    school: 'BRAC University',
    location: 'Dhaka, Bangladesh',
    dates: '2018 to 2022',
    grade: 'CGPA 3.80/4.00',
    coursework: 'Data Structures, Algorithms, Object Oriented Programming, Database Systems',
    notes: ["VC's List (3 times)", "Dean's List (5 times)", 'University Merit Scholarship'],
    tone: 'blue',
  },
];

export const writing = {
  papers:
    'Five papers, including WACV 2027 (accepted), ACM/IEEE ESEM 2025 (LLM based task recommendation for open source software), IEEE TENCON 2021, and Data in Brief 2024.',
  tutorials: 'Medium tutorials on NASA GEDI LiDAR, Harmonized Landsat Sentinel imagery, and the ADNI dataset.',
};

export const contact = {
  heading: 'Get in touch',
  text: 'Looking for software engineering roles. Email is the fastest way to reach me.',
};
