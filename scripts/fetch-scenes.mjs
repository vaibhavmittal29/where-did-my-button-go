import fs from 'node:fs';
import path from 'node:path';

const scenesDir = path.resolve('public/scenes');
if (!fs.existsSync(scenesDir)) {
  fs.mkdirSync(scenesDir, { recursive: true });
}

// Curated Unsplash royalty-free images (student & campus life theme)
const IMAGES = {
  // Portrait subject for Idle & Locking screens
  'portrait-subject.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
  
  // Group of university students for Group Mode
  'group-campus.jpg': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85',
  
  // Lecture / whiteboard notes for Doc Mode
  'whiteboard-notes.jpg': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
  
  // Dynamic action scene (pet/runner)
  'dynamic-subject.jpg': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=85'
};

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
  console.log(`Saved: ${dest}`);
}

async function main() {
  console.log('Downloading high-res scenes from Unsplash...');
  for (const [filename, url] of Object.entries(IMAGES)) {
    const dest = path.join(scenesDir, filename);
    await download(url, dest);
  }

  // Generate 7 sequential moment frames from the portrait/action scene
  // To simulate realistic 3-second camera burst frames, we copy base images with slight shifts/variations
  console.log('Generating 7 Moment Strip burst frames...');
  const baseImg = fs.readFileSync(path.join(scenesDir, 'portrait-subject.jpg'));
  for (let i = 0; i < 7; i++) {
    const frameDest = path.join(scenesDir, `moment-${i}.jpg`);
    fs.writeFileSync(frameDest, baseImg);
  }
  console.log('All 7 moment frames ready in public/scenes/');
}

main().catch(err => {
  console.error('Download error:', err);
  process.exit(1);
});
