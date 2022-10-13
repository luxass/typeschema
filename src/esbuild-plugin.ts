/**
 * This plugin is used by ESBUILD to execute typeschema on the fly.
 */
import { Plugin } from 'esbuild';

import { createTypeSchema } from '.';
import { info } from './log';
import { TypeSchemaConfig } from './types';
import { convertInputFilesToRegex } from './utils';

const TypeSchemaPlugin = ({ jsonschema, zod }: TypeSchemaConfig): Plugin => ({
  name: 'typeschema',
  async setup(build) {
    info('esbuild', 'Setting up typeschema plugin');
    info('GL', await convertInputFilesToRegex(jsonschema!.input));
    // Build the regex for every input file
    /* build.onLoad({ filter: /\/ }, async (args) => {
      let text = await fs.promises.readFile(args.path, 'utf8')
      return {
        contents: JSON.stringify(text.split(/\s+/)),
        loader: 'json',
      }
    }) */
    // await createTypeSchema({ jsonschema, zod });
  }
});

export default TypeSchemaPlugin;
