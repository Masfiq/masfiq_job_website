/**
 * All site text lives in this file. Edit it to change what the site says;
 * you should not need to touch any layout code.
 *
 * Source of truth: the resume in public/resume.pdf. Keep the two in sync.
 *
 * Copy rules (enforced by `npm run build` via scripts/check-copy.mjs):
 *  - No em dashes, en dashes, or hyphens in visible text. Use commas, words,
 *    or "to" for ranges ("Aug 2024 to May 2026").
 *  - Only list tools and results that are true. Leave a field empty ('') and
 *    add a TODO comment instead of writing placeholder text; empty fields are
 *    hidden on the live page.
 *
 * `tone` picks a card color: 'teal' | 'blue' | 'green' | 'amber' | 'red' | 'violet'.
 *
 * Images (optional): put files in src/assets/ and write just the file name,
 * e.g. photo: 'masfiq.jpg' or image: 'harmonizer-dashboard.png'.
 * Astro resizes and converts them to WebP at build time.
 */

export type Tone = 'teal' | 'blue' | 'green' | 'amber' | 'red' | 'violet';

export const site = {
  name: 'Masfiq Reza',
  role: 'Software Engineer',
  headline: 'Software Engineer | MS Computer Science, Colorado State University',
  summary:
    'Builds tested backend and data software in Python and C#: REST APIs, concurrency safe transactions, and ETL pipelines with automated validation.',
  // Used for the browser tab, search results, and link previews.
  title: 'Masfiq Reza | Software Engineer',
  description:
    'Masfiq Reza builds tested backend and data software in Python and C#: REST APIs with FastAPI and ASP.NET Core, PostgreSQL, and ETL pipelines with automated validation. MS Computer Science, Colorado State University.',
  resume: '/resume.pdf',
  email: 'masfiq.reza@colostate.edu',
  linkedin: 'https://www.linkedin.com/in/masfiq-reza/',
  github: 'https://github.com/Masfiq',
  scholar: 'https://scholar.google.com/citations?user=U6CpooIAAAAJ&hl=en',
  medium: 'https://medium.com/@rezamasfiq',
  location: 'Fort Collins, Colorado',
  // TODO (optional): a professional headshot, e.g. 'masfiq.jpg' in src/assets/. Hidden while empty.
  photo: '',
};

export const nav = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export type ProjectIcon = 'pill' | 'search' | 'code' | 'database' | 'forest' | 'store' | 'cube' | 'flame';

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
  /** Optional screenshot file name in src/assets/ (e.g. 'harmonizer.png'). */
  image?: string;
  imageAlt?: string;
}

