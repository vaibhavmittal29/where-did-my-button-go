import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ensureServer } from './server-helper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.resolve(__dirname, '..');
const EXPORT_SCREENS_DIR = path.join(PROJECT_DIR, 'export/screens');
const EXPORT_DIR = path.join(PROJECT_DIR, 'export');
const DEFAULT_BRAIN = 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92';
const BRAIN_DIR = process.env.BRAIN_DIR || (fs.existsSync(DEFAULT_BRAIN) ? DEFAULT_BRAIN : null);

// Hi-Fi Screens to capture at 1170x2532 (390x844 @ 3x)
const HI_FI_SCREENS = [
  { name: 'screen-01-onboarding', url: 'http://127.0.0.1:5173/?screen=onboarding' },
  { name: 'screen-02-idle', url: 'http://127.0.0.1:5173/?screen=idle' },
  { name: 'screen-03-locking', url: 'http://127.0.0.1:5173/?screen=locking&progress=0.6' },
  { name: 'screen-03-locking-annotated', url: 'http://127.0.0.1:5173/?screen=locking&progress=0.6&annotate=1' },
  { name: 'screen-04-moments', url: 'http://127.0.0.1:5173/?screen=moments&selected=3' },
  { name: 'screen-05-group', url: 'http://127.0.0.1:5173/?screen=group&ready=3' },
];

function safeCopyToBrain(src, dst) {
  if (BRAIN_DIR && fs.existsSync(BRAIN_DIR)) {
    try {
      fs.copyFileSync(src, dst);
    } catch {
      // ignore copy errors to optional external brain dir
    }
  }
}

// P2-09: Pure Node PNG dimension decoder
function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 24) return { width: 0, height: 0 };
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

