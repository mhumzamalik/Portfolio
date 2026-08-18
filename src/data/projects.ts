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
    id: "luxora",
    title: "LUXORA E-Commerce",
    category: "Full Stack",
    categories: ["Next.js", "E-Commerce", "Full Stack"],
    description:
      "A premium full-stack fashion e-commerce platform built for a modern shopping experience. LUXORA combines a cinematic storefront with powerful product management, secure checkout, inventory control, flash sales, coupons, and an admin dashboard.",
    image: "/projects/luxora.jpg",
    techStack: [
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Supabase",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
      "Zod",
      "React Hook Form",
      "Sentry"
    ],
    github: "https://github.com/mhamza/luxora",
    liveDemo: "https://luxorahz.vercel.app/",

    problem:
      "Many e-commerce platforms provide a basic shopping experience but lack a polished user interface, flexible product management, reliable inventory handling, and a seamless connection between the customer storefront and administrative operations.",

    solution:
      "LUXORA provides a production-focused e-commerce ecosystem with a premium responsive storefront, optimized product discovery, variant and size management, real-time inventory visibility, flash sales, coupons, secure checkout, order management, and a dedicated admin dashboard.",

    role: "Lead Full Stack Developer",

    duration: "6 Months",

    architecture: [
      "Frontend: Next.js 16 App Router with server and client components for a fast, SEO-friendly shopping experience.",
      "Database: PostgreSQL with Prisma ORM for strongly typed relational data management.",
      "Authentication: Secure customer and admin authentication with role-based authorization.",
      "Storage: Supabase Storage for product images and order payment proof uploads.",
      "State Management: React-based client state with optimized caching and request deduplication.",
      "Validation & Security: Zod validation, bcrypt password hashing, rate limiting, security headers, and protected API routes.",
      "Monitoring: Sentry for production error tracking and application monitoring.",
      "Deployment: Vercel with production-oriented caching and database connection optimization."
    ],

    features: [
      "Premium responsive fashion storefront with product discovery and category browsing.",
      "Advanced product management with images, primary image selection, variants, sizes, colors, and stock management.",
      "Automatic size availability with unavailable sizes disabled when inventory reaches zero.",
      "Best Seller and New Arrival homepage sections controlled directly from the admin panel.",
      "Flash Sale system with sale pricing, scheduling, and dedicated sale-product visibility.",
      "Shopping cart, wishlist, checkout, coupons, discounts, and shipping calculations.",
      "Customer order tracking and comprehensive admin order management.",
      "Admin dashboard for products, categories, inventory, orders, coupons, banners, and sales.",
      "Optimized product and homepage APIs with caching, request deduplication, and lean database queries.",
      "AI-powered shopping assistance for helping customers discover suitable products."
    ],

    challenges:
      "Building a reliable e-commerce platform required coordinating products, variants, inventory, pricing, flash sales, orders, and customer interactions while keeping the storefront fast. Maintaining a single source of truth for product availability and ensuring that products appear only in their intended homepage sections were particularly important challenges.",

    results:
      "Built a scalable full-stack e-commerce platform with a premium customer experience and centralized administration. Optimized API responses through Prisma query optimization, connection pooling, caching, and request deduplication while implementing production-focused security, monitoring, inventory management, and order workflows."
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
