"use client";

// =============================================================================
// CommitSparkline v2 — LCD/Tamagotchi-style 7-day commit chart.
//
// Style notes:
// - Renders as a dark LCD screen (deep green field, lighter green bars).
// - Each bar is a stack of discrete pixel blocks, not a smooth rectangle —
//   you can count the commits like Tamagotchi pet hunger pips.
// - Today's bar uses a brighter LCD-green and gets a tiny pixel "gotchi
//   head" floating above it so the eye lands on the current day.
// - Hard edges, no gradients, no rounded corners. image-rendering: pixelated
//   is applied so the whole thing reads as an old screen.
// =============================================================================

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// Visual ceiling — bars cap at this many pixel cells so the chart doesn't
// blow out vertically. A "17 commit" day still reads as 8 chunky blocks.
const MAX_CELLS = 8;
const CELL_PX = 12; // hard-pixel cell size — thicker bars for readability
const CELL_GAP = 3;

// Tiny 5×5 gotchi face that perches above today's column.
const HEAD: string[] = [
  ".....",
  ".OOO.",
  "OEoEO", // eyes with a single highlight (matches our sprite eye style)
  "OOmOO",
  ".OOO.",
];

function CellStack({
  count,
  highlight,
}: {
  count: number;
  highlight: boolean;
}) {
  // Quantize raw commits into 1..MAX_CELLS blocks so each block represents
  // a meaningful unit ("about this many commits") without overflowing.
  const blocks = Math.max(0, Math.min(MAX_CELLS, count));
  // Render top-down: fill from the bottom of the column.
  return (
    <div
      className="flex flex-col-reverse items-center"
      style={{ gap: CELL_GAP }}
    >
      {Array.from({ length: MAX_CELLS }, (_, i) => {
        const lit = i < blocks;
        const bg = lit
          ? highlight
            ? "#2EE6BF"
            : "#1B7A66"
          : "rgba(255,255,255,0.06)";
        const shadow = lit && highlight ? "0 0 6px rgba(46,230,191,0.65)" : "none";
        return (
          <span
            key={i}
            style={{
              width: CELL_PX,
              height: CELL_PX,
              background: bg,
              boxShadow: shadow,
              imageRendering: "pixelated",
            }}
          />
        );
      })}
    </div>
  );
}

function PixelHead() {
  const PX = 3;
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(5, ${PX}px)`,
        gridTemplateRows: `repeat(5, ${PX}px)`,
        gap: 0,
      }}
      aria-hidden
    >
      {HEAD.flatMap((row, y) =>
        row.split("").map((ch, x) => {
          let bg = "transparent";
          if (ch === "O") bg = "#2EE6BF";
          else if (ch === "E") bg = "#0A1F1A";
          else if (ch === "e") bg = "#E8FFF8";
          else if (ch === "m") bg = "#0A1F1A";
          return (
            <span
              key={`${y}-${x}`}
              style={{ width: PX, height: PX, background: bg }}
            />
          );
        }),
      )}
    </div>
  );
}

export function CommitSparkline({ values }: { values: number[] }) {
  const todayIdx = values.length - 1;
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div
      className="relative overflow-hidden rounded-md border-2 border-[#1B7A66] p-2.5"
      style={{
        background:
          "linear-gradient(180deg,#0E2A24 0%,#0A1F1A 100%)",
        boxShadow: "inset 0 0 0 2px rgba(46,230,191,0.08)",
        imageRendering: "pixelated",
      }}
    >
      {/* faint scanlines for LCD feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent 0,transparent 2px,rgba(0,0,0,0.35) 2px,rgba(0,0,0,0.35) 3px)",
        }}
      />

      {/* bars row */}
      <div className="relative flex items-end justify-between gap-1.5 px-1 pt-3">
        {values.map((v, i) => {
          const highlight = i === todayIdx;
          return (
            <div key={i} className="relative flex flex-col items-center">
              {/* tiny pixel gotchi head above today's column */}
              {highlight && (
                <div className="mb-1">
                  <PixelHead />
                </div>
              )}
              <CellStack count={v} highlight={highlight} />
              <span
                className="mt-1.5 font-mono text-xs font-700 uppercase"
                style={{
                  color: highlight ? "#2EE6BF" : "rgba(232,255,248,0.6)",
                  textShadow: highlight ? "0 0 6px rgba(46,230,191,0.55)" : "none",
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* total readout in the corner — like a Tamagotchi LCD readout */}
      <div className="pointer-events-none absolute right-2 top-1.5 font-mono text-xs font-700 tracking-wider" style={{ color: "rgba(46,230,191,0.9)" }}>
        Σ{total}
      </div>
    </div>
  );
}
