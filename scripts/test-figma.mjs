import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert';

console.log('🧪 Running Figma Plugin Static Verification Suite...');

const pluginDir = path.resolve('scripts/figma-plugin');
const manifestPath = path.join(pluginDir, 'manifest.json');
const codePath = path.join(pluginDir, 'code.js');
const uiPath = path.join(pluginDir, 'ui.html');

// 1. Check file existence
assert(fs.existsSync(manifestPath), 'manifest.json must exist');
assert(fs.existsSync(codePath), 'code.js must exist');
assert(fs.existsSync(uiPath), 'ui.html must exist');
console.log('  ✓ Files exist');

// 2. Syntax check code.js using Node parser
try {
  execFileSync(process.execPath, ['--check', codePath], { stdio: 'pipe' });
  console.log('  ✓ code.js passed Node.js JavaScript syntax check');
} catch (err) {
  console.error('  ❌ Syntax error in code.js:', err.stderr?.toString() || err.message);
  process.exit(1);
}

// 3. Manifest validation
const manifestRaw = fs.readFileSync(manifestPath, 'utf8');
let manifest;
try {
  manifest = JSON.parse(manifestRaw);
  assert(manifest.name, 'manifest must have name');
  assert(manifest.id, 'manifest must have id');
  assert(manifest.main === 'code.js', 'manifest main must be code.js');
  assert(manifest.ui === 'ui.html', 'manifest ui must be ui.html');
  assert(Array.isArray(manifest.editorType) && manifest.editorType.includes('figma'), 'editorType must include figma');
  console.log('  ✓ manifest.json is valid');
} catch (err) {
  console.error('  ❌ Invalid manifest.json:', err.message);
  process.exit(1);
}

// 4. Check for timeout unit in code.js (P1-04 invariant: timeout in ms, not fractional seconds)
const codeContent = fs.readFileSync(codePath, 'utf8');
assert(!codeContent.includes('timeout: 0.8'), 'code.js must NOT contain fractional timeout: 0.8');
assert(codeContent.includes('timeout: 800'), 'code.js must contain timeout: 800 (milliseconds for Figma API)');
console.log('  ✓ code.js uses correct millisecond timeout (timeout: 800)');

// 5. Check UI file integrity
const uiContent = fs.readFileSync(uiPath, 'utf8');
assert(uiContent.includes('BUILD_ALL'), 'ui.html must dispatch BUILD_ALL');
assert(uiContent.includes('BUILD_COMPLETE'), 'ui.html must handle BUILD_COMPLETE');
assert(uiContent.includes('ERROR'), 'ui.html must handle ERROR');
console.log('  ✓ ui.html contains complete message protocol handlers');

// 6. Check MomentStrip master component and font fallback presence
assert(codeContent.includes('Component / MomentStrip'), 'code.js must generate MomentStrip master component');
assert(codeContent.includes('loadFontWithFallback'), 'code.js must implement font fallback loading hierarchy');
assert(codeContent.includes('cleanExistingStillNodes'), 'code.js must support idempotent cleanup via cleanExistingStillNodes');
console.log('  ✓ code.js contains MomentStrip, font fallback hierarchy, and idempotent tagging');

console.log('🎉 Figma plugin static verification PASSED!\n');
