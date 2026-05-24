// Pure normalization: raw GitHub REST shapes -> our GitHubProfile / GitHubActivity.
// No fetching here so the proxy AND tests can share this logic.

import type { GitHubActivity, GitHubProfile } from "./types";

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

  return {
    recentPushCount,
    recentEventCount: safeEvents.length,
    lastActivityAt,
    daysSinceLastActivity,
    repoUpdateCount,
    topLanguages,
    accountAgeYears,
  };
}