async function runExport() {
  console.log('🚀 Starting Phase 8 Export Deliverables...');

  // P2-01 / P2-02: Ensure local dev server is responding
  const serverProcess = await ensureServer(5173);

  try {
    // P2-06: Ensure distinct moment burst frames exist
    const allMomentsExist = [0, 1, 2, 3, 4, 5, 6].every(i =>
      fs.existsSync(path.join(PROJECT_DIR, `public/scenes/moment-${i}.jpg`))
    );
    if (!allMomentsExist) {
      console.log('Generating missing moment burst frames via generate-moments.mjs...');
      const { execSync } = await import('node:child_process');
      execSync('node scripts/generate-moments.mjs', { stdio: 'inherit' });
    }

    if (!fs.existsSync(EXPORT_SCREENS_DIR)) {
      fs.mkdirSync(EXPORT_SCREENS_DIR, { recursive: true });
    }

    const browser = await chromium.launch({ headless: true });

    // -------------------------------------------------------------
    // STEP 1: Export Hi-Fi Screens at 1170x2532 (Retina 3x)
    // -------------------------------------------------------------
    console.log('\n📸 [1/3] Capturing 6 High-Resolution Screens (1170x2532)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
    });

    for (const s of HI_FI_SCREENS) {
      const page = await mobileContext.newPage();
      console.log(`  -> Navigating to ${s.name} (${s.url})`);
      await page.goto(s.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // Wait for animations/images

      const targetProjectFile = path.join(EXPORT_SCREENS_DIR, `${s.name}.png`);
      const targetBrainFile = BRAIN_DIR ? path.join(BRAIN_DIR, `${s.name}.png`) : null;

      await page.screenshot({ path: targetProjectFile, type: 'png', animations: 'disabled' });
      if (targetBrainFile) safeCopyToBrain(targetProjectFile, targetBrainFile);

      // P2-09: Verify exact exported dimensions (1170x2532)
      const dims = getPngDimensions(targetProjectFile);
      if (dims.width !== 1170 || dims.height !== 2532) {
        throw new Error(`Screen ${s.name} exported with invalid dimensions ${dims.width}x${dims.height}, expected 1170x2532`);
      }

      const stats = fs.statSync(targetProjectFile);
      console.log(`     ✓ Saved ${s.name}.png (${(stats.size / 1024).toFixed(1)} KB, ${dims.width}x${dims.height})`);
      await page.close();
    }
    await mobileContext.close();

    // -------------------------------------------------------------
    // STEP 2: Export Hero Composite Image (2400x1350)
    // -------------------------------------------------------------
    console.log('\n🎨 [2/3] Capturing Hero Composite Presentation (2400x1350)...');
    const heroContext = await browser.newContext({
      viewport: { width: 2400, height: 1350 },
      deviceScaleFactor: 1,
    });

    const heroPage = await heroContext.newPage();
    await heroPage.goto('http://127.0.0.1:5173/?screen=hero-composite', { waitUntil: 'networkidle' });
    await heroPage.waitForTimeout(1500);

    const heroProjectFile = path.join(EXPORT_DIR, 'hero-composite.png');
    const heroBrainFile = BRAIN_DIR ? path.join(BRAIN_DIR, 'hero-composite.png') : null;
    await heroPage.screenshot({ path: heroProjectFile, type: 'png', animations: 'disabled' });
    if (heroBrainFile) safeCopyToBrain(heroProjectFile, heroBrainFile);

    const heroDims = getPngDimensions(heroProjectFile);
    if (heroDims.width !== 2400 || heroDims.height !== 1350) {
      throw new Error(`Hero composite exported with invalid dimensions ${heroDims.width}x${heroDims.height}, expected 2400x1350`);
    }

    const heroStats = fs.statSync(heroProjectFile);
    console.log(`     ✓ Saved hero-composite.png (${(heroStats.size / 1024).toFixed(1)} KB, ${heroDims.width}x${heroDims.height})`);
    await heroPage.close();
    await heroContext.close();

    // -------------------------------------------------------------
    // STEP 3: Render Case Study PDF from /?screen=case-study (P2-05)
    // -------------------------------------------------------------
    console.log('\n📄 [3/3] Generating Case Study PDF from /?screen=case-study...');
    const pdfContext = await browser.newContext({
      viewport: { width: 1280, height: 1600 },
      deviceScaleFactor: 2,
    });

    const pdfPage = await pdfContext.newPage();
    await pdfPage.goto('http://127.0.0.1:5173/?screen=case-study', { waitUntil: 'networkidle' });
    await pdfPage.waitForTimeout(2000);

    const pdfProjectFile = path.join(EXPORT_DIR, 'case-study.pdf');
    const pdfBrainFile = BRAIN_DIR ? path.join(BRAIN_DIR, 'case-study.pdf') : null;

    await pdfPage.pdf({
      path: pdfProjectFile,
      format: 'A4',
      landscape: false,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '12mm',
        bottom: '12mm',
        left: '10mm',
        right: '10mm',
      },
    });
    if (pdfBrainFile) safeCopyToBrain(pdfProjectFile, pdfBrainFile);

    // Also take a full-page preview screenshot of the Case Study
    const csPreviewProjectFile = path.join(EXPORT_DIR, 'case-study-preview.png');
    const csPreviewBrainFile = BRAIN_DIR ? path.join(BRAIN_DIR, 'case-study-preview.png') : null;
    await pdfPage.screenshot({ path: csPreviewProjectFile, fullPage: true });
    if (csPreviewBrainFile) safeCopyToBrain(csPreviewProjectFile, csPreviewBrainFile);

    const pdfStats = fs.statSync(pdfProjectFile);
    console.log(`     ✓ Generated case-study.pdf (${(pdfStats.size / 1024).toFixed(1)} KB)`);
    console.log(`     ✓ Generated case-study-preview.png`);

    await pdfPage.close();
    await pdfContext.close();
    await browser.close();

    console.log('\n✨ All Phase 8 Export Deliverables generated and verified successfully!\n');
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
  process.exit(0);
}

runExport().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
