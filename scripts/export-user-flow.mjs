import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const mmdPath = path.resolve('docs/D2-user-flow.mmd');
  const mmdContent = fs.readFileSync(mmdPath, 'utf8');

  const exportDir = path.resolve('export');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    * { box-sizing: border-box; }
    body {
      background-color: #0B0B0F;
      color: #F5F5F7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 60px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      max-width: 900px;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 999px;
      background: rgba(255, 176, 32, 0.15);
      border: 1px solid rgba(255, 176, 32, 0.4);
      color: #FFB020;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .title {
      font-size: 36px;
      font-weight: 700;
      color: #F5F5F7;
      letter-spacing: -0.03em;
      margin: 0 0 10px 0;
    }
    .subtitle {
      font-size: 16px;
      color: #A3A3B2;
      margin: 0;
      line-height: 1.5;
    }
    #diagram {
      width: 100%;
      max-width: 1500px;
      display: flex;
      justify-content: center;
      background: #111117;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 56px 40px;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    }
    svg {
      max-width: 100% !important;
      height: auto !important;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">Deliverable D2 · Interaction Architecture</div>
    <h1 class="title">STILL: End-to-End User Flow</h1>
    <p class="subtitle">Replacing discrete shutter tap with continuous sensor-driven intent & post-hoc selection</p>
  </div>
  <div id="diagram">
    <pre class="mermaid">
${mmdContent}
    </pre>
  </div>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: false,
        curve: 'basis'
      }
    });
  </script>
</body>
</html>`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 3200 },
    deviceScaleFactor: 2,
  });

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForSelector('#diagram svg', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Extract pure SVG
  const svgContent = await page.$eval('#diagram svg', (svg) => svg.outerHTML);
  const svgPath = path.resolve('export/user-flow.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('Saved SVG to:', svgPath);

  // Take high-res screenshot of diagram container
  const pngPath = path.resolve('export/user-flow.png');
  const bodyElement = await page.$('body');
  if (bodyElement) {
    await bodyElement.screenshot({ path: pngPath });
    console.log('Saved PNG to:', pngPath);
  }

  await browser.close();
}

main().catch(err => {
  console.error('Error rendering diagram:', err);
  process.exit(1);
});
