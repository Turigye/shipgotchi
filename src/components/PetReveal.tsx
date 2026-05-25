/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "motion/react";
import { BuilderDNACard } from "./BuilderDNACard";
import { BuilderVitals } from "./BuilderVitals";
import { BuilderFingerprint } from "./BuilderFingerprint";
import { EvolutionTimeline } from "./EvolutionTimeline";
import { HatchForm } from "./HatchForm";
import { ShipGotchiSprite } from "./ShipGotchiSprite";
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

      <motion.div variants={item} className="relative">
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

      <motion.div variants={item} className="flex items-center gap-3 text-center">
        {pet.avatarUrl ? (
          <img
            src={pet.avatarUrl}
            alt=""
            className="h-14 w-14 rounded-full border-2 border-white object-cover shadow"
            loading="lazy"
          />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-full bg-grape/20 font-pixel text-xl text-grape">
            ?
          </div>
        )}
        <div className="text-left">
          <h2 className="font-pixel text-3xl leading-none text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
            {pet.displayName}
          </h2>
          <p className="font-mono text-sm text-ink-soft">
            <a
              href={pet.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-coral"
            >
              @{pet.username}
            </a>{" "}
            · {pet.spriteVariant === "mystery" ? "Mystery" : pet.evolutionStage} ·{" "}
            {pet.builderClass}
          </p>
        </div>
      </motion.div>

      {/* === DASHBOARD: two-column grid on md+ for horizontal density === */}
      <div className="mt-2 grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        {/* Left column — the collectible card */}
        <motion.div variants={item} className="flex justify-center md:justify-end">
          <BuilderDNACard pet={pet} />
        </motion.div>

        {/* Right column — stats stack */}
        <motion.div variants={item} className="flex w-full max-w-md flex-col gap-5 md:max-w-none md:items-start">
          <BuilderVitals pet={pet} />
          <EvolutionTimeline pet={pet} />
          <BuilderFingerprint pet={pet} />
        </motion.div>
      </div>

      {/* add-another / reset */}
      <motion.div variants={item} className="flex w-full flex-col items-center gap-3 pt-4">
        {rosterCount < 4 && (
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
