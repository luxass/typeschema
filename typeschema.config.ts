import { defineConfig } from './src/config';

export default defineConfig({
  // zod: {
  //   input: ['testing/*.ts'],
  //   // input: ['test.ts'],
  //   // input: ['testing/index.ts'],
  //   outputDir: '.out',
  //   tsconfig: 'tsconfig.json',
  //   jsdoc: {
  //     // include: 'typeschema',
  //     useTags: true
  //   }
  // },
  jsonschema: {
    input: ['testing/test2.ts'],
    outputDir: '.out',
    tsconfig: 'tsconfig.json',
    jsdoc: {
      // include: 'typeschema',
      useTags: true
    }
  }
});
