import { defineConfig } from './src/config';

export default defineConfig({
/*   zod: {
    input: ['testing/*.ts'],
    // input: ['test.ts'],
    outputDir: '.out',
    tsconfig: 'tsconfig.json',
    jsdoc: {
      // include: 'typeschema',
      useTags: true
    }
  }, */
  json: {
    input: ['testing/*.ts'],
    outputDir: '.out',
    tsconfig: 'tsconfig.json',
    jsdoc: {
      // include: 'typeschema',
      useTags: true
    }
  }
});
