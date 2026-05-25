# ShipGotchi LCD Sprites: Final V2 Handoff

This folder contains the current final LCD-style ShipGotchi animation handoff.
The accepted path is the V2 workflow that produced the good character-only LCD
idle: dedicated anchor first, dedicated animation sheet second, then extraction,
cleanup, frame selection, GIF/sheet export, and visual QA.

Do not fake-complete missing states by recoloring, overlaying, or deriving one state from another. The assets that belong here are only those that went through the full workflow:

1. Create/choose a dedicated visual anchor for the specific state.
2. Generate a matching animation sheet for that state.
3. Clean/key/extract the frames.
4. Select only the good frames.
5. Export GIF, PNG spritesheet, and JSON metadata.
6. Inspect for drift, species changes, bad frames, and scale jumps.

## Current Promoted Assets

- `shipgotchi-idle`
- `shipgotchi-egg`
- `shipgotchi-hatch`
- `shipgotchi-sprout`
- `shipgotchi-builder-working`
- `shipgotchi-evolved`
- `shipgotchi-overclocked`
- `shipgotchi-sleep`
- `shipgotchi-sleepy`
- `shipgotchi-tired`
- `shipgotchi-mystery`

`manifest.json` includes both `builder` and `builderWorking`, and both point to
`shipgotchi-builder-working`. In this ShipGotchi universe, the Builder state is
the pet literally building projects on a tiny laptop.

## QA

Use `qa-final-contact.png` for the current contact sheet. Each promoted state has
matching `.gif`, `.png` spritesheet, and `.json` metadata files.

If more variants are added, repeat the full V2 workflow. Do not shortcut by
editing one state into another.

## Archived Mistake

The rushed derived-state package was moved to:

`C:\Code\challenge-gpt\dist\shipgotchi-animation-handoff\lcd-sprites-rushed-archive-20260524-2341`

Treat that archive as rejected reference only.
