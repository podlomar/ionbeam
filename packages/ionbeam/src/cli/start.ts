import { spawn } from 'node:child_process';
import path from 'node:path';

export async function start() {
  const serverPath = path.join(process.cwd(), 'dist/server.js');

  console.log('Starting production server...');

  const serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    serverProcess.kill();
    process.exit(0);
  });
}
