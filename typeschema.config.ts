import { defineConfig } from './src/config';

export default defineConfig({
  zod: {
    input: ['src/types.ts'],
    outputDir: '.out',
    tsconfig: 'tsconfig.json'
  }
});