/** Main project grid, in display order. */
export const projects: Project[] = [
  {
    title: 'Pharmacy Order Fulfillment Service',
    label: 'Backend',
    description:
      'A central fill pharmacy backend with priority scheduling, safe concurrent stock updates, and a full audit trail.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    bullets: [
      'Built a central fill pharmacy backend with a heap based priority scheduler and an order state machine whose every transition is written to an audit log in the same database transaction.',
      'Prevented overselling with atomic conditional stock updates and database constraints; a test firing 20 simultaneous requests at stock for 7 orders yields exactly 7 fills and zero negative stock.',
      'Load tested at about 330 orders per second (p95 under 108 ms); in a simulated 8 hour day, emergency orders waited about 18 times less than routine ones; 102 tests at 98% coverage run in GitHub Actions.',
    ],
    github: 'https://github.com/Masfiq/pharmacy_fullfillment_service',
    icon: 'pill',
    tone: 'teal',
  },
  {
    title: 'Drug Lookup and Inventory API',
    label: 'Backend and data',
    description: 'A FastAPI service over 138,427 FDA drug records with fast, typo tolerant search.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Pandas'],
    bullets: [
      'Built an idempotent ETL pipeline loading 138,427 FDA drug records into a normalized PostgreSQL schema, logging all 5,366 data quality issues with reasons instead of silently dropping rows.',
      'Added typo tolerant search with trigram indexes, cutting fuzzy name search from 488.8 ms to 4.7 ms (104 times faster); other indexes sped up ingredient and expiry queries 33 and 82 times.',
      'Implemented first expiring, first out dispensing with row locks inside transactions; 87 tests at 97% coverage.',
    ],
    github: 'https://github.com/Masfiq/drug_lookup_inventory_api',
    icon: 'search',
    tone: 'blue',
  },
  {
    title: 'Pharmacy Inventory API in C#',
    label: 'C# and .NET',
    description: 'A layered ASP.NET Core REST API for pharmacy inventory with lot based dispensing.',
    tech: ['C#', 'ASP.NET Core', 'EF Core', 'SQLite', 'xUnit'],
    bullets: [
      'Built a layered REST API (Api, Core, Data) using dependency injection and repository interfaces, keeping business rules free of database code.',
      'Wrote lot dispensing as a pure function inside transactions, with ProblemDetails errors and a daily expiry alert.',
      '59 xUnit unit and integration tests (WebApplicationFactory) at 95.8% line coverage, run in GitHub Actions.',
    ],
    github: 'https://github.com/Masfiq/cSharp_inventory_api',
    icon: 'code',
    tone: 'violet',
  },
  {
    title: 'Colorado Inequality Data Harmonizer',
    label: 'Data engineering',
    description:
      'One validated, analysis ready table of Colorado census tract data built from five federal sources.',
    tech: ['Python', 'FastAPI', 'Streamlit', 'Pandas', 'GeoPandas'],
    bullets: [
      'Built an ETL pipeline merging five federal sources (ACS, HMDA, USDA Food Access Atlas, CDC PLACES, Census Gazetteer) into one 130 column table covering all 1,447 Colorado census tracts.',
      'Wrote 23 automated validation checks and a generated data dictionary; reconciled 2010 and 2020 tract boundaries with documented fallbacks instead of dropping the 27% of redrawn tracts.',
      'Served the versioned feature set through a FastAPI backend to a Streamlit dashboard with a live map.',
    ],
    github: 'https://github.com/Masfiq/colorado-inequality-harmonizer',
    icon: 'database',
    tone: 'amber',
  },
  {
    title: 'Aboveground Biomass Estimation',
    label: 'MS Thesis',
    description:
      'A deep learning regression pipeline that estimates forest biomass from sparse LiDAR labels and satellite data.',
    tech: ['Python', 'PyTorch', 'SLURM', 'GeoPandas'],
    bullets: [
      'Building a deep learning regression pipeline fusing sparse NASA GEDI LiDAR with Harmonized Landsat Sentinel imagery, Sentinel 1 radar, and gridMET climate data.',
      "Running data processing and model training jobs on CSU's Falcon HPC cluster with SLURM and Bash.",
    ],
    github: 'https://github.com/Masfiq/biomass_estimation_test',
    icon: 'forest',
    tone: 'green',
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
    tone: 'red',
  },
];

/** Smaller cards shown under the main grid. */
export const moreProjects: Project[] = [
  {
    title: 'Shop Management Web Application',
    description: 'Inventory and finance management for shops with multiple vendors, built with Django.',
    tech: ['Python', 'Django'],
    bullets: [],
    github: 'https://github.com/Masfiq/multi-vendor-shop-management-main',
    icon: 'store',
    tone: 'blue',
  },
  {
    title: 'Wildfire Risk Prediction',
    description: 'Feature engineering and model comparison under class imbalance.',
    tech: ['Python', 'scikit-learn', 'Pandas'],
    bullets: [],
    // TODO: https://github.com/Masfiq/wildfire-prediction (from the academic CV) returns 404,
    // so the repo is private or renamed. Make it public, then paste the URL here.
    github: '',
    icon: 'flame',
    tone: 'amber',
  },
];

