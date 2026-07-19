export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: 'Full-time' | 'Contract' | 'Freelance' | 'Internship';
  description: string;
  technologies: string[];
  achievements: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: "frontend-dev",
    role: "Full Stack Developer",
    company: "TechOmnis",
    location: "On-Site / Lahore, Pakistan",
    duration: "Oct 2023 - Current",
    type: "Full-time",
    description: "Designed and developed scalable full-stack web applications, building responsive user interfaces, robust backend services, and seamless data flows across client and server environments.",
technologies: ["React.js", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redux Toolkit", "REST APIs", "Tailwind CSS", "Framer Motion", "Figma"],
achievements: [
  "Built and optimized full-stack dashboards with real-time data visualization and backend integrations, improving active user session times by 20%.",
  "Developed modular, accessible, and responsive frontend components from Figma designs while implementing scalable backend APIs and database solutions.",
  "Integrated third-party payment systems, authentication workflows, and subscription management using Stripe, reducing customer payment issues and improving transaction reliability."
]
  },
  {
    id: "jr-developer",
    role: "Junior Web Developer & Intern",
    company: "Dafi Labs",
    location: "Remote / Lahore, Pakistan",
    duration: "Jun 2024 - Sep 2024",
    type: "Internship",
    description: "Assisted in code maintenance and feature development of responsive client landing pages and administrative interfaces. Worked closely with senior developers to learn clean design patterns.",
    technologies: ["JavaScript", "React.js", "Firebase", "MongoDB", "Express.js", "CSS3", "Git & GitHub"],
    achievements: [
      "Assisted in building custom content management modules utilizing MongoDB and Express, serving content to 10k+ clients.",
      "Implemented Firebase user login and state listeners, cutting onboarding setup issues in the core product.",
      "Created highly optimized mobile layouts, resolving responsiveness tickets for 15+ websites."
    ]
  }
];
