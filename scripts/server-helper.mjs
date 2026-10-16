import { spawn, execSync } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function checkServer(port = 5173) {
  return new Promise((resolve) => {
    // Try 127.0.0.1 explicitly to avoid IPv6 localhost resolution mismatch on Windows
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

export function killProcessTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
    } else {
      try {
        execSync(`pkill -P ${pid}`, { stdio: 'ignore' });
      } catch {}
      try {
        process.kill(pid, 'SIGKILL');
      } catch {}
    }
  } catch {}
}

export async function ensureServer(port = 5173) {
  const isUp = await checkServer(port);
  if (isUp) {
    return null; // Already running, no need to manage process
  }

  console.log(`Starting Vite local server on port ${port}...`);
  const viteBin = path.resolve(__dirname, '../node_modules/vite/bin/vite.js');
  const serverProcess = spawn(process.execPath, [viteBin, '--port', String(port), '--host', '127.0.0.1'], {
    stdio: 'ignore',
  });
  if (typeof serverProcess.unref === 'function') {
    serverProcess.unref();
  }

  const wrappedProcess = {
    pid: serverProcess.pid,
    kill: () => killProcessTree(serverProcess.pid),
  };

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await checkServer(port)) {
      console.log(`✓ Vite local server ready on port ${port}`);
      return wrappedProcess;
    }
  }

  try {
    wrappedProcess.kill();
  } catch {}
  throw new Error(`Failed to connect to Vite server on port ${port} after 20 seconds`);
}
