# ShipGotchi Experience And Visual Direction

## Creative Direction

Base style: **cute premium toy**.

Supporting flavors:

- Light RPG evolution mechanics
- Soft builder-lab UI details
- Share-card polish

Avoid:

- Dark cyberpunk dominance
- Overly niche anime styling
- Dense dashboards
- Generic GitHub stats pages

## Design North Star

The user should feel like they opened a premium collectible toy, not a developer analytics tool.

## Visual Keywords

- Soft
- Tactile
- Collectible
- Rounded but not childish
- Bright
- Crisp
- Expressive
- Stream-friendly
- Screenshot-worthy

## Mascot Direction

Use one mascot species with several forms.

This keeps execution manageable while preserving delight. Multiple species are a post-MVP expansion.

### Mascot Personality

The mascot should feel:

- Loyal
- Slightly mischievous
- Proud when the user ships
- Sleepy when neglected
- Curious when the user explores many languages

### Sprite Strategy (solo-safe: one base, layered states)

**Primary approach — layered, not 7 separate renders.** Build ONE base mascot, then drive its state with composable layers: body tint, eye/mouth expression, a small accessory, and a pose/animation tweak. This guarantees the variants read as *the same creature* (the hardest part of the "premium toy" promise) and avoids spending hours fighting an image model for character consistency.

- Body: a single SVG/CSS or sprite base.
- State layer: color + expression per evolution/mood.
- Accessory layer: optional outfit overlay by language.
- Motion layer: idle bob, hatch pop, sleepy z's — CSS or Framer Motion.

AI-generated full renders (runbook Prompt 6) are a **stretch goal** to swap in per variant if there's time after the five MVP features are stable — never a dependency for a working demo.

### Sprite Variants (state targets for the layered system)

1. Egg: before enough data or first hatch
2. Sprout: early builder
3. Builder: stable activity
4. Overclocked: high activity
5. Sleepy: inactive
6. Mystery: invalid or hidden data

### Outfit Overlay Ideas

- JavaScript/TypeScript: tiny star visor
- Python: soft wizard cap
- Rust: bronze armor accent
- Go: runner goggles
- CSS/HTML: paint scarf
- Java: coffee charm

Outfits should be decorative, not required for MVP correctness.

## Page Structure

### First Screen

Purpose: get to the hatch moment fast.

Elements:

- Brand name: ShipGotchi
- Literal promise: "Paste your GitHub. Meet the creature your commits created."
- Username input
- Hatch button
- Sample username chips
- Pet egg preview or tiny idle mascot

No long explanatory text.

### Loading Ritual

Purpose: make waiting feel intentional.

Possible steps:

- Reading public commits
- Measuring shipping energy
- Sorting language snacks
- Polishing tiny goggles
- Hatching companion

Keep loading under a few seconds when possible.

### Result Screen

Purpose: show the payoff immediately.

Primary visual:

- Large pet sprite
- Mood bubble
- Level/evolution badge

Secondary visual:

- Builder DNA card
- Activity meters
- Language trait
- Personality line

Actions:

- Compare another builder
- Generate/share card
- Try sample
- Desk Mode, if time allows

## Copy Style

Voice:

- Warm
- Playful
- Premium
- Builder-native
- Not cringe

Examples:

- "Your ShipGotchi woke up caffeinated."
- "Recent commits detected. Tiny goggles equipped."
- "This pet has seen things in production."
- "Low activity, high potential. It is napping for strategic reasons."
- "Your top language shaped its outfit."

## Accessibility And Usability

- High contrast text.
- Large touch targets.
- Keyboard-friendly username input.
- Mobile-first layout.
- No required hover interactions.
- Clear error states.
- Result should still make sense without animation.

