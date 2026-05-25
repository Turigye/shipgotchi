"use client";

// =============================================================================
// Mood Reference — explains BOTH halves of the scoring system:
//   1. Mood — derived from activity timing (today / this week / quiet)
//   2. Energy — the 100-point shipping score that powers stage + level
// Kept in sync with src/lib/scoring.ts. If you tweak the budget there, tweak
// the numbers here so judges can map any pet back to its inputs.
// =============================================================================

const SCORE_BUDGET: { label: string; max: number; tint: string; line: string }[] = [
  {
    label: "Recency",
    max: 28,
    tint: "#FF6A45",
    line: "When did they last ship? One bucket, no stacking. Today = 28.",
  },
  {
    label: "Volume",
    max: 35,
    tint: "#1FCFB0",
    line: "Commits in the last 7 days, on a soft curve. 1 = 6, 12+ = 27, 25+ = 35.",
  },
  {
    label: "Streak",
    max: 20,
    tint: "#7B5CFF",
    line: "Consecutive days shipping. 3 points each, caps around a week.",
  },
  {
    label: "Diversity",
    max: 8,
    tint: "#58C6FF",
    line: "Repos touched + languages in flight. Generalists get a nudge.",
  },
  {
    label: "Tenure",
    max: 9,
    tint: "#FFC23D",
    line: "Account age + meaningful public repo count. A small floor.",
  },
];

const ROWS: { mood: string; window: string; tint: string; line: string }[] = [
  {
    mood: "Hyped",
    window: "≤ 24h",
    tint: "#FF6A45",
    line: "Fresh push or PR today. Eyes wide, body bouncing.",
  },
  {
    mood: "Focused",
    window: "≤ 7 days",
    tint: "#1FCFB0",
    line: "Steady ship cadence. Healthy idle, calm breathing.",
  },
  {
    mood: "Curious",
    window: "Polyglot",
    tint: "#7B5CFF",
    line: "Three or more languages in flight. Looks for variety.",
  },
  {
    mood: "Ancient Sage",
    window: "Legacy account",
    tint: "#FFC23D",
    line: "Long history, quieter month. Earned the robe.",
  },
  {
    mood: "Sleepy",
    window: "30+ days quiet",
    tint: "#9AA3E0",
    line: "Energy dropping. Z's float upward. Ship to wake.",
  },
];

export function MoodReference() {
  return (
    <div className="card-toy rounded-3xl p-5">
      <div className="mb-3">
        <h3 className="font-pixel text-2xl text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
          How your ShipGotchi feels
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          activity timing → mood
        </p>
      </div>

      <ul className="space-y-2">
        {ROWS.map((r) => (
          <li
            key={r.mood}
            className="flex items-start gap-3 rounded-2xl bg-canvas/60 px-3 py-2"
          >
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ background: r.tint, boxShadow: `0 0 8px ${r.tint}55` }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-base font-700 text-ink">{r.mood}</span>
                <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                  {r.window}
                </span>
              </div>
              <p className="font-body text-sm text-ink-soft">{r.line}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* ===== Energy score breakdown ===== */}
      <div className="mt-5 border-t border-ink/8 pt-4">
        <h4 className="font-pixel text-xl text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
          How shipping energy is scored
        </h4>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          100-point budget · drives stage + level
        </p>

        <p className="mb-3 font-body text-sm text-ink-soft">
          We rebalanced the algo so a single push today doesn&rsquo;t max the
          meter. Energy is split across five components, none of which can
          carry a pet alone:
        </p>

        <ul className="space-y-2">
          {SCORE_BUDGET.map((r) => (
            <li
              key={r.label}
              className="flex items-start gap-3 rounded-2xl bg-canvas/60 px-3 py-2"
            >
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{ background: r.tint, boxShadow: `0 0 8px ${r.tint}55` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-base font-700 text-ink">
                    {r.label}
                  </span>
                  <span
                    className="font-pixel text-base leading-none lcd-glow"
                    style={{ color: "#1FCFB0" }}
                  >
                    max {r.max}
                  </span>
                </div>
                <p className="font-body text-sm text-ink-soft">{r.line}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-3 font-body text-sm text-ink-soft">
          The score then snaps to a stage: <span className="font-700 text-ink">Egg</span> (0–15) ·{" "}
          <span className="font-700 text-ink">Sprout</span> (16–35) ·{" "}
          <span className="font-700 text-ink">Builder</span> (36–65) ·{" "}
          <span className="font-700 text-ink">Evolved</span> (66–85) ·{" "}
          <span className="font-700 text-ink">Overclocked</span> (86+).
        </p>
      </div>
    </div>
  );
}
