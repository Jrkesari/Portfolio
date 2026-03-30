export interface Experience {
  id: string;
  role: string;
  company: string;
  type: "Full-time" | "Internship";
  location: string;
  mode: "On-site" | "Remote" | "Hybrid";
  startDate: string;
  endDate: string | null; // null = Present
  bullets: string[];
  skills: string[];
}

export const experiences: Experience[] = [
  {
    id: "netision",
    role: "AI Developer",
    company: "Netision Technology",
    type: "Full-time",
    location: "Noida, UP",
    mode: "On-site",
    startDate: "May 2025",
    endDate: null,
    bullets: [
      "Designing autonomous AI agents using CrewAI, Azure OpenAI, and Azure AI Studio for one-click end-to-end business process automation.",
      "Building no-code/low-code AI workflows with Power Apps, n8n, and custom API integrations.",
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
      "Designed and implemented autonomous AI agents for task execution, user interaction, and workflow optimization.",
      "Developed and fine-tuned conversational AI models for intelligent customer support automation.",
      "Applied NLP and ML techniques to extract insights and automate business processes.",
      "Researched latest advancements in LLM-based agents and reinforcement learning.",
    ],
    skills: ["AI Agents", "Python", "NLP", "LLM Fine-tuning", "Chatbot Engineering"],
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
      "Developed front-end and back-end solutions focusing on performance optimization and user interaction enhancement.",
      "Collaborated with team members to implement innovative web development solutions.",
      "Contributed to the design and implementation of web applications.",
    ],
    skills: ["React", "Node.js", "Web Development", "Performance Optimization"],
  },
];
