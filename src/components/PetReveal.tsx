"use client";

import { motion } from "motion/react";
import { BuilderDNACard } from "./BuilderDNACard";
import { HatchForm } from "./HatchForm";
import { ShipGotchiSprite } from "./ShipGotchiSprite";
import { moodBubble } from "@/lib/copy";
import type { PetProfile } from "@/lib/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
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

      {/* mood speech bubble */}
      <motion.div variants={item} className="relative">
        <div className="card-toy rounded-3xl px-5 py-2.5">
          <p className="font-display text-base font-600 text-ink">
            {pet.spriteVariant === "mystery"
              ? "Shhh… secrets."
              : moodBubble(pet.mood, pet.evolutionStage)}
          </p>
        </div>
        <div className="mx-auto h-3 w-3 rotate-45 bg-cream border-b border-r border-ink/8" />
      </motion.div>

      {/* hero sprite */}
      <motion.div
        variants={item}
        className="relative"
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.1 }}
        >
          <ShipGotchiSprite
            variant={pet.spriteVariant}
            mood={pet.mood}
            outfitTrait={pet.outfitTrait}
            size={260}
          />
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="text-center">
        <h2 className="font-display text-2xl font-700 text-ink sm:text-3xl">
          {pet.displayName}&rsquo;s ShipGotchi
        </h2>
        <p className="font-mono text-sm text-ink-soft">
          {pet.spriteVariant === "mystery" ? "Mystery" : pet.evolutionStage} · {pet.builderClass}
        </p>
      </motion.div>

      {/* the collectible */}
      <motion.div variants={item}>
        <BuilderDNACard pet={pet} />
      </motion.div>

      {/* add-another / reset */}
      <motion.div variants={item} className="flex w-full flex-col items-center gap-3 pt-2">
        {rosterCount < 4 && (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              hatch a friend to compare
            </p>
            <HatchForm onHatch={onHatch} pending={pending} compact />
          </>
        )}
        <button
          type="button"
          onClick={onReset}
          className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-coral"
        >
          start over
        </button>
      </motion.div>
    </motion.div>
  );
}
