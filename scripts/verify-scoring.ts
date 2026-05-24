// Quick determinism check: run every sample fixture through createPetProfile
// and print the resulting pet states. Run with: npx tsx scripts/verify-scoring.ts
import { createPetProfile } from "../src/lib/scoring";
import { SAMPLE_FIXTURES } from "../src/lib/samples";

const rows = Object.entries(SAMPLE_FIXTURES).map(([name, fx]) => {
  const pet = createPetProfile(fx.profile, fx.activity);
  return {
    user: name,
    energy: pet.energyScore,
    level: pet.level,
    stage: pet.evolutionStage,
    mood: pet.mood,
    sprite: pet.spriteVariant,
    class: pet.builderClass,
    outfit: pet.outfitTrait ?? "-",
  };
});

console.table(rows);

// Determinism: a second pass must equal the first.
const a = JSON.stringify(
  Object.values(SAMPLE_FIXTURES).map((f) => createPetProfile(f.profile, f.activity)),
);
const b = JSON.stringify(
  Object.values(SAMPLE_FIXTURES).map((f) => createPetProfile(f.profile, f.activity)),
);
console.log(a === b ? "OK: scoring is deterministic" : "FAIL: non-deterministic output");
