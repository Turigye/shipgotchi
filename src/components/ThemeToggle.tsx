"use client";

// =============================================================================
// ThemeToggle — sun/moon button that flips a `.dark` class on <html>.
// Pairs with the no-flash inline script in layout.tsx so the correct theme
// is applied before first paint (no flicker on reload).
// =============================================================================

import { useEffect, useState } from "react";

const STORAGE_KEY = "shipgotchi-theme";

type Mode = "light" | "dark";

function readMode(): Mode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyMode(mode: Mode) {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // private mode / quota — silent fallback, mode still applies for this session.
  }
}

export function ThemeToggle() {
  // Start as light — useEffect immediately syncs to whatever the no-flash
  // script already set on <html>, so there's no visual mismatch.
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    setMode(readMode());
  }, []);

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        const next: Mode = isDark ? "light" : "dark";
        applyMode(next);
        setMode(next);
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 place-items-center rounded-full border border-ink/12 bg-cream/70 text-ink transition-colors hover:bg-cream"
    >
      {isDark ? (
        // Sun
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.6" y1="4.6" x2="6" y2="6" />
            <line x1="18" y1="18" x2="19.4" y2="19.4" />
            <line x1="4.6" y1="19.4" x2="6" y2="18" />
            <line x1="18" y1="6" x2="19.4" y2="4.6" />
          </g>
        </svg>
      ) : (
        // Moon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
