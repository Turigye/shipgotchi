// Deterministic, explainable scoring. Same input -> same PetProfile, always.

import { builderClass, outfitForLanguage, personalityLine } from "./copy";
import type {
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

export function createPetProfile(
  profile: GitHubProfile,
  activity: GitHubActivity,
  opts: { isSample?: boolean } = {},
): PetProfile {
  const score = energyScore(profile, activity);
  const stage = evolutionStage(score, profile, activity);
  const petMood = mood(profile, activity);
  const topLanguage = activity.topLanguages[0] ?? "Polyglot";

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
  };
}
