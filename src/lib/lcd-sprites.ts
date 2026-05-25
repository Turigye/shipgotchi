// =============================================================================
// LCD sprite manifest — final V2 handoff package living under /lcd-sprites/.
//
// Each state has a GIF (browser-native animation), a PNG horizontal
// spritesheet, and JSON frame metadata. We use the GIF for the MVP because
// it's the simplest reliable path; the sheets are kept available for future
// canvas-driven rendering.
// =============================================================================

import type { SpriteVariant } from "./types";

export type LcdState =
  | "idle"
  | "egg"
  | "hatch"
  | "sprout"
  | "builder"
  | "builderWorking"
  | "evolved"
  | "overclocked"
  | "sleep"
  | "sleepy"
  | "tired"
  | "mystery";

export interface LcdSprite {
  name: string;
  gif: string;
  sheet: string;
  metadata: string;
  frameWidth: number;
  frameHeight: number;
  frames: number;
  fps: number;
  loop: boolean;
  selectedFrames: number[];
  note?: string;
}

const BASE = "/lcd-sprites";

// Metadata mirrored from each <state>.json file. Kept in code so we don't pay
// a fetch round-trip just to know the sheet shape.
export const LCD_SPRITES: Record<LcdState, LcdSprite> = {
  idle: {
    name: "shipgotchi-idle",
    gif: `${BASE}/shipgotchi-idle.gif`,
    sheet: `${BASE}/shipgotchi-idle.png`,
    metadata: `${BASE}/shipgotchi-idle.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 7,
    loop: true,
    selectedFrames: [1, 1, 2, 2, 1, 3, 3, 1],
  },
  egg: {
    name: "shipgotchi-egg",
    gif: `${BASE}/shipgotchi-egg.gif`,
    sheet: `${BASE}/shipgotchi-egg.png`,
    metadata: `${BASE}/shipgotchi-egg.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  hatch: {
    name: "shipgotchi-hatch",
    gif: `${BASE}/shipgotchi-hatch.gif`,
    sheet: `${BASE}/shipgotchi-hatch.png`,
    metadata: `${BASE}/shipgotchi-hatch.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 10,
    fps: 7,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  sprout: {
    name: "shipgotchi-sprout",
    gif: `${BASE}/shipgotchi-sprout.gif`,
    sheet: `${BASE}/shipgotchi-sprout.png`,
    metadata: `${BASE}/shipgotchi-sprout.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  // Builder == BuilderWorking: the laptop/project-building state. Intentional.
  builder: {
    name: "shipgotchi-builder",
    gif: `${BASE}/shipgotchi-builder.gif`,
    sheet: `${BASE}/shipgotchi-builder.png`,
    metadata: `${BASE}/shipgotchi-builder.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
    note: "Builder is the laptop/project-building state.",
  },
  builderWorking: {
    name: "shipgotchi-builder-working",
    gif: `${BASE}/shipgotchi-builder-working.gif`,
    sheet: `${BASE}/shipgotchi-builder-working.png`,
    metadata: `${BASE}/shipgotchi-builder-working.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
    note: "Alias for the same laptop/project-building Builder state.",
  },
  evolved: {
    name: "shipgotchi-evolved",
    gif: `${BASE}/shipgotchi-evolved.gif`,
    sheet: `${BASE}/shipgotchi-evolved.png`,
    metadata: `${BASE}/shipgotchi-evolved.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  overclocked: {
    name: "shipgotchi-overclocked",
    gif: `${BASE}/shipgotchi-overclocked.gif`,
    sheet: `${BASE}/shipgotchi-overclocked.png`,
    metadata: `${BASE}/shipgotchi-overclocked.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  sleep: {
    name: "shipgotchi-sleep",
    gif: `${BASE}/shipgotchi-sleep.gif`,
    sheet: `${BASE}/shipgotchi-sleep.png`,
    metadata: `${BASE}/shipgotchi-sleep.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  sleepy: {
    name: "shipgotchi-sleepy",
    gif: `${BASE}/shipgotchi-sleepy.gif`,
    sheet: `${BASE}/shipgotchi-sleepy.png`,
    metadata: `${BASE}/shipgotchi-sleepy.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 6,
    fps: 5,
    loop: true,
    selectedFrames: [1, 3, 3, 3, 3, 1],
  },
  tired: {
    name: "shipgotchi-tired",
    gif: `${BASE}/shipgotchi-tired.gif`,
    sheet: `${BASE}/shipgotchi-tired.png`,
    metadata: `${BASE}/shipgotchi-tired.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 6,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  mystery: {
    name: "shipgotchi-mystery",
    gif: `${BASE}/shipgotchi-mystery.gif`,
    sheet: `${BASE}/shipgotchi-mystery.png`,
    metadata: `${BASE}/shipgotchi-mystery.json`,
    frameWidth: 256,
    frameHeight: 256,
    frames: 8,
    fps: 8,
    loop: true,
    selectedFrames: [1, 2, 3, 4, 5, 6, 7, 8],
  },
};

// Map our existing 7 SpriteVariants onto the 12 LCD states. We deliberately
// promote `builder` to the laptop/project-building form per the asset spec.
export function variantToLcdState(variant: SpriteVariant): LcdState {
  switch (variant) {
    case "egg":
      return "egg";
    case "sprout":
      return "sprout";
    case "builder":
      return "builder";
    case "evolved":
      return "evolved";
    case "overclocked":
      return "overclocked";
    case "sleepy":
      return "sleepy";
    case "mystery":
      return "mystery";
  }
}

// Display order for the dev preview grid.
export const LCD_STATE_ORDER: LcdState[] = [
  "idle",
  "egg",
  "hatch",
  "sprout",
  "builder",
  "builderWorking",
  "evolved",
  "overclocked",
  "sleep",
  "sleepy",
  "tired",
  "mystery",
];
