const fs = require('fs');
const path = require('path');

// Unverified / fabricated claims that must not appear in documentation or source code
const FORBIDDEN_CLAIMS = [
  '2.2°',
  '3.8°',
  '1.2°/s',
  '90 frames',
  '180 years',
  'zero tap tremor',
  'sharpest',
  'production-ready',
  'production-grade',
  'zero-dependency',
  'Saved to gallery',
  'WCAG Accessible',
  'WCAG AA compliant',
  'WCAG AAA compliant',
  'WCAG certified',
  '100% compliant',
  '100% coverage',
  '100% accessible',
  '40% faster',
  '43% less tremor',
  '43% reduction',
  '215 ms',
  '215ms',
  'fully verified',
  'real camera buffer',
  'sharpest frame algorithm',
  'highest sharpness index',
  'zero camera blur',
  'Zero Camera Blur',
  'ZERO CAMERA BLUR',
  'Tap Jitter Eliminated',
  'Tap Jitter',
  'tap jitter',
];

const SCAN_DIRS = ['src', 'docs'];
const SCAN_FILES = ['README.md', 'index.html'];

function scanFile(filePath) {
  // Exclude historical archive
  if (filePath.includes('docs' + path.sep + 'history')) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const hits = [];

  lines.forEach((line, idx) => {
    for (const term of FORBIDDEN_CLAIMS) {
      if (line.includes(term)) {
        hits.push({ file: filePath, line: idx + 1, term, snippet: line.trim() });
      }
    }
  });

  return hits;
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'history' && file !== 'node_modules') {
        results = results.concat(walkDir(fullPath));
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.md') || fullPath.endsWith('.html')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const filesToScan = [...SCAN_FILES.map(f => path.resolve(f))];
for (const dir of SCAN_DIRS) {
  filesToScan.push(...walkDir(path.resolve(dir)));
}

let totalHits = 0;
console.log(`Scanning ${filesToScan.length} files for forbidden/unsupported claims...`);
for (const file of filesToScan) {
  const hits = scanFile(file);
  if (hits.length > 0) {
    totalHits += hits.length;
    for (const h of hits) {
      console.log(`[HIT] ${path.relative(process.cwd(), h.file)}:${h.line} -> "${h.term}" in: ${h.snippet.slice(0, 100)}`);
    }
  }
}

if (totalHits > 0) {
  console.log(`\n❌ Found ${totalHits} occurrences of forbidden claims.`);
  process.exit(1);
} else {
  console.log('\n✔ 0 forbidden claims found! Repository documentation and source code are clean and truthful.');
  process.exit(0);
}
