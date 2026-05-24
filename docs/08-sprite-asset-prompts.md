# ShipGotchi Sprite Asset Prompts (Premium Render Track)

Purpose: generate best-in-class mascot art that can be swapped in to replace (or sit on top of) the built-in SVG sprite. The SVG already ships a working, on-brand creature; these renders are the polish upgrade. **Do not let asset generation block the build** — drop PNGs in when they're ready.

## The non-negotiable: ONE creature, seven states

The single biggest failure mode is seven renders that look like seven different animals. Everything below is engineered to prevent that. Generate the **reference sheet first**, lock the character, then derive every state from it.

---

## Character Bible (paste this verbatim into every prompt)

```text
CHARACTER: "ShipGotchi" — a small, round designer-toy creature; a loyal builder companion hatched from code.
BODY: chibi proportions, oversized head on a soft egg/bean-shaped body (~1.2:1 tall), short stubby arms, two small rounded feet. Smooth premium vinyl finish with a soft satin sheen and gentle subsurface glow.
FACE: two oversized glossy black eyes with twin white catchlights, small rosy round cheeks, a tiny simple mouth. Warm, friendly, a little mischievous.
SIGNATURE: a two-prong antenna shaped like an angle-bracket pair "< >" curling up from the top of the head. This antenna MUST appear on every form (except the Egg).
DEFAULT COLORWAY: warm coral-orange body with a soft cream belly highlight (state colorways override this where noted).
STYLE: high-end collectible designer toy (Pop Mart / Sonny Angel energy), soft 3D render, studio softbox lighting, gentle rim light, subtle ambient occlusion, clean rounded silhouette, tiny contact shadow.
MOOD OF BRAND: cute, premium, tactile, screenshot-worthy. Bright and friendly.
```

## Negative / avoid (append to every prompt)

```text
AVOID: dark cyberpunk, neon grunge, horror, sharp teeth, realistic animal, human face, text, watermark, logos, busy background, clutter, harsh shadows, low-res, flat clip-art, anime line-art, multiple characters, extra limbs, melted/deformed shapes.
```

## Output spec (every asset)

