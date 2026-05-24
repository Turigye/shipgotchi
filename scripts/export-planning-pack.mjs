import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const bundledNodeModules = "C:/Users/Mich/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { marked } = require(path.join(bundledNodeModules, "marked"));

const chromePath =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const root = process.cwd();
const docsDir = path.join(root, "docs");
const outDir = path.join(root, "dist");

const files = [
  "00-shipgotchi-planning-index.md",
  "01-product-brief.md",
  "02-mvp-specification.md",
  "03-experience-visual-direction.md",
  "04-technical-plan.md",
  "05-execution-plan-agent-workstreams.md",
  "06-judging-demo-submission-kit.md",
  "07-prompt-runbook.md",
  "08-sprite-asset-prompts.md",
];

await fs.mkdir(outDir, { recursive: true });

const sections = [];
for (const file of files) {
  const markdown = await fs.readFile(path.join(docsDir, file), "utf8");
  sections.push(`<section class="doc-section">${marked.parse(markdown)}</section>`);
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>ShipGotchi Planning Pack</title>
  <style>
    @page {
      margin: 0.65in;
    }
    :root {
      color: #172033;
      background: #fffaf2;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.48;
    }
    body {
      margin: 0;
      background: #fffaf2;
    }
    .cover {
      min-height: 8.3in;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 28px;
      padding: 56px;
      background:
        radial-gradient(circle at 18% 18%, rgba(255, 214, 102, 0.55), transparent 31%),
        radial-gradient(circle at 88% 12%, rgba(83, 218, 201, 0.45), transparent 33%),
        linear-gradient(135deg, #fff7d6 0%, #fff 48%, #e7fbff 100%);
      border: 2px solid rgba(23, 32, 51, 0.08);
    }
    .eyebrow {
      color: #7857ff;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .cover h1 {
      margin: 18px 0 12px;
      font-size: 58px;
      line-height: 0.95;
      letter-spacing: 0;
    }
    .cover p {
      max-width: 680px;
      font-size: 20px;
      color: #465066;
    }
    .badge-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .badge {
      border: 1px solid rgba(23, 32, 51, 0.1);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.7);
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 700;
    }
    .doc-section {
      page-break-before: always;
      padding: 8px 0;
    }
    h1 {
      font-size: 34px;
      margin: 0 0 18px;
      letter-spacing: 0;
      color: #101827;
    }
    h2 {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid rgba(23, 32, 51, 0.12);
      font-size: 21px;
      color: #172033;
    }
    h3 {
      margin-top: 20px;
      font-size: 16px;
      color: #253047;
    }
    p, li {
      font-size: 12.2px;
    }
    ul, ol {
      padding-left: 20px;
    }
    code {
      background: #f0f4ff;
      border-radius: 5px;
      padding: 1px 4px;
      font-size: 11px;
    }
    blockquote {
      border-left: 4px solid #7857ff;
      padding-left: 14px;
      margin-left: 0;
      color: #465066;
    }
  </style>
</head>
<body>
  <section class="cover">
    <div class="eyebrow">Dollar Vibe Club Build Sprint</div>
    <h1>ShipGotchi Planning Pack</h1>
    <p>Paste your GitHub. Meet the creature your commits created. A focused 24-hour plan for a premium, no-login builder pet webapp designed to win the demo and feel launchable after the sprint.</p>
    <div class="badge-row">
      <div class="badge">Track: Vibe Gotchi</div>
      <div class="badge">MVP: 5 Killer Features</div>
      <div class="badge">No Login</div>
      <div class="badge">Mobile-First</div>
      <div class="badge">Cute Premium Toy</div>
    </div>
  </section>
  ${sections.join("\n")}
</body>
</html>`;

const htmlPath = path.join(outDir, "shipgotchi-planning-pack.html");
const pdfPath = path.join(outDir, "shipgotchi-planning-pack.pdf");

await fs.writeFile(htmlPath, html, "utf8");

renderPdf(htmlPath, pdfPath);

console.log(`Wrote ${htmlPath}`);
console.log(`Wrote ${pdfPath}`);

function renderPdf(htmlFile, outFile) {
  const profileDir = path.join(os.tmpdir(), `shipgotchi-pdf-${Date.now()}`);
  const fileUrl = `file://${htmlFile.replace(/\\/g, "/")}`;
  execFileSync(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--user-data-dir=${profileDir}`,
      "--no-pdf-header-footer",
      `--print-to-pdf=${outFile}`,
      fileUrl,
    ],
    { stdio: "inherit" }
  );
}
