import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ShipGotchi — Meet the creature your commits created";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFredoka(weight: 600 | 700): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Fredoka:wght@${weight}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:\/\/[^)]+\.(?:ttf|woff2?))\) format/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const [reg, bold] = await Promise.all([loadFredoka(600), loadFredoka(700)]);

  const fonts = [
    ...(reg ? [{ name: "Fredoka", data: reg, style: "normal" as const, weight: 600 as const }] : []),
    ...(bold ? [{ name: "Fredoka", data: bold, style: "normal" as const, weight: 700 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background:
            "linear-gradient(135deg, #FFE6B5 0%, #FFF7E6 35%, #DDFBF3 70%, #FFD8E6 100%)",
          fontFamily: "Fredoka, system-ui, sans-serif",
        }}
      >
        {/* Left: mascot */}
        <div
          style={{
            width: 520,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="520" height="520" viewBox="0 0 240 260">
            <defs>
              <radialGradient id="body" cx="38%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#FFD27A" />
                <stop offset="55%" stopColor="#FF8A4C" />
                <stop offset="100%" stopColor="#F24E2C" />
              </radialGradient>
              <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="ground" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#241c30" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#241c30" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="120" cy="232" rx="78" ry="14" fill="url(#ground)" />
            {/* feet */}
            <ellipse cx="96" cy="218" rx="18" ry="12" fill="#F24E2C" />
            <ellipse cx="144" cy="218" rx="18" ry="12" fill="#F24E2C" />
            {/* body */}
            <path
              d="M120 66 C165 66 188 108 188 150 C188 196 158 220 120 220 C82 220 52 196 52 150 C52 108 75 66 120 66 Z"
              fill="url(#body)"
              stroke="#F24E2C"
              strokeWidth="3"
            />
            {/* gloss */}
            <path
              d="M94 84 C78 96 70 118 74 138 C94 130 114 122 130 106 C122 92 110 84 94 84 Z"
              fill="url(#gloss)"
              opacity="0.7"
            />
            {/* arms */}
            <ellipse cx="60" cy="158" rx="13" ry="17" fill="#FF8A4C" stroke="#F24E2C" strokeWidth="2.2" />
            <ellipse cx="180" cy="158" rx="13" ry="17" fill="#FF8A4C" stroke="#F24E2C" strokeWidth="2.2" />
            {/* antenna */}
            <path
              d="M120 66 C120 50 110 46 106 38 M120 66 C120 50 130 46 134 38"
              fill="none"
              stroke="#F24E2C"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* face */}
            <ellipse cx="74" cy="138" rx="13" ry="10" fill="#FF8FB1" opacity="0.65" />
            <ellipse cx="166" cy="138" rx="13" ry="10" fill="#FF8FB1" opacity="0.65" />
            <ellipse cx="98" cy="142" rx="15" ry="17" fill="#241c30" />
            <ellipse cx="142" cy="142" rx="15" ry="17" fill="#241c30" />
            <circle cx="102" cy="137" r="5" fill="#fff" />
            <circle cx="146" cy="137" r="5" fill="#fff" />
            <circle cx="94" cy="147" r="2.6" fill="#fff" opacity="0.8" />
            <circle cx="138" cy="147" r="2.6" fill="#fff" opacity="0.8" />
            <path
              d="M104 172 q16 18 32 0 q-16 8 -32 0 Z"
              fill="#241c30"
            />
            {/* star visor accent */}
            <path d="M120 84 l3 6 6 0 -5 4 2 6 -6 -4 -6 4 2 -6 -5 -4 6 0 z" fill="#FFC23D" />
          </svg>
        </div>

        {/* Right: text stack */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 36,
            color: "#241C30",
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "rgba(123, 92, 255, 0.14)",
              color: "#7B5CFF",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            A tamagotchi for builders
          </div>

          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 0.95,
              marginTop: 26,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Meet the creature</span>
            <span
              style={{
                background:
                  "linear-gradient(100deg,#FF6A45,#7B5CFF 55%,#1FCFB0)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              your commits
            </span>
            <span>created.</span>
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              fontWeight: 600,
              color: "#5B5168",
              display: "flex",
            }}
          >
            Paste any public GitHub username. No login.
          </div>

          <div
            style={{
              marginTop: 38,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#241C30",
                color: "#FFFDF8",
                padding: "12px 22px",
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 0.5,
                display: "flex",
              }}
            >
              shipgotchi.vercel.app
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#5B5168",
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              · DVC 24h build sprint
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
