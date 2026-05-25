"use client";

// =============================================================================
// How it works + For judges — copy the user sees at the bottom of the reveal.
// Voice: warm, confident, a little playful. Not the "ALL-CAPS RETRO TERMINAL"
// energy of the clones — we keep our sentence case + chunky display tone.
// =============================================================================

const STEPS: { title: string; line: string }[] = [
  {
    title: "1 · Paste a GitHub handle",
    line:
      "Any public username works. No login, no signup, no tokens to wire up.",
  },
  {
    title: "2 · We read the public trail",
    line:
      "Profile, last 100 public events, and recent repos. That's it — never anything private.",
  },
  {
    title: "3 · A pet is born from the score",
    line:
      "Pushes, PRs and issues become energy. Mood and stage follow. The Builder DNA card is yours to share.",
  },
];

const JUDGES: string[] = [
  "Paste any public GitHub username — your pet hatches in under 10 seconds.",
  "Try the demo chips for instant offline pets (no rate-limit risk on stage).",
  "Hatch up to four to fill the Session Board and trigger superlatives.",
  "Mood, evolution stage, level and outfit are all derived deterministically — same input, same pet.",
  "Mobile-friendly. Try resizing the window or opening on a phone.",
  "No login. No tracking. The session board lives in memory only.",
];

export function HowItWorks() {
  return (
    <div className="card-toy rounded-3xl p-5">
      <div className="mb-4">
        <h3 className="font-pixel text-2xl text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
          How your ShipGotchi grows
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          public github · in 3 small steps
        </p>
      </div>

      <ol className="space-y-3">
        {STEPS.map((s) => (
          <li key={s.title} className="rounded-2xl bg-canvas/60 p-3">
            <p className="font-display text-base font-700 text-ink">{s.title}</p>
            <p className="mt-0.5 font-body text-sm text-ink-soft">{s.line}</p>
          </li>
        ))}
      </ol>

      <div className="mt-5">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          For judges · testable in under 10 seconds
        </p>
        <ul className="space-y-1.5">
          {JUDGES.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 font-body text-sm text-ink"
            >
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
