/**
 * This plugin is used by ESBUILD to execute typeschema on the fly.
 */
import { Plugin } from 'esbuild';

import { createTypeSchema } from '.';
import { info } from './log';
import { TypeSchemaConfig } from './types';

const TypeSchemaPlugin = ({ json, zod }: TypeSchemaConfig): Plugin => ({
  name: 'typeschema',
  setup(build) {
    info('esbuild', 'Setting up typeschema plugin');
    createTypeSchema({ json, zod });
  }
});

export default TypeSchemaPlugin;
