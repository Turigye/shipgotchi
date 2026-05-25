"use client";

import { useState } from "react";
import type { Mood, SpriteVariant } from "@/lib/types";
import { LCD_SPRITES, variantToLcdState } from "@/lib/lcd-sprites";
import { ShipGotchiSpriteSVG } from "./ShipGotchiSpriteSVG";

// =============================================================================
// ShipGotchi sprite — V2 LCD/Tamagotchi raster assets.
//
// Renders the pre-rendered LCD GIF from /public/lcd-sprites/ for each variant.
// If the image fails to load (404, decode error), we fall back to the legacy
// SVG pixel-art component so the app never shows a broken pet.
//
// API is intentionally unchanged from V1 so every consumer (BuilderDNACard,
// CompareTray, HatchForm, LoadingRitual, PetReveal, ShipGotchiApp) keeps
// working without edits.
// =============================================================================

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
  outfitTrait,
  size = 240,
  still = false,
  className,
}: SpriteProps) {
  const [failed, setFailed] = useState(false);

  const state = variantToLcdState(variant);
  const sprite = LCD_SPRITES[state];

  // `still` shows the first-frame PNG sheet (256x256 frame, cropped via
  // background-position) instead of the GIF. For the MVP we just show the
  // sheet's first frame via object-fit since each sheet's first frame is
  // representative of the variant.
  const src = still ? sprite.sheet : sprite.gif;
  const tapClass = still ? "" : "shipgotchi-tap";

  if (failed) {
    return (
      <ShipGotchiSpriteSVG
        variant={variant}
        mood={mood}
        outfitTrait={outfitTrait}
        size={size}
        still={still}
        className={className}
      />
    );
  }

  return (
    <div
      className={`${tapClass} ${className ?? ""}`.trim()}
      style={{ width: size, height: size, lineHeight: 0 }}
      aria-hidden
    >
      {still ? (
        // Show only the first frame of the spritesheet by sizing the
        // background to N frames wide and clipping to the first cell.
        <div
          style={{
            width: size,
            height: size,
            backgroundImage: `url(${sprite.sheet})`,
            backgroundSize: `${size * sprite.frames}px ${size}px`,
            backgroundPosition: "0 0",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          onError={() => setFailed(true)}
          style={{
            width: size,
            height: size,
            display: "block",
            imageRendering: "pixelated",
          }}
        />
      )}
    </div>
  );
}
