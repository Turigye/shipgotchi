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

await fs.mkdir(outDir, { recursive: true });

const markdown = await fs.readFile(path.join(docsDir, "07-prompt-runbook.md"), "utf8");
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>ShipGotchi Prompt Runbook</title>
  <style>
    @page { margin: 0.62in; }
    :root {
      color: #172033;
      background: #fffaf2;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.48;
    }
    body { margin: 0; background: #fffaf2; }
    .cover {
      min-height: 8.2in;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 28px;
      padding: 56px;
      background:
        radial-gradient(circle at 16% 20%, rgba(255, 214, 102, 0.55), transparent 32%),
        radial-gradient(circle at 88% 14%, rgba(83, 218, 201, 0.42), transparent 34%),
        linear-gradient(135deg, #fff7d6 0%, #fff 50%, #e7fbff 100%);
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
      font-size: 56px;
      line-height: 0.95;
      letter-spacing: 0;
    }
    .cover p {
      max-width: 700px;
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
      background: rgba(255, 255, 255, 0.72);
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 700;
    }
    .content { page-break-before: always; }
    h1 {
      font-size: 34px;
      margin: 0 0 18px;
      letter-spacing: 0;
      color: #101827;
    }
    h2 {
      page-break-before: auto;
      margin-top: 30px;
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
    p, li { font-size: 12px; }
    ul, ol { padding-left: 20px; }
    pre {
      white-space: pre-wrap;
      word-break: break-word;
      background: #101827;
      color: #f8fbff;
      border-radius: 12px;
      padding: 14px;
      font-size: 10.5px;
      line-height: 1.45;
      page-break-inside: avoid;
    }
    code {
      font-family: "Cascadia Code", Consolas, monospace;
    }
    p code, li code {
      background: #f0f4ff;
      color: #172033;
      border-radius: 5px;
      padding: 1px 4px;
      font-size: 11px;
    }
    hr {
      border: 0;
      border-top: 1px solid rgba(23, 32, 51, 0.12);
      margin: 28px 0;
    }
  </style>
</head>
<body>
  <section class="cover">
    <div class="eyebrow">ShipGotchi Build Operating Manual</div>
    <h1>Prompt Runbook</h1>
    <p>A paste-by-paste sequence for taking ShipGotchi from empty workspace to production submission, including specialist prompts for implementation, sprite generation, QA, deployment, and judging.</p>
    <div class="badge-row">
      <div class="badge">14 Prompts</div>
      <div class="badge">Parallel Agents</div>
      <div class="badge">Image Prompts</div>
      <div class="badge">QA + Deploy</div>
      <div class="badge">Submission Ready</div>
    </div>
  </section>
  <section class="content">
    ${marked.parse(markdown)}
  </section>
</body>
</html>`;

const htmlPath = path.join(outDir, "shipgotchi-prompt-runbook.html");
const pdfPath = path.join(outDir, "shipgotchi-prompt-runbook.pdf");

await fs.writeFile(htmlPath, html, "utf8");

renderPdf(htmlPath, pdfPath);

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

console.log(`Wrote ${htmlPath}`);
console.log(`Wrote ${pdfPath}`);
