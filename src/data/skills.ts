export interface SkillGroup {
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "LLMs & Agents",
    skills: [
      "LangChain",
      "LangGraph",
      "CrewAI",
      "MCP",
      "OpenAI API",
      "Azure OpenAI",
      "Azure AI Studio",
      "Claude API",
      "Google Gemini",
      "Whisper",
      "n8n",
      "FAISS",
      "RAG Systems",
      "Prompt Engineering",
      "LLM Orchestration",
    ],
  },
  {
    label: "Backend",
    skills: [
      "Python",
      "FastAPI",
      "Pydantic",
      "DuckDB",
      "SurrealDB",
      "MongoDB",
      "MySQL",
      "Spring Boot",
      "Java",
    ],
  },
  {
    label: "Frontend",
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "TanStack",
      "HTML",
      "CSS",
    ],
  },
  {
    label: "Cloud & Tools",
    skills: [
      "Azure",
      "AWS EC2",
      "AWS S3",
      "Docker",
      "Playwright",
      "BeautifulSoup",
      "n8n",
      "Power Apps",
      "ClickHouse",
    ],
  },
];
