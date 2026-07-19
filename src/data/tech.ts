export interface Technology {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud' | 'Tools' | 'DevOps';
  level: 'Expert' | 'Advanced' | 'Proficient' | 'Intermediate';
  description: string;
  projectsUsed: string[];
  icon: string; 
}

export const techSkills: Technology[] = [
  {
    name: "React.js",
    category: "Frontend",
    level: "Expert",
    description: "Declarative component-driven frontend architecture, custom hooks, contexts, and concurrent rendering features.",
    projectsUsed: ["Zenith Workspace", "DevFlow Q&A Platform", "Aura Luxury E-commerce"],
    icon: "Atom"
  },
  {
    name: "Next.js",
    category: "Frontend",
    level: "Expert",
    description: "Modern SSR, SSG, ISR methods, Server Components, Server Actions, Route Handlers, and App Router configuration.",
    projectsUsed: ["Zenith Workspace", "DevFlow Q&A Platform", "Aura Luxury E-commerce"],
    icon: "Globe"
  },
  {
    name: "TypeScript",
    category: "Frontend",
    level: "Advanced",
    description: "Strict typing systems, interfaces, generics, utility types, and compiler optimizations for bulletproof codebases.",
    projectsUsed: ["Zenith Workspace", "Aura Luxury E-commerce", "Core Task Distributed Queue"],
    icon: "ShieldAlert"
  },
  {
    name: "JavaScript",
    category: "Frontend",
    level: "Expert",
    description: "ES6+ semantics, asynchronous event execution patterns, DOM control, and functional programming methodologies.",
    projectsUsed: ["Zenith Workspace", "DevFlow", "Aura Shop", "Core Task Queue"],
    icon: "Code2"
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: "Expert",
    description: "Rapid responsive styling with utility-first classes, customized themes, layouts, animations, and Tailwind v4 configurations.",
    projectsUsed: ["Zenith Workspace", "DevFlow Q&A Platform", "Aura Luxury E-commerce"],
    icon: "Palette"
  },
  {
    name: "Redux Toolkit",
    category: "Frontend",
    level: "Proficient",
    description: "Global state management, slices, action creators, async thunks, and middleware handlers for client coherence.",
    projectsUsed: ["DevFlow Q&A Platform", "Aura Luxury E-commerce"],
    icon: "Layers"
  },
  {
    name: "React Query",
    category: "Frontend",
    level: "Expert",
    description: "Server state synchronization, caching, optimistic rendering, retry setups, polling, and background page pre-fetching.",
    projectsUsed: ["Zenith Workspace", "Aura Luxury E-commerce"],
    icon: "RefreshCw"
  },
  {
    name: "Node.js",
    category: "Backend",
    level: "Advanced",
    description: "Event-driven asynchronous backend systems, event emitters, stream handlers, and clustering operations.",
    projectsUsed: ["DevFlow Q&A Platform", "Core Task Distributed Queue"],
    icon: "Server"
  },
  {
    name: "Express.js",
    category: "Backend",
    level: "Advanced",
    description: "Robust API construction, middleware handlers, routers, authentication controllers, and CORS configurations.",
    projectsUsed: ["DevFlow Q&A Platform", "Core Task Distributed Queue"],
    icon: "Terminal"
  },
  {
    name: "REST APIs",
    category: "Backend",
    level: "Expert",
    description: "Standardized request/response patterns, status codes, query aggregators, rate-limiting, and Swagger documentation.",
    projectsUsed: ["Zenith Workspace", "DevFlow", "Aura Shop", "Core Task Queue"],
    icon: "Link2"
  },
  {
    name: "PostgreSQL",
    category: "Database",
    level: "Proficient",
    description: "Relational database modeling, complex indexing, analytical queries, join optimization, and constraints execution.",
    projectsUsed: ["Zenith Workspace"],
    icon: "Database"
  },
  {
    name: "MongoDB",
    category: "Database",
    level: "Advanced",
    description: "NoSQL document collections, aggregation frameworks, schema-less structures, indexing strategies, and database clustering.",
    projectsUsed: ["DevFlow Q&A Platform", "Core Task Distributed Queue"],
    icon: "DatabaseBackup"
  },
  {
    name: "Supabase",
    category: "Database",
    level: "Advanced",
    description: "BaaS database integrations, Row-Level Security (RLS) policies, authentication workflows, edge functions, and real-time streams.",
    projectsUsed: ["Zenith Workspace", "Aura Luxury E-commerce"],
    icon: "Zap"
  },
  {
    name: "Firebase",
    category: "Database",
    level: "Proficient",
    description: "Real-time client synchronization, Firebase Auth, Firestore models, storage hosting, and serverless Cloud Functions.",
    projectsUsed: ["CreativeByte Studio client sites"],
    icon: "Flame"
  },
  {
    name: "Vercel",
    category: "Cloud",
    level: "Advanced",
    description: "Serverless web deployment, route configs, domain configurations, edge handlers, and CI/CD git integrations.",
    projectsUsed: ["Zenith Workspace", "DevFlow Q&A Platform", "Aura Luxury E-commerce"],
    icon: "Cloud"
  },
  {
    name: "Git & GitHub",
    category: "Tools",
    level: "Advanced",
    description: "Collaborative branch management, merge conflict resolution, rebase options, pull requests, actions workflows.",
    projectsUsed: ["All Projects"],
    icon: "GitBranch"
  },
  {
    name: "Docker (Basic)",
    category: "Tools",
    level: "Intermediate",
    description: "Basic container building, Dockerfiles, volume binding, multi-container compose settings for local testing.",
    projectsUsed: ["Core Task Distributed Queue"],
    icon: "Container"
  },
  {
    name: "Figma",
    category: "Tools",
    level: "Proficient",
    description: "Prototyping, assets extraction, styling tokens mapping, layout inspection, and user flows outline.",
    projectsUsed: ["Zenith Workspace", "Aura Luxury E-commerce"],
    icon: "Framer"
  }
];
