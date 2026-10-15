import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const scenesDir = path.join(projectRoot, 'public/scenes');
const baseImgPath = path.join(scenesDir, 'portrait-subject.jpg');

async function generateMoments() {
  console.log('Generating 7 distinct, coherent moment frames from portrait-subject.jpg...');

  if (!fs.existsSync(baseImgPath)) {
    throw new Error(`Base image not found at ${baseImgPath}`);
  }

  const base64Data = fs.readFileSync(baseImgPath).toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64Data}`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });

  // Variations for frames 0..6 (subtle motion, zoom, and framing across 3 seconds)
  const variations = [
    { index: 0, scale: 1.01, dx: -14, dy: 6, brightness: 0.98, time: '-1.5s' },
    { index: 1, scale: 1.02, dx: -9, dy: 4, brightness: 0.99, time: '-1.0s' },
    { index: 2, scale: 1.03, dx: -4, dy: 2, brightness: 1.00, time: '-0.5s' },
    { index: 3, scale: 1.045, dx: 0, dy: 0, brightness: 1.02, time: '0.0s (Best)' }, // Optimal sharp focus moment
    { index: 4, scale: 1.035, dx: 5, dy: -2, brightness: 1.00, time: '+0.5s' },
    { index: 5, scale: 1.02, dx: 10, dy: -4, brightness: 0.99, time: '+1.0s' },
    { index: 6, scale: 1.01, dx: 15, dy: -6, brightness: 0.98, time: '+1.5s' },
  ];

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <canvas id="c"></canvas>
      </body>
    </html>
  `);

  for (const v of variations) {
    const dest = path.join(scenesDir, `moment-${v.index}.jpg`);
    await page.evaluate(async ({ dataUri, scale, dx, dy, brightness }) => {
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUri;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      // Apply subtle filter
      ctx.filter = `brightness(${brightness})`;
      // Center zoom and slight pan
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2 + dx, -canvas.height / 2 + dy);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }, { dataUri, scale: v.scale, dx: v.dx, dy: v.dy, brightness: v.brightness });

    const canvasElement = page.locator('#c');
    await canvasElement.screenshot({ path: dest, type: 'jpeg', quality: 90 });
    const size = fs.statSync(dest).size;
    console.log(`  ✓ Generated moment-${v.index}.jpg (${(size / 1024).toFixed(1)} KB, time offset ${v.time})`);
  }

  await browser.close();
  console.log('✅ All 7 moment frames successfully generated!');
}

generateMoments().catch(err => {
  console.error('Error generating moments:', err);
  process.exit(1);
});
