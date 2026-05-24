"use client";

import { useEffect, useState } from "react";
import { ShipGotchiSprite } from "./ShipGotchiSprite";

const STEPS = [
  "Reading public commits",
  "Measuring shipping energy",
  "Sorting language snacks",
  "Polishing tiny goggles",
  "Hatching companion",
];

export function LoadingRitual({ username }: { username: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 320);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#FF6A45,#FFC23D,#1FCFB0,#7B5CFF,#FF6A45)] opacity-20 blur-xl" />
        <ShipGotchiSprite variant="egg" mood="Curious" size={150} />
      </div>

      <div className="min-h-[3.5rem]">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
          scanning @{username}
        </p>
        <p key={step} className="animate-pop font-display text-xl font-600 text-ink">
          {STEPS[step]}
          <span className="text-coral">…</span>
        </p>
      </div>

      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= step ? "w-6 bg-coral" : "w-1.5 bg-ink/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
