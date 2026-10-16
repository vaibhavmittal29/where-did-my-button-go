import { spawn } from 'node:child_process';
import http from 'node:http';

export function checkServer(port = 5173) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(600, () => {
      req.destroy();
      resolve(false);
    });
  });
}

export async function ensureServer(port = 5173) {
  const isUp = await checkServer(port);
  if (isUp) {
    return null; // Already running, no need to manage process
  }

  console.log(`Starting Vite local server on port ${port}...`);
  const serverProcess = spawn('npx', ['vite', '--port', String(port)], {
    shell: true,
    stdio: 'ignore',
  });

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await checkServer(port)) {
      console.log(`✓ Vite local server ready on port ${port}`);
      return serverProcess;
    }
  }

  try {
    serverProcess.kill();
  } catch {}
  throw new Error(`Failed to connect to Vite server on port ${port} after 20 seconds`);
}
