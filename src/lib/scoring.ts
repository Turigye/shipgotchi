// Deterministic, explainable scoring. Same input -> same PetProfile, always.

import { calmVibe } from "./commit-vibe";
import { builderClass, outfitForLanguage, personalityLine } from "./copy";
import type {
  BuilderStats,
  EvolutionStage,
  GitHubActivity,
  GitHubProfile,
  Mood,
  PetProfile,
  SpriteVariant,
} from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

const isQuiet = (a: GitHubActivity) =>
  a.daysSinceLastActivity !== null && a.daysSinceLastActivity > 30;

const isLegend = (p: GitHubProfile, a: GitHubActivity) =>
  a.accountAgeYears >= 6 && p.publicRepos >= 25;

export function energyScore(p: GitHubProfile, a: GitHubActivity): number {
  let score = 0;
  const days = a.daysSinceLastActivity;
  if (days !== null) {
    if (days <= 1) score += 30;
    if (days <= 7) score += 20;
    if (days <= 30) score += 10;
  }
  score += clamp(a.recentPushCount * 5, 0, 30);
  if (a.repoUpdateCount > 0) score += 10;
  if (p.publicRepos > 20) score += 10;
  if (a.topLanguages.length > 3) score += 10;
  return clamp(Math.round(score), 0, 100);
}

export function evolutionStage(
  score: number,
  p: GitHubProfile,
  a: GitHubActivity,
): EvolutionStage {
  if (isQuiet(a)) {
    // Quiet accounts sleep, unless they carry serious legacy weight.
    return isLegend(p, a) ? "Evolved" : "Sleepy";
  }
  if (score <= 15) return "Egg";
  if (score <= 35) return "Sprout";
  if (score <= 65) return "Builder";
  if (score <= 85) return "Evolved";
  return "Overclocked";
}

export function mood(p: GitHubProfile, a: GitHubActivity): Mood {
  const days = a.daysSinceLastActivity;
  if (isQuiet(a)) return isLegend(p, a) ? "Ancient Sage" : "Sleepy";
  if (days !== null && days <= 1) return "Hyped";
  if (days !== null && days <= 7) return "Focused";
  if (a.topLanguages.length >= 3) return "Curious";
  return "Focused";
}

const STAGE_TO_SPRITE: Record<EvolutionStage, SpriteVariant> = {
  Egg: "egg",
  Sprout: "sprout",
  Builder: "builder",
  Evolved: "evolved",
  Overclocked: "overclocked",
  Sleepy: "sleepy",
};

export function spriteVariant(stage: EvolutionStage): SpriteVariant {
  return STAGE_TO_SPRITE[stage];
}

export function level(score: number, p: GitHubProfile, a: GitHubActivity): number {
  const raw =
    score * 0.7 +
    clamp(p.publicRepos, 0, 50) * 0.4 +
    a.accountAgeYears * 1.5 +
    Math.min(a.recentPushCount, 20);
  return clamp(Math.round(raw), 1, 99);
}

function activitySummary(a: GitHubActivity): string {
  const parts: string[] = [];
  if (a.recentEventCount > 0) {
    parts.push(`${a.recentEventCount} recent public events`);
  }
  if (a.recentPushCount > 0) {
    parts.push(`${a.recentPushCount} commits`);
  }
  if (a.daysSinceLastActivity === null) {
    parts.push("no public activity yet");
  } else if (a.daysSinceLastActivity <= 0) {
    parts.push("active today");
  } else if (a.daysSinceLastActivity === 1) {
    parts.push("active yesterday");
  } else {
    parts.push(`last active ${a.daysSinceLastActivity} days ago`);
  }
  return parts.join(" · ");
}

// Happiness is a mood-and-streak readout, separate from raw energy.
function happinessFor(m: Mood, days: number | null): number {
  let base: number;
  switch (m) {
    case "Hyped":
      base = 100;
      break;
    case "Focused":
      base = 88;
      break;
    case "Curious":
      base = 78;
      break;
    case "Ancient Sage":
      base = 70;
      break;
    case "Sleepy":
      base = 28;
      break;
  }
  if (days !== null && days > 14) base -= 10;
  return clamp(Math.round(base), 0, 100);
}