- 1:1 square, **transparent background** (or solid #FFF6EC then remove), centered, with ~12% padding on all sides so scale is consistent across variants.
- Same camera: straight-on, slight 5° high angle, eye-level-ish, identical zoom/scale between variants.
- 1024×1024 minimum (2048 preferred for crisp retina). Export PNG.
- Keep the contact shadow inside the frame; no cropping of antenna or feet.

---

## Step 1 — Reference sheet (generate this FIRST)

```text
[CHARACTER BIBLE]
Create a clean character reference of this single creature in its default coral-orange colorway: front view, neutral happy expression, standing, full body, centered, soft studio lighting on a plain #FFF6EC background, premium soft-3D designer-toy render. Establish the canonical look. [OUTPUT SPEC] [AVOID]
```

Pick the best result. That image is your **anchor**. Use it as the reference for every variant below.

## Step 2 — Lock consistency by model

- **Midjourney:** generate the anchor, then for each variant use `--cref <anchor_url> --cw 100` (character reference, full weight) and a fixed `--seed`. Add `--sref <anchor_url>` to also lock the rendering style.
- **Nano Banana / Gemini 2.5 Flash Image:** upload the anchor and prompt "Using the SAME character shown, render it as … keep identical body shape, colors, eyes, and antenna." Iterate by re-feeding the anchor each time.
- **GPT Image (ChatGPT):** upload the anchor and ask for an edit/restyle into each state, repeating "same character, same proportions and colors."
- **Higgsfield / others:** use their image-reference / character-lock feature with the anchor; otherwise paste the full Character Bible and a strict "same creature" instruction every time.

Always render the **Builder** form second (it's the most "default") to confirm the anchor reproduces before doing the rest.

---

## Step 3 — Per-variant prompts

Each variant = `[CHARACTER BIBLE] + the block below + [OUTPUT SPEC] + [AVOID]` and the model's reference-lock from Step 2.

### Egg (`/public/sprites/egg.png`)
```text
STATE — EGG: the creature is still inside its egg, not yet hatched. A smooth coral-orange speckled egg with a soft glossy sheen and a small zig-zag crack across the middle. Through the crack, two glossy curious eyes peek out with tiny catchlights. A few faint glowing code-symbol freckles on the shell. No antenna yet, no limbs. Warm, full of anticipation.
```

### Sprout (`/public/sprites/sprout.png`)
```text
STATE — SPROUT: a tiny, newly hatched version of the creature — smaller, rounder, a little wobbly. Bright wide eyes, eager expression. The "< >" antenna is small and freshly sprouted, with one tiny green leaf curling off it like a seedling. Holding a single small glowing commit-spark in its stubby hands. Soft mint-and-coral colorway. Adorable and hopeful.
```

### Builder (`/public/sprites/builder.png`)
```text
STATE — BUILDER: the confident everyday form. Standing proud, content half-smile, bright eyes. Wearing tiny soft builder goggles pushed up on the forehead and a small utility scarf. The "< >" antenna stands upright. Calm teal-mint body with cream belly. The dependable companion at its healthy baseline.
```

### Evolved (`/public/sprites/evolved.png`)
```text
STATE — EVOLVED: a more heroic, polished form. Slightly taller and sleeker, larger expressive eyes, a small glowing achievement badge on its chest. A few tiny code-sparks float around it. Subtle iridescent sheen on the vinyl. Confident, accomplished, gentle RPG "leveled-up" energy. Grape-violet and warm-gold accents.
```

### Overclocked (`/public/sprites/overclocked.png`)
```text
STATE — OVERCLOCKED: powered-up and joyful, mid-celebration. Big open grin, sparkling eyes, energetic pose (one arm raised). A bright warm aura/halo glows behind it; harmless commit-sparks and tiny lightning glints pop around it. Vivid coral-to-sunshine gradient body. Celebratory, NOT aggressive. Pure shipping euphoria.
```

### Sleepy (`/public/sprites/sleepy.png`)
```text
STATE — SLEEPY: cozy and napping, sweet not sad. Eyes closed in soft happy curves, tiny content smile, wrapped in a small blanket or wearing a little nightcap. A dim commit-spark rests beside it like a nightlight. Soft muted lavender-indigo colorway. Floating "z z z" optional. Lovable, peaceful, "napping for strategic reasons."
```

### Mystery (`/public/sprites/mystery.png`)
```text
STATE — MYSTERY (fallback): the creature half-hidden inside a soft translucent iridescent bubble, only its curious glossy eyes clearly visible. A gentle question-mark-shaped glow hovers above. Friendly and intriguing, never broken or error-like. Cool violet bubble over the coral body. The "we couldn't read this one" state, made charming.
```

---

## Optional — language outfit overlays

Best baked into a couple of hero variants rather than as separate layers. If you want standalone transparent accessories (to composite over any body), render each on its own with: "single accessory only, transparent background, no character, product shot, soft-3D toy style."

- TypeScript / JavaScript → **Star Visor** (sporty visor band with a small gold star)
- Python → **Wizard Cap** (soft pointed cap with a star)
- Rust → **Bronze Armor** (small bronze shoulder pauldrons)
- Go → **Runner Goggles** (mint racing goggles)
- CSS / HTML → **Paint Scarf** (sky-blue flowing scarf)
- Java → **Coffee Charm** (tiny coffee-cup charm)

---

## Step 4 — Post-process + integrate

1. Remove background to clean alpha (if not already transparent); trim, then re-center each on an identical square canvas so all 7 share scale + baseline.
2. Export to `public/sprites/{egg,sprout,builder,evolved,overclocked,sleepy,mystery}.png`.
3. Wiring: extend `ShipGotchiSprite` with an optional image layer — when a PNG exists for the variant, render `<img src="/sprites/{variant}.png">` (with the existing CSS bob/animation on the wrapper) and fall back to the SVG creature if the image 404s or hasn't been added. This keeps the demo bulletproof: no asset = still a working pet.
4. Re-check the Builder DNA card and Compare cards at small sizes — the PNGs must read clearly at 96px.
