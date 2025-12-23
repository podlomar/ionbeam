import gulp from 'gulp';
import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import fs from 'node:fs/promises';
import { glob } from 'glob';

const buildServer = async () => {
  try {
    const bundle = await rollup({
      input: 'src/server.tsx',
      external: (id) => {
        // External all node_modules
        return !id.startsWith('.') && !id.startsWith('/');
      },
      plugins: [
        postcss({
          modules: {
            generateScopedName: '[local]-[hash:6]',
            localsConvention: 'camelCaseOnly',
          },
          extract: 'static/server.css',
          inject: false,
        }),
        nodeResolve({
          extensions: ['.ts', '.tsx'],
        }),
        typescript({
          tsconfig: 'tsconfig.json',
          declaration: false,
          sourceMap: true,
        }),
      ],
    });

    await bundle.write({
      dir: 'dist',
      entryFileNames: 'server.js',
      format: 'esm',
      sourcemap: true,
    });

    await bundle.close();
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

const buildClient = async () => {
  try {
    const clientFiles = await glob('src/**/client.ts');

    if (clientFiles.length === 0) {
      console.log('No client files found, skipping client bundle');
      return;
    }

    const bundle = await rollup({
      input: clientFiles,
      plugins: [
        postcss({
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
        typescript({
          tsconfig: 'tsconfig.json',
          declaration: false,
          declarationMap: false,
          sourceMap: true,
          outDir: 'dist/static',
          compilerOptions: {
            lib: ['ES2022', 'DOM'],
          },
        }),
      ],
    });

    const { output } = await bundle.write({
      dir: 'dist/static',
      entryFileNames: 'client-[hash:8].js',
      format: 'iife',
      sourcemap: true,
    });

    // Generate manifest file
    const manifest = {};
    for (const chunk of output) {
      if (chunk.type === 'chunk' && chunk.isEntry) {
        manifest['client.js'] = chunk.fileName;
      }
    }

    await fs.writeFile(
      'dist/static/manifest.json',
      JSON.stringify(manifest, null, 2)
    );

    await bundle.close();
  } catch (error) {
    console.error('Client build failed:', error);
    process.exit(1);
  }
}

const buildTs = gulp.series(
  buildServer,
  buildClient,
);

const watchTs = () => {
  return gulp.watch('src/**/*.{ts,tsx,css}', buildTs);
}

const copyStaticFiles = () => {
  return gulp.src('src/static/**/*', { encoding: false })
    .pipe(gulp.dest('dist/static'));
}

const watchStaticFiles = () => {
  return gulp.watch('src/static/**/*', copyStaticFiles);
}

const clean = () => {
  return fs.rm('dist', { recursive: true, force: true });
}

export const build = gulp.series(
  clean,
  buildTs,
  copyStaticFiles,
);

export const watch = gulp.series(
  build,
  gulp.parallel(
    watchTs,
    watchStaticFiles,
  )
);
