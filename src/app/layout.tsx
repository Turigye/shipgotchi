import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, JetBrains_Mono, VT323 } from "next/font/google";
import "./globals.css";

// Pixel display for hero/section headings — sets the LCD/Tamagotchi tone.
const vt323 = VT323({
  variable: "--ff-pixel",
  subsets: ["latin"],
  weight: ["400"],
});

// Display: rounded, confident, toy-like. Kept for sub-display / chunky labels.
const fredoka = Fredoka({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--ff-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shipgotchi.vercel.app"),
  title: "ShipGotchi — Meet the creature your commits created",
  description:
    "Paste any public GitHub username and hatch a premium builder pet whose mood, evolution, and Builder DNA grow from how you ship. No login.",
  applicationName: "ShipGotchi",
  authors: [{ name: "Dollar Vibe Club 24h Build Sprint" }],
  keywords: ["github", "tamagotchi", "builder", "pet", "developer", "toy"],
  openGraph: {
    title: "ShipGotchi",
    description: "Paste your GitHub. Meet the creature your commits created.",
    type: "website",
    url: "/",
    siteName: "ShipGotchi",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipGotchi",
    description: "Paste your GitHub. Meet the creature your commits created.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF6EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vt323.variable} ${fredoka.variable} ${nunito.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
