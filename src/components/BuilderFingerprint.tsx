"use client";

// =============================================================================
// Builder Fingerprint — recent repos touched + inferred stack chips.
// A "what they're shipping lately" snapshot. Pulls from pet.stats.recentRepos
// and pet.topLanguage (+ scoring's languageCount). Falls back gracefully when
// the breakdown isn't available (sample fixtures, mystery, fresh accounts).
// =============================================================================

import type { PetProfile } from "@/lib/types";

const LANG_TINTS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  Java: "#B07219",
  C: "#555",
  "C++": "#F34B7D",
  Shell: "#89E051",
  HTML: "#E34C26",
  CSS: "#563D7C",
};

function chipColor(lang: string) {
  return LANG_TINTS[lang] ?? "#7B5CFF";
}

export function BuilderFingerprint({ pet }: { pet: PetProfile }) {
  // Derive a stack list from `topLanguage` + repos. We don't have the full
  // language array on PetProfile, but topLanguage + languageCount lets us
  // render at least one strong chip; sample fixtures provide more via repos.
  const langs = [pet.topLanguage].filter((l) => l && l !== "Polyglot");
  const repos = pet.stats.recentRepos;

  if (langs.length === 0 && repos.length === 0) {
    return null;
  }

  return (
    <div className="card-toy w-full rounded-3xl p-5">
      <div className="mb-3">
        <h3 className="font-pixel text-2xl text-ink lcd-glow" style={{ color: "#1FCFB0" }}>
          Builder Fingerprint
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          inferred from recent public activity
        </p>
      </div>

      {langs.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
            Top stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {langs.map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 font-mono text-sm text-ink"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: chipColor(l) }}
                />
                {l}
              </span>
            ))}
            {pet.languageCount > 1 && (
              <span className="rounded-full bg-canvas px-2.5 py-1 font-mono text-sm text-ink-soft">
                +{pet.languageCount - 1} more
              </span>
            )}
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div>
          <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
            Recently touched
          </p>
          <ul className="space-y-1">
            {repos.slice(0, 5).map((r) => (
              <li key={r} className="truncate font-mono text-sm text-ink">
                <a
                  href={`https://github.com/${r}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-coral"
                >
                  {r}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
