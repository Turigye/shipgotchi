// Pure normalization: raw GitHub REST shapes -> our GitHubProfile / GitHubActivity.
// No fetching here so the proxy AND tests can share this logic.

import type { BuilderStats, GitHubActivity, GitHubProfile } from "./types";

export interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  created_at: string;
}

export interface RawEvent {
  type: string;
  created_at: string;
  payload?: { commits?: unknown[] };
  repo?: { name?: string };
}

export interface RawRepo {
  name: string;
  language: string | null;
  pushed_at: string | null;
  updated_at: string | null;
  fork: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const YEAR_MS = 365.25 * DAY_MS;

export function normalizeProfile(u: RawUser): GitHubProfile {
  return {
    login: u.login,
    name: u.name ?? null,
    avatarUrl: u.avatar_url,
    githubUrl: u.html_url,
    publicRepos: u.public_repos ?? 0,
    followers: u.followers ?? 0,
    createdAt: u.created_at,
  };
}

export function normalizeActivity(
  events: RawEvent[],
  repos: RawRepo[],
  createdAt: string,
  now: number = Date.now(),
): GitHubActivity {
  const safeEvents = Array.isArray(events) ? events : [];
  const safeRepos = Array.isArray(repos) ? repos : [];

  const pushEvents = safeEvents.filter((e) => e.type === "PushEvent");
  const recentPushCount = pushEvents.reduce((sum, e) => {
    const commits = e.payload?.commits?.length ?? 1;
    return sum + commits;
  }, 0);

  // Most recent activity timestamp across events + repo pushes.
  const timestamps: number[] = [];
  for (const e of safeEvents) {
    const t = Date.parse(e.created_at);
    if (!Number.isNaN(t)) timestamps.push(t);
  }
  for (const r of safeRepos) {
    const t = Date.parse(r.pushed_at ?? r.updated_at ?? "");
    if (!Number.isNaN(t)) timestamps.push(t);
  }
  const lastTs = timestamps.length ? Math.max(...timestamps) : null;
  const lastActivityAt = lastTs ? new Date(lastTs).toISOString() : null;
  const daysSinceLastActivity =
    lastTs === null ? null : Math.floor((now - lastTs) / DAY_MS);

  const repoUpdateCount = safeRepos.filter((r) => {
    const t = Date.parse(r.pushed_at ?? r.updated_at ?? "");
    return !Number.isNaN(t) && now - t <= 30 * DAY_MS;
  }).length;

  // Top languages by frequency, non-fork repos preferred.
  const counts = new Map<string, number>();
  const source = safeRepos.some((r) => !r.fork)
    ? safeRepos.filter((r) => !r.fork)
    : safeRepos;
  for (const r of source) {
    if (!r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  const topLanguages = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([lang]) => lang);

  const createdTs = Date.parse(createdAt);
  const accountAgeYears = Number.isNaN(createdTs)
    ? 0
    : Math.round(((now - createdTs) / YEAR_MS) * 10) / 10;

  // ---- Granular stats for the Vitals panel ----
  let commits24h = 0;
  let commits7d = 0;
  let pullRequests = 0;
  let issues = 0;
  let createdEvents = 0;
  let starsAndForks = 0;
  const dailyCommits7d = [0, 0, 0, 0, 0, 0, 0]; // oldest -> newest
  const activeDays = new Set<number>(); // day-of-year buckets
  const recentRepoNames: string[] = [];

  for (const e of safeEvents) {
    const t = Date.parse(e.created_at);
    if (Number.isNaN(t)) continue;
    const ageDays = (now - t) / DAY_MS;

    // Track activity day (any event) for streak calc.
    if (ageDays <= 30) {
      const dayKey = Math.floor(t / DAY_MS);
      activeDays.add(dayKey);
    }

    // Track per-day commit count for last 7 days (oldest -> newest).
    if (e.type === "PushEvent") {
      const commits = e.payload?.commits?.length ?? 1;
      if (ageDays <= 1) commits24h += commits;
      if (ageDays <= 7) {
        commits7d += commits;
        const slot = Math.min(6, Math.max(0, 6 - Math.floor(ageDays)));
        dailyCommits7d[slot] += commits;
      }
    } else if (e.type === "PullRequestEvent") {
      pullRequests += 1;
    } else if (e.type === "IssuesEvent" || e.type === "IssueCommentEvent") {
      issues += 1;
    } else if (e.type === "CreateEvent") {
      createdEvents += 1;
    } else if (e.type === "WatchEvent" || e.type === "ForkEvent") {
      starsAndForks += 1;
    }

    // Recent repo names from events (preserve order, dedupe).
    const repoName = e.repo?.name;
    if (repoName && !recentRepoNames.includes(repoName) && recentRepoNames.length < 6) {
      recentRepoNames.push(repoName);
    }
  }

  // Fallback: if events didn't yield repos, lift from the repos list.
  if (recentRepoNames.length === 0) {
    for (const r of safeRepos) {
      const name = r.name;
      if (name && !recentRepoNames.includes(name) && recentRepoNames.length < 6) {
        recentRepoNames.push(name);
      }
    }
  }

  // Streak: consecutive recent days (counting back from today) with activity.
  const today = Math.floor(now / DAY_MS);
  let streakDays = 0;
  for (let i = 0; i < 30; i++) {
    if (activeDays.has(today - i)) {
      streakDays += 1;
    } else if (i > 0) {
      break;
    }
  }

  const stats: BuilderStats = {
    commits24h,
    commits7d,
    pushEvents: pushEvents.length,
    pullRequests,
    issues,
    createdEvents,
    starsAndForks,
    streakDays,
    dailyCommits7d,
    recentRepos: recentRepoNames,
  };

  return {
    recentPushCount,
    recentEventCount: safeEvents.length,
    lastActivityAt,
    daysSinceLastActivity,
    repoUpdateCount,
    topLanguages,
    accountAgeYears,
    stats,
  };
}
