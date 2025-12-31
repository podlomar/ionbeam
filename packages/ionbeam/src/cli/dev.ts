import { Builder } from '../build/index.js';
import path from 'node:path';
import { watch } from 'chokidar';
import { spawn } from 'node:child_process';

let serverProcess: ReturnType<typeof spawn> | null = null;

function startServer() {
  if (serverProcess) {
    serverProcess.kill();
  }

  const serverPath = path.join(process.cwd(), 'dist/server.js');
  serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  });
}

export async function dev() {
  const rootDir = process.cwd();
  const outDir = path.join(rootDir, 'dist');

  console.log('Starting development server...');

  const builder = new Builder({ rootDir, outDir });

  // Initial build
  try {
    await builder.build();
    console.log('✓ Initial build completed!');
    startServer();
  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }

  // Watch for changes
  const srcDir = path.join(rootDir, 'src');
  const watcher = watch(srcDir, {
    ignoreInitial: true,
    persistent: true,
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100,
    },
  });

  const rebuild = async (filePath: string) => {
    console.log(`\nFile changed: ${filePath}`);
    console.log('Rebuilding...');

    try {
      await builder.build();
      console.log('✓ Rebuild completed!');
      startServer();
    } catch (error) {
      console.error('✗ Rebuild failed:', error);
    }
  };

  watcher.on('change', rebuild);
  watcher.on('add', rebuild);

  // Handle process termination
  process.on('SIGINT', () => {
    if (serverProcess) {
      serverProcess.kill();
    }
    watcher.close();
    process.exit(0);
  });

  console.log('\n👀 Watching for changes...\n');

  // Keep the function running indefinitely
  await new Promise(() => {});
}
