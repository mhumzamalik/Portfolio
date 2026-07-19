export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  feedback: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "Senior Product Manager",
    company: "Apex Software Solutions",
    avatar: "/avatars/sarah.jpg",
    feedback: "Muhammad's attention to details is remarkable. He migrated our dashboard to Next.js v15/v16 ahead of schedule, drastically improving performance and accessibility metrics. His collaborative spirit was a major asset."
  },
  {
    name: "David Chen",
    role: "Chief Technology Officer",
    company: "TechVantage Labs",
    avatar: "/avatars/david.jpg",
    feedback: "An exceptional developer who understands both elegant frontend animations and solid backend system design. Muhammad helped us configure complex Redux setups and Stripe checkouts without a hitch."
  },
  {
    name: "Elena Rostova",
    role: "Founder & Creative Director",
    company: "Aura Boutique",
    avatar: "/avatars/elena.jpg",
    feedback: "Muhammad turned our Figma visual designs into a flawless interactive web shop. The custom page transitions and parallax layouts feel incredibly premium and have directly increased user session times."
  }
];
