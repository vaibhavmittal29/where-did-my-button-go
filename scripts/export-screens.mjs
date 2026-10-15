import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const BRAIN_DIR = 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92';
const PROJECT_DIR = 'C:/Programming/Projects of antigravity/project_7_uiux_vinnovateit_switchthebutton';
const EXPORT_SCREENS_DIR = path.join(PROJECT_DIR, 'export/screens');
const EXPORT_DIR = path.join(PROJECT_DIR, 'export');

// Hi-Fi Screens to capture at 1170x2532 (390x844 @ 3x)
const HI_FI_SCREENS = [
  { name: 'screen-01-onboarding', url: 'http://localhost:5173/?screen=onboarding' },
  { name: 'screen-02-idle', url: 'http://localhost:5173/?screen=idle' },
  { name: 'screen-03-locking', url: 'http://localhost:5173/?screen=locking&progress=0.6' },
  { name: 'screen-03-locking-annotated', url: 'http://localhost:5173/?screen=locking&progress=0.6&annotate=1' },
  { name: 'screen-04-moments', url: 'http://localhost:5173/?screen=moments&selected=3' },
  { name: 'screen-05-group', url: 'http://localhost:5173/?screen=group&ready=3' },
];

async function runExport() {
  console.log('🚀 Starting Phase 8 Export Deliverables...');

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
    const targetBrainFile = path.join(BRAIN_DIR, `${s.name}.png`);

    await page.screenshot({ path: targetProjectFile, type: 'png' });
    fs.copyFileSync(targetProjectFile, targetBrainFile);

    const stats = fs.statSync(targetProjectFile);
    console.log(`     ✓ Saved ${s.name}.png (${(stats.size / 1024).toFixed(1)} KB)`);
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
  await heroPage.goto('http://localhost:5173/?screen=hero-composite', { waitUntil: 'networkidle' });
  await heroPage.waitForTimeout(1500);

  const heroProjectFile = path.join(EXPORT_DIR, 'hero-composite.png');
  const heroBrainFile = path.join(BRAIN_DIR, 'hero-composite.png');
  await heroPage.screenshot({ path: heroProjectFile, type: 'png' });
  fs.copyFileSync(heroProjectFile, heroBrainFile);

  const heroStats = fs.statSync(heroProjectFile);
  console.log(`     ✓ Saved hero-composite.png (${(heroStats.size / 1024).toFixed(1)} KB)`);
  await heroPage.close();
  await heroContext.close();

  // -------------------------------------------------------------
  // STEP 3: Render Case Study PDF from /?screen=case-study
  // -------------------------------------------------------------
  console.log('\n📄 [3/3] Generating Case Study PDF from /?screen=case-study...');
  const pdfContext = await browser.newContext({
    viewport: { width: 1280, height: 1600 },
    deviceScaleFactor: 2,
  });

  const pdfPage = await pdfContext.newPage();
  await pdfPage.goto('http://localhost:5173/?screen=case-study', { waitUntil: 'networkidle' });
  await pdfPage.waitForTimeout(2000);

  const pdfProjectFile = path.join(EXPORT_DIR, 'case-study.pdf');
  const pdfBrainFile = path.join(BRAIN_DIR, 'case-study.pdf');

  await pdfPage.pdf({
    path: pdfProjectFile,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      bottom: '16mm',
      left: '14mm',
      right: '14mm',
    },
  });
  fs.copyFileSync(pdfProjectFile, pdfBrainFile);

  // Also take a full-page preview screenshot of the Case Study
  const csPreviewProjectFile = path.join(EXPORT_DIR, 'case-study-preview.png');
  const csPreviewBrainFile = path.join(BRAIN_DIR, 'case-study-preview.png');
  await pdfPage.screenshot({ path: csPreviewProjectFile, fullPage: true });
  fs.copyFileSync(csPreviewProjectFile, csPreviewBrainFile);

  const pdfStats = fs.statSync(pdfProjectFile);
  console.log(`     ✓ Generated case-study.pdf (${(pdfStats.size / 1024).toFixed(1)} KB)`);
  console.log(`     ✓ Generated case-study-preview.png`);

  await pdfPage.close();
  await pdfContext.close();
  await browser.close();

  console.log('\n✨ All Phase 8 Export Deliverables generated successfully!\n');
}

runExport().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
