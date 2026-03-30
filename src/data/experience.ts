export interface Experience {
  id: string;
  role: string;
  company: string;
  type: "Full-time" | "Internship";
  location: string;
  mode: "On-site" | "Remote" | "Hybrid";
  startDate: string;
  endDate: string | null;
  bullets: string[];
  skills: string[];
}

export const experiences: Experience[] = [
  {
    id: "netision",
    role: "AI Engineer",
    company: "Netision Technology",
    type: "Full-time",
    location: "Noida, UP",
    mode: "On-site",
    startDate: "May 2025",
    endDate: null,
    bullets: [
      "Designing autonomous agents using CrewAI, Azure OpenAI, and Azure Studio for one-click end-to-end business process automation.",
      "Building no-code/low-code workflows with Power Apps, n8n, and custom API integrations.",
      "Working with Python, LangChain, and web scraping libraries to gather and process real-time data.",
      "Contributing to production projects in marketing automation, retail, and e-commerce.",
    ],
    skills: ["CrewAI", "Azure OpenAI", "LangChain", "n8n", "Python", "Power Apps"],
  },
  {
    id: "coginetics",
    role: "Software Trainee",
    company: "COGINETICS SOLUTIONS LLP",
    type: "Internship",
    location: "Noida, UP",
    mode: "On-site",
    startDate: "Dec 2024",
    endDate: "May 2025",
    bullets: [
      "Designed and built autonomous agents for task execution, user interaction, and workflow optimization.",
      "Developed and fine-tuned conversational models for customer support automation.",
      "Applied NLP and ML techniques to extract insights and automate business processes.",
      "Researched LLM-based agents and reinforcement learning advancements.",
    ],
    skills: ["Agents", "Python", "NLP", "LLM Fine-tuning", "Chatbot Engineering"],
  },
  {
    id: "techfreedom",
    role: "Web Developer",
    company: "Tech Freedom Online",
    type: "Internship",
    location: "Noida, UP",
    mode: "Remote",
    startDate: "Jul 2024",
    endDate: "Dec 2024",
    bullets: [
      "Developed front-end and back-end solutions focusing on performance optimization and user interaction.",
      "Collaborated with team members to implement web development solutions.",
      "Contributed to the design and implementation of web applications.",
    ],
    skills: ["React", "Node.js", "Web Development", "Performance Optimization"],
  },
];
