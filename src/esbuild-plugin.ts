/**
 * This plugin is used by ESBUILD to execute typeschema on the fly.
 */
import { Plugin } from 'esbuild';

import { createTypeSchema } from '.';
import { log } from './log';
import { TypeSchemaConfig } from './types';

const TypeSchemaPlugin = ({ json, zod }: TypeSchemaConfig): Plugin => ({
  name: 'typeschema',
  setup(build) {
    log('esbuild', 'Setting up typeschema plugin');
    createTypeSchema({ json, zod });
  }
});

export default TypeSchemaPlugin;
