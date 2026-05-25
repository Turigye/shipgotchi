import { ShipGotchiSprite } from "@/components/ShipGotchiSprite";
import { LCD_SPRITES, LCD_STATE_ORDER } from "@/lib/lcd-sprites";
import type { Mood, SpriteVariant } from "@/lib/types";

export const metadata = {
  title: "Sprite QA · ShipGotchi",
};

const VARIANTS: SpriteVariant[] = [
  "egg",
  "sprout",
  "builder",
  "evolved",
  "overclocked",
  "sleepy",
  "mystery",
];

const MOODS: Mood[] = ["Hyped", "Focused", "Curious", "Sleepy", "Ancient Sage"];

const DEFAULT_MOOD: Record<SpriteVariant, Mood> = {
  egg: "Curious",
  sprout: "Hyped",
  builder: "Focused",
  evolved: "Hyped",
  overclocked: "Hyped",
  sleepy: "Sleepy",
  mystery: "Curious",
};

const PETSWATCH: Record<Mood, string> = {
  Hyped: "#FF8A4C",
  Focused: "#27D0B2",
  Curious: "#8C6BFF",
  Sleepy: "#9AA3E0",
  "Ancient Sage": "#F4C45C",
};

function Cell({
  variant,
  mood,
  size = 160,
  still = false,
}: {
  variant: SpriteVariant;
  mood: Mood;
  size?: number;
  still?: boolean;
}) {
  return (
    <div className="card-toy flex flex-col items-center gap-2 rounded-2xl p-4">
      <div className="grid h-[180px] w-[180px] place-items-center rounded-xl bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),rgba(255,246,236,0.4))]">
        <ShipGotchiSprite variant={variant} mood={mood} size={size} still={still} />
      </div>
      <div className="text-center">
        <p className="font-display text-sm font-700 capitalize text-ink">{variant}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          {mood} {still && "· still"}
        </p>
      </div>
    </div>
  );
}

export default function SpritesQAPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-700 text-ink">Sprite QA grid</h1>
        <p className="mt-1 font-body text-sm text-ink-soft">
          Live, animated reference for every variant and the Builder × mood matrix.
          Hard refresh after editing patterns.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-600 text-ink">
          LCD v2 — all 12 raster animations
        </h2>
        <p className="mb-4 font-body text-xs text-ink-soft">
          Source of truth: <code>/public/lcd-sprites/</code>. Loaded as GIF, rendered with{" "}
          <code>image-rendering: pixelated</code>.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {LCD_STATE_ORDER.map((state) => {
            const s = LCD_SPRITES[state];
            return (
              <div
                key={state}
                className="card-toy flex flex-col items-center gap-2 rounded-2xl p-3"
              >
                <div className="grid h-[140px] w-[140px] place-items-center rounded-xl bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),rgba(255,246,236,0.4))]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.gif}
                    alt={state}
                    width={128}
                    height={128}
                    style={{ imageRendering: "pixelated", display: "block" }}
                  />
                </div>
                <div className="text-center">
                  <p className="font-display text-sm font-700 text-ink">{state}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                    {s.frames}f · {s.fps}fps
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-600 text-ink">
          All variants — animated, canonical mood
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {VARIANTS.map((v) => (
            <Cell key={v} variant={v} mood={DEFAULT_MOOD[v]} size={160} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-600 text-ink">
          Same set — still (no animation), for design review
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {VARIANTS.map((v) => (
            <Cell key={v} variant={v} mood={DEFAULT_MOOD[v]} size={160} still />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-600 text-ink">
          Compare-card size (96px) — small-render check
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {VARIANTS.map((v) => (
            <div
              key={v}
              className="card-toy flex flex-col items-center gap-1 rounded-xl p-2"
            >
              <ShipGotchiSprite
                variant={v}
                mood={DEFAULT_MOOD[v]}
                size={96}
              />
              <span className="font-mono text-[10px] text-ink-soft">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-600 text-ink">
          Builder × all moods — palette + expression sanity check
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {MOODS.map((m) => (
            <Cell key={m} variant="builder" mood={m} size={140} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-600 text-ink">
          Mood palette swatches
        </h2>
        <div className="flex flex-wrap gap-3">
          {MOODS.map((m) => (
            <div
              key={m}
              className="flex items-center gap-3 rounded-full bg-cream px-3 py-2 shadow-sm"
            >
              <span
                className="h-6 w-6 rounded-full border border-ink/10"
                style={{ background: PETSWATCH[m] }}
              />
              <span className="font-mono text-xs text-ink">{m}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
