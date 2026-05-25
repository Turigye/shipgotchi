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
  // Richer breakdown used by the Builder Vitals panel + sparkline.
  // Optional so older fixtures still parse cleanly.
  stats?: BuilderStats;
}

export interface BuilderStats {
  commits24h: number;
  commits7d: number;
  pushEvents: number;
  pullRequests: number;
  issues: number;
  createdEvents: number;
  starsAndForks: number;
  streakDays: number; // consecutive recent days with public activity
  dailyCommits7d: number[]; // length 7, oldest -> newest, for sparkline
  recentRepos: string[]; // up to 6 distinct repo names recently touched
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
  // Vital signs surfaced in the UI panel. Derived deterministically from
  // GitHubActivity in scoring.ts.
  stats: BuilderStats;
  happiness: number; // 0-100, mood-derived
  hunger: number; // 0-100, inverse of recent activity
}

// What the proxy returns and what the client service resolves to.
export type GithubFetchResult =
  | { state: "success"; profile: GitHubProfile; activity: GitHubActivity }
  | { state: ErrorState; message: string };
