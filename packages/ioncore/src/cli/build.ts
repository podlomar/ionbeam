import { Builder } from '../build/index.js';
import path from 'node:path';

export async function build() {
  const rootDir = process.cwd();
  const outDir = path.join(rootDir, 'dist');

  console.log('Building application...');

  const builder = new Builder({ rootDir, outDir });

  try {
    await builder.build();
    console.log('✓ Build completed successfully!');
  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}
