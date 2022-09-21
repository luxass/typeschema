import { defineConfig } from 'tsup';

import { version } from './package.json';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/esbuild-plugin.ts',
    'src/cli.ts',
    'src/config.ts',
    'src/zod/index.ts',
    'src/json/index.ts'
  ],
  format: ['esm'],
  clean: true,
  splitting: true,
  dts: {
    // We do this, because cli.d.ts will have duplicate lines of #!/bin/env node
    entry: [
      'src/index.ts',
      'src/esbuild-plugin.ts',
      'src/config.ts',
      'src/zod/index.ts',
      'src/json/index.ts'
    ]
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