"use client";

import { motion } from "motion/react";
import { BuilderDNACard } from "./BuilderDNACard";
import { BuilderVitals } from "./BuilderVitals";
import { BuilderFingerprint } from "./BuilderFingerprint";
import { EvolutionTimeline } from "./EvolutionTimeline";
import { HatchForm } from "./HatchForm";
import { moodBubble } from "@/lib/copy";
import type { PetProfile } from "@/lib/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 220, damping: 22 } },
};

export function PetReveal({
  pet,
  note,
  onHatch,
  pending,
  rosterCount,
  onReset,
}: {
  pet: PetProfile;
  note?: string;
  onHatch: (username: string) => void;
  pending: boolean;
  rosterCount: number;
  onReset: () => void;
}) {
  return (
    <motion.div
      key={pet.username}
      variants={container}
      initial="hidden"
      animate="show"
      className="flex w-full flex-col items-center gap-6"
    >
      {note && (
        <motion.p
          variants={item}
          className="rounded-full bg-sunshine/25 px-4 py-1.5 text-center font-body text-sm text-ink"
        >
          {note}
        </motion.p>
      )}

      {/* === HERO ROW: bubble + sprite + avatar header (full width, centered) === */}
      <motion.div variants={item} className="relative">
        <div className="card-toy rounded-3xl px-5 py-2.5">
          <p className="font-display text-lg font-600 text-ink">
            {pet.spriteVariant === "mystery"
              ? "Shhh… secrets."
              : moodBubble(pet.mood, pet.evolutionStage)}
          </p>
        </div>
        <div className="mx-auto h-3 w-3 rotate-45 bg-cream border-b border-r border-ink/8" />
      </motion.div>

      {/* The big hero sprite is intentionally removed — the Builder DNA
          card below already shows the same gotchi inside its LCD-green
          stage, and the speech bubble above keeps the "alive" feel. */}

      {/* === DASHBOARD: two-column grid on md+ for horizontal density === */}
      <div className="mt-2 grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        {/* Left column — collectible card with the fingerprint right below it */}
        <motion.div variants={item} className="flex w-full max-w-md flex-col gap-5 self-center md:max-w-none md:items-end md:self-start">
          <BuilderDNACard pet={pet} />
          <div className="w-full md:max-w-sm">
            <BuilderFingerprint pet={pet} />
          </div>
        </motion.div>

        {/* Right column — vitals + evolution stack */}
        <motion.div variants={item} className="flex w-full max-w-md flex-col gap-5 self-center md:max-w-none md:items-start md:self-start">
          <BuilderVitals pet={pet} />
          <EvolutionTimeline pet={pet} />
        </motion.div>
      </div>

      {/* add-another / reset */}
      <motion.div variants={item} className="flex w-full flex-col items-center gap-3 pt-4">
        {rosterCount < 10 && (
          <>
            <p className="font-mono text-sm uppercase tracking-[0.16em] text-ink-soft">
              hatch a friend to compare
            </p>
            <HatchForm onHatch={onHatch} pending={pending} compact />
          </>
        )}
        <button
          type="button"
          onClick={onReset}
          className="mt-1 font-mono text-sm uppercase tracking-[0.14em] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-coral"
        >
          start over
        </button>
      </motion.div>
    </motion.div>
  );
}
