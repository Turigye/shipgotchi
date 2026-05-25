"use client";

// =============================================================================
// Mood Reference — the legend that explains how activity timing becomes mood.
// Mirrors the scoring/mood function so judges can map the pet back to the data.
// =============================================================================

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
    </div>
  );
}
