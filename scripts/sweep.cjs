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
  'saved to gallery',
  'wcag accessible',
  'wcag aa compliant',
  'wcag aaa compliant',
  'wcag certified',
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
  'tap jitter eliminated',
  'tap jitter',
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const FORBIDDEN_REGEXES = FORBIDDEN_CLAIMS.map((term) => ({
  raw: term,
  regex: new RegExp(escapeRegex(term), 'i'),
}));

function scanText(content, filePath) {
  const lines = content.split('\n');
  const hits = [];

  lines.forEach((line, idx) => {
    if (line.includes('sweep-ignore')) return;
    for (const claim of FORBIDDEN_REGEXES) {
      if (claim.regex.test(line)) {
        hits.push({ file: filePath, line: idx + 1, term: claim.raw, snippet: line.trim() });
      }
    }
  });

  return hits;
}

function scanFile(filePath) {
  // Exclude historical archive
  if (filePath.includes('docs' + path.sep + 'history') || filePath.includes('docs/history')) return [];
  // Exclude sweep.cjs itself
  if (path.basename(filePath) === 'sweep.cjs') return [];
  const content = fs.readFileSync(filePath, 'utf8');
  return scanText(content, filePath);
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'history' && file !== 'node_modules' && file !== 'dist' && file !== '.git' && file !== 'export') {
        results = results.concat(walkDir(fullPath));
      }
    } else {
      if (
        fullPath.endsWith('.ts') ||
        fullPath.endsWith('.tsx') ||
        fullPath.endsWith('.md') ||
        fullPath.endsWith('.html') ||
        fullPath.endsWith('.cjs') ||
        fullPath.endsWith('.mjs') ||
        fullPath.endsWith('.json')
      ) {
        if (path.basename(fullPath) !== 'sweep.cjs') {
          results.push(fullPath);
        }
      }
    }
  });
  return results;
}

// Built-in Unit Test Fixtures verifying case-insensitivity and true negatives
function runFixtures() {
  const testCases = [
    { text: 'Uses ZERO CAMERA BLUR to capture', expectedHits: 1 },
    { text: 'Produces the sharpest output', expectedHits: 1 },
    { text: '100% compliant with standards', expectedHits: 1 },
    { text: 'Tap Jitter Eliminated in test', expectedHits: 2 }, // matches tap jitter eliminated & tap jitter
    { text: 'Steadiness-gated capture with suggested frame (illustrative)', expectedHits: 0 },
    { text: 'Touch target size satisfies >= 44x44px standards', expectedHits: 0 },
  ];

  for (const tc of testCases) {
    const hits = scanText(tc.text, 'fixture-virtual');
    if (hits.length !== tc.expectedHits) {
      throw new Error(`Fixture test failure on "${tc.text}": expected ${tc.expectedHits} hits, got ${hits.length}`);
    }
  }
  return true;
}

runFixtures();

const SCAN_DIRS = ['src', 'docs', 'scripts'];
const SCAN_FILES = ['README.md', 'index.html', 'package.json'];

const filesToScan = [...SCAN_FILES.map((f) => path.resolve(f))];
for (const dir of SCAN_DIRS) {
  filesToScan.push(...walkDir(path.resolve(dir)));
}

// Deduplicate files
const uniqueFiles = Array.from(new Set(filesToScan)).filter((f) => fs.existsSync(f));

let totalHits = 0;
console.log(`Scanning ${uniqueFiles.length} files for forbidden/unsupported claims (case-insensitive with unit fixtures)...`);
for (const file of uniqueFiles) {
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
