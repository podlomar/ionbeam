import gulp from 'gulp';
import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import fs from 'node:fs/promises';

const buildTs = async () => {
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
            generateScopedName: '[local]-[hash:8]',
            localsConvention: 'camelCaseOnly',
          },
          extract: 'server.css',
          inject: false,
        }),
        nodeResolve({
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
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

const watchTs = () => {
  return gulp.watch('src/**/*.{ts,tsx}', buildTs);
}

const copyStyles = () => {
  return gulp.src(['dist/server.css'], { allowEmpty: true })
    .pipe(gulp.dest('dist/static'));
}

const copyStaticFiles = () => {
  return gulp.src('src/static/**/*', { encoding: false })
    .pipe(gulp.dest('dist/static'));
}

const watchStyles = () => {
  return gulp.watch('src/**/*.css', gulp.series(buildTs, copyStyles));
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
  copyStyles,
);

export const watch = gulp.series(
  build,
  gulp.parallel(
    watchTs,
    watchStaticFiles,
    watchStyles
  )
);
