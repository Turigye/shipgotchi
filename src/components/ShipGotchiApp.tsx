"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { hatchPet } from "@/lib/github-client";
import type { PetProfile } from "@/lib/types";
import { HatchForm } from "./HatchForm";
import { LoadingRitual } from "./LoadingRitual";
import { PetReveal } from "./PetReveal";
import { CompareTray } from "./CompareTray";
import { ShipGotchiSprite } from "./ShipGotchiSprite";

type Phase = "idle" | "hatching" | "revealed";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MAX = 4;

export function ShipGotchiApp() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pending, setPending] = useState(false);
  const [hatchingName, setHatchingName] = useState("");
  const [roster, setRoster] = useState<PetProfile[]>([]);
  const [hero, setHero] = useState<PetProfile | null>(null);
  const [note, setNote] = useState<string | undefined>();

  const hatch = useCallback(
    async (username: string) => {
      if (pending) return;
      setPending(true);
      setHatchingName(username.replace(/^@/, ""));
      setPhase("hatching");
      setNote(undefined);

      const [result] = await Promise.all([hatchPet(username), wait(1500)]);

      setRoster((prev) => {
        const key = result.pet.username.toLowerCase();
        const without = prev.filter((p) => p.username.toLowerCase() !== key);
        const next = [...without, result.pet];
        return next.slice(-MAX);
      });
      setHero(result.pet);
      setNote(result.note);
      setPhase("revealed");
      setPending(false);
    },
    [pending],
  );

  const reset = useCallback(() => {
    setRoster([]);
    setHero(null);
    setNote(undefined);
    setPhase("idle");
  }, []);

  const removeFromRoster = useCallback(
    (username: string) => {
      setRoster((prev) => {
        const next = prev.filter((p) => p.username.toLowerCase() !== username.toLowerCase());
        if (next.length === 0) {
          setPhase("idle");
          setHero(null);
        } else if (hero && hero.username.toLowerCase() === username.toLowerCase()) {
          setHero(next[next.length - 1]);
        }
        return next;
      });
    },
    [hero],
  );

  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <button onClick={reset} className="flex items-center gap-2" aria-label="ShipGotchi home">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-coral text-white shadow">
            <span className="font-display text-lg font-700">S</span>
          </span>
          <span className="font-display text-xl font-700 text-ink">ShipGotchi</span>
        </button>
        <span className="rounded-full border border-ink/12 bg-cream/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          no login · live data
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center px-5">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.section
              key="idle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex w-full max-w-2xl flex-col items-center gap-7 pt-6 text-center sm:pt-12"
            >
              <span className="rounded-full bg-grape/12 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-grape">
                a tamagotchi for builders
              </span>

              <div className="animate-float">
                <ShipGotchiSprite variant="builder" mood="Hyped" outfitTrait="Star Visor" size={200} />
              </div>

              <h1 className="font-display text-5xl font-700 leading-[0.95] text-ink sm:text-6xl">
                Meet the creature
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(100deg,#FF6A45,#7B5CFF 60%,#1FCFB0)" }}
                >
                  your commits
                </span>{" "}
                created.
              </h1>
              <p className="max-w-md font-body text-lg text-ink-soft">
                Paste any public GitHub username and hatch a premium builder pet that grows from how
                you ship. No login. No setup.
              </p>

              <HatchForm onHatch={hatch} pending={pending} />
            </motion.section>
          )}

          {phase === "hatching" && (
            <motion.section
              key="hatching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-xl flex-col items-center pt-10"
            >
              <LoadingRitual username={hatchingName} />
            </motion.section>
          )}

          {phase === "revealed" && hero && (
            <motion.section
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-2xl flex-col items-center pt-4"
            >
              <PetReveal
                pet={hero}
                note={note}
                onHatch={hatch}
                pending={pending}
                rosterCount={roster.length}
                onReset={reset}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {phase === "revealed" && <CompareTray pets={roster} onRemove={removeFromRoster} onClear={reset} />}
      </main>

      <footer className="mx-auto w-full max-w-5xl px-5 py-6 text-center">
        <p className="font-mono text-[11px] text-ink-soft/70">
          Built in 24h for the Dollar Vibe Club sprint · public GitHub data, never stored
        </p>
      </footer>
    </div>
  );
}
