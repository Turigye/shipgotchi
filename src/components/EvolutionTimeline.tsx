"use client";

// =============================================================================
// Evolution timeline — horizontal strip showing the 5 active stages with the
// current one glowing. Sleepy is treated as a side-branch so the main growth
// arc reads cleanly.
// =============================================================================

import type { EvolutionStage, PetProfile } from "@/lib/types";

const STAGES: { key: EvolutionStage; label: string; score: string }[] = [
  { key: "Egg", label: "Egg", score: "0–15" },
  { key: "Sprout", label: "Sprout", score: "16–35" },
  { key: "Builder", label: "Builder", score: "36–65" },
  { key: "Evolved", label: "Evolved", score: "66–85" },
  { key: "Overclocked", label: "Overclocked", score: "86+" },
];

const SCORE_FLOORS: Record<EvolutionStage, number> = {
  Egg: 0,
  Sprout: 16,
  Builder: 36,
  Evolved: 66,
  Overclocked: 86,
  Sleepy: 0,
};

export function EvolutionTimeline({ pet }: { pet: PetProfile }) {
  // Resolve the index. If Sleepy, pick a coordinate based on the energyScore
  // so the marker still lands on the timeline.
  const isSleepy = pet.evolutionStage === "Sleepy";
  const effective: EvolutionStage = isSleepy
    ? pet.energyScore <= 15
      ? "Egg"
      : pet.energyScore <= 35
        ? "Sprout"
        : pet.energyScore <= 65
          ? "Builder"
          : "Evolved"
    : pet.evolutionStage;

  const activeIdx = STAGES.findIndex((s) => s.key === effective);

  // Progress to next stage (0..1) based on energy score within bands.
  const nextIdx = Math.min(STAGES.length - 1, activeIdx + 1);
  const floor = SCORE_FLOORS[STAGES[activeIdx].key];
  const ceiling =
    activeIdx < STAGES.length - 1 ? SCORE_FLOORS[STAGES[nextIdx].key] : 100;
  const progress =
    activeIdx === STAGES.length - 1
      ? 1
      : Math.max(0, Math.min(1, (pet.energyScore - floor) / (ceiling - floor)));

  return (
    <div className="card-toy w-full rounded-3xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-pixel text-2xl text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
          Evolution
        </h3>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          {isSleepy ? "napping mid-arc" : "in progress"}
        </span>
      </div>

      <div className="relative">
        {/* track */}
        <div className="absolute left-3 right-3 top-3 h-1 rounded-full bg-ink/10" />
        <div
          className="absolute left-3 top-3 h-1 rounded-full transition-[width] duration-700"
          style={{
            // Clamp to 0..1 so the max stage (Overclocked) doesn't overflow
            // the last node into the right gutter.
            width: `calc((100% - 1.5rem) * ${Math.min(
              1,
              Math.max(0, (activeIdx + progress) / (STAGES.length - 1)),
            )})`,
            backgroundImage: "linear-gradient(90deg,#1FCFB0,#FFC23D,#FF6A45)",
          }}
        />

        {/* nodes */}
        <ol className="relative flex items-start justify-between">
          {STAGES.map((stage, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            return (
              <li key={stage.key} className="flex flex-1 flex-col items-center">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full border-2 transition ${
                    isActive
                      ? "border-coral bg-coral text-white shadow-[0_0_14px_rgba(255,106,69,0.55)]"
                      : isPast
                        ? "border-mint bg-mint text-white"
                        : "border-ink/15 bg-cream text-ink-soft"
                  }`}
                >
                  <span className="font-mono text-xs font-700">{i + 1}</span>
                </span>
                <span
                  className={`mt-2 text-center font-mono text-xs uppercase tracking-wide ${
                    isActive ? "text-coral" : "text-ink-soft"
                  }`}
                >
                  {stage.label}
                </span>
                <span className="font-mono text-[11px] text-ink-soft/70">{stage.score}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
        <span>
          Score <span className="text-ink">{pet.energyScore}</span> / 100
        </span>
        <span>
          {activeIdx === STAGES.length - 1
            ? "Maxed · keep shipping"
            : `Next · ${STAGES[nextIdx].label}`}
        </span>
      </div>
    </div>
  );
}
