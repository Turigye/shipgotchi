"use client";

import type { Mood, SpriteVariant } from "@/lib/types";

// =============================================================================
// ShipGotchi — pixel art mascot. Polished from image-model reference.
//
// Universal eye style (the cute Tamagotchi standard):
//   Top row of eye:    EE  (solid dark)
//   Bottom row of eye: Ee  (dark on left, single white highlight bottom-right)
// This gives a "looking up to the right" sparkly expression.
//
// Universal body proportions:
//   Egg-shaped teardrop body (narrow top, widest mid, rounded base, tiny feet)
//   Eyes at rows 8-9, cheeks beside at row 10, mouth at row 11
//   White belly heart at rows 13-17 with a 5-pixel gold + commit cross
//
// Palette:
//   . transparent  B body fill (mood color)  W belly cream  X outline
//   E eye dark     e eye highlight white     C cheek pink
//   M mouth dark   S gold accent             L leaf green
//   Z sleep z's    ? mystery bottle glass    p pet inside bottle
// =============================================================================

const GRID = 20;

const BASE_PALETTE: Record<string, string> = {
  X: "#241C30",
  E: "#241C30",
  e: "#FFFDF8",
  C: "#FF8FB1",
  M: "#241C30",
  W: "#FFFDF8",
  S: "#FFC23D",
  L: "#27D0B2",
  Z: "#7B5CFF",
  "?": "#B79DFF",
  p: "#4A2D8A",
};

const MOOD_BODY: Record<Mood, string> = {
  Hyped: "#FF8A4C",
  Focused: "#27D0B2",
  Curious: "#8C6BFF",
  Sleepy: "#9AA3E0",
  "Ancient Sage": "#F4C45C",
};

const VARIANT_ICONS: Partial<Record<SpriteVariant, string[]>> = {
  egg: [
    "....................",
    "....................",
    ".............S.S.S..",
    "....................",
    "....................",
  ],
  sprout: [
    "...........LL.......",
    "..........LL........",
    ".........LLL........",
    "..........L.........",
    ".........L..........",
  ],
  builder: [
    ".............S......",
    "..............S.....",
    "...............S....",
    "..............S.....",
    ".............S......",
  ],
  evolved: [
    "..............S.....",
    ".............S.S....",
    "............S...S...",
    "..............S.....",
    ".............S.S....",
  ],
  overclocked: [
    "..............S.....",
    ".............SSS....",
    "............SCSCS...",
    ".............SCS....",
    "..............S.....",
  ],
};

interface SpriteFrames {
  a: string[];
  b: string[];
  blink?: string[];
  aura?: { a: string[]; b: string[] };
}

// =============================================================================
// PATTERNS
// =============================================================================

