// Shared domain types for ShipGotchi.
// The UI consumes PetProfile; raw GitHub shapes never leak past the proxy/normalizer.

export type UIState =
  | "idle"
  | "loading"
  | "success"
  | "compare"
  | "notFound"
  | "rateLimited"
  | "networkError";

export type ErrorState = "notFound" | "rateLimited" | "networkError";

export type EvolutionStage =
  | "Egg"
  | "Sprout"
  | "Builder"
  | "Evolved"
  | "Overclocked"
  | "Sleepy";

export type Mood = "Hyped" | "Focused" | "Curious" | "Sleepy" | "Ancient Sage";

export type SpriteVariant =
  | "egg"
  | "sprout"
  | "builder"
  | "evolved"
  | "overclocked"
  | "sleepy"
  | "mystery";

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  githubUrl: string;
  publicRepos: number;
  followers: number;
  createdAt: string; // ISO timestamp
}

export interface GitHubActivity {
  recentPushCount: number;
  recentEventCount: number;
  lastActivityAt: string | null; // ISO timestamp
  daysSinceLastActivity: number | null;
  repoUpdateCount: number; // repos pushed to within 30 days
  topLanguages: string[];
  accountAgeYears: number;
}

export interface PetProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  githubUrl: string;
  level: number; // 1-99
  mood: Mood;
  evolutionStage: EvolutionStage;
  builderClass: string;
  topLanguage: string;
  energyScore: number; // 0-100
  activitySummary: string;
  personalityLine: string;
  spriteVariant: SpriteVariant;
  outfitTrait: string | null;
  accountAgeYears: number;
  languageCount: number;
  isSample: boolean;
}

// What the proxy returns and what the client service resolves to.
export type GithubFetchResult =
  | { state: "success"; profile: GitHubProfile; activity: GitHubActivity }
  | { state: ErrorState; message: string };
