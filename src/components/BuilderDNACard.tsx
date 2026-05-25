/* eslint-disable @next/next/no-img-element */
"use client";

import { ShipGotchiSprite } from "./ShipGotchiSprite";
import type { PetProfile } from "@/lib/types";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      <span className="font-display text-lg font-600 leading-tight text-ink">{value}</span>
    </div>
  );
}

export function BuilderDNACard({ pet }: { pet: PetProfile }) {
  return (
    <div className="relative w-full max-w-sm select-none">
      {/* holographic gradient frame */}
      <div
        className="rounded-[1.9rem] p-[2.5px] shadow-[0_30px_60px_-30px_rgba(36,28,48,0.6)]"
        style={{
          backgroundImage:
            "linear-gradient(135deg,#FF6A45,#FFC23D 25%,#1FCFB0 55%,#7B5CFF 80%,#FF8FB1)",
          backgroundSize: "300% 300%",
          animation: "shimmer 6s linear infinite",
        }}
      >
        <div className="relative overflow-hidden rounded-[1.7rem] bg-cream">
          {/* holo sheen */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
            style={{
              backgroundImage:
                "linear-gradient(115deg,transparent 30%,rgba(255,255,255,0.9) 45%,transparent 60%)",
              backgroundSize: "250% 250%",
              animation: "shimmer 5s linear infinite",
            }}
          />

          {/* header — avatar + name on the left, stage chip + LV pill aligned on the right */}
          <div className="flex items-center gap-3 px-5 pt-5">
            {pet.avatarUrl ? (
              <img
                src={pet.avatarUrl}
                alt=""
                className="h-11 w-11 rounded-full border-2 border-white object-cover shadow"
                loading="lazy"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-grape/20" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-700 leading-tight text-ink">
                {pet.displayName}
              </p>
              <p className="truncate font-mono text-sm text-ink-soft">@{pet.username}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-full bg-coral px-2.5 py-1 font-mono text-[10px] font-700 uppercase tracking-wide text-white shadow">
                {pet.spriteVariant === "mystery" ? "Mystery" : pet.evolutionStage}
              </span>
              <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] font-700 text-cream">
                LV {pet.level}
              </span>
            </div>
          </div>

          {/* sprite stage — LCD-green panel matched to the green baked into
              the raster sprites, so the gotchi sits inside one continuous
              screen instead of floating over a gray gradient. Works in
              both light and dark modes since the green is universal. */}
          <div
            className="relative mx-5 mt-3 flex justify-center rounded-[1.3rem] py-3"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, #D6E2A1 0%, #C5D58B 55%, #B5C97A 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <ShipGotchiSprite
              variant={pet.spriteVariant}
              mood={pet.mood}
              outfitTrait={pet.outfitTrait}
              size={150}
            />
          </div>

          {/* energy meter */}
          <div className="px-5 pt-4">
            <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              <span>Shipping energy</span>
              <span className="text-ink">{pet.energyScore}/100</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-ink/8">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{
                  width: `${pet.energyScore}%`,
                  backgroundImage: "linear-gradient(90deg,#1FCFB0,#FFC23D,#FF6A45)",
                }}
              />
            </div>
          </div>

          {/* stat grid */}
          <div className="grid grid-cols-2 gap-3 px-5 pt-4">
            <Stat label="Class" value={pet.builderClass} />
            <Stat label="Mood" value={pet.mood} />
            <Stat label="Top language" value={pet.topLanguage} />
            <Stat label="Outfit" value={pet.outfitTrait ?? "None yet"} />
          </div>

          {/* personality line */}
          <div className="mx-5 mb-5 mt-4 rounded-2xl bg-canvas/70 px-4 py-3">
            <p className="font-display text-sm leading-snug text-ink">
              &ldquo;{pet.personalityLine}&rdquo;
            </p>
          </div>

          {/* foil footer */}
          <div className="flex items-center justify-between border-t border-ink/8 px-5 py-2.5">
            <span className="font-mono text-[10px] font-700 uppercase tracking-[0.2em] text-ink-soft">
              ShipGotchi · Builder DNA
            </span>
            {pet.isSample && (
              <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft/70">
                sample
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
