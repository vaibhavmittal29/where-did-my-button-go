import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const d4Path = path.resolve(__dirname, '../docs/D4-design-decisions.md');

const raw = fs.readFileSync(d4Path, 'utf8');
const body = raw.split(/^##?#?\s+(?:Moment Strip|Prototype Limitations)/m)[0];

const words = body
  .trim()
  .replace(/#+/g, '')
  .split(/\s+/)
  .filter(Boolean);

const count = words.length;
console.log(`D4 word count: ${count} words (Limit: <= 200 words)`);

if (count > 200) {
  console.error(`❌ Error: D4 exceeds 200 words (${count} > 200)!`);
  process.exit(1);
}

console.log('✔ D4 word count verified within <= 200 words limit.');
process.exit(0);
