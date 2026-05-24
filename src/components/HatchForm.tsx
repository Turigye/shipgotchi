"use client";

import { useState } from "react";
import { SAMPLE_CHIPS } from "@/lib/samples";

export function HatchForm({
  onHatch,
  pending,
  compact = false,
}: {
  onHatch: (username: string) => void;
  pending: boolean;
  compact?: boolean;
}) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || pending) return;
    onHatch(value.trim());
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-base text-ink-soft">
            @
          </span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="github username"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="GitHub username"
            className="card-toy w-full rounded-full py-3.5 pl-9 pr-4 font-body text-lg text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={pending || !value.trim()}
          className="group relative rounded-full bg-coral px-7 py-3.5 font-display text-lg font-600 text-white shadow-[0_12px_24px_-10px_rgba(242,78,44,0.9)] transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
        >
          {pending ? "Hatching…" : compact ? "Add pet" : "Hatch it"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
          try
        </span>
        {SAMPLE_CHIPS.map((c) => (
          <button
            key={c.username}
            type="button"
            disabled={pending}
            onClick={() => onHatch(c.username)}
            className="rounded-full border border-ink/12 bg-cream/70 px-3 py-1 font-mono text-xs text-ink transition-colors hover:border-coral hover:text-coral disabled:opacity-50"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
