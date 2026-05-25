// Pre-normalized sample data so the demo ALWAYS works, even if GitHub is down
// or rate-limited. These are hand-tuned to land on visibly different pet states.

import type { GitHubActivity, GitHubProfile, GithubFetchResult } from "./types";

// Real, high-signal usernames used as the demo chips.
export const SAMPLE_USERNAMES = [
  "torvalds",
  "gaearon",
  "sindresorhus",
  "yyx990803",
] as const;

// Demo chips with friendly labels. Real GitHub names + one offline-only
// "demo nap" fixture so judges always see a Sleepy state on stage.
export const SAMPLE_CHIPS: { username: string; label: string }[] = [
  { username: "torvalds", label: "torvalds" },
  { username: "gaearon", label: "gaearon" },
  { username: "sindresorhus", label: "sindresorhus" },
  { username: "yyx990803", label: "yyx990803" },
  { username: "quiet-quokka", label: "demo nap" },
];

// Usernames resolved purely from local fixtures (skip the proxy).
export const OFFLINE_SAMPLES = new Set<string>(["quiet-quokka"]);

interface Fixture {
  profile: GitHubProfile;
  activity: GitHubActivity;
}

function profile(login: string, extra: Partial<GitHubProfile>): GitHubProfile {
  return {
    login,
    name: null,
    avatarUrl: `https://github.com/${login}.png`,
    githubUrl: `https://github.com/${login}`,
    publicRepos: 30,
    followers: 1000,
    createdAt: "2012-01-01T00:00:00Z",
    ...extra,
  };
}

export const SAMPLE_FIXTURES: Record<string, Fixture> = {
  // Active legend — long history, still shipping (Evolved / Focused).
  torvalds: {
    profile: profile("torvalds", {
      name: "Linus Torvalds",
      publicRepos: 30,
      followers: 200000,
      createdAt: "2011-09-03T00:00:00Z",
    }),
    activity: {
      recentPushCount: 8,
      recentEventCount: 22,
      lastActivityAt: "now",
      daysSinceLastActivity: 3,
      repoUpdateCount: 2,
      topLanguages: ["C", "Shell"],
      accountAgeYears: 14,
    },
  },
  // Overclocked shipper — fresh commits, JS/TS (Overclocked / Hyped).
  gaearon: {
    profile: profile("gaearon", {
      name: "dan",
      publicRepos: 250,
      followers: 80000,
      createdAt: "2011-05-01T00:00:00Z",
    }),
    activity: {
      recentPushCount: 12,
      recentEventCount: 30,
      lastActivityAt: "now",
      daysSinceLastActivity: 1,
      repoUpdateCount: 6,
      topLanguages: ["JavaScript", "TypeScript", "HTML"],
      accountAgeYears: 14,
    },
  },
  // Stack Alchemist — prolific, many languages (Overclocked / Hyped).
  sindresorhus: {
    profile: profile("sindresorhus", {
      name: "Sindre Sorhus",
      publicRepos: 1100,
      followers: 60000,
      createdAt: "2011-06-01T00:00:00Z",
    }),
    activity: {
      recentPushCount: 20,
      recentEventCount: 30,
      lastActivityAt: "now",
      daysSinceLastActivity: 1,
      repoUpdateCount: 9,
      topLanguages: ["TypeScript", "JavaScript", "Swift", "Shell"],
      accountAgeYears: 14,
    },
  },
  // Steady builder — recent but calmer (Evolved / Focused).
  yyx990803: {
    profile: profile("yyx990803", {
      name: "Evan You",
      publicRepos: 200,
      followers: 90000,
      createdAt: "2011-07-01T00:00:00Z",
    }),
    activity: {
      recentPushCount: 6,
      recentEventCount: 18,
      lastActivityAt: "now",
      daysSinceLastActivity: 2,
      repoUpdateCount: 4,
      topLanguages: ["TypeScript", "JavaScript", "HTML"],
      accountAgeYears: 14,
    },
  },
  // Sleepy sample — quiet for a while (Sleepy / Sleepy). Uses a DiceBear
  // generated avatar because no real `quiet-quokka` user exists on GitHub
  // (so the github.com/{login}.png URL 404s and shows a broken image).
  "quiet-quokka": {
    profile: {
      login: "quiet-quokka",
      name: "Quiet Quokka",
      avatarUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=quiet-quokka&backgroundColor=c5d58b",
      githubUrl: "https://github.com/",
      publicRepos: 12,
      followers: 40,
      createdAt: "2019-03-01T00:00:00Z",
    },
    activity: {
      recentPushCount: 0,
      recentEventCount: 0,
      lastActivityAt: "old",
      daysSinceLastActivity: 120,
      repoUpdateCount: 0,
      topLanguages: ["Python"],
      accountAgeYears: 6,
    },
  },
};

// Return a sample success result for a known username, else null.
export function sampleResult(username: string): GithubFetchResult | null {
  const fx = SAMPLE_FIXTURES[username.toLowerCase()];
  if (!fx) return null;
  return { state: "success", profile: fx.profile, activity: fx.activity };
}

// Any-username fallback used when GitHub is unreachable/rate-limited but we
// still want a delightful demo. Returns a stable fixture.
export function fallbackResult(): GithubFetchResult {
  const fx = SAMPLE_FIXTURES.gaearon;
  return { state: "success", profile: fx.profile, activity: fx.activity };
}
