"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShipGotchiSprite } from "./ShipGotchiSprite";
import type { PetProfile } from "@/lib/types";

function awardFor(pets: PetProfile[]) {
  if (pets.length < 2) return {} as Record<string, string[]>;
  const map: Record<string, string[]> = {};
  const push = (login: string, label: string) => {
    (map[login] ??= []).push(label);
  };
  const by = <T,>(sel: (p: PetProfile) => T, cmp: (a: T, b: T) => number) =>
    [...pets].sort((a, b) => cmp(sel(a), sel(b)))[0];

  push(by((p) => p.energyScore, (a, b) => b - a).username, "⚡ Most energy");
  push(by((p) => p.energyScore, (a, b) => a - b).username, "😴 Sleepiest");
  push(by((p) => p.languageCount, (a, b) => b - a).username, "🧪 Most languages");
  push(by((p) => p.accountAgeYears, (a, b) => b - a).username, "🏛️ Most ancient");
  return map;
}

export function CompareTray({
  pets,
  onRemove,
  onClear,
}: {
  pets: PetProfile[];
  onRemove: (username: string) => void;
  onClear: () => void;
}) {
  if (pets.length < 2) return null;
  const awards = awardFor(pets);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-24 pt-10">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl font-700 text-ink">The litter</h3>
        <button
          onClick={onClear}
          className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-coral"
        >
          clear all
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AnimatePresence>
          {pets.map((pet) => (
            <motion.div
              key={pet.username}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="card-toy relative flex flex-col items-center rounded-[1.4rem] p-4 text-center"
            >
              <button
                onClick={() => onRemove(pet.username)}
                aria-label={`Remove ${pet.username}`}
                className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-ink/8 font-mono text-xs text-ink-soft transition-colors hover:bg-coral hover:text-white"
              >
                ×
              </button>

              <ShipGotchiSprite
                variant={pet.spriteVariant}
                mood={pet.mood}
                outfitTrait={pet.outfitTrait}
                size={96}
                still
              />
              <p className="mt-1 truncate font-mono text-xs text-ink-soft">@{pet.username}</p>
              <p className="font-display text-sm font-600 text-ink">{pet.evolutionStage}</p>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/8">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pet.energyScore}%`,
                    backgroundImage: "linear-gradient(90deg,#1FCFB0,#FFC23D,#FF6A45)",
                  }}
                />
              </div>

              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {(awards[pet.username] ?? []).map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-canvas px-2 py-0.5 font-mono text-[10px] text-ink"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
