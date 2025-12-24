import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import fs from 'node:fs/promises';
import { glob } from 'glob';
import crypto from 'node:crypto';
import path from 'node:path';

interface BuildOptions {
  rootDir: string;
  outDir: string;
}

export class Builder {
  private cssFileName: string | null = null;
  private options: BuildOptions;

  public constructor(options: BuildOptions) {
    this.options = options;
  }

  public async buildServer() {
    const { rootDir, outDir } = this.options;

    try {
      const bundle = await rollup({
        input: path.join(rootDir, 'src/server.tsx'),
        external: (id) => {
          // External all node_modules
          return !id.startsWith('.') && !id.startsWith('/');
        },
        plugins: [
          // @ts-expect-error --- IGNORE ---
          postcss({
            modules: {
              generateScopedName: '[local]-[hash:6]',
              localsConvention: 'camelCaseOnly',
            },
            extract: true,
            inject: false,
          }),
          // Custom plugin to hash and track CSS file
          {
            name: 'css-hash',
            generateBundle: (_options, bundle) => {
              // Find the CSS file in the bundle
              for (const [fileName, asset] of Object.entries(bundle)) {
                if (fileName.endsWith('.css') && asset.type === 'asset') {
                  // Generate hash from CSS content
                  const hash = crypto
                    .createHash('sha256')
                    .update(asset.source)
                    .digest('hex')
                    .substring(0, 8);

                  // Create new filename with hash
                  const newFileName = `static/server-${hash}.css`;
                  this.cssFileName = `server-${hash}.css`;

                  // Update the asset's fileName
                  asset.fileName = newFileName;
                }
              }
            },
          },
          nodeResolve({
            extensions: ['.ts', '.tsx'],
          }),
          // @ts-expect-error --- IGNORE ---
          typescript({
            tsconfig: path.join(rootDir, 'tsconfig.json'),
            declaration: false,
            sourceMap: true,
          }),
        ],
      });

      await bundle.write({
        dir: outDir,
        entryFileNames: 'server.js',
        format: 'esm',
        sourcemap: true,
      });

      await bundle.close();
    } catch (error) {
      console.error('Server build failed:', error);
      throw error;
    }
  }

  async buildClient() {
    const { rootDir, outDir } = this.options;

    try {
      const clientFiles = await glob('src/**/client.ts', { cwd: rootDir, absolute: true });

      if (clientFiles.length === 0) {
        console.log('No client files found, skipping client bundle');
        return;
      }

      const bundle = await rollup({
        input: clientFiles,
        plugins: [
          postcss.default({
            modules: {
              generateScopedName: '[local]-[hash:8]',
              localsConvention: 'camelCaseOnly',
            },
            inject: true,
          }),
          nodeResolve({
            extensions: ['.ts', '.tsx'],
            browser: true,
          }),
          typescript.default({
            tsconfig: path.join(rootDir, 'tsconfig.json'),
            declaration: false,
            declarationMap: false,
            sourceMap: true,
            outDir: path.join(outDir, 'static'),
            compilerOptions: {
              lib: ['ES2022', 'DOM'],
            },
          }),
        ],
      });

      const { output } = await bundle.write({
        dir: path.join(outDir, 'static'),
        entryFileNames: 'client-[hash:8].js',
        format: 'iife',
        sourcemap: true,
      });

      // Generate manifest file
      const manifest: Record<string, string> = {};

      // Add client JS to manifest
      for (const chunk of output) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          manifest['client.js'] = chunk.fileName;
        }
      }

      // Add CSS filename from server build to manifest
      if (this.cssFileName) {
        manifest['server.css'] = this.cssFileName;
      }

      await fs.writeFile(
        path.join(outDir, 'static/manifest.json'),
        JSON.stringify(manifest, null, 2)
      );

      await bundle.close();
    } catch (error) {
      console.error('Client build failed:', error);
      throw error;
    }
  }

  async copyStaticFiles() {
    const { rootDir, outDir } = this.options;
    const staticDir = path.join(rootDir, 'src/static');
    const targetDir = path.join(outDir, 'static');

    try {
      await fs.mkdir(targetDir, { recursive: true });
      const files = await glob('**/*', { cwd: staticDir, nodir: true });

      for (const file of files) {
        const srcFile = path.join(staticDir, file);
        const destFile = path.join(targetDir, file);
        await fs.mkdir(path.dirname(destFile), { recursive: true });
        await fs.copyFile(srcFile, destFile);
      }
    } catch (error) {
      // Static directory might not exist, that's okay
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async clean() {
    const { outDir } = this.options;
    await fs.rm(outDir, { recursive: true, force: true });
  }

  async build() {
    await this.clean();
    await this.buildServer();
    await this.buildClient();
    await this.copyStaticFiles();
  }
}
