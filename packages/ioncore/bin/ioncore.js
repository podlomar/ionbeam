#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('ionbeam')
  .description('IonCore - Pure React SSR Framework')
  .version(packageJson.version);

program
  .command('build')
  .description('Build the application for production')
  .action(async () => {
    const { build } = await import('../dist/cli/build.js');
    await build();
  });

program
  .command('dev')
  .description('Start development server with watch mode')
  .action(async () => {
    const { dev } = await import('../dist/cli/dev.js');
    await dev();
  });

program
  .command('start')
  .description('Start production server')
  .action(async () => {
    const { start } = await import('../dist/cli/start.js');
    await start();
  });

program.parse();
