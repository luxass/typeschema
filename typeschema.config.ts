import { defineConfig } from './src/config';
import { MyMJSPlugin } from './test-plugins/my-mjs-plugin.mjs';
import { MyTypeScriptPlugin } from './test-plugins/my-typescript-plugin';

export default defineConfig({
  plugins: [MyTypeScriptPlugin, MyMJSPlugin],
  tsconfig: 'tsconfig.json',
  jsdoc: {
    // include: 'typeschema',
    useTags: true
  },
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
  zod: {
    input: ['testing/test2.ts'],
    outputDir: '.out'
  },
  jsonschema: {
    input: ['testing/test2.ts'],
    outputDir: '.out'
  }
});
