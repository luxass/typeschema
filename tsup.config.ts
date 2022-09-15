import { defineConfig } from 'tsup';

import { version } from './package.json';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts', 'src/config.ts', 'src/zod'],
  format: ['esm'],
  clean: true,
  splitting: true,
  dts: {
    entry: ['src/index.ts', 'src/config.ts'],
  },
  external: ['typescript'],
  define: {
    __VERSION__: `'${version}'`
  },
  outExtension() {
    return {
      js: '.js'
    };
  }
});
