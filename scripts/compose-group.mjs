import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function generateComposedGroupPhoto() {
  const browser = await chromium.launch();
  // Target dimensions matching phone frame aspect ratio (390 x 844 -> 780 x 1688)
  const W = 780;
  const H = 1688;
  const page = await browser.newPage({
    viewport: { width: W, height: H }
  });
  const candPath = path.resolve('public/scenes/cand-3.jpg');
  const targetPath = path.resolve('public/scenes/group-campus.jpg');

  if (!fs.existsSync(candPath)) {
    if (fs.existsSync(targetPath)) {
      console.log('✓ Group scene group-campus.jpg already exists; cand-3.jpg source is not required.');
      await browser.close();
      return;
    }
    throw new Error(`Missing source image ${candPath} to generate group scene.`);
  }

  const base64 = fs.readFileSync(candPath).toString('base64');

  // cand-3.jpg: 900x1164.
  // The 4 friends on the left are from X=0 to X=730.
  // We want to scale cand-3 so that X=0 to X=730 fits nicely in width 780.
  // Scale factor: 780 / 720 ≈ 1.08.
  // Rendered image width: 900 * 1.08 ≈ 972px.
  // Rendered image height: 1164 * 1.08 ≈ 1257px.
  // We want the friends' heads to be around Y=480 - 580 (below top header 140px in 390-pt space, i.e. 280px in 780-pt space).
  // So the top of the photo will start around Y=120px.
  // Above Y=120px, we extend the sky/tree background smoothly.
  // Below Y=1370px, we extend the stone step/ground smoothly.

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: ${W}px;
        height: ${H}px;
        overflow: hidden;
        background: #cedde8;
        position: relative;
      }
      /* Soft sky gradient at top */
      .sky-top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 380px;
        background: linear-gradient(to bottom, #bed2e2 0%, #d4e3ee 60%, #e2edf5 100%);
      }
      /* Extended trees layer */
      .trees-ext {
        position: absolute;
        top: 0;
        left: -50px;
        width: 900px;
        height: 450px;
        background: url('data:image/jpeg;base64,${base64}') top center / cover no-repeat;
        filter: blur(8px);
        opacity: 0.6;
        mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
        -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
      }
      /* Ground bottom extension */
      .ground-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 350px;
        background: #1e1e22;
      }
      /* The main sharp photo containing the 4 friends */
      .main-photo {
        position: absolute;
        top: 150px;
        left: 0px;
        width: 975px;
        height: 1261px;
        object-fit: cover;
      }
    </style>
  </head>
  <body>
    <div class="sky-top"></div>
    <div class="trees-ext"></div>
    <div class="ground-bottom"></div>
    <img class="main-photo" src="data:image/jpeg;base64,${base64}" />
  </body>
  </html>`;

  await page.setContent(html);
  await page.waitForTimeout(600);

  const dest = path.resolve('public/scenes/group-campus.jpg');
  await page.screenshot({ path: dest, clip: { x: 0, y: 0, width: W, height: H } });
  console.log('Saved seamless high-res 4-friend photo to:', dest);

  await browser.close();
}

generateComposedGroupPhoto().catch(console.error);
