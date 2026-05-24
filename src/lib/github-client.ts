// Client-side service. The browser ONLY ever talks to our /api/github proxy,
// never api.github.com directly (keeps the token server-side and the rate
// limit healthy). On hard failure we fall back to bundled sample data.

import { createPetProfile, mysteryPet } from "./scoring";
import { fallbackResult, OFFLINE_SAMPLES, sampleResult } from "./samples";
import type { GithubFetchResult, PetProfile } from "./types";

export async function fetchGithub(username: string): Promise<GithubFetchResult> {
  const clean = username.trim();
  if (!clean) {
    return { state: "notFound", message: "Type a GitHub username to hatch a pet." };
  }

  // Hard offline samples (e.g. the "demo nap" Sleepy showcase) bypass the
  // proxy entirely so the demo path is always instant and never rate-limited.
  if (OFFLINE_SAMPLES.has(clean.toLowerCase())) {
    const sample = sampleResult(clean);
    if (sample) return sample;
  }

  // Network-failure fallback target (also covers the demo chips instantly).
  const sample = sampleResult(clean);

  try {
    const res = await fetch(`/api/github?username=${encodeURIComponent(clean)}`);
    const data = (await res.json()) as GithubFetchResult & { message?: string };
    if (res.ok && data.state === "success") return data;
    if (data.state) return data;
    return { state: "networkError", message: "GitHub hiccuped. Try a sample hatch." };
  } catch {
    // Network blew up entirely — use a sample so the demo never dies.
    if (sample) return sample;
    return {
      state: "networkError",
      message: "Could not reach GitHub. Try a sample hatch while we reconnect.",
    };
  }
}

// Resolve a username all the way to a PetProfile, with graceful fallbacks.
export async function hatchPet(
  username: string,
): Promise<{ pet: PetProfile; usedFallback: boolean; note?: string }> {
  const result = await fetchGithub(username);

  if (result.state === "success") {
    return {
      pet: createPetProfile(result.profile, result.activity),
      usedFallback: false,
    };
  }

  if (result.state === "notFound") {
    return { pet: mysteryPet(username), usedFallback: false, note: result.message };
  }

  // rateLimited / networkError -> bundled sample so the reveal still happens.
  const sample = sampleResult(username) ?? fallbackResult();
  if (sample.state === "success") {
    return {
      pet: createPetProfile(sample.profile, sample.activity, { isSample: true }),
      usedFallback: true,
      note: result.message,
    };
  }

  return { pet: mysteryPet(username), usedFallback: true, note: result.message };
}
