import { GitHubCalendar } from "react-github-calendar";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Github, GitCommit, Star, BookOpen } from "lucide-react";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

const GH_USER = "Jrkesari";
const GH_API = "https://api.github.com";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
}

interface PushEvent {
  id: string;
  type: "PushEvent";
  repo: { name: string };
  payload: {
    commits: { message: string; sha: string }[];
  };
  created_at: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    commits?: { message: string; sha: string }[];
    ref_type?: string;
    ref?: string;
  };
  created_at: string;
}

async function fetchUser(): Promise<GitHubUser> {
  const res = await fetch(`${GH_API}/users/${GH_USER}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json() as Promise<GitHubUser>;
}

async function fetchEvents(): Promise<GitHubEvent[]> {
  const res = await fetch(`${GH_API}/users/${GH_USER}/events/public?per_page=60`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json() as Promise<GitHubEvent[]>;
}

async function fetchRepos(): Promise<{ stargazers_count: number }[]> {
  const res = await fetch(`${GH_API}/users/${GH_USER}/repos?per_page=100&type=owner`);
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json() as Promise<{ stargazers_count: number }[]>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function extractCommits(events: GitHubEvent[]) {
  const commits: { repo: string; message: string; time: string }[] = [];
  for (const event of events) {
    if (event.type === "PushEvent" && event.payload.commits?.length) {
      for (const commit of event.payload.commits.slice(0, 1)) {
        const msg = commit.message.split("\n")[0].trim();
        if (msg.length > 0) {
          commits.push({
            repo: event.repo.name.replace(`${GH_USER}/`, ""),
            message: msg.length > 72 ? msg.slice(0, 72) + "…" : msg,
            time: timeAgo(event.created_at),
          });
        }
      }
    }
    if (commits.length >= 6) break;
  }
  return commits;
}

const queryOpts = {
  staleTime: 1000 * 60 * 5,   // 5 min
  refetchInterval: 1000 * 60 * 10, // refresh every 10 min
} as const;

export function GitHubStats() {
  const { data: user } = useQuery({ queryKey: ["gh-user"], queryFn: fetchUser, ...queryOpts });
  const { data: events } = useQuery({ queryKey: ["gh-events"], queryFn: fetchEvents, ...queryOpts });
  const { data: repos } = useQuery({ queryKey: ["gh-repos"], queryFn: fetchRepos, ...queryOpts });

  const totalStars = repos?.reduce((sum, r) => sum + r.stargazers_count, 0) ?? null;
  const commits = events ? extractCommits(events) : [];

  const stats = [
    { icon: BookOpen, label: "Repos", value: user?.public_repos ?? null },
    { icon: Star, label: "Stars", value: totalStars },
    { icon: GitCommit, label: "Followers", value: user?.followers ?? null },
  ];

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="py-14 px-6 border-t border-border"
    >
      <div className="max-w-content mx-auto space-y-6">

        {/* Header row */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <a
            href={`https://github.com/${GH_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-[#171717] transition-colors"
          >
            <Github size={14} />
            <span className="font-mono">@{GH_USER}</span>
          </a>

          {/* Live stats */}
          <div className="flex items-center gap-5">
            {stats.map(({ icon: Icon, label, value }) =>
              value !== null ? (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={13} className="text-muted" />
                  <span className="font-mono text-xs font-medium text-[#171717]">{value}</span>
                  <span className="text-xs text-muted">{label}</span>
                </div>
              ) : null
            )}
          </div>
        </motion.div>

        {/* Contribution calendar */}
        <motion.div variants={fadeUp} className="overflow-x-auto">
          <GitHubCalendar
            username={GH_USER}
            year={new Date().getFullYear()}
            colorScheme="light"
            theme={{
              light: ["#E8E4DC", "#C8BFB0", "#A89880", "#7A6A55", "#171717"],
            }}
            style={{ fontFamily: "inherit", fontSize: 12, color: "#737373" }}
            labels={{ totalCount: "{{count}} contributions in {{year}}" }}
          />
        </motion.div>

        {/* Recent commits */}
        {commits.length > 0 && (
          <motion.div variants={fadeUp} className="space-y-0">
            {commits.map((c, i) => (
              <div
                key={i}
                className={`py-2.5 flex items-start gap-3 ${
                  i < commits.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <GitCommit size={13} className="text-muted mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-[#171717] mr-2">{c.repo}</span>
                  <span className="text-xs text-muted truncate">{c.message}</span>
                </div>
                <span className="font-mono text-xs text-muted flex-shrink-0">{c.time}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