/**
 * Hero slider: one diagram card per project, rotating every few seconds.
 * `project` must match a title in `projects` (the card's "Details" link scrolls to it).
 * Stats count up from 0; use `decimals` for numbers like 95.8.
 */
export interface Slide {
  project: string;
  steps: { label: string; text: string; tone: Tone; chips?: { name: string; tone: Tone }[]; check?: boolean }[];
  stats: { value: number; decimals?: number; prefix?: string; suffix?: string; unit: string; tone: Tone }[];
}

export const showcase: Slide[] = [
  {
    project: 'Pharmacy Order Fulfillment Service',
    steps: [
      { label: 'Receive', text: 'Prescription orders arrive', tone: 'teal', chips: [
        { name: 'Emergency', tone: 'red' },
        { name: 'Routine', tone: 'blue' },
      ] },
      { label: 'Schedule', text: 'Heap based priority scheduler', tone: 'blue' },
      { label: 'Fill', text: 'Atomic conditional stock updates prevent overselling', tone: 'amber' },
      { label: 'Audit', text: 'Every state transition logged in the same transaction', tone: 'violet', check: true },
    ],
    stats: [
      { value: 330, prefix: '~', unit: 'orders per second', tone: 'teal' },
      { value: 108, prefix: '<', suffix: ' ms', unit: 'p95 latency', tone: 'blue' },
      { value: 98, suffix: '%', unit: 'coverage, 102 tests', tone: 'green' },
    ],
  },
  {
    project: 'Drug Lookup and Inventory API',
    steps: [
      { label: 'Load', text: 'Idempotent ETL of FDA drug records into PostgreSQL', tone: 'teal' },
      { label: 'Validate', text: '5,366 data quality issues logged with reasons, none silently dropped', tone: 'amber' },
      { label: 'Search', text: 'Trigram indexes for typo tolerant name search', tone: 'blue', chips: [
        { name: '488.8 ms', tone: 'red' },
        { name: '4.7 ms', tone: 'green' },
      ] },
      { label: 'Dispense', text: 'First expiring, first out with row locks in transactions', tone: 'violet', check: true },
    ],
    stats: [
      { value: 138427, unit: 'FDA drug records', tone: 'teal' },
      { value: 104, suffix: '×', unit: 'faster fuzzy search', tone: 'blue' },
      { value: 97, suffix: '%', unit: 'coverage, 87 tests', tone: 'green' },
    ],
  },
  {
    project: 'Pharmacy Inventory API in C#',
    steps: [
      { label: 'Api', text: 'REST endpoints with ProblemDetails errors', tone: 'blue', chips: [
        { name: 'ASP.NET Core', tone: 'violet' },
      ] },
      { label: 'Core', text: 'Lot dispensing as a pure function, free of database code', tone: 'violet' },
      { label: 'Data', text: 'Repository interfaces over EF Core and SQLite', tone: 'amber' },
      { label: 'Test', text: 'xUnit unit and integration tests run in GitHub Actions', tone: 'green', check: true },
    ],
    stats: [
      { value: 59, unit: 'xUnit tests', tone: 'violet' },
      { value: 95.8, decimals: 1, suffix: '%', unit: 'line coverage', tone: 'green' },
      { value: 3, unit: 'layers: Api, Core, Data', tone: 'blue' },
    ],
  },
  {
    project: 'Colorado Inequality Data Harmonizer',
    steps: [
      { label: 'Ingest', text: 'Five federal sources', tone: 'blue', chips: [
        { name: 'ACS', tone: 'blue' },
        { name: 'HMDA', tone: 'green' },
        { name: 'USDA', tone: 'amber' },
        { name: 'CDC PLACES', tone: 'red' },
        { name: 'Gazetteer', tone: 'violet' },
      ] },
      { label: 'Transform', text: 'ETL in Python and Pandas, 2010 and 2020 tracts reconciled', tone: 'green' },
      { label: 'Validate', text: '23 automated validation checks', tone: 'amber', check: true },
      { label: 'Serve', text: 'FastAPI backend to a Streamlit dashboard map', tone: 'violet' },
    ],
    stats: [
      { value: 1447, unit: 'census tracts', tone: 'blue' },
      { value: 130, unit: 'columns', tone: 'green' },
      { value: 27, suffix: '%', unit: 'redrawn tracts kept', tone: 'amber' },
    ],
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

/** Same order as the resume. */
export const experience: Job[] = [
  {
    role: 'Graduate Research Assistant, AI Ready Inequality Data Hub',
    org: 'Colorado State University',
    location: 'Fort Collins, CO',
    dates: 'Aug 2026 to Present',
    details: [
      'Building Python ETL pipelines that clean, join, and validate federal socioeconomic data for Colorado census tracts.',
    ],
    tone: 'blue',
  },
  {
    role: 'Research Computing Support Technician',
    org: 'Colorado State University, Office of the Vice President for Research',
    location: 'Fort Collins, CO',
    dates: 'Sep 2026 to Present',
    details: [
      "Helping researchers get started on CSU's HPC systems and improve their Linux, SLURM, Python, and Bash workflows.",
      'Supporting test driven development of HPC tools and sponsored research projects that need computing and storage services.',
    ],
    tone: 'teal',
  },
  {
    role: 'Graduate Teaching Assistant',
    org: 'Colorado State University',
    location: 'Fort Collins, CO',
    dates: 'Aug 2024 to May 2026',
    details: [
      'Supported labs and recitations for Operating Systems, Modern Cybersecurity, and Modern Web Development.',
      'Wrote autograder scripts and gave detailed, rubric based feedback on assignments and exams.',
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
  {
    role: 'Student Tutor',
    org: 'BRAC University',
    location: 'Dhaka, Bangladesh',
    dates: 'Jun 2021 to Apr 2022',
    details: ['Taught Data Communications and introductory programming; graded and supported lab sections.'],
    tone: 'red',
  },
];

export const skills: { group: string; items: string[]; tone: Tone }[] = [
  {
    group: 'Languages',
    items: ['Python', 'C#', 'Java', 'C++', 'C', 'JavaScript', 'SQL', 'Bash', 'HTML', 'CSS'],
    tone: 'blue',
  },
  {
    group: 'Backend and web',
    items: ['FastAPI', 'ASP.NET Core', 'Entity Framework Core', 'SQLAlchemy', 'Alembic', 'Django'],
    tone: 'green',
  },
  {
    group: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'SQLite'],
    tone: 'amber',
  },
  {
    group: 'Testing and DevOps',
    items: ['pytest', 'xUnit', 'Selenium', 'TestNG', 'Postman', 'JMeter', 'Git', 'GitHub Actions', 'Docker'],
    tone: 'violet',
  },
  {
    group: 'Data and ML',
    items: ['Pandas', 'NumPy', 'scikit-learn', 'PyTorch', 'Parquet', 'ETL pipelines', 'Data validation', 'Linux'],
    tone: 'teal',
  },
  {
    group: 'Geospatial and HPC',
    items: ['GeoPandas', 'rasterio', 'NASA GEDI LiDAR', 'HLS imagery', 'Sentinel 1 SAR', 'SLURM'],
    tone: 'red',
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
    notes: ["VC's List (3 times)", "Dean's List (5 times)", 'University Merit Scholarship and Stipend'],
    tone: 'blue',
  },
];

export const writing = {
  papers:
    'Five papers, including WACV 2027 (accepted), ACM/IEEE ESEM 2025 (LLM based task recommendation for open source software), Data in Brief 2024, and IEEE TENCON 2021.',
  tutorials: 'Medium tutorials on NASA GEDI LiDAR, Harmonized Landsat Sentinel imagery, and the ADNI dataset.',
};

export const contact = {
  heading: 'Get in touch',
  text: 'Looking for software engineering roles. Email is the fastest way to reach me.',
};
