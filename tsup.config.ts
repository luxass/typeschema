import { defineConfig } from 'tsup';

import { version } from './package.json';

const workers = ['src/workers/json-schema-worker.ts', 'src/workers/zod-schema-worker.ts'];
const entry = ['src/cli.ts', 'src/index.ts', 'src/config.ts', 'src/esbuild-plugin.ts'];

const dtsEntry = entry.concat(workers).filter((file) => file !== 'src/cli.ts');

export default defineConfig({
  entry: [...entry, ...workers],
  format: ['esm'],
  clean: true,
  dts: {
    // We do this, because cli.d.ts will have duplicate lines of #!/bin/env node
    // Should probably report this - will need to find where it's coming from.
    entry: dtsEntry
  },
  external: ['typescript'],
  define: {
    __VERSION__: `'${version}'`
  }
});
