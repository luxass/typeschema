import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ['esm'],
  clean: true,
  treeshake: true,
  outExtension(ctx) {
    return {
      js: ctx.format === 'esm' ? '.mjs' : '.cjs',
    }
  },
  dts: true
});
