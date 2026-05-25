"use client";

// =============================================================================
// Builder Vitals — happiness/energy/hunger/streak bars + a granular stat grid.
// Sits below the hero sprite in PetReveal. Pulls from pet.stats + pet.energyScore.
// =============================================================================

import type { PetProfile } from "@/lib/types";
import { CommitSparkline } from "./CommitSparkline";

function Bar({
  label,
  value,
  tint,
  invert = false,
}: {
  label: string;
  value: number;
  tint: string;
  invert?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  // For "hunger" we want low = good, so we still show the fill but tint it
  // amber as it climbs. The caller picks the color.
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
        <span>{label}</span>
        <span className="text-ink">{invert ? `${pct}%` : `${pct}%`}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%`, backgroundImage: tint }}
        />
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-canvas/60 px-3 py-2">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">{label}</p>
      <p className="mt-0.5 font-pixel text-3xl leading-none text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
        {value}
      </p>
    </div>
  );
}

export function BuilderVitals({ pet }: { pet: PetProfile }) {
  const s = pet.stats;

  return (
    <div className="card-toy w-full rounded-3xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-pixel text-2xl text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
            Builder Vitals
          </h3>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
            live readout · public github
          </p>
        </div>
        <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-xs font-700 text-cream">
          LV {pet.level}
        </span>
      </div>

      {/* Four-bar Tamagotchi vital block */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Bar
          label="Happiness"
          value={pet.happiness}
          tint="linear-gradient(90deg,#FF8FB1,#FF6A45)"
        />
        <Bar
          label="Energy"
          value={pet.energyScore}
          tint="linear-gradient(90deg,#1FCFB0,#FFC23D)"
        />
        <Bar
          label="Hunger"
          value={pet.hunger}
          tint="linear-gradient(90deg,#FFC23D,#FF6A45)"
          invert
        />
        <Bar
          label="Streak"
          value={Math.min(100, s.streakDays * 14)}
          tint="linear-gradient(90deg,#58C6FF,#7B5CFF)"
        />
      </div>

      {/* 7-day commit sparkline — LCD-screen styled */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          <span>Last 7 days · commits</span>
        </div>
        <CommitSparkline values={s.dailyCommits7d} />
      </div>

      {/* Stat grid */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatCell label="Commits 24h" value={s.commits24h} />
        <StatCell label="Commits 7d" value={s.commits7d} />
        <StatCell label="Pushes" value={s.pushEvents} />
        <StatCell label="PRs" value={s.pullRequests} />
        <StatCell label="Issues" value={s.issues} />
        <StatCell label="Streak" value={`${s.streakDays}d`} />
      </div>
    </div>
  );
}
