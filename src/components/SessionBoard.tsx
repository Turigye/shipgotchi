/* eslint-disable @next/next/no-img-element */
"use client";

// =============================================================================
// Session Board — leaderboard of the pets you've hatched in this session.
// Replaces the old CompareTray with a richer, judge-friendly table view.
// Stored only in component state (no localStorage), so the board resets on
// page refresh. Each row carries avatar, stage, mood, lvl, score and a
// "Resummon" action that re-runs the hatch flow.
// =============================================================================

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

export function SessionBoard({
  pets,
  onRemove,
  onClear,
  onResummon,
}: {
  pets: PetProfile[];
  onRemove: (username: string) => void;
  onClear: () => void;
  onResummon: (username: string) => void;
}) {
  if (pets.length < 1) return null;
  const awards = awardFor(pets);
  // Sort by energy score descending so the strongest builder leads the board.
  const ranked = [...pets].sort((a, b) => b.energyScore - a.energyScore);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10">
      <div className="card-toy overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
          <div>
            <h3 className="font-pixel text-2xl text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
              Session Board
            </h3>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
              builders summoned this session · {pets.length}/4
            </p>
          </div>
          <button
            onClick={onClear}
            className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-coral"
          >
            clear all
          </button>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-canvas/60">
              <tr className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
                <th className="px-4 py-2 w-12">#</th>
                <th className="px-2 py-2">Builder</th>
                <th className="px-2 py-2">Stage</th>
                <th className="px-2 py-2">Mood</th>
                <th className="px-2 py-2">Lv</th>
                <th className="px-2 py-2">Score</th>
                <th className="px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {ranked.map((pet, idx) => (
                  <motion.tr
                    key={pet.username}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-ink/8 align-middle"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-9 w-9 shrink-0">
                          {pet.avatarUrl ? (
                            <img
                              src={pet.avatarUrl}
                              alt=""
                              className="h-9 w-9 rounded-full border border-white object-cover shadow-sm"
                              loading="lazy"
                            />
                          ) : (
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-grape/20 font-pixel text-grape">
                              ?
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm font-700 leading-tight text-ink">
                            {pet.displayName}
                          </p>
                          <p className="truncate font-mono text-xs text-ink-soft">
                            @{pet.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <span className="rounded-full bg-coral/15 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-coral">
                        {pet.evolutionStage}
                      </span>
                    </td>
                    <td className="px-2 py-3 font-mono text-xs text-ink">{pet.mood}</td>
                    <td className="px-2 py-3 font-pixel text-lg leading-none text-ink">
                      {pet.level}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-lg leading-none text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
                          {pet.energyScore}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink/8">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pet.energyScore}%`,
                              backgroundImage: "linear-gradient(90deg,#1FCFB0,#FFC23D,#FF6A45)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onResummon(pet.username)}
                          className="rounded-full bg-grape/12 px-3 py-1 font-mono text-xs uppercase tracking-wide text-grape transition-colors hover:bg-grape hover:text-white"
                        >
                          Resummon
                        </button>
                        <button
                          onClick={() => onRemove(pet.username)}
                          aria-label={`Remove ${pet.username}`}
                          className="grid h-7 w-7 place-items-center rounded-full bg-ink/8 font-mono text-xs text-ink-soft transition-colors hover:bg-coral hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:hidden">
          <AnimatePresence>
            {ranked.map((pet, idx) => (
              <motion.div
                key={pet.username}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="relative rounded-2xl border border-ink/8 bg-canvas/50 p-3"
              >
                <button
                  onClick={() => onRemove(pet.username)}
                  aria-label={`Remove ${pet.username}`}
                  className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-ink/8 font-mono text-xs text-ink-soft hover:bg-coral hover:text-white"
                >
                  ×
                </button>
                <div className="flex items-center gap-3">
                  <ShipGotchiSprite
                    variant={pet.spriteVariant}
                    mood={pet.mood}
                    outfitTrait={pet.outfitTrait}
                    size={64}
                    still
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-ink-soft">#{idx + 1}</p>
                    <p className="truncate font-display text-sm font-700 text-ink">
                      {pet.displayName}
                    </p>
                    <p className="truncate font-mono text-xs text-ink-soft">
                      @{pet.username} · {pet.evolutionStage}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-pixel text-base leading-none text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
                    LV {pet.level} · {pet.energyScore}
                  </span>
                  <button
                    onClick={() => onResummon(pet.username)}
                    className="rounded-full bg-grape/12 px-3 py-1 font-mono text-xs uppercase tracking-wide text-grape hover:bg-grape hover:text-white"
                  >
                    Resummon
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Award strip — surfaces the same fun superlatives the tray used. */}
      {pets.length >= 2 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.entries(awards).flatMap(([username, badges]) =>
            badges.map((label) => (
              <span
                key={`${username}-${label}`}
                className="rounded-full bg-cream px-3 py-1 font-mono text-xs text-ink shadow-sm"
              >
                <span className="text-ink-soft">@{username}</span> · {label}
              </span>
            )),
          )}
        </div>
      )}
    </section>
  );
}