const SPRITES: Record<SpriteVariant, SpriteFrames> = {
  // --- EGG ---
  egg: {
    a: [
      "....................",
      ".........XX.........",
      "........XBBX........",
      ".......XBBBBX.......",
      "......XBSBBBSX......",
      ".....XBBBBBBBBX.....",
      ".....XBSBBBBBSX.....",
      "....XBBBBBBBBBBX....",
      "....XBBSBBBBSBBX....",
      "....XBXBBXXBBBBX....",
      "....XBBXBBXBBBBX....",
      "....XBBBXBBXBBBX....",
      "....XBBBBBBBSBBX....",
      "....XBSBBBBBBBBX....",
      "....XBBBBBBBBBBX....",
      ".....XBBSBBSBBX.....",
      ".....XBBBBBBBBX.....",
      "......XBBBBBBX......",
      ".......XBBBBX.......",
      "........XBBX........",
    ],
    b: [
      "....................",
      ".........XX.........",
      "........XBSX........",
      ".......XBBBBX.......",
      "......XBBSBBBX......",
      ".....XBSBBBBBBX.....",
      ".....XBBBBBSBBX.....",
      "....XBSBBBBBBBBX....",
      "....XBBBBBBBSBBX....",
      "....XBBXXBBXXBBX....",
      "....XBXBBXXBBBBX....",
      "....XBBXBBXBBBSX....",
      "....XBBSBBBBBBBX....",
      "....XBBBBBSBBBBX....",
      "....XBBBBBBBSBBX....",
      ".....XBSBBBBSBX.....",
      ".....XBBSBBBBBX.....",
      "......XBBBBBBX......",
      ".......XBBBBX.......",
      "........XBBX........",
    ],
  },

  // --- SPROUT ---
  sprout: {
    a: [
      ".........L..........",
      "........LLLL........",
      ".........LL.........",
      ".........X..........",
      "........XXXX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBEEBBEEBBX....",
      "....XBBEeBBEeBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBBMMBBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWWWWBBX....",
      "....XBWWWSWWWWBX....",
      "....XBWWSSSSSWBX....",
      "....XBWWWSWWWWBX....",
      ".....XBBWWWWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
    b: [
      ".........L..........",
      "........LLL.........",
      ".........LL.........",
      ".........X..........",
      "........XXXX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBEEBBEEBBX....",
      "....XBBEeBBEeBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBMMMMBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWWWWBBX....",
      "....XBWWWSWWWWBX....",
      "....XBWWSSSSSWBX....",
      "....XBWWWSWWWWBX....",
      ".....XBBWWWWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
  },

  // --- BUILDER ---
  builder: {
    a: [
      "....................",
      "....................",
      ".........XX.........",
      "........XBBX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBEEBBEEBBX....",
      "....XBBEeBBEeBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBBMMBBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWWWWBBX....",
      "....XBWWWSWWWWBX....",
      "....XBWWSSSSSWBX....",
      "....XBWWWSWWWWBX....",
      ".....XBBWWWWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
    // wink: right eye closes, mouth opens slightly
    b: [
      "....................",
      "....................",
      ".........XX.........",
      "........XBBX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBEEBBMMBBX....",
      "....XBBEeBBBBBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBMMMMBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWWWWBBX....",
      "....XBWWWSWWWWBX....",
      "....XBWWSSSSSWBX....",
      "....XBWWWSWWWWBX....",
      ".....XBBWWWWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
  },

  // --- EVOLVED ---
  evolved: {
    a: [
      "....................",
      "....................",
      ".........XX.........",
      "........XBBX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBEEBBEEBBX....",
      "....XBBEeBBEeBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBBMMBBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWSWWWBX....",
      "....XBWWWSSSWWBX....",
      "....XBWWSSSSSWBX....",
      "....XBWWWSSSWWBX....",
      ".....XBBWSSWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
    b: [
      "....................",
      "....................",
      ".........XX.........",
      "........XBBX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBMMBBEEBBX....",
      "....XBBBBBBEeBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBMMMMBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWSWWWBX....",
      "....XBWWSSSSSWBX....",
      "....XBWSSSSSSSBX....",
      "....XBWWSSSSSWBX....",
      ".....XBBWSSWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
  },

  // --- OVERCLOCKED ---
  overclocked: {
    a: [
      "....................",
      "..........X.........",
      ".........XSX........",
      "........XSSSX.......",
      ".......XSSSSSX......",
      "........XXXX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBEEBBEEBBX....",
      "....XBBEeBBEeBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBMMMMBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWSWWBBX....",
      "....XBWWSSSSSWBX....",
      "....XBBWWWSWWBBX....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
    b: [
      "....................",
      "..........X.........",
      ".........XSX........",
      "........XSSSX.......",
      ".......XSSSSSX......",
      "........XXXX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBEEBBEEBBX....",
      "....XBBEeBBEeBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBMMMMMMBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWSWWBBX....",
      "....XBWWSSSSSWBX....",
      "....XBBWWWSWWBBX....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
  },

  // --- SLEEPY ---
  sleepy: {
    a: [
      "....................",
      "....................",
      ".........XX.........",
      "........XBBX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBMMBBMMBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBBMMBBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBWWWWWWBBX....",
      "....XBWWWWWWWWBX....",
      "....XBWWWWWWWWBX....",
      "....XBWWWWWWWWBX....",
      ".....XBBWWWWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
    b: [
      "....................",
      "....................",
      ".........XX.........",
      "........XBBX........",
      ".......XBBBBX.......",
      "......XBBBBBBX......",
      ".....XBBBBBBBBX.....",
      "....XBBBBBBBBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBBMMBBMMBBX....",
      "....XBCBBBBBBCBX....",
      "....XBBBBMMBBBBX....",
      "....XBBBBBBBBBBX....",
      "....XBWWWWWWWWBX....",
      "....XBWWWWWWWWBX....",
      "....XBWWWWWWWWBX....",
      "....XBWWWWWWWWBX....",
      ".....XBBWWWWBBX.....",
      "......XBBBBBBX......",
      ".......XX..XX.......",
    ],
  },

  // --- MYSTERY ---
  mystery: {
    a: [
      "....................",
      "..........X.........",
      "..........X.........",
      ".........XXX........",
      "........XXXXX.......",
      ".......X?????X......",
      "......X???S????X....",
      ".....X??????????X...",
      "....X?S???????S??X..",
      "....X???XXXX?????X..",
      "....X??XppppX????X..",
      "....X??XpeppX???X...",
      "....X??XppppX??S?X..",
      "....X???XXXX?????X..",
      "....X??S????S????X..",
      ".....X?????????X....",
      ".....X???S????X.....",
      "......X??????X......",
      ".......XXXXXX.......",
      "....................",
    ],
    b: [
      "....................",
      "..........X.........",
      "..........X.........",
      ".........XXX........",
      "........XXXXX.......",
      ".......X?S???X......",
      "......X????S???X....",
      ".....X??S???????X...",
      "....X???????????SX..",
      "....X???XXXX?????X..",
      "....X??XppppX???X...",
      "....X??XpeppX???SX..",
      "....X??XppppX????X..",
      "....X???XXXX?????X..",
      "....X??????S?????X..",
      ".....X?S???????X....",
      ".....X?????S??X.....",
      "......X??????X......",
      ".......XXXXXX.......",
      "....................",
    ],
  },
};

function wrapperAnimation(variant: SpriteVariant, mood: Mood, still: boolean): string {
  if (still) return "";
  if (variant === "egg") return "animate-pixel-wiggle";
  if (variant === "mystery") return "animate-pixel-float";
  if (variant === "sleepy" || mood === "Sleepy") return "animate-pixel-snooze";
  if (variant === "overclocked" || mood === "Hyped") return "animate-pixel-bounce";
  return "animate-pixel-breathe";
}

function renderPattern(
  pattern: string[],
  palette: Record<string, string>,
  keyPrefix: string,
) {
  const out: React.ReactNode[] = [];
  pattern.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = palette[ch];
      if (!fill) return;
      out.push(
        <rect
          key={`${keyPrefix}-${x}-${y}`}
          x={x - 0.01}
          y={y - 0.01}
          width={1.02}
          height={1.02}
          fill={fill}
        />,
      );
    });
  });
  return out;
}

export interface SpriteProps {
  variant: SpriteVariant;
  mood: Mood;
  outfitTrait?: string | null;
  size?: number;
  still?: boolean;
  className?: string;
}

export function ShipGotchiSprite({
  variant,
  mood,
  size = 240,
  still = false,
  className,
}: SpriteProps) {
  const bodyColor = MOOD_BODY[variant === "mystery" ? "Curious" : mood];
  const palette: Record<string, string> = { ...BASE_PALETTE, B: bodyColor };
  const sprite = SPRITES[variant];
  const wrapAnim = wrapperAnimation(variant, mood, still);
  const tapClass = still ? "" : "shipgotchi-tap";

  return (
    <div
      className={`${tapClass} ${className ?? ""}`.trim()}
      style={{ width: size, height: size, lineHeight: 0 }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${GRID} ${GRID}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        className={wrapAnim}
        style={{ imageRendering: "pixelated", transformOrigin: "50% 92%" }}
      >
        {sprite.aura && (
          <>
            <g className={still ? "" : "pixel-aura-a"}>
              {renderPattern(sprite.aura.a, palette, "aura-a")}
            </g>
            {!still && (
              <g className="pixel-aura-b">
                {renderPattern(sprite.aura.b, palette, "aura-b")}
              </g>
            )}
          </>
        )}

        <g className={still ? "" : "pixel-frame-a"}>
          {renderPattern(sprite.a, palette, "a")}
        </g>

        {!still && (
          <g className="pixel-frame-b">
            {renderPattern(sprite.b, palette, "b")}
          </g>
        )}

        {!still && VARIANT_ICONS[variant] && (
          <g className="pixel-mood-icon">
            {renderPattern(VARIANT_ICONS[variant]!, palette, "vicon")}
          </g>
        )}

        {!still && sprite.blink && (
          <g className="pixel-blink">
            {renderPattern(sprite.blink, palette, "blink")}
          </g>
        )}
      </svg>
    </div>
  );
}
