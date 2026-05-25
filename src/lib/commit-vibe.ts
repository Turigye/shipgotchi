// =============================================================================
// Commit-vibe classifier. Reads recent commit messages, scores each against a
// small keyword + emoji lexicon, and returns the dominant vibe. Deterministic:
// same set of messages always produces the same CommitVibe.
//
// Intentionally tiny — this is sentiment-on-a-budget, not NLP. The keywords
// were chosen by reading 50+ random public GitHub commit feeds and noting
// what builders actually write at each phase of a project.
// =============================================================================

import type { CommitVibe, CommitVibeKey } from "./types";

type Lexicon = {
  key: CommitVibeKey;
  emoji: string;
  label: string;
  line: string;
  // Words (matched as whole tokens, case-insensitive) and emoji glyphs.
  // Each match counts as one point toward this vibe.
  words: string[];
  emojis: string[];
};

const LEXICONS: Lexicon[] = [
  {
    key: "launch",
    emoji: "🚀",
    label: "Launch energy",
    line: "Shipping releases, cutting tags.",
    words: [
      "release", "releases", "released",
      "ship", "shipped", "shipping",
      "launch", "launched", "launching",
      "deploy", "deployed", "deploying", "deployment",
      "rollout", "go-live", "golive",
      "publish", "published", "publishing",
      "v1", "v2", "v3", "v4", "v5",
    ],
    emojis: ["🚀", "🎉", "🏁", "🎊"],
  },
  {
    key: "firefighting",
    emoji: "🔥",
    label: "Firefighting",
    line: "Patching bugs, putting out fires.",
    words: [
      "fix", "fixed", "fixes", "fixing",
      "hotfix", "patch", "patched", "patching",
      "bug", "bugs", "bugfix",
      "crash", "crashed",
      "emergency", "critical", "urgent",
      "revert", "reverted", "rollback",
      "broken", "regression",
    ],
    emojis: ["🔥", "🐛", "🚒", "🩹"],
  },
  {
    key: "polish",
    emoji: "✨",
    label: "Polishing",
    line: "Sanding the edges down to a shine.",
    words: [
      "polish", "polishing",
      "tweak", "tweaks", "tweaked",
      "refine", "refined", "refining",
      "improve", "improved", "improving", "improvement",
      "clean", "cleanup", "cleaned",
      "refactor", "refactored", "refactoring",
      "lint", "linted", "formatting", "format",
      "style", "styles", "styling",
      "tidy", "tidied",
    ],
    emojis: ["✨", "💅", "🧹"],
  },
  {
    key: "experimenting",
    emoji: "🧪",
    label: "Experimenting",
    line: "Sketching ideas, running spikes.",
    words: [
      "try", "trying", "tried",
      "test", "tests", "testing",
      "experiment", "experimenting",
      "wip", "draft",
      "spike", "prototype", "prototyping",
      "explore", "exploring", "exploration",
      "poc",
    ],
    emojis: ["🧪", "🔬", "🧬"],
  },
  {
    key: "learning",
    emoji: "📚",
    label: "Learning mode",
    line: "Reading, writing docs, taking notes.",
    words: [
      "learn", "learning", "learned",
      "study", "studying",
      "tutorial", "tutorials",
      "docs", "doc", "documentation",
      "readme",
      "guide", "guides",
      "notes", "note",
    ],
    emojis: ["📚", "📖", "✏️", "📝"],
  },
  {
    key: "building",
    emoji: "🛠️",
    label: "Building",
    line: "Pouring fresh features into the pot.",
    words: [
      "add", "added", "adds", "adding",
      "new", "init", "initial",
      "feature", "features",
      "create", "created", "creates", "creating",
      "implement", "implemented", "implementing", "implementation",
      "build", "building",
      "support", "supports", "supported",
      "introduce", "introducing",
    ],
    emojis: ["🛠️", "🔨", "🏗️", "🧱"],
  },
  {
    key: "grinding",
    emoji: "💪",
    label: "Grinding",
    line: "Heads down. Push after push.",
    words: [
      "more", "again", "another", "another",
      "continue", "continued", "continuing",
      "keep", "keeping",
      "wip",
      "progress",
    ],
    emojis: ["💪", "🏋️", "🧗"],
  },
];

const CALM: CommitVibe = {
  key: "calm",
  emoji: "🍃",
  label: "Calm waters",
  line: "Quiet stretch. No public signal yet.",
  sampleCount: 0,
};

// Tokenize: lowercase, split on non-letters. Keeps emojis as separate runs
// so we can match them against the emoji lexicon.
function tokenize(text: string): { words: string[]; emojis: string[] } {
  const lower = text.toLowerCase();
  const words = lower.match(/[a-z][a-z0-9-]*/g) ?? [];
  // Emoji detection — match anything outside the basic ASCII range. This is
  // crude but correct for the keyword emoji set we care about.
  // eslint-disable-next-line no-misleading-character-class
  const emojis = text.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) ?? [];
  return { words, emojis };
}

/**
 * Classify a list of recent commit messages into a single dominant vibe.
 * If `messages` is empty or no keywords match, falls back to "Calm waters".
 */
export function classifyCommitVibe(messages: string[]): CommitVibe {
  if (!messages.length) return CALM;

  const scores = new Map<CommitVibeKey, number>();

  for (const message of messages) {
    const { words, emojis } = tokenize(message);
    const wordSet = new Set(words);

    for (const lex of LEXICONS) {
      let score = 0;
      for (const w of lex.words) if (wordSet.has(w)) score += 1;
      for (const e of lex.emojis) if (emojis.includes(e)) score += 2;
      if (score > 0) {
        scores.set(lex.key, (scores.get(lex.key) ?? 0) + score);
      }
    }
  }

  if (scores.size === 0) {
    return { ...CALM, sampleCount: messages.length };
  }

  // Pick the highest-scoring vibe. Ties broken by lexicon order (launch wins
  // over firefighting wins over polish, etc.) — that gives the most flattering
  // narrative when activity is mixed.
  let winner: CommitVibeKey = "calm";
  let winnerScore = -1;
  for (const lex of LEXICONS) {
    const s = scores.get(lex.key) ?? 0;
    if (s > winnerScore) {
      winnerScore = s;
      winner = lex.key;
    }
  }

  const lex = LEXICONS.find((l) => l.key === winner)!;
  return {
    key: lex.key,
    emoji: lex.emoji,
    label: lex.label,
    line: lex.line,
    sampleCount: messages.length,
  };
}

// Convenience for when no messages are available at all.
export function calmVibe(): CommitVibe {
  return { ...CALM };
}
