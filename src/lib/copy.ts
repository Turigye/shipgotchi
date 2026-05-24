// Personality + label maps. Warm, playful, premium, never mean.
// Stage drives the silhouette; mood drives the colorway; language drives the
// outfit. Class + personality lines should respect ALL THREE so nothing reads
// like "Sprout · Ancient Maintainer".

import type { EvolutionStage, Mood } from "./types";

// ---------- Outfit by language (decorative) ----------

const LANGUAGE_OUTFIT: Record<string, string> = {
  TypeScript: "Star Visor",
  JavaScript: "Star Visor",
  Python: "Wizard Cap",
  Rust: "Bronze Armor",
  Go: "Runner Goggles",
  CSS: "Paint Scarf",
  HTML: "Paint Scarf",
  Java: "Coffee Charm",
  "C++": "Spark Gauntlet",
  C: "Spark Gauntlet",
  Ruby: "Gem Pin",
  Shell: "Terminal Cape",
  Kotlin: "Coffee Charm",
  Swift: "Glide Fin",
};

export function outfitForLanguage(language: string | null): string | null {
  if (!language) return null;
  return LANGUAGE_OUTFIT[language] ?? null;
}

// ---------- Builder class: stage-led, language/age as flavor ----------

interface ClassInput {
  stage: EvolutionStage;
  topLanguage: string;
  energyScore: number;
  accountAgeYears: number;
  languageCount: number;
}

function langClass(stage: EvolutionStage, lang: string): string | null {
  // Stage-flavored language classes. Keeps things specific without weird combos.
  const key = `${stage}:${lang}`;
  const map: Record<string, string> = {
    // Sprouts — eager, just-shipped
    "Sprout:TypeScript": "Greenfield Typist",
    "Sprout:JavaScript": "Greenfield Typist",
    "Sprout:Python": "Notebook Sprout",
    "Sprout:Rust": "Cargo Cub",
    "Sprout:Go": "Goroutine Pup",
    "Sprout:CSS": "Pixel Pup",
    "Sprout:HTML": "Pixel Pup",
    // Builders — steady, working
    "Builder:TypeScript": "Interface Sprinter",
    "Builder:JavaScript": "Interface Sprinter",
    "Builder:Python": "Notebook Druid",
    "Builder:Rust": "Memory Knight",
    "Builder:Go": "Concurrency Courier",
    "Builder:CSS": "Pixel Mechanic",
    "Builder:HTML": "Pixel Mechanic",
    "Builder:Java": "JVM Custodian",
    // Evolved — refined, leveled up
    "Evolved:TypeScript": "Type System Bard",
    "Evolved:JavaScript": "Type System Bard",
    "Evolved:Python": "Script Sorcerer",
    "Evolved:Rust": "Borrow Knight",
    "Evolved:Go": "Channel Captain",
    "Evolved:CSS": "Pixel Architect",
    "Evolved:HTML": "Pixel Architect",
    // Overclocked — euphoric shippers
    "Overclocked:TypeScript": "Midnight Shipper",
    "Overclocked:JavaScript": "Midnight Shipper",
    "Overclocked:Python": "Repo Ranger",
    "Overclocked:Rust": "Zero-Cost Crusader",
    "Overclocked:Go": "Goroutine Goblin",
    "Overclocked:CSS": "Syntax Sprinter",
    "Overclocked:HTML": "Syntax Sprinter",
  };
  return map[key] ?? null;
}

export function builderClass(input: ClassInput): string {
  const { stage, topLanguage, energyScore, accountAgeYears, languageCount } = input;

  // Special stages override
  if (stage === "Egg") return "Pre-Commit Dreamer";
  if (stage === "Sleepy") {
    if (accountAgeYears >= 6) return "Hibernating Maintainer";
    return "Strategic Napper";
  }

  // Polyglot trumps language for non-Egg/Sleepy
  if (languageCount >= 4 && stage !== "Sprout") return "Stack Alchemist";

  // Try a stage+language combo first
  const tagged = langClass(stage, topLanguage);
  if (tagged) return tagged;

  // Fallbacks by stage
  switch (stage) {
    case "Sprout":
      return "First-Commit Caller";
    case "Builder":
      return accountAgeYears >= 5 ? "Veteran Builder" : "Steady Builder";
    case "Evolved":
      return accountAgeYears >= 8 ? "Patch Saint" : "Refactor Monk";
    case "Overclocked":
      return energyScore >= 95 ? "Launch Goblet" : "Bug Whisperer";
  }
  return "Loyal Companion";
}

// ---------- Mood label ----------

const MOOD_LABEL: Record<Mood, string> = {
  Hyped: "Hyped",
  Focused: "Focused",
  Curious: "Curious",
  Sleepy: "Sleepy",
  "Ancient Sage": "Ancient Sage",
};

