export interface Project {
  id: string;
  title: string;
  category: 'React' | 'Next.js' | 'Node.js' | 'MongoDB' | 'Supabase' | 'Full Stack';
  categories: string[];
  description: string;
  image: string;
  techStack: string[];
  github: string;
  liveDemo: string;
  problem: string;
  solution: string;
  architecture: string[];
  features: string[];
  challenges: string;
  results: string;
  duration: string;
  role: string;
}

export const projects: Project[] = [
  {
    id: "zenith",
    title: "Zenith Workspace",
    category: "Full Stack",
    categories: ["Next.js", "Supabase", "Full Stack"],
    description: "A luxury project management application styled after Linear and Apple interfaces. Designed for high-performance software engineering teams with real-time syncing.",
    image: "/projects/zenith.jpg",
    techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion", "PostgreSQL"],
    github: "https://github.com/mhamza/zenith-workspace",
    liveDemo: "https://zenith-workspace.vercel.app",
    problem: "Traditional issue tracking and project management tools are sluggish, cluttered, and separate communication from documentation. Teams lose productivity waiting for page refreshes and looking for context.",
    solution: "Zenith brings real-time database subscriptions, clean typography, keyboard-centric controls, and minimal visual distraction together in an App-router React application.",
    role: "Lead Full Stack Developer",
    duration: "4 Months",
    architecture: [
      "Frontend: Next.js 15 (App Router) for hybrid static/dynamic generation.",
      "Database & Authentication: Supabase (PostgreSQL) with Row-Level Security (RLS).",
      "Real-time Syncing: Supabase Realtime Channels for immediate notification and board updates.",
      "State Management: React Query for optimistic updates and caching."
    ],
    features: [
      "Keyboard shortcuts (Cmd+K) for immediate workspace-wide actions.",
      "Drag-and-drop kanban boards with optimistic state updates.",
      "Real-time multiplayer cursor tracking and board state synchronization.",
      "Offline-first support using local storage persistence."
    ],
    challenges: "Synchronizing state across multiple active collaborative clients without race conditions or overwriting updates was a critical bottleneck. Optimistic updates in React Query sometimes conflicted with incoming database subscription channels.",
    results: "Designed a state consolidation engine that prioritizes user actions locally but rolls back smoothly if a validation error occurs. Active users reported 40% reduction in coordination overhead."
  },
  {
    id: "devflow",
    title: "DevFlow Q&A Platform",
    category: "Next.js",
    categories: ["Next.js", "MongoDB", "Full Stack"],
    description: "A comprehensive developer-focused community platform for asking questions, sharing knowledge, and networking, powered by AI recommendation algorithms.",
    image: "/projects/devflow.jpg",
    techStack: ["Next.js", "React.js", "MongoDB", "Node.js", "Tailwind CSS", "Redux Toolkit"],
    github: "https://github.com/mhamza/devflow",
    liveDemo: "https://devflow-qa.vercel.app",
    problem: "StackOverflow and similar QA websites often have harsh moderation and lack modern interactive systems, making it difficult for junior developers to receive fast, supportive, and context-relevant help.",
    solution: "DevFlow implements a community reputation engine, gamification elements, and an integrated AI assistant that parses questions and drafts immediate guidance while the community reviews.",
    role: "Full Stack Engineer",
    duration: "3 Months",
    architecture: [
      "Frontend: Next.js with Server Actions for simplified server-client transactions.",
      "Database: MongoDB with Mongoose schemas for dynamic community content storing.",
      "Search Engine: MongoDB Atlas Search with fuzzy mapping for instantaneous question discovery.",
      "AI Module: OpenAI API client integration for auto-answering and tag generation."
    ],
    features: [
      "Global Search with multi-index query lookup across questions, users, and tags.",
      "Interactive coding playground inside markdown question/answer sections.",
      "AI recommendation feeds tailored to user interests and tech badges.",
      "Badges and points reward system for answering unresolved topics."
    ],
    challenges: "MongoDB search performance was degraded under massive text queries. Tag relationships were complex to map efficiently inside a document database structure.",
    results: "Optimized indexing strategies and implemented MongoDB aggregation pipelines, boosting API query speeds by 60% and reducing database compute load."
  },
  {
    id: "aura-shop",
    title: "Aura Luxury E-commerce",
    category: "React",
    categories: ["React", "Supabase", "Full Stack"],
    description: "An high-end editorial shopping experience for high-fashion brands, featuring immersive product storytelling and seamless headless checkout flows.",
    image: "/projects/aura.jpg",
    techStack: ["React.js", "TypeScript", "Node.js", "Supabase", "Tailwind CSS", "React Query"],
    github: "https://github.com/mhamza/aura-shop",
    liveDemo: "https://aura-luxury.vercel.app",
    problem: "Typical e-commerce grids look generic and fail to communicate the luxury feeling of premium lifestyle brands, leading to lower engagement rates and high checkout bounce rates.",
    solution: "Aura blends high-contrast typography, video-centric collection views, page transitions, and a one-click checkout system to form an immersive magazine-style shopping flow.",
    role: "Frontend Developer",
    duration: "2 Months",
    architecture: [
      "Frontend: React.js with custom client routing.",
      "Styling: Vanilla CSS custom classes in combination with Tailwind variables.",
      "Payment: Stripe Checkout API integrating Apple Pay and standard cards.",
      "Media Hosting: Cloudinary CDN with optimized dynamic image sizing."
    ],
    features: [
      "Immersive video hover grids for dynamic model cataloguing.",
      "Interactive 3D product visualizer for key accessories.",
      "Persistent state checkout cart synchronized via local state.",
      "Clean filter drawers that adapt search criteria smoothly."
    ],
    challenges: "Heavy image and video payloads on the collection page caused significant layout shifts and reduced Lighthouse metrics below acceptable margins.",
    results: "Deployed modern Next-gen image wrappers, lazy loading, and blur placeholders, raising page speed scores to 95+."
  },
  {
    id: "node-task-engine",
    title: "Core Task Distributed Queue",
    category: "Node.js",
    categories: ["Node.js", "MongoDB"],
    description: "A fast, scalable backend background worker queue library in Node.js, providing fault-tolerant processing of millions of parallel processes.",
    image: "/projects/queue.jpg",
    techStack: ["Node.js", "Express.js", "MongoDB", "Redis", "TypeScript", "Docker"],
    github: "https://github.com/mhamza/task-engine",
    liveDemo: "https://npm.im/core-task-engine",
    problem: "Monolithic applications face system crashes and severe latency spikes when heavy workloads (like PDF processing or image conversions) are handled in the main execution thread.",
    solution: "Core Task Engine offloads processing to distributed background worker instances using a highly resilient Redis-backed messaging loop.",
    role: "Backend Architect",
    duration: "3 Months",
    architecture: [
      "Backend: Node.js (TypeScript) environment with native cluster clustering.",
      "Cache Store: Redis for task messaging, state locking, and execution queues.",
      "Database: MongoDB for persisting long-term execution records and logs.",
      "Deployment: Docker compose mapping containerized queue instances."
    ],
    features: [
      "Job prioritization queues with dynamic processing thresholds.",
      "Concurrency controls for limiting active workers per server.",
      "Automatic retry patterns with exponential backoff configurations.",
      "Real-time health monitoring dashboard showing server load."
    ],
    challenges: "Ensuring tasks were processed exactly-once in a multi-server setup, avoiding race conditions where two servers pull the same job simultaneously under heavy load.",
    results: "Utilized Redis atomic lock transactions (`SETNX`) to ensure strict transactional exclusivity. The worker handles up to 5,000 tasks per second under tests."
  }
];