// Hunger climbs with idle time — full when ≥10 days quiet, empty when active today.
function hungerFor(days: number | null): number {
  if (days === null) return 60;
  if (days <= 0) return 0;
  return clamp(Math.round((days / 10) * 100), 0, 100);
}

// Make sure every PetProfile has a stats block, even if upstream fixtures
// didn't provide the breakdown. Falls back to coarse estimates from the
// existing GitHubActivity fields so the UI never sees holes.
function ensureStats(a: GitHubActivity): BuilderStats {
  if (a.stats) return a.stats;
  const days = a.daysSinceLastActivity ?? 999;
  const recent = a.recentPushCount;
  // Distribute the recent pushes across a 7-day window starting from the
  // last-active day so fixtures still produce a believable sparkline.
  const dailyCommits7d = [0, 0, 0, 0, 0, 0, 0];
  if (recent > 0) {
    const span = Math.min(7, Math.max(1, 7 - Math.min(days, 6)));
    const perDay = Math.max(1, Math.round(recent / span));
    for (let i = 6; i > 6 - span; i--) dailyCommits7d[i] = perDay;
  }
  const commits24h = days <= 1 ? Math.min(recent, 4) : 0;
  return {
    commits24h,
    commits7d: days <= 7 ? recent : 0,
    pushEvents: Math.min(recent, 30),
    pullRequests: Math.min(2, Math.floor(recent / 8)),
    issues: Math.min(3, Math.floor(recent / 6)),
    createdEvents: 0,
    starsAndForks: 0,
    streakDays: days <= 1 ? Math.min(7, recent) : 0,
    dailyCommits7d,
    recentRepos: [],
    commitVibe: calmVibe(),
  };
}

export function createPetProfile(
  profile: GitHubProfile,
  activity: GitHubActivity,
  opts: { isSample?: boolean } = {},
): PetProfile {
  const score = energyScore(profile, activity);
  const stage = evolutionStage(score, profile, activity);
  const petMood = mood(profile, activity);
  const topLanguage = activity.topLanguages[0] ?? "Polyglot";
  const stats = ensureStats(activity);

  return {
    username: profile.login,
    displayName: profile.name ?? profile.login,
    avatarUrl: profile.avatarUrl,
    githubUrl: profile.githubUrl,
    level: level(score, profile, activity),
    mood: petMood,
    evolutionStage: stage,
    builderClass: builderClass({
      stage,
      topLanguage,
      energyScore: score,
      accountAgeYears: activity.accountAgeYears,
      languageCount: activity.topLanguages.length,
    }),
    topLanguage,
    energyScore: score,
    activitySummary: activitySummary(activity),
    personalityLine: personalityLine(petMood, stage),
    spriteVariant: spriteVariant(stage),
    outfitTrait: outfitForLanguage(activity.topLanguages[0] ?? null),
    accountAgeYears: activity.accountAgeYears,
    languageCount: activity.topLanguages.length,
    isSample: opts.isSample ?? false,
    stats,
    happiness: happinessFor(petMood, activity.daysSinceLastActivity),
    hunger: hungerFor(activity.daysSinceLastActivity),
  };
}

// Mystery pet for invalid/hidden data — keeps the UI from ever feeling broken.
export function mysteryPet(username: string): PetProfile {
  return {
    username,
    displayName: username || "Mystery Builder",
    avatarUrl: "",
    githubUrl: username ? `https://github.com/${username}` : "https://github.com",
    level: 1,
    mood: "Curious",
    evolutionStage: "Egg",
    builderClass: "Hidden One",
    topLanguage: "Unknown",
    energyScore: 0,
    activitySummary: "No public trail to read yet.",
    personalityLine: "This one keeps its commits a secret. Mysterious to the end.",
    spriteVariant: "mystery",
    outfitTrait: null,
    accountAgeYears: 0,
    languageCount: 0,
    isSample: false,
    stats: {
      commits24h: 0,
      commits7d: 0,
      pushEvents: 0,
      pullRequests: 0,
      issues: 0,
      createdEvents: 0,
      starsAndForks: 0,
      streakDays: 0,
      dailyCommits7d: [0, 0, 0, 0, 0, 0, 0],
      recentRepos: [],
      commitVibe: calmVibe(),
    },
    happiness: 50,
    hunger: 50,
  };
}