export function moodLabel(mood: Mood): string {
  return MOOD_LABEL[mood];
}

// ---------- Personality lines (mood × stage matrix) ----------

const LINE: Record<EvolutionStage, Partial<Record<Mood, string>>> = {
  Egg: {
    Hyped: "Vibrating inside the shell. Something is coming.",
    Focused: "A quiet egg. It listens for the first commit.",
    Curious: "Faint speckles bloom whenever a repo is opened.",
    Sleepy: "Sleeping through pre-production. Wake me at v1.",
    "Ancient Sage": "An old egg, somehow. It has been waiting.",
  },
  Sprout: {
    Hyped: "Just hatched and already pasting Stack Overflow. Adorable.",
    Focused: "Tiny goggles. Tiny PRs. Massive ambition.",
    Curious: "Sniffing every README. Wants to taste all the languages.",
    Sleepy: "A nap before the first deploy. Bold strategy.",
    "Ancient Sage": "An old account with a fresh start. We respect a reboot.",
  },
  Builder: {
    Hyped: "Recent commits detected. Tiny goggles equipped.",
    Focused: "Heads down, shipping. This pet has seen things in production.",
    Curious: "Sampling multiple languages today. Curiosity is its cardio.",
    Sleepy: "Steady builder on a coffee break.",
    "Ancient Sage": "Calm hands, deep repos. Builds without rushing.",
  },
  Evolved: {
    Hyped: "Leveled up and grinning. Half its commits ship on Sundays.",
    Focused: "Refactor brain engaged. Speaks in clean diffs.",
    Curious: "Wields four languages and still wonders about the fifth.",
    Sleepy: "Resting between merges. Watch the queue.",
    "Ancient Sage": "Old enough to remember CVS. Polite about it.",
  },
  Overclocked: {
    Hyped: "Your ShipGotchi woke up caffeinated. Untouched coffee on the desk.",
    Focused: "Single-handedly keeping CI warm.",
    Curious: "Has opinions on five languages this week.",
    Sleepy: "Even ramping down, it ships more than most.",
    "Ancient Sage": "Veteran energy. Quietly out-shipping the room.",
  },
  Sleepy: {
    Hyped: "Excited about its own nap. Will commit later. Promise.",
    Focused: "Strategic dormancy. Charging for the next sprint.",
    Curious: "Dreaming in new languages. Will pick one on wakeup.",
    Sleepy: "Low activity, high potential. Napping for strategic reasons.",
    "Ancient Sage": "An elder, resting between epochs. Bows back when greeted.",
  },
};

export function personalityLine(mood: Mood, stage: EvolutionStage): string {
  return (
    LINE[stage]?.[mood] ??
    LINE[stage]?.Focused ??
    "A loyal little builder, growing with every push."
  );
}

// ---------- Short speech bubble (one-liner shown above hero sprite) ----------

const BUBBLE: Record<EvolutionStage, Partial<Record<Mood, string>>> = {
  Egg: {
    Hyped: "Wiggle wiggle…",
    Focused: "Listening…",
    Curious: "What's out there?",
    Sleepy: "…not yet.",
    "Ancient Sage": "Soon. Patient.",
  },
  Sprout: {
    Hyped: "First PR vibes!",
    Focused: "Studying every diff.",
    Curious: "Ooh, what's this language?",
    Sleepy: "Quick nap, then ship.",
    "Ancient Sage": "Fresh start, old roots.",
  },
  Builder: {
    Hyped: "Wahoo! Fresh commits!",
    Focused: "Heads down, shipping.",
    Curious: "Sampling the stack.",
    Sleepy: "Coffee. Then code.",
    "Ancient Sage": "Calm hands, deep repos.",
  },
  Evolved: {
    Hyped: "Leveled up!",
    Focused: "Reviewing my own PRs.",
    Curious: "One more language couldn't hurt.",
    Sleepy: "Between merges.",
    "Ancient Sage": "I remember CVS.",
  },
  Overclocked: {
    Hyped: "MAX SHIP MODE!",
    Focused: "CI is warm because of me.",
    Curious: "Speaking five langs today.",
    Sleepy: "Still out-shipping you.",
    "Ancient Sage": "Quietly carrying the build.",
  },
  Sleepy: {
    Hyped: "Excited about napping.",
    Focused: "Recharging on purpose.",
    Curious: "Dreaming in Rust.",
    Sleepy: "…five more minutes.",
    "Ancient Sage": "I remember the old repos.",
  },
};

export function moodBubble(mood: Mood, stage: EvolutionStage): string {
  return BUBBLE[stage]?.[mood] ?? BUBBLE[stage]?.Focused ?? "Heads down, shipping.";
}
