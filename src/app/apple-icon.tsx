import { ImageResponse } from "next/og";

// iOS / Android home-screen icon. 180x180 with the mascot face.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg,#FFD27A 0%,#FF8A4C 50%,#F24E2C 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Mascot face — circle body with two big eyes + cheeks */}
        <svg width="170" height="170" viewBox="0 0 170 170">
          <ellipse cx="85" cy="98" rx="60" ry="62" fill="#FFFDF8" stroke="#241c30" strokeWidth="4" />
          <ellipse cx="60" cy="105" rx="11" ry="13" fill="#241c30" />
          <ellipse cx="110" cy="105" rx="11" ry="13" fill="#241c30" />
          <circle cx="64" cy="100" r="3.6" fill="#fff" />
          <circle cx="114" cy="100" r="3.6" fill="#fff" />
          <ellipse cx="40" cy="125" rx="8" ry="5" fill="#FF8FB1" opacity="0.8" />
          <ellipse cx="130" cy="125" rx="8" ry="5" fill="#FF8FB1" opacity="0.8" />
          <path d="M75 130 q10 9 20 0" fill="none" stroke="#241c30" strokeWidth="3.5" strokeLinecap="round" />
          {/* antenna */}
          <path d="M85 38 C85 24 76 22 73 14 M85 38 C85 24 94 22 97 14" fill="none" stroke="#241c30" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
